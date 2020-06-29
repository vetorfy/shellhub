package main

import (
	"context"
	"crypto/rsa"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/kelseyhightower/envconfig"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"github.com/mitchellh/mapstructure"
	"github.com/shellhub-io/shellhub/api/apicontext"
	"github.com/shellhub-io/shellhub/api/deviceadm"
	"github.com/shellhub-io/shellhub/api/firewall"
	"github.com/shellhub-io/shellhub/api/routes"
	"github.com/shellhub-io/shellhub/api/store/mongo"
	api "github.com/shellhub-io/shellhub/pkg/api/client"
	"github.com/shellhub-io/shellhub/pkg/models"
	mgo "go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type config struct {
	MongoHost string `envconfig:"mongo_host" default:"mongo"`
	MongoPort int    `envconfig:"mongo_port" default:"27017"`
}

var verifyKey *rsa.PublicKey

const (
	TenantIDHeader = "X-Tenant-ID"
)

func main() {
	e := echo.New()
	e.Use(middleware.Logger())

	var cfg config
	if err := envconfig.Process("api", &cfg); err != nil {
		panic(err.Error())
	}

	// Set client options
	clientOptions := options.Client().ApplyURI(fmt.Sprintf("mongodb://%s:%d", cfg.MongoHost, cfg.MongoPort))
	// Connect to MongoDB
	client, err := mgo.Connect(context.TODO(), clientOptions)
	if err != nil {
		panic(err)
	}

	err = client.Ping(context.TODO(), nil)
	if err != nil {
		panic(err)
	}

	if err := mongo.ApplyMigrations(client.Database("main")); err != nil {
		panic(err)
	}

	verifyBytes, err := ioutil.ReadFile(os.Getenv("PUBLIC_KEY"))
	if err != nil {
		panic(err)
	}

	verifyKey, err = jwt.ParseRSAPublicKeyFromPEM(verifyBytes)
	if err != nil {
		panic(err)
	}

	e.Use(func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			store := mongo.NewStore(client.Database("main"))
			ctx := apicontext.NewContext(store, c)

			return next(ctx)
		}
	})

	publicAPI := e.Group("/api")
	internalAPI := e.Group("/internal")

	publicAPI.POST(routes.AuthDeviceURL, apicontext.Handler(routes.AuthDevice))
	publicAPI.POST(routes.AuthDeviceURLV2, apicontext.Handler(routes.AuthDevice))
	publicAPI.POST(routes.AuthUserURL, apicontext.Handler(routes.AuthUser))
	publicAPI.POST(routes.AuthUserURLV2, apicontext.Handler(routes.AuthUser))

	publicAPI.GET(routes.GetDeviceListURL, apicontext.Handler(routes.GetDeviceList))
	publicAPI.GET(routes.GetDeviceURL, apicontext.Handler(routes.GetDevice))
	publicAPI.DELETE(routes.DeleteDeviceURL, apicontext.Handler(routes.DeleteDevice))
	publicAPI.PATCH(routes.RenameDeviceURL, apicontext.Handler(routes.RenameDevice))

	internalAPI.POST("/devices/:uid/offline", func(c echo.Context) error {
		ctx := c.Get("ctx").(context.Context)
		store := mongo.NewStore(ctx.Value("db").(*mgo.Database))
		svc := deviceadm.NewService(store)

		err := svc.UpdateDeviceStatus(ctx, models.UID(c.Param("uid")), false)
		if err != nil {
			return err
		}

		return c.JSON(http.StatusOK, nil)
	})

	internalAPI.GET("/auth", func(c echo.Context) error {
		token := c.Get("user").(*jwt.Token)
		rawClaims := token.Claims.(*jwt.MapClaims)

		switch claims := (*rawClaims)["claims"]; claims {
		case "user":
			var claims models.UserAuthClaims

			if err := DecodeMap(rawClaims, &claims); err != nil {
				return err
			}

			// Extract tenant from JWT
			c.Response().Header().Set(TenantIDHeader, claims.Tenant)

			return nil
		case "device":
			var claims models.DeviceAuthClaims

			if err := DecodeMap(rawClaims, &claims); err != nil {
				return err
			}

			// Extract device UID from JWT
			c.Response().Header().Set(api.DeviceUIDHeader, claims.UID)

			return nil
		}

		return echo.ErrUnauthorized
	}, middleware.JWTWithConfig(middleware.JWTConfig{
		Claims:        &jwt.MapClaims{},
		SigningKey:    verifyKey,
		SigningMethod: "RS256",
	}))

	publicAPI.GET("/stats", func(c echo.Context) error {
		ctx := c.Get("ctx").(context.Context)

		store := mongo.NewStore(ctx.Value("db").(*mgo.Database))
		stats, err := store.GetStats(ctx)
		if err != nil {
			return err
		}

		return c.JSON(http.StatusOK, stats)
	})

	publicAPI.GET(routes.GetSessionsURL, apicontext.Handler(routes.GetSessionList))
	publicAPI.GET(routes.GetSessionURL, apicontext.Handler(routes.GetSession))
	internalAPI.PATCH(routes.SetSessionAuthenticatedURL, apicontext.Handler(routes.SetSessionAuthenticated))
	internalAPI.GET(routes.CreateSessionURL, apicontext.Handler(routes.CreateSession))
	internalAPI.POST(routes.FinishSessionURL, apicontext.Handler(routes.FinishSession))

	internalAPI.GET("/lookup", func(c echo.Context) error {
		var query struct {
			Domain    string `query:"domain"`
			Name      string `query:"name"`
			Username  string `query:"username"`
			IPAddress string `query:"ip_address"`
		}

		if err := c.Bind(&query); err != nil {
			return err
		}

		ctx := c.Get("ctx").(context.Context)
		store := mongo.NewStore(ctx.Value("db").(*mgo.Database))
		svc := deviceadm.NewService(store)
		fw := firewall.NewService(store)

		device, err := svc.LookupDevice(ctx, query.Domain, query.Name)
		if err != nil {
			return nil
		}

		ok, err := fw.Evaluate(ctx, firewall.Request{
			Hostname:  query.Name,
			Namespace: query.Domain,
			Username:  query.Username,
			IPAddress: query.IPAddress,
		})
		if err != nil {
			return err
		}

		if !ok {
			return c.NoContent(http.StatusForbidden)
		}

		return c.JSON(http.StatusOK, device)
	})

	publicAPI.GET(routes.GetFirewallRuleListURL, apicontext.Handler(routes.GetFirewallRuleList))
	publicAPI.GET(routes.GetFirewallRuleURL, apicontext.Handler(routes.GetFirewallRule))
	publicAPI.POST(routes.CreateFirewallRuleURL, apicontext.Handler(routes.CreateFirewallRule))
	publicAPI.PUT(routes.UpdateFirewallRuleURL, apicontext.Handler(routes.UpdateFirewallRule))
	publicAPI.DELETE(routes.DeleteFirewallRuleURL, apicontext.Handler(routes.DeleteFirewallRule))

	e.Logger.Fatal(e.Start(":8080"))
}

func DecodeMap(input, output interface{}) error {
	config := &mapstructure.DecoderConfig{
		TagName:  "json",
		Metadata: nil,
		Result:   output,
	}

	decoder, err := mapstructure.NewDecoder(config)
	if err != nil {
		return err
	}

	return decoder.Decode(input)
}

package routes

import (
	"net/http"

	"github.com/labstack/echo"
	"github.com/shellhub-io/shellhub/api/apicontext"
	"github.com/shellhub-io/shellhub/api/authsvc"
	"github.com/shellhub-io/shellhub/pkg/models"
)

const (
	AuthDeviceURL   = "/devices/auth"
	AuthDeviceURLV2 = "/auth/device"
	AuthUserURL     = "/login"
	AuthUserURLV2   = "/auth/user"
)

func AuthDevice(c apicontext.Context) error {
	var req models.DeviceAuthRequest

	if err := c.Bind(&req); err != nil {
		return err
	}

	svc := authsvc.NewService(c.Store(), nil, nil)

	res, err := svc.AuthDevice(c.Ctx(), &req)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, res)
}

func AuthUser(c apicontext.Context) error {
	var req models.UserAuthRequest

	if err := c.Bind(&req); err != nil {
		return err
	}

	svc := authsvc.NewService(c.Store(), nil, nil)

	res, err := svc.AuthUser(c.Ctx(), req)
	if err != nil {
		return echo.ErrUnauthorized
	}

	return c.JSON(http.StatusOK, res)
}

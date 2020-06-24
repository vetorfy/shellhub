<!--template>
  <div>
    lalalallalal1
    <TestList aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa />
  </div>
</template>

<!--<script>
import TestList from '@/components/test/TestList.vue';

export default {
  name: 'Test',

  components: {
    TestList
  }
};
</script>-->

<!doctype html>
  <html>
    <head>
      <link rel="stylesheet" href="node_modules/xterm/css/xterm.css" />
      <script src="node_modules/xterm/lib/xterm.js"></script>
    </head>
    <body>
      <div id="terminal"></div>
      <script>
        var term = new Terminal();
        term.open(document.getElementById('terminal'));
        term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')
      </script>
    </body>
  </html>

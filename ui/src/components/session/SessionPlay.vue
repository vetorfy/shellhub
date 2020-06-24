<template>
  <fragment>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-icon
          v-on="on"
          @click="open()"
        >
          mdi-play-circle
        </v-icon>
      </template>
      <span>Terminal</span>
    </v-tooltip>
    <div
      id="terminal"
    />
  </fragment>
</template>

<script>

import { Terminal } from 'xterm';

export default {
  name: 'Terminal',

  data() {
    return {
      show: false,
    };
  },

  methods: {
    open() {
      this.xterm = new Terminal({
        cursorBlink: true,
        fontFamily: 'monospace',
      });
      this.xterm.open(document.getElementById('terminal'));
      this.xterm.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ');
    },
  },

};

</script>

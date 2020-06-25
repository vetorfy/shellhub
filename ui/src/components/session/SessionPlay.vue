<template>
  <fragment>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-icon
          v-on="on"
          @click="openPlay()"
        >
          mdi-play-circle
        </v-icon>
      </template>
      <span>Play</span>
    </v-tooltip>
    <v-dialog
      v-model="dialog"
      max-width="1024px"
    >
      <v-card>
        <v-toolbar
          dark
          color="primary"
        >
          <v-toolbar-title>Play</v-toolbar-title>
          <v-spacer />
        </v-toolbar>
        <div ref="playterminal" />
      </v-card>
    </v-dialog>
  </fragment>
</template>

<script>

import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

import 'xterm/css/xterm.css';

export default {
  name: 'SessionPlay',

  data() {
    return {
      username: '',
      passwd: '',
      valid: true,
      dialog: false,
      rules: {
        required: (value) => !!value || 'Required',
      },
    };
  },

  watch: {
    dialog(value) {
      if (!value) { //
        this.close();
      }
    },
  },

  methods: {
    openPlay() {
      this.dialog = !this.dialog;
      this.xterm = new Terminal({ // instantiate
        cursorBlink: true,
        fontFamily: 'monospace',
      });
      this.fitAddon = new FitAddon(); // load fit
      this.xterm.loadAddon(this.fitAddon); // adjust screen in container
      this.xterm.open(this.$refs.playterminal);
      if (this.xterm.element) { // check already existence
        this.xterm.reset();
      }
      this.connect();
    },

    connect() {
      this.$nextTick(() => this.fitAddon.fit());
      this.fitAddon.fit();
      this.xterm.focus();
      this.print();
    },

    close() {
      if (this.xterm) this.xterm.dispose();
    },

    print() {
      this.xterm.write('test');
      this.xterm.on('data', (data) => {
        this.xterm.write(data);
      });
    },
  },
};

</script>

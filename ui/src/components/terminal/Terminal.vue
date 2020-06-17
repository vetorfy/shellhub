<template>
  <div />
</template>

<script>

// eslint-disable-next-line import/no-unresolved
import { Terminal } from 'xterm';

export default {
  name: 'Terminal',

  mounted() {
    this.xterm = new Terminal({
      cursorBlink: true,
      fontFamily: 'monospace',
    });
  },

};

</script>

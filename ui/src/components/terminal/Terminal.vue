<template>
  <div />
</template>

<script>

import { Terminal } from '../../../node_modules/xterm';

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

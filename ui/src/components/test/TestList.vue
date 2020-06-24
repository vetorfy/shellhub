<template>
  <div class="app-container">
    <div class="filter-container">
      namespace:
      <el-input
        v-model="listQuery.pod_nspace"
        style="width: 200px;"
        class="filter-item"
        :disabled="true"
      />
      podname:
      <el-input
        v-model="listQuery.pod_name"
        style="width: 200px;"
        class="filter-item"
        :disabled="true"
      />
      pod_container:
      <el-select
        v-model="listQuery.pod_container"
        :placeholder="this.listQuery.pod_container"
        clearable
        style="width: 130px"
        class="filter-item"
        @change="connectPodTerminal()"
      >
        <el-option
          v-for="item in params.pod_containlist.split(',')"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
    </div>
    <span
      style="position: relative;
      top: 0px;
      background: #fff;
      padding: 0 10px; "
    />
    <div
      id="terminal"
      class="console"
    />
  </div>
</template>


<script>

import { Terminal } from 'xterm';

export default {
  name: 'Console',
  data() {
    return {
      term: null,
      terminalSocket: null,
      listQuery: {
        podnspace: undefined,
        podcluster: 1,
        podname: undefined,
        podcontainer: undefined,
      },
      params: '',
    };
  },
  created() {
  //获取传入的参数
    let urlparam = this.$route.query;
    this.params = urlparam;
    this.listQuery.podnspace = this.params.podnsname;
    this.listQuery.podcluster = this.params.podcluster;
    this.listQuery.podname = this.params.podname;
    this.listQuery.podcontainer = this.params.podcontainlist.split(',')[0];
  },
  mounted() {
    console.log('terminal is on ready');
    let terminalContainer = document.getElementById('terminal');
    this.term = new Terminal({cursorBlink: true, focus: true});
    this.term.open(terminalContainer);
    // open websocket
    let wsurl = 'ws://127.0.0.1:8000/api/kube/pod/ssh/' + this.params.podcluster + '/';
    + this.params.podnsname + '/' + this.params.pod_name + '/' + this.listQuery.podcontainer + '/';
    this.terminalSocket = new WebSocket(wsurl);
    this.terminalSocket.onopen = this.runRealTerminal;
    this.terminalSocket.onclose = this.closeRealTerminal;
    this.terminalSocket.onerror = this.errorRealTerminal;
    this.term.attach(this.terminalSocket);
    this.term.fit();
    this.term._initialized = true;
    window.addEventListener('resize',this.windowChange);

  },
  beforeDestroy() {
    this.terminalSocket.close();
    this.term.destroy();
  },
  methods: {
    runRealTerminal() {
      console.log('webSocket is finished');
    },
    errorRealTerminal() {
      console.log('error');
    },
    closeRealTerminal() {
      console.log('close');
    },
    windowChange(){
      let height = document.documentElement.clientHeight;
      let rows = height/18;
      this.term.fit();
      this.term.resize(this.term.cols,parseInt(rows));
      this.term.scrollToBottom();
    },
    connectPodTerminal(){
      let terminalContainer = document.getElementById('terminal');
      if ( terminalContainer.isConnected){
        console.log('is connnect');
        terminalContainer.innerHTML ='';
      }
      this.term = new Terminal({cursorBlink: true, focus: true});
      this.term.open(terminalContainer);
      // open websocket
      let wsurl = 'ws://127.0.0.1:8000/api/kube/pod/ssh/' + this.listQuery.pod_cluster + '/';
      + this.listQuery.podnspace + '/' + this.listQuery.podname + '/' + this.listQuery.podcontainer + '/';
      this.terminalSocket = new WebSocket(wsurl);
      this.terminalSocket.onopen = this.runRealTerminal;
      this.terminalSocket.onclose = this.closeRealTerminal;
      this.terminalSocket.onerror = this.errorRealTerminal;
      this.term.attach(this.terminalSocket);
      this.term.fit();
      window.addEventListener('resize',this.windowChange);
    }
  },

};

</script>
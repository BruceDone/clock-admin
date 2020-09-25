<template>
    <Card>
      <p slot="title">自动滚动 &nbsp;&nbsp;&nbsp;<i-switch size="large" v-model="enableScroll"></i-switch> </p>
      <div>
          <log-viewer :log="log"
                      :loading="isLoading"
                      :autoScroll="enableScroll"
                      style="font-size: medium;height: 70vh"
          />
      </div>
    </Card>
</template>

<script>
import config from '@/config'

export default {
  name: 'StatusIndex',
  data () {
    return {
      log: '',
      socket: '',
      isLoading: true,
      messages: [],
      text: '手动',
      enableScroll: true
    }
  },
  mounted () {
    // 初始化
    this.init()
  },
  methods: {
    init: function () {
      let cur = this
      if (typeof (WebSocket) === 'undefined') {
        alert('您的浏览器不支持socket')
      } else {
        // 实例化socket
        cur.socket = new WebSocket(cur.getWsAddr())
        // 监听socket连接
        cur.socket.onopen = cur.open
        // 监听socket错误信息
        cur.socket.onerror = cur.error
        // 监听socket消息
        cur.socket.onmessage = cur.receive
      }
    },
    open: function () {
      console.log('socket连接成功')
    },
    error: function () {
      this.$Message.error('连接错误')
    },
    receive: function (msg) {
      let message = msg.data
      message = this.getDate() + ' ' + message
      this.log = this.log + '\n' + message
      this.messages.push(message)
    },
    send: function (params) {
      this.socket.send(params)
    },
    close: function () {
      console.log('socket已经关闭')
    },
    getDate: function () {
      let today = new Date()
      let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
      let time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
      return date + ' ' + time
    },
    getWsAddr: function () {
      let host = ''
      let wsHost = process.env.NODE_ENV === 'development' ? config.wsHost.dev : config.wsHost.pro
      if (wsHost !== undefined && wsHost.length > 0) {
        host = wsHost
      }
      if (host === 'v1') {
        host = window.location.host + '/v1'
      }

      return 'ws://' + host + '/task/status'
    }
  },
  destroyed () {
    // 销毁监听
    this.socket.onclose = this.close
  }
}
</script>

<style scoped>

</style>

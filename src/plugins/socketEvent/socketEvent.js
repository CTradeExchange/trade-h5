// websocket消息事件
class SocketEvent {
    constructor () {
        this.ws = null
        this.$store = null
        this.$router = null
        this.requests = new Map()
    }

    // 初始化
    init (ws, $store, $router) {
        this.ws = ws
        this.$store = $store
        this.$router = $router
    }

    // 收取到消息
    onMessage (data) {
        this.$store.commit('_user/Update_newsMessage', data)
    }

    
    // 心跳机制
    initPing () {
        // const ws = this.ws
        // if (ws.readyState !== 1) return console.warn('消息websocket连接未准备好  readyState：', ws.readyState)
        // if (this.ping) clearInterval(this.ping)
        // this.ping = setInterval(() => {
        //     if (ws.readyState === 1) ws.send()
        // }, 30000)
    }
}

export default SocketEvent

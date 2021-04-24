import { guid, getDevice, getToken, priceFormat } from '@/utils/util'
import { QuoteSocket } from '@/plugins/socket/socket'
// websocket消息事件
class SocketEvent {
    constructor () {
        this.ws = null
        this.seq_id = 0
        this.timeOut = 60 * 1000
        this.timer = null
        this.$store = null
        this.requests = new Map()
        this.subscribedList = []
    }

    // 初始化
    init (ws, $store) {
        this.ws = ws
        this.$store = $store
    }

    // ws发送数据格式
    getParam (msgType, data = {}) {
        const token = getToken()
        const param = {
            head: {
                msgType,
                token,
                sendTime: Date.now(),
                lang: 'zh-CN',
            },
            device: getDevice(),
            seqId: this.seq_id,
            trace: guid(),
        }

        return param
    }

    // 发送消息
    send (cmd_id, data, timeOut) {
        if (this.ws.readyState !== 1) return console.warn('消息websocket连接未准备好  readyState：', this.ws.readyState)
        this.seq_id++
        const param = this.getParam(cmd_id, data)
        this.ws.send(JSON.stringify(param))

        if (!this.timer) {
            this.timer = window.setInterval(() => {
                const nowTime = new Date().getTime()
                this.requests.forEach((item, key, map) => {
                    // 请求超时
                    if (nowTime - item.sendTime > item.timeOut) {
                        item.reject({
                            errorType: 'TimeOut',
                            remark: `timeOut: seq_id-${item.request.seq_id}, cmd_id-${item.request.cmd_id}`
                        })
                        this.requests.delete(key)
                    }
                })
                if (this.requests.size === 0) {
                    window.clearInterval(this.timer)
                    this.timer = null
                }
            }, 500)
        }
        return new Promise((resolve, reject) => {
            this.requests.set(param.seq_id, {
                sendTime: Date.now(),
                timeOut: timeOut ?? this.timeOut,
                request: param,
                resolve,
                reject,
            })
        })
    }

    // 心跳机制
    initPing () {
        if (this.ws.readyState !== 1) return console.warn('消息websocket连接未准备好  readyState：', this.ws.readyState)
        let param = this.getParam('ping')
        this.ws.send(JSON.stringify(param))
        setInterval(() => {
            param = this.getParam('ping')
            this.ws.send(JSON.stringify(param))
        }, 30000)
    }

    // 收取到消息
    onMessage (data) {
        console.log('收到消息', data)
        const content = data.content
        this.$store.commit('_user/Update_userAccount', content)

        this.$store.dispatch('_trade/queryPositionPage').then(res => {
            if (res.check()) {
                const subscribList = res.data.map(el => el.symbolId)
                QuoteSocket.send_subscribe(subscribList)

                const positionList = res.data
                console.log(content.positionProfitLossMessages.length, positionList.length)
                if (content.positionProfitLossMessages.length > 0 && positionList.length > 0) {
                    positionList.forEach(p => {
                        content.positionProfitLossMessages.forEach(item => {
                            // console.log('更新价格', item.profitLoss)
                            if (Number(item.positionId) === Number(p.positionId)) {
                                p.profitLoss = priceFormat(item.profitLoss, item.digit)
                            }
                        })
                    })
                    this.$store.commit('_trade/Update_positionList', positionList)
                }
            }
        })

        // console.log('positionList', positionList)
    }
}

export default SocketEvent

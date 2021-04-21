import { tickFormat } from './socketUtil'
import { guid } from '@/utils/util'

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
    getParam (cmd_id, data) {
        const param = {
            cmd_id,
            data,
            seq_id: this.seq_id, // 发送端的索引编号，类型：uint32
            ext: guid(), // track 跟踪号，类型：string，谁请求，谁生成，回包的ext也不变，每次请求就要变化，最大长度64
        }
        return param
    }

    // 发送消息
    send (cmd_id, data, timeOut) {
        if (this.ws.readyState !== 1) return console.warn('行情websocket连接未准备好  readyState：', this.ws.readyState)
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

    // 订阅产品报价
    send_subscribe (productIds = []) {
        productIds = productIds.map(el => Number(el))
        this.subscribedList = productIds
        const trade_type = this.$store.state._base.tradeType
        const list = productIds.map(el => {
            return {
                symbol_id: el, // 产品ID ，类型：uint64
                trade_type, // 交易类型，类型：uint32，1：cfd，2：me
            }
        })
        this.send(14000, { symbol_list: list })
    }

    // 收取到消息
    onMessage (data) {
        this.requests.forEach((item, key) => {
            if (data.seq_id === key) {
                item.resolve(data)
            }
        })
        const cmdID = `cmd_id_${data.cmd_id}`
        if (typeof (this[cmdID]) === 'function') {
            this[cmdID](data)
        }
    }

    // 处理报价快照
    ['cmd_id_14001'] (data) {
        const list = data.data?.tick_list ?? []
        const $store = this.$store
        list.forEach(item => {
            tickFormat(item) // 格式化快照价格
            // $store.commit('_quote/Update_product', item) // 不需要处理产品属性
            $store.commit('_quote/Update_productTick', item)
        })
    }

    // 实时报价
    tick (p) {
        // p(1123,1,1232312,34545435345,6.23,6.23,6.24);(1124,2,1232314,34545435345,7.23,7.23,7.24)
        // 产品ID，报价序号，报价时间戳，当前价，第一档bid卖价，第一档ask买价
        const priceStr = p.split(';')[0].match(/\((.+)\)/)
        const $store = this.$store
        const price = priceStr[1] ?? ''
        const priceArr = price.split(',')
        $store.commit('_quote/Update_productTick', {
            symbolId: priceArr[0] * 1,
            trade_type: priceArr[1],
            tick_time: priceArr[3] * 1,
            price: priceArr[4],
            sell_price: priceArr[5],
            buy_price: priceArr[6],
        })
    }

    // 心跳机制
    initPing () {
        if (this.ws.readyState !== 1) return console.warn('消息websocket连接未准备好  readyState：', this.ws.readyState)
        const param = this.getParam(14008, {})
        setInterval(() => {
            this.ws.send(JSON.stringify(param))
            console.log('quote heart', param)
        }, 10000)
    }
}

export default SocketEvent

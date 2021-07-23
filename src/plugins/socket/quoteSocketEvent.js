import { tickFormat, tickToObj } from './socketUtil'
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
        this.preSetTime = 1 // 上一次保存价格的时间
        this.newPrice = []
        this.newPriceTimer = null
    }

    // 初始化
    init (ws, $store) {
        this.ws = ws
        this.$store = $store
    }

    // ws发送数据格式
    getParam (cmd_id, data) {
        this.seq_id++
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
    send_subscribe (productIds = [], quote_type = 1, depth_level = 1) {
        this.subscribedList = [...new Set(productIds)]
        const trade_type = this.$store.state._base.tradeType

        const list = productIds.map(el => {
            return {
                symbol_id: el, // 产品ID ，类型：uint64
                trade_type, // 交易类型，类型：uint32，1：cfd，2：me
                quote_type, // 报价类型，类型：uint32，0：所有，1：实时报价，2：实时成交报价，没有该字段，后台默认按0处理
                depth_level, // 深度层级，类型：uint32，该字段有效范围1到10之间，
                // 在quote_type为0，1，或者没有quote_type字段时，需要赋值，
                // 如果没有depth_level字段时，后台只会提供一层的报价
                // 请求的层级大于实际报价层级，则后台按实际报价有多少层给多少层
            }
        })
        this.send(14000, { symbol_list: list })
    }

    // websocket连接成功
    onOpen () {
        if (this.subscribedList.length) this.send_subscribe(this.subscribedList)
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
        const newData = list.map(el => tickFormat(el))
        $store.commit('_quote/Update_productTick', newData)
    }

    // 实时报价
    tick (p) {
        // p(1123,1,1232312,34545435345,6.23,6.23,6.24);(1124,2,1232314,34545435345,7.23,7.23,7.24)
        // 产品ID，报价序号，报价时间戳，当前价，第一档bid卖价，第一档ask买价

        // 模拟成交数据
        this.dealList(p)

        if (this.newPriceTimer) clearTimeout(this.newPriceTimer)
        const $store = this.$store
        const curPriceData = tickToObj(p)
        const now = new Date().getTime()
        if (this.preSetTime + 125 <= now) {
            this.preSetTime = now
            this.newPrice.push(curPriceData)
            $store.commit('_quote/Update_productTick', this.newPrice)
            this.newPrice = []
        } else {
            this.newPrice.push(curPriceData)
        }

        // 500毫秒后更新最后一组报价数据
        this.newPriceTimer = setTimeout(() => {
            if (this.newPrice.length > 0) {
                $store.commit('_quote/Update_productTick', this.newPrice)
                this.newPrice = []
            }
        }, 500)
    }

    dealList (p) {
        // console.log('成交数据', p)
        const priceStr = p.split(';')[0].match(/\((.+)\)/)
        const price = priceStr[1] ?? ''
        const priceArr = price.split(',')
        const dealData = {
            symbolId: priceArr[0] * 1,
            dealTime: priceArr[3],
            trade_direction: Math.floor(Math.random() * 2) + 1, // priceArr[6]
            price: priceArr[4], // priceArr[4],
            volume: priceArr[6] // priceArr[5]

        }
        setTimeout(() => {
            this.$store.commit('_quote/Update_dealList', dealData)
        }, 3000)
    }

    // 心跳机制
    initPing () {
        const ws = this.ws
        if (ws.readyState !== 1) return console.warn('消息websocket连接未准备好  readyState：', ws.readyState)
        if (this.ping) clearInterval(this.ping)
        this.ping = setInterval(() => {
            const param = this.getParam(14008, {})
            if (ws.readyState === 1) ws.send(JSON.stringify(param))
        }, 10000)
    }
}

export default SocketEvent

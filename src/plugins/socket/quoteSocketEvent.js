import { tickFormat, tickToObj, formatSubscribe } from './socketUtil'
import { guid } from '@/utils/util'
import { mul } from '@/utils/calculation'

// websocket消息事件
class SocketEvent {
    constructor () {
        this.ws = null
        this.seq_id = 0
        this.timeOut = 60 * 1000
        this.timer = null
        this.$store = null
        this.requests = new Map()
        this.subscribedList = [] // 上一次报价订阅记录
        this.subscribeDeal = [] // 上一次盘口订阅记录
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

    /* 订阅产品报价 支持两种数据格式，
    * symbolKey的形式：['1_2','2_2']
    * object的形式：[{symbol_id: "37", trade_type: 3}]
    */
    send_subscribe (productIds = []) {
        if (!productIds || productIds.length === 0) return false
        this.subscribedList = productIds
        const subscribeList = formatSubscribe(productIds)
        this.send(14000, { symbol_list: subscribeList })
    }

    // 盘口成交报价订阅
    deal_subscribe (symbol_id, depth_level = 10, merge_accuracy, trade_type, trade_info_count) {
        this.$store.commit('_quote/Delete_dealList') // 删除成交数据
        this.subscribeDeal = [{ symbol_id, depth_level, merge_accuracy, trade_type }]

        const list = [{
            symbol_id: Number(symbol_id), // 产品ID ，类型：uint64
            trade_type, // 交易类型，类型：uint32，1：cfd，2：me
            depth_level, // 深度层级，类型：uint32，该字段有效范围1到10之间
            merge_accuracy,
            trade_info_count
        }]
        this.send(14010, { symbol_list: list })
    }

    // websocket连接成功
    onOpen () {
        if (this.subscribedList.length) this.send_subscribe(this.subscribedList)
        if (this.subscribeDeal.length) {
            const { symbol_id, depth_level, merge_accuracy, trade_type } = this.subscribeDeal[0]
            this.deal_subscribe(symbol_id, depth_level, merge_accuracy, trade_type)
        }
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

    // 处理盘口成交数据快照
    ['cmd_id_14011'] (data) {
        const list = data.data?.tick_list ?? []
        const $store = this.$store
        $store.commit('_quote/Update_handicapList', {
            list,
            type: 1
        })

        const lastData = list[0]
        const dealList = list[0]?.trade_info
        if (lastData && dealList.length > 0) {
            dealList.forEach(el => {
                const dealData = {
                    symbolId: lastData.symbol_id,
                    dealTime: mul(el.trade_time, 1000),
                    trade_direction: el.trade_direction,
                    price: el.price,
                    volume: el.volume,
                }
                this.$store.commit('_quote/Update_dealList', dealData)
            })
        }
    }

    // 实时报价
    tick (p) {
        // p(1123,1,1232312,34545435345,6.23,6.23,6.24);(1124,2,1232314,34545435345,7.23,7.23,7.24)
        // 产品ID，报价序号，报价时间戳，当前价，第一档bid卖价，第一档ask买价

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

    // 实时成交数据
    deal_tick (p) {
        const priceStr = p.split(';')[0].match(/\((.+)\)/)
        const price = priceStr[1] ?? ''
        const priceArr = price.split(',')
        const dealData = {
            symbolId: priceArr[0],
            dealTime: priceArr[3],
            trade_direction: priceArr[6], // Math.floor(Math.random() * 2) + 1,
            price: priceArr[4], // priceArr[4],
            volume: priceArr[5] // priceArr[5]

        }
        this.$store.commit('_quote/Update_dealList', dealData)
    }

    // 实时盘口深度报价
    handicap_tick (p) {
        debugger
        const result = p.split(';')
        const tickList = {
            bid_deep: [],
            ask_deep: []
        }

        if (result.length > 2) {
            const bidList = result[1].match(/[^\\(\\)]+(?=\))/g)
            if (bidList.length > 0) {
                bidList.forEach(item => {
                    const bidOjb = {}
                    bidOjb.price_bid = item.split(',')[0]
                    bidOjb.volume_bid = item.split(',')[1]
                    tickList.bid_deep.push(bidOjb)
                })
            }

            const askList = result[2].match(/[^\\(\\)]+(?=\))/g)
            if (askList && askList.length > 0) {
                askList.forEach(item => {
                    const askOjb = {}
                    askOjb.price_ask = item.split(',')[0]
                    askOjb.volume_ask = item.split(',')[1]
                    tickList.ask_deep.push(askOjb)
                })
            }

            this.$store.commit('_quote/Update_handicapList', {
                tickList,
                type: 2
            })
        }
    }

    // 取消订阅
    cancel_subscribe (cancel_type = 0) {
        this.send(14006, { cancel_type })
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

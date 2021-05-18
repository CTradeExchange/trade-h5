import { guid, getDevice, getToken } from '@/utils/util'
import { Dialog } from 'vant'
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
        this.seq_id++
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
    send (msgType, data, timeOut) {
        if (this.ws.readyState !== 1) return console.warn('消息websocket连接未准备好  readyState：', this.ws.readyState)
        const param = this.getParam(msgType, data)
        this.ws.send(JSON.stringify(param))

        if (!this.timer) {
            this.timer = window.setInterval(() => {
                const nowTime = new Date().getTime()
                this.requests.forEach((item, key, map) => {
                    // 请求超时
                    if (nowTime - item.sendTime > item.timeOut) {
                        item.reject({
                            errorType: 'TimeOut',
                            remark: `timeOut: seq_id-${item.request.seq_id}, msgType-${item.request.msgType}`
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

    // 收取到消息
    onMessage (data) {
        this.requests.forEach((item, key) => {
            if (data.seq_id === key) {
                item.resolve(data)
            }
        })
        const msgCode = data.msgCode
        if (typeof (this[msgCode]) === 'function') {
            this[msgCode](data)
        }
    }

    // 登录
    login () {
        return this.send('login')
    }

    // 登出
    logout () {
        return this.send('logout')
    }

    // 新增订阅动作，如果websocket已经建立好，则直接请求，否则先缓存在subscribedList中
    subscribedListAdd (fn) {
        if (this.ws.readyState === 1) {
            fn && fn()
        } else {
            this.subscribedList.push(fn)
        }
    }

    // websocket连接成功
    onOpen () {
        const executeFn = () => {
            const fn = this.subscribedList.shift()
            fn && fn()
            if (this.subscribedList.length) executeFn()
        }
        executeFn()
    }

    // 心跳机制
    initPing () {
        if (this.ws.readyState !== 1) return console.warn('消息websocket连接未准备好  readyState：', this.ws.readyState)
        let param = this.getParam('ping')
        // this.ws.send(JSON.stringify(param))
        if (this.ping) clearInterval(this.ping)
        this.ping = setInterval(() => {
            param = this.getParam('ping')
            this.ws.send(JSON.stringify(param))
        }, 30000)
    }

    // 处理持仓盈亏浮动数据和账户数据
    positionsTick (str) {
        // f(profitLoss,occupyMargin,availableMargin,marginRadio,netWorth,balance);(positionId,profitLoss);(positionId,profitLoss);(positionId,profitLoss)
        const dataArr = str.split(';')
        const accountData = dataArr[0].match(/\((.+)\)/)[1].split(',')
        const positionsProfitLoss = dataArr.slice(1).map(el => {
            const elData = el.replace(/\(|\)/g, '').split(',').map(parseFloat)
            return {
                positionId: elData[0],
                profitLoss: elData[1],
            }
        })
        this.floatProfitLoss({
            content: {
                availableMargin: Number(accountData[2]),
                balance: Number(accountData[5]),
                marginRadio: accountData[3],
                netWorth: Number(accountData[4]),
                occupyMargin: Number(accountData[1]),
                profitLoss: Number(accountData[0]),
                positionProfitLossMessages: positionsProfitLoss,
            }
        })
    }

    floatProfitLoss ({ content }) {
        this.$store.commit('_user/Update_userAccount', content)
        if (content.positionProfitLossMessages.length > 0) {
            this.$store.commit('_trade/Update_positionProfitLossList', content.positionProfitLossMessages)
        }
    }

    // 处理异地登录踢出
    disconnect (data) {
        const that = this
        Dialog.alert({
            title: '提示',
            theme: 'round-button',
            message: '您的账号在异地登录，请重新登录',
        }).then(() => {
            // 踢出登录断开ws
            QuoteSocket.ws.close()
            that.ws.close()
            that.$store.dispatch('_user/logout')
        })
    }

    // 消息通知
    notice (data) {
        const event = new CustomEvent('notice', {
            detail: data
        })
        document.body.dispatchEvent(event)
    }
}

export default SocketEvent

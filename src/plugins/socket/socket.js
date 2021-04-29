import { quoteService, msgService, tradeService } from '@/config'
import CreateSocket from './createSocket'
import QuoteSocketEvent from './quoteSocketEvent'
import MsgSocketEvent from './msgSocketEvent'

import store from '@/store'

export const QuoteSocket = new QuoteSocketEvent() // 行情websocket
export const MsgSocket = new MsgSocketEvent() // 消息websocket
export default {
    install: (app, { $store } = {}) => {
        const quoteWS = CreateSocket(quoteService)
        const msgWS = CreateSocket(msgService)
        const tradeWS = CreateSocket(tradeService)

        QuoteSocket.init(quoteWS, $store)
        MsgSocket.init(msgWS, $store)
        app.config.globalProperties.$QuoteSocket = QuoteSocket
        app.config.globalProperties.$MsgSocket = MsgSocket

        quoteWS.open()
        msgWS.open()

        quoteWS.addEventListener('message', evt => {
            if (typeof evt.data === 'string' && evt.data.startsWith('p(')) return QuoteSocket.tick(evt.data)
            if (typeof evt.data === 'object' || evt.data.indexOf('{') !== 0) return
            try {
                const data = JSON.parse(evt.data)
                QuoteSocket.onMessage(data)
            } catch (error) {

            }
        })

        quoteWS.addEventListener('open', function () {
            if (QuoteSocket.subscribedList.length) QuoteSocket.send_subscribe(QuoteSocket.subscribedList)
            QuoteSocket.initPing() // 心跳
        })

        msgWS.addEventListener('open', function () {
            MsgSocket.initPing() // 心跳
        })

        msgWS.addEventListener('close', function (err) {
            console.log('close', err)
        })

        msgWS.addEventListener('message', evt => {
            const data = JSON.parse(evt.data)
            if (data.msgCode === 'floatProfitLoss') {
                MsgSocket.handleProfitLoss(data)
            } else if (data.msgCode === 'disconnect') {
                MsgSocket.handleLogout(data)
            }
        })

        tradeWS.addEventListener('open', function () {
            tradeWS.send(JSON.stringify({
                'header': {
                    'trace': 'trace',
                    'token': 'token',
                    'bizType': 'ping',
                    'sendTime': Date.now(),
                    'lang': 'zh-CN'
                }
            }))
        })
    }
}

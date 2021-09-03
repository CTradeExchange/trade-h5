import { quoteService, msgService, tradeService } from '@/config'
import CreateSocket from './createSocket'
import QuoteSocketEvent from './quoteSocketEvent'
import MsgSocketEvent from './msgSocketEvent'
import { ungzip } from './socketUtil'

export const QuoteSocket = new QuoteSocketEvent() // 行情websocket
export const MsgSocket = new MsgSocketEvent() // 消息websocket
export default {
    install: (app, { $store, $router } = {}) => {
        const quoteWS = CreateSocket(quoteService)
        const msgWS = CreateSocket(msgService)
        const tradeWS = CreateSocket(tradeService)

        QuoteSocket.init(quoteWS, $store, $router)
        MsgSocket.init(msgWS, $store, $router)
        app.config.globalProperties.$QuoteSocket = QuoteSocket
        app.config.globalProperties.$MsgSocket = MsgSocket

        quoteWS.open()
        msgWS.open()

        quoteWS.addEventListener('message', evt => {
            if (typeof evt.data === 'string' && evt.data.startsWith('p(')) {
                return QuoteSocket.tick(evt.data)
            } else if (typeof evt.data === 'string' && evt.data.startsWith('pt(')) {
                const event = new CustomEvent('GotMsg_updateChart', { detail: evt.data })
                document.body.dispatchEvent(event)
                return QuoteSocket.deal_tick(evt.data)
            } else if (typeof evt.data === 'string' && evt.data.startsWith('pd(')) {
                const event = new CustomEvent('GotMsg_updateChart', { detail: evt.data })
                document.body.dispatchEvent(event)
                return QuoteSocket.handicap_tick(evt.data)
            } else if (typeof evt.data === 'string' && evt.data.indexOf('{') !== 0) return

            try {
                if (typeof evt.data === 'object') {
                    ungzip(evt.data).then(res => {
                        QuoteSocket.onMessage(res)
                    })
                } else {
                    const data = JSON.parse(evt.data)
                    QuoteSocket.onMessage(data)
                }
            } catch (error) {

            }
        })

        quoteWS.addEventListener('open', function () {
            QuoteSocket.initPing() // 心跳
            QuoteSocket.onOpen() // 连接成功
        })

        msgWS.addEventListener('open', function () {
            MsgSocket.initPing() // 心跳
            MsgSocket.onOpen() // 连接成功
        })

        msgWS.addEventListener('close', function (err) {
            console.log('close', err)
        })

        msgWS.addEventListener('message', evt => {
            if (typeof evt.data === 'string' && evt.data.startsWith('f(')) return MsgSocket.positionsTick(evt.data, 1)
            else if (typeof evt.data === 'string' && evt.data.startsWith('g(')) return MsgSocket.positionsTick(evt.data, 2)
            if (typeof evt.data === 'object' || evt.data.indexOf('{') !== 0) return
            try {
                const data = JSON.parse(evt.data)
                MsgSocket.onMessage(data)
            } catch (error) {}
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

import { quoteService, msgService } from '@/config'
import CreateSocket from './createSocket'
import SocketEvent from './socketEvent'

export const socket = new SocketEvent()
export default {
    install: (app, { $store } = {}) => {
        const ws = CreateSocket(quoteService)
        const msgWS = CreateSocket(msgService)

        socket.init(ws, $store)
        app.config.globalProperties.$socket = socket

        ws.addEventListener('message', evt => {
            if (typeof evt.data === 'string' && evt.data.startsWith('p(')) return socket.tick(evt.data)
            if (typeof evt.data === 'object' || evt.data.indexOf('{') !== 0) return
            try {
                const data = JSON.parse(evt.data)
                socket.onMessage(data)
            } catch (error) {

            }
        })

        ws.addEventListener('open', function () {
            if (socket.subscribedList.length) socket.send_subscribe(socket.subscribedList)
        })
        msgWS.addEventListener('open', function () {
            msgWS.send(JSON.stringify({ 'head': { 'msgType': 'ping', 'sendTime': 1617092609603, 'lang': 'zh-CN', 'token': '' }, 'device': '1', 'trace': '123' }))
        })
    }
}

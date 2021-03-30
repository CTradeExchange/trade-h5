import ReconnectingWebSocket from 'reconnectingwebsocket'
import { apiDomain } from '@/config'
import SocketEvent from './socketEvent'

export const socket = new SocketEvent()
export default {
    install: (app, { $store } = {}) => {
        const protocol = location.protocol === 'http:' ? 'ws:' : 'wss:'
        const ws = new ReconnectingWebSocket(`${protocol + apiDomain}/ws/`)

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
    }
}

import { encrypt_with_aes, getQueryString, isEmpty, parseJSON } from "@/utils/util"
import createSocket from "./createSocket"
import SocketEvent from "./socketEvent"

export const ItemsSocket = new SocketEvent()

if (process.env.NODE_ENV === 'development') {
    window.ItemsSocket = ItemsSocket
}

// 消息websocket事件处理
function msgWSEvent (eventWS) {
    eventWS.addEventListener('open', function () {
        // console.log('eventWS open')
        ItemsSocket.initPing() // 心跳
    })

    eventWS.addEventListener('close', function (err) {
        // console.warn('eventWS close', err)
    })

    eventWS.addEventListener('message', evt => {
        // console.log('eventWS message', evt)
        try {
            const msgData = parseJSON(evt.data) || {}
            if (msgData?.msg !== 'ok') throw 'error'
            const { type, data } = parseJSON(msgData?.data) || {}
            const result = {
                type,
                data: parseJSON(data) || {}
            }
            ItemsSocket.onMessage(result)
        } catch (error) {}
    })
}

export default {
    install: (app, { $store, $router } = {}) => {
        const { newsSysConfig } = $store.state._base || {}
        const { Value: newsService } = newsSysConfig?.find((o) => o.Key === 'newsService') || {}
        if (isEmpty(newsService)) return

        const { customerInfo } = $store.state._user || {}
        const userId = !isEmpty(customerInfo) ? customerInfo.customerNo : 0
        const eventWS = createSocket(newsService + '?sign=' + encrypt_with_aes(JSON.stringify({ time: new Date().getTime(), userId })))

        ItemsSocket.init(eventWS, $store, $router)
        app.config.globalProperties.$ItemsSocket = ItemsSocket

        // 默认开启消息推送，uniapp环境下不开
        if (!getQueryString('isUniapp')) {
            eventWS.open()
            msgWSEvent(eventWS) // 消息事件处理
        }
    }
}
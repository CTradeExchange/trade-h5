import { connectSignalWs } from './socket.js'
import { guid } from '@/utils/util.js'
import SignalEvent from '../signal/utils/signalEvent'

// websocket消息事件
class SocketEvent {
    constructor () {
        this.ws = null
        this.$store = null
        this.timeOut = 60 * 1000 // 请求超时时间
        this.requests = new Map()
        this.subscribedMap = {} // 订阅id
        this.connectionTimeout = null // 保活定时器
        this.connectionTimeoutMs = 0 // 保活消息超时消息
    }

    // 初始化
    init (ws, $store) {
        this.ws = ws
        this.$store = $store
    }

    // 发送消息
    send (param, timeOut) {
        if (!this.ws || this.ws.readyState !== 1) return console.warn('信号websocket连接未准备好readyState:', this.ws?.readyState)
        this.ws.send(JSON.stringify(param))
        if (param.id) {
            // 请求回调
            const requestCallback = ({ request, timeOut }) => {
                return new Promise((resolve, reject) => {
                    this.requests.set(request.id, {
                        timer: null, // 定时器实例
                        timeOut, // 超时时间
                        request,
                        resolve,
                        reject,
                    })
                })
            }
            // 超时回调
            const timeoutCallback = ({ request, timeOut }) => {
                return new Promise((resolve, reject) => {
                    const timer = setTimeout(() => {
                        if (this.requests.has(request.id)) {
                            reject({
                                ok: '-3',
                                code: 'TimeOut',
                                msg: `timeOut: id-${request.id}`
                            })
                            this.requests.delete(request.id)
                        }
                    }, timeOut)
                    this.requests.set(request.id, {
                        ...this.requests.get(request.id),
                        timer,
                    })
                })
            }
            const params = {
                timeOut: timeOut ?? this.timeOut,
                request: param,
            }
            return Promise.race([requestCallback(params), timeoutCallback(params)])
        }
        return Promise.resolve({
            ok: '0',
            data: {
                id: param.id,
            }
        })
    }

    // websocket连接成功
    onOpen () {
        // 初始化连接
        this.send({
            type: 'connection_init',
        })
    }

    onClose () {
        SignalEvent.onCLose()
    }

    // 收取到消息
    onMessage (data) {
        if (data?.id) {
            const req = this.requests.get(data.id)
            if (req) {
                req.resolve({
                    ok: '0',
                    data,
                })
                if (req.timer != null) {
                    clearTimeout(req.timer)
                    req.timer = null
                }
                this.requests.delete(data.id)
            }
        }
        switch (data?.type) {
        case 'connection_ack':
            // 保活消息超时时间
            if (data?.payload?.connectionTimeoutMs) {
                this.connectionTimeoutMs = data.payload.connectionTimeoutMs
            }
            // 初始化完成，开始订阅信号
            this.subscribeSignal()
            // 初始化完成通知
            SignalEvent.onInit()
            break
        case 'ka':
            // 保活信息
            this.connectionTimeout && clearTimeout(this.connectionTimeout)
            if (this.connectionTimeoutMs) {
                this.connectionTimeout = setTimeout(() => {
                    this.reconnect()
                }, this.connectionTimeoutMs)
            }
            break
        case 'data':
            if (data?.payload?.data?.onCreateQuotapIndicator) {
                // 派发信号事件
                SignalEvent.emitSignal([data.payload.data.onCreateQuotapIndicator])
            }
        }
    }

    /*
    * 订阅实时请求
    */
    subscribeSignal () {
        this.send_subscribe('subscription MySub { onCreateQuotapIndicator { id sc sy i si pe t a pr} }')
    }

    /*
    * 添加订阅事件
    */
    send_subscribe (query) {
        const subscribe_id = guid()
        this.subscribedMap[subscribe_id] = query
        const { apiHost, apiKey } = this.$store.state._signal.config
        this.send({
            id: subscribe_id,
            type: 'start',
            payload: {
                data: JSON.stringify({
                    query,
                    variables: {},
                }),
                extensions: {
                    'authorization': {
                        'host': apiHost,
                        'x-api-key': apiKey
                    }
                }
            }
        })
    }

    // 取消单个订阅事件
    cancel_subscribe (id) {
        this.subscribedMap[id] && delete (this.subscribedMap[id])
        this.send({
            type: 'stop',
            id
        })
    }

    // 取消所有订阅
    cancel_subscribeAll () {
        Object.keys(this.subscribedMap).forEach((id) => {
            this.cancel_subscribe(id)
        })
    }

    // 重连
    reconnect () {
        this.cancel_subscribeAll()
        this.requests.clear() // 清除请求
        this.ws && this.ws.close() // 关闭链接
        connectSignalWs({ $store: this.$store })
    }
}

export default SocketEvent

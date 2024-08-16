import { guid, localGetJSON, localSetJSON } from '@/utils/util.js'
import dayjs from 'dayjs'

const SIGNAL_EVENT_NAME = 'SIGNAL_INDICATORS' // 信号指标
const SIGNAL_LOCAL_KEY = 'SIGNAL_LOCAL_KEY' // 信号缓存key名
const IndicatorsMax = 20 // 缓存信号最大条数

/*
    信号订阅事件
*/
function SignalEvent () {
    const eventsMap = new Map() // 事件
    const indicatorList = localGetJSON(SIGNAL_LOCAL_KEY, []) // 信号队列
    eventsMap.set(SIGNAL_EVENT_NAME, new Map()) // 初始化信号对象
    let signalStatus = 0 // 0 连接中 1 开启 2 关闭

    return {
        on (type, callback) {
            const handlers = eventsMap.get(type)
            if (handlers) {
                handlers.push(callback)
            } else {
                eventsMap.set(type, [callback])
            }
        },
        off (type, callback) {
            const handlers = eventsMap.get(type)
            if (handlers) {
                if (callback) {
                    // 如果有回调则取消当前事件
                    handlers.splice(handlers.indexOf(callback) >>> 0, 1)
                } else {
                    eventsMap.set(type, [])
                }
            }
        },
        emit (type, evt) {
            const handlers = eventsMap.get(type)
            if (handlers) {
                handlers.slice().map((handler) => {
                    handler(evt)
                })
            }
        },
        onInit () {
            // 信号初始化通知
            this.emit('SIGNAL_INIT')
            signalStatus = 1
        },
        onCLose () {
            // 信号关闭通知
            this.emit('SIGNAL_CLOSE')
            signalStatus = 2
        },
        handleInit (callback) {
            // 监听并执行初始化事件
            if (signalStatus === 1) {
                callback && callback()
            }
            this.on('SIGNAL_INIT', callback)
        },
        handleUnload (callback) {
            this.off('SIGNAL_INIT', callback)
        },
        getSignalMap () {
            return eventsMap.get(SIGNAL_EVENT_NAME)
        },
        getLasterSignal (payload, limit = 5) {
            // 获取最新当前条件的列表
            const arr = []
            const list = [...indicatorList]
            for (let i = 0; i < list.length; i++) {
                const res = this.filterPayload([list[i]], payload)
                if (res.length) {
                    arr.push(res[0])
                    if (arr.length >= limit) {
                        break
                    }
                }
            }
            return arr
        },
        onSignal (payload, callback) {
            // 添加信号 参数、回调
            const currentSignal = this.getSignalMap()
            const id = guid()
            currentSignal.set(id, {
                payload,
                callback
            })
            return id
        },
        offSignal (id) {
            // 移除信号
            if (!id) return
            const currentSignal = this.getSignalMap()
            currentSignal.delete(id)
        },
        emitSignal (evt) {
            // 发送信号
            // 缓存信号队列，控制最大长度
            evt.forEach((item) => {
                indicatorList.unshift(item)
                indicatorList.splice(IndicatorsMax, indicatorList.length - IndicatorsMax)
            })
            localSetJSON(SIGNAL_LOCAL_KEY, indicatorList)
            // 发送和校验信号
            const currentSignal = this.getSignalMap()
            currentSignal.forEach(item => {
                const filterList = this.filterPayload(evt, item.payload)
                item.callback && filterList.length && item.callback(evt)
            })
        },
        filterPayload (signal, params = {}) {
            // 根据搜索条件过滤数据
            const paramsArr = Object.keys(params)
            return signal.filter((item) => {
                let flag = true
                for (let i = 0; i < paramsArr.length; i++) {
                    // 匹配当前信号是否包含在条件里
                    if (params[paramsArr[i]] === '') {
                        // 忽略参数为空的字段
                        continue
                    }
                    const currentValue = `${params[paramsArr[i]]}`.split(',')
                    if (currentValue.length && item[paramsArr[i]] && !currentValue.includes(item[paramsArr[i]])) {
                        flag = false
                        break
                    }
                }
                return flag
            })
        }
    }
}

const SignalEventSingle = SignalEvent()

export default SignalEventSingle

/*
   测试用，打包需屏蔽
*/

// 随机发送数据
function random (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomEmit () {
    const timeOut = random(100, 1000)
    setTimeout(() => {
        const t = dayjs().utc()
        const { productAllList } = window.store.state._signal.config
        if (!productAllList) {
            randomEmit()
            return
        }
        const product = productAllList[random(0, productAllList.length - 1)]
        const i = ['MACD', 'RSI', 'KDJ', 'VOL', 'MA', 'CCI'][random(0, 5)]
        const si = ['sol', 'sul', 'jo2', 'ju1', 'cum', 'cu'][random(0, 5)]
        const pe = ['1m', '5m', '15m', '30m', '1h', '1d'][random(0, 5)]
        SignalEventSingle.emitSignal([
            {
                id: `${product.value}_${i}_${si}_${pe}_${Math.floor(t.valueOf() / 1000)}`,
                sc: product.sc,
                sy: product.value,
                i,
                si,
                pe,
                t: t.format('YYYY-MM-DDTHH:mm:00[Z]'),
                a: random(0, 1) ? 'sell' : 'buy',
                pr: '1554.8'
            }
        ])
        randomEmit()
    }, timeOut)
}

// randomEmit()

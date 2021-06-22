import dayjs from 'dayjs'
import { QuoteSocket } from '@/plugins/socket/socket'
let isLog = true // 是否输出日志

export class RequestKData {
    constructor() {
        // 第一根k数据
        this._leftBar = null
        // 最新一根k数据
        this._latestBar = null
        // 产品信息
        this._product = {}
    }
    getKline(params, firstDataRequest) {
        if (firstDataRequest) {
            // 第一次调用此商品/周期的历史记录
            this._product = {
                symbolId: params.symbolId,
                klineType: params.klineType
            }
            this._leftBar = null
            this._latestBar = null
        }

        const _params = {
            "trade_type": 1,
            "symbol_id": params.symbolId,
            "kline_type": params.klineType,
            "kline_timestamp_start": params.startTime,
            "kline_timestamp_end": params.endTime,
        }

        return requestKline(_params, firstDataRequest)
            .then(res => {
                if (firstDataRequest) {
                    if (res.data.bars.length) {
                        // 记录最新bar
                        this._latestBar = { ...res.data.bars[res.data.bars.length - 1] }
                    } else {
                        this._leftBar = { ...res.data.bars[0] }
                    }
                }
                return res
            })
            .then(res => {
                if (!res.data.bars.length) {
                    Object.assign(res.data, {
                        meta: {
                            noData: true,
                            nextTime: this._leftBar.time
                        }
                    })
                }
                return res.data
            })
    }

    // 统一处理tick（替换或请求最新两根数据）
    async normalizeTick(price, tickTime, resolution) {
        if (!price || !this._latestBar) {
            return
        }
        const latestBar = this._latestBar
        let ticks = []

        if (isSameTime(resolution, latestBar.time, tickTime)) {
            // 最新一条数据
            ticks.push({
                time: latestBar.time,
                open: latestBar.open,
                high: Math.max(latestBar.high, price),
                low: Math.min(latestBar.low, price),
                close: price,
            })
        } else {
            // 最新两条数据
            ticks = await this._getLatestKline()
        }

        if (!ticks.length) {
            Promise.reject()
        }

        this._latestBar = ticks[ticks.length - 1]
        isLog && logMessageForTick(ticks)

        return Promise.resolve(ticks)
    }

    // 获取最新两条数据
    _getLatestKline() {
        const params = {
            "trade_type": 1,
            "symbol_id": this._product.symbolId,
            "kline_type": this._product.klineType,
            "query_type": 2,
            "query_kline_num": 2
        }
        return requestKline(params)
            .then(res => {
                return res.data.bars
            })
    }
}


// 历史k线
function requestKline(params) {
    return new Promise((resolve) => {
        const fn = () => {
            if (QuoteSocket.ws.readyState === 1) {
                resolve()
            } else {
                setTimeout(fn, 1000)
            }
        }
        fn()
    })
        .then(() => {
            return QuoteSocket.send(14002, params)
                .then(res => {
                    isLog && logMessageForKline(res, params)

                    const checkResult = validateRes(res)
                    if (checkResult) {
                        return checkResult
                    }

                    const { kline_list, price_digits } = res.data
                    const pow = Math.pow(10, price_digits)
                    const bars = kline_list.map(e => ({
                        time: parseFloat(e.timestamp * 1000),
                        close: parseFloat(e.close_price) / pow,
                        open: parseFloat(e.open_price) / pow,
                        high: parseFloat(e.high_price) / pow,
                        low: parseFloat(e.low_price) / pow,
                    }))

                    return {
                        data: {
                            bars
                        }
                    }
                })
                .catch(error => {
                    console.error(error)
                })
        })
}

// 校验两个时间是否属于同一根K线
function isSameTime(resolution, latestTime, tickTime) {
    latestTime = latestTime * 1
    tickTime = tickTime * 1
    if (latestTime > tickTime) return true

    let oldTime = dayjs(latestTime)
    let newTime = dayjs(tickTime)

    if (/^[0-9]+$/.test(resolution)) {
        // 小于日k
        const oldMinutes = oldTime.hour() * 60 + oldTime.minute()
        const newMinutes = newTime.hour() * 60 + newTime.minute()
        // console.log(oldMinutes, newMinutes)
        return newMinutes - oldMinutes < resolution
    } else {
        return oldTime === newTime
    }

}

function validateRes(res) {
    if (res.ret !== 200) {
        return {
            bars: [],
            meta: {
                noData: true,
            }
        }
    }
    return null
}


function logMessageForKline(res, params) {
    console.groupCollapsed(`%c请求历史k线:⬇`, `color:${res.ret === 200 ? 'green' : 'red'}`)
    console.log('request:', JSON.stringify(params, null, ' '))
    console.log('response:', JSON.stringify(res, (key, value) => {
        if (key === 'kline_list') {
            if (Array.isArray(value) && value.length) {
                return `共{${value?.length}}条数据, 区间[${value[0].timestamp}, ${value[value.length - 1]?.timestamp}]`
            } else {
                return '没有数据'
            }
        }
        return value
    }, ' '))
    console.log('response:', res.data?.kline_list, ' ')
    console.groupEnd()
}

function logMessageForTick(ticks) {
    if (ticks.length === 1) {
        console.group('%c实时报价:⬇', 'color:green')
    } else {
        console.group('%c获取最新两根数据:⬇', 'color:green')
    }
    console.log(JSON.stringify(ticks))
    console.groupEnd()
}

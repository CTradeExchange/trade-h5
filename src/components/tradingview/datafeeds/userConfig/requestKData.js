import dayjs from 'dayjs'
import { QuoteSocket } from '@/plugins/socket/socket'

let isdebug = true

export class RequestKData {
    constructor(){
        // 记录最新k线时间
        this._lastBar = null
        // 存储历史数据
        this._historyKline = null
    }
    getKline(params, firstDataRequest){
        this._historyKline = null
        return getKline(params, firstDataRequest)
            .then(res => {
                res._lastBar && (this._lastBar = res._lastBar)
                this._historyKline = res.data.bars
                return res.data
            })
    }
    normalizeTick(price, tickTime, resolution){
        if(!this._historyKline) {
            return
        }
        if(!price || !this._lastBar){
            return
        }
        this._lastBar = normalizeTick(price, tickTime, resolution, this._lastBar)
        isdebug && debugTick(this._lastBar)
        return this._lastBar
    }
}


// 历史k线
function getKline(params, firstDataRequest){
    return new Promise((resolve) => {
            const fn = () => {
                if(QuoteSocket.ws.readyState ===1 ){
                    resolve()
                } else {
                    setTimeout(fn, 1000)
                }
            }
            fn()
        })
        .then(() => {
            const { symbolId,klineType, startTime, endTime } = params
            const requestParams = {
                "symbol_id": symbolId,
                "trade_type": 1,
                "kline_type": klineType,
                "kline_timestamp_start": startTime,
                "kline_timestamp_end": endTime
            }
            return QuoteSocket.send(14002, requestParams)
                .then(res => {
                    isdebug && debugKline(res,requestParams)

                    const checkResult = validateRes(res)
                    if(checkResult){
                        return checkResult
                    }

                    const { kline_list, price_digits } = res.data
                    const pow = Math.pow(10, price_digits)
                    const bars = kline_list.map(e => ({
                        time: parseFloat(e.timestamp * 1000),
                        close: parseFloat(e.close_price) / pow,
                        open:  parseFloat(e.open_price) / pow,
                        high:  parseFloat(e.high_price) / pow,
                        low:  parseFloat(e.low_price) / pow,
                    }))

                    // 记录最新k线时间
                    let _lastBar = null
                    if(firstDataRequest || !_lastBar || _lastBar.time < (bars[bars.length-1] || {}).time){
                        _lastBar = bars[bars.length-1] || null
                    }

                    return {
                        _lastBar,
                        data:{
                            bars,
                            meta:{
                                noData: !bars.length
                            },
                        }
                    }
                })
                .catch(error => {
                    console.error(error)
                })
        })
}

function normalizeTick(price, tickTime, resolution, _lastBar){
    let bar = {}

    if(isSameTime(resolution, _lastBar.time, tickTime)){
        bar = {
            time: _lastBar.time,
            open: _lastBar.open,
            high: Math.max(_lastBar.high, price),
            low: Math.min(_lastBar.low, price),
            close: price,
        }
    } else {
        bar = {
            time: tickTime,
            open: _lastBar.close,
            high: Math.max(_lastBar.close, price),
            low: Math.min(_lastBar.close, price),
            close: price,
        }
    }

    return bar
}

function isSameTime(resolution, lastBarTime, tickTime){
    lastBarTime = lastBarTime * 1
    tickTime = tickTime * 1

    if(lastBarTime > tickTime) return true
    // console.log('isSameTime: ', resolution, lastBarTime, tickTime)
    let oldTime = dayjs(lastBarTime)
    let newTime = dayjs(tickTime )

    if(/^[0-9]+$/.test(resolution)){
        // 小于日k
        const oldMinutes = oldTime.hour() * 60 + oldTime.minute()
        const newMinutes = newTime.hour() * 60 + newTime.minute()
        // console.log(oldMinutes, newMinutes)
        return newMinutes - oldMinutes<resolution
    } else {
        return oldTime === newTime
    }

}

function validateRes(res){
    if(res.ret !== 200){
        return {
            bars: [],
            meta:{
                noData: true,
            }
        }
    }
    return null
}


function debugKline(res,requestParams){
    console.groupCollapsed(`%c请求历史k线:⬇`,  `color:${res.ret === 200 ? 'green': 'red'}`)
    console.log('request:', JSON.stringify(requestParams, null, ' '))
    console.log('response:', JSON.stringify(res, (key, value) => {
        if(key === 'kline_list'){
            if(Array.isArray(value) && value.length){
                return `共{${value?.length}}条数据, 区间[${value[0].timestamp}, ${value[value.length-1]?.timestamp}]`
            } else {
                return '没有数据'
            }
        }
        return value
    }, ' '))
    console.log('response:', res.data?.kline_list, ' ')
    console.groupEnd()
}

function debugTick(tick){
    console.group('%c实时报价:⬇', 'color:green')
    console.log(JSON.stringify(tick))
    console.groupEnd()
}

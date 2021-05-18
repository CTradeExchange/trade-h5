import dayjs from 'dayjs'

import { QuoteSocket } from '@/plugins/socket/socket'
import store from '@m/store/index'

let isdebug = true
let lastBar = null // 记录最新k线时间
let tickListener = null
let symbolParams = null
let hasHistoryKline = null
let oldPrice = null

store.subscribe((mutation, state) => {
    try {
        if(hasHistoryKline && typeof tickListener !== 'function' || mutation.type !== '_quote/Update_productTick'){
            return
        }
        if(
            !symbolParams
            || symbolParams.symbolId + '' !== mutation.payload.symbolId + ''
            ){
            return
        }

        const { tick_time, price } = mutation.payload
        if(oldPrice === price){
            return
        }
        oldPrice = price
        const tick = normalizeTick(price, symbolParams.resolution, tick_time)
        tickListener(tick)
        isdebug && debugTick(tick, symbolParams)
    } catch (error) {
        console.error(error)
    }
})

// 历史k线
export function getKline(params, firstDataRequest){
    hasHistoryKline = null
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
                    if(firstDataRequest || !lastBar || lastBar.time < (bars[bars.length-1] || {}).time){
                        lastBar = bars[bars.length-1] || null
                    }

                    hasHistoryKline = bars
                    return {
                        bars,
                        meta:{
                            noData: !bars.length
                        }
                    }
                })
                .catch(error => {
                    console.error(error)
                })
        })
}


export function setTickRequest(params, tickEvent){
    symbolParams = params
    tickListener = tickEvent
}


function normalizeTick(price, resolution, tickTime){
    if(!price || !lastBar){
        return []
    }

    let bar = {}

    if(lastBar.time >= tickTime || isSameTime(resolution, lastBar.time, tickTime)){
        bar = {
            time: lastBar.time,
            open: lastBar.open,
            high: Math.max(lastBar.high, price),
            low: Math.min(lastBar.low, price),
            close: parseFloat(price),
        }
    } else {
        bar = {
            ...lastBar,
            close: price,
            time: tickTime
        }
    }

    lastBar = bar
    return bar
}

function isSameTime(resolution, lastBarTime, tickTime){
    // console.log('isSameTime: ', resolution, lastBarTime, tickTime)
    let oldTime = dayjs(lastBarTime)
    let newTime = dayjs(tickTime)

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

function debugTick(tick, requestParams){
    console.group('%c实时报价:⬇', 'color:green')
    console.log(JSON.stringify(tick))
    console.groupEnd()
}

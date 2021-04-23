import { QuoteSocket } from '@/plugins/socket/socket'
let isdebug = true
let lastBar = null // 记录最新k线时间

// 历史k线
export function getKline(params, firstDataRequest){
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

// 实时报价
export function getTick(params){
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
        const { symbolId, resolution } = params
        const requestParams = {
            symbol_list: [
                {
                    symbolId,
                    trade_type: 1
                }
            ],
        }
        return QuoteSocket.send(14000, requestParams)
            .then(res => {
                isdebug && debugTick(res,requestParams)

                const checkResult = validateRes(res)
                if(checkResult){
                    return checkResult
                }
                const {data: { tick_list }} = res
                const bars = normalizeTick(tick_list, resolution)
                console.log(bars)


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

function normalizeTick(tickList, resolution){
    if(!tickList){
        return []
    }
    if(!Array.isArray(tickList)){
        tickList = [tickList]
    }

    console.log(resolution)
    return tickList.map(e => {
        // const pow = Math.pow(10, e.price_digits)
        const pow = 1
        const bar = {
            time: parseFloat(e.tick_time),
            close: parseFloat(e.close_price) / pow,
            open:  parseFloat(e.open_price) / pow,
            high:  parseFloat(e.high_price) / pow,
            low:  parseFloat(e.low_price) / pow,
        }
        if(lastBar){
            if(lastBar.time >= bar.time){
                bar.time = lastBar.time
            } else {

            }
        }

        return bar
    })
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
    console.log('response:', res, ' ')
    console.groupEnd()
}

function debugTick(res,requestParams){
    console.groupCollapsed(`%c请求实时报价:⬇`,  `color:${res.ret === 200 ? 'green': 'red'}`)
    console.log('request:', JSON.stringify(requestParams, null, ' '))
    console.log('response:', res, ' ')
    console.groupEnd()
}

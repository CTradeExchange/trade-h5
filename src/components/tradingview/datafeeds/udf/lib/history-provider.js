import { QuoteSocket } from '@/plugins/socket/socket'
import { resolutionToKlineType } from './constant'

let isdebug = true

class HistoryProvider {
     constructor(datafeedUrl, requester) {
        this._datafeedUrl = datafeedUrl;
        this._requester = requester;
    }
    getBars (symbolInfo, resolution, rangeStartDate, rangeEndDate, firstDataRequest) {
        console.log('firstDataRequest: ', firstDataRequest)
        const params = {
            symbolId: symbolInfo.ticker,
            klineType: resolutionToKlineType[resolution],
            startTime: rangeStartDate,
            endTime: rangeEndDate
        }

        return getKline(params)
    }
}


// 历史k线
function getKline(params){
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
            return QuoteSocket.send(14002, {
                    "symbol_id": symbolId,
                    "trade_type": 1,
                    "kline_type": klineType,
                    "kline_timestamp_start": startTime,
                    "kline_timestamp_end": endTime
                })
                .then(res => {

                    if(isdebug){
                        console.groupCollapsed(`%c请求历史k线:⬇`,  `color:${res.ret === 200 ? 'green': 'red'}`)
                        console.log('request:', JSON.stringify(params, null, ' '))
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
                        console.groupEnd()
                    }

                    if(res.ret !== 200){
                        console.log()
                        return {
                            bars: [],
                            meta:{
                                noData: true,
                            }
                        }
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
                    const meta = {
                        noData: false
                    }

                    if(!bars.length){
                        meta.noData = true
                    }

                    return {
                        bars,
                        meta
                    }
                })
                .catch(error => {
                    console.error(error)
                })
        })
}

export { HistoryProvider };

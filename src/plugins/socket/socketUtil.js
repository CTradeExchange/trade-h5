import pako from 'pako'
import { priceFormat } from '@/utils/util'

export function tickFormat (data) {
    const digits = data.price_digits
    const tick_deep = data.tick_deep[0]
    data.symbolId = parseInt(data.symbol_id)
    data.close_price = priceFormat(data.close_price, digits)
    data.high_price = priceFormat(data.high_price, digits)
    data.low_price = priceFormat(data.low_price, digits)
    data.open_price = priceFormat(data.open_price, digits)
    data.cur_price = priceFormat(data.price, digits)
    data.sell_price = priceFormat(tick_deep.price_bid, digits)
    data.buy_price = priceFormat(tick_deep.price_ask, digits)
    data.yesterday_close_price = priceFormat(data.yesterday_close_price, digits)
    return data
}

export function ungzip (blod) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        // const startTime = Date.now()
        reader.onload = () => {
            const charData = reader.result.split('').map(x => x.charCodeAt(0))
            const data = pako.inflate(new Uint8Array(charData))
            let strData = ''
            /**
             * String.fromCharCode.apply(null, array) 显示 Maximum call stack size exceeded
             * 超过最大调用堆栈大小
             *
             */
            const chunk = 8 * 1024
            let i
            const uint16Arr = new Uint16Array(data)
            for (i = 0; i < uint16Arr.length / chunk; i++) {
                strData += String.fromCharCode.apply(null, uint16Arr.slice(i * chunk, (i + 1) * chunk))
            }
            strData += String.fromCharCode.apply(null, uint16Arr.slice(i * chunk))
            const result = JSON.parse(decodeURIComponent(strData))
            resolve(result)
        }
        reader.readAsBinaryString(blod)
        reader.onerror = () => reject()
    })
}

// 实时行情tick字符串转Object对象
export function tickToObj (p) {
    const priceStr = p.split(';')[0].match(/\((.+)\)/)
    const price = priceStr[1] ?? ''
    const priceArr = price.split(',')
    const curPriceData = {
        symbolId: priceArr[0] * 1,
        trade_type: priceArr[1],
        tick_time: priceArr[3] * 1,
        cur_price: priceArr[4],
        sell_price: priceArr[5],
        buy_price: priceArr[6],
    }
    return curPriceData
}

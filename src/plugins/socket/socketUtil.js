import pako from 'pako'
import { toFixed } from '@/utils/calculation'
import { priceFormat } from '@/utils/util'

export function tickFormat (data) {
    const digits = data.price_digits
    const tick_deep = data.tick_deep || []
    tick_deep.forEach(el => {
        el.price_ask = toFixed(el.price_ask, digits)
        el.price_bid = toFixed(el.price_bid, digits)
    })
    const firstTick = tick_deep[0]
    data.symbolId = parseInt(data.symbol_id)
    data.close_price = toFixed(data.close_price, digits)
    data.high_price = toFixed(data.high_price, digits)
    data.low_price = toFixed(data.low_price, digits)
    data.open_price = toFixed(data.open_price, digits)
    data.cur_price = toFixed(data.price, digits)
    data.sell_price = toFixed(firstTick.price_bid, digits)
    data.buy_price = toFixed(firstTick.price_ask, digits)
    data.yesterday_close_price = toFixed(data.yesterday_close_price, digits)
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

    const priceTickArr = p.split(';')
    // priceTickArr.shift()
    const tickResult = []

    if (priceTickArr.length > 2) {
        priceTickArr.forEach((item, index) => {
            if (item) {
                const tickObj = {}
                if (Number(index) === 0) {
                    item = item.replace('(', '').replace(')', '')
                    tickObj.price_bid = priceArr[5]
                    tickObj.price_ask = priceArr[6]
                    tickObj.volume_bid = priceArr[7]
                    tickObj.volume_ask = priceArr[8]
                    tickResult.push(tickObj)
                } else {
                    item = item.replace('(', '').replace(')', '')
                    tickObj.price_bid = item.split(',')[0]
                    tickObj.price_ask = item.split(',')[1]
                    tickObj.volume_bid = item.split(',')[2]
                    tickObj.volume_ask = item.split(',')[3]
                    tickResult.push(tickObj)
                }
            }
        })
    } else {
        priceTickArr.forEach(item => {
            if (item) {
                const tickObj = {}
                tickObj.price_bid = priceArr[5]
                tickObj.price_ask = priceArr[6]
                tickObj.volume_bid = priceArr[7]
                tickObj.volume_ask = priceArr[8]
                tickResult.push(tickObj)
            }
        })
    }
    // const priceTickStr = JSON.stringify(p.split(';')).shift().match(/\((.+)\)/)
    // const prictTick = p[1] ?? ''
    // const prictTickArr = prictTick.split(',')

    const curPriceData = {
        symbolId: priceArr[0] * 1,
        trade_type: priceArr[1],
        tick_time: priceArr[3] * 1,
        cur_price: priceArr[4],
        sell_price: priceArr[5],
        buy_price: priceArr[6],
        tickResult
    }
    return curPriceData
}

// 账户持仓浮动盈亏tick字符串转Object对象
export function positionsTickToObj (str) {
    const dataArr = str.split(';')
    const accountData = dataArr[0].match(/\((.+)\)/)[1].split(',')
    const positionsProfitLoss = dataArr.slice(1).map(el => {
        const elData = el.replace(/\(|\)/g, '').split(',')
        return {
            positionId: elData[0],
            profitLoss: elData[1] < 0 ? elData[1] : '+' + elData[1],
        }
    })
    const result = {
        content: {
            availableMargin: accountData[2],
            balance: accountData[5],
            marginRadio: accountData[3],
            netWorth: accountData[4],
            occupyMargin: accountData[1],
            profitLoss: accountData[0],
            positionProfitLossMessages: positionsProfitLoss,
        }
    }
    return result
}

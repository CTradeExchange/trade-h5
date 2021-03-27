
import { priceFormat } from '@/utils/util'

export function tickFormat (data) {
    const digits = data.price_digits
    const tick_deep = data.tick_deep[0]
    data.close_price = priceFormat(data.close_price, digits)
    data.high_price = priceFormat(data.high_price, digits)
    data.low_price = priceFormat(data.low_price, digits)
    data.open_price = priceFormat(data.open_price, digits)
    data.price = priceFormat(data.price, digits)
    data.sell_price = priceFormat(tick_deep.price_bid, digits)
    data.buy_price = priceFormat(tick_deep.price_ask, digits)
    data.yesterday_close_price = priceFormat(data.yesterday_close_price, digits)
}

import request from '@/utils/request'

/* 产品基础信息列表 */
export function querySymbolBaseInfoList (data) {
    return request({
        url: '/global/rtc.RtcSymbolQueryService.querySymbolBaseInfoList',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}
/* 产品信息 */
export function querySymbolInfo (data) {
    return request({
        url: '/global/rtc.RtcSymbolQueryService.querySymbolInfo',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 下单 */
export function addMarketOrder (data) {
    return request({
        url: '/global/tradeapi.OrderApiService.addMarketOrder',
        method: 'post',
        headers: {
            version: '0.0.1',
            group: 'tradeApi'
        },
        data
    })
}
/* 查看持仓列表 */
export function queryPositionPage (data) {
    return request({
        url: '/global/tradeapi.PositionApiService.queryPositionPage',
        method: 'post',
        headers: {
            version: '0.0.1',
            group: 'tradeApi'
        },
        data
    })
}
/* 查看订单列表 */
export function queryOrderPage (data) {
    return request({
        url: '/global/tradeapi.OrderApiService.queryOrderPage',
        method: 'post',
        headers: {
            group: 'tradeApi'
        },
        data
    })
}

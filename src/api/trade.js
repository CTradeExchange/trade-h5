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
/* 平仓历史记录列表 */
export function queryHistoryCloseOrderList (data) {
    return request({
        url: '/global/tradeapi.OrderApiService.queryHistoryCloseOrderList',
        method: 'post',
        headers: {
            group: 'tradeApi',
            version: '0.0.1',
        },
        data
    })
}
/* 查看预埋单列表 */
export function queryPBOOrderPage (data) {
    return request({
        url: '/global/tradeapi.OrderApiService.queryPBOOrderPage',
        method: 'post',
        headers: {
            group: 'tradeApi',
            version: '0.0.1',
        },
        data
    })
}

/* 修改订单 */
export function updateOrder (data) {
    return request({
        url: '/global/tradeapi.OrderApiService.updateOrder',
        method: 'post',
        headers: {
            group: 'tradeApi',
            version: '0.0.1',
        },
        data
    })
}

/* 取消预埋单 */
export function closePboOrder (data) {
    return request({
        url: '/global/tradeapi.OrderApiService.closePboOrder',
        method: 'post',
        headers: {
            group: 'tradeApi',
            version: '0.0.1',
        },
        data
    })
}

/* 根据客户组搜索产品 */
export function getSymbolList (data) {
    return request({
        url: '/global/config.OpenSymbolDubboService.getSymbolList',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

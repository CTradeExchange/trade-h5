import request from '@/utils/request_fundDEX'

// coingecko获取各个基金详情，图标、合约地址等
export function getMarketDetail_coingecko (data = {}) {
    return request({
        url: `https://api.coingecko.com/api/v3/coins/${data.id}`,
        method: 'GET',
        params: data
    })
}

// coingecko获取基金行情列表，市场
export function getMarketList (data = {}) {
    return request({
        url: 'https://api.coingecko.com/api/v3/coins/markets',
        method: 'GET',
        params: data
    })
}

// coingecko获取基金行情价格 统计
export function getMarketChart_coingecko (data = {}) {
    return request({
        url: `https://api.coingecko.com/api/v3/coins/${data.id}/market_chart`,
        method: 'GET',
        params: data
    })
}

// 查询ETH价格
export function getETHPrice (data = {}) {
    // 代理地址： https://uatwppc-5.cmfbl.com/coingecko/api/v3/simple/price?ids=ethereum&vs_currencies=usd
    // 原地址： https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd
    return request({
        url: 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
        method: 'GET',
        params: data
    })
}

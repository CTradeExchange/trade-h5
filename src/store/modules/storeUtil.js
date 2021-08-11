// 根据玩法板块创建产品列表
export function createListByPlans (plans) {
    const planMap = {}
    const symbolList = []
    plans.forEach(symbolKey => {
        const [symbolId, tradeType] = symbolKey.split('_')
        symbolList.push({ symbolId, tradeType, symbolKey })
        if (!planMap[tradeType]) planMap[tradeType] = []
        planMap[tradeType].push(symbolId)
    })
    Object.keys(planMap).forEach(tradeType => {
        planMap[tradeType] = [...new Set(planMap[tradeType])]
    })
    return {
        symbolList,
        planMap,
    }
}

// 玩法map数据转换成list数组
export function planMapToArray (params) {
    const result = Object.keys(params).map(tradeType => {
        const symbolList = params[tradeType].symbolList || params[tradeType]
        return {
            symbolIds: symbolList.join(),
            tradeType
        }
    })
    return result
}

// 缓存本次挂单列表、持仓列表的请求参数
export function cachePendingParams (params, cacheConfig) {
    const { tradeType } = params
    const curType = cacheConfig[tradeType]
    if (curType) {
        Object.assign(curType, params)
    } else {
        cacheConfig[tradeType] = params
    }
}

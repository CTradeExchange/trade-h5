// 根据玩法板块创建产品列表
export function createListByPlans (plans, customerGroupId) {
    const planMap_codeIds = {}
    Object.keys(plans).forEach(tradeType => {
        const categories = plans[tradeType]
        categories.forEach(el => {
            const code_ids = el.list[customerGroupId]
            if (!planMap_codeIds[tradeType] && code_ids) {
                planMap_codeIds[tradeType] = [...code_ids]
            } else if (code_ids) {
                planMap_codeIds[tradeType].push(...code_ids)
            }
        })
    })
    planMap_codeIds['1'].push('11', '24')
    Object.keys(planMap_codeIds).forEach(tradeType => {
        planMap_codeIds[tradeType] = [...new Set(planMap_codeIds[tradeType])]
    })
    return {
        symbolList: createProductListByPlans(planMap_codeIds),
        planMap: planMap_codeIds
    }
}

// 将玩法分类的产品列表生成symbolId_tradeType的产品列表
export function createProductListByPlans (plans) {
    const result = []
    Object.keys(plans).forEach(tradeType => {
        if (!plans[tradeType]) return false
        const keys = plans[tradeType].map(symbolId => ({ symbolId, tradeType, symbolKey: `${symbolId}_${tradeType}` }))
        result.push(...keys)
    })
    return result
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

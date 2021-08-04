export const categories = [{
    title: '数字币',
    id: 'JKIF9408691_11',
    tagDiplay: '3',
    accountType: ['G', 'D', 'R_1', 'R_2'],
    code_ids_all: {
        1: {
            1: ['36', '37', '38'],
            2: ['36', '37', '38'],
        },
        2: {
            1: ['36', '37', '38'],
            2: ['36', '37', '38'],
        },
        3: {
            1: ['36', '37', '38'],
            2: ['36', '37', '38'],
        },
    }
}]

// 根据玩法板块创建产品列表
export function createListByPlans (plans, customerGroupId) {
    const planMap_codeIds = {}
    plans.forEach(el => {
        const code_ids_all = el.code_ids_all
        Object.keys(code_ids_all).forEach(tradeType => {
            const code_ids = code_ids_all[tradeType][customerGroupId]
            if (!planMap_codeIds[tradeType]) {
                planMap_codeIds[tradeType] = code_ids
            } else {
                planMap_codeIds[tradeType].push(...code_ids)
            }
        })
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

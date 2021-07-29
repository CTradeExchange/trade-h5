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
    const plan_codeIds = {}
    plans.forEach(el => {
        const code_ids_all = el.code_ids_all
        Object.keys(code_ids_all).forEach(tradeType => {
            const code_ids = code_ids_all[tradeType][customerGroupId]
            if (!plan_codeIds[tradeType] && code_ids) {
                plan_codeIds[tradeType] = code_ids
            } else if (code_ids) {
                plan_codeIds[tradeType].push(...code_ids)
            }
        })
    })
    console.log(plan_codeIds)
    return createProductListByPlans(plan_codeIds)
}

// 将玩法分类的产品列表生成symbolId_tradeType的产品列表
export function createProductListByPlans (plans) {
    const result = []
    Object.keys(plans).forEach(tradeType => {
        const keys = plans[tradeType].map(symbolId => ({ symbolId, tradeType }))
        result.push(...keys)
    })
    return result
}

import { querySymbolBaseInfoList, querySymbolInfo } from '@/api/trade'

export default {
    namespaced: true,
    state: {
        productList: [], // 产品列表
        productMap: {}, // 产品列表
    },
    mutations: {
        // 更新产品列表
        Update_productList (state, data = []) {
            state.productList = data
            const productMap = state.productMap
            data.forEach(item => {
                if (!item || productMap[item.symbolId]) return false
                productMap[item.symbolId] = item
            })
        },
        // 更新某个产品信息
        Update_product (state, data = {}) {
            const productMap = state.productMap
            const prodocut = productMap[data.symbol_id]
            if (!prodocut) return false
            Object.assign(prodocut, data)
        },
        // 更新某个产品报价
        Update_productTick (state, data = {}) {
            const productMap = state.productMap
            const prodocut = productMap[data.symbolId]
            if (!prodocut) return false
            if (data.price - prodocut.high_price > 0) data.high_price = data.price
            if (data.price - prodocut.low_price < 0) data.low_price = data.price
            Object.assign(prodocut, data)
        },
    },
    actions: {
        // 产品基础信息列表
        querySymbolBaseInfoList ({ dispatch, commit, state }, params = {}) {
            const productMap = state.productMap
            const symbolIds = params.symbolIds.split(',')
                .filter(el => !productMap[el].symbolName)
                .join()
            if (symbolIds.length === 0) return Promise.resolve({ code: '0', data: [] })
            return querySymbolBaseInfoList({ ...params, symbolIds }).then((res) => {
                if (res.check()) {
                    res.data.forEach(el => {
                        el.symbol_id = el.symbolId
                        commit('Update_product', el)
                    })
                }
                return res
            })
        },
        // 产品详细信息
        querySymbolInfo ({ dispatch, commit, state }, params = {}) {
            return querySymbolInfo(params).then((res) => {
                if (res.check()) {
                }
                return res
            })
        },
    }
}

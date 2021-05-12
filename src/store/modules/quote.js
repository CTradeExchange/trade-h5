import { querySymbolBaseInfoList, querySymbolInfo } from '@/api/trade'
import { plus } from '@/utils/calculation'
import CheckAPI from '@/utils/checkAPI'

// 处理显示的点差  点差=（买价-卖价）/pip
function spreadText (product) {
    const pip = Math.pow(0.1, product.price_digits) * product.pointRatio
    const spread = (product.buy_price - product.sell_price) / pip
    const spDigit = String(product.pointRatio).length - 1 // 点差小数位
    product.spread_text = spread.toFixed(spDigit)
}

// 报价计算点差
function price_spread (product, data) {
    if (product.askSpread && data.buy_price) product.buy_price = plus(data.buy_price, product.askSpread).toFixed(product.price_digits)
    if (product.bidSpread && data.sell_price) product.sell_price = plus(data.sell_price, product.bidSpread).toFixed(product.price_digits)
}

export default {
    namespaced: true,
    state: {
        productList: [], // 产品列表
        productMap: {}, // 产品列表
        productActivedID: null, // 当前操作的产品ID
    },
    mutations: {
        // 更新产品列表
        Update_productList (state, data = []) {
            console.log('Update_productList', data)
            state.productList = data
            const productMap = state.productMap
            data.forEach(item => {
                if (!item) return false
                productMap[item.symbolId] = item
            })
        },
        // 更新某个产品信息、报价快照
        Update_product (state, data = {}) {
            const productMap = state.productMap
            const symbolId = data.symbol_id || data.symbolId
            const product = productMap[symbolId]
            if (!product) return false
            // if(product.price && data.price) return false; // 已经拿到产品快照，不在重复处理
            const askSpread = product.askSpread
            Object.assign(product, data)

            // 该产品先拿到快照价格，后拿到点差，需要重新计算价格点差
            if (!askSpread && data.askSpread && data.pointRatio) {
                spreadText(product)
                price_spread(product, { ...data, ...product })
            }
        },
        // 更新某个产品报价
        Update_productTick (state, data = {}) {
            const productMap = state.productMap
            const symbolId = data.symbol_id || data.symbolId
            const product = productMap[symbolId]
            if (!product) return false
            if (data.price - product.high_price > 0) data.high_price = data.price
            if (data.price - product.low_price < 0) data.low_price = data.price
            if (!product.buy_price_pre) {
                product.buy_price_pre = data.buy_price * 1
                product.sell_price_pre = data.sell_price * 1
                product.cur_price_pre = data.cur_price * 1
                product.cur_color = product.buy_color = product.sell_color = 'grayColor'
            }
            product.cur_color = data.cur_price * 1 === product.cur_price_pre ? product.cur_color : data.cur_price < product.cur_price_pre ? 'fallColor' : 'riseColor'
            product.buy_color = data.buy_price * 1 === product.buy_price_pre ? product.buy_color : data.buy_price < product.buy_price_pre ? 'fallColor' : 'riseColor'
            product.sell_color = data.sell_price * 1 === product.sell_price_pre ? product.sell_color : data.sell_price < product.sell_price_pre ? 'fallColor' : 'riseColor'
            product.cur_price_pre = product.cur_price * 1
            product.buy_price_pre = product.buy_price * 1
            product.sell_price_pre = product.sell_price * 1
            Object.assign(product, data)
            spreadText(product)
            price_spread(product, data)
        },
        Update_productActivedID (state, id) {
            sessionStorage.setItem('productActived', JSON.stringify(state.productMap[id]))
            state.productActivedID = id
        }
    },
    actions: {
        // 产品基础信息列表
        querySymbolBaseInfoList ({ dispatch, commit, state, rootState }, symbolIds = []) {
            const productMap = state.productMap

            const newSymbolIds = symbolIds.filter(el => !productMap[el].symbolName)
            const guestCustomerGroupId = rootState._base.wpCompanyInfo.customerGroupId
            const params = {
                symbolIds: newSymbolIds.join(),
                tradeType: parseInt(rootState._base.tradeType),
                customerGroupId: rootState._user.customerInfo?.customerGroupId ?? guestCustomerGroupId,
                accountId: rootState._user.customerInfo?.accountId,
            }

            if (newSymbolIds.length === 0) return Promise.resolve(new CheckAPI({ code: '0', data: [] }))

            return querySymbolBaseInfoList(params).then((res) => {
                console.log('querySymbolBaseInfoList')
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
        querySymbolInfo ({ dispatch, commit, state, rootState }, symbolId) {
            const productMap = state.productMap

            if (productMap[symbolId].contractSize) return Promise.resolve(new CheckAPI({ code: '0', data: {} }))
            const guestCustomerGroupId = rootState._base.wpCompanyInfo.customerGroupId
            const params = {
                symbolId: Number(symbolId),
                tradeType: rootState._base.tradeType,
                customerGroupId: rootState._user.customerInfo?.customerGroupId ?? guestCustomerGroupId,
                // accountId: rootState._user.customerInfo?.accountId,
            }
            return querySymbolInfo(params).then((res) => {
                if (res.check() && res.data) {
                    commit('Update_product', res.data)
                    if (rootState._quote.productActivedID === symbolId) {
                        sessionStorage.setItem('productActived', JSON.stringify(productMap[symbolId]))
                    }
                }
                return res
            })
        },
    }
}

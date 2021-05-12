import { queryPositionPage, queryHistoryCloseOrderList, queryPBOOrderPage } from '@/api/trade'
import CheckAPI from '@/utils/checkAPI'

const EmptyProfitLossRang = {
    buyProfitRange: [], // 买入止盈范围
    sellProfitRange: [], // 卖出止盈范围
    buyStopLossRange: [], // 买入止损范围
    sellStopLossRange: [], // 卖出止损范围
}
const EmptyPendingPriceRang = {
    buyLimitRange: [], // 买入止盈范围
    sellLimitRange: [], // 卖出止盈范围
    buyStopRange: [], // 买入止损范围
    sellStopRange: [], // 卖出止损范围
}

export default {
    namespaced: true,
    state: {
        pendingPrice: 0, // 挂单价格
        positionLoading: '', // 持仓列表加载
        positionList: [], // 持仓列表
        historyLoading: false, // 历史记录加载
        historyList: [], // 平仓历史记录列表
        pendingList: [], // 预埋单列表
        positionProfitLossList: [] // 持仓盈亏列表
    },
    getters: {
        // 当前操作的产品
        product (state, getters, rootState) {
            const productID = rootState._quote.productActivedID
            const product = rootState._quote.productMap[productID]
            return product
        },
        // 市价止盈止损范围
        marketProfitLossRang (state, getters, rootState) {
            const product = getters.product
            if (!product) return EmptyProfitLossRang
            const digits = product.price_digits
            const point = Math.pow(0.1, digits)
            const pip = point * product.pointRatio
            let buyProfitMax, // 买入止盈范围最大值
                buyProfitMin, // 买入止盈范围最小值
                sellProfitMax, // 卖出止盈范围最大值
                sellProfitMin, // 卖出止盈范围最小值
                buyStopLossMax, // 买入止损范围最大值
                buyStopLossMin, // 买入止损范围最小值
                sellStopLossMax, // 卖出止损范围最大值
                sellStopLossMin // 卖出止损范围最小值

            const buy_price = state.pendingPrice ? Number(state.pendingPrice) : Number(product.buy_price)
            const sell_price = state.pendingPrice ? Number(state.pendingPrice) : Number(product.sell_price)

            buyProfitMax = (buy_price + pip * product.stopLossMaxPoint).toFixed(digits) // 买入价+pip*限价最大距离
            buyProfitMin = (buy_price + pip * product.stopLossMinPoint).toFixed(digits) // 买入价+pip*限价最小距离

            sellProfitMax = (sell_price - pip * product.stopLossMinPoint).toFixed(digits) // 卖出价-pip*限价最小距离

            sellProfitMin = (sell_price - pip * product.stopLossMaxPoint).toFixed(digits) // 卖出价-pip*限价最大距离

            buyStopLossMax = (buy_price - pip * product.stopLossMinPoint).toFixed(digits) // 买入价-pip*限价最小距离
            buyStopLossMin = (buy_price - pip * product.stopLossMaxPoint).toFixed(digits) // 买入价-pip*限价最大距离

            sellStopLossMax = (sell_price + pip * product.stopLossMaxPoint).toFixed(digits) // 卖出价+pip*限价最大距离
            sellStopLossMin = (sell_price + pip * product.stopLossMinPoint).toFixed(digits) // 卖出价+pip*限价最小距离

            return {
                buyProfitRange: [buyProfitMin, buyProfitMax], // 买入止盈范围
                sellProfitRange: [sellProfitMin, sellProfitMax], // 卖出止盈范围
                buyStopLossRange: [buyStopLossMin, buyStopLossMax], // 买入止损范围
                sellStopLossRange: [sellStopLossMin, sellStopLossMax], // 卖出止损范围
            }
        },
        // 挂单价格范围
        pendingPriceRang (state, getters, rootState) {
            const product = getters.product
            if (!product || state.pendingPrice === 0) return EmptyPendingPriceRang
            const digits = product.price_digits
            const point = Math.pow(0.1, digits)
            const pip = point * product.pointRatio
            let buyLimitMax, // 限价买入范围最大值
                buyLimitMin, // 限价买入范围最小值
                sellLimitMax, // 限价卖出范围最大值
                sellLimitMin, // 限价卖出范围最小值
                buyStopMax, // 停损买入范围最大值
                buyStopMin, // 停损买入范围最小值
                sellStopMax, // 停损卖出范围最大值
                sellStopMin // 停损卖出范围最小值

            const buy_price = Number(product.buy_price)
            const sell_price = Number(product.sell_price)

            buyLimitMax = (buy_price - pip * product.priceMinLimit).toFixed(digits) // 买入价-pip*限价最小距离
            buyLimitMin = (buy_price - pip * product.priceMaxLimit).toFixed(digits) // 买入价-pip*限价最大距离

            sellLimitMax = (sell_price + pip * product.priceMaxLimit).toFixed(digits) // 卖出价+pip*限价最大距离
            sellLimitMin = (sell_price + pip * product.priceMinLimit).toFixed(digits) // 卖出价+pip*限价最小距离

            buyStopMax = (buy_price + pip * product.priceMaxLimit).toFixed(digits) // 买入价+pip*止损最大距离
            buyStopMin = (buy_price + pip * product.priceMinLimit).toFixed(digits) // 买入价+pip*止损最小距离

            sellStopMax = (sell_price - pip * product.priceMinLimit).toFixed(digits) // 卖出价-pip*止损最小距离
            sellStopMin = (sell_price - pip * product.priceMaxLimit).toFixed(digits) // 卖出价-pip*止损最大距离

            return {
                buyLimitRange: [buyLimitMin, buyLimitMax], // 限价买入范围
                sellLimitRange: [sellLimitMin, sellLimitMax], // 限价卖出范围
                buyStopRange: [buyStopMin, buyStopMax], // 停损买入范围
                sellStopRange: [sellStopMin, sellStopMax], // 停损卖出范围
            }
        }
    },
    mutations: {
        Update_pendingPrice (state, data) {
            state.pendingPrice = data
        },
        Update_positionLoading (state, data) {
            state.positionLoading = data
        },
        Update_positionList (state, data) {
            state.positionList = data
        },
        Update_historyLoading (state, data) {
            state.historyLoading = data
        },
        Update_historyList (state, data) {
            state.historyList = data
        },
        Update_pendingList (state, data) {
            state.pendingList = data
        },
        Update_positionItem (state, data) {
            state.positionList.push(data)
        },
        Update_positionProfitLossList (state, data) {
            state.positionProfitLossList = data
        }
    },
    actions: {
        // 查询持仓列表
        queryPositionPage ({ dispatch, commit, state, rootState }, params = {}) {
            const accountListLen = rootState._user.customerInfo?.accountList?.length
            dispatch('queryPBOOrderPage')
            if (!accountListLen) {
                commit('Update_positionList', [])
                return Promise.resolve(new CheckAPI({ code: '0', data: [] })) // 没有交易账户直接返回空持仓
            }
            commit('Update_positionLoading', true)
            return queryPositionPage(params).then((res) => {
                commit('Update_positionLoading', false)
                if (res.check()) {
                    commit('Update_positionList', res.data)
                }
                return res
            })
        },
        // 平仓历史记录列表
        queryHistoryCloseOrderList ({ dispatch, commit, state, rootState }, params = {}) {
            const accountListLen = rootState._user.customerInfo?.accountList?.length
            if (!accountListLen) {
                commit('Update_historyList', [])
                return Promise.resolve(new CheckAPI({ code: '0', data: [] })) // 没有交易账户直接返回空数据
            }
            commit('Update_historyLoading', true)
            return queryHistoryCloseOrderList(params).then((res) => {
                commit('Update_historyLoading', false)
                if (res.check()) {
                    const newList = params.current === 1 ? res.data.list : state.historyList.concat(res.data.list)
                    commit('Update_historyList', newList)
                }
                return res
            })
        },
        // 预埋单列表
        queryPBOOrderPage ({ dispatch, commit, state, rootState }, params = {}) {
            const accountListLen = rootState._user.customerInfo?.accountList?.length
            if (!accountListLen) {
                commit('Update_pendingList', [])
                return Promise.resolve(new CheckAPI({ code: '0', data: [] })) // 没有交易账户直接返回空数据
            }
            return queryPBOOrderPage(params).then((res) => {
                if (res.check()) {
                    commit('Update_pendingList', res.data)
                }
                return res
            })
        },
    }
}

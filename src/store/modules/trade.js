import { queryPositionPage, queryHistoryCloseOrderList, queryPBOOrderPage } from '@/api/trade'
import CheckAPI from '@/utils/checkAPI'
import { minus, toFixed, plus } from '@/utils/calculation'
import BigNumber from 'bignumber.js'

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
        modifyPositionId: 0, // 修改持仓ID
        pendingEnable: false, // 启用挂单
        pendingPrice: 0, // 挂单价格
        positionLoading: '', // 持仓列表加载
        positionList: [], // 持仓列表
        positionMap: {}, // 持仓列表map
        historyLoading: false, // 历史记录加载
        historyList: [], // 平仓历史记录列表
        pendingList: [], // 预埋单列表
        pendingMap: {}, // 预埋单列表
        positionProfitLossList: [] // 持仓盈亏列表
    },
    getters: {
        // 当前操作的产品
        product (state, getters, rootState) {
            const productID = rootState._quote.productActivedID
            const product = rootState._quote.productMap[productID]
            return product
        },
        // 市价、持仓止盈止损范围
        marketProfitLossRang (state, getters, rootState) {
            const product = getters.product
            if (!product) return EmptyProfitLossRang
            const curPosition = state.positionMap[state.modifyPositionId] // 当前修改的持仓
            const digits = product.price_digits
            const point = Math.pow(0.1, digits)
            const pip = point * product.pointRatio

            let buy_price = state.pendingPrice ? state.pendingPrice : product.buy_price
            let sell_price = state.pendingPrice ? state.pendingPrice : product.sell_price
            if (curPosition) {
                // 如果当前是修改持仓，公式里面的价格则是：买方向取卖价、卖方向取买价
                buy_price = sell_price = curPosition.direction === 1 ? product.sell_price : product.buy_price
            }

            const buyProfitMax = BigNumber(buy_price).plus(pip * product.stopLossMaxPoint).toFixed(digits) // 买入止盈范围最大值 买入价+pip*限价最大距离
            const buyProfitMin = BigNumber(buy_price).plus(pip * product.stopLossMinPoint).toFixed(digits) // 买入止盈范围最小值 买入价+pip*限价最小距离

            const sellProfitMax = BigNumber(sell_price).minus(pip * product.stopLossMinPoint).toFixed(digits) // 卖出止盈范围最大值 卖出价-pip*限价最小距离
            const sellProfitMin = BigNumber(sell_price).minus(pip * product.stopLossMaxPoint).toFixed(digits) // 卖出止盈范围最小值 卖出价-pip*限价最大距离

            const buyStopLossMax = BigNumber(buy_price).minus(pip * product.stopLossMinPoint).toFixed(digits) // 买入止损范围最大值 买入价-pip*限价最小距离
            const buyStopLossMin = BigNumber(buy_price).minus(pip * product.stopLossMaxPoint).toFixed(digits) // 买入止损范围最小值 买入价-pip*限价最大距离

            const sellStopLossMax = BigNumber(sell_price).plus(pip * product.stopLossMaxPoint).toFixed(digits) // 卖出止损范围最大值 卖出价+pip*限价最大距离
            const sellStopLossMin = BigNumber(sell_price).plus(pip * product.stopLossMinPoint).toFixed(digits) // 卖出止损范围最小值 卖出价+pip*限价最小距离

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
            if (!product || !state.pendingEnable) return EmptyPendingPriceRang
            const digits = product.price_digits
            const point = Math.pow(0.1, digits)
            const pip = point * product.pointRatio

            const buy_price = product.buy_price
            const sell_price = product.sell_price

            const buyLimitMax = BigNumber(buy_price).minus(pip * product.priceMinLimit).toFixed(digits) // 限价买入范围最大值 买入价-pip*限价最小距离
            const buyLimitMin = BigNumber(buy_price).minus(pip * product.priceMaxLimit).toFixed(digits) // 限价买入范围最小值 买入价-pip*限价最大距离

            const sellLimitMax = BigNumber(sell_price).plus(pip * product.priceMaxLimit).toFixed(digits) // 限价卖出范围最大值 卖出价+pip*限价最大距离
            const sellLimitMin = BigNumber(sell_price).plus(pip * product.priceMinLimit).toFixed(digits) // 限价卖出范围最小值 卖出价+pip*限价最小距离

            const buyStopMax = BigNumber(buy_price).plus(pip * product.priceMaxLimit).toFixed(digits) // 停损买入范围最大值 买入价+pip*止损最大距离
            const buyStopMin = BigNumber(buy_price).plus(pip * product.priceMinLimit).toFixed(digits) // 停损买入范围最小值 买入价+pip*止损最小距离

            const sellStopMax = BigNumber(sell_price).minus(pip * product.priceMinLimit).toFixed(digits) // 停损卖出范围最大值 卖出价-pip*止损最小距离
            const sellStopMin = BigNumber(sell_price).minus(pip * product.priceMaxLimit).toFixed(digits) // 停损卖出范围最小值 卖出价-pip*止损最大距离

            const priceMinLimit = product.priceMinLimit + 10
            const priceMinLimitPrice = toFixed(priceMinLimit * pip, digits)
            const defaultBuyPrice = minus(buy_price, priceMinLimitPrice) // 买入方向挂单价格默认值
            const defaultSellPrice = plus(sell_price, priceMinLimitPrice) // 卖出方向挂单价格默认值
            return {
                buyLimitRange: [buyLimitMin, buyLimitMax], // 限价买入范围
                sellLimitRange: [sellLimitMin, sellLimitMax], // 限价卖出范围
                buyStopRange: [buyStopMin, buyStopMax], // 停损买入范围
                sellStopRange: [sellStopMin, sellStopMax], // 停损卖出范围
                defaultBuyPrice, // 买入方向挂单价格默认值
                defaultSellPrice, // 卖出方向挂单价格默认值
            }
        }
    },
    mutations: {
        Empty_data (state, data) { // 清空信息
            state.positionList = []
            state.positionMap = {}
            state.historyList = []
            state.pendingList = []
            state.pendingMap = {}
            state.positionProfitLossList = []
        },
        Update_modifyPositionId (state, data) {
            state.modifyPositionId = data
        },
        Update_pendingEnable (state, data) {
            state.pendingEnable = data
        },
        Update_pendingPrice (state, data) {
            state.pendingPrice = data
        },
        Update_positionLoading (state, data) {
            state.positionLoading = data
        },
        Update_positionList (state, data) {
            state.positionList = data
            const positionMap = state.positionMap
            data.forEach(item => {
                if (!item || !item.positionId) return false
                const curPosition = positionMap[item.positionId]
                if (curPosition) Object.assign(item, { profitLoss: curPosition.profitLoss }) // 如果map数据中已经有此持仓信息，将之合并到item
                positionMap[item.positionId] = item
            })
        },
        Update_historyLoading (state, data) {
            state.historyLoading = data
        },
        Update_historyList (state, data) {
            state.historyList = data
        },
        Update_pendingList (state, data) {
            state.pendingList = data
            const pendingMap = state.pendingMap
            data.forEach(item => {
                if (!item || !item.id) return false
                if (!pendingMap[item.id]) pendingMap[item.id] = {}
                Object.assign(pendingMap[item.id], item)
            })
        },
        Update_positionProfitLossList (state, dataList = []) {
            state.positionProfitLossList = dataList
            const positionMap = state.positionMap
            dataList.forEach(({ positionId, profitLoss }) => {
                if (positionMap[positionId]) positionMap[positionId].profitLoss = profitLoss
                else positionMap[positionId] = { profitLoss }
            })
        },
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

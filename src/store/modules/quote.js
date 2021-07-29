import { querySymbolBaseInfoList, querySymbolInfo } from '@/api/trade'
import { toFixed } from '@/utils/calculation'
import { vue_set, assign } from '@/utils/vueUtil.js'
import { sessionSet } from '@/utils/util.js'
import CheckAPI from '@/utils/checkAPI'
import BigNumber from 'bignumber.js'

// 处理显示的点差  点差=（买价-卖价）/pip
function spreadText (product) {
    if (!product.hasOwnProperty('pointRatio') || !product.buy_price) return
    const pip = BigNumber(0.1).pow(product.price_digits).times(product.pointRatio).toNumber()
    const spread = BigNumber(product.buy_price).minus(product.sell_price).div(pip).toNumber()
    const spDigit = String(product.pointRatio).length - 1 // 点差小数位
    const spread_text = spread.toFixed(spDigit)
    vue_set(product, 'spread_text', spread_text)
}

// 报价计算点差
function price_spread (product, data) {
    if (product.hasOwnProperty('askSpread') && data.buy_price) product.buy_price = BigNumber(data.buy_price).plus(product.askSpread || 0).toFixed(product.price_digits)
    if (product.hasOwnProperty('bidSpread') && data.sell_price) product.sell_price = BigNumber(data.sell_price).plus(product.bidSpread || 0).toFixed(product.price_digits)
    spreadText(product)
}
/** 价格转点数  点数=价差/（Point*大点比率）
 * 点差小数位显示规则：
    根据大点比率进行显示，大点比率的值一般为1（10的0次方）、10（10的1次方）、100（10的2次方）、1000（10的3次方）
    则点差的小数位分别对应为0位、1位、2位、3位
    例如：EURUSD卖价：1.19323 ，买价：1.19341，大点比率为10，则点差=（1.19341-1.19323）/10*0.00001=1.8
 */
function priceToPip (price, product) {
    if (product && product.hasOwnProperty('pointRatio')) {
        const spDigit = String(product.pointRatio || 0).length - 1 // 点差小数位
        const pip = BigNumber(0.1).pow(product.price_digits).times(product.pointRatio) // 1pip=point*大点比率
        return BigNumber(price).div(pip).toFixed(spDigit)
    } else {
        return ''
    }
}

export default {
    namespaced: true,
    state: {
        productList: [], // 产品列表
        productMap: {}, // 产品列表
        productActivedID: null, // 当前操作的产品ID
        handicapList: [], // 盘口实时深度报价
        dealList: [] // 成交数据
    },
    mutations: {
        // 清空产品数据
        Empty_data (state) {
            state.productList = []
            state.productMap = {}
            state.productActivedID = null
        },
        // 更新产品列表
        Update_productList (state, data = []) {
            state.productList = data
            const productMap = state.productMap
            data.forEach(item => {
                if (!item) return false
                vue_set(productMap, String(item.symbolId), item)
            })
        },
        // 更新某个产品信息、报价快照
        Update_product (state, data = {}) {
            const productMap = state.productMap
            const symbolId = data.symbolId || data.symbol_id
            const product = productMap[symbolId]
            if (!product) return false
            // if(product.price && data.price) return false; // 已经拿到产品快照，不在重复处理
            const askSpread = product.hasOwnProperty('askSpread')
            data.spread_text = product.spread_text || '--'
            assign(product, data)

            // 该产品先拿到快照价格，后拿到点差，需要重新计算价格点差
            if (!askSpread && data.hasOwnProperty('askSpread') && data.hasOwnProperty('pointRatio')) {
                price_spread(product, { ...data, ...product })
            }
        },
        // 更新某个产品报价
        Update_productTick (state, dataArr = []) {
            const productMap = state.productMap
            dataArr.forEach(data => {
                const symbolId = data.symbolId || data.symbol_id
                const product = productMap[symbolId]
                if (!product) return false
                const digits = data.price_digits || product.price_digits
                data.cur_price = toFixed(data.cur_price, digits) // 中间价补0操作，买卖价在计算完点差后自动补0
                if (BigNumber(data.cur_price).gt(product.high_price)) data.high_price = data.cur_price
                if (BigNumber(data.cur_price).lt(product.low_price)) data.low_price = data.cur_price
                if (!product.buy_price_pre) { // 缓存上一口价的裸行情
                    vue_set(product, 'buy_price_pre', data.buy_price)
                    vue_set(product, 'sell_price_pre', data.sell_price)
                    vue_set(product, 'cur_price_pre', data.cur_price)
                    vue_set(product, 'yesterday_close_price', data.yesterday_close_price)
                    vue_set(product, 'price_digits', data.price_digits)
                    vue_set(product, 'cur_color', 'grayColor')
                    vue_set(product, 'buy_color', 'grayColor')
                    vue_set(product, 'sell_color', 'grayColor')
                }
                // 计算涨跌
                product.cur_color = BigNumber(data.cur_price).eq(product.cur_price_pre) ? product.cur_color : BigNumber(data.cur_price).lt(product.cur_price_pre) ? 'fallColor' : 'riseColor'
                product.buy_color = BigNumber(data.buy_price).eq(product.buy_price_pre) ? product.buy_color : BigNumber(data.buy_price).lt(product.buy_price_pre) ? 'fallColor' : 'riseColor'
                product.sell_color = BigNumber(data.sell_price).eq(product.sell_price_pre) ? product.sell_color : BigNumber(data.sell_price).lt(product.sell_price_pre) ? 'fallColor' : 'riseColor'

                const upDownAmount = BigNumber(data.cur_price).minus(product.yesterday_close_price).toFixed(product.price_digits) // 涨跌额
                const upDownAmount_pip = priceToPip(upDownAmount, product) // 涨跌额(点)
                const upDownWidth = BigNumber(upDownAmount).div(product.yesterday_close_price).times(100).toFixed(2) + '%' // 涨跌幅
                const upDownColor = upDownAmount >= 0 ? 'riseColor' : 'fallColor'
                vue_set(product, 'upDownAmount', upDownAmount)
                vue_set(product, 'upDownAmount_pip', upDownAmount_pip)
                vue_set(product, 'upDownWidth', upDownWidth)
                vue_set(product, 'upDownColor', upDownColor)

                // 更新上一口价的裸行情
                product.cur_price_pre = data.cur_price
                product.buy_price_pre = data.buy_price
                product.sell_price_pre = data.sell_price
                assign(product, data)
                price_spread(product, data)
            })
        },
        Update_productActivedID (state, id) {
            sessionSet('productActived', JSON.stringify(state.productMap[id]))
            state.productActivedID = id
        },
        Update_handicapList (state, data = {}) {
            // type 1: 快照 2 实时
            if (Number(data.type === 1)) {
                state.handicapList = data.list
            } else {
                state.handicapList[0].ask_deep = data.tickList.ask_deep
                state.handicapList[0].bid_deep = data.tickList.bid_deep
            }
        },
        Update_dealList (state, data = {}) {
            state.dealList.unshift(data)
            state.dealList = state.dealList.splice(0, 10)
        }
    },
    actions: {
        // 整理当前账户组的所有产品列表，自选产品+产品板块的产品
        // 此方法只有在账户变化后调用
        setProductAllList ({ dispatch, commit, state, rootState, rootGetters }) {
            commit('Empty_data')

            const customerGroupId = rootGetters.customerGroupId
            const selfSymbolProduct = rootState._base.wpSelfSymbol.find(el => el.tag === 'selfSymbol')?.data?.product || {}
            const selfSymbolList = selfSymbolProduct[customerGroupId] || []
            const productList = [...selfSymbolList]
            rootGetters.userProductCategory.forEach(el => {
                productList.push(...el.code_ids)
            })
            const productAllList = [...new Set(productList)].map(el => ({ symbolId: parseInt(el) }))
            commit('Update_productList', productAllList)
            commit('Update_productActivedID', selfSymbolList[0])
            return [...new Set(productList)]
        },
        // 产品基础信息列表
        querySymbolBaseInfoList ({ dispatch, commit, state, rootState, rootGetters }, symbolIds = []) {
            const productMap = state.productMap
            if (symbolIds === null) symbolIds = rootState._quote.productList.map(el => el.symbolId)
            const newSymbolIds = symbolIds.filter(el => !productMap[el].symbolName)
            const params = {
                symbolIds: newSymbolIds.join(),
                tradeType: parseInt(rootState._base.tradeType),
                customerGroupId: rootGetters.customerGroupId,
                accountId: rootState._user.customerInfo?.accountId,
            }

            if (newSymbolIds.length === 0) return Promise.resolve(new CheckAPI({ code: '0', data: [] }))

            return querySymbolBaseInfoList(params).then((res) => {
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
        querySymbolInfo ({ dispatch, commit, state, rootState, rootGetters }, symbolId) {
            const productMap = state.productMap

            if (productMap[symbolId].contractSize) return Promise.resolve(new CheckAPI({ code: '0', data: {} }))
            const params = {
                symbolId: Number(symbolId),
                tradeType: rootState._base.tradeType,
                customerGroupId: rootGetters.customerGroupId,
                // accountId: rootState._user.customerInfo?.accountId,
            }
            return querySymbolInfo(params).then((res) => {
                if (res.check() && res.data) {
                    commit('Update_product', res.data)
                    if (rootState._quote.productActivedID === symbolId) {
                        sessionSet('productActived', JSON.stringify(productMap[symbolId]))
                    }
                }
                return res
            })
        },
    }
}

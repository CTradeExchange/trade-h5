import { findSymbolBaseInfoList, querySymbolInfo, getEquityPremiumRate } from '@/api/trade'
import { findFundPage, fundNetValueChangeQuote, getFundInfo } from '@/api/fund'
import { toFixed } from '@/utils/calculation'
import { vue_set, assign } from '@/utils/vueUtil.js'
import { sessionSet, sessionGet } from '@/utils/util.js'
import { createListByPlans, planMapToArray } from './storeUtil.js'
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
        if (!parseFloat(pip)) return ''
        return BigNumber(price).div(pip).toFixed(spDigit)
    } else {
        return ''
    }
}

export default {
    namespaced: true,
    state: {
        symbolBaseLoaded: 0, // 产品精简信息加载状态 0未开始 1加载中 2加载完成
        productList: [], // 产品列表
        productMap: {}, // 产品列表
        planMap: {}, // 管理所有玩法及每个玩法下的所有产品
        productActivedID: sessionGet('productActived'), // 当前操作的产品ID
        handicapList: [], // 盘口实时深度报价
        dealList: [], // 成交数据,
        curTradeType: '', // 资产页面当前选中的玩法id
        deepthDigits: '',
        fundProductList: [], // 基金产品列表
        fundInfo: null, // 当前操作的基金产品
    },
    getters: {
        // 用户自选列表
        userSelfSymbolList (state, getters, rootState, rootGetters) {
            if (rootState._user.customerInfo?.optional === 1) {
                const selfSymbolList = rootState._user.selfSymbolList
                const result = {}
                Object.keys(selfSymbolList).forEach(el => {
                    result[el] = selfSymbolList[el].map(item => item.symbolId)
                })
                return result
            } else {
                const wpSelfSymbol = rootState._base.wpSelfSymbol
                const selfSymbolData = wpSelfSymbol.find(el => el.tag === 'selfSymbol')?.data?.product || {}
                const customerGroupId = rootGetters.customerGroupId
                const newSelfSymbolData = {}
                Object.keys(selfSymbolData).forEach(el => {
                    newSelfSymbolData[el] = selfSymbolData[el][customerGroupId] ?? []
                })
                return newSelfSymbolData
            }
        },
        /* 用户自选列表的symbolKey集合
            return ['12_2'...]
        */
        userSelfSymbolKeys (state, getters) {
            const selfSymbolList = getters.userSelfSymbolList
            const keysList = []
            Object.keys(selfSymbolList).forEach(tradeType => {
                const items = selfSymbolList[tradeType].map(id => `${id}_${tradeType}`)
                keysList.push(...items)
            })
            return [...new Set(keysList)]
        },
        // 用户产品板块
        userProductCategory (state, getters, rootState, rootGetters) {
            const customerGroupId = rootGetters.customerGroupId
            const wpProductCategory = rootState._base.wpProductCategory
            const quoteListConfig = wpProductCategory.find(el => el.tag === 'quoteList')
            if (!quoteListConfig) return {}
            const categories = quoteListConfig.data.tradeTypeBlock || {}
            Object.keys(categories).forEach(tradeType => {
                categories[tradeType].forEach(el => {
                    el.listByUser = el.list[customerGroupId] ?? []
                })
            })
            return categories
        },
        /* 用户产品板块的symbolKey集合
         * return ['12_2'...]
        */
        userProductCategoryKeys (state, getters) {
            const category = getters.userProductCategory
            const keysList = []
            Object.keys(category).forEach(tradeType => {
                category[tradeType].forEach(item => {
                    const items = item.listByUser.map(id => `${id}_${tradeType}`)
                    keysList.push(...items)
                })
            })
            return [...new Set(keysList)]
        },
    },
    mutations: {
        // 清空产品数据
        Empty_data (state) {
            state.productList = []
            state.productMap = {}
            state.productActivedID = null
            state.symbolBaseLoaded = 0
        },
        // 新增底层产品数据
        add_products (state, data = []) {
            const productMap = state.productMap
            const productList = state.productList
            data.forEach(({ symbolId, tradeType }) => {
                const key = `${symbolId}_${tradeType}`
                if (!productMap[key]) {
                    const product = { symbolKey: key, symbolId, tradeType }
                    productMap[key] = product
                    productList.push(product)
                }
            })
        },
        // 更新玩法列表
        Updata_planMap (state, { plans, planMap }) {
            plans.forEach(el => {
                const symbolList = planMap[el.id] || []
                const planItem = Object.assign({}, el, { symbolList })
                state.planMap[el.id] = planItem
            })
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
            const symbolKey = `${symbolId}_${data.tradeType}`
            const product = productMap[symbolKey]
            if (!product) return false
            // if(product.price && data.price) return false; // 已经拿到产品快照，不在重复处理
            const askSpread = product.hasOwnProperty('askSpread')
            data.spread_text = product.spread_text || '--'
            assign(product, data)

            // 该产品先拿到快照价格，后拿到点差，需要重新计算价格点差
            const dealMode = product.dealMode || data.dealMode
            if (!askSpread && data.hasOwnProperty('askSpread') && data.hasOwnProperty('pointRatio') && dealMode === 1) {
                price_spread(product, { ...data, ...product })
            }
        },
        // 更新某个产品报价
        Update_productTick (state, dataArr = []) {
            const productMap = state.productMap
            dataArr.forEach(data => {
                const product = productMap[data.symbolKey]
                if (!product) return false
                const digits = data.price_digits || product.price_digits
                const dealMode = product.dealMode || data.dealMode
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
                const upDownWidthTemp = BigNumber(upDownAmount).div(product.yesterday_close_price).times(100).toFixed(2)
                const upDownWidth = upDownWidthTemp > 0 ? '+' + upDownWidthTemp + '%' : upDownWidthTemp + '%' // 涨跌幅
                const upDownColor = parseFloat(upDownAmount) === 0 ? 'grayColor' : (parseFloat(upDownAmount) > 0 ? 'riseColor' : 'fallColor')
                vue_set(product, 'upDownAmount', upDownAmount)
                vue_set(product, 'upDownAmount_pip', upDownAmount_pip)
                vue_set(product, 'upDownWidth', upDownWidth)
                vue_set(product, 'upDownColor', upDownColor)

                // 更新上一口价的裸行情
                product.cur_price_pre = data.cur_price
                product.buy_price_pre = data.buy_price
                product.sell_price_pre = data.sell_price
                assign(product, data)
                if (dealMode === 1) price_spread(product, data)
            })
        },
        Update_productActivedID (state, id) {
            sessionSet('productActived', JSON.stringify(state.productMap[id]))
            state.productActivedID = id
        },
        Update_handicapList (state, data = {}) {
            // type 1: 快照 2 实时
            // console.log('state.handicapList=====', state.handicapList)
            if (Number(data.type === 1)) {
                state.handicapList = data.list
            } else {
                state.handicapList[0].ask_deep = data.tickList?.ask_deep
                state.handicapList[0].bid_deep = data.tickList?.bid_deep
            }
        },
        Update_dealList (state, data = {}) {
            state.dealList.unshift(data)
            state.dealList = state.dealList.splice(0, 20)
        },
        Delete_handicapList (state, data = {}) {
            state.handicapList = []
        },
        Delete_dealList (state, data = {}) {
            state.dealList = []
        },
        Update_tradeType (state, id) {
            state.curTradeType = id
        },
        Update_deepthDigits (state, data) {
            state.deepthDigits = data
        },
        Update_symbolBaseLoaded (state, data) {
            state.symbolBaseLoaded = data
        },
        // 更新基金产品列表
        Update_fundProductList (state, data) {
            state.fundProductList = data
        },
        // 更新单个基金产品信息
        Update_fundProduct (state, data) {
            if (state.fundInfo === null) {
                state.fundInfo = data
            } else {
                Object.assign(state.fundInfo, data)
            }

            if (!data?.fundId) return false
            const fundProduct = state.fundProductList.find(el => el.fundId === data.fundId)
            if (!fundProduct) return false
            Object.assign(fundProduct, data)
        },
    },
    actions: {
        // 整理当前账户组的所有产品列表，自选产品+产品板块的产品
        // 此方法只有在账户变化后调用
        setProductAllList ({ dispatch, commit, state, rootState, rootGetters, getters }) {
            commit('Empty_data')
            let allSymbolKeys = getters.userSelfSymbolKeys.concat(getters.userProductCategoryKeys)
            allSymbolKeys = [...new Set(allSymbolKeys)]
            const symbolAllData = createListByPlans(allSymbolKeys)
            console.log(symbolAllData)
            const { symbolList, planMap } = symbolAllData
            commit('add_products', symbolList)
            commit('Updata_planMap', { plans: rootState._base.plans, planMap })
            const firstTradeType = rootState._base.plans[0]?.tradeType
            const firstProductSymbolId = firstTradeType && planMap[firstTradeType] ? planMap[firstTradeType][0] : ''
            const firstProductSymbolKey = firstProductSymbolId + '_' + firstTradeType
            if (symbolList.length) commit('Update_productActivedID', firstProductSymbolKey)
            return planMap
        },
        // 产品基础信息列表
        querySymbolBaseInfoList ({ dispatch, commit, state, rootState, rootGetters }, list = []) {
            // let symbolTradeTypeList = []
            // if (Object.prototype.toString.call(list) === '[object Object]') {
            //     symbolTradeTypeList = planMapToArray(list)
            // } else if (list === null) {
            //     symbolTradeTypeList = planMapToArray(state.planMap)
            // }

            const params = {
                // symbolTradeTypeList,
                customerGroupId: rootGetters.customerGroupId,
                customerNo: rootState._user.customerInfo?.customerNo || '0',
            }
            // if (symbolTradeTypeList.length === 0 && state.symbolBaseLoaded === 0) return Promise.resolve(new CheckAPI({ code: '0', data: [] }))

            // 加载产品精简属性的方法，可能存在多地同时调用
            if (state.symbolBaseLoaded === 0) {
                commit('Update_symbolBaseLoaded', 1)
                this.requestSymbolBase = findSymbolBaseInfoList(params).then((res) => {
                    if (res.check()) {
                        res.data.forEach(el => {
                            el.symbol_id = el.symbolId
                            commit('Update_product', el)
                        })
                    }
                    commit('Update_symbolBaseLoaded', 2)
                    return res
                })
            }
            return this.requestSymbolBase
        },
        // 产品详细信息
        querySymbolInfo ({ dispatch, commit, state, rootState, rootGetters }, { symbolId, tradeType, forceQuery }) {
            const productMap = state.productMap
            const symbolKey = `${symbolId}_${tradeType}`
            const product = productMap[symbolKey]
            if (product?.contractSize && !forceQuery) return Promise.resolve(product)

            if (tradeType) {
                const params = {
                    symbolId: Number(symbolId),
                    tradeType: Number(tradeType),
                    customerGroupId: rootGetters.customerGroupId,
                }

                return querySymbolInfo(params).then((res) => {
                    if (res.check() && res.data) {
                        const data = res.data
                        data.tradeType = params.tradeType
                        data.isIndex = data.labels?.split('-').includes('index')
                        commit('Update_product', data)
                        if (res.data.etf) dispatch('queryEquityPremiumRate', { symbolId, tradeType })
                        if (rootState._quote.productActivedID === symbolKey) {
                            sessionSet('productActived', JSON.stringify(productMap[symbolKey]))
                        }
                    }
                    return res.data
                })
            }
        },
        // 基金产品的实时净值和溢价率
        queryEquityPremiumRate ({ dispatch, commit, state, rootState, rootGetters }, { symbolId, currencyCode }) {
            const params = {
                symbolId: symbolId ? Number(symbolId) : undefined,
                currencyCode: currencyCode,
                customerGroupId: rootGetters.customerGroupId,
            }

            return getEquityPremiumRate(params).then((res) => {
                if (res.check() && res.data) {
                    const { data } = res
                    if (symbolId) {
                        commit('Update_product', {
                            fundCurrency: data.currency,
                            currentNav: data.currentNav,
                            premiumRate: data.premiumRate,
                            symbolId: params.symbolId,
                            tradeType: 5,
                        })
                    } else if (currencyCode) {

                    }
                }
                return res.data
            })
        },
        // 分页获取基金产品列表
        findFundPage ({ dispatch, commit, state, rootState, rootGetters }, { current = 1, size = 100 } = {}) {
            const params = {
                customerGroupId: rootGetters.customerGroupId,
            }
            return findFundPage(params).then((res) => {
                if (res.check() && res.data) {
                    commit('Update_fundProductList', res.data.records)
                }
                return res.data
            })
        },
        // 获取某个基金产品净值、市场价格等数据
        fundNetValue ({ dispatch, commit, state, rootState, rootGetters }, params) {
            return fundNetValueChangeQuote(params).then(res => {
                if (res.check() && res.data) {
                    commit('Update_fundProduct', {
                        ...res.data,
                        fundId: params.fundId,
                    })
                }
                return res
            })
        },
        // 获取基金产品详情
        queryFundInfo ({ dispatch, commit, state, rootState, rootGetters }, fundId) {
            commit('Update_fundProduct', null)
            fundId = parseInt(fundId)
            return getFundInfo({ fundId }).then(res => {
                if (res.check() && res.data) {
                    commit('Update_fundProduct', res.data)
                }
                return res
            })
        }
    }
}

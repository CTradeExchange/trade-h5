import { createStore } from 'vuex'
import Base from '@/store/modules/base'
import User from '@/store/modules/user'
import Quote from '@/store/modules/quote'
import Trade from '@/store/modules/trade'
import { getListByParentCode, getCountryListByParentCode } from '@/api/base'
import Colors from '@planspc/colorVariables'
import { localGet, localSet } from '@/utils/util'

const style = {
    ...Colors
}
const supportLanguages = [
    { val: 'zh-CN', name: '中文' },
    { val: 'en-US', name: 'English' },
]

export default createStore({
    modules: {
        _base: Base,
        _user: User,
        _quote: Quote,
        _trade: Trade,
    },
    state: {
        style,
        disabledSuccAnimtion: false,
        invertColor: localGet('invertColor') || 'light', // 黑夜模式
        zoneList: [],
        bankDict: [],
        supportLanguages: supportLanguages,
        countryList: [],
        cacheViews: ['Layout'],
        currencyList: []
    },
    getters: {
        productActived (state) {
            return state._quote.productMap[state._quote.productActivedID]
        },
        customerGroupId (state) { // 用户组ID
            return state._user.customerInfo?.customerGroupId ?? state._base.wpCompanyInfo?.customerGroupId
        },
        // 用户自选列表
        userSelfSymbolList (state, getters,) {
            if (state._user.customerInfo?.optional === 1) {
                // return state._user.selfSymbolList
                const selfSymbolList = state._user.selfSymbolList
                const result = {}
                Object.keys(selfSymbolList).forEach(el => {
                    result[el] = selfSymbolList[el].map(item => item.symbolId)
                })
                return result
            } else {
                const wpSelfSymbol = state._base.wpSelfSymbol
                const selfSymbolData = wpSelfSymbol.find(el => el.tag === 'selfSymbol')?.data?.product || {}
                const customerGroupId = getters.customerGroupId
                const newSelfSymbolData = {}
                Object.keys(selfSymbolData).forEach(el => {
                    newSelfSymbolData[el] = selfSymbolData[el][customerGroupId] ?? []
                })
                return newSelfSymbolData
            }
        },
        // 用户产品板块
        userProductCategory (state, getters) {
            const customerGroupId = getters.customerGroupId
            const wpProductCategory = state._base.wpProductCategory
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
    },
    mutations: {
        Update_style (state, data) {
            state.style = data
            // console.log('style==================', state.style)
        },
        Update_quoteMode (state, data = 1) {
            state.quoteMode = data
        },
        Update_zoneList (state, list) {
            state.zoneList = list
        },
        Update_bankList (state, list) {
            state.bankDict = list
        },
        Update_countryList (state, list) {
            state.countryList = list
        },
        Update_invertColor (state, data) {
            state.invertColor = data
            localSet('invertColor', data)
        },
        add_cacheViews (state, routeName) {
            if (!routeName) return false
            if (state.cacheViews.indexOf('Layout') === -1) state.cacheViews.push('Layout')
            if (state.cacheViews.includes(routeName)) return false
            state.cacheViews.push(routeName)
        },
        del_cacheViews (state, routeName) {
            if (!routeName) return false
            const _index = state.cacheViews.findIndex(el => el === routeName)
            if (_index > -1) {
                state.cacheViews.splice(_index, 1)
            }
        },
        Update_disabledSuccAnimtion (state, data) {
            state.disabledSuccAnimtion = data
        },
        Update_currencyList (state, data) {
            state.currencyList = data
        },
        Update_supportLanguages (state, data) {
            state.supportLanguages = data
        }
    },
    actions: {
        // 获取国家验区号
        getListByParentCode ({ dispatch, commit, state }) {
            return getListByParentCode({ parentCode: 'phone_code' }).then(res => {
                if (res.check()) {
                    // res.data.forEach(el => {
                    //     el.name += ' ' + el.code
                    // })
                    commit('Update_zoneList', res.data)
                }
                return res
            })
        },
        getBankDictList ({ dispatch, commit, state }) {
            return getListByParentCode({ parentCode: 'bank_code' }).then(res => {
                if (res.check()) {
                    commit('Update_bankList', res.data)
                }
                return res
            })
        },
        getCountryListByParentCode ({ dispatch, commit, state }) {
            return getCountryListByParentCode({ parentCode: '-1' }).then(res => {
                if (res.check()) {
                    commit('Update_countryList', res.data)
                }
                return res
            })
        },
        getCurrencyList ({ dispatch, commit, state }, params) {
            return getListByParentCode(
                { parentCode: params || 'digit_wallet_withdraw_currency' }).then(res => {
                if (res.check()) {
                    if (params) {
                        state.currencyList.map(item => {
                            if (item.name === params) {
                                item.subList = res.data
                            }
                        })
                        // currencyObj.subList = res.data
                        // commit('Update_currencyList', currencyObj)
                        return
                    }
                    commit('Update_currencyList', res.data)
                }
                return res
            })
        }

    }
})

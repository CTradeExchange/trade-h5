import { pageConfig, wpCompanyConfig, wpNav, wpSelfSymbolIndex } from '@/api/wpApi'
import { localSet, localGet, sessionSet } from '@/utils/util'

export default {
    namespaced: true,
    state: {
        inited: false, // 配置信息是否获取完成
        wpCompanyInfo: null, //   wordpress公司配置信息
        wpSelfSymbol: null, //   wordpress自选产品配置
        wpProductCategory: [], // wordpress配置的产品板块
        wpNav: null, //   wordpress公司配置信息
        plans: [] // [{ id: 1, name: 'CFD合约全仓' }, { id: 2, name: 'CFD合约逐仓' }, { id: 3, name: '现货杠杆全仓' }, { id: 9, name: 'ABCC现货撮合' }]
    },
    mutations: {
        UPDATE_inited (state, data) {
            state.inited = data
        },
        UPDATE_wpCompanyInfo (state, data) {
            sessionSet('companyId', data.companyId)
            state.wpCompanyInfo = data
        },
        UPDATE_wpNav (state, data) {
            state.wpNav = data
        },
        UPDATE_selfSymbol (state, data) {
            state.wpSelfSymbol = data
        },
        Update_wpProductCategory (state, data = []) {
            state.wpProductCategory = data
        },
        Update_plans (state, data = []) {
            state.plans = data
        },
    },
    actions: {
        // 初始化基础配置信息，如公司配置、底部导航配置、自选产品配置、产品板块配置
        initBaseConfig ({ dispatch, commit }) {
            const baseList = [
                dispatch('getCompanyInfo'),
                dispatch('getNav'),
                dispatch('getWpSelfSymbols'),
                dispatch('getProductCategory')
            ]
            return Promise.all(baseList).then(res => {
                commit('UPDATE_inited', true)
                return dispatch('_quote/setProductAllList', null, { root: true })
            })
        },
        // 获取公司配置信息
        getCompanyInfo ({ commit }) {
            return wpCompanyConfig().then(data => {
                if (data) {
                    if (data.tradeTypeCurrencyList) {
                        data.tradeTypeCurrencyList = data.tradeTypeCurrencyList.filter(el => el.allCurrency)
                        data.tradeTypeCurrencyList.forEach(el => {
                            el.tradeType = el.id
                        })
                    }
                    sessionSet('utcOffset', parseFloat(data.utcOffset) * 60)
                    if (!localGet('lang')) localSet('lang', data.language)
                    commit('UPDATE_wpCompanyInfo', data)
                    commit('Update_plans', data.tradeTypeCurrencyList)
                }
                return data
            })
        },
        // 获取底部导航配置
        getNav ({ commit }) {
            return wpNav().then(data => {
                if (data) commit('UPDATE_wpNav', data)
                return data
            })
        },
        // 获取自选产品配置
        getWpSelfSymbols ({ commit }) {
            return wpSelfSymbolIndex().then(data => {
                if (data) commit('UPDATE_selfSymbol', data)
                return data
            })
        },
        // 获取产品板块
        getProductCategory ({ commit }) {
            return pageConfig('TradeIndex').then(data => {
                if (data) commit('Update_wpProductCategory', data)
                return data
            })
        },
    }
}

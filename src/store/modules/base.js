import { pageConfig, wpCompanyConfig, wpNav, wpSelfSymbolIndex } from '@/api/wpApi'
import { localSet, localGet } from '@/utils/util'

export default {
    namespaced: true,
    state: {
        wpCompanyInfo: null, //   wordpress公司配置信息
        wpSelfSymbol: null, //   wordpress自选产品配置
        wpProductCategory: [], // wordpress配置的产品板块
        wpNav: null, //   wordpress公司配置信息
        tradeType: localStorage.getItem('tradeType'), //   先存储公司默认的玩法类型，用户登录后存储用户的玩法类型
    },
    mutations: {
        UPDATE_wpCompanyInfo (state, data) {
            sessionStorage.setItem('companyId', data.companyId)
            state.wpCompanyInfo = data
        },
        UPDATE_wpNav (state, data) {
            state.wpNav = data
        },
        UPDATE_selfSymbol (state, data) {
            state.wpSelfSymbol = data
        },
        UPDATE_tradeType (state, type) {
            localStorage.setItem('tradeType', String(type))
            state.tradeType = type
        },
        Update_wpProductCategory (state, data = []) {
            state.wpProductCategory = data
        },
    },
    actions: {
        // 初始化基础配置信息，如公司配置、底部导航配置、自选产品配置、产品板块配置
        initBaseConfig ({ dispatch }) {
            const baseList = [
                dispatch('getCompanyInfo'),
                dispatch('getNav'),
                dispatch('getWpSelfSymbols'),
                dispatch('getProductCategory')
            ]
            return Promise.all(baseList).then(res => {
                return dispatch('_quote/setProductAllList', null, { root: true })
            })
        },
        // 获取公司配置信息
        getCompanyInfo ({ commit }) {
            return wpCompanyConfig().then(async data => {
                if (data) {
                    sessionStorage.setItem('utcOffset', parseFloat(data.utcOffset) * 60)
                    if (!localGet('lang')) localSet('lang', data.language)
                    commit('UPDATE_wpCompanyInfo', data)
                    commit('UPDATE_tradeType', data.tradeTypeList[0]['id']) // 先存储公司默认的玩法类型
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

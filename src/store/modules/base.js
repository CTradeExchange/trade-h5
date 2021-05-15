import { pageConfig, wpCompanyConfig, wpNav, wpSelfSymbolIndex } from '@/api/wpApi'

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
        // 获取公司配置信息
        getCompanyInfo ({ dispatch, commit, state, rootGetters }) {
            return wpCompanyConfig().then(async data => {
                if (data) {
                    commit('UPDATE_wpCompanyInfo', data)
                    commit('UPDATE_tradeType', data.tradeTypeList[0]['id']) // 先存储公司默认的玩法类型
                }
                // 自选产品
                const selfSymbolData = await wpSelfSymbolIndex()

                if (selfSymbolData) {
                    const products = selfSymbolData.product[rootGetters.customerGroupId]
                    if (products) {
                        const productList = products && products.map(el => ({ symbolId: el }))

                        commit('UPDATE_selfSymbol', selfSymbolData)
                        commit('_quote/Update_productList', productList, { root: true })
                        commit('_quote/Update_productActivedID', products[0], { root: true })
                    }
                }
                return data
            })
        },
        // 获取底部导航配置
        getNav ({ dispatch, commit, state }) {
            return wpNav().then(data => {
                if (data) {
                    commit('UPDATE_wpNav', data)
                }
                return data
            })
        },
        // 获取产品板块
        getProductCategory ({ dispatch, commit, state }) {
            return pageConfig('TradeIndex').then(data => {
                console.log(data)
                if (data) {
                    commit('Update_wpProductCategory', data)
                }
                return data
            })
        },
    }
}

import { wpCompanyConfig, wpNav } from '@/api/wpApi'

export default {
    namespaced: true,
    state: {
        wpCompanyInfo: null, //   wordpress公司配置信息
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
        UPDATE_tradeType (state, type) {
            localStorage.setItem('tradeType', String(type))
            state.tradeType = type
        },
    },
    actions: {
        // 获取公司配置信息
        getCompanyInfo ({ dispatch, commit, state }) {
            return wpCompanyConfig().then(data => {
                if (data) {
                    commit('UPDATE_wpCompanyInfo', data)
                    const productList = data.symbol_ids.map(el => ({ symbolId: el }))
                    commit('_quote/Update_productList', productList, { root: true })
                    commit('Update_productActivedID', data.symbol_ids[0], { root: true })

                    commit('UPDATE_tradeType', data.trade_type) // 先存储公司默认的玩法类型
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
    }
}

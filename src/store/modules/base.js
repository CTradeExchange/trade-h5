import { wpCompanyConfig, wpNav } from '@/api/wpApi'

export default {
    namespaced: true,
    state: {
        wpCompanyInfo: null,     //   wordpress公司配置信息
        wpNav: null,     //   wordpress公司配置信息
    },
    mutations: {
        UPDATE_wpCompanyInfo(state, data) {
            data = {
                companyId: 1
            }
            sessionStorage.setItem('companyId', data.companyId)
            state.wpCompanyInfo = data
        },
        UPDATE_wpNav(state, data) {
            state.wpNav = data
        },
    },
    actions: {
        // 获取公司配置信息
        getCompanyInfo({ dispatch, commit, state }) {
            return wpCompanyConfig().then(data => {
                if (data) {
                    commit('UPDATE_wpCompanyInfo', data)
                }
                return data
            })
        },
        // 获取底部导航配置
        getNav({ dispatch, commit, state }) {
            return wpNav().then(data => {
                if (data) {
                    commit('UPDATE_wpNav', data)
                }
                return data
            })
        },
    }
}

import { login, findCustomerInfo } from '@/api/user'

export default {
    namespaced: true,
    state: {
        loginLoading: '', // 用户是否处于登录过程中
        info: '', // http接口登录的信息
        zone: '86', // 区号
        loginData: '', // login返回的信息
    },
    mutations: {
        Update_loginLoading (state, data) {
            state.loginLoading = data
        },
        Update_zone (state, data) {
            state.zone = data
        },
        Update_loginData (state, data) {
            state.loginData = data
        },
    },
    actions: {
        // 登录
        login ({ dispatch, commit, state, rootState }, params = {}) {
            commit('Update_loginLoading', true)
            return login(params).then((res) => {
                if (res.check()) {
                    const data = res.data
                    localStorage.setItem('loginParams', JSON.stringify(params))
                    sessionStorage.setItem('token', data.token)
                    commit('Update_loginData', data)
                    commit('_base/UPDATE_tradeType', data.tradeType, { root: true }) // 登录后存储用户的玩法类型
                    // dispatch('findCustomerInfo')  // findCustomerInfod 的数据目前和登录的数据一样，不需要再次调用
                }
                setTimeout(() => {
                    commit('Update_loginLoading', false)
                }, 10000)
                return res
            })
        },
        // 查询客户信息
        findCustomerInfo ({ dispatch, commit, state }, params = {}) {
            return findCustomerInfo().then((res) => {
                if (res.check()) {
                }
                return res
            })
        },
    }
}

import { login, findCustomerInfo } from '@/api/user'
import { localSet, setToken } from '@/utils/util'
export default {
    namespaced: true,
    state: {
        loginLoading: '', // 用户是否处于登录过程中
        info: '', // http接口登录的信息
        zone: '86', // 区号
        loginData: '', // login返回的信息
        customerInfo: '', // 用户信息
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
        Update_customerInfo (state, data) {
            state.customerInfo = data
        },
    },
    actions: {
        // 登录
        login ({ dispatch, commit, state, rootState }, params = {}) {
            commit('Update_loginLoading', true)
            return login(params).then((res) => {
                if (res.check()) {
                    const data = res.data
                    if(params.loginPwd) localSet('loginParams', JSON.stringify(params))
                    setToken(data.token)
                    commit('Update_loginData', data)
                    commit('Update_customerInfo', data)
                    commit('_base/UPDATE_tradeType', data.tradeType, { root: true }) // 登录后存储用户的玩法类型
                    // dispatch('findCustomerInfo')  // findCustomerInfod 的数据目前和登录的数据一样，不需要再次调用
                }
                commit('Update_loginLoading', false)
                return res
            })
        },
        // 查询客户信息
        findCustomerInfo ({ dispatch, commit, state }, params = {}) {
            return findCustomerInfo().then((res) => {
                if (res.check()) {
                    commit('Update_loginData', res.data)
                }
                return res
            })
        },
    }
}

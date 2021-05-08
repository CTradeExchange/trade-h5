import { login, findCustomerInfo, logout } from '@/api/user'
import { localSet, setToken, removeLoginParams } from '@/utils/util'
import router from '@m/router'

export default {
    namespaced: true,
    state: {
        loginLoading: '', // 用户是否处于登录过程中
        info: '', // http接口登录的信息
        zone: '86', // 区号
        loginData: '', // login返回的信息
        customerInfo: '', // 用户信息
        withdrawConfig: '', // 用户取款配置
        userAccount: ''
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
        Update_userAccount (state, data) {
            state.userAccount = data
        }
    },
    actions: {
        // 登录
        login ({ dispatch, commit, rootState }, params = {}) {
            commit('Update_loginLoading', true)
            return login(params).then((res) => {
                if (res.check()) {
                    const data = res.data
                    if (params.loginPwd) localSet('loginParams', JSON.stringify(params))
                    setToken(data.token)
                    commit('Update_loginData', data)
                    commit('Update_customerInfo', data)
                    commit('_base/UPDATE_tradeType', data.tradeType, { root: true }) // 登录后存储用户的玩法类型
                    // dispatch('findCustomerInfo')  // findCustomerInfod 的数据目前和登录的数据一样，不需要再次调用

                    // 设置当前用户组的产品
                    const selfSymbolData = rootState._base.selfSymbol
                    const customerGroupId = data.customerGroupId || rootState._base.wpCompanyInfo?.customerGroupId
                    const products = selfSymbolData.product[customerGroupId]
                    const productList = products.map(el => ({ symbolId: el }))
                    commit('_quote/Update_productList', productList, { root: true })
                    commit('_quote/Update_productActivedID', products[0], { root: true })
                }
                commit('Update_loginLoading', false)
                return res
            })
        },
        // 查询客户信息
        findCustomerInfo ({ dispatch, commit, rootState }, params = {}) {
            commit('Update_loginLoading', true)
            return findCustomerInfo().then((res) => {
                if (res.check()) {
                    const data = res.data
                    commit('Update_customerInfo', res.data)

                    // 设置当前用户组的产品
                    const selfSymbolData = rootState._base.selfSymbol
                    if (selfSymbolData) {
                        const customerGroupId = data.customerGroupId || rootState._base.wpCompanyInfo?.customerGroupId
                        const products = selfSymbolData.product[customerGroupId]
                        const productList = products.map(el => ({ symbolId: el }))
                        commit('_quote/Update_productList', productList, { root: true })
                        commit('_quote/Update_productActivedID', products[0], { root: true })
                    }
                }
                commit('Update_loginLoading', false)
                return res
            })
        },
        logout ({ dispatch, commit, state, rootState }, params = {}) {
            return logout().then(res => {
                if (res.check()) {
                    removeLoginParams()
                    router.push('/login')
                }
                return res
            }).catch(err => {
            })
        }
    }
}

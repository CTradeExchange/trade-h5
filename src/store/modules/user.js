import { login, findCustomerInfo, logout, switchAccount, queryCustomerOptionalList, addCustomerOptional } from '@/api/user'
import { localSet, setToken, removeLoginParams } from '@/utils/util'

export default {
    namespaced: true,
    state: {
        loginLoading: '', // 用户是否处于登录过程中
        info: '', // http接口登录的信息
        zone: '86', // 区号
        loginData: '', // login返回的信息
        customerInfo: '', // 用户信息
        withdrawConfig: '', // 用户取款配置
        userAccount: '', // msg服务推送过来的交易账号信息
        kycState: '', // kyc认证
        selfSymbolList: [], // 自选产品列表
    },
    getters: {
        userAccountType (state) {
            let _type = ''
            const customerInfo = state.customerInfo
            if (customerInfo.type === 2) {
                _type = 'G' // 游客
            } else if (customerInfo.type === 1) {
                _type = 'D' // 模拟，
            } else if (customerInfo.type === 0 && customerInfo.activateStatus === 2) {
                _type = 'R_3' // 真实已激活
            } else if (customerInfo.type === 0 && customerInfo.firstDepositTime) {
                _type = 'R_2' // 真实已入金
            } else if (customerInfo.type === 0 && !customerInfo.firstDepositTime) {
                _type = 'R_1' // 真实未入金
            }
            return _type
        }
    },
    mutations: {
        Empty_data (state, data) { // 清空用户信息
            state.info = ''
            state.loginData = ''
            state.customerInfo = ''
            state.userAccount = ''
            state.kycState = ''
        },
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
        },
        Update_kycState (state, data) {
            state.kycState = data
        },
        Update_selfSymbolList (state, data) {
            state.selfSymbolList = data
        },
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
                    commit('Update_kycState', res.data.kycAuditStatus)
                    commit('Update_loginData', data)
                    commit('Update_customerInfo', data)
                    commit('_base/UPDATE_tradeType', data.tradeType, { root: true }) // 登录后存储用户的玩法类型
                    // dispatch('findCustomerInfo')  // findCustomerInfod 的数据目前和登录的数据一样，不需要再次调用
                    if (data.optional === 1) dispatch('queryCustomerOptionalList') // 如果添加过自选可以直接拉取自选列表，快速显示界面
                    dispatch('_quote/setProductAllList', null, { root: true }).then(productAllList => {
                        return dispatch('_quote/querySymbolBaseInfoList', productAllList, { root: true })
                    }).then(() => {
                        if (data.optional === 0) dispatch('addCustomerOptionalDefault') // 如果没有添加过自选，拿到产品精简信息后添加自选，因为添加自选需要拿到 symbolId, symbolCode, symbolName
                    })
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
                    commit('Update_kycState', res.data.kycAuditStatus)
                    commit('Update_customerInfo', res.data)
                    if (data.optional === 1) dispatch('queryCustomerOptionalList') // 如果添加过自选可以直接拉取自选列表，快速显示界面
                    dispatch('_quote/setProductAllList', null, { root: true }).then(productAllList => {
                        return dispatch('_quote/querySymbolBaseInfoList', productAllList, { root: true })
                    }).then(() => {
                        if (data.optional === 0) dispatch('addCustomerOptionalDefault') // 如果没有添加过自选，拿到产品精简信息后添加自选，因为添加自选需要拿到 symbolId, symbolCode, symbolName
                    })
                }
                commit('Update_loginLoading', false)
                return res
            })
        },
        logout ({ dispatch, commit, state, rootState }, params = {}) {
            return logout().then(res => {
                if (res.check()) {
                    removeLoginParams()
                    commit('Empty_data')
                    commit('_trade/Empty_data', null, { root: true })
                }
                return res
            }).catch(err => {
            })
        },
        // 切换账号
        switchAccount ({ dispatch, commit, rootState }, params = {}) {
            return switchAccount(params).then(res => {
                // 目前只有一个玩法，暂时不处理切换账号
                return res
            })
        },
        // 客户自选产品列表
        queryCustomerOptionalList ({ dispatch, commit }, params = {}) {
            return queryCustomerOptionalList(params).then(res => {
                commit('Update_selfSymbolList', res.data)
                return res
            })
        },
        // 添加自选产品
        addCustomerOptionals ({ dispatch, commit, state, rootState }, params = []) {
            if (!params.length) return Promise.resolve()
            return addCustomerOptional({ symbolList: params }).then(res => {
                dispatch('queryCustomerOptionalList') // 拉取自选列表
                return res
            })
        },
        // 如果和没有添加过自选产品，自动添加默认自选产品
        addCustomerOptionalDefault ({ state, rootGetters }) {
            if (state.customerInfo.optional === 1) return Promise.resolve()
            const defaultOptions = rootGetters.userSelfSymbolList.map(el => parseInt(el.symbolId))
            return addCustomerOptional({ symbolList: defaultOptions })
        },
    }
}

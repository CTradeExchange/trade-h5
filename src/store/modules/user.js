import { login, findCustomerInfo, logout, switchAccount, queryCustomerOptionalList, addCustomerOptional, queryCustomerAssetsInfo, queryAccountAssetsInfo, addCustomerOptionalBatch } from '@/api/user'
import { removeCustomerOptional } from '@/api/trade'
import { localSet, setToken, removeLoginParams, sessionSet } from '@/utils/util'
import { vue_set, assign } from '@/utils/vueUtil.js'

export default {
    namespaced: true,
    state: {
        loginLoading: '', // 用户是否处于登录过程中
        info: '', // http接口登录的信息
        zone: '86', // 区号
        loginData: '', // login返回的信息
        customerInfo: '', // 用户信息
        account: '', // 当前交易账户信息，在出入金里面用到
        assetsInfo: '', // 资产信息
        withdrawConfig: '', // 用户取款配置
        accountAssets: {}, // msg服务推送过来的交易账户资产
        kycState: '', // kyc认证
        selfSymbolList: [], // 自选产品列表
    },
    getters: {
        userAccountType (state) {
            let _type = ''
            const customerInfo = state.customerInfo
            if (!customerInfo) {
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
            state.accountAssets = {}
            state.kycState = ''
        },
        Update_loginLoading (state, data) {
            state.loginLoading = data
        },
        Update_zone (state, data) {
            state.zone = data
        },
        Update_account (state, accountId) {
            state.account = state.customerInfo?.accountList?.find(el => el.accountId === parseInt(accountId))
        },
        Update_loginData (state, data) {
            state.loginData = data
        },
        Update_customerInfo (state, data) {
            if (!data) return false
            state.customerInfo = data
        },
        Update_accountInfo (state, data) {
            if (!data) return false
            const accountList = state.customerInfo?.accountList || []
            accountList.forEach(el => {
                const { currency, tradeType } = el
                if (currency === data.currency && tradeType === data.tradeType) {
                    assign(el, data)
                }
            })
            // if (state.customerInfo.accountMap[data.currency]) {
            //     Object.assign(state.customerInfo.accountMap[data.currency], data)
            //     // Object.assign(state.customerInfo.accountList.filter(el => [3, 5, 9].includes(el.tradeType)).find(item => item.currency === data.currency), data)
            // }
        },
        Update_assetsInfo (state, data) {
            if (!data) return false
            state.assetsInfo = data
            const accountList = state.customerInfo?.accountList || []
            accountList.forEach(el => {
                const { currency, tradeType } = el
                const account = data.accountInfoMap[currency]
                if (account && account.tradeType === tradeType) {
                    assign(el, account)
                }
            })
        },
        Update_accountAssets (state, { tradeType, data }) {
            if (!tradeType) {
                state.accountAssets = {}
            } else {
                vue_set(state.accountAssets, tradeType, data)
            }
        },
        Update_kycState (state, data) {
            state.kycState = data
        },
        Update_selfSymbolList (state, data) {
            state.selfSymbolList = data
        },
        Update_optional (state, data) {
            state.customerInfo.optional = data
        }
    },
    actions: {
        // 登录
        login ({ dispatch, commit }, params = {}) {
            commit('Update_loginLoading', true)
            return login(params).then((res) => {
                if (res.check()) {
                    const data = res.data
                    if (params.loginPwd) localSet('loginParams', JSON.stringify(params))
                    sessionSet('customerNo', data.customerNo)
                    setToken(data.token)
                    // 清空之前的账户数据和产品数据
                    commit('Empty_data')
                    commit('_trade/Empty_data', null, { root: true })
                    commit('_quote/Empty_data', null, { root: true })
                    commit('Update_loginData', data)
                    dispatch('saveCustomerInfo', { flag: true, data: res.data })
                }
                commit('Update_loginLoading', false)
                return res
            })
        },
        // 查询客户信息
        findCustomerInfo ({ dispatch, commit, rootState }, flag = true) {
            /*
                flag: true 获取个人信息，客户自选产品列表，产品基础信息列表
                flag: false 只获取客户信息
            */
            commit('Update_loginLoading', true)
            return findCustomerInfo().then((res) => {
                commit('Update_loginLoading', false)
                if (res.check()) {
                    dispatch('saveCustomerInfo', { flag, data: res.data })
                }
                return res
            })
        },
        // 保存用户信息
        saveCustomerInfo ({ dispatch, commit, rootState }, { flag, data }) {
            // 优先将子账户列表处理成map格式
            const accountMap = {}
            if (data.accountList?.length) {
                data.accountList.forEach(el => {
                    if ([3, 5, 9].includes(el.tradeType)) accountMap[`${el.tradeType}_${el.currency}`] = el // 存储玩法3杠杆全仓的资产账户map类型
                })
            }
            data.accountMap = accountMap

            commit('Update_kycState', data.kycAuditStatus)
            commit('Update_customerInfo', data)
            if (flag) {
                if (data.optional === 1) dispatch('queryCustomerOptionalList') // 如果添加过自选可以直接拉取自选列表，快速显示界面
                dispatch('_quote/setProductAllList', null, { root: true }).then(productAllList => {
                    return dispatch('_quote/querySymbolBaseInfoList', productAllList, { root: true })
                }).then(() => {
                    if (data.optional === 0) dispatch('addCustomerOptionalDefault') // 如果没有添加过自选，拿到产品精简信息后添加自选，因为添加自选需要拿到 symbolId, symbolCode, symbolName
                })
            }
        },
        logout ({ dispatch, commit, state, rootState }, params = {}) {
            return logout().then(res => {
                if (res.check()) {
                    removeLoginParams()
                    commit('Empty_data')
                    commit('_trade/Empty_data', null, { root: true })
                    commit('_quote/Empty_data', null, { root: true })
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
        queryCustomerOptionalList ({ dispatch, commit, rootState }) {
            const tradeTypeList = rootState._base.plans.map(({ id }) => id)

            return queryCustomerOptionalList({ tradeTypeList }).then(res => {
                commit('Update_selfSymbolList', res.data)
                return res
            })
        },
        // 添加自选产品
        addCustomerOptionals ({ dispatch, commit, state, rootState }, params = []) {
            if (!params || !params.length) return Promise.resolve()
            // 手动修改optional值
            commit('Update_optional', 1)
            return addCustomerOptional({ symbolList: params }).then(res => {
                dispatch('queryCustomerOptionalList') // 拉取自选列表
                return res
            })
        },
        // 删除自选产品
        removeCustomerOptionals ({ dispatch, commit, state, rootState }, params = []) {
            if (!params || !params.length) return Promise.resolve()
            return removeCustomerOptional({ symbolList: params }).then(res => {
                dispatch('queryCustomerOptionalList') // 拉取自选列表
                return res
            })
        },
        // 如果和没有添加过自选产品，自动添加默认自选产品
        addCustomerOptionalDefault ({ state, rootGetters, dispatch, commit }) {
            if (state.customerInfo.optional === 1) return Promise.resolve()
            const tradeTypeCurrencyList = []
            Object.keys(rootGetters.userSelfSymbolList).forEach(tradeType => {
                tradeTypeCurrencyList.push({
                    tradeType,
                    symbolList: rootGetters.userSelfSymbolList[tradeType],
                })
            })
            addCustomerOptionalBatch({ tradeTypeCurrencyList }).then(res => {
                if (res.check()) {
                    commit('Update_optional', 1)
                    dispatch('queryCustomerOptionalList')
                }
            })
        },
        // 查询客户总资产信息
        queryCustomerAssetsInfo ({ state, commit }, params) {
            return queryCustomerAssetsInfo(params).then(res => {
                if (res.check()) {
                    commit('Update_assetsInfo', res.data)
                }
            })
        },
        // 查询账户资产信息
        queryAccountAssetsInfo ({ state, commit }, params) {
            return queryAccountAssetsInfo(params).then(res => {
                if (res.check()) {
                    commit('Update_accountInfo', res.data)
                }
            })
        },
    }
}

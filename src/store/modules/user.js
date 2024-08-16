import { login, findCustomerInfo, logout, switchAccount, queryCustomerOptionalList, addCustomerOptional, queryCustomerAssetsInfo, queryAccountAssetsInfo, addCustomerOptionalBatch, findAllBizKycList, increasAccount, thirdLogin, findPhoneAndEmail, queryPayType, socialLogin, findThirdAccountInfo } from '@/api/user'
import { localSet, setToken, removeLoginParams, sessionSet, sessionGet, getCookie, encrypt_with_aes, localGet, guid, getQueryString, isEmpty } from '@/utils/util'
import { firebaseMessage, pushUserToken } from '@/utils/firebase.js'
import { removeCustomerOptional } from '@/api/trade'
import { vue_set, assign } from '@/utils/vueUtil.js'
import { compareAssets } from './storeUtil.js'
import { MsgSocket } from '@/plugins/socket/socket.js'
import { changeLang } from '@/api/base.js'
import { CatsID2Token, getUserInfo } from '@/api/newApi.js'
import { Toast } from 'vant'

export default {
    namespaced: true,
    state: {
        loginLoading: '', // 用户是否处于登录过程中
        info: '', // http接口登录的信息
        zone: '86', // 区号
        loginData: '', // login返回的信息
        customerInfo: '', // 用户信息
        assetsInfo: {}, // 资产信息
        customerAssetsInfo: {}, // 用户资产数据
        account: '', // 当前交易账户信息，在出入金里面用到
        accountList: [], // 用户信息accountList数据
        withdrawConfig: '', // 用户取款配置
        accountAssets: {}, // msg服务推送过来的交易账户资产
        kycState: '', // kyc认证
        kycStatus: '', // kycStatus 全局认证状态 1:未验证 2:审核中 3:认证失败 4:已认证
        selfSymbolList: [], // 自选产品列表
        kycList: [], // kyc 验证列表
        localSelfSymbolList: localGet('selfSymbolListStorage') ? JSON.parse(localGet('selfSymbolListStorage')) : [], // 缓存在本地的自选产品列表
        fundInfoStatic: 'unUser', // 资金信息展示 userShow 已登录打开 userHide 已登录关闭 unUser 未登录
        newsMessage: null, // 事件ws消息订阅推送接收信息
        isNewsToKen: false, // 事件是否存在token
        h5_withdrawfundInfo: {}, // h5的提现数据
        h5_withdrawfundPwd: {}, // h5的提现资金密码
        isSupportFiat: false, // 是否支持购买法币
        newUserInfo: {}, // 用户信息
        currentPopup: 'loading', // 当前显示弹窗 loading public drainage drainaged
        loginQuery: '', // 用于点击从登陆的地方忘记密码按钮保存当前登陆页面的参数用于修改完成后跳转回来
        thirdAccountInfo: {} // 三方登录账户信息
    },
    getters: {
        userAccountType (state) {
            let _type = ''
            const customerInfo = state.customerInfo
            switch (customerInfo?.type) { // 0真实，1模拟，2游客
            case 0: // 真实
            case 1: // 测试组  开发产品讨论确定 1 当成测试用户
                _type = 'R'
                break
            default:
                _type = 'G' // 游客
                break
            }
            // if (!customerInfo) {
            //     _type = 'G' // 游客
            // } else if (customerInfo.type === 1) {
            //     _type = 'D' // 模拟，
            // } else if (customerInfo.type === 0 && customerInfo.activateStatus === 2) {
            //     _type = 'R_3' // 真实已激活
            // } else if (customerInfo.type === 0 && customerInfo.firstDepositTime) {
            //     _type = 'R_2' // 真实已入金
            // } else if (customerInfo.type === 0 && !customerInfo.firstDepositTime) {
            //     _type = 'R_1' // 真实未入金
            // } else {
            //     _type = 'R' // 真实
            // }
            return _type
        },
        // 是否显示划转按钮
        canTransfer (state) {
            const accountList = state.customerInfo?.accountList || []
            const accountsLen = [...new Set(accountList.map(el => el.tradeType))].length
            const hasCash = accountList.find(el => el.tradeType === 5) // 现货玩法
            const hasWallet = accountList.find(el => el.tradeType === 8) // 钱包玩法
            return accountsLen > 1 && (hasCash || hasWallet)
        }
    },
    mutations: {
        Empty_data (state, data) { // 清空用户信息
            state.info = ''
            state.loginData = ''
            state.customerInfo = ''
            state.accountAssets = {}
            state.kycState = ''
            state.kycStatus = ''
            state.thirdAccountInfo = {}
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
        // 更新H5提现信息
        Update_withdrawfundInfo (state, data) {
            state.h5_withdrawfundInfo = data
        },
        // 更新H5提现密码相关
        Update_withdrawfundPwd (state, data) {
            state.h5_withdrawfundPwd = data
        },
        Update_loginData (state, data) {
            state.loginData = data
        },
        Update_customerInfo (state, data) {
            if (!data) return false
            // 只保留USDT,DAI,USDC的，其他过滤掉
            const conditionArr = ['USDT', 'DAI', 'USDC']
            const filterAccountList = data.accountList.filter(item => conditionArr.includes(item.currency))
            data.accountList = filterAccountList
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
            state.assetsInfo[data.tradeType] = data
            const accountList = state.customerInfo?.accountList || []
            accountList.forEach(el => {
                const { currency, tradeType } = el
                const account = data.accountInfoMap?.[currency]
                if (account && account.tradeType === tradeType) {
                    assign(el, account)
                }
            })
            state.accountList = accountList
        },
        Update_accountAssets (state, { tradeType, data }) {
            if (!tradeType) {
                state.accountAssets = {}
            } else {
                const assetsInfo = state.customerInfo?.accountList?.find(el => Number(el.tradeType) === Number(tradeType)) || {}
                vue_set(state.accountAssets, tradeType, Object.assign(assetsInfo, data))
            }
        },
        Update_kycState (state, data) {
            state.kycState = data
        },
        Update_kycStatus (state, data) {
            state.kycStatus = data
        },
        Update_selfSymbolList (state, data) {
            state.selfSymbolList = data
        },
        Update_localSelfSymbolList (state, data, rootState) {
            state.localSelfSymbolList = data.filter(item => item.indexOf('_2') !== -1)
            localSet('selfSymbolListStorage', JSON.stringify(data))
        },
        Update_optional (state, data) {
            state.customerInfo.optional = data
        },
        Update_kycList (state, data) {
            state.kycList = data
        },
        Update_fundInfoStatic (state, data) {
            state.fundInfoStatic = data
        },
        Update_newsMessage (state, data) {
            state.newsMessage = data
        },
        Update_isNewsToKen (state, data) {
            state.isNewsToKen = data
        },
        Update_IsSupportFiat (state, data) {
            state.isSupportFiat = data
        },
        Update_newUserInfo (state, data) {
            state.newUserInfo = data
        },
        Update_currentPopup (state, data) {
            state.currentPopup = data
        },
        Update_loginQuery (state, data) {
            state.loginQuery = data
        },
        // 更新已注册的第三方登录用户信息
        Update_thirdAccountInfo (state, data) {
            state.thirdAccountInfo = data
        },
    },
    actions: {
        // 获取支付通道
        getPayTypes ({ commit, state, rootState }) {
            const tradeType = 5 || rootState._quote.curTradeType// 默认现货 plans.value[0].id
            const customInfo = state.customerInfo
            const accountList = customInfo?.accountList.filter(el => Number(el.tradeType) === 5)
            const accountInfo = accountList.find(el => el.currency === 'USDT')
            if (!accountInfo || customInfo?.companyType === 'demo') return
            // 现货玩法里对应币种的账户
            const params = {
                tradeType: tradeType,
                companyId: customInfo.companyId,
                customerNo: customInfo.customerNo,
                customerGroupId: customInfo.customerGroupId,
                country: customInfo.country,
                clientType: 'mobile',
                accountCurrency: accountInfo.currency,
                accountId: accountInfo.accountId
            }
            queryPayType(params).then(res => {
                const payTypes = res.data
                if (!isEmpty(payTypes) && Array.isArray(payTypes)) {
                    const info = payTypes.find((i) => i.paymentCode === 'micropay' && i.paymentType === 'credit_card2')
                    commit('Update_IsSupportFiat', !isEmpty(info))
                }
            })
        },

        // 登录
        login ({ dispatch, commit, rootState }, params = {}) {
            commit('Update_loginLoading', true)
            commit('_quote/Update_symbolBaseLoaded', 0, { root: true })
            let loginMethon
            if (params.isThird && params.thirdSource === 'telegram') {
                loginMethon = socialLogin
            } else if (params.isThird) {
                loginMethon = thirdLogin
            } else {
                loginMethon = login
            }
            return loginMethon(params).then(async (res) => {
                if (res.check()) {
                    // 获取资讯token
                    dispatch('getNewsToken', { data: res.data, flag: true })
                    // 登录后要调用切换语言接口，ws语言才能保持一致
                    changeLang(getCookie('lang'))

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
                    // 更新钱包币种汇率
                    dispatch('_base/getRateConfig', res.data, { root: true })
                    // 对比用户的资产信息和wp配置的资产信息，自动给用户开增量资产
                    if (data.kycAuditStatus === 2) {
                        const compareAssetsResult = compareAssets(data, rootState._base.wpCompanyInfo.registList)
                        if (compareAssetsResult) dispatch('increasAccount', compareAssetsResult)
                    }
                } else {
                    if (res.msg && Toast) Toast(res.msg)
                    commit('Update_loginLoading', false)
                }
                return res
            })
        },
        // 获取资讯token
        getNewsToken ({ dispatch, commit, rootState }, { data, flag }) {
            const newsTK = localGet('newsToken')
            if (newsTK && !flag) {
                commit('Update_isNewsToKen', true)
                commit('Update_loginLoading', false)
                dispatch('getNewUserInfo')
            } else if (data) {
                const { id, companyId } = data
                const Code = encrypt_with_aes(JSON.stringify({
                    CompanyId: companyId,
                    CustomerID: id,
                    Version: '0.0.1',
                    Trace: guid()
                }))
                CatsID2Token({
                    body: {
                        Code
                    }
                }).then(res => {
                    localSet('newsToken', res.Token)
                    commit('Update_isNewsToKen', true)
                    commit('Update_loginLoading', false)
                    if (!getQueryString('isUniapp')) {
                        // 生成注册令牌
                        pushUserToken()
                    }
                    dispatch('getNewUserInfo')
                }).catch(() => {
                    commit('Update_loginLoading', false)
                })
            }
        },
        // 静默更新用户信息
        UpdateCustomerInfo ({ dispatch, commit, rootState }) {
            return findCustomerInfo().then((res) => {
                if (res.check()) {
                    // 获取资讯token
                    dispatch('saveCustomerInfo', { flag: true, data: res.data })
                }
                return res
            })
        },
        // 获取客户已绑定三方账户信息
        findThirdAccountInfo ({ dispatch, commit, rootState }) {
            return findThirdAccountInfo().then(res => {
                if (res.check() && res.data) {
                    try {
                        if (res.data?.thirdIntactMsg) {
                            res.data.thirdIntactMsg = JSON.parse(res.data.thirdIntactMsg)
                        }
                    } catch (e) {}
                    commit('Update_thirdAccountInfo', res.data)
                }
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
                if (res.check()) {
                    // 获取资讯token
                    dispatch('getNewsToken', { data: res.data })
                    dispatch('saveCustomerInfo', { flag, data: res.data })
                    // 更新钱包币种汇率
                    dispatch('_base/getRateConfig', res.data, { root: true })
                } else {
                    commit('Update_loginLoading', false)
                }
                return res
            })
        },
        getNewUserInfo ({ dispatch, commit, rootState }) {
            return getUserInfo({ body: {} }).then((res) => {
                if (res.Code === 1000) {
                    commit('Update_newUserInfo', res.Data)
                }
            })
        },
        // 保存用户信息
        saveCustomerInfo ({ dispatch, commit, rootState }, { flag, data }) {
            // 优先将子账户列表处理成map格式
            const accountList = data.accountList || []
            const accountMap = {}
            if (accountList?.length) {
                accountList.forEach(el => {
                    if ([3, 5, 9].includes(el.tradeType)) accountMap[`${el.tradeType}_${el.currency}`] = el // 存储玩法3杠杆全仓的资产账户map类型
                })
            }
            data.accountMap = accountMap
            commit('Update_kycState', data.kycAuditStatus)
            commit('Update_kycStatus', data.kycStatus)
            commit('Update_customerInfo', data)
            dispatch('saveFundInfoStatic', { user: data })
            dispatch('getPhoneAndEmail')
            // 根据不同客户组设置不同玩法
            const plansAll = rootState._base.wpCompanyInfo.defaultPlans['1'] // 默认客户组所有的方法
            const plansList = plansAll.filter(el => accountList.find(e => e.tradeType === parseFloat(el.tradeType))).map(el => {
                return {
                    tradeType: el.tradeType,
                    id: el.tradeType
                }
            })
            const basePlans = rootState._base.plans
            const plansKeys = plansList.map(el => el.tradeType)
            const intersection = basePlans.filter(v => plansKeys.includes(v.tradeType))
            dispatch('_base/update_basePlans', intersection, { root: true })
            commit('_base/Update_plans', plansList, { root: true })

            // 在线客服链接补充用户相关参数 --- 老版本客服逻辑 ada在业务层处理参数
            let onlineService = rootState._base.wpCompanyInfo?.onlineService
            if (onlineService && onlineService.indexOf('userid') === -1) {
                const customerNo = data.customerNo
                const customerName = data.name || ''
                onlineService += `&userid=${customerNo}&name=${customerName}`
                commit('_base/UPDATE_wpCompanyInfo', { onlineService }, { root: true })
            }

            if (flag) {
                if (data.optional === 1) dispatch('queryCustomerOptionalList') // 如果添加过自选可以直接拉取自选列表，快速显示界面
                dispatch('_quote/setProductAllList', null, { root: true }).then(productAllList => {
                    return dispatch('_quote/querySymbolBaseInfoList', productAllList, { root: true })
                }).then(() => {
                    if (data.optional === 0) dispatch('addCustomerOptionalDefault') // 如果没有添加过自选，拿到产品精简信息后添加自选，因为添加自选需要拿到 symbolId, symbolCode, symbolName
                })
            }

            if (!getQueryString('isUniapp')) {
                // 插入云消息推送
                firebaseMessage()
            }
        },
        saveFundInfoStatic ({ commit }, { FI, user }) {
            if (user) {
                const show = !!(sessionGet('fundInfoShow') === null || sessionGet('fundInfoShow') === 'true')
                const val = user?.customerNo ? (show ? 'userShow' : 'userHide') : 'unUser'
                sessionSet('fundInfoShow', show)
                commit('Update_fundInfoStatic', val)
            } else if (FI) {
                sessionSet('fundInfoShow', FI !== 'userShow')
                commit('Update_fundInfoStatic', FI === 'userShow' ? 'userHide' : 'userShow')
            } else {
                sessionSet('fundInfoShow', false)
                commit('Update_fundInfoStatic', 'unUser')
            }
        },
        logout ({ dispatch, commit, state, rootState }, params = {}) {
            return logout().then(res => {
                if (res.check()) {
                    MsgSocket.logout()
                    MsgSocket.ws && MsgSocket.ws.close()
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
            if (tradeTypeList.length === 0) return Promise.resolve()
            return queryCustomerOptionalList({ tradeTypeList }).then(res => {
                commit('Update_selfSymbolList', res.data || [])
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
        // 获取完整email
        getPhoneAndEmail ({ dispatch, commit, state, rootState }, params = []) {
            findPhoneAndEmail().then(res => {
                const { email: emailAll, phone: phoneAll } = res.data || {}
                commit('Update_customerInfo', Object.assign(state.customerInfo, { emailAll, phoneAll }))
            })
        },
        // 本地缓存客户自选产品列表
        queryLocalCustomerOptionalList ({ dispatch, commit, rootState }, params) {
            commit('Update_localSelfSymbolList', params || [])
        },
        // 本地缓存添加自选产品
        addLocalCustomerOptionals ({ dispatch, commit, state, rootState }, params = []) {
            if (!params || !params.length) return Promise.resolve()
            commit('Update_optional', 1)
            dispatch('queryLocalCustomerOptionalList') // 拉取本地缓存自选列表
        },
        // 本地缓存删除自选产品
        removeLocalCustomerOptionals ({ dispatch, commit, state, rootState }, params = []) {
            if (!params || !params.length) return Promise.resolve()
            dispatch('queryLocalCustomerOptionalList') // 拉取本地缓存自选列表
        },

        // 如果没有添加过自选产品，自动添加默认自选产品
        addCustomerOptionalDefault ({ state, rootGetters, dispatch, commit }) {
            if (state.customerInfo.optional === 1) return Promise.resolve()
            const tradeTypeCurrencyList = []
            Object.keys(rootGetters.userSelfSymbolList).forEach(tradeType => {
                tradeTypeCurrencyList.push({
                    tradeType,
                    symbolList: rootGetters.userSelfSymbolList[tradeType],
                })
            })
            if (tradeTypeCurrencyList.length === 0) return false
            addCustomerOptionalBatch({ tradeTypeCurrencyList }).then(res => {
                if (res.check()) {
                    commit('Update_optional', 1)
                    dispatch('queryCustomerOptionalList')
                    localSet('selfSymbolListStorage', [])
                }
            })
        },
        // 查询客户总资产信息
        queryCustomerAssetsInfo ({ state, commit }, params) {
            return queryCustomerAssetsInfo(params).then(res => {
                if (res && res.check()) {
                    state.customerAssetsInfo = res.data
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
        // 查询客户KYC认证列表
        findAllBizKycList ({ state, commit }, params) {
            return findAllBizKycList({
                openAccountType: state.customerInfo.openAccountType
            }).then(res => {
                if (res.check()) {
                    res.data.forEach(item => {
                        if (item.preLevelName) {
                            const temp = res.data.find(el => el.levelName === item.preLevelName)
                            item.preLevelObj = temp
                        }
                    })

                    commit('Update_kycList', res.data)
                    return res
                }
            })
        },
        // 批量增加玩法账户信息
        increasAccount ({ state, dispatch }, list) {
            return increasAccount({ tradeTypeCurrencyList: list }).then(res => {
                if (res.check()) {
                    dispatch('findCustomerInfo')
                    return res
                }
            })
        }
    }
}

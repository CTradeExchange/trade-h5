import { pageConfig, wpCompanyConfig, wpNav, wpFooter, wpSelfSymbolIndex, requestAppJson } from '@/api/wpApi'
import { getCookie, sessionSet, setCookie, isEmpty, getQueryVariable, isDemoAccount, localSet, COMPANY_TYPE, getQueryString, removeDemoStr, getToken, langList } from '@/utils/util'
import { getExchangeRateList, getThirdLoginConfig } from '@/api/base'
import { GetSysConfig } from '@/api/newApi'

import { DEFAULT_LANG } from '@/utils/constant.js'

const isProduction = process.env.NODE_ENV === 'production'

export default {
    namespaced: true,
    state: {
        inited: false, // 配置信息是否获取完成
        wpCompanyInfo: null, //   wordpress公司配置信息
        wpSelfSymbol: [], //   wordpress自选产品配置
        wpProductCategory: [], // wordpress配置的产品板块
        wpNav: null, //   wordpress公司配置信息
        wpFooter: null, //   wordpress公司配置PCUI的页脚信息
        plansNames: {}, // 完成类型，从语言包里面获取
        plans: [], // [{ id: 1, name: 'CFD合约全仓' }, { id: 2, name: 'CFD合约逐仓' }, { id: 3, name: '现货杠杆全仓' }, { id: 9, name: 'ABCC现货撮合' }]
        thirdLoginConfig: [],
        rateConfigList: '', // 汇率列表
        newsSysConfig: [], // 新闻端系统配置
        supportedLanguages: [], // 用于切换事件详情支持的语言
        appJson: {}, // 业务渠道自定义配置
        tradeType: 2 // 交易类型
    },
    mutations: {
        UPDATE_inited (state, data) {
            state.inited = data
        },
        UPDATE_wpCompanyInfo (state, data = {}) {
            if (data.companyId && !isDemoAccount()) {
                sessionSet('companyId', data.companyId)
            }
            if (state.wpCompanyInfo) {
                let newData = JSON.parse(JSON.stringify(state.wpCompanyInfo))
                newData = Object.assign(newData, data)
                Object.keys(newData).forEach(key => {
                    if (!!data[key] && !newData[key]) {
                        newData[key] = data[key]
                    } else if (!!state.wpCompanyInfo[key] && !newData[key]) {
                        newData[key] = state.wpCompanyInfo[key]
                    }
                })
                if (typeof data['language'] === 'string') {
                    newData['language'] = data['language']
                }
                if (typeof state.wpCompanyInfo['language'] === 'string') {
                    newData['language'] = state.wpCompanyInfo['language']
                }
                state.wpCompanyInfo = JSON.parse(JSON.stringify(newData))
            } else {
                state.wpCompanyInfo = data
            }
        },
        UPDATE_wpNav (state, data) {
            state.wpNav = data
        },
        UPDATE_wpFooter (state, data) {
            state.wpFooter = data
        },
        UPDATE_selfSymbol (state, data) {
            state.wpSelfSymbol = data
        },
        Update_wpProductCategory (state, data = []) {
            state.wpProductCategory = data
        },
        Update_plans (state, data = []) {
            const plansNames = state.plansNames
            data.forEach(el => {
                el.name = plansNames[el.id]
            })
            state.plans = data
        },
        Update_plansNames (state, plansNames) {
            state.plansNames = plansNames
            state.plans.forEach(el => {
                el.name = plansNames[el.id]
            })
        },
        Update_trirdLoginConfig (state, data) {
            state.thirdLoginConfig = data
        },
        // 更新汇率
        Update_rateConfig (state, data) {
            state.rateConfigList = data
        },
        Update_newsSysConfig (state, data) {
            state.newsSysConfig = data
        },
        Update_supportedLanguages (state, data) {
            state.supportedLanguages = data
        },
        Update_AppJson (state, data) {
            state.appJson = data
        },

    },
    actions: {
        // 初始化基础配置信息，如公司配置、底部导航配置、自选产品配置、产品板块配置
        initBaseConfig ({ dispatch, commit }) {
            // 处理链接与cookie国际化不一致的情况
            let currentLang = getQueryVariable('lang') || window.location.pathname?.split('/')[1] // 当前url的语言
            const cookieLang = getCookie('lang')
            if (!langList.includes(currentLang)) {
                currentLang = DEFAULT_LANG
            }
            if (cookieLang !== currentLang || !langList.includes(cookieLang)) {
                setCookie('lang', currentLang, 'y10')
            }
            // 处理uniapp切换demo保持h5一致的情况
            const isUniapp = getQueryString('isUniapp') // dome交易url
            const domain = getQueryString('domain') // dome交易url
            const cIdstr = getQueryString('cId') || '' // 交易companyId
            const [cId, dcId] = cIdstr.split('_').filter(i => i)
            if (isUniapp && domain && cId && dcId) {
                localSet('demo_domain', decodeURIComponent(domain))
                localSet('companyId', cId)
                localSet('companyType', COMPANY_TYPE)
                sessionSet('companyId', dcId)
            } else if (isDemoAccount() && (isUniapp || !getToken())) {
                removeDemoStr()
            }
            // 初始化配置数据
            const baseList = [
                dispatch('getCompanyInfo'),
                dispatch('getChannelSett'),
                dispatch('getNav'),
                dispatch('getWpSelfSymbols'),
                dispatch('getProductCategory'),
                dispatch('getNewsSysConfig'),
                dispatch('_signal/getSignalConfig', '', { root: true }) // 获取信号配置文件
            ]
            return Promise.all(baseList).then(res => {
                commit('UPDATE_inited', true)
                return dispatch('_quote/setProductAllList', null, { root: true })
            })
        },

        // 加载业务渠道自定义配置json
        getAppJsonConfig ({ commit }) {
            return requestAppJson().then(res => {
                if (res) {
                    commit('Update_AppJson', res)
                }
                return res
            })
        },

        // 获取公司配置信息
        getCompanyInfo ({ commit }) {
            return wpCompanyConfig().then(data => {
                if (data) {
                    commit('UPDATE_wpCompanyInfo', data)
                }
                return data
            })
        },
        // 获取渠道配置信息
        getChannelSett ({ commit }) {
            return pageConfig('ChannelSett').then(data => {
                if (data) {
                    data.customerGroupId = '2' // 游客客户组

                    // 设置玩法别名和排序
                    // data.registList.forEach(el => formatPlans(el.plans || []))
                    if (data.registrable?.length) {
                        data.registrable.forEach(el => {
                            el.countryCode = el.country_code
                        })
                    }

                    sessionSet('utcOffset', 0 - new Date().getTimezoneOffset()) // 改成取本地时区时间，不找wp配置时间
                    // sessionSet('utcOffset', parseFloat(data.utcOffset) * 60)   改成取本地时区时间，不找wp配置时间

                    // 生产模式直接从wp配置取当前页面的语言
                    // 开发模式先取url上的lang语言，然后取cookie语言，然后取wp配置的默认语言
                    let currentLang = window.location.pathname?.split('/')[1] || 'en-US' // 当前页面语言
                    const urlLang = getQueryVariable('lang') // 当前url的语言
                    const cookieLang = getCookie('lang') // 当前cookie语言
                    if (isProduction) {
                        currentLang = window.wp_apiPath.split('/')[1]
                    } else if (urlLang) {
                        currentLang = urlLang
                    } else if (cookieLang) {
                        currentLang = cookieLang
                    } else {
                        currentLang = data.language.val
                    }
                    if (isEmpty(cookieLang) || cookieLang !== currentLang) {
                        setCookie('lang', currentLang, 'y10') // 语言都存储在cookie里面
                    }

                    // 在线客服补充语言参数
                    let onlineService = data.onlineService
                    if (onlineService) {
                        let lang = getCookie('lang') || 'zh-CN'
                        lang = lang.split('-')[0]
                        if (onlineService.indexOf('?') === -1) onlineService += '?_tt=1'
                        onlineService += `&lang=${lang}`
                        data.onlineService = onlineService
                    }

                    commit('UPDATE_wpCompanyInfo', data)

                    // 游客玩法
                    const guestPlans = data.defaultPlans['1']
                    commit('Update_plans', guestPlans)
                    if (data.supportLanguage) commit('Update_supportLanguages', data.supportLanguage, { root: true })
                }
                return data
            })
        },
        // 获取底部导航配置
        getNav ({ commit }) {
            return wpNav().then(data => {
                if (data) commit('UPDATE_wpNav', data)
                return data
            }).catch(err => err)
        },
        // 获取底部页脚配置
        getFooter ({ commit }) {
            return wpFooter().then(data => {
                if (data) commit('UPDATE_wpFooter', data)
                return data
            }).catch(err => err)
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
        // 获取页面模块列表
        getPageConfig ({ commit, rootGetters }, pageName) {
            return pageConfig(pageName).then(modulesList => {
                const userAccountType = rootGetters['_user/userAccountType']
                const _result = modulesList?.filter(item => {
                    const { accountType, expiryDate } = item.data
                    const hasRole = accountType.includes(userAccountType)
                    const inActiveTime = !expiryDate || expiryDate?.length === 0 ? true : window.dayjs().isBetween(expiryDate[0], expiryDate[1])
                    return hasRole && inActiveTime
                }) || []
                return _result
            })
        },
        // 获取三方登录配置文件
        getLoginConfig ({ state, commit, rootGetters }, pageName) {
            const thirdLoginArr = state.wpCompanyInfo.thirdLogin
            const companyId = state.wpCompanyInfo.companyId
            if (thirdLoginArr && thirdLoginArr.length > 0 && state.thirdLoginConfig.length === 0) {
                return getThirdLoginConfig({
                    companyId,
                    thirdSource: thirdLoginArr.join()
                }).then(res => {
                    if (res.check()) {
                        commit('Update_trirdLoginConfig', res.data)
                    }
                }).catch(err => {
                })
            }
        },
        update_basePlans ({ state, commit, rootGetters }, data) {
            commit('Update_plans', data)
        },
        // 更新汇率
        getRateConfig ({ state, commit }, data) {
            if (state.rateConfig) return
            const { accountList } = data || {}
            const list = accountList.filter((o) => o.tradeType === 5)
            const currencies = list.map((item) => {
                return {
                    'source': item.currency,
                    'target': 'USDT'
                }
            }).concat([{
                'source': 'USD',
                'target': 'USDT'
            }, {
                'source': 'CNY',
                'target': 'USDT'
            }])
            getExchangeRateList({ currencies }).then((res) => {
                if (res.data && res.data.length > 0) {
                    commit('Update_rateConfig', res.data)
                }
            })
        },
        // 新闻端系统配置
        getNewsSysConfig ({ state, commit }) {
            return GetSysConfig({ body: {} }).then((res) => {
                const { Data } = res || {}
                commit('Update_newsSysConfig', Data || [])
            })
        },

    }
}

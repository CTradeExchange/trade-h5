import axios from 'axios'
import { getCookie } from '@/utils/util'
import { setTimeDiff } from '../utils/getRelativeTime'
import { setSignalHeaders } from '../utils/request'
import { formatSymbolCode } from '../utils/util'
import {
    getServerTime,
    queryQuotapIndicatorByCondition,
    queryAllQuotaIndicatorSub,
    cudQuotapIndicatorSub,
    getAuth2Code,
    queryTGInfo,
    queryBotInfo,
    queryAssess,
    queryPnl
} from '../api/index'
import CheckAPI from '@/utils/checkAPI'

export default {
    namespaced: true,
    state: {
        timeDiff: 0, // 与服务器时间差
        listStyle: 0, // 列表呈现方式 0块状，1列表
        config: {}, // 更新信号配置
        homeTabSignalValue: '', // 首页信号tab值
        homeTabSignalParams: {}, // 首页信号tab参数
        detailTabSignalParams: {}, // 详情页筛选参数
        quoteTabType: 'signal', // mine 我的信号 signal 发现
        quoteTabSignalValue: '', // 信号发现页tab值
        quoteTabSignalParams: {}, // 信号发现页tab参数
        subscribeList: [], // 订阅列表
        isLoadSubscribe: false, // 是否已加载订阅列表接口
        tgInfo: {
            isLoad: false, // tg绑定信息
            bna: '', // tg bot名
            link: '', // tg订阅地址
        }
    },
    mutations: {
        // 更新信号配置
        Update_config (state, data) {
            const {
                indicator = [], // 指标
                product = [], // 产品
                period = [], // 周期
                action = [], // 买卖建议
                days = [], // 日期
            } = data
            // 所有请求参数
            const defaultALLReq = {
                i: [], // 指标
                pe: [], // 周期
                a: [], // 买卖建议
                sc: [], // 产品类型
                si: [], // 信号
                days: [], // 盈亏周期
            }
            // 所有条件对象
            const signalMap = {
                signal: {},
                signalDesc: {},
                period: {},
                product: {},
                action: {},
                days: {},
            }
            const signal = [] // 信号数组
            const signalFlag = {} // 信号对象
            // 格式化信号数据
            indicator.forEach((item) => {
                defaultALLReq.i.push(item.value)
                if (Array.isArray(item.children)) {
                    item.children.forEach(sitem => {
                        if (!signalMap.signal[sitem.value]) {
                            signalMap.signal[sitem.value] = sitem
                        }
                        signalMap.signalDesc[item.value + '_' + sitem.value] = sitem
                        if (!signalFlag[sitem.value]) {
                            signalFlag[sitem.value] = true
                            const { desc, ...rest } = sitem
                            signal.push(rest)
                            defaultALLReq.si.push(rest.value)
                        }
                    })
                }
            })
            // 周期
            period.forEach(item => {
                defaultALLReq.pe.push(item.value)
                signalMap.period[item.value] = item
            })
            // 日期
            days.forEach(item => {
                defaultALLReq.days.push(item.value)
                signalMap.days[item.value] = item
            })

            // 产品
            const productAllList = []
            product.forEach((item) => {
                defaultALLReq.sc.push(item.value)
                const { children, ...rest } = item
                signalMap.product[item.value] = rest
                // 打散所有产品列表
                item.children.forEach((sitem) => {
                    productAllList.push({
                        ...sitem,
                        sc: item.value,
                    })
                })
            })
            // 排序所有产品
            productAllList.sort((a, b) => {
                const aSortNum = a.isHot ? 1 : 0
                const bSortNum = b.isHot ? 1 : 0
                return bSortNum - aSortNum
            })
            // 买卖建议
            action.forEach((item) => {
                defaultALLReq.a.push(item.value)
                signalMap.action[item.value] = item
            })

            state.config = {
                ...data,
                signal, // 信号类型
                signalMap, // 信号所有对象
                defaultALLReq, // 默认全选参数
                productAllList, // 所有产品二维数组
            }
        },
        Update_listStyle (state, data) { // 更新呈现方式
            state.listStyle = data
        },
        // 设置行情页面tab页
        Update_signalTabType (state, data) {
            const { type, tabValue, params } = data
            state.quoteTabType = type
            if (tabValue) {
                state.quoteTabSignalValue = tabValue
                if (params) {
                    state.quoteTabSignalParams = {
                        ...state.quoteTabSignalParams,
                        [tabValue]: params
                    }
                }
            }
        },
        // 更新首页tab页值
        Update_homeSignalValue (state, data) {
            // 信号类型，参数
            const { type, params } = data
            if (type) {
                state.homeTabSignalValue = type
                if (params) {
                    state.homeTabSignalParams = {
                        ...state.homeTabSignalParams,
                        [type]: params
                    }
                }
            }
        },
        // 更新详情页筛选参数
        Update_detailSignalParams (state, data) {
            state.detailTabSignalParams = data
        },
        // 更新订阅列表
        Update_subscribeList (state, data) {
            state.subscribeList = data
        },
        // 更新订阅列表标记
        Update_isLoadSubscribe (state, data) {
            state.isLoadSubscribe = data
        },
        // 更新tgInfo
        Update_tgInfo (state, data) {
            state.tgInfo = data
        },
        // 更新服务器时间
        Update_timeDiff (state, data) {
            state.timeDiff = data
        }
    },
    getters: {
        // 获取当前语言字段
        getNameKey: (state, getters, rootState) => (fieldName = 'name') => {
            const lang = getCookie('lang')
            let currentKey = fieldName
            switch (lang) {
            case 'zh-CN':
                currentKey = fieldName + '_cn'
                break
            case 'zh-HK':
                currentKey = fieldName + '_hk'
                break
            case 'tr-TR':
                currentKey = fieldName + '_tr'
                break
            case 'vi-VN':
                currentKey = fieldName + '_vn'
                break
            case 'ar-SA':
                currentKey = fieldName + '_ar'
                break
            case 'es-ES':
                currentKey = fieldName + '_es'
                break
            case 'fr-FR':
                currentKey = fieldName + '_fr'
                break
            case 'ko-KR':
                currentKey = fieldName + '_ko'
                break
            case 'th-TH':
                currentKey = fieldName + '_th'
                break
            }
            return currentKey
        },
        // 获取指标名称
        getIndicatorName: (state, getters) => (item) => {
            const { period = {} } = state.config?.signalMap
            const nameKey = getters.getNameKey()
            return `${item.i}-${period[item.pe]?.[nameKey] ? period[item.pe][nameKey] : item.pe}`
        },
        // 获取信号名称
        getSignalName: (state, getters) => (si) => {
            const { signal = {} } = state.config?.signalMap
            const nameKey = getters.getNameKey()
            return signal[si]?.[nameKey] || si
        },
        // 获取信号描述
        getSignalDesc: (state, getters) => (item) => {
            const { signalDesc = {} } = state.config?.signalMap
            const nameKey = getters.getNameKey('desc')
            return signalDesc[item?.i + '_' + item?.si]?.[nameKey] || '--'
        },
        // 获取买卖建议名称
        getActionName: (state, getters) => (direction) => {
            const { action = {} } = state.config?.signalMap
            const nameKey = getters.getNameKey()
            return action[direction]?.[nameKey] || '--'
        },
        // 获取周期名称
        getPeriodName: (state, getters) => (pe) => {
            const { period = {} } = state.config?.signalMap
            const nameKey = getters.getNameKey()
            return period[pe]?.[nameKey] || pe
        },
        // 获取产品分类名称
        getProductCateName: (state, getters) => (sc) => {
            const { product = {} } = state.config?.signalMap
            const nameKey = getters.getNameKey()
            return product[sc]?.[nameKey] || sc
        },
        // 通过信号的sc获取symbolKey
        getSignalSymbolKey: (state, getters, rootState) => (symbolCode) => {
            const { tradeType } = rootState._signal.config
            const symbolKey = rootState._quote.symbolCodeMap[formatSymbolCode(symbolCode, tradeType)]
            return symbolKey
        },
        // 通过信号的sc获取产品信息
        getSignalProduct: (state, getters, rootState) => (symbolCode) => {
            const symbolKey = getters.getSignalSymbolKey(symbolCode)
            return rootState._quote.productMap[symbolKey] || {}
        },
        // 获取用户订阅的map信号
        getSubscribeList (state) {
            const res = {}
            state.subscribeList.forEach((item) => {
                res[item.sy + item.i + item.pe] = true
            })
            return res
        },
        // 获取盈利周期
        getSignalDays: (state, getters) => (day) => {
            const { days = {} } = state.config?.signalMap
            const nameKey = getters.getNameKey()
            return days[day]?.[nameKey] || day
        },
        // 获取有价值的周期
        getValuablePeriod (state) {
            // 有价值的信号屏蔽1w 1m周期
            const { period = [] } = state.config
            return period.filter((item) => {
                return item.value !== '1W' && item.value !== '1M'
            })
        }
    },
    actions: {
        // 获取信号配置数据
        getSignalConfig ({ dispatch, commit }) {
            return axios({
                url: '/bc/signalConfig.json?timestamp=' + new Date().getTime(),
                responseType: 'json'
            }).then((res) => {
                if (res.status === 200 && res.data) {
                    commit('Update_config', res.data)
                    // 初始化服务器时间
                    setSignalHeaders(res.data)
                    dispatch('getTimeDiff')
                }
            })
        },
        // 获取服务器时间戳（秒数）
        getTimeDiff ({ commit }) {
            return getServerTime().then((res) => {
                if (res.code === '0') {
                    const timeDiff = (res.data * 1000) - Date.now()
                    commit('Update_timeDiff', timeDiff)
                    setTimeDiff(timeDiff)
                }
            })
        },
        // 多条件筛选数据
        queryQuotapIndicatorByCondition ({ state }, params) {
            const req = {
                ...params,
            }
            const { defaultALLReq = {} } = state.config
            const { si, days, ...rest } = defaultALLReq
            // 全选的时候需要传所有参数
            Object.keys(rest).map((item) => {
                if (!req[item]) {
                    req[item] = defaultALLReq[item]
                }
            })
            // 如果参数里面有si，则需要传默认值
            if (req.hasOwnProperty('si') && !req.si) {
                req.si = si
            }
            return queryQuotapIndicatorByCondition(req)
        },

        // 查询我的订阅
        queryAllQuotaIndicatorSub ({ rootState, commit, state }) {
            const { customerNo = '' } = rootState._user.customerInfo
            if (!customerNo) {
                commit('Update_subscribeList', [])
                return Promise.resolve({
                    code: '0',
                    data: {
                        items: []
                    }
                })
            }
            return queryAllQuotaIndicatorSub({
                code: customerNo
            }).then((res) => {
                if (res.check() && res.data?.items) {
                    commit('Update_isLoadSubscribe', true)
                    commit('Update_subscribeList', res.data?.items)
                }
                return res
            })
        },

        // auth2 接口，暂时放这里
        getAuth2Code ({ state }) {
            const { auth2Appid } = state.config
            return getAuth2Code({
                appId: auth2Appid,
                thirdAppType: 'Headline'
            })
        },

        // 更新订阅信息
        async cudQuotapIndicatorSub ({ dispatch }, params) {
            const auth2Code = await dispatch('getAuth2Code')
            if (auth2Code?.data?.data) {
                return cudQuotapIndicatorSub({
                    code: auth2Code?.data?.data,
                    sub: params
                })
            }
            return Promise.reject(new CheckAPI({
                'code': '-2',
                'data': {
                    message: 'E000'
                }
            }))
        },

        // 删除订阅信息
        async deleteQuotapIndicatorSub ({ dispatch, state }, index) {
            const auth2Code = await dispatch('getAuth2Code')
            if (auth2Code?.data?.data) {
                const sub = [
                    ...state.subscribeList
                ]
                sub.splice(index, 1) // 移除索引中的一个
                return cudQuotapIndicatorSub({
                    code: auth2Code?.data?.data,
                    sub
                })
            }
            return Promise.reject(new CheckAPI({
                'code': '-2',
                'data': {
                    message: 'E000'
                }
            }))
        },

        // 获取用户tg bot绑定信息
        queryTGInfo ({ rootState, commit, state }) {
            const { customerNo = '' } = rootState._user.customerInfo
            if (!customerNo) {
                return Promise.resolve({
                    code: '0',
                    data: {}
                })
            }
            return queryTGInfo({
                code: Number(customerNo)
            }).then((res) => {
                if (res.check()) {
                    const { bna = '', link = '' } = res.data || {}
                    commit('Update_tgInfo', {
                        isLoad: true,
                        bna,
                        link
                    })
                }
                return res
            })
        },

        // 获取可用tg bot信息
        async queryBotInfo ({ dispatch, state }) {
            const auth2Code = await dispatch('getAuth2Code')
            if (auth2Code?.data?.data) {
                return queryBotInfo({
                    code: auth2Code?.data?.data,
                })
            }
            return Promise.reject(new CheckAPI({
                'code': '-2',
                'data': {
                    message: 'E000'
                }
            }))
        },

        // 指标评价
        async queryAssess ({ state, getters }, sendData) {
            const { params, ...rest } = sendData
            // 产品分类为空则传全部
            const { sc = [] } = state.config.defaultALLReq
            const peArr = getters['getValuablePeriod'] || []
            const pe = peArr.map((item) => item.value)
            if (params.sc === '') {
                params.sc = sc.join(',')
            }
            if (params.pe === '') {
                params.pe = pe.join(',')
            }
            return queryAssess(params, rest)
        },

        // 信号盈利
        async queryPnl ({ state, getters }, sendData) {
            const { params, ...rest } = sendData
            // 产品分类为空则传全部
            const { sc = [], i = [] } = state.config.defaultALLReq
            const peArr = getters['getValuablePeriod'] || []
            const pe = peArr.map((item) => item.value)
            if (params.sc === '') {
                params.sc = sc.join(',')
            }
            if (params.pe === '') {
                params.pe = pe.join(',')
            }
            if (params.i === '') {
                params.i = i.join(',')
            }
            return queryPnl(params, rest)
        }

    }
}

import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Dialog } from 'vant'
import { sessionGet, sessionSet, isUniapp } from '@/utils/util'
import mitt from '@/utils/mitt'

function getAcademyLocale (locale) {
    let currentLocale = 'en'
    switch (locale) {
    case 'zh-CN':
        currentLocale = 'zh-cn'
        break
    case 'zh-HK':
        currentLocale = 'zh-hk'
        break
    case 'tr-TR':
        currentLocale = 'tr'
        break
    case 'vi-VN':
        currentLocale = 'vi'
        break
    case 'ar-SA':
        currentLocale = 'ar'
        break
    case 'es-ES':
        currentLocale = 'es'
        break
    case 'fr-FR':
        currentLocale = 'fr'
        break
    case 'ko-KR':
        currentLocale = 'kr'
        break
    case 'th-TH':
        currentLocale = 'th'
        break
    }
    return currentLocale
}

export default function () {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const { locale, t } = useI18n({ useScope: 'global' })
    const customerInfo = computed(() => store.state._user.customerInfo)

    // 上一次选择的信号
    const lastSelectSignal = 'LAST_SELECTED_SIGNAL'

    // 跳转我的信号或者发现页
    function saveTabType (type) {
        store.commit('_signal/Update_signalTabType', {
            type
        })
        if (route.path !== '/signal') {
            router.push('/signal')
        }
    }

    // 保存筛选条件
    function saveSignalParams (tabValue, params) {
        store.commit('_signal/Update_signalTabType', {
            type: 'signal',
            tabValue,
            params
        })
    }

    // 保存筛选条件并跳转到信号页面
    function jumpSignalTab (tabValue, params) {
        saveSignalParams(tabValue, params)
        if (route.path !== '/signal') {
            router.push('/signal')
        }
    }

    // 保存产品详情页的筛选条件
    function saveDetailParams (params) {
        store.commit('_signal/Update_detailSignalParams', params)
    }

    // 获取学院地址
    function getAcademyUrl () {
        let url = ''
        if (store.state.businessConfig.academy) {
            const currentLocale = getAcademyLocale(locale.value)
            url = store.state.businessConfig.academy + '/' + currentLocale
        }
        return url
    }

    // 获取信号指标
    function getAcademyIndicatorUrl (indicatorName) {
        let url = getAcademyUrl() + '/indicator-introduction'
        // 指标名
        if (indicatorName) {
            url += `/${indicatorName.toLowerCase()}`
        }
        return url
    }

    // 获取tg频道地址
    function getTelegramChannel () {
        const { telegramChannel = {} } = store.state._signal.config
        const { url, url_cn, url_hk } = telegramChannel
        let channel_url = ''
        switch (locale.value) {
        case 'zh-HK':
            channel_url = url_hk
            break
        case 'zh-CN':
            channel_url = url_cn
            break
        default:
            channel_url = url
        }
        return channel_url
    }

    function confirmDemo () {
        return Dialog.confirm({
            title: t('common.tip'),
            message: `${t('signal.subscribe.demoAccountTips')}`,
            confirmButtonText: t('signal.subscribe.toReal'),
            cancelButtonText: t('common.cancel')
        })
    }

    // 订阅信号  是否需要弹窗
    function subscribeSignal (item = {}) {
        // 未登录
        if (!customerInfo.value) {
            // 路由跳转加标记
            const back = route.fullPath + `${route.fullPath.indexOf('?') === -1 ? '?' : '&'}needConfirm=1`
            router.push({
                name: 'Login',
                query: {
                    back
                }
            })
            sessionSet(lastSelectSignal, JSON.stringify(item))
        } else if (customerInfo.value?.companyType && customerInfo.value.companyType === 'demo') {
            // 模拟
            confirmDemo().then(() => {
                mitt.emit('SwitchAccount', 'real')
            })
        } else {
            mitt.emit('SubscribeSignal', item)
        }
    }

    // 初始化弹窗
    function initSubscribeConfirm () {
        try {
            // 仅网页真实用户，注册成功页以及url标记了needConfirm的用户需要判断弹窗
            if (isUniapp || !customerInfo.value || (customerInfo.value?.companyType && customerInfo.value.companyType === 'demo') || (route.path !== '/register/success' && route.fullPath.indexOf('needConfirm') === -1)) return
            const lastSignal = sessionGet(lastSelectSignal) ? JSON.parse(sessionGet(lastSelectSignal)) : null
            if (lastSignal) {
                mitt.emit('SubscribeSignal', {
                    ...lastSignal,
                    needConfirm: true,
                    goOn: true, // 是否继续订阅
                })
                sessionStorage.removeItem(lastSelectSignal)
            }
        } catch (e) {
            console.log('initSubscribeConfirm', e)
        }
    }

    // 去交易
    const jumpTrade = (sy) => {
        const product = store.getters['_signal/getSignalProduct'](sy)
        if (product?.symbolKey) {
            router.push({ path: window.isPC ? '/order' : '/product', query: { symbolId: product.symbolId, tradeType: product.tradeType } })
        } else {
            Dialog.alert({
                message: t('signal.noTradeProduct')
            })
        }
    }

    // 获取和保存参数
    const getDefaultParams = (key, obj) => {
        // 有obj就缓存，否则获取obj 默认为空对象
        try {
            const lastParams = JSON.parse(sessionGet(key)) || {}
            if (obj) {
                sessionSet(key, JSON.stringify(obj))
                return obj
            } else {
                return lastParams
            }
        } catch (e) {
            return {}
        }
    }

    // 获取和保存盈利周期
    const getRankingParams = (obj) => {
        return getDefaultParams('RankingParams', obj)
    }

    // 获取和保存评价周期
    const getEvaluateParams = (obj) => {
        return getDefaultParams('EvaluateParams', obj)
    }

    // 校验symbolCode是否有权限
    const checkSymbolCodeValid = ({ sy, callback, fail }) => {
        const product = store.getters['_signal/getSignalProduct'](sy)
        if (product?.symbolKey) {
            const validSymbol = store.getters['_quote/userProductCategoryKeys']
            if (validSymbol.includes(product.symbolKey)) {
                callback && callback(product)
                return
            }
        }
        if (fail) {
            fail()
        } else {
            Dialog.alert({
                message: t('signal.noTradeProduct')
            })
        }
    }

    return {
        saveSignalParams,
        jumpSignalTab,
        saveDetailParams,
        getAcademyUrl,
        getAcademyIndicatorUrl,
        getTelegramChannel,
        saveTabType,
        confirmDemo,
        subscribeSignal,
        initSubscribeConfirm,
        jumpTrade,
        getRankingParams,
        getEvaluateParams,
        checkSymbolCodeValid
    }
}

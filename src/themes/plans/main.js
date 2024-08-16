import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/utils/dayjs'
import Vue3Toastify, { toast } from 'vue3-toastify'
import App from './App.vue'
import router, { routes } from './router'
import store from './store'
import I18n, { setI18nLanguage, loadLocaleMessages } from './i18n/i18n.js'
import VantBase from './vantBase'
import MixinGlobal from './mixin'
import { Dialog } from 'vant'
import Socket, { MsgSocket } from '@/plugins/socket/socket'
import SocketEvent from '@/plugins/socketEvent/index'
import FindCustomerInfo from '@plans/plugins/findCustomerInfo'
import Loading from '@/components/loading'
import LayoutTop from '@plans/layout/top'
import Popover from '@/components/popover'
import { setRootVariable } from './colorVariables'
import { setRouter, modifybaseURL } from '@/utils/request'
import { getLoginParams, getQueryVariable, getToken, setToken, isEmpty, removeLoginParams, checkUserKYC, localGet, localSet, getCookie, sessionSet, getQueryString, handleEventSkip } from '@/utils/util'
import BigNumber from 'bignumber.js'
import preventReClick from '@/directives/preventReClick'
import positiveNumber from '@/directives/positiveNumber'
import { getPreDemoAccountParams } from './officialDemoAccount.js'
import { requestBusinessConfig, requestAppJson } from '@/api/wpApi'
import clickOutside from '@/directives/clickOutside.js'
import { firebaseAnalytics } from '@/utils/firebase'
import 'vue3-toastify/dist/index.css'

const isProduction = process.env.NODE_ENV === 'production'

BigNumber.config({ EXPONENTIAL_AT: [-16, 26] })

sessionSet('entrySearch', location.search) // 缓存入口url的参数，给注册开会来源使用
if (getQueryVariable('tsource')) setToken(getQueryVariable('tsource'))

//
handleEventSkip(routes)

const app = createApp(App)
app.use(preventReClick).use(positiveNumber)
app.directive('click-outside', clickOutside)
app.use(VantBase).use(I18n).use(store).use(router)
app.use(FindCustomerInfo, { $store: store, $router: router, $I18n: I18n })
app.component('Loading', Loading)
app.component('LayoutTop', LayoutTop)
app.component('Popover', Popover)
app.mixin(MixinGlobal)
app.use(ElementPlus)
app.use(
    Vue3Toastify,
    {
        autoClose: 1500,
        limit: 5,
        style: {
            opacity: '1',
            userSelect: 'initial',
        },
        theme: localGet('theme') === 'night' ? 'dark' : 'light',
        position: toast.POSITION.TOP_RIGHT,
    }
)
app.config.errorHandler = (err, vm, info) => {
    // 处理错误  `info` 是 Vue 特定的错误信息，比如错误所在的生命周期钩子
    console.error(err, vm, info)
}
// 如果有缓存有登录信息，先执行异步登录或者拉取用户信息
let loginParams = getLoginParams()
const token = getToken()

window.printLog = (...msg) => {
    const path = window.location.pathname
    const local = localGet('showConsoleLog')
    if (['all', path].includes(local)) {
        console.log(...msg)
    }
}

// 埋点事件挂载
app.config.globalProperties.$firebaseAnalytics = firebaseAnalytics
app.config.globalProperties.$isPC = window.isPC

// 设置默认主题色
if (isEmpty(localGet('invertColor'))) {
    localSet('invertColor', 'light')
}

setRouter(router)

if (loginParams || token) store.commit('_user/Update_loginLoading', true)
else if (location.search.includes('from=officialWebsite')) loginParams = getPreDemoAccountParams() // 从官网过来自动分配pre的Demo账号

// 加载业务渠道自定义配置json
requestBusinessConfig().then(res => {
    store.commit('Update_businessConfig', res)
})

// 获取到公司配置后初始化vue实例
store.dispatch('_base/initBaseConfig').then(async () => {
    if (!isProduction) modifybaseURL(store.state._base.wpCompanyInfo.apiService)

    // 注册websocket插件
    app.use(Socket, { $store: store, $router: router })

    // 注册事件ws消息推送
    app.use(SocketEvent, { $store: store, $router: router })

    // 设置语言
    const langLocal = getCookie('lang') || getQueryString('lang') || 'en-US'
    setI18nLanguage(I18n, langLocal)
    await loadLocaleMessages(I18n, langLocal)

    // 设置玩法别名
    const { tm } = I18n.global
    const tradeTypesConfig = store.state._base.wpCompanyInfo?.tradeTypesConfig || {}
    const tradeTypesConfigLocal = tradeTypesConfig[langLocal] || {}
    const tradeTypeClone = tm('tradeType')
    Object.keys(tradeTypesConfigLocal).forEach(el => {
        if (tradeTypesConfigLocal[el]) tradeTypeClone[el] = tradeTypesConfigLocal[el]
    })
    store.commit('_base/Update_plansNames', tradeTypeClone)

    // 获取设置系统推送的自选产品加入到本地缓存
    const localSelfSymbolList = localGet('selfSymbolListStorage') ? JSON.parse(localGet('selfSymbolListStorage')) : []
    if (localSelfSymbolList.length === 0) {
        const systemOptional = store.state._base.wpSelfSymbol[0].data.product
        const proArr = []
        Object.keys(systemOptional).forEach(el => {
            if (Object.keys(systemOptional[el]).find(it => it === '2')) { // 普通游客选取客户组为2的数据加载到本地自选缓存中
                systemOptional[el][2].forEach(item => {
                    proArr.push(item + '_' + el)
                })
            }
        })
        if (proArr) {
            localSet('selfSymbolListStorage', JSON.stringify(proArr))
            store.dispatch('_user/queryLocalCustomerOptionalList', proArr)
        }
    }

    // 如果有缓存有登录信息，先执行异步登录或者拉取用户信息
    if (token) {
        Promise.resolve().then(() => {
            return store.dispatch('_user/findCustomerInfo')
        }).then(res => {
            if (typeof (res.check) === 'function' && res.check()) {
                checkUserKYC({ res, Dialog, router, store, t: I18n.global.t })
            } else if (res.invalid && res.invalid()) {
                removeLoginParams()
                return false
            }
            // 登录消息websocket
            MsgSocket.subscribedListAdd('login', function () {
                MsgSocket.login()
            })
        })
    } else {
        store.dispatch('_quote/querySymbolBaseInfoList', null)
    }
    app.mount('#app')
})
// 获取支付通道

// 加载业务渠道自定义配置APP.json
requestAppJson().then(res => {
    store.commit('_base/Update_AppJson', res)
})

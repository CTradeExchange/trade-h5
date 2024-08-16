import { createApp } from 'vue'
import '@vant/touch-emulator'
import Vue3Toastify, { toast } from 'vue3-toastify'
import '@/utils/dayjs'
import App from './App.vue'
import router from './router'
import routeArr from './router/routes'
import store from './store'
import I18n, { setI18nLanguage, loadLocaleMessages } from './i18n/i18n.js'
import VantBase from './vantBase'
import MixinGlobal from './mixin'
import { Dialog } from 'vant'
import Socket, { MsgSocket } from '@/plugins/socket/socket'
import SocketEvent from '@/plugins/socketEvent/index'
import FindCustomerInfo from '@planspc/plugins/findCustomerInfo'
import Loading from '@/components/loading'
import PageComp from '@planspc/components/PageComp'
import LayoutTop from '@planspc/layout/centerViewTop'
import Popover from '@/components/popover'
import { setRootVariable } from './colorVariables'
import { setRouter, modifybaseURL } from '@/utils/request'
import { getLoginParams, getToken, isEmpty, removeLoginParams, checkUserKYC, localGet, localSet, getCookie, sessionSet, handleEventSkip } from '@/utils/util'
import BigNumber from 'bignumber.js'
import preventReClick from '@/directives/preventReClick'
import positiveNumber from '@/directives/positiveNumber'
// import { skywalkingRegister, skywalkingRreportErrors } from './skywalkingSteup.js'
import { getPreDemoAccountParams } from './officialDemoAccount.js'
import Setup from './setup'
import { requestBusinessConfig } from '@/api/wpApi'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { firebaseAnalytics } from '@/utils/firebase'
import { DEFAULT_LANG } from '@/utils/constant'
import 'splitpanes/dist/splitpanes.css'
import 'vue3-toastify/dist/index.css'

const isProduction = process.env.NODE_ENV === 'production'
BigNumber.config({ EXPONENTIAL_AT: [-16, 26] })
sessionSet('entrySearch', location.search) // 缓存入口url的参数，给注册开会来源使用

//
handleEventSkip(routeArr)

// 调试工具
// import VConsole from 'vconsole'
// const Vconsole = new VConsole()
const app = createApp(App)
Setup(app)
app.use(preventReClick).use(positiveNumber)
app.use(VantBase).use(I18n).use(store).use(router)
app.use(FindCustomerInfo, { $store: store, $router: router, $I18n: I18n })
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
app.component('LayoutTop', LayoutTop)
app.component('PageComp', PageComp)
app.component('Popover', Popover)
app.mixin(MixinGlobal)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
} // icons-vue 中的Loading icon 样式有问题 使用 loading组件替换
app.component('Loading', Loading)

app.config.errorHandler = (err, vm, info) => {
    // 处理错误  `info` 是 Vue 特定的错误信息，比如错误所在的生命周期钩子
    console.error(err, vm, info)
    // skywalkingRreportErrors(err)
}

window.printLog = (...msg) => {
    const path = window.location.pathname
    const local = localGet('showConsoleLog')
    if (['all', path].includes(local)) {
        console.log(...msg)
    }
}

// 埋点事件挂载
app.config.globalProperties.$firebaseAnalytics = firebaseAnalytics
window.isPC = process.env.VUE_APP_theme === 'plans_PCUI'
app.config.globalProperties.$isPC = window.isPC

// 如果有缓存有登录信息，先执行异步登录或者拉取用户信息
let loginParams = getLoginParams()
const token = getToken()

// 设置默认主题色
if (isEmpty(localGet('invertColor'))) {
    localSet('invertColor', 'light')
}

setRouter(router)
setRootVariable(localGet('invertColor'))

if (loginParams || token) store.commit('_user/Update_loginLoading', true)
else if (location.search.includes('from=officialWebsite')) loginParams = getPreDemoAccountParams() // 从官网过来自动分配pre的Demo账号

// 加载业务渠道自定义配置json
requestBusinessConfig().then(res => {
    store.commit('Update_businessConfig', res)
})

// 获取到公司配置后初始化vue实例
store.dispatch('_base/initBaseConfig').then(async () => {
    store.dispatch('_base/getFooter')
    // if (isProduction) skywalkingRegister(router)
    if (!isProduction) modifybaseURL(store.state._base.wpCompanyInfo?.apiService)

    // 注册websocket插件
    app.use(Socket, { $store: store, $router: router })

    // 注册事件ws消息推送
    app.use(SocketEvent, { $store: store, $router: router })

    // 设置语言
    const langLocal = getCookie('lang') || DEFAULT_LANG
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
                systemOptional[el]['2'].forEach(item => {
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

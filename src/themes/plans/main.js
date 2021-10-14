import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import I18n, { setI18nLanguage, loadLocaleMessages } from './i18n/i18n.js'
import VantBase from './vantBase'
import MixinGlobal from './mixin'
import { Dialog } from 'vant'
import Socket, { MsgSocket } from '@/plugins/socket/socket'
import FindCustomerInfo from '@plans/plugins/findCustomerInfo'
import Loading from '@/components/loading'
import PageComp from '@plans/components/PageComp'
import LayoutTop from '@plans/layout/top'
import { setRootVariable } from './colorVariables'
import { setRouter } from '@/utils/request'
// import LuckDraw from 'vue-luck-draw/vue3'
import { getLoginParams, getToken, isEmpty, removeLoginParams, checkUserKYC, localGet, localSet } from '@/utils/util'
import BigNumber from 'bignumber.js'
import preventReClick from '@/directives/preventReClick'
import { skywalkingRegister, skywalkingRreportErrors } from './skywalkingSteup.js'
skywalkingRegister(router)

BigNumber.config({ EXPONENTIAL_AT: [-16, 20] })

// 调试工具
// import VConsole from 'vconsole'
// const Vconsole = new VConsole()

const app = createApp(App)
app.use(preventReClick)
app.use(VantBase).use(I18n).use(store).use(router)
// app.use(LuckDraw)
app.use(Socket, { $store: store, $router: router }).use(FindCustomerInfo, { $store: store, $router: router, $I18n: I18n })
app.component('Loading', Loading)
app.component('LayoutTop', LayoutTop)
app.component('PageComp', PageComp)
app.mixin(MixinGlobal)

app.config.errorHandler = (err, vm, info) => {
    // 处理错误  `info` 是 Vue 特定的错误信息，比如错误所在的生命周期钩子
    console.error(err, vm, info)
    skywalkingRreportErrors(err)
}
// 如果有缓存有登录信息，先执行异步登录或者拉取用户信息
const loginParams = getLoginParams()
const token = getToken()

// 设置默认主题色
if (isEmpty(localGet('invertColor'))) {
    localSet('invertColor', 'light')
}

setRouter(router)
setRootVariable(localGet('invertColor'))

if (loginParams || token) store.commit('_user/Update_loginLoading', true)

// 获取到公司配置后初始化vue实例
store.dispatch('_base/initBaseConfig').then(async () => {
    // 设置语言
    const defaultLocal = localGet('lang') || 'zh-CN'
    setI18nLanguage(I18n, defaultLocal)
    await loadLocaleMessages(I18n, defaultLocal)

    // 如果有缓存有登录信息，先执行异步登录或者拉取用户信息
    if (loginParams || token) {
        Promise.resolve().then(() => {
            if (loginParams) return store.dispatch('_user/login', loginParams)
            else return store.dispatch('_user/findCustomerInfo')
        }).then(res => {
            if (typeof (res.check) === 'function' && res.check()) {
                checkUserKYC({ res, Dialog, router, store, t: I18n.global.t })
            } else if (res.invalid && res.invalid()) {
                removeLoginParams()
                return false
            }
            // 登录消息websocket
            MsgSocket.subscribedListAdd(function () {
                MsgSocket.login()
            })
        })
    } else {
        store.dispatch('_quote/querySymbolBaseInfoList', null)
    }

    app.mount('#app')
})

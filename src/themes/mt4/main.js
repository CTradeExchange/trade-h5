import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VantBase from './vantBase'
import Socket, { MsgSocket } from '@/plugins/socket/socket'
import longpress from '@/directives/longpress'
import Loading from '@m/components/loading'
import Colors, { setRootVariable } from './colorVariables'
import { setRouter } from '@/utils/request'
import { getLoginParams, getToken, isEmpty, removeLoginParams } from '@/utils/util'
import FindCustomerInfo, { setStore } from '@m/composables/findCustomerInfo'

// 调试工具
// import VConsole from 'vconsole'
// const Vconsole = new VConsole()

setRouter(router)
setRootVariable(Colors)
setStore(store, router)

const app = createApp(App)
app.use(longpress)
app.use(VantBase).use(store).use(router).use(Socket, { $store: store })
app.component('Loading', Loading)

// 如果有缓存有登录信息，先执行异步登录或者拉取用户信息
const loginParams = getLoginParams()
const token = getToken()

// 启用新闻设置默认值
if (isEmpty(localStorage.getItem('openNews'))) {
    localStorage.setItem('openNews', true)
}

if (loginParams || token) store.commit('_user/Update_loginLoading', true)

// 获取到公司配置后初始化vue实例
store.dispatch('_base/initBaseConfig').then(() => {
    // 如果有缓存有登录信息，先执行异步登录或者拉取用户信息
    if (loginParams || token) {
        Promise.resolve().then(() => {
            if (loginParams) return store.dispatch('_user/login', loginParams)
            else return FindCustomerInfo()
        }).then(res => {
            if (res.invalid && res.invalid()) {
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

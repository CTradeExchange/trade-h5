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

// 调试工具
// import VConsole from 'vconsole'
// const Vconsole = new VConsole()

setRouter(router)
setRootVariable(Colors)

const app = createApp(App)
app.use(longpress)
app.use(VantBase).use(store).use(router).use(Socket, { $store: store })

app.component('Loading', Loading)

// 如果有缓存有登录信息，先执行异步登录或者拉取用户信息
const loginParams = getLoginParams()
const token = getToken()
if (loginParams) {
    store.dispatch('_user/login', loginParams).then(res => {
        if (res.invalid()) {
            removeLoginParams()
            router.push({ name: 'Login', query: { back: encodeURIComponent(location.pathname) } })
        }
        // 登录消息websocket
        MsgSocket.subscribedListAdd(function () {
            MsgSocket.login()
        })
    })
} else if (token) {
    store.dispatch('_user/findCustomerInfo').then(() => {
        // 登录消息websocket
        MsgSocket.subscribedListAdd(function () {
            MsgSocket.login()
        })
    })
}

// 启用新闻设置默认值
if (isEmpty(localStorage.getItem('openNews'))) {
    localStorage.setItem('openNews', true)
}

store.dispatch('_base/getProductCategory') // 拉取板块信息

// 获取到公司配置后初始化vue实例
store.dispatch('_base/getCompanyInfo').then(() => {
    app.mount('#app')
})

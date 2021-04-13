import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VantBase from './vantBase'
import Socket from '@/plugins/socket/socket'
import longpress from '@/directives/longpress';
import Colors,{setRootVariable} from './colorVariables'
import { setRouter } from '@/utils/request'
import { getLoginParams, getToken, removeLoginParams } from '@/utils/util'

setRouter(router)
setRootVariable(Colors)

const app = createApp(App)
app.use(longpress)
app.use(VantBase).use(store).use(router).use(Socket, { $store: store })

// 如果有缓存有登录信息，先执行异步登录或者拉取用户信息
const loginParams = getLoginParams()
const token = getToken()
if (loginParams) {
    store.dispatch('_user/login', loginParams).then(res=>{
        if(res.invalid()){
            removeLoginParams()
            router.push({name:'Login',query:{back: encodeURIComponent(route.path)}})
        }
    })
} else if(token){
    store.dispatch('_user/findCustomerInfo')
}

// 获取到公司配置后初始化vue实例
store.dispatch('_base/getCompanyInfo').then(() => {
    app.mount('#app')
})

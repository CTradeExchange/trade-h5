import { createApp } from 'vue'
import App from './preview.vue'
import store from '../store'
import VantBase from '@m/vantBase'
import MyAsset from '@index/components/placeholder/placeholder.vue'

import longpress from '@/directives/longpress'
import Loading from '@/components/loading'
import Colors, { setRootVariable } from '@m/colorVariables'
import { setRouter } from '@/utils/request'

setRouter(null)
setRootVariable(Colors)

function render (container) {
    const app = createApp(App)
    app.use(longpress)
    app.use(store)
    app.use(VantBase)
    app.component('AccountChange', MyAsset)
    app.component('MyAsset', MyAsset)
    app.component('Loading', Loading)

    app.mixin({
        data () {
            return {
                h5Preview: process.env.VUE_APP_h5Preview
            }
        },
    })

    // 获取到公司配置后初始化vue实例
    app.mount(container)
}
export default render

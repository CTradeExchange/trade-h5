import { createApp } from 'vue'
import App from './preview.vue'
import store from '@admin/pages/index/store'
import VantBase from '../vantBase'
// import router from '../router'
import I18n, { setI18nLanguage, loadLocaleMessages } from '../i18n/i18n.js'
import { localGet, localSet } from '@utils/index'
import MyAsset from '@index/components/placeholder/placeholder.vue'

import longpress from '@/directives/longpress'
import Loading from '@/components/loading'
import { setRootVariable } from '../colorVariables'
import { setRouter } from '@/utils/request'
// import LuckDraw from 'vue-luck-draw/vue3'

setRouter(null)
localSet('invertColor', 'light')
setRootVariable(localGet('invertColor'))
if (process.env.NODE_ENV === 'development') window._store = store
async function render (container) {
    const app = createApp(App)
    app.use(longpress)
    app.use(store)
    // app.use(router)
    app.use(I18n)
    app.use(VantBase)
    // app.use(LuckDraw)
    app.component('AccountChange', MyAsset)
    app.component('MyAsset', MyAsset)
    app.component('Loading', Loading)

    const defaultLocal = 'zh-CN'
    setI18nLanguage(I18n, defaultLocal)
    await loadLocaleMessages(I18n, defaultLocal)

    app.mixin({
        data () {
            return {
                h5Preview: process.env.VUE_APP_h5Preview,
            }
        },
        computed: {
            $style () {
                return {
                    primary: '#477fd3',
                    riseColor: '#F60000',
                    fallColor: '#26a69a',
                    warn: '#ef5353',
                    success: '#26a69a',
                    focusColor: '#f2a11b',
                    primaryAssistColor: '#f4f7fc',
                    color: '#333333',
                    normalColor: '#656667',
                    minorColor: '#999999',
                    placeholdColor: '#c2c2c2',
                    contentColor: '#ffffff',
                    bgColor: '#f8f8f8',
                    assistColor: '#f8f8f8',
                    lineColor: '#eeeeee'
                }
            }
        }
    })

    // 获取到公司配置后初始化vue实例
    app.mount(container)
}
export default render

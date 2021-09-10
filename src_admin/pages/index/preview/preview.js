import { createApp } from 'vue'
import App from './preview.vue'
import store from '../store'
import VantBase from '@h5/vantBase'
import I18n, { setI18nLanguage, loadLocaleMessages } from '@h5/i18n/i18n.js'
import { localGet, localSet } from '@utils/index'
import MyAsset from '@index/components/placeholder/placeholder.vue'

import longpress from '@/directives/longpress'
import Loading from '@/components/loading'
import { setRootVariable } from '@h5/colorVariables'
import { setRouter } from '@/utils/request'

setRouter(null)
localSet('invertColor', 'light')
setRootVariable(localGet('invertColor'))
if (process.env.NODE_ENV === 'development') window._store = store
async function render (container) {
    const app = createApp(App)
    app.use(longpress)
    app.use(store)
    app.use(I18n)
    app.use(VantBase)
    app.component('AccountChange', MyAsset)
    app.component('MyAsset', MyAsset)
    app.component('Loading', Loading)

    const defaultLocal = 'zh-CN'
    setI18nLanguage(I18n, defaultLocal)
    await loadLocaleMessages(I18n, defaultLocal)

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

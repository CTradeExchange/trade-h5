import { Dialog } from 'vant'
import { checkUserKYC } from '@/utils/util'

let router = null
let store = null

export default {
    install: (app, { $store, $router } = {}) => {
        router = $router
        store = $store
        const findCustomerInfo = () => {
            return store.dispatch('_user/findCustomerInfo').then(res => {
                if (typeof (res.check) === 'function' && res.check()) {
                    checkUserKYC({ res, Dialog, router, store })
                }
                return res
            })
        }
        app.config.globalProperties.$findCustomerInfo = findCustomerInfo
    }
}

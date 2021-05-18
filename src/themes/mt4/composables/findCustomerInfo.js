import { Dialog } from 'vant'
let router = null
let store = null

export function setStore (storeObj, routerObj) {
    router = routerObj
    store = storeObj
}

export default function () {
    return store.dispatch('_user/findCustomerInfo').then(res => {
        if (res.check()) {
            // 登录KYC,0未认证跳,需转到认证页面,1待审核,2审核通过,3审核不通过
            if (Number(res.data.kycAuditStatus === 0)) {
                return Dialog.alert({
                    title: '提示',
                    confirmButtonText: '去认证',
                    message: '您还未进行KYC认证，点击去认证',
                    theme: 'round-button',
                }).then(() => {
                    router.push('/authentication')
                })
            } else if (Number(res.data.kycAuditStatus === 1)) {
                return Dialog.alert({
                    title: '提示',
                    confirmButtonText: '关闭',
                    message: '您的资料正在审核中，等耐心等待',
                    theme: 'round-button',
                }).then(() => {
                    store.dispatch('_user/logout')
                })
            } else if (Number(res.data.kycAuditStatus === 3)) {
                return Dialog.alert({
                    title: '提示',
                    confirmButtonText: '重新提交',
                    message: '您的资料审核失败',
                    theme: 'round-button',
                }).then(() => {
                    router.push('/authentication')
                })
            }
        }
        return res
    })
}

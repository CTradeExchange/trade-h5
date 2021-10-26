import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Schema from 'async-validator'
import md5 from 'js-md5'
import { useI18n } from 'vue-i18n'
import { getDevice, localGet, localSet, getArrayObj } from '@/utils/util'
import MsgSocket from '@/plugins/socket/msgSocketEvent'
import RuleFn from './rule'
import { Toast, Dialog } from 'vant'
export default function () {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const { t } = useI18n({ useScope: 'global' })

    // 登录成功跳转
    const loginToPath = () => {
        const toURL = route.query.back ? decodeURIComponent(route.query.back) : '/'
        router.replace(toURL)
    }

    // 点击登录
    const loginSubmit = (state) => {
        const loginParams = {
            type: state.loginName.includes('@') ? 1 : 2,
            loginName: state.loginName,
            device: getDevice(),
            verifyCode: state.loginType === 'checkCode' ? state.checkCode : undefined,
            loginPwd: state.loginType === 'password' ? md5(state.pwd) : undefined,
            sendToken: state.loginType === 'checkCode' ? state.token : undefined,
        }

        const validator = new Schema(RuleFn(t))

        return new Promise((resolve) => {

        })
        validator.validate(
            {
                ...loginParams
            }, {
                ...state,
                first: true
            }, (errors, fields) => {
                // console.log(errors, fields)
                if (errors) {
                    state.loading = false
                    Toast(errors[0].message)
                    return
                }
                return store.dispatch('_user/login', loginParams)
            })
    }
    // 发送登录接口
    // const loginSubmit = (params) => {
    //     state.loading = true
    //     return store.dispatch('_user/login', params).then(res => {
    //         state.loading = false
    //         // console.log(res)
    //         if (res.invalid()) return res

    //         // 登录websocket
    //         MsgSocket.login()
    //         store.commit('del_cacheViews', 'Home')
    //         store.commit('del_cacheViews', 'Layout')

    //         return res

    //         // 登录KYC,kycAuditStatus:0未认证跳,需转到认证页面,1待审核,2审核通过,3审核不通过
    //         // companyKycStatus 公司KYC开户状态，1开启 2未开启
    //         if (Number(res.data.companyKycStatus) === 1) {
    //             if (Number(res.data.kycAuditStatus === 0)) {
    //                 return Dialog.alert({
    //                     title: t('common.tip'),
    //                     confirmButtonText: t('login.goAuthenticate'),
    //                     message: t('login.goAuthenticateMsg'),

    //                 }).then(() => {
    //                     router.push('/authentication')
    //                 })
    //             } else if (Number(res.data.kycAuditStatus === 1)) {
    //                 return Dialog.alert({
    //                     title: t('common.tip'),
    //                     confirmButtonText: t('common.close'),
    //                     message: t('common.inReview'),

    //                 }).then(() => {
    //                     store.dispatch('_user/logout').then(() => {
    //                         return router.push('/login')
    //                     }).then(() => {
    //                         location.reload()
    //                     })
    //                 })
    //             } else if (Number(res.data.kycAuditStatus === 3)) {
    //                 return Dialog.alert({
    //                     title: t('common.tip'),
    //                     confirmButtonText: t('common.reSubmit'),
    //                     message: t('common.reviewFailed') + '\n' + t('common.reviewReson') + res.data.kycAuditRemark,

    //                 }).then(() => {
    //                     router.push('/authentication')
    //                 })
    //             } else if (Number(res.data.kycAuditStatus === 2)) {
    //                 Dialog.alert({
    //                     title: t('common.tip'),
    //                     confirmButtonText: t('common.ok'),
    //                     message: t('common.reviewSuccess'),

    //                 }).then(() => {
    //                     noticeSetPwd(res.data.loginPassStatus)
    //                 })
    //             }
    //         } else if (Number(res.data.companyKycStatus) === 2) {
    //             noticeSetPwd(res.data.loginPassStatus)
    //         }
    //     })
    // }

    return {
        loginToPath,
        loginSubmit,
    }
}

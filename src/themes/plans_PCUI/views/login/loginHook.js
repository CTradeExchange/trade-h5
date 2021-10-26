import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Schema from 'async-validator'
import md5 from 'js-md5'
import { useI18n } from 'vue-i18n'
import { getDevice } from '@/utils/util'
import { MsgSocket } from '@/plugins/socket/socket'
import RuleFn from './rule'
import { Toast } from 'vant'
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
            loginPwd: state.loginType === 'password' ? state.pwd : undefined,
            sendToken: state.loginType === 'checkCode' ? state.token : undefined,
        }

        const validator = new Schema(RuleFn(t))

        return new Promise((resolve, reject) => {
            validator.validate(
                loginParams,
                {
                    ...loginParams,
                    loginType: state.loginType,
                    first: true,
                },
                (errors, fields) => {
                    // console.log(errors, fields)
                    if (errors) {
                        state.loading = false
                        Toast(errors[0].message)
                        reject()
                        return
                    }
                    return store.dispatch('_user/login', {
                        ...loginParams,
                        loginPwd: md5(state.pwd)
                    }).then(res => {
                        if (res.check()) {
                            MsgSocket.login()
                        }
                        resolve(res)
                        return res
                    })
                })
        })
    }

    // 发送验证码
    // const sendVerifyCode = (callback) => {
    //     const verifyParams = {
    //         type: state.loginName.includes('@') ? 1 : 2,
    //         loginName: state.loginName
    //     }

    //     const validator = new Schema(RuleFn(t))
    //     validator.validate({
    //         ...verifyParams
    //     }).then(res => {
    //         // 检测客户是否存在,同时获取区号
    //         checkUserStatus(verifyParams).then(res => {
    //             if (res.check()) {
    //                 if (Number(res.data.status) === 2) {
    //                     const msg = t(verifyParams.type === 1 ? 'common.noEmail' : 'common.noPhone')
    //                     callback && callback(false)
    //                     return Toast(msg)
    //                 } else if (Number(res.data.status === -1)) {
    //                     callback && callback(false)
    //                     return Toast(t('c.userDisable'))
    //                 } else {
    //                     state.zone = res.data.phoneArea
    //                     const params = {
    //                         bizType: state.loginName.includes('@') ? 'EMAIL_LOGIN_VERIFICATION_CODE' : 'SMS_LOGIN_VERIFICATION_CODE',
    //                         toUser: state.loginName.includes('@') ? state.loginName : String(state.zone) + ' ' + state.loginName,
    //                     }
    //                     verifyCodeSend(params).then(res => {
    //                         if (res.check()) {
    //                             token = res.data.token
    //                             // if (res.data.code) state.checkCode = res.data.code
    //                             callback && callback()
    //                         } else {
    //                             callback && callback(false)
    //                         }
    //                     }).catch(err => {
    //                         callback && callback(false)
    //                     })
    //                 }
    //             }
    //         })
    //     }).catch(({
    //         errors,
    //         fields
    //     }) => {
    //         callback && callback(false)
    //         if (errors) {
    //             Toast(errors[0].message)
    //         }
    //     })
    // }

    return {
        loginToPath,
        loginSubmit,
        // sendVerifyCode,
    }
}

// 处理登录逻辑
import { computed, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import { getDevice, localGet, localSet, getArrayObj, sessionGet } from '@/utils/util'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { googleLoginVerify, facebookLoginVerify, thirdRegist, thirdLogin } from '@/api/user'
import { Toast, Dialog } from 'vant'
import { setQuoteService } from '@/plugins/socket/socket'
export default function hooks (state) {
    const { t } = useI18n({ useScope: 'global' })
    const instance = getCurrentInstance()
    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    const registList = computed(() => store.state._base.wpCompanyInfo?.registList)
    const companyId = computed(() => store.state._base.wpCompanyInfo.companyId)

    // 处理与cats系统交互
    const handleCBLogin = (id_token) => {
        console.log('login come in ')
        state.loading = true
        googleLoginVerify({
            idToken: id_token,
            companyId: companyId.value
        }).then(res => {
            state.loading = false
            if (res.check()) {
                var { action } = res.data
                state.userId = res.data.userId
                state.thirdSource = res.data.thirdSource

                if (action === 'register') {
                    state.bindAddShow = true
                } else if (action === 'login') {
                    handleThirdLogin()
                } else if (action === 'bind') {
                    Dialog.confirm({
                        title: t('tip'),
                        message: '您的邮箱已注册了账号，请登录账号',
                        confirmButtonText: t('common.sure'),
                        cancelButtonText: t('common.cancel')
                    }).then(() => {
                        router.push({
                            path: '/login',
                            query: {
                                bindThirdUserId: state.userId,
                                thirdSource: state.thirdSource
                            }
                        })
                    }).catch(() => {})
                }
            }
        }).catch(err => {
            state.loading = false
        })
    }

    // 处理三方登录
    const handleThirdLogin = () => {
        const params = {
            companyId: companyId.value,
            userId: state.userId,
            thirdSource: state.thirdSource,
            isThird: true // true为三方登录 false 系统登录
        }
        store.dispatch('_user/login', params).then(res => {
            if (res.invalid()) return false

            // 切换登录后的行情websocket
            setQuoteService()

            // 登录websocket
            instance.appContext.config.globalProperties.$MsgSocket.login()
            store.commit('del_cacheViews', 'Home')
            store.commit('del_cacheViews', 'Layout')

            // 登录KYC,kycAuditStatus:0未认证跳,需转到认证页面,1待审核,2审核通过,3审核不通过
            // companyKycStatus 公司KYC开户状态，1开启 2未开启
            // checkUserKYC({ res, Dialog, router, store, t: I18n.global.t })

            if (Number(res.data.companyKycStatus) === 1) {
                if (Number(res.data.kycAuditStatus === 0)) {
                    return Dialog.alert({
                        title: t('common.tip'),
                        confirmButtonText: t('login.goAuthenticate'),
                        message: t('login.goAuthenticateMsg'),

                    }).then(() => {
                        router.push('/authentication')
                    })
                } else if (Number(res.data.kycAuditStatus === 1)) {
                    return Dialog.alert({
                        title: t('common.tip'),
                        confirmButtonText: t('common.close'),
                        message: t('common.inReview'),

                    }).then(() => {
                        store.dispatch('_user/logout').then(() => {
                            return router.push('/login')
                        }).then(() => {
                            location.reload()
                        })
                    })
                } else if (Number(res.data.kycAuditStatus === 3)) {
                    return Dialog.alert({
                        title: t('common.tip'),
                        confirmButtonText: t('common.reSubmit'),
                        message: t('common.reviewFailed') + '\n' + t('common.reviewReson') + res.data.kycAuditRemark,

                    }).then(() => {
                        router.push('/authentication')
                    })
                } else if (Number(res.data.kycAuditStatus === 2)) {
                    noticeSetPwd(res.data.loginPassStatus)
                }
            } else if (Number(res.data.companyKycStatus) === 2) {
                noticeSetPwd(res.data.loginPassStatus)
            }
        })
    }

    const noticeSetPwd = (loginPassStatus) => {
        if (parseInt(loginPassStatus) === 1 && !localGet('loginPwdIgnore')) {
            // 未设置密码
            const event = new CustomEvent('MSG_UNSET_PWD', { detail: '' })
            document.body.dispatchEvent(event)
        } else {
            loginToPath()
        }
    }

    // 登录成功跳转
    const loginToPath = () => {
        const toURL = route.query.back ? decodeURIComponent(route.query.back) : '/'
        router.replace(toURL)
    }

    const areaActions = computed(() => {
        const countryList = store.state.countryList
        const tempArr = []
        countryList.forEach(item => {
            tempArr.push({
                name: item.name + ' (' + item.countryCode + ')',
                code: item.countryCode,
                countryCode: item.code,
                countryName: item.name
            })
        })

        return tempArr
    })
}

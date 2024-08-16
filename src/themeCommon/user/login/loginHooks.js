// 处理登录逻辑
import { ref, computed, getCurrentInstance } from 'vue'
import { googleLoginVerify, facebookLoginVerify, twitterLoginVerify, telegramLoginVerify, appleLoginVerify, thirdRegist, socialRegister } from '@/api/user'
import { getDevice, getQueryVariable, localGet, localSet, getArrayObj, sessionGet, setToken, localSetJSON, getDefaultZoneIndex, getCookie, sessionSet } from '@/utils/util'
import { setQuoteService } from '@/plugins/socket/socket'
import { firebaseAnalytics } from '@/utils/firebase'
import { useRoute, useRouter } from 'vue-router'
import { Toast, Dialog } from 'vant'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import useMethods from '@planspc/hooks/useMethods'
import { toast } from 'vue3-toastify'

export default function hooks (state) {
    const { t } = useI18n({ useScope: 'global' })
    const instance = getCurrentInstance()
    const store = useStore()
    const route = useRoute()
    const { rouType } = route.query
    const router = useRouter()
    const entrySearch = sessionGet('entrySearch')
    const { toOrderPriority } = useMethods()

    const registList = computed(() => store.state._base.wpCompanyInfo?.registList)
    const companyId = computed(() => store.state._base.wpCompanyInfo.companyId)
    // 接口返回的第三方信息
    const thirdInfo = ref({})
    // 处理与cats系统交互
    const handleCBLogin = (id_token, data = {}) => {
        const code = data.code || ''
        const email = data.email || ''
        const phone = data.phone || ''
        state.loading = true
        let params = {}
        let loginVerifyUrl = null
        if (state.loginType === 'google') {
            params = {
                idToken: id_token,
                companyId: companyId.value
            }
            loginVerifyUrl = googleLoginVerify
        } else if (state.loginType === 'facebook') {
            params = {
                accessToken: id_token,
                companyId: companyId.value
            }
            loginVerifyUrl = facebookLoginVerify
        } else if (state.loginType === 'twitter') {
            params = {
                authResponse: id_token,
                companyId: companyId.value
            }
            loginVerifyUrl = twitterLoginVerify
            // } else if (state.loginType === 'telegram-h5' || state.loginType === 'telegram-pc') {
        } else if (state.loginType === 'telegram') {
            // params = {
            //     userJsonStr: JSON.stringify(id_token),
            //     companyId: companyId.value,
            //     channelSource: (state.loginType === 'telegram-h5' ? 'h5' : 'pc')
            // }
            params = {
                userJsonStr: JSON.stringify(id_token),
                companyId: companyId.value,
                isWebApp: false, // 预留给webapp使用
            }
            loginVerifyUrl = telegramLoginVerify
        } else if (state.loginType === 'apple') {
            params = {
                companyId: companyId.value,
                code,
                idToken: id_token
            }
            // apple只有首次授权可以获取到邮箱，所以需要传给后端保存
            if (email && (email.indexOf('privaterelay.appleid.com') === -1)) {
                params.email = email
            }
            loginVerifyUrl = appleLoginVerify
        }

        loginVerifyUrl(params).then(res => {
            state.loading = false
            if (res.check()) {
                var { action, failReason } = res.data
                state.userId = res.data.userId
                state.thirdSource = res.data.thirdSource
                thirdInfo.value = res.data
                if (action === 'register') {
                    handleThirdRegist()
                } else if (action === 'login') {
                    handleThirdLogin()
                } else if (action === 'bind') {
                    Dialog.confirm({
                        title: t('tip'),
                        message: t('login.registered'),
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
                    }).catch(() => { })
                } else {
                    Toast(failReason)
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
        if (thirdInfo.value?.email) {
            params.email = thirdInfo.value?.email
        } else {
            params.phone = thirdInfo.value?.phone
        }
        if (state.thirdSource === 'telegram') {
            params.authToken = thirdInfo.value?.authToken
        }
        store.dispatch('_user/login', params).then(res => {
            if (res.invalid()) return false

            // firebase
            firebaseAnalytics('login_success', {
                key: 'login_success',
                value: state.thirdSource === 'telegram' ? 'tg' : state.thirdSource === 'google' ? 'gmail' : state.thirdSource
            })

            // 切换登录后的行情websocket
            setQuoteService()

            // 登录websocket
            instance.appContext.config.globalProperties.$MsgSocket.login()
            store.commit('del_cacheViews', 'Home')
            store.commit('del_cacheViews', 'Layout')

            // 登录KYC,kycAuditStatus:0未认证跳,需转到认证页面,1待审核,2审核通过,3审核不通过
            // companyKycStatus 公司KYC开户状态，1开启 2未开启
            // checkUserKYC({ res, Dialog, router, store, t: I18n.global.t })
            const { companyKycStatus, kycAuditStatus } = res.data

            if (Number(companyKycStatus) === 1) {
                if (Number(kycAuditStatus === 0)) {
                    return Dialog.alert({
                        title: t('common.tip'),
                        confirmButtonText: t('login.goAuthenticate'),
                        message: t('login.goAuthenticateMsg'),
                    }).then(() => {
                        router.push('/authentication')
                    })
                } else if (Number(kycAuditStatus === 1)) {
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
                } else if (Number(kycAuditStatus === 3)) {
                    return Dialog.alert({
                        title: t('common.tip'),
                        confirmButtonText: t('common.reSubmit'),
                        message: t('common.reviewFailed') + '\n' + t('common.reviewReson') + res.data.kycAuditRemark,

                    }).then(() => {
                        router.push('/authentication')
                    })
                } else if (Number(kycAuditStatus === 2)) {
                    toOrderPriority(2)
                }
            } else if (Number(companyKycStatus) === 2) {
                // loginToPath()
                toOrderPriority(2)
            }
        })
    }

    // 处理第三方注册
    const handleThirdRegist = () => {
        // 有邮箱或者手机号直接发起注册
        const isTG = state.thirdSource === 'telegram'
        const isEP = thirdInfo.value?.email || thirdInfo.value?.phone
        if (isEP || isTG) {
            state.loading = true
            state.country = defaultCountry.value?.code
            state.customerGroupId = getCustomerGroupIdByCountry(state.country)?.customerGroupId
            const params = {
                companyId: companyId.value,
                userId: state.userId,
                thirdSource: state.thirdSource,
                customerGroupId: state.customerGroupId,
                country: state.country,
                registerSource: getDevice(),
                utmSource: getQueryVariable('utm_source', entrySearch),
                utmMedium: getQueryVariable('utm_medium', entrySearch),
                utmCampaign: getQueryVariable('utm_campaign', entrySearch),
                utmContent: getQueryVariable('utm_content', entrySearch),
                utmTerm: getQueryVariable('utm_term', entrySearch),
            }
            if (thirdInfo.value?.email) {
                params.email = thirdInfo.value?.email
            } else if (thirdInfo.value?.phone) {
                params.phone = thirdInfo.value?.phone
            }
            if (isTG && thirdInfo.value?.authToken) {
                params.authToken = thirdInfo.value?.authToken
            }
            if (state.thirdSource === 'telegram') {
                firebaseAnalytics('sign_up_summit_tg', {
                    key: 'sign_up_summit_tg',
                    value: JSON.stringify({
                        sign_up_summit_tg: 'phone',
                        phone: thirdInfo.value?.phone,
                    }),
                })
            } else if (state.thirdSource === 'google') {
                firebaseAnalytics('sign_up_summit_gg', {
                    key: 'sign_up_summit_gg',
                    value: JSON.stringify({
                        sign_up_summit_gg: 'email',
                        email: thirdInfo.value?.email
                    }),
                })
            } else if (state.thirdSource === 'apple') {
                const value = {}
                if (thirdInfo.value?.email) value.email = thirdInfo.value?.email
                if (thirdInfo.value?.phone) value.phone = thirdInfo.value?.phone
                firebaseAnalytics('sign_up_summit_ap', {
                    key: 'sign_up_summit_ap',
                    value: JSON.stringify({
                        sign_up_summit_ap: thirdInfo.value?.email ? 'email' : 'phone',
                        ...value,
                    }),
                })
            }
            const registerApi = isTG ? socialRegister : thirdRegist
            window?.printLog(params, 'params')
            // console.log('注册卡住了====>', params)
            // return
            registerApi(params).then(res => {
                state.loading = false
                if (res?.code === 'CUSTOMER_API_00010001') {
                    // 人工审核
                    router.replace({ name: 'RegisterHandler' })
                } else if (res.check()) {
                    // firebase
                    firebaseAnalytics('sign_up_success', {
                        key: 'sign_up_success',
                        value: JSON.stringify({
                            utmSource: getQueryVariable('utm_source', entrySearch),
                            utmMedium: getQueryVariable('utm_medium', entrySearch),
                            utmCampaign: getQueryVariable('utm_campaign', entrySearch),
                            thirdSource: state.thirdSource === 'telegram' ? 'tg' : state.thirdSource === 'google' ? 'gmail' : state.thirdSource
                        })
                    }, res.data)
                    // 注册成功
                    sessionStorage.setItem('RegisterParams', JSON.stringify({ ...params, openType: 4 }))
                    sessionStorage.setItem('RegisterData', JSON.stringify(res))
                    if (res.data.token) setToken(res.data.token)

                    // 注册成功重新获取客户信息
                    store.dispatch('_user/findCustomerInfo')
                    // 重新登录清除账户信息
                    store.commit('_user/Update_accountAssets', {})
                    // 登录websocket
                    instance.appContext.config.globalProperties.$MsgSocket.login()

                    // 切换登录后的行情websocket
                    setQuoteService()

                    sessionSet('inletRegister', true)

                    if (res.data.list.length > 0) {
                        // 需要KYC认证
                        sessionStorage.setItem('kycList', JSON.stringify(res.data.list))
                        router.replace({
                            name: 'RegKyc',
                            query: { levelCode: res.data.list[0].levelCode }
                        })
                        // const url = `${location.origin}/${getCookie('lang') || 'en-US'}/regKyc?levelCode=${res.data.list[0].levelCode}`
                        // location.replace(url)
                    } else {
                        // console.log('我注册成功走这里逻辑了')
                        // router.replace({ name: 'RegisterSuccess' })
                        toast.success(t('register.openSuccess'))
                        if (rouType) {
                            toOrderPriority(2)
                        } else {
                            router.push({ path: '/home' })
                        }

                        // const url = `${location.origin}/${getCookie('lang') || 'en-US'}/register/success`
                        // location.replace(url)
                    }
                } else {
                    res.toast()
                }
            }).catch(err => {
                state.loading = false
            })
        } else {
            // 没有邮箱或者手机号跳转到app注册页面
            localSetJSON('thirdInfo', thirdInfo.value)
            router.push({ name: 'AppRegister' })
            // router.push(route.path + '/appRegister')
            // const url = `${location.origin}/${getCookie('lang') || 'en-US'}/appRegister`
            // location.replace(url)
        }
    }

    // 选择国家
    const onSelectCountry = (country) => {
        // 调后台注册接口
        state.country = country.countryCode
        state.customerGroupId = getCustomerGroupIdByCountry(country.countryCode)?.customerGroupId
        state.bindAddShow = false
        handleThirdRegist()
    }

    // 国家地区列表
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

    // 默认选择的国家地区
    const defaultCountry = computed(() => {
        const countryList = store.state.countryList
        const defaultZone = store.state._base.wpCompanyInfo?.defaultZone
        const index = getDefaultZoneIndex(countryList, defaultZone?.code)
        const defaultZoneConfig = (index === -1) ? countryList[0] : countryList[index]
        return defaultZoneConfig
    })

    // 根据国家获取对应的客户组
    const getCustomerGroupIdByCountry = country => {
        if (!country || !registList.value?.length) return null
        let _resultGroup = registList.value?.find(el => el.registCountry.code === country)
        if (!_resultGroup) _resultGroup = registList.value?.find(el => el.registCountry.isOther)
        return _resultGroup
    }

    // 登录成功跳转
    const loginToPath = () => {
        const toURL = route.query.back ? decodeURIComponent(route.query.back) : '/order'
        const backURL = route.query.activityBack ? decodeURIComponent(route.query.activityBack) : toURL // 返回活动页面的链接
        // const url = `${location.origin}/${getCookie('lang') || 'en-US'}${backURL}`
        // location.replace(url)
        router.replace(backURL)
    }

    return {
        handleCBLogin,
        onSelectCountry,
        areaActions
    }
}

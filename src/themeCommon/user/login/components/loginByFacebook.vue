<template>
    <a class='loginByFacebook' @click='onLogin'>
        <i class='icon'></i>
    </a>
    <Loading :show='loading' />
    <!-- 请补充您所在国家信息 -->
    <van-action-sheet
        v-model:show='bindAddShow'
        :actions='areaActions'
        teleport='#app'
        title='请补充您所在国家信息'
        @select='onSelectCountry'
    />
</template>

<script>
import { reactive, toRefs, computed, onMounted, watch, getCurrentInstance } from 'vue'
import { facebookLoginVerify, thirdRegist, thirdLogin } from '@/api/user'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { Toast, Dialog } from 'vant'
import { useRoute, useRouter } from 'vue-router'
import { getDevice, localGet, localSet, getArrayObj, sessionGet, checkUserKYC, setToken } from '@/utils/util'
import { setQuoteService } from '@/plugins/socket/socket'
export default {
    setup (props) {
        const { t } = useI18n({ useScope: 'global' })
        const instance = getCurrentInstance()
        const router = useRouter()
        const route = useRoute()
        const store = useStore()

        const state = reactive({
            bindAddShow: false,
            userId: '',
            thirdSource: '',
            customerGroupId: '',
            country: '',
            loading: false
        })
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
        const registList = computed(() => store.state._base.wpCompanyInfo?.registList)
        const companyId = computed(() => store.state._base.wpCompanyInfo.companyId)

        const renderBtn = () => {
            window.fbAsyncInit = function () {
                FB.init({
                    appId: '612440896764471',
                    cookie: true, // Enable cookies to allow the server to access the session.
                    xfbml: true, // Parse social plugins on this webpage.
                    version: 'v12.0' // Use this Graph API version for this call.
                })
            };

            (function (d, s, id) {
                var js; var fjs = d.getElementsByTagName(s)[0]
                if (d.getElementById(id)) { return }
                js = d.createElement(s); js.id = id
                js.src = 'https://connect.facebook.net/en_US/sdk.js'
                fjs.parentNode.insertBefore(js, fjs)
            }(document, 'script', 'facebook-jssdk'))
        }

        const onLogin = () => {
            FB.login(function (response) {
                console.log(response)
                if (response.status === 'connected') {
                    // Logged into your webpage and Facebook.
                    const accessToken = response.authResponse.accessToken
                    handleCBLogin(accessToken)
                } else {
                    // The person is not logged into your webpage or we are unable to tell.
                }
            }, { scope: 'public_profile,email' })
        }

        // 处理与cats系统交互
        const handleCBLogin = (id_token) => {
            console.log('login come in ')
            state.loading = true
            facebookLoginVerify({
                accessToken: id_token,
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

        const handleThirdRegist = () => {
            // 处理注册
            state.loading = true
            const params = {
                companyId: companyId.value,
                userId: state.userId,
                thirdSource: state.thirdSource,
                customerGroupId: state.customerGroupId,
                country: state.country
            }
            thirdRegist(params).then(res => {
                state.loading = false
                if (res?.code === 'CUSTOMER_API_00010001') {
                    // 人工审核
                    router.replace({ name: 'RegisterHandler' })
                } else if (res.check()) {
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

                    if (res.data.list.length > 0) {
                        // 需要KYC认证
                        sessionStorage.setItem('kycList', JSON.stringify(res.data.list))
                        router.replace(
                            {
                                name: 'RegKyc',
                                query: { levelCode: res.data.list[0].levelCode }
                            })
                    } else {
                        router.replace({ name: 'RegisterSuccess' })
                    }
                } else {
                    res.toast()
                }
            }).catch(err => {
                state.loading = false
            })
        }

        const onSelectCountry = (country) => {
            // 调后台注册接口
            // const tradeTypeCurrencyList = getPlansByCountry(country.countryCode)
            state.country = country.countryCode
            state.customerGroupId = getCustomerGroupIdByCountry(country.countryCode)?.customerGroupId
            state.bindAddShow = false

            handleThirdRegist()
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
                const toURL = route.query.back ? decodeURIComponent(route.query.back) : '/'
                console.log('toUrl', toURL)
                router.replace(toURL)
            })
        }

        // 根据国家获取对应的客户组
        const getCustomerGroupIdByCountry = country => {
            if (!country || !registList.value?.length) return null
            let _resultGroup = registList.value.find(el => el.registCountry.code === country)
            if (!_resultGroup) _resultGroup = registList.value.find(el => el.registCountry.isOther)
            return _resultGroup
        }

        const noticeSetPwd = (loginPassStatus) => {
            if (parseInt(loginPassStatus) === 1 && !localGet('loginPwdIgnore')) {
                state.loginPwdPop = true
            } else {
                loginToPath()
            }
        }

        // 登录成功跳转
        const loginToPath = () => {
            const toURL = route.query.back ? decodeURIComponent(route.query.back) : '/'
            router.replace(toURL)
        }

        // 获取国家区号
        store.dispatch('getCountryListByParentCode')

        onMounted(() => {
            renderBtn()
        })

        return {
            onLogin,
            areaActions,
            onSelectCountry,
            ...toRefs(state)
        }
    }

}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.loginByFacebook {
    display: flex;
    align-items: center;
    justify-content: center;
    width: rem(80px);
    height: rem(80px);
    border: 1px solid var(--lineColor);
    border-radius: 50%;
    .icon {
        display: inline-block;
        width: rem(46px);
        height: rem(46px);
        background-image:  url('/images/facebook.png');
        background-size: 100%;
    }
}
</style>

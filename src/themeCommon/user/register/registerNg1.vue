<template>
    <!-- <Top class="topBar" /> -->
    <LayoutTop :menu='false' :show-title='false' :title="$t('route.mine')" />
    <div class='register'>
        <div class='container'>
            <div class='logoContainer'>
                <p>Testiung</p>
                <img alt='logo' class='investing' src='../../../themes/plans_PCUI/images/cpi1/investing.com.svg' />
            </div>
            <div class='logoContainer'>
                <img alt='logo' class='headlineLogo' src='../../../themes/plans_PCUI/images/craigIndexImg/headline_horizontal_logo.png' />
            </div>
            <p class='pageTitle'>
                {{ openAccountType === 1 ? $t("register.businessOpen") : $t("register.openAccount") }}
            </p>
            <div v-if='registerBanner' class='banner'>
                <img
                    alt=''
                    :src='registerBanner'
                    srcset=''
                />
            </div>
            <van-tabs
                v-model:active='openType'
                class='openTypeTab'
                shrink
            >
                <van-tab name='email' :title="$t('register.email')" />
                <van-tab name='mobile' :title="$t('register.phoneNo')" />
            </van-tabs>
            <form class='form'>
                <div v-show="openType === 'mobile'" class='cell'>
                    <areaInput
                        ref='zoneSelectRef'
                        v-model.trim='mobile'
                        v-model:zone='zone'
                        :account-type='openAccountType'
                        clear
                        :country-code='countryCode'
                        :placeholder="$t('register.phoneNo')"
                        :show-select='true'
                        @zoneSelect='zoneSelect'
                    />
                </div>
                <div v-show="openType === 'email'" class='cell'>
                    <InputComp
                        v-model.trim='email'
                        clear
                        :label="$t('register.email')"
                    />
                </div>
                <div v-show="openType === 'mobile'" class='cell'>
                    <CheckCode
                        v-model.trim='mobileCheckCode'
                        clear
                        :label="$t('login.verifyCode')"
                        :loading='verifyCodeLoading'
                        @verifyCodeSend='verifyCodeSendHandler'
                    />
                </div>
                <div v-show="openType === 'email'" class='cell'>
                    <CheckCode
                        v-model.trim='emailCheckCode'
                        clear
                        :label="$t('login.verifyCode')"
                        :loading='verifyCodeLoading'
                        @verifyCodeSend='verifyCodeSendHandler'
                    />
                </div>
                <div class='cell'>
                    <InputComp
                        v-model='pwd'
                        clear
                        :label="$t('register.newPassword')"
                        pwd
                    />
                </div>
                <div v-if='inviteEnable || isEnableNewsInvite' class='cell'>
                    <InputComp
                        v-model='customerNo'
                        clear
                        :label='invitePlaceholder'
                    />
                </div>
                <div v-if='instructions' class='instructions'>
                    <van-checkbox
                        v-model='protocol'
                        class='checkbox'
                        shape='square'
                    >
                        <span v-html='instructions'></span>
                    </van-checkbox>
                </div>
                <div class='footerBtn'>
                    <van-button
                        block
                        class='registerBtn'
                        :disabled='loading'
                        @click='registerHandler(); click_listener()'
                    >
                        {{ $t("register.registerBtn") }}
                    </van-button>
                </div>
                <div class='to-login'>
                    {{ $t("login.goLogin") }}
                    <router-link to='/login'>
                        {{ $t("login.loginBtn") }}
                    </router-link>
                </div>
            </form>
        </div>

        <third-login v-if='openAccountType === 0' />
        <div
            v-if='companyCountryVisible'
            class='businessOpen'
            :class='{ openType2: openAccountType === 1 }'
        >
            <a
                class='businessOpenBtn'
                href='javascript:;'
                @click='openAccountType = openAccountType === 0 ? 1 : 0'
            >
                {{
                    openAccountType === 0
                        ? $t("register.businessOpen")
                        : $t("register.openAccount")
                }}&nbsp;&nbsp;>>
            </a>
        </div>

        <Loading :show='loading' />

        <AwsCaptcha ref='awsCaptchaRef' @onCallback='handleCaptcha' />
    </div>
</template>

<script>
import md5 from 'js-md5'
import Schema from 'async-validator'
import Loading from '@/components/loading'
import CheckCode from '@/components/form/checkCode'
import areaInput from './components/areaInput'
import InputComp from '@/components/form/input'
import AwsCaptcha from '@/components/form/awsCaptcha'
import thirdLogin from '@/themeCommon/components/thirdLogin'
import {
    getDevice,
    getQueryVariable,
    setToken,
    getArrayObj,
    sessionGet,
    localSet,
    getDefaultZoneIndex,
    pwdReg,
    isEmpty
} from '@/utils/util'
import {
    reactive,
    toRefs,
    computed,
    getCurrentInstance,
    onMounted,
    watch,
    ref
} from 'vue'
import { Toast } from 'vant'
import { useStore } from 'vuex'
import { unescape } from 'lodash'
import { useI18n } from 'vue-i18n'
import { verifyCodeSend } from '@/api/base'
import { useRouter, useRoute } from 'vue-router'
import { register, checkUserStatus } from '@/api/user'
import RuleFn, { checkCustomerExistRule } from './rule'
import { setQuoteService } from '@/plugins/socket/socket'
import { firebaseAnalytics } from '@/utils/firebase'
import hooks from './hooks'
import getTrackingInvesting from '@/utils/investingComNg'

export default {
    components: {
        areaInput,
        CheckCode,
        Loading,
        InputComp,
        thirdLogin,
        AwsCaptcha
    },
    setup () {
        const instance = getCurrentInstance()
        const delayer = null
        const store = useStore()
        const router = useRouter()
        const route = useRoute()
        const awsCaptchaRef = ref(null)
        const entrySearch = sessionGet('entrySearch')
        const { t, locale } = useI18n({ useScope: 'global' })
        const { getCustomerGroupIdByCountry, getPlansByCountry } = hooks()
        const { openAccountType } = route.query
        const businessConfig = computed(() => store.state.businessConfig)

        const state = reactive({
            options: [{ country: 'Canada', code: 'CA' }],
            zone: '',
            pwd: '',
            customerNo: '', // 推荐人客户编号
            countryZone: '86',
            countryCode: 'ISO_3166_156',
            loading: false,
            verifyCodeLoading: false,
            emailCheckCode: '',
            mobileCheckCode: '',
            mobile: '',
            openType: 'email', // mobile 手机号开户， email 邮箱开户
            currency: 'USD',
            tradeType: 2,
            email: '',
            pageui: '',
            protocol: true,
            visited: false, // 是否已点击过获取验证码
            openAccountType: Number(route.query.openAccountType) || 0, // 开户类型 0:个人 1.企业 默认为个人
            countrySheetVisible: false,
            country: {},
            allCountry: [], // 所有国家列表
            mobileToken: '',
            emailToken: '',
            ipCountry: '', // 当前IP对应的国家
            defaultCountry: '', // 根据语言获取到的默认国家
            inviteVis: false,
            inviteEnable: false
        })
        // 设置默认开户类型
        if (businessConfig.value.enterpriseLogin && openAccountType) {
            state.openAccountType = openAccountType
        }
        if (businessConfig.value.inviteEnable) {
            state.inviteEnable = businessConfig.value.inviteEnable
        }

        const isEnableNewsInvite = computed(() => {
            let isEnable = false
            const newsSysConfig = store.state._base.newsSysConfig
            const newsConfig = newsSysConfig && newsSysConfig.find((o) => o.Key === 'invitationConfig')
            const { Value } = newsConfig || {}
            try {
                if (!isEmpty(Value)) {
                    const { enable } = JSON.parse(Value) || {}
                    isEnable = enable
                }
            } catch (e) {}
            return isEnable
        })

        // 邀请码提示语
        const invitePlaceholder = computed(() => {
            if (state.inviteEnable) {
                return t('register.inviteCode')
            } else if (isEnableNewsInvite.value) {
                return t('register.plsInputInvite')
            } else {
                return ''
            }
        })

        const zoneSelectRef = ref(null)
        // 初始化区号
        watch(
            [
                () => store.state.countryList,
                () => store.state._base.wpCompanyInfo?.defaultZone
            ],
            (value) => {
                if (value[0] && value[0].length) {
                    const countryList = value[0]
                    const defaultZone = value[1]
                    const index = getDefaultZoneIndex(
                        countryList,
                        defaultZone?.code
                    )
                    const defaultZoneConfig =
                        index === -1 ? countryList[0] : countryList[index]
                    if (defaultZoneConfig?.code) {
                        state.defaultCountry = defaultZoneConfig
                        state.zone = defaultZoneConfig.countryCode
                        state.countryZone = defaultZoneConfig.countryCode
                        state.countryCode = defaultZoneConfig.code
                        state.country = defaultZoneConfig
                    }
                }
            },
            { immediate: true }
        )

        const countryList = computed(() => {
            return state.openAccountType === 0
                ? store.state.countryList
                : store.getters.companyCountryList
        })

        const style = computed(() => store.state.style)
        // 注册类型
        const registerTypes = computed(
            () => store.state._base.wpCompanyInfo?.registerTypes
        )
        // 开户须知内容

        const instructions = computed(() => {
            const lang = locale.value
            const wpCompanyInfo = store.state._base.wpCompanyInfo || {}
            const protocol = wpCompanyInfo[lang]
            return protocol ? decodeURIComponent(unescape(protocol)) : ''
        })
        // 注册页banner
        const registerBanner = computed(
            () => store.state._base.wpCompanyInfo?.registerBanner
        )
        // 手机正则表达式
        const mobileReg = computed(
            () =>
                getArrayObj(countryList.value, 'countryCode', state.countryZone)
                    .extend || ''
        )

        const registerSubmit = (params) => {
            state.loading = true
            // firebase
            const fbvalue = {}
            if (state.openType === 'email') {
                fbvalue.email = params.loginName
            } else {
                fbvalue.phone = params.loginName
            }
            firebaseAnalytics('sign_up_summit', {
                key: 'sign_up_summit',
                value: state.openType === 'email' ? 'email' : 'phone',
            }, fbvalue)
            // 系统注册接口
            register(params)
                .finally(() => {
                    state.loading = false
                })
                .then((res) => {
                    if (res?.code === 'CUSTOMER_API_00010001') {
                        // 人工审核
                        router.replace({ name: 'RegisterHandler' })
                    } else if (res.check()) {
                        firebaseAnalytics('sign_up_success', {
                            key: 'sign_up_success',
                            value: JSON.stringify({
                                sign_up_success: state.openType === 'email' ? 'email' : 'phone',
                                ...fbvalue
                            })
                        }, res.data)
                        const path = route?.path.toLocaleLowerCase()
                        if ((path.match(/\/investing|\/investingmy|\/investingin|\/investingph/g) || []).length) {
                            let { subID, subid } = route?.params || {}
                            if (!subID && !subid) {
                                subID = route?.query?.subID
                                subid = route?.query?.subid
                            }
                            const body = { user_id: res.data.customerNo }
                            if (subID || subid) body['subID'] = subID || subid
                            console.log(subID)
                            getTrackingInvesting(body)
                        }
                        // 注册成功
                        sessionStorage.setItem(
                            'RegisterParams',
                            JSON.stringify({
                                ...params,
                                openType: state.openType
                            })
                        )
                        sessionStorage.setItem(
                            'RegisterData',
                            JSON.stringify(res)
                        )

                        // 缓存注册信息
                        const loginInfoParams = {
                            accountType: params.type,
                            loginName: params.loginName
                        }
                        if (state.openType === 'mobile') {
                            loginInfoParams.phoneArea = params.phoneArea
                        }
                        localSet('loginInfo', JSON.stringify(loginInfoParams))

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
                            sessionStorage.setItem(
                                'kycList',
                                JSON.stringify(res.data.list)
                            )
                            router.replace({
                                name: 'RegKyc',
                                query: { levelCode: res.data.list[0].levelCode }
                            })
                        } else {
                            router.replace({ name: 'RegisterSuccess' })
                        }
                    } else {
                        res.toast()
                    }
                })
        }

        // 提交注册
        const registerHandler = () => {
            clearTimeout(delayer)
            if (!state.visited) {
                return Toast(t('common.getVerifyCode'))
            }
            if (
                (state.openType === 'email' && !state.emailToken) ||
                (state.openType === 'mobile' && !state.mobileToken)
            ) {
                return Toast(t('common.inputRealVerifyCode'))
            }
            if (!state.pwd) {
                return Toast(t('register.newPassword'))
            }
            if (!pwdReg.test(state.pwd)) {
                return Toast(t('forgot.pwdRule'))
            }

            let params = {}
            const countryCode =
                state.openType === 'email'
                    ? state.defaultCountry.code
                    : state.countryCode
            params = {
                type: state.openType === 'email' ? 1 : 2,
                loginName:
                    state.openType === 'email' ? state.email : state.mobile,
                registerSource: getDevice(),
                verifyCode:
                    state.openType === 'email'
                        ? state.emailCheckCode
                        : state.mobileCheckCode,
                sendToken:
                    state.openType === 'email'
                        ? state.emailToken
                        : state.mobileToken,
                utmSource: getQueryVariable('utm_source', entrySearch),
                utmMedium: getQueryVariable('utm_medium', entrySearch),
                utmCampaign: getQueryVariable('utm_campaign', entrySearch),
                utmContent: getQueryVariable('utm_content', entrySearch),
                utmTerm: getQueryVariable('utm_term', entrySearch),
                protocol: state.protocol,
                tradeTypeCurrencyList: getPlansByCountry(countryCode),
                customerGroupId: getCustomerGroupIdByCountry(countryCode),
                pwd: md5(state.pwd),
                country: countryCode,
                openAccountType: state.openAccountType,
            }
            if (state.inviteEnable) {
                params.customerNo = state.customerNo
            }

            if (state.openType === 'mobile') {
                params.phoneArea = String(state.countryZone)
            } else {
                params.emailArea = String(state.defaultCountry.countryCode)
            }

            if (sessionGet('b_superiorAgent')) {
                params.thirdServerCode = sessionGet('b_superiorAgent')
                params.thirdServerSource = 'agent'
            }
            if (isEnableNewsInvite.value) {
                params.thirdServerCode = state.customerNo
            }

            const validator = new Schema(RuleFn(t))
            validator.validate(
                { ...params, mobileReg: new RegExp(mobileReg.value) },
                { first: true },
                (errors, fields) => {
                    if (errors) {
                        return Toast(errors[0].message)
                    }
                    registerSubmit(params)
                }
            )
        }
        // 发送验证码
        const verifyCodeSendHandler = (callback) => {
            state.visited = true
            const verifyParams = {
                type: state.openType === 'mobile' ? 2 : 1,
                loginName:
                    state.openType === 'mobile' ? state.mobile : state.email,
                protocol: state.protocol,
                mobileReg: new RegExp(mobileReg.value)
            }

            if (state.openType === 'mobile') {
                verifyParams.phoneArea = String(state.zone)
            } else {
                verifyParams.emailArea = String(
                    state.defaultCountry.countryCode
                )
            }

            const validator = new Schema(checkCustomerExistRule(t))
            state.verifyCodeLoading = true
            validator
                .validate(verifyParams, { first: true })
                .then((res) => {
                    // 检测客户是否存在,同时获取区号
                    checkUserStatus(verifyParams).then((res) => {
                        if (res.check()) {
                            if (Number(res.data.status) !== 2) {
                                state.verifyCodeLoading = false
                                const msg = t(
                                    verifyParams.type === 1
                                        ? 'common.existEmail'
                                        : 'common.existPhone'
                                )
                                callback && callback(false)
                                return Toast(msg)
                            } else {
                                const countryCode =
                                    state.openType === 'email'
                                        ? state.defaultCountry.code
                                        : state.countryCode
                                const params = {
                                    bizType:
                                        state.openType === 'mobile'
                                            ? 'SMS_REGISTER_VERIFICATION_CODE'
                                            : 'EMAIL_REGISTER_VERIFICATION_CODE',
                                    toUser:
                                        state.openType === 'mobile'
                                            ? state.countryZone +
                                                ' ' +
                                                state.mobile
                                            : state.email,
                                    country: countryCode
                                }
                                verifyCodeSend(params)
                                    .then((res) => {
                                        state.verifyCodeLoading = false
                                        if (res.check()) {
                                            // firebase
                                            firebaseAnalytics('sign_up_code', {
                                                key: 'sign_up_code',
                                                value: JSON.stringify({
                                                    sign_up_code: state.openType === 'email' ? 'email' : 'phone',
                                                    email: state.email || '',
                                                    phone: state.mobile || ''
                                                })
                                            })
                                            state.openType === 'mobile'
                                                ? (state.mobileToken =
                                                    res.data.token)
                                                : (state.emailToken =
                                                    res.data.token)
                                            callback && callback()
                                        } else {
                                            callback && callback(false)
                                        }
                                    })
                            }
                        }
                    })
                })
                .catch(({ errors, fields }) => {
                    callback && callback(false)
                    state.verifyCodeLoading = false
                    if (errors) {
                        Toast(errors[0].message)
                    }
                })
        }

        const handleCaptcha = () => {
            verifyCodeSendHandler()
        }

        // 选择国家
        const showZoneSelect = () => {
            zoneSelectRef.value.handleVisible(true)
        }

        const zoneSelect = (item) => {
            state.country = item
            state.countryCode = item.code // 国家code
            state.zone = item.countryCode
            state.countryZone = item.countryCode
        }

        // 是否显示企业开户的入口
        const companyCountryVisible = computed(() => {
            if (!businessConfig.value.enterpriseLogin) return false
            if (state.openAccountType === 0) {
                return store.getters.companyCountryList.find(
                    (el) => el.code === state.country.code
                )
            } else {
                return store.state.countryList.find(
                    (el) => el.code === state.country.code
                )
            }
        })

        // 根据地址栏是否有ref字段(推荐id)判断是否禁用推荐客户id的输入框
        const customerNoIsDisabled = route.query.hasOwnProperty('ref')
        if (customerNoIsDisabled) state.customerNo = route.query.ref

        onMounted(() => {
            const { mobile, email } = route.query
            if (mobile) {
                state.mobile = mobile
                state.openType = 'mobile'
            } else if (email) {
                state.email = email
                state.openType = 'email'
            }
            // 获取支持企业注册国家
            store.dispatch('getCompanyCountry')
            // 获取国家区号
            store.dispatch('getCountryListByParentCode')
        })

        const click_listener = () => {
            window.dataLayer = window.dataLayer || []
            window.dataLayer.push({
                'event': 'click',
                'gtm.elementClasses': 'register_container',
                'gtm.elementId': 'register_Btn'
            })
        }

        return {
            ...toRefs(state),
            registerHandler,
            verifyCodeSendHandler,
            style,
            countryList,
            zoneSelect,
            registerTypes,
            instructions,
            registerBanner,
            companyCountryVisible,
            customerNoIsDisabled,
            businessConfig,
            zoneSelectRef,
            showZoneSelect,
            handleCaptcha,
            awsCaptchaRef,
            isEnableNewsInvite,
            invitePlaceholder,
            click_listener
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@/sass/mixin.scss";
.logoContainer{
    text-align: center;
    .investing{
      width: 130px;
      margin-left: 110px;
    }
    .headlineLogo{
      width: 250px;
      margin: 20px 0px;
    }
}

.register {
    position: relative;
    height: 100%;
    background: var(--contentColor);
    .topBar {
        height: rem(100px);
    }
    .container {
        overflow: auto;
        .logo {
            padding-left: rem(30px);
            margin-bottom: rem(10px);
            img {
                width: rem(180px);
            }
        }
    }
}
.pageTitle {
    padding-left: rem(40px);
    font-size: rem(60px);
    font-weight: bold;
    color: var(--primaryText);
}
.banner {
    margin-top: rem(60px);
    padding: 0 rem(30px);
    img {
        display: block;
        width: 100%;
    }
}
.form {
    margin: rem(55px) rem(50px) 0;
    .footerBtn {
        width: 100%;
        margin-top: rem(60px);
        height: rem(100px);
        padding: 0 rem(30px);
        border-radius: rem(8px);
        margin-bottom: rem(30px);
    }
    .countryPlease {
        display: flex;
        flex: 1;
        justify-content: space-between;
        padding: rem(20px) rem(6px);
    }
    .to-login {
        text-align: center;
        > a {
            color: var(--primary);
        }
    }
}
.instructions {
    padding: 0 rem(30px);
}
.invite-wrap {
    margin-bottom: rem(40px);
    .text {
        color: var(--normalColor);
        padding: 0 rem(30px);
    }
}
.cell {
    height: rem(86px);
    display: flex;
    justify-content: space-between;
    margin: rem(20px) 0 rem(55px);
    border-radius: rem(10px);
    background-color: var(--placeholdBg);
    overflow: hidden;
    padding: 0 rem(20px);
    .inputWrapper {
        padding-right: 0;
    }
    .van-hairline--bottom:after {
        border-bottom: none;
    }
    div {
        flex: 1;
    }
    .zone {
        flex: none;
        width: rem(200px);
        margin-right: rem(20px);
    }
}
.openTypeTab {
    display: flex;
    height: rem(120px);
    justify-content: center;
    padding: rem(40px) rem(30px) 0 rem(30px);
    --van-padding-md: 0px;
    --van-tabs-card-height: 30px;
    :deep(.van-tabs__wrap) {
        height: auto;
    }
    :deep(.van-tabs__nav--line) {
        background-color: var(--contentColor);
    }
    :deep(.van-tabs__nav){
        border: none;
    }
    :deep(.van-tabs__line) {
        width: rem(123px);
        height: rem(10px);
        border-radius: rem(6px);
        background: var(--gradientColor);
    }
    :deep(.van-tab) {
        line-height: rem(40px);
        .van-tab__text {
            font-size: rem(36px);
            font-weight: 500;
            color: var(--primaryText);
        }
        &:first-of-type {
            margin-right: rem(80px);
        }
    }
}
:deep(.cellRow) {
    padding-top: rem(24px);
    padding-bottom: rem(24px);
}
.openTypeWrapper {
    :deep(.van-tabs__nav--card) {
        margin: 0;
        overflow: hidden;
        border-radius: rem(10px);
    }
}
:deep(.three-way-login) {
    margin-top: rem(44px);
    padding: 15px rem(30px);
    .title{
        display: flex;
        align-items: center;
        text-align: center;
        color: var(--textColor);
        margin-bottom: rem(20px);
        font-size: rem(24px);
        .text{
            padding: 0 rem(30px);
        }
         &::after{
            background: #e9ebf2;
            content: "";
            flex: 1;
            height: 1px;
        }
        &::before{
            background: #e9ebf2;
            content: "";
            flex: 1;
            height: 1px;
        }

    }
    .otherLogin {
        text-align: center;
        display: flex;
        justify-content: space-evenly;
        width: rem(470px);
        margin: rem(30px) auto 0;
    }
}
.input {
    display: block;
    width: 100%;
    height: rem(75px);
    padding: 0 5px;
    font-size: rem(30px);
    line-height: 1;
    border: 1px solid var(--lineColor);
    border-radius: rem(10px);
}
.registerBtn {
    width: calc(100% - rem(86px));
    height: rem(86px);
    font-size: rem(40px);
    line-height: rem(86px);
    color: var(--contentColor);
    background: var(--gradientColor);
    border-radius: rem(43px);
    margin: rem(65px) rem(40px) 0;
    border: none;
    &.light {
        margin-top: rem(40px);
        color: var(--primary);
        background: none;
    }
}
.checkbox {
    :deep(.van-badge__wrapper) {
        width: rem(30px);
        height: rem(30px);
        overflow: hidden;
        font-size: rem(26px);
        line-height: rem(24px);
        border-radius: rem(4px);
    }
}

.businessOpen {
    display: flex;
    align-items: center;
    justify-content: center;
    height: rem(76px);
    margin: rem(60px) rem(30px) rem(60px);
    padding: 0 rem(10px);
    border-radius: rem(8px);
    border: solid 1px var(--primary);
    &.openType2 {
        border: solid 1px var(--color);
        .businessOpenBtn {
            color: var(--color);
        }
    }
    .businessOpenBtn {
        display: inline-block;
        color: var(--primary);
        font-size: rem(26px);
        line-height: 1;
        width: 100%;
        text-align: center;
    }
}
.customNo {
    width: 100%;
    height: rem(75px);
    padding: 0 5px;
}
.isdisabled {
    color: var(--minorColor);
    padding: 0 5px;
    height: 1rem;
    line-height: 1rem;
}
</style>

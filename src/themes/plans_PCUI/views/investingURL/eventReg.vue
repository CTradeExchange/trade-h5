<template>
    <router-view />
    <div class='register'>
        <div class='container'>
            <el-row :gutter='20'>
                <el-col :span='16'>
                    <div class='container1'>
                        <img alt='logo' class='investing' src='../../images/cpi1/investing.com.svg' />
                        <p>
                            Already have an account? <span @click='jumpPage(2)'>
                                Login
                            </span>
                        </p>
                    </div>
                    <div class='container2'>
                        <div
                            class='content'
                            :class="inAnimation ? 'anim' : ''"
                            @animationend='inAnimation = false'
                        >
                            <div class='pageTitle'>
                                <h5 v-if='openAccountType === 1' class='opentype1'>
                                    {{ $t("register.businessOpen") }}
                                </h5>
                            </div>
                            <form class='form'>
                                <div v-if="openType === 'mobile'" class='cell'>
                                    <areaInputPc
                                        v-model.trim='mobile'
                                        v-model:zone='zone'
                                        clear
                                        :country-code='countryCode'
                                        :disabled='false'
                                        :is-business='openAccountType === 1'
                                        :placeholder="$t('common.inputPhone')"
                                        type='mobile'
                                        @zoneSelect='zoneSelect'
                                    />
                                </div>
                                <div v-else class='cell'>
                                    <areaInputPc
                                        v-model.trim='email'
                                        v-model:zone='zone'
                                        class='emailInput'
                                        clear
                                        :disabled='true'
                                        input-type='text'
                                        :is-business='openAccountType === 1'
                                        :placeholder="$t('common.inputEmail')"
                                        type='email'
                                        @zoneSelect='zoneSelect'
                                    />
                                </div>
                                <div
                                    v-show="openType === 'mobile'"
                                    class='cell verifyCodeCell'
                                >
                                    <CheckCode
                                        v-model.trim='mobileCheckCode'
                                        clear
                                        :label="$t('login.verifyCode')"
                                        :loading='verifyCodeLoading'
                                        @verifyCodeSend='verifyCodeSendHandler'
                                    />
                                </div>
                                <div
                                    v-show="openType === 'email'"
                                    class='cell verifyCodeCell'
                                >
                                    <CheckCode
                                        v-model.trim='emailCheckCode'
                                        clear
                                        :label="$t('login.verifyCode')"
                                        :loading='verifyCodeLoading'
                                        @verifyCodeSend='verifyCodeSendHandler'
                                    />
                                </div>
                                <div class='cell'>
                                    <compInput
                                        v-model='pwd'
                                        block
                                        :placeholder="$t('register.newPassword')"
                                        type='password'
                                        @keyup.enter='loginHandle'
                                    />
                                </div>
                                <div v-if='instructions' class='cell'>
                                    <van-checkbox
                                        v-model='protocol'
                                        class='checkbox'
                                        shape='square'
                                    >
                                        <span v-html='instructions'></span>
                                    </van-checkbox>
                                </div>
                            </form>
                            <div class='footerBtn'>
                                <van-button
                                    block
                                    class='registerBtn'
                                    :disabled='loading'
                                    onclick="dataLayer.push({'event': 'registration', 'gtm.elementClasses': 'register_container', 'gtm.elementId': 'register_Btn' });"
                                    @click='registerHandler'
                                >
                                    Start Now
                                </van-button>
                            </div>
                            <p>
                                By creating an account, I accept <span class='terms' target='_blank' @click='jumpPage(1)'>
                                    Privacy Policy
                                </span>
                            </p>
                            <div class='to-login'>
                                {{ $t("login.goLogin") }}
                                <router-link to='/login'>
                                    {{ $t("login.loginBtn") }}
                                </router-link>
                            </div>
                            <third-login v-if='openAccountType === 0' />
                            <div
                                v-if='companyCountryVisible'
                                class='businessOpen'
                                :class='{ openType2: openAccountType === 1 }'
                                @click='changeOpentype'
                            >
                                <a class='businessOpenBtn' href='javascript:;'>
                                    {{
                                        openAccountType === 0
                                            ? $t("register.businessOpen")
                                            : $t("register.openAccount")
                                    }}
                                </a>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span='8'>
                    <el-carousel height='200px'>
                        <el-carousel-item>
                            <h3 justify='center' text='2xl'>
                                testing
                            </h3>
                            <img class='carousel_image_type' src='../../images/cpi1/fullPageBanner.jpg' />
                        </el-carousel-item>
                    </el-carousel>
                </el-col>
            </el-row>
        </div>
        <!--<userLayoutFooter />-->
        <router-view />
        <Loading :show='loading' />
        <AwsCaptcha ref='awsCaptchaRef' @onCallback='handleCaptcha' />
    </div>
</template>

<script>
import partner from './components/partners.vue'
import profit from './components/profit.vue'
import competition from './components/competitionDetils.vue'
import userLayoutFooter from '@planspc/components/userLayoutFooter'
import Schema from 'async-validator'
import Loading from '@/components/loading'
import CheckCode from '@/components/form/checkCode'
import compInput from '@planspc/components/form/input'
import areaInputPc from '@/components/form/areaInputPc'
import AwsCaptcha from '@/components/form/awsCaptcha'
// import CurrencyAction from './components/currencyAction'
// import TradeTypeAction from './components/tradeTypeAction'
import {
    getDevice,
    getQueryVariable,
    setToken,
    getArrayObj,
    sessionGet,
    localSet,
    guid,
    getCookie,
    getDefaultZoneIndex,
    pwdReg
} from '@/utils/util'
import { register, checkUserStatus } from '@/api/user'
import { verifyCodeSend } from '@/api/base'
import { useStore } from 'vuex'
import {
    reactive,
    toRefs,
    computed,
    getCurrentInstance,
    onMounted,
    watch,
    ref
} from 'vue'
import md5 from 'js-md5'
import { useRoute, useRouter } from 'vue-router'
import { Toast } from 'vant'
import { unescape } from 'lodash'
import RuleFn, { checkCustomerExistRule } from './rule'
import { setQuoteService } from '@/plugins/socket/socket'
// import { pageConfig } from '@/api/wpApi'
import { useI18n } from 'vue-i18n'
import hooks from './hooks'
import { ElMessage } from 'element-plus'
import thirdLogin from '@/themeCommon/components/thirdLogin'
import { CaretBottom, CaretTop } from '@element-plus/icons'
import { firebaseAnalytics } from '@/utils/firebase'

export default {
    components: {
        areaInputPc,
        CheckCode,
        Loading,
        compInput,
        userLayoutFooter,
        thirdLogin,
        CaretBottom,
        CaretTop,
        AwsCaptcha,
        // CurrencyAction,
        // TradeTypeAction,
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
            mobileCheckCode: '',
            emailCheckCode: '',
            mobile: '',
            openType: 'email', // mobile 手机号开户， email 邮箱开户
            currency: 'USD',
            tradeType: 2,
            email: '',
            pageui: '',
            protocol: true,
            visited: false, // 是否已点击过获取验证码
            countryVal: '',
            openAccountType: 0, // 开户类型 0:个人 1.企业 默认为个人
            emailToken: '',
            mobileToken: '',
            filterValue: '', // 搜索内容
            ipCountry: '', // 当前IP对应的国家
            defaultCountry: '', // 根据语言获取到的默认国家
            filterList: [], // 搜索列表
            inviteVis: false,
            inAnimation: false,
            inviteEnable: false
        })
        // 设置默认开户类型
        if (businessConfig.value.enterpriseLogin && openAccountType) {
            state.openAccountType = openAccountType
        }

        // if (businessConfig.value.inviteEnable) {
        //     state.inviteEnable = businessConfig.value.inviteEnable
        // }

        // pageConfig('Register').then(res => {
        //     state.pageui = res
        // })
        // 获取国家区号
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
                        state.countryVal = defaultZoneConfig.code
                        state.zone = `${defaultZoneConfig.countryCode}`
                        state.countryCode = defaultZoneConfig.code
                        state.countryZone = defaultZoneConfig.countryCode
                    }
                    // findCountryByIP()
                }
            },
            { immediate: true }
        )

        const countryList = computed(() => {
            const countryList = store.state.countryList
            return state.openAccountType === 0
                ? countryList
                : store.getters.companyCountryList
        })

        const style = computed(() => store.state.style)
        // 手机正则表达式
        const mobileReg = computed(
            () =>
                getArrayObj(countryList.value, 'countryCode', state.countryZone)
                    .extend || ''
        )
        // 开户须知内容
        const instructions = computed(() => {
            const lang = locale.value
            const wpCompanyInfo = store.state._base.wpCompanyInfo || {}
            const protocol = wpCompanyInfo[lang]
            return protocol ? decodeURIComponent(unescape(protocol)) : ''
        })
        // 是否显示企业开户的入口
        const companyCountryVisible = computed(() => {
            if (!businessConfig.value.enterpriseLogin) return false
            if (state.openAccountType === 0) {
                return store.getters.companyCountryList.find(
                    (el) => el.code === state.countryVal
                )
            } else {
                return countryList.value.find(
                    (el) => el.code === state.countryVal
                )
            }
        })

        // 选择国家
        const zoneOnSelect = (val) => {
            const country = countryList.value.find((el) => el.code === val)
            if (country) {
                state.zone = country.countryCode
                state.countryZone = country.countryCode
                state.countryCode = country.code
            }
        }

        const zoneOnBlur = (visible) => {
            if (visible === false) {
                state.filterValue = ''
            }
        }

        const registerSubmit = (params) => {
            state.loading = true
            // firebase
            firebaseAnalytics('sign_up_summit', {
                key: 'sign_up_summit',
                value: state.openType === 'email' ? 'email' : 'phone',
            })
            // 系统注册成功的操作
            const successful = (res) => {
                // firebase
                const fbvalue = {}
                if (state.openType === 'email') {
                    fbvalue.email = params.loginName
                } else {
                    fbvalue.phone = params.loginName
                }
                firebaseAnalytics('sign_up_success', {
                    key: 'sign_up_success',
                    value: JSON.stringify({
                        sign_up_success: state.openType === 'email' ? 'email' : 'phone',
                        ...fbvalue
                    })
                }, res.data)
                // 注册成功
                sessionStorage.setItem(
                    'RegisterParams',
                    JSON.stringify({ ...params, openType: state.openType })
                )
                sessionStorage.setItem('RegisterData', JSON.stringify(res))
                if (state.openType === 'mobile') {
                    localSet('loginZone', state.countryZone)
                }
                // 缓存注册信息
                localSet(
                    'loginInfo',
                    JSON.stringify({
                        accountType: params.type,
                        loginName: params.loginName,
                        phoneArea: params.phoneArea || params.emailArea || ''
                    })
                )
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
                    // 判断是个人KYC还是企业KYC
                    if (params.openAccountType === 0) {
                        router.replace({
                            path: '/register/regKyc',
                            query: { levelCode: res.data.list[0].levelCode }
                        })
                    } else {
                        router.replace({
                            path: '/businessKYC'
                        })
                    }
                } else {
                    router.replace({ name: 'RegisterSuccess' })
                }
            }

            register(params)
                .finally(() => {
                    state.loading = false
                })
                .then((res) => {
                    successful(res)
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
                // currency: state.currency,
                // tradeType: state.tradeType,
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
                // customerNo: state.customerNo,
                openAccountType: state.openAccountType
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
                            if (Number(res.data.status) === 1) {
                                state.verifyCodeLoading = false
                                const msg = t(
                                    verifyParams.type === 1
                                        ? 'common.existEmail'
                                        : 'common.existPhone'
                                )
                                callback && callback(false)
                                return Toast(msg)
                            } else {
                                // state.zone = res.data.phoneArea
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
                                    .catch((err) => {
                                        // const { response = {} } = err
                                        // awsCaptchaRef.value.showCaptcha(
                                        //     response
                                        // )
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

        const zoneSelect = (data) => {
            state.countryVal = data.countryCode
            zoneOnSelect(data.countryCode)

            // state.countryZone = data.code
            // state.countryCode = data.countryCode
        }

        const filterZone = (value) => {
            value = value.toUpperCase()
            state.filterValue = value
        }

        const changeOpentype = () => {
            state.inAnimation = true
            state.openAccountType = state.openAccountType === 0 ? 1 : 0
        }

        watch(
            [() => state.filterValue, countryList],
            (newVal) => {
                const value = newVal[0]
                const currentCountryList = newVal[1]
                const list = !value
                    ? currentCountryList
                    : currentCountryList.filter((el) => {
                        if (
                            (el.code &&
                                el.code.toUpperCase().indexOf(value) !==
                                -1) ||
                            (el.countryCode &&
                                el.countryCode
                                    .toUpperCase()
                                    .indexOf(value) !== -1) ||
                            (el.displayName &&
                                el.displayName
                                    .toUpperCase()
                                    .indexOf(value) !== -1)
                        ) {
                            return true
                        } else {
                            return false
                        }
                    })
                state.filterList = list
            },
            { immediate: true }
        )

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

        const jumpPage = (attr) => {
            switch (attr) {
                case 1 :
                    window.open('https://www.headline.net/html/headline_privacy.html?v=1')
                    break
                case 2 :
                    window.open('https://www.headline.net/en-US/login')
                    break
            }
        }

        return {
            ...toRefs(state),
            registerHandler,
            verifyCodeSendHandler,
            style,
            instructions,
            countryList,
            zoneOnSelect,
            zoneOnBlur,
            zoneSelect,
            companyCountryVisible,
            filterZone,
            businessConfig,
            changeOpentype,
            awsCaptchaRef,
            jumpPage,
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@/sass/mixin.scss";
.container1{
  text-align: -webkit-center;
}

.investing{
  width: 400px;
}
.register {
    //padding-top: 80px;
    position: relative;
    display: flex;
    flex-flow: column;
    min-height: 100%;
    height: auto;
    .container {
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
        height: 100vh;
        background-color: #f8f8f8;

        .container2{
          z-index: 2;
        }

        .bannerTitle{
          color: #fff;
          font-size: 82px;
          padding: 60px 100px;
          line-height: 100px;
          .el-divider--horizontal{
            margin: unset;
            border-top: 3px #C86567 solid;
          }
          .line1{
            width: 23%
          }
          .line2{
            width: 27%
          }
        }

        .terms{
          font-size: 17px;
          text-decoration: underline;
          color: #000;
        }
        .content {
            width: 100%;
            /* 3D变形 */
            transform-style: preserve-3d;
            -webkit-perspective: 1000;
            -moz-perspective: 1000;
            -ms-perspective: 1000;
            perspective: 1000;
            &.anim {
                animation: showMsg 0.6s;
            }

            @keyframes showMsg {
                0% {
                    transform: rotateY(0deg);
                    opacity: 1;
                }
                50% {
                    transform: rotateY(65deg);
                    opacity: 0;
                }
                100% {
                    transform: rotateY(0deg);
                    opacity: 1;
                }
            }
            .logo {
                width: 100px;
                img {
                    width: 100%;
                }
            }
            .businessOpen {
                cursor: pointer;
                margin-top: 30px;
                border: solid 1px var(--primary);
                display: inline-block;
                width: 100%;
                line-height: 40px;
                text-align: center;
                border-radius: 5px;
                &.openType2 {
                    border: solid 1px var(--color);
                    .businessOpenBtn {
                        color: var(--color);
                    }
                }
                &:hover {
                    opacity: 0.5;
                }
                .businessOpenBtn {
                    display: inline-block;
                    color: var(--primary);
                    line-height: 1;
                }
            }
        }
    }
    .footerBtn {
        //height: 100px;
        margin-bottom: 20px;
        padding:0 36px;
    }
    .to-login {
        text-align: center;
        > a {
            color: var(--primary);
        }
    }
}
.pageTitle {
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
    padding: 0;
    h5 {
        font-weight: bold;
        color: var(--color);
        font-size: 24px;
        font-family: Microsoft YaHei;
        margin-bottom: 20px;
        &.opentype1 {
            color: var(--primary);
        }
    }
    a {
        color: var(--color);
        font-size: 14px;
    }
}
.banner {
    // margin-top: 60px;
    img {
        display: block;
        width: 100%;
    }
}
.form {
    margin-top: rem(30px) 0;
    text-align: -webkit-center;
}
.invite-item {
    cursor: pointer;
    > span {
        vertical-align: middle;
        margin-right: 5px;
    }
    .el-icon {
        vertical-align: -4px;
    }
}
.cell {
    display: flex;
    justify-content: space-between;
    width: 50%;
    margin: 20px 0;
    div {
        flex: 1;
    }
    .zone {
        flex: none;
        width: 152px;
        margin-right: 10px;
    }
    &.customNo_cell {
        margin: 10px 0;
        .customNo {
            border: solid 1px var(--lineColor);
            border-radius: 5px;
            :deep(input) {
                height: 48px;
                background: none;
            }
        }
    }

    :deep {
        .mobileBar{
            background: #FBFBFB;
            border:1px solid var(--lineColor);
            border-radius: 5px;
            &:hover{
                border: solid 1px var(--primary);
            }
            .inputWrapper{
                border: solid 1px transparent;
            }
        }
        .inputWrapper {
            border: solid 1px var(--lineColor);
            border-radius: 5px;
            background: #FBFBFB;
            &:hover {
                //border: solid 1px var(--primary);
            }
            .input {
                width: 100%;
                height: 36px;
                padding: 0 16px;
                font-size: 14px;
            }
        }
        .pcInputBar {
            border-radius: 5px;
            background: #FBFBFB;
            border: solid 1px var(--lineColor);
            &:hover,
            &:focus {
                border: solid 1px var(--primary);
            }
        }
        .pcInput {
            font-size: 14px;
            height: 36px;

        }
        .van-hairline--bottom {
            &::after {
                border-bottom: none;
            }
        }
    }
    .select-conuntry {
        .el-input {
            font-size: 16px;
        }
        :deep(.el-input__inner) {
            height: 48px;
            font-size: 16px;
            line-height: 48px;
        }
    }
}
.openTypeTab {
    --van-padding-md: 0px;
    --van-tabs-card-height: 40px;
    :deep(.van-tab){
        flex:none
    }
    :deep(.van-tabs__nav--line) {
        background-color: var(--contentColor);
    }
    :deep(.van-tabs__nav) {
        justify-content: center;
        border: none;
        .van-tabs__line{
            background: var(--primary);
        }
    }
    :deep(.van-tab) {
        margin-right: 20px;
        border-radius: 5px;
        line-height: 40px;
        border: none;
        .van-tab__text {
            color: var(--minorColor);
            font-size: 16px;
        }
        &.van-tab--active {
            .van-tab__text {
                color: var(--primary);
            }
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
    height: 36px;
    color: #928e90;
    font-size: 16px;
    background: #e0e0e0;
    border-width: 1px 0 0;
    border-radius: 18px;
    &:hover {
        opacity: 0.8;
    }
}
.checkbox {
    //align-items: flex-start;
    :deep(.van-badge__wrapper) {
        width: 16px;
        height: 16px;
        overflow: hidden;
        font-size: 14px;
    }
    :deep(.van-checkbox__icon) {
        flex: none;
        height: 16px;
        font-size: 12px;
        line-height: 16px;
        background-color: var(--primary);
        border-color: var(--primary);
        border-radius: 5px;
        cursor: pointer;
    }
    :deep(.van-checkbox__label) {
        color: var(--placeholdColor);
        font-size: 14px;
    }
}
.verifyCodeCell {
    :deep {
        .checkCodeBar {
            border: solid 1px var(--lineColor);
            background: #FBFBFB;
            &:hover {
                border: solid 1px var(--primary);
            }
            border-radius: 5px;
            .checkCodeInput {
                font-size: 14px;
            }
            .getCodeBtn {
                margin: 0 18px;
                color: var(--primary);
                font-size: 14px;
                cursor: pointer;
            }
            .input {
                width: 100%;
                height: 36px;
                padding: 0 5px;
                padding-left: 18px;
            }
        }
    }
}
</style>

<template>
    <div class='register'>
        <topNav class='header' />
        <div class='container'>
            <div
                class='content'
                :class="inAnimation ? 'anim' : ''"
                @animationend='inAnimation = false'
            >
                <el-row :gutter='20' style='justify-content: space-evenly'>
                    <el-col
                        class='registrationPromo'
                        :lg='8'
                        :md='8'
                        :sm='8'
                        :xl='8'
                        :xs='24'
                    >
                        <div>
                            <h1 style='text-align: center; padding-top: 25px;'>
                                HEADLINE
                            </h1>
                            <div style='display: flex;  padding-top: 10px; text-align: center;'>
                                <p>{{ $t("register.reasonContent") }}</p>
                            </div>
                            <div style='display: flex;  padding-top: 25px;'>
                                <span class='iconContainer'>
                                    <el-icon style='font-size: 20px; color: #be1e2d;'>
                                        <CircleCheck />
                                    </el-icon>
                                </span><p>{{ $t("register.reason1") }}</p>
                            </div>
                            <div style='display: flex;  padding-top: 25px;'>
                                <span class='iconContainer'>
                                    <el-icon style='font-size: 20px; color: #be1e2d;'>
                                        <CircleCheck />
                                    </el-icon>
                                </span><p>{{ $t("register.reason2") }}</p>
                            </div>
                            <div style='display: flex;  padding-top: 25px;'>
                                <span class='iconContainer'>
                                    <el-icon style='font-size: 20px; color: #be1e2d;'>
                                        <CircleCheck />
                                    </el-icon>
                                </span><p>{{ $t("register.reason3") }}</p>
                            </div>
                            <div style='display: flex;  padding-top: 25px;'>
                                <span class='iconContainer'>
                                    <el-icon style='font-size: 20px; color: #be1e2d;'>
                                        <CircleCheck />
                                    </el-icon>
                                </span><p>{{ $t("register.reason4") }}</p>
                            </div>
                            <div style='display: flex;  padding-top: 25px; padding-bottom: 25px;'>
                                <span class='iconContainer'>
                                    <el-icon style='font-size: 20px; color: #be1e2d;'>
                                        <CircleCheck />
                                    </el-icon>
                                </span><p>{{ $t("register.reason5") }}</p>
                            </div>
                        </div>
                    </el-col>
                    <el-col
                        :lg='16'
                        :md='16'
                        :sm='16'
                        :xl='16'
                        :xs='24'
                    >
                        <div class='logoContainer'>
                            <img alt='logo' class='investing' src='../../images/cpi1/investing.com.svg' />
                        </div>
                        <div class='pageTitle'>
                            <h5 v-if='openAccountType === 1' class='opentype1'>
                                {{ $t("register.businessOpen") }}
                            </h5>
                            <h5 v-else class='opentype2'>
                                {{ $t("register.openAccount") }}
                            </h5>
                        </div>
                        <!-- <div class='logo'>
                  <img alt='' src='/images/logo_vitamin.png' srcset='' />
              </div> -->

                        <van-tabs
                            v-model:active='openType'
                            class='openTypeTab'

                            :title-inactive-color='style.mutedColor'

                            @click-tab='countryListVis = false'
                        >
                            <van-tab name='email' :title="$t('register.email')" />
                            <van-tab name='mobile' :title="$t('register.phoneNo')" />
                        </van-tabs>

                        <form class='form'>
                            <!-- <CurrencyAction v-model='currency' class='cellRow' />
              <TradeTypeAction v-model='tradeType' class='cellRow' /> -->
                            <!-- <van-cell title="账户币种" is-link arrow-direction="down" value="USD" /> -->
                            <!-- <areaInputPc
                      v-model.trim='email'
                      v-model:zone='zone'
                      clear
                      input-type='text'
                      :placeholder='$t("register.email")'
                      type='business'
                      @zoneSelect='zoneSelect'
                  /> -->
                            <!-- <div v-show="openType==='mobile'" class='cell'>
                      <el-select
                          v-model='countryVal'
                          class='select-conuntry'
                          :filter-method='filterZone'
                          filterable
                          :placeholder='$t("auth.countrySelect")'
                          @change='zoneOnSelect'
                          @visible-change='zoneOnBlur'
                      >
                          <el-option
                              v-for='item in filterList'
                              :key='item.code'
                              :label='item.displayName'
                              :value='item.code'
                          >
                              <span style='float: left;'>
                                  {{ item.displayName }}
                              </span>
                              <span
                                  style='float: right;'
                              >
                                  {{ item.countryCode }}
                              </span>
                          </el-option>
                      </el-select>
                  </div> -->
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
                            <div v-if='inviteEnable || isEnableNewsInvite' class='cell'>
                                <compInput
                                    v-model='customerNo'
                                    block
                                    :placeholder='invitePlaceholder'
                                    type='text'
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
                            <!-- <div class='cell'>
                      <compInput
                          v-model='InvitationCode'
                          block
                          :placeholder="$t('common.optionalInvitationCode')"
                          type='text'
                      />
                  </div> -->
                            <!-- <div class='cell'>
                      <van-checkbox v-model='protocol' class='checkbox' shape='square'>
                          {{ $t('register.protocol') }}
                      </van-checkbox>
                  </div> -->
                        </form>
                        <div class='footerBtn'>
                            <van-button
                                block
                                class='registerBtn'
                                :disabled='loading'
                                onclick="dataLayer.push({'event': 'registration', 'gtm.elementClasses': 'register_container', 'gtm.elementId': 'register_Btn' });"
                                @click='registerHandler'
                            >
                                {{ $t("c.register") }}
                            </van-button>
                        </div>
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
                    </el-col>
                </el-row>
            </div>
        </div>
        <userLayoutFooter />
        <router-view />
        <Loading :show='loading' />
        <AwsCaptcha ref='awsCaptchaRef' @onCallback='handleCaptcha' />
    </div>
</template>

<script>
import topNav from '@planspc/layout/topNav'
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
    getDefaultZoneIndex,
    pwdReg,
    isEmpty,
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
import thirdLogin from '@/themeCommon/components/thirdLogin'
import { CaretBottom, CaretTop, CircleCheck } from '@element-plus/icons'
import { firebaseAnalytics } from '@/utils/firebase'
import getTrackingInvesting from '@/utils/investingCom'

export default {
    components: {
        topNav,
        areaInputPc,
        CheckCode,
        Loading,
        compInput,
        userLayoutFooter,
        thirdLogin,
        CaretBottom,
        CaretTop,
        CircleCheck,
        AwsCaptcha
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
            // 系统注册成功的操作
            const successful = (res) => {
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
                if (res.data.token) {
                    setToken(res.data.token)
                }

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
                    if (res?.code === 'CUSTOMER_API_00010001') {
                        // 人工审核
                        router.replace({ name: 'RegisterHandler' })
                        if (res?.data?.customerNo) {
                            firebaseAnalytics('sign_up_success', {
                                key: 'sign_up_success',
                                value: JSON.stringify({
                                    sign_up_success: state.openType === 'email' ? 'email' : 'phone',
                                  ...fbvalue
                                })
                            }, { ...res.data, auditType: 'artificial' })
                        }
                    } else if (res.check()) {
                        successful(res)
                    } else {
                        res.toast()
                    }
                })
        }

        const delayWait = ref(false)

        // 提交注册
        const registerHandler = () => {
            if (delayWait.value) return
            delayWait.value = true
            setTimeout(() => delayWait.value = false, 1000)
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
                openAccountType: state.openAccountType
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
          isEnableNewsInvite,
          invitePlaceholder
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@/sass/mixin.scss";

.registrationPromo{
background-color: #f3f3f3;
font-family: Microsoft YaHei;
align-self: center;
.iconContainer{
  padding: 0 10px;
  align-self: center;
}
p{
  color: #000;
  font-weight: 700;
  font-size: 16px;
}
}
.register {
  //padding-top: 80px;
  position: relative;
  display: flex;
  flex-flow: column;
  min-height: 100%;
  height: auto;
  background-image: url("../.././images/craigAbout/background.png");
  .container {

      margin: 40px auto;
      .content {
          //width: 687px;
          margin: 0 auto;
          padding: 50px 170px 50px 134px;
          background: var(--contentColor);
          //border-radius: 10px;
          box-shadow: 0px 6px 19px 2px rgba(0,0,0,0.08);
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
  width: 100%;
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
  color: #fff;
  font-size: 16px;
  background: var(--primary);
  border-color: var(--primary);
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

.logoContainer{
  padding-bottom: 10px;
  text-align: center;
  .investing{
    width: 250px;
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
@media screen and (max-width: 900px) {
.registrationPromo{
  display: none;
}
.el-col-16{
  max-width: unset !important;
  flex: unset !important;
}
}
</style>

<template>
    <div class='register'>
        <topNav class='header' />
        <div class='container'>
            <div class='content'>
                <div class='pageTitle'>
                    <h5>{{ $t('register.openAccount') }}</h5>
                    <router-link to='/login'>
                        {{ $t('register.hasAccount') }}
                    </router-link>
                </div>
                <div class='banner'>
                    <img alt='' src='https://testcms.ixmiddle.com/docs/registerBanner.png' srcset='' />
                </div>
                <van-tabs
                    v-model:active='openType'
                    class='openTypeTab'
                    :color='style.color'
                    line-height='2px'
                    line-width='20px'
                    :title-inactive-color='style.mutedColor'
                >
                    <van-tab name='mobile' :title='$t("register.phoneNo")' />
                    <van-tab name='email' :title='$t("register.email")' />
                </van-tabs>

                <form class='form'>
                    <!-- <CurrencyAction v-model='currency' class='cellRow' />
                <TradeTypeAction v-model='tradeType' class='cellRow' /> -->
                    <!-- <van-cell title="账户币种" is-link arrow-direction="down" value="USD" /> -->
                    <div v-if="openType === 'mobile'" class='cell'>
                        <areaInputPc
                            v-model.trim='mobile'
                            v-model:zone='zone'
                            clear
                            :placeholder='$t("register.phoneNo")'
                            type='mobile'
                            @zoneSelect='zoneSelect'
                        />
                    </div>
                    <div v-else class='cell'>
                        <areaInputPc
                            v-model.trim='email'
                            v-model:zone='zone'
                            clear
                            input-type='text'
                            :placeholder='$t("register.email")'
                            type='email'
                            @zoneSelect='zoneSelect'
                        />
                    </div>
                    <div class='cell verifyCodeCell'>
                        <CheckCode v-model.trim='checkCode' clear :label='$t("login.verifyCode")' :loading='verifyCodeLoading' @verifyCodeSend='verifyCodeSendHandler' />
                    </div>
                    <div class='cell'>
                        <van-checkbox v-model='protocol' class='checkbox' shape='square'>
                            {{ $t('register.protocol') }}
                        </van-checkbox>
                    </div>
                </form>
                <div class='footerBtn'>
                    <van-button
                        block
                        class='registerBtn'
                        :disabled='loading'
                        @click='registerHandler'
                    >
                        {{ $t('common.submit') }}
                    </van-button>
                </div>
            </div>
        </div>

        <router-view />

        <Loading :show='loading' />
    </div>
</template>

<script>
import topNav from '@planspc/layout/topNav'
import Schema from 'async-validator'
// import Top from '@/components/top'
import Loading from '@/components/loading'
import CheckCode from '@/components/form/checkCode'
import areaInputPc from '@/components/form/areaInputPc'
// import CurrencyAction from './components/currencyAction'
// import TradeTypeAction from './components/tradeTypeAction'
import { getDevice, getQueryVariable, setToken, getArrayObj, sessionGet } from '@/utils/util'
import { register, checkUserStatus } from '@/api/user'
import { verifyCodeSend } from '@/api/base'
import { useStore } from 'vuex'
import { reactive, toRefs, computed, getCurrentInstance, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Toast } from 'vant'
import RuleFn, { checkCustomerExistRule } from './rule'
import { setQuoteService } from '@/plugins/socket/socket'
// import { pageConfig } from '@/api/wpApi'
import { useI18n } from 'vue-i18n'
import hooks from './hooks'

export default {
    components: {
        topNav,
        areaInputPc,
        CheckCode,
        Loading,
        // CurrencyAction,
        // TradeTypeAction,
    },
    setup () {
        const instance = getCurrentInstance()
        const delayer = null
        const store = useStore()
        const router = useRouter()
        const route = useRoute()
        const { t } = useI18n({ useScope: 'global' })
        const { getCustomerGroupIdByCountry, getPlansByCountry } = hooks()
        const state = reactive({
            options: [{ country: 'Canada', code: 'CA' }],
            zone: '',
            countryZone: '86',
            countryCode: 'ISO_3166_156',
            loading: false,
            verifyCodeLoading: false,
            checkCode: '',
            mobile: '',
            openType: 'mobile', // mobile 手机号开户， email 邮箱开户
            currency: 'USD',
            tradeType: 1,
            email: '',
            pageui: '',
            protocol: true,
            visited: false // 是否已点击过获取验证码
        })
        let token = ''

        // pageConfig('Register').then(res => {
        //     state.pageui = res
        // })
        // 获取国家区号
        store.dispatch('getCountryListByParentCode').then(res => {
            if (res.check() && res.data.length) {
                const defaultZone = store.state._base.wpCompanyInfo?.defaultZone
                const countryList = store.state._base.wpCompanyInfo?.registrable || res.data
                if (defaultZone?.code) {
                    state.zone = `${defaultZone.name} (${defaultZone.country_code})`
                    state.countryZone = defaultZone.country_code
                    state.countryCode = defaultZone.code
                } else {
                    const firstItem = countryList[0]
                    const countryCode = firstItem.countryCode || firstItem.country_code
                    state.zone = firstItem.name + ` (${countryCode})`
                    state.countryZone = countryCode
                    state.countryCode = firstItem.code
                }
            }
        })
        const countryList = computed(() => store.state.countryList)
        const style = computed(() => store.state.style)
        // 手机正则表达式
        const mobileReg = computed(() => getArrayObj(countryList.value, 'countryCode', state.countryZone).extend || ''
        )

        const registerSubmit = (params) => {
            state.loading = true
            register(params).finally(() => {
                state.loading = false
            }).then(res => {
                // state.loading = false
                if (res.check()) {
                    // 注册成功
                    sessionStorage.setItem('RegisterParams', JSON.stringify({ ...params, openType: state.openType }))
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
                                path: '/register/regKyc',
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
            if (!token) {
                return Toast(t('common.inputRealVerifyCode'))
            }
            const params = {
                type: state.openType === 'email' ? 1 : 2,
                loginName: state.openType === 'email' ? state.email : state.mobile,
                registerSource: getDevice(),
                verifyCode: state.checkCode,
                // currency: state.currency,
                // tradeType: state.tradeType,
                sendToken: token,
                utmSource: getQueryVariable('utm_source'),
                utmMedium: getQueryVariable('utm_medium'),
                utmCampaign: getQueryVariable('utm_campaign'),
                utmContent: getQueryVariable('utm_content'),
                utmTerm: getQueryVariable('utm_term'),
                protocol: state.protocol,
                tradeTypeCurrencyList: getPlansByCountry(state.countryCode),
                customerGroupId: getCustomerGroupIdByCountry(state.countryCode),
                country: state.countryCode
            }

            if (state.openType === 'mobile') {
                params.phoneArea = '+' + String(state.countryZone)
            } else {
                params.emailArea = String(state.countryZone)
            }

            if (sessionGet('b_superiorAgent')) {
                params.thirdServerCode = sessionGet('b_superiorAgent')
                params.thirdServerSource = 'agent'
            }

            const validator = new Schema(RuleFn(t))
            validator.validate(
                { ...params, mobileReg: new RegExp(mobileReg.value) },
                { first: true }, (errors, fields) => {
                    if (errors) {
                        return Toast(errors[0].message)
                    }
                    registerSubmit(params)
                })
        }
        // 发送验证码
        const verifyCodeSendHandler = (callback) => {
            state.visited = true
            const verifyParams = {
                type: state.openType === 'mobile' ? 2 : 1,
                loginName: state.openType === 'mobile' ? state.mobile : state.email,
                protocol: state.protocol,
                mobileReg: new RegExp(mobileReg.value)

            }

            if (state.openType === 'mobile') {
                verifyParams.phoneArea = String(state.zone)
            } else {
                verifyParams.emailArea = String(state.zone)
            }

            const validator = new Schema(checkCustomerExistRule(t))
            state.verifyCodeLoading = true
            validator.validate(verifyParams, { first: true }).then(res => {
                // 检测客户是否存在,同时获取区号
                checkUserStatus(verifyParams).then(res => {
                    if (res.check()) {
                        if (Number(res.data.status) === 1) {
                            state.verifyCodeLoading = false
                            const msg = t(verifyParams.type === 1 ? 'common.existEmail' : 'common.existPhone')
                            callback && callback(false)
                            return Toast(msg)
                        } else {
                            // state.zone = res.data.phoneArea
                            const params = {
                                bizType: state.openType === 'mobile' ? 'SMS_REGISTER_VERIFICATION_CODE' : 'EMAIL_REGISTER_VERIFICATION_CODE',
                                toUser: state.openType === 'mobile' ? '+' + state.countryZone + ' ' + state.mobile : state.email,
                                country: state.countryCode
                            }
                            verifyCodeSend(params).then(res => {
                                state.verifyCodeLoading = false
                                if (res.check()) {
                                    token = res.data.token
                                    callback && callback()
                                } else {
                                    callback && callback(false)
                                }
                            })
                        }
                    }
                })
            }).catch(({ errors, fields }) => {
                callback && callback(false)
                state.verifyCodeLoading = false
                if (errors) {
                    Toast(errors[0].message)
                }
            })
        }

        const zoneSelect = (data) => {
            state.countryZone = data.code
            state.countryCode = data.countryCode
        }

        onMounted(() => {
            const { mobile, email } = route.query
            if (mobile) {
                state.mobile = mobile
                state.openType = 'mobile'
            } else if (email) {
                state.email = email
                state.openType = 'email'
            }
        })

        return {
            ...toRefs(state),
            registerHandler,
            verifyCodeSendHandler,
            style,
            countryList,
            zoneSelect
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.register {
    position: relative;
    display: flex;
    flex-flow: column;
    height: 100%;
    background: var(--assistColor);
    .container {
        flex: 1;
        overflow: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        .content{
            width:520px;
            padding: 60px;
            border-radius: 10px;
                background-color: var(--contentColor);
        }
    }
    .footerBtn {
        height: 100px;
    }
}
.pageTitle {
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
    h5{
    font-size: 32px;
    color: var(--color);
    }
    a{
        font-size:14px;
        color:var(--color);
    }
}
.banner {
    margin-top: 60px;
    img {
        display: block;
        width: 100%;
    }
}
.form {
    margin-top: rem(30px);
}
.cell {
    display: flex;
    justify-content: space-between;
    margin: 20px 0;
    div {
        flex: 1;
    }
    .zone {
        flex: none;
    width: 152px;
    margin-right: 10px;

    }
    :deep{
     .inputWrapper{
         background-color: var(--bgColor);
    border-radius: 4px;
         .input{
            width: 100%;
                height: 48px;
                   padding: 0 16px;
                font-size: 16px;
         }

    }
    }

}
.openTypeTab {
    width: 40%;
    margin: rem(60px) auto 0;
    :deep(.van-tabs__nav--line) {
        background-color: var(--contentColor);
    }
    :deep(.van-tab) {
        .van-tab__text {
            color: var(--minorColor);
        }
        &.van-tab--active {
            .van-tab__text {
                color: var(--color);
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

    color: var(--contentColor);
    background: var(--primary);
    border-color: var(--primary);
    border-width: 1px 0 0;
        height: 48px;
    border-radius: 4px;
    font-size: 20px;
}
.checkbox {
        align-items: flex-start;
    :deep(.van-badge__wrapper) {
    width: 16px;
    height: 16px;
    overflow: hidden;
    font-size: 14px;
    line-height: 16px;
    }
    :deep(.van-checkbox__icon) {
            margin-top: 4px;
    flex: none;
    height: 16px;
    font-size: 12px;
    line-height: 16px;
    cursor: pointer;
        background-color: var(--primary);
    border-color: var(--primary);
        border-radius: 4px;
    }
    :deep(.van-checkbox__label) {
      line-height: 20px;
    font-size: 14px;
        color: var(--placeholdColor);
    }
}
.verifyCodeCell{
    :deep{
        .checkCodeBar{
                background-color: var(--assistColor);
    border-radius: 4px;
    border-bottom: none;
            .checkCodeInput{
                font-size: 16px;
            }
            .getCodeBtn{
font-size: 16px;
    margin: 0 18px;
    color: var(--primary);
    cursor: pointer;
            }
            .input {
    width: 100%;
    height: 48px;
    padding: 0 5px;
        padding-left: 18px;
}
        }
    }
}
</style>

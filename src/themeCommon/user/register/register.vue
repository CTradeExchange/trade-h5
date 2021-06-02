<template>
    <div class='register'>
        <Top class='topBar' :right-action='{ title:"已有账号" }' @rightClick='$router.replace({ name:"Login" })' />
        <div class='container'>
            <p class='pageTitle'>
                真实开户
            </p>
            <div class='banner'>
                <img alt='' src='https://testcms.ixmiddle.com/docs/registerBanner.png' srcset='' />
            </div>
            <van-tabs
                v-model:active='openType'
                class='openTypeTab'
                :color='style.color'
                line-height='2px'
                line-width='20px'
                :title-active-color='style.color'
                :title-inactive-color='style.mutedColor'
            >
                <van-tab name='mobile' title='手机号' />
                <van-tab name='email' title='邮箱' />
            </van-tabs>
            <form class='form'>
                <CurrencyAction v-model='currency' class='cellRow' />
                <TradeTypeAction v-model='tradeType' class='cellRow' />
                <!-- <van-cell title="账户币种" is-link arrow-direction="down" value="USD" /> -->
                <div v-if="openType === 'mobile'" class='cell'>
                    <areaInput
                        v-model.trim='mobile'
                        v-model:zone='zone'
                        clear
                        placeholder='手机号'
                        type='mobile'
                        @zoneSelect='zoneSelect'
                    />
                </div>
                <div v-else class='cell'>
                    <areaInput
                        v-model.trim='email'
                        v-model:zone='zone'
                        clear
                        placeholder='邮箱'
                        type='email'
                        @zoneSelect='zoneSelect'
                    />
                </div>
                <div class='cell'>
                    <CheckCode v-model.trim='checkCode' clear label='验证码' :loading='verifyCodeLoading' @verifyCodeSend='verifyCodeSendHandler' />
                </div>
                <div class='cell'>
                    <van-checkbox v-model='protocol' shape='square'>
                        继续开户表示您已确认已满18周岁且已细读并同意《客户隐私保护政策、投资风险披露及免责声明》
                    </van-checkbox>
                </div>
            </form>
        </div>
        <div class='footerBtn'>
            <van-button
                block
                class='registerBtn'
                :disabled='loading'
                @click='registerHandler'
            >
                提交
            </van-button>
        </div>
        <Loading :show='loading' />
    </div>
</template>

<script>
import Schema from 'async-validator'
import Top from '@/components/top'
import VueSelect from '@m/components/select'
import Loading from '@m/components/loading'
import CheckCode from '@/components/form/checkCode'
import InputComp from '@/components/form/input'
import areaInput from '@/components/form/areaInput'
import CurrencyAction from './components/currencyAction'
import TradeTypeAction from './components/tradeTypeAction'
import { getDevice, getQueryVariable, setToken, getArrayObj } from '@/utils/util'
import { register, openAccount, checkKycApply, checkUserStatus } from '@/api/user'
import { verifyCodeSend } from '@/api/base'
import { useStore } from 'vuex'
import { reactive, toRefs, ref, computed, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { Toast, Dialog } from 'vant'
import Rule, { checkCustomerExistRule } from './rule'

export default {
    components: {
        Top,
        areaInput,
        CheckCode,
        Loading,
        CurrencyAction,
        TradeTypeAction,
    },
    setup () {
        const instance = getCurrentInstance()
        const delayer = null
        const store = useStore()
        const router = useRouter()
        const state = reactive({
            options: [{ country: 'Canada', code: 'CA' }],
            zone: '中国大陆 (86)',
            countryZone: '86',
            countryCode: 'ISO_3166_156',
            loading: false,
            verifyCodeLoading: false,
            checkCode: '',
            mobile: '',
            openType: 'mobile', // mobile 手机号开户， email 邮箱开户
            accountType: 'CFD账户',
            accountTypeList: [{ name: 'CFD账户' }],
            currency: 'USD',
            tradeType: 1,
            email: '',
            protocol: true
        })
        let token = ''
        // 获取国家区号
        store.dispatch('getCountryListByParentCode')
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
            })
        }

        // 提交注册
        const registerHandler = () => {
            clearTimeout(delayer)
            if (!token) {
                return Toast('请输入正确的验证码')
            }
            const params = {
                type: state.openType === 'email' ? 1 : 2,
                loginName: state.openType === 'email' ? state.email : state.mobile,
                registerSource: getDevice(),
                verifyCode: state.checkCode,
                currency: state.currency,
                tradeType: state.tradeType,
                sendToken: token,
                utmSource: getQueryVariable('utm_source'),
                utmMedium: getQueryVariable('utm_medium'),
                utmCampaign: getQueryVariable('utm_campaign'),
                utmContent: getQueryVariable('utm_content'),
                utmTerm: getQueryVariable('utm_term'),
                protocol: state.protocol,
                country: state.countryCode
            }

            if (state.openType === 'mobile') {
                params.phoneArea = '+' + String(state.countryZone)
            } else {
                params.emailArea = String(state.countryZone)
            }

            const validator = new Schema(Rule)
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

            const validator = new Schema(checkCustomerExistRule)
            state.verifyCodeLoading = true
            validator.validate(verifyParams, { first: true }).then(res => {
                // 检测客户是否存在,同时获取区号
                checkUserStatus(verifyParams).then(res => {
                    if (res.check()) {
                        if (Number(res.data.status) === 1) {
                            state.verifyCodeLoading = false
                            return Toast(verifyParams.type === 1 ? '邮箱已存在' : '手机已存在')
                        } else {
                            // state.zone = res.data.phoneArea
                            const params = {
                                bizType: state.openType === 'mobile' ? 'SMS_REGISTER_VERIFICATION_CODE' : 'EMAIL_REGISTER_VERIFICATION_CODE',
                                toUser: state.openType === 'mobile' ? '+' + state.countryZone + ' ' + state.mobile : state.email,
                            }
                            verifyCodeSend(params).then(res => {
                                state.verifyCodeLoading = false
                                if (res.check()) {
                                    token = res.data.token
                                    callback && callback()
                                }
                            })
                        }
                    }
                })
            }).catch(({ errors, fields }) => {
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
    .topBar {
        height: rem(100px);
    }
    .container {
        flex: 1;
        overflow: auto;
    }
    .footerBtn {
        height: rem(100px);
    }
}
.pageTitle {
    margin-bottom: rem(10px);
    padding: 0 rem(30px);
    font-size: rem(46px);
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
    margin-top: rem(30px);
}
.cell {
    display: flex;
    justify-content: space-between;
    margin: rem(20px) rem(30px);
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
    width: 40%;
    margin: rem(60px) auto 0;
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
    border: 1px solid var(--bdColor);
    border-radius: rem(10px);
}
.registerBtn {
    height: rem(100px);
    color: var(--btnText);
    background: var(--btnColor);
    border-width: 1px 0 0;
}
</style>

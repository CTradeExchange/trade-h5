<template>
    <router-view />
    <div class='forgot'>
        <topNav class='header' />
        <div class='container'>
            <div class='content'>
                <Loading :show='loading' />
                <header class='header'>
                    <h1 class='pageTitle'>
                        {{ type === 'login' ? $t('forgot.forgot') : $t('forgot.forgotFund') }}
                    </h1>
                </header>
                <div class='tabs-wrap'>
                    <van-tabs
                        v-model:active='active'
                        :color='style.primary'
                        line-width='66px'
                        :title-active-color='style.primary'
                        :title-inactive-color='style.primary'
                        type='line'
                        @click='handleTabChange'
                    >
                        <van-tab :title='$t("forgot.retrievedByPhone")' />
                        <van-tab :title='$t("forgot.retrievedByEmail")' />
                    </van-tabs>
                </div>
                <div class='tabs-content'>
                    <form v-show='curTab === 0' class='loginForm'>
                        <div v-if="type==='login'" class='field'>
                            <InputComp
                                v-model.trim='mobile'
                                class='forgotAccount'
                                clear
                                :label='$t("common.inputPhone")'
                                @onBlur='checkUserMfa'
                            />
                        </div>
                        <div v-else class='field'>
                            <p class='title'>
                                {{ $t('common.sendToYou') }} {{ customerInfo?.phone }}
                            </p>
                        </div>
                        <div class='field verifyCodeCell'>
                            <checkCode
                                v-if='type === "login"'
                                v-model.trim='checkCode'
                                :label='$t("common.inputVerifyCode")'
                                @verifyCodeSend='handleVerifyCodeSend'
                            />
                            <checkCode
                                v-else
                                v-model.trim='checkCode'
                                :label='$t("common.inputVerifyCode")'
                                :type='type'
                                @verifyCodeSend='handleVerifyCodeSendFund'
                            />
                        </div>
                        <div v-if='googleCodeVis' class='field field-google'>
                            <googleVerifyCode @getGooleVerifyCode='getGooleVerifyCode' />
                        </div>
                    </form>

                    <form v-show='curTab === 1' class='loginForm'>
                        <div v-if="type==='login'" class='field'>
                            <InputComp
                                v-model.trim='email'
                                class='forgotAccount'
                                clear
                                :label='$t("common.inputEmail")'
                                @onBlur='checkUserMfa'
                            />
                        </div>
                        <div v-else class='field'>
                            <p class='title'>
                                {{ $t('common.sendToYou') }} {{ customerInfo?.email }}
                            </p>
                        </div>
                        <div class='field verifyCodeCell'>
                            <checkCode
                                v-if='type === "login"'
                                v-model.trim='emailCode'
                                :label='$t("common.inputVerifyCode")'
                                @verifyCodeSend='handleVerifyCodeSend'
                            />
                            <checkCode
                                v-else
                                v-model.trim='emailCode'
                                :label='$t("common.inputVerifyCode")'
                                :type='type'
                                @verifyCodeSend='handleVerifyCodeSendFund'
                            />
                        </div>
                        <div v-if='googleCodeVis' class='field field-google'>
                            <googleVerifyCode @getGooleVerifyCode='getGooleVerifyCode' />
                        </div>
                    </form>
                </div>
                <van-button block class='next-btn' type='primary' @click='next'>
                    <span>{{ $t('common.nextStep') }}</span>
                </van-button>
            </div>
        </div>
        <userLayoutFooter />
    </div>
</template>

<script>
import topNav from '@planspc/layout/topNav'
import userLayoutFooter from '@planspc/components/userLayoutFooter'
import InputComp from '@/components/form/input'
import { reactive, toRefs, computed } from 'vue'
// import areaInput from '@/components/form/areaInput'
import checkCode from '@/components/form/checkCode'
import googleVerifyCode from '@/themeCommon/components/googleVerifyCode.vue'
import { Toast } from 'vant'
import { useRouter, useRoute } from 'vue-router'
// import uInput from '@/components/input.vue'
import Schema from 'async-validator'
import RuleFn from './rule'
import { useStore } from 'vuex'
import { verifyCodeSend, verifyCodeCheck } from '@/api/base'
import { checkUserStatus, checkGoogleMFAStatus } from '@/api/user'
import { isEmpty } from '@/utils/util'
import { useI18n } from 'vue-i18n'

export default {
    name: 'Forgot',
    components: {
        topNav,
        InputComp,
        checkCode,
        googleVerifyCode,
        userLayoutFooter
        // uInput
    },
    setup (props) {
        const style = computed(() => store.state.style)
        const store = useStore()
        const router = useRouter()
        const route = useRoute()
        const { type } = route.query
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            mobile: '',
            checkCode: '',
            email: '',
            emailCode: '',
            zone: '',
            countryZone: '86',
            curTab: 0,
            tips: {
                flag: true,
                msg: ''
            },
            sendToken: '',
            active: 0,
            loading: false,
            googleCodeVis: false,
            googleCode: ''
        })

        const bizTypeMap = {
            login: {
                0: 'SMS_PASSWORD_VERIFICATION_CODE',
                1: 'EMAIL_PASSWORD_VERIFICATION_CODE'
            },
            fund: {
                0: 'SMS_LOGINED_VERIFICATION_CODE',
                1: 'EMAIL_LOGINED_VERIFICATION_CODE'
            }
        }

        const customerInfo = computed(() => store.state._user.customerInfo)
        if (type === 'fund') {
            state.mobile = customerInfo.value?.phone
            state.email = customerInfo.value?.email
            state.googleCodeVis = customerInfo.value.googleId > 0
        }

        const handleTabChange = (name, title) => {
            state.curTab = name
        }

        const getGooleVerifyCode = val => {
            state.googleCode = val
        }

        // 检测客户是否开启GoogleMFA
        const checkUserMfa = (val) => {
            if (val) {
                checkGoogleMFAStatus({
                    loginName: val,
                    type: val.includes('@') ? 1 : 2
                }).then(res => {
                    if (res.check()) {
                        state.googleCodeVis = res.data > 0
                    }
                }).catch(err => {
                    console.log('err', err)
                })
            }
        }

        // 找回资金密码发送验证码
        const handleVerifyCodeSendFund = (callback) => {
            if (state.curTab === 0 && !customerInfo.value.phone) {
                callback && callback(false)
                return Toast(t('common.noBindPhone'))
            }
            if (state.curTab === 1 && !customerInfo.value.email) {
                callback && callback(false)
                return Toast(t('common.noBindEmail'))
            }

            verifyCodeSend({
                bizType: bizTypeMap['fund'][state.curTab],
            }).then(res => {
                if (res.check()) {
                    state.sendToken = res.data.token
                    Toast(t('common.verifySended'))
                    callback && callback()
                } else {
                    callback && callback(false)
                }
            })
        }

        // 发送验证码
        const handleVerifyCodeSend = (callback) => {
            const validator = new Schema(RuleFn(t))
            validator.validate({
                type: state.curTab,
                mobile: state.mobile,
                email: state.email,
                zone: state.zone
            }, (errors, fields) => {
                console.log('errors:', errors, fields)
                if (errors) {
                    callback && callback(false)
                    return Toast(errors[0].message)
                }

                // 验证手机号邮箱是否存在
                const source = {
                    type: state.curTab === 0 ? 2 : 1,
                    loginName: state.curTab === 0 ? state.mobile : state.email
                }
                state.loading = true
                checkUserStatus(source).then(res => {
                    state.loading = false
                    if (res.check()) {
                        if (Number(res.data.status) === 2) {
                            const msg = t(state.curTab === 0 ? 'common.unExistPhone' : 'common.unExistEmail')
                            callback && callback(false)
                            return Toast(msg)
                        } else if (Number(res.data.status === -1)) {
                            callback && callback(false)
                            return Toast(t('c.userDisable'))
                        } else {
                            state.countryZone = res.data.phoneArea
                            verifyCodeSend({
                                bizType: bizTypeMap['login'][state.curTab],
                                toUser: state.curTab === 0 ? state.countryZone + ' ' + state.mobile : state.email,
                            }).then(res => {
                                if (res.check()) {
                                    state.sendToken = res.data.token
                                    Toast(t('common.verifySended'))
                                    callback && callback()
                                } else {
                                    callback && callback(false)
                                }
                            })
                        }
                    }
                }).catch(err => {
                    state.loading = false
                    console.log(err)
                })
            })
        }

        const resetLoginPwd = () => {
            const params = {
                mobile: state.mobile,
                email: state.email,
                checkCode: state.checkCode,
                emailCode: state.emailCode,
                type: state.curTab,
                needCheckCode: true
            }
            const validator = new Schema(RuleFn(t))

            validator.validate(params, (errors, fields) => {
                console.log(errors, fields)
                if (errors) {
                    return Toast(errors[0].message)
                }
                state.loading = true
                handleVerifyCode()
            })
        }
        const resetFundPwd = () => {
            if ((isEmpty(state.checkCode) && state.curTab === 0) || (isEmpty(state.emailCode) && state.curTab === 1)) {
                return Toast(t('common.inputVerifyCode'))
            }
            // if (isEmpty(state.sendToken)) {
            //     return Toast(t('common.getVerifyCode'))
            // }
            handleVerifyCode()
        }

        const handleVerifyCode = () => {
            // let loginName
            // if (type === 'login') {
            //     loginName = state.curTab === 0 ? state.countryZone + ' ' + state.mobile : state.email
            // } else if (type === 'fund') {
            //     loginName = ''
            // }

            if (type === 'login') {
                verifyCodeCheck({
                    bizType: bizTypeMap['login'][state.curTab],
                    toUser: state.curTab === 0 ? state.countryZone + ' ' + state.mobile : state.email,
                    sendToken: state.sendToken || '11',
                    code: state.curTab === 0 ? state.checkCode : state.emailCode
                }).then(res => {
                    state.loading = false
                    if (res.ok) {
                        router.push({
                            path: '/resetPwd',
                            query: {
                                verifyCodeToken: res.data.token,
                                sendToken: state.sendToken,
                                type: state.curTab === 0 ? 2 : 1,
                                loginName: state.curTab === 0 ? state.mobile : state.email,
                                googleCode: state.googleCode,
                                verifyCode: state.curTab === 0 ? state.checkCode : state.emailCode,
                            }
                        })
                    } else {
                        Toast(res.msg)
                    }
                }).catch((err) => {
                    state.loading = false
                })
            } else {
                router.push({
                    path: '/resetFundPwd',
                    query: {
                        // verifyCodeToken: res.data.token,
                        sendToken: state.sendToken,
                        type: state.curTab === 0 ? 2 : 1,
                        loginName: state.curTab === 0 ? state.countryZone + ' ' + state.mobile : state.email,
                        verifyCode: state.curTab === 0 ? state.checkCode : state.emailCode,
                        googleCode: state.googleCode
                    }
                })
            }
        }

        const next = () => {
            if (state.googleCodeVis && isEmpty(state.googleCode)) {
                return Toast(t('common.inputGoogleCode'))
            }
            if (type === 'login') {
                resetLoginPwd()
            } else if (type === 'fund') {
                resetFundPwd()
            }
        }

        const zoneSelect = (data) => {
            state.countryZone = data.code
            state.countryCode = data.countryCode
        }
        const back = () => {
            router.replace('/login')
        }

        return {
            ...toRefs(state),
            next,
            handleTabChange,
            handleVerifyCodeSend,
            handleVerifyCodeSendFund,
            style,
            zoneSelect,
            getGooleVerifyCode,
            checkUserMfa,
            back,
            type,
            customerInfo
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.forgot {
    position: relative;
    display: flex;
    flex-flow: column;
    height: 100%;
    background: var(--bgColor);
    .forgotAccount {
        background-color: var(--assistColor) !important;
    }
    .container {
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: center;
        overflow: auto;
        .content {
            width: 520px;
            padding: 60px;
            background-color: var(--contentColor);
            border-radius: 10px;
        }
    }
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0 0 10px;
    }
    .pageTitle {
        margin-bottom: 0;
        font-weight: bold;
        font-size: 32px;
        font-family: Microsoft YaHei;
    }
    .tabs-wrap {
        width: 40%;
        :deep {
            .van-tab {
                font-size: 16px;
                &.van-tab--active {
                    font-weight: bold;
                }
            }
            .van-tabs__nav--line {
                background: var(--contentColor);
            }
        }
    }
}
.icon_icon_close_big {
    position: absolute;
    top: rem(30px);
    left: rem(30px);
    color: var(--color);
    font-size: rem(34px);
}
.loginForm {
    margin: 30px 0 40px;
    .field {
        position: relative;
        display: flex;
        align-items: center;
        :deep {
            .inputWrapper {
                background-color: var(--bgColor);
                border-radius: 4px;
                .input {
                    width: 100%;
                    height: 48px;
                    padding: 0 16px;
                    font-size: 16px;
                }
            }
            .van-hairline--bottom {
                &::after {
                    border-bottom: none;
                }
            }
        }
        &::placeholder {
            color: var(--placeholdColor);
        }
        &:not(:first-of-type) {
            margin-top: 24px;
        }
        &.toolWrap {
            justify-content: space-between;
        }
        label {
            position: absolute;
            top: 0;
            left: 0;
            height: rem(75px);
            color: var(--placeholder);
            font-size: rem(30px);
            line-height: rem(75px);
            transition: all cubic-bezier(0.4, 0, 0.2, 1) 0.15s;
            &.active {
                transform: scale(0.8) translateY(-90%);
            }
        }
        .input {
            display: block;
            flex: 1;
            height: rem(75px);
            font-size: rem(30px);
            line-height: 1;
            &:focus~label,
            &:valid~label {
                transform: scale(0.8) translateY(-90%);
                transform-origin: bottom left;
            }
        }
        .van-icon-clear {
            color: var(--lineColor);
            font-size: rem(36px);
        }
        .icon_icon_default,
        .icon_icon_pressed {
            margin-left: rem(10px);
            color: var(--lineColor);
            font-size: rem(36px);
        }
    }
    .field-google :deep() {
        .form-item {
            background: var(--assistColor);
        }
        .van-cell {
            padding-left: 20px;
            background: none;
        }
        .paste {
            display: none;
        }
    }
}
.next-btn {
    // position: absolute;
    // bottom: 0;
    position: relative;
    height: 48px;
    color: #FFF;
    font-size: 20px;
    background: var(--primary);
    border-color: var(--primary);
    border-width: 1px 0 0;
    border-radius: 4px;
    // span {
    //     color: var(--color);
    //     font-size: rem(30px);
    // }
}
.verifyCodeCell {
    :deep {
        .checkCodeBar {
            background-color: var(--assistColor);
            border-bottom: none;
            border-radius: 4px;
            .checkCodeInput {
                font-size: 16px;
            }
            .getCodeBtn {
                margin: 0 18px;
                color: var(--primary);
                font-size: 16px;
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

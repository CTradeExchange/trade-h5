<template>
    <div class='pageWrap'>
        <Top
            :menu='false'
            :right-action='false'
            :show-center='false'
        />
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
                line-height='2px'
                line-width='20px'
                :title-active-color='style.color'
                :title-inactive-color='style.mutedColor'
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
                    <InputComp v-model.trim='mobile' clear :label='$t("common.inputPhone")' />
                </div>
                <div v-else class='field'>
                    <p class='title'>
                        {{ $t('common.sendToYou') }} {{ customerInfo?.phone }}
                    </p>
                </div>

                <div class='field'>
                    <checkCode
                        v-if="type === 'login'"
                        v-model.trim='checkCode'
                        :label='$t("common.inputVerifyCode")'
                        :type='type'
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
            </form>

            <form v-show='curTab === 1' class='loginForm'>
                <div v-if="type==='login'" class='field'>
                    <InputComp v-model.trim='email' clear :label='$t("common.inputEmail")' />
                </div>
                <div v-else class='field'>
                    <p class='title'>
                        {{ $t('common.sendToYou') }} {{ customerInfo?.email }}
                    </p>
                </div>
                <div class='field'>
                    <checkCode
                        v-model.trim='emailCode'
                        :label='$t("common.inputVerifyCode")'
                        :type='type'
                        @verifyCodeSend='type === "login" ? handleVerifyCodeSend : handleVerifyCodeSendFund'
                    />
                </div>
            </form>
        </div>
        <van-button block class='next-btn' type='primary' @click='next'>
            <span>{{ $t('common.nextStep') }}</span>
        </van-button>
    </div>
</template>

<script>
import Top from '@/components/top'
import InputComp from '@/components/form/input'
import { reactive, toRefs, computed } from 'vue'
import areaInput from '@/components/form/areaInput'
import checkCode from '@/components/form/checkCode'
import { Toast } from 'vant'
import { useRouter, useRoute } from 'vue-router'
import uInput from '@/components/input.vue'
import Schema from 'async-validator'
import RuleFn from './rule'
import { useStore } from 'vuex'
import { verifyCodeSend, verifyCodeCheck } from '@/api/base'
import { checkUserStatus } from '@/api/user'
import { isEmpty, getArrayObj } from '@/utils/util'
import { useI18n } from 'vue-i18n'
export default {
    components: {
        Top,
        InputComp,
        checkCode,
        uInput
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
            loading: false
        })

        const bizTypeMap = {
            login: {
                0: 'SMS_LOGINED_VERIFICATION_CODE',
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
        }

        const handleTabChange = (name, title) => {
            state.curTab = name
        }

        // 找回登录密码发送验证码
        const handleVerifyCodeSend = (callback) => {
            debugger
            const validator = new Schema(RuleFn(t))
            validator.validate({
                type: state.curTab,
                mobile: state.mobile,
                email: state.email,
                zone: state.zone,
                resetType: type
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

        // 找回资金密码发送验证码
        const handleVerifyCodeSendFund = (callback) => {
            if (state.curTab === 0 && !customerInfo.value.phone) {
                return Toast(t('common.noBindPhone'))
            }
            if (state.curTab === 0 && !customerInfo.value.email) {
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
            if (isEmpty(state.sendToken)) {
                return Toast(t('common.getVerifyCode'))
            }
            handleVerifyCode()
        }

        const handleVerifyCode = () => {
            debugger
            let loginName
            if (type === 'login') {
                loginName = state.curTab === 0 ? state.countryZone + ' ' + state.mobile : state.email
            } else if (type === 'fund') {
                loginName = ''
            }
            if (state.curTab === 0) {
                verifyCodeCheck({
                    bizType: bizTypeMap['login'][state.curTab],
                    toUser: loginName,
                    sendToken: state.sendToken || '11',
                    code: state.curTab === 0 ? state.checkCode : state.emailCode
                }).then(res => {
                    state.loading = false
                    if (res.ok) {
                        router.push({
                            path: type === 'login' ? '/resetLoginPwd' : '/resetFundPwd',
                            query: {
                                verifyCodeToken: res.data.token,
                                sendToken: state.sendToken,
                                type: state.curTab === 0 ? 2 : 1,
                                loginName,
                                verifyCode: state.curTab === 0 ? state.checkCode : state.emailCode,
                            }
                        })
                    } else {
                        Toast(res.msg)
                    }
                }).catch((err) => {
                    state.loading = false
                })
            }
        }

        const next = () => {
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
            style,
            zoneSelect,
            back,
            customerInfo,
            type,
            handleVerifyCodeSendFund
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.pageWrap {
    position: relative;
    height: 100%;
    background: var(--contentColor);
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: rem(40px) rem(30px);
    }
    .pageTitle {
        margin-bottom: rem(10px);
        font-weight: normal;
        font-size: rem(50px);
    }
    .tabs-wrap {
        width: 40%;
        margin: rem(60px) auto 0;
        :deep(.van-tabs__nav--line) {
            background: var(--contentColor);
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
    margin: rem(40px) rem(30px);
    .field {
        position: relative;
        display: flex;
        align-items: center;

        &:not(:first-of-type) {
            margin-top: rem(30px);
        }
        &.toolWrap {
            justify-content: space-between;
        }
        .title{
            padding-left: rem(10px);
            color: var(--normalColor);
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
}
.next-btn {
    position: absolute;
    bottom: 0;
    background: var(--bgColor);
    border-color: var(--lineColor);
    span {
        color: var(--color);
        font-size: rem(30px);
    }
}

</style>

<style>

.pageWrap .van-tabs__line {
    background-color: #333;
}
</style>

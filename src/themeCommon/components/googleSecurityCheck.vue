// 谷歌安全验证 弹出框 组件
<template>
    <van-popup
        v-model:show='ggSafetyPopupShow'
        class='custom-dialog'
        :duration='0.2'
        position='bottom'
        round
        :transition-appear='true'
    >
        <div class='header'>
            <div class='header-title'>
                {{ $t('api.verify') }}
            </div>
            <i class='icon_guanbi' @click='close'></i>
        </div>
        <div class='page-wrap'>
            <div class='formBox'>
                <div v-if='customerInfo.phone' class='cell'>
                    <p class='label'>
                        {{ $t('common.sendToYou') }}{{ customerInfo.phone }}
                    </p>
                    <van-field
                        v-model='phoneCode'
                        center
                        clearable
                    >
                        <template #button>
                            <VerifyCodeBtn @send='smsCodeSendHanlder' />
                        </template>
                    </van-field>
                </div>

                <div v-if='customerInfo.email' class='cell'>
                    <p class='label'>
                        {{ $t('common.sendToYou') }}{{ customerInfo.email }}
                    </p>
                    <van-field
                        v-model='emailCode'
                        center
                        clearable
                    >
                        <template #button>
                            <VerifyCodeBtn @send='emailCodeSendHanlder' />
                        </template>
                    </van-field>
                </div>

                <div class='cell'>
                    <p class='label'>
                        {{ $t('common.inputGoogleCode') }}
                    </p>
                    <van-field
                        ref='googleVerifyCodeRef'
                        v-model='googleCode'
                        center
                        clearable
                        :formatter='formatter'
                        maxlength='6'
                    >
                        <template #button>
                            <a class='copyBtn' href='javascript:;' @click='pasteHanlder'>
                                {{ $t('common.paste') }}
                            </a>
                        </template>
                    </van-field>
                </div>
            </div>

            <div class='footerBox'>
                <van-button block :disabled='loading' :loading='loading' type='primary' @click='bindHanlderFn'>
                    {{ $t('compLang.confirm') }}
                </van-button>
            </div>
        </div>
    </van-popup>
</template>

<script>

import { onBeforeMount, computed, reactive, watch, toRefs, ref, onUnmounted } from 'vue'
import { Dialog, Toast } from 'vant'
import { useStore } from 'vuex'
import Schema from 'async-validator'
import googleSecurityCheckRules from './googleSecurityCheckRules'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { verifyCodeSend } from '@/api/base'
// import { enableOrForbidMFA } from '@/api/user'
import VerifyCodeBtn from '@/themeCommon/user/google_MFA/components/verifyCodeBtn.vue'

export default {
    components: {
        VerifyCodeBtn
    },
    props: ['popShow', 'currency', 'googleSafetyData'],
    setup (props, context) {
        const store = useStore()
        // const accountList = computed(() => {
        //     return store.state._user.customerInfo.accountList.filter(el => Number(el.tradeType) === Number(props.tradeType))
        // })
        const style = computed(() => store.state.style)
        const state = reactive({
            ggSafetyPopupShow: props.popShow,
            curCurrency: props.currency,
            loading: false,
            googleSafetyData: {},
            googleCode: '', // 谷歌验证码
            phoneCode: '', // 手机验证码
            sendTokenSMS: '', // 手机验证码发送票据
            emailCode: '', // 邮箱验证码
            sendTokenEmail: '', // 邮箱验证码发送票据
        })

        const route = useRoute()
        const router = useRouter()
        const { t } = useI18n({ useScope: 'global' })
        const { id } = route.query

        watch(() => state.ggSafetyPopupShow, val => {
            context.emit('update:ggSafetyPopupShow', val)
        })

        const close = () => {
            context.emit('update:popShow', false)
        }

        const checkCurrency = (currency) => {
            state.curCurrency = currency.currency
            // currency.fullName = state.assetsMap[currency.currency]
            context.emit('update:currency', currency)
            // state.popupShow = false
        }
        const bgColor = style.value.primary + '0D'

        const googleVerifyCodeRef = ref(null)
        const customerInfo = computed(() => store.state._user.customerInfo)
        const descriptorRules = googleSecurityCheckRules(t, customerInfo.value)
        const validator = new Schema(descriptorRules)
        console.log(customerInfo.value)

        const formatter = (value) => {
            // 过滤输入的非数字
            return value.replace(/[^\d]/g, '')
        }

        // 发送短信验证码
        const smsCodeSendHanlder = fn => {
            const pramas = {
                bizType: 'SMS_LOGINED_VERIFICATION_CODE'
            }
            verifyCodeSend(pramas).then(res => {
                if (res.check()) {
                    fn && fn(true)
                    state.sendTokenSMS = res.data.token
                } else {
                    fn && fn(false)
                }
            })
        }
        // 发送邮箱验证码
        const emailCodeSendHanlder = fn => {
            const pramas = {
                bizType: 'EMAIL_LOGINED_VERIFICATION_CODE'
            }
            verifyCodeSend(pramas).then(res => {
                if (res.check()) {
                    fn && fn(true)
                    state.sendTokenEmail = res.data.token
                } else {
                    fn && fn(false)
                }
            })
        }

        // 效验绑定参数
        const validatPramas = (pramas) => {
            return new Promise((resolve, reject) => {
                validator.validate(pramas, (errors, fields) => {
                    if (errors) {
                        console.log(errors, fields)
                        Toast(errors[0].message)
                        return resolve(false)
                    }
                    resolve(true)
                })
            })
        }

        // 绑定谷歌验证码
        const bindHanlderFn = () => {
            // const googleId = customerInfo.value.googleId > 0 ? customerInfo.value.googleId : parseInt(id)
            // const pramas = {}
            const pramas = {
                googleCode: state.googleCode, // String 必填 谷歌验证码
                phoneCode: state.phoneCode, // String 非必填 手机验证码
                emailCode: state.emailCode, // String 非必填 邮箱验证码
            }
            // console.log(pramas)
            validatPramas(pramas).then(res => {
                if (!res) return false
                state.loading = true
                // console.log(pramas)
                context.emit('update:googleSafetyData', pramas)
            // enableOrForbidMFA(pramas).then(res => {
            //     console.log(res)
            //     state.loading = false
            //     if (res.check()) {
            //         Dialog.alert({
            //             message: customerInfo.value.googleId > 0 ? t('mfa.closeSuccess') : t('mfa.bindSuccess'),
            //         }).then(() => {
            //             router.go(customerInfo.value.googleId > 0 ? -2 : -4)
            //             store.dispatch('_user/findCustomerInfo', false)
            //         })
            //         state.googleCode = ''
            //         state.phoneCode = ''
            //         state.sendTokenSMS = ''
            //         state.emailCode = ''
            //         state.sendTokenEmail = ''
            //     }
            // }).catch(err => {
            //     state.loading = false
            // })
            })
        }

        // 自动粘贴谷歌验证码
        const pasteHanlder = async () => {
            if (!navigator.clipboard) Toast(t('common.unSupported'))
            googleVerifyCodeRef.value.focus()
            const text = await navigator.clipboard.readText()
            // console.log(text)
            state.googleCode = text
        }

        return {
            ...toRefs(state),
            close,
            bgColor,
            checkCurrency,
            smsCodeSendHanlder,
            emailCodeSendHanlder,
            formatter,
            customerInfo,
            googleVerifyCodeRef,
            pasteHanlder,
            bindHanlderFn,
        }
    }
}
</script>

<style lang="scss">
@import '@/sass/mixin.scss';
.custom-dialog{
    display: flex;
    flex-direction: column;
    height: 92%;
    overflow: hidden;
    background: var(--bgColor);
    .header{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: rem(37px) rem(30px) rem(50px);
        .header-title{
            font-size: rem(48px);
            font-weight: bold;
            color: var(--color);
        }
        .icon_guanbi{
            font-size: rem(30px);
            font-weight: bold;
        }
    }
}
</style>

<style lang='scss' scoped>
@import '@/sass/mixin.scss';

.page-wrap {
    width: 100%;
    height: 100%;
    margin-top: rem(20px);
    overflow: auto;
    // background: var(--contentColor);
    :deep(.topNav .main) {
        max-width: 100%;
    }
    .formBox {
        margin: rem(10px);
        .cell {
            margin-bottom: rem(30px);
        }
        .van-cell {
            padding: 0 0 0 rem(20px);
        }
        .label {
            padding-bottom: rem(20px);
        }
        .copyBtn {
            display: block;
            width: rem(150px);
            height: rem(66px);
            color: var(--primary);
            line-height: rem(66px);
            text-align: center;
        }
    }
    .footerBox {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
    }
}

</style>

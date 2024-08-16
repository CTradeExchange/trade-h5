<template>
    <div class='register'>
        <topNav class='header' />
        <div class='container'>
            <RegisterLeftCard />
            <div class='rightBox'>
                <div class='Rcontainer'>
                    <div class='back' @click='back'>
                        <el-icon size='20'>
                            <Back />
                        </el-icon>
                        <span>Back</span>
                    </div>
                    <p class='pageTitle'>
                        {{ $t('login.createAccount') }}
                    </p>
                    <p class='pageTips1'>
                        {{ $t('login.tipsText4') }}:
                    </p>
                    <p class='pageTips2'>
                        {{ $t('login.tipsText5') }}.
                    </p>
                    <div v-show="registerInfo.openType === 'mobile'" class='cell'>
                        <CheckCode
                            v-model.trim='state.mobileCheckCode'
                            clear
                            :label="$t('login.verifyCode')"
                            :loading='state.verifyCodeLoading'
                            @verifyCodeSend='verifyCodeSendHandler'
                        />
                    </div>
                    <div v-show="registerInfo.openType === 'email'" class='cell'>
                        <CheckCode
                            v-model.trim='state.emailCheckCode'
                            clear
                            :label="$t('login.verifyCode')"
                            :loading='state.verifyCodeLoading'
                            @verifyCodeSend='verifyCodeSendHandler'
                        />
                    </div>
                    <button class='nextBtn' @click='confirmNext'>
                        {{ $t('common.nextVerify') }}
                    </button>
                </div>
            </div>
        </div>
        <router-view />
    </div>
</template>

<script setup>
import { reactive, computed, ref, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { Toast } from 'vant'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'

import { firebaseAnalytics } from '@/utils/firebase'
import { verifyCodeSend } from '@/api/base'
import { sessionGet, sessionSet } from '@/utils/util'

import RegisterLeftCard from './registerLeftCard'
import topNav from '@planspc/layout/topNav'
import CheckCode from '@/components/form/checkCode'

const { t, locale } = useI18n({ useScope: 'global' })
const router = useRouter()
const state = reactive({
    emailCheckCode: '',
    mobileCheckCode: '',
    mobileToken: '',
    emailToken: '',
    verifyCodeLoading: false,
})
const { value: registerInfo } = computed(() => JSON.parse(sessionGet('registerInfo')))
const inletRegister = JSON.parse(sessionGet('inletRegister'))

// 发送验证码
const verifyCodeSendHandler = (callback) => {
    state.verifyCodeLoading = true
    const countryCode = registerInfo.openType === 'email' ? registerInfo.defaultCountry.code : registerInfo.countryCode
    const params = {
        bizType: registerInfo.openType === 'mobile' ? 'SMS_REGISTER_VERIFICATION_CODE' : 'EMAIL_REGISTER_VERIFICATION_CODE',
        toUser: registerInfo.openType === 'mobile' ? registerInfo.countryZone + ' ' + registerInfo.mobile : registerInfo.email,
        country: countryCode
    }
    verifyCodeSend(params).then((res) => {
        state.verifyCodeLoading = false
        if (res.check()) {
            // firebase
            firebaseAnalytics('sign_up_code', {
                key: 'sign_up_code',
                value: JSON.stringify({
                    sign_up_code: registerInfo.openType === 'email' ? 'email' : 'phone',
                    email: registerInfo.email || '',
                    phone: registerInfo.mobile || ''
                })
            })
            registerInfo.openType === 'mobile' ? (state.mobileToken = res.data.token) : (state.emailToken = res.data.token)
            callback && callback()
        } else {
            callback && callback(false)
        }
    }).catch(e => {
        state.verifyCodeLoading = false
    })
}

const confirmNext = () => {
    if ((registerInfo.openType === 'email' && !state.emailToken) || (registerInfo.openType === 'mobile' && !state.mobileToken)) {
        return Toast(t('common.inputRealVerifyCode'))
    } else {
        const paramsStep2 = { ...registerInfo, ...state }
        sessionSet('registerInfo', JSON.stringify(paramsStep2))
        router.push('/register/step3')
    }
}

const back = () => {
    router.go(-1)
}

onMounted(() => {
    if (!inletRegister) {
        router.replace('/register')
        return
    }
    if (registerInfo) {
        const { mobile, email } = registerInfo
        if (mobile) {
            state.mobileCheckCode = registerInfo.mobileCheckCode
            state.mobileToken = registerInfo.mobileToken
        } else if (email) {
            state.emailCheckCode = registerInfo.emailCheckCode
            state.emailToken = registerInfo.emailToken
        }
    }
})
</script>

<style lang="scss" scoped>
@import "@/sass/mixin.scss";
.register {
    position: relative;
    display: flex;
    flex-flow: column;
    min-height: 100%;
    height: auto;
    .container {
        flex: 1;
        display: grid;
		grid-template-columns: repeat(2, 1fr);
        .flexCenter{
            display: flex;
            flex-direction: column;
            align-items: center;
        }
       .rightBox{
            padding-left: 141px;
            background: var(--contentColor);
            .Rcontainer{
                width: 418px;
                .back{
                    padding-top: 84px;
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    span{
                        margin-left: 8px;
                        color: #666;
                        font-family: Poppins;
                        font-size: 16px;
                        font-style: normal;
                        font-weight: 400;
                        line-height: normal;
                    }

                }
                .pageTitle {
                    margin-top:44px;
                    font-size: 32px;
                    color: var(--primaryText);
                    font-family: Poppins;
                    font-style: normal;
                    line-height: normal;
                }
                .pageTips1{
                    margin-top: 24px;
                    color: var(--mainColor);
                    font-family: Poppins;
                    font-size: 16px;
                    font-style: normal;
                    line-height: normal;
                }
                .pageTips2{
                    margin-top:12px;
                    color: #808080;
                    font-family: Poppins;
                    font-size: 16px;
                    font-style: normal;
                    line-height: normal;
                }
                .openTypeTab {
                    margin-left: -8px;
                    margin-top:32px;
                    display: flex;
                    height: 34px;
                    justify-content: flex-start;
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
                        border-radius: 2px;
                        background: var(--primary);
                    }
                    :deep(.van-tab) {
                        line-height: 20px;
                        .van-tab__text {
                            font-size: 16px;
                            font-weight: 600;
                        }
                        &:first-of-type {
                            margin-right: 40px;
                        }
                }
                }

                .cell {
                    height: 57px;
                    display: flex;
                    justify-content: space-between;
                    margin-top:40px;
                    border-radius: 9px;
                    background-color: var(--contentColor);
                    border: 1px solid #ADADAD;
                    padding: 0 16px;
                    .inputWrapper {
                        padding-right: 0;
                    }
                    :deep(input) {
                        font-size: 14px;
                    }
                    .van-hairline--bottom:after {
                        border-bottom: none;
                    }
                    div {
                        flex: 1;
                        border: none;
                        background-color: var(--contentColor);
                    }
                    .zone {
                        flex: none;
                        width: 100px;
                        margin-right: 10px;
                    }
                }
                .nextBtn{
                    margin-top: 24px;
                    width: 100%;
                    height: 54px;
                    border-radius: 10px;
                    background: var(--primary);
                    color: #FFF;
                    text-align: center;
                    font-family: Poppins;
                    font-size: 16px;
                    font-style: normal;
                    font-weight: 500;
                    line-height:  54px;
                    cursor: pointer;
                }
                .tipsBox{
                    margin-top:12px;
                    color: var(--btnTextDisabledColor);
                    font-family: Poppins;
                    font-size: 13px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: normal;
                    .hot{
                        color: var(--primary);
                        text-decoration: underline;
                    }
                }

            }
        }
    }
}
</style>

<template>
    <LayoutTop :menu='false' :show-title='false' :title="$t('route.mine')" />
    <div class='registe-step1'>
        <div class='container'>
            <p class='pageTitle'> {{ $t('login.inputVerifyCode') }} </p>
            <p class="pageTips1">{{$t('login.tipsText4')}}:</p>
            <p class="pageTips2">{{$t('login.tipsText5')}}.</p>
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
            <button class="nextBtn" @click="confirmNext">{{$t('common.nextVerify')}}</button>
        </div>
    </div>
</template>

<script setup>
import { reactive ,computed,ref,onMounted,watch} from "vue";
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { Toast } from 'vant'
import { useI18n } from 'vue-i18n'

import { firebaseAnalytics } from '@/utils/firebase'
import { verifyCodeSend } from '@/api/base'
import CheckCode from '@/components/form/checkCode'
import { sessionGet, sessionSet } from '@/utils/util'

const { t, locale } = useI18n({ useScope: 'global' })
const router = useRouter()
const state = reactive({
            emailCheckCode: '',
            mobileCheckCode: '',
            mobileToken: '',
            emailToken: '',
            verifyCodeLoading: false,
    })
const {value:registerInfo} = computed(() =>JSON.parse(sessionGet('registerInfo')) )
const inletRegister=JSON.parse(sessionGet('inletRegister'))

// 发送验证码
const verifyCodeSendHandler = (callback) => {
    state.verifyCodeLoading = true
    const countryCode = registerInfo.openType === 'email' ? registerInfo.defaultCountry.code : registerInfo.countryCode
    const params = {
        bizType: registerInfo.openType === 'mobile' ? 'SMS_REGISTER_VERIFICATION_CODE' : 'EMAIL_REGISTER_VERIFICATION_CODE',
        toUser: registerInfo.openType === 'mobile' ? registerInfo.countryZone + ' ' +  registerInfo.mobile  : registerInfo.email,
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
                registerInfo.openType === 'mobile' ? (state.mobileToken = res.data.token)  : (state.emailToken =  res.data.token)
                callback && callback()
            } else {
                callback && callback(false)
            }
    }).catch(e=>{
        state.verifyCodeLoading = false
    })
}

const confirmNext=()=>{
    if ( (registerInfo.openType === 'email' && !state.emailToken) || (registerInfo.openType === 'mobile' && !state.mobileToken) ) {
           return Toast(t('common.inputRealVerifyCode'))
    }else{
        const paramsStep2={...registerInfo,...state} 
        sessionSet('registerInfo',JSON.stringify(paramsStep2))
        router.push('/register/step3')
    }
    
}


onMounted(() => {
    if(!inletRegister){
        router.replace('/register')     
        return
    }
    if(registerInfo){
        const { mobile, email } = registerInfo
        if (mobile) {
            state.mobileCheckCode = registerInfo.mobileCheckCode
            state.mobileToken=registerInfo.mobileToken
        } else if (email) {
            state.emailCheckCode = registerInfo.emailCheckCode
            state.emailToken=registerInfo.emailToken
        }
    }
            
})
</script>

<style lang="scss" scoped>
@import "@/sass/mixin.scss";
.registe-step1 {
    position: relative;
    height: 100%;
    background: var(--contentColor);
    padding: 0 rem(40px);
    .topBar {
        height: rem(100px);
    }
    .container {
        .pageTitle {
            margin-top: rem(54px);
            font-size: rem(52px);
            color: var(--primaryText);
            font-family: Poppins;
            font-style: normal;
            line-height: normal;
        }
        .pageTips1{
            margin-top: rem(66px);
            color: var(--mainColor);
            font-family: Poppins;
            font-size: rem(32px);
            font-style: normal;
            line-height: normal;
        }
        .pageTips2{
            margin-top: rem(24px);
            color: #808080;
            font-family: Poppins;
            font-size: rem(32px);
            font-style: normal;
            line-height: normal;
        }
        .openTypeTab {
            margin-top: rem(80px);
            display: flex;
            height: rem(68px);
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
                border-radius: rem(4px);
                background: var(--primary);
            }
            :deep(.van-tab) {
                line-height: rem(40px);
                .van-tab__text {
                    font-size: rem(32px);
                    font-weight: 600;
                    color: var(--primary);
                }
                &:first-of-type {
                    margin-right: rem(48px);
                }
        }
        }

        .cell {
            height: rem(114px);
            display: flex;
            justify-content: space-between;
            margin-top: rem(48px);
            border-radius: rem(10px);
            background-color: var(--contentColor);
            border: 1px solid #ADADAD;
            padding: 0 rem(32px);
            .inputWrapper {
                padding-right: 0;
            }
            :deep(input) {
                font-size: rem(28px);
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
        .nextBtn{
            margin-top: rem(48px);
            width: 100%;
            height: rem(108px);
            border-radius: rem(20px);
            background: var(--primary);
            color: #FFF;
            text-align: center;
            font-family: Poppins;
            font-size: rem(32px);
            font-style: normal;
            font-weight: 500;
            line-height:  rem(108px);
        }
       
    }
}


</style>


<template>
    <LayoutTop :menu='false' :show-title='false' :title="$t('route.mine')" />
    <div class='registe-step1'>
        <div class='container'>
            <p class='pageTitle'>{{$t('forgot.setPwd')}}</p>
            <div class='cell'>
                <InputComp v-model='state.pwd' clear :label="$t('register.newPassword')" pwd />
            </div>
            <button class="nextBtn" @click="confirm">{{$t('news.confirm')}}</button>
        </div>
    </div>
    <Loading :show='state.loading' />
</template>

<script setup>
import { reactive ,computed,onMounted,getCurrentInstance} from "vue";
import { useRouter ,useRoute} from 'vue-router'
import md5 from 'js-md5'
import { Toast } from 'vant'
import { useI18n } from 'vue-i18n'

import { sessionGet, getDevice ,localSet,getQueryVariable,setToken,sessionRemove, pwdReg } from '@/utils/util'
import { firebaseAnalytics } from '@/utils/firebase'
import { setQuoteService } from '@/plugins/socket/socket'
import getTrackingInvesting from '@/utils/investingCom'
import { register } from '@/api/user'
import hooks from './hooks'

import InputComp from '@/components/form/input'

const { t } = useI18n({ useScope: 'global' })
const instance = getCurrentInstance()
const router = useRouter()
const route = useRoute()

const state = reactive({
                pwd: '',
                loading: false,
            })
const entrySearch = sessionGet('entrySearch')
const {value:registerInfo} = computed(() =>JSON.parse(sessionGet('registerInfo')) )
const inletRegister=JSON.parse(sessionGet('inletRegister'))
const { getCustomerGroupIdByCountry, getPlansByCountry } = hooks()
const confirm=()=>{
    if (!state.pwd) {
        return Toast(t('common.inputPwd'))
    }
    if (!pwdReg.test(state.pwd)) {
        return Toast(t('forgot.pwdRule'))
    }
    let params = {}
    const countryCode = registerInfo.openType === 'email' ? registerInfo.defaultCountry.code : registerInfo.countryCode
    params = {
        type: registerInfo.openType === 'email' ? 1 : 2,
        loginName: registerInfo.openType === 'email' ? registerInfo.email : registerInfo.mobile,
        registerSource: getDevice(),
        verifyCode: registerInfo.openType === 'email' ? registerInfo.emailCheckCode : registerInfo.mobileCheckCode,
        sendToken: registerInfo.openType === 'email' ? registerInfo.emailToken : registerInfo.mobileToken,
        utmSource: getQueryVariable('utm_source', entrySearch),
        utmMedium: getQueryVariable('utm_medium', entrySearch),
        utmCampaign: getQueryVariable('utm_campaign', entrySearch),
        utmContent: getQueryVariable('utm_content', entrySearch),
        utmTerm: getQueryVariable('utm_term', entrySearch),
        protocol: true,
        tradeTypeCurrencyList: getPlansByCountry(countryCode),
        customerGroupId: getCustomerGroupIdByCountry(countryCode),
        pwd: md5(state.pwd),
        country: countryCode,
        openAccountType: registerInfo.openAccountType,
    }
    if (registerInfo.openType === 'mobile') {
        params.phoneArea = String(registerInfo.countryZone)
    } else {
        params.emailArea = String(registerInfo.defaultCountry.countryCode)
    }
    if (sessionGet('b_superiorAgent')) {
        params.thirdServerCode = sessionGet('b_superiorAgent')
        params.thirdServerSource = 'agent'
    }
    console.log('params',params);
    registerSubmit(params)
}
const registerSubmit = (params) => {
            state.loading = true
            // firebase
            const fbvalue = {}
            if (registerInfo.openType === 'email') {
                fbvalue.email = params.loginName
            } else {
                fbvalue.phone = params.loginName
            }
            firebaseAnalytics('sign_up_summit', {
                key: 'sign_up_summit',
                value: registerInfo.openType === 'email' ? 'email' : 'phone',
            }, fbvalue)
            // 系统注册接口
            register(params)
                .then((res) => {
                    if (res?.code === 'CUSTOMER_API_00010001') {
                        // 人工审核
                        if (res?.data?.customerNo) {
                            firebaseAnalytics('sign_up_success', {
                                key: 'sign_up_success',
                                value: JSON.stringify({
                                    sign_up_success: registerInfo.openType === 'email' ? 'email' : 'phone',
                                    ...fbvalue
                                })
                            }, { ...res.data, auditType: 'artificial' })
                        }
                        router.replace({ name: 'RegisterHandler' })
                    } else if (res.check()) {
                        // firebase
                        firebaseAnalytics('sign_up_success', {
                            key: 'sign_up_success',
                            value: JSON.stringify({
                                sign_up_success: registerInfo.openType === 'email' ? 'email' : 'phone',
                                ...fbvalue
                            })
                        }, res.data)
                        const path = route?.path.toLocaleLowerCase()
                        if ((path.match(/\/investing|\/investingmy|\/investingph/g) || []).length) {
                            let { subID, subid } = route?.params || {}
                            if (!subID && !subid) {
                                subID = route?.query?.subID
                                subid = route?.query?.subid
                            }
                            const body = { user_id: res.data.customerNo }
                            if (subID || subid) body['subID'] = subID || subid
                            getTrackingInvesting(body)
                        }
                        // 注册成功
                        sessionStorage.setItem('RegisterParams', JSON.stringify({ ...params, openType: registerInfo.openType}))
                        sessionStorage.setItem( 'RegisterData', JSON.stringify(res))

                        // 缓存注册信息
                        const loginInfoParams = {
                            accountType: params.type,
                            loginName: params.loginName
                        }
                        if (registerInfo.openType === 'mobile') {
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
                        sessionRemove('registerInfo')
                        if (res.data.list.length > 0) {
                            // 需要KYC认证
                            sessionStorage.setItem( 'kycList', JSON.stringify(res.data.list) )
                            router.replace({ name: 'RegKyc', query: { levelCode: res.data.list[0].levelCode }})
                        } else {
                            router.replace({ name: 'RegisterSuccess' })
                        }
                    } else {
                        state.loading = false
                        res.toast()
                    }
                })
        }

onMounted(() => {
    if(!inletRegister){
        router.replace('/register')     
        return
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
        .cell {
            height: rem(114px);
            display: flex;
            justify-content: space-between;
            margin-top: rem(66px);
            border-radius: rem(10px);
            background-color: var(--contentColor);
            border: 1px solid #ADADAD;
            padding: 0 rem(32px);
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


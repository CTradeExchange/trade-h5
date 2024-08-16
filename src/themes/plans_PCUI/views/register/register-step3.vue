<template>
    <div class='register'>
        <topNav class='header' />
        <div class='container'>
            <RegisterLeftCard/>
            <div class="rightBox">
                <div class="Rcontainer">
                    <div class="back" @click="back">
                        <el-icon size="20"><Back /></el-icon>
                        <span>Back</span>
                    </div>
                    <p class='pageTitle'>{{$t('forgot.setPwd')}}</p>
                    <div class='cell'>
                        <InputComp v-model='state.pwd' clear :label="$t('register.newPassword')" pwd />
                    </div>
                    <button class="nextBtn" @click="confirm">{{$t('news.confirm')}}</button>
                </div>
            </div>
        </div>
        <router-view />
    </div>
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

import RegisterLeftCard from "./registerLeftCard";
import topNav from '@planspc/layout/topNav'
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

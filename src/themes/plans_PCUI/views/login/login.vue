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
                    <div class='pageTitle'>
                        {{ $t('login.loginByPersonal') }}
                    </div>
                    <van-tabs v-model:active='state.loginNameType' class='openTypeTab' shrink>
                        <van-tab name='email' :title="$t('register.email')" />
                        <van-tab name='mobile' :title="$t('register.phoneNo')" />
                    </van-tabs>
                    <form class='loginForm'>
                        <div v-if="state.loginNameType==='mobile'" class='field'>
                            <areaInputPc
                                ref='loginNameEl'
                                v-model.trim='state.loginName'
                                v-model:zone='state.zone'
                                block
                                class='mobileInput'
                                :country-code='state.countryCode'
                                :is-business='state.accountType === 2'
                                :placeholder="$t('common.inputPhone')"
                                @keyup.enter='onLoginNameKeyupEnter'
                                @onBlur='checkUserMfa'
                                @zoneSelect='zoneSelect'
                            />
                        </div>
                        <div v-else class='field'>
                            <compInput
                                ref='loginNameEl'
                                v-model.trim='state.email'
                                block
                                class='emailInput'
                                :placeholder="$t('common.inputEmail')"
                                @keyup.enter='onLoginNameKeyupEnter'
                                @onBlur='checkUserMfa'
                            />
                        </div>
                        <div v-if="state.loginType==='password'" class='field'>
                            <compInput
                                ref='pwdEl'
                                v-model='state.pwd'
                                block
                                class='pwdInput'
                                :clear='false'
                                :placeholder="$t('signIn.pwd')"
                                :type='state.inputType'
                                @keyup.enter='loginHandle'
                            >
                                <div class='eyeBtn' @click.stop="state.inputType= state.inputType==='password'?'text':'password'">
                                    <img :class="[state.inputType==='password'?'eyeOpenIcon':'eyeClosedIcon']" :src="state.inputType==='password'?eyeOpenIcon:eyeClosedIcon" />
                                </div>
                            </compInput>
                        </div>
                        <div v-else class='field'>
                            <div v-show="state.loginNameType==='email'" class='verifyCodeCell'>
                                <CheckCode
                                    ref='checkCodeEmailEl'
                                    v-model.trim='state.checkCodeEmail'
                                    clear
                                    :label='$t("login.verifyCode")'
                                    :loading='state.sendVerifyLoading'
                                    @verifyCodeSend='sendVerifyHandler'
                                />
                            </div>
                            <div v-show="state.loginNameType==='mobile'" class='verifyCodeCell'>
                                <CheckCode
                                    ref='checkCodeMobileEl'
                                    v-model.trim='state.checkCodeMobile'
                                    clear
                                    :label='$t("login.verifyCode")'
                                    :loading='state.sendVerifyLoading'
                                    @verifyCodeSend='sendVerifyHandler'
                                />
                            </div>
                        </div>
                        <div v-if='state.googleCodeVis' class='field field-google'>
                            <googleVerifyCode @getGooleVerifyCode='getGooleVerifyCode' />
                        </div>
                        <!-- <div class='forget-link'>
                            <a class='switchLoginType' href='javascript:;' @click='switchLoginType'>
                                {{ state.loginType==='password' ? $t("signIn.loginByCode") : $t("signIn.loginByPwd") }}
                            </a>
                            <a class='switchLoginType' href='javascript:;' @click='goForgot'>
                                {{ $t('signIn.forgot') }}?
                            </a>
                        </div> -->
                        <div class='mt-9'>
                            <van-button block class='loginBtn' :disabled='state.loading' @click='loginHandle'>
                                {{ $t('signIn.loginBtn') }}
                            </van-button>
                        </div>
                    </form>
                    <!-- <div class='linkBar'>
                        <div>
                            {{ $t('login.goRegister') }}
                            <span class='link' @click="router.push('/register')">
                                {{ $t('signIn.register') }}
                            </span>
                        </div>
                    </div> -->
                </div>
            </div>
        </div>
        <!-- 设置登录密码弹窗 -->
        <!-- <LoginPwdDialog v-model='state.loginPwdPop' /> -->
        <!-- 加载效果 -->
        <Loading :show='state.loading' />
        <router-view />
    </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { localGet, isEmpty, localSet, localGetJSON, getDefaultZoneIndex } from '@/utils/util'
import { Toast, Dialog } from 'vant'
import LoginHook from './loginHook'
import googleVerifyCode from '@/themeCommon/components/googleVerifyCode.vue'
import { checkGoogleMFAStatus } from '@/api/user'
import eyeClosedIcon from '@planspc/images/eye-close.png'
import eyeOpenIcon from '@planspc/images/eye-open.png'
import { firebaseAnalytics } from '@/utils/firebase'

import topNav from '@planspc/layout/topNav'
import RegisterLeftCard from '../register/registerLeftCard.vue'
import compInput from '@planspc/components/form/input'
import areaInputPc from '@/components/form/areaInputPc'
import CheckCode from '@/components/form/checkCode'
import LoginPwdDialog from './loginPwdDialog.vue'
const router = useRouter()
const route = useRoute()
const store = useStore()
const loginNameEl = ref()
const pwdEl = ref()
const checkCodeEmailEl = ref()
const checkCodeMobileEl = ref()
const { t } = useI18n({ useScope: 'global' })
const state = reactive({
    loading: false,
    accountType: 1, // 账户登录方式 1.普通登录 2.基金经理
    pwdVisible: false,
    loginPwdPop: false,
    sendVerifyLoading: false,
    loginName: '',
    email: '',
    zone: '',
    pwd: '',
    googleCodeVis: '',
    checkCodeMobile: '',
    checkCodeEmail: '',
    token: '', // 验证码token
    loginNameType: 'email', // mobile 手机号登录   email 邮箱登录
    loginType: 'checkCode', // password 密码登录   checkCode 验证码登录
    countryCode: '',
    inAnimation: false,
    eyeClosedIcon,
    eyeOpenIcon,
    inputType: 'password'
})

const countryList = computed(() => {
    return state.accountType === 2 ? store.getters.companyCountryList : store.state.countryList
})

// 检测客户是否开启GoogleMFA
const checkUserMfa = (val) => {
    if (val) {
        const param = {
            loginName: val,
            type: state.loginNameType === 'email' ? 1 : 2
        }
        if (state.loginNameType === 'mobile') param.phoneArea = state.zone
        checkGoogleMFAStatus(param).then(res => {
            if (res.check()) {
                state.googleCodeVis = res.data > 0
            }
        }).catch(err => {
            console.log('err', err)
        })
    }
}

// 初始化区号
watch([countryList, () => store.state._base.wpCompanyInfo?.defaultZone], (value) => {
    if (value[0] && value[0].length) {
        const allCountryList = value[0]
        const defaultZone = value[1]
        let index = -1
        const loginInfo = localGetJSON('loginInfo')
        if (loginInfo?.phoneArea) {
            index = allCountryList.findIndex(el => el.countryCode === loginInfo.phoneArea)
        }
        if (loginInfo?.accountType) {
            if (loginInfo.accountType === 1) {
                state.email = loginInfo?.loginName || ''
                // 当路由携带了这个说明是从改密码跳转过来的就用路由的参数
                if (route.query.loginNameType) {
                    state.loginNameType = route.query.loginNameType
                } else {
                    state.loginNameType = 'email'
                }
            } else {
                state.loginName = loginInfo?.loginName || ''
                if (route.query.loginNameType) {
                    state.loginNameType = route.query.loginNameType
                } else {
                    state.loginNameType = 'mobile'
                }
            }
        }
        // 根据语言优先显示默认区号
        if (index === -1) {
            index = getDefaultZoneIndex(allCountryList, defaultZone?.code)
        }
        const defaultZoneConfig = (index === -1) ? allCountryList[0] : allCountryList[index]
        if (defaultZoneConfig?.countryCode) {
            state.zone = defaultZoneConfig.countryCode
            state.countryCode = defaultZoneConfig.code
        }
        if (loginInfo?.loginName) {
            checkUserMfa(loginInfo?.loginName)
        }
    }
}, { immediate: true })

const { loginSubmit, loginToPath, verifyCodeBtnText, sendVerifyCode } = LoginHook()

watch(() => state.loginNameType, val => {
    state.pwd = ''
    const loginName = state.loginNameType === 'email' ? state.email : state.loginName
    if (loginName) {
        checkUserMfa(loginName)
    }
})

// 跳转路由
const toRoute = path => {
    router.push('/home').then(() => {
        router.push('/home' + path)
    })
}

// 切换登录方式
const switchLoginType = () => {
    state.loginType = state.loginType === 'password' ? 'checkCode' : 'password'
}

// 点击登录
const loginHandle = () => {
    if (state.googleCodeVis && isEmpty(state.googleCode)) {
        return Toast(t('common.inputGoogleCode'))
    }
    state.loading = true
    const params = {
        type: state.loginNameType === 'email' ? 1 : 2,
        loginName: state.loginNameType === 'email' ? state.email : state.loginName,
        loginType: state.loginType,
        phoneArea: state.zone,
        checkCode: state.loginNameType === 'email' ? state.checkCodeEmail : state.checkCodeMobile,
        pwd: state.pwd,
        token: state.token,
        googleCode: state.googleCode
    }
    loginSubmit(params).then(res => {
        // 登录KYC,kycAuditStatus:0未认证跳,需转到认证页面,1待审核,2审核通过,3审核不通过
        // companyKycStatus 公司KYC开户状态，1开启 2未开启
        if (res.invalid()) return res
        // firebase
        firebaseAnalytics('login_success', {
            key: 'login_success',
            value: state.loginNameType === 'email' ? 'email' : 'phone'
        })

        localSet('loginInfo', JSON.stringify({
            accountType: params.type,
            loginName: params.loginName,
            phoneArea: params.phoneArea || '',
        }))

        if (Number(res.data.companyKycStatus) === 1) {
            if (Number(res.data.kycAuditStatus === 0)) {
                return Dialog.alert({
                    title: t('common.tip'),
                    confirmButtonText: t('login.goAuthenticate'),
                    message: t('login.goAuthenticateMsg'),

                }).then(() => {
                    toRoute('/authentication')
                })
            } else if (Number(res.data.kycAuditStatus === 1)) {
                return Dialog.alert({
                    title: t('common.tip'),
                    confirmButtonText: t('common.close'),
                    message: t('common.inReview'),

                }).then(() => {
                    store.dispatch('_user/logout').then(() => {
                        return router.push('/login')
                    }).then(() => {
                        location.reload()
                    })
                })
            } else if (Number(res.data.kycAuditStatus === 3)) {
                return Dialog.alert({
                    title: t('common.tip'),
                    confirmButtonText: t('common.reSubmit'),
                    message: t('common.reviewFailed') + '\n' + t('common.reviewReson') + res.data.kycAuditRemark,

                }).then(() => {
                    toRoute('/authentication')
                })
            } else if (Number(res.data.kycAuditStatus === 2)) {
                noticeSetPwd(res.data.loginPassStatus)
            }
        } else if (Number(res.data.companyKycStatus) === 2) {
            noticeSetPwd(res.data.loginPassStatus)
        }
    }).finally(() => {
        state.loading = false
    })
}

// 显示密码设置弹窗
const noticeSetPwd = (loginPassStatus) => {
    if (parseInt(loginPassStatus) === 1 && !localGet('loginPwdIgnore')) {
        // state.loginPwdPop = true
        // TODO: 暂时隐藏设置登录密码
        loginToPath()
    } else {
        loginToPath()
    }
}

const back = () => {
    router.go(-1)
}

const goForgot = () => {
    store.commit('_user/Update_loginQuery', `/login/select?loginType=${state.loginType}&loginNameType=${state.loginNameType}&data=${state.loginNameType == 'email' ? state.email : state.loginName}`)
    router.push({ path: '/forgot', query: { type: 'login', loginNameType: state.loginNameType } })
}

// 发送验证码
const sendVerifyHandler = (callback) => {
    const param = {
        type: state.loginNameType === 'email' ? 1 : 2,
        loginName: state.loginNameType === 'email' ? state.email : state.loginName,
    }
    if (state.loginNameType === 'mobile') param.phoneArea = state.zone
    state.sendVerifyLoading = true
    sendVerifyCode(param).then(res => {
        if (res.check && res.check()) {
            // firebase
            firebaseAnalytics('login_code', {
                key: 'login_code',
                value: state.loginNameType === 'email' ? 'email' : 'phone'
            })
            state.token = res.data.token
            callback && callback()
        } else {
            callback && callback(false)
        }
    }).catch(err => {
        callback && callback(false)
    }).finally(() => {
        state.sendVerifyLoading = false
    })
}

// 按键回车键
const onLoginNameKeyupEnter = () => {
    if (state.loginType === 'password' && state.pwd === '') {
        const iputEl = pwdEl.value?.$el?.querySelector('input')
        iputEl && iputEl.focus()
    } else if (state.loginType === 'checkCode' && state.loginNameType === 'mobile' && state.checkCodeMobile === '') {
        const iputEl = checkCodeMobileEl.value?.$el?.querySelector('input')
        iputEl && iputEl.focus()
    } else if (state.loginType === 'checkCode' && state.loginNameType === 'email' && state.checkCodeEmail === '') {
        const iputEl = checkCodeEmailEl.value?.$el?.querySelector('input')
        iputEl && iputEl.focus()
    } else {
        console.log('调用登录')
    }
}

const getGooleVerifyCode = val => {
    state.googleCode = val
}

// 选择登录手机号区号
const zoneSelect = (data) => {
    state.zone = data.code
    state.countryCode = data.countryCode
    if (state.loginName) checkUserMfa(state.loginName)
}

onMounted(() => {
    const { data, loginNameType } = route.query
    if (loginNameType === 'email')state.email = data
    if (loginNameType === 'mobile')state.loginName = data

    // 获取国家区号
    store.dispatch('getCountryListByParentCode')
    // 获取支持企业注册国家
    store.dispatch('getCompanyCountry')
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
                    user-select: none;
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

                .loginForm {
                    margin-top: 40px;
                    .field {
                        margin-top: 24px;
                        :deep(.pcInputBar) {
                            border-radius: 9px;
                            border: solid 1px var(--lineColor);
                            height: 57px;
                            background-color: var(--contentColor);
                            &:hover,&:focus{
                                border: solid 1px var(--primary);
                            }
                        }
                        :deep(.pcInput) {
                            height: 100%;
                            border-radius: 9px;
                            font-size: 14px;
                            background: var(--contentColor);
                        }
                    }
                    .forget-link{
                        margin-top: 12px;
                        width: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        a{
                            color: var(--primary);
                        }
                    }
                    :deep(.field-google) {
                        .form-item {
                            border-radius: 4px;
                            //background: var(--assistColor);
                        }
                        .van-cell {
                            height: 48px;
                            padding-left: 20px;
                            background: none;
                            font-size: 16px;
                            &::after{
                                border-bottom: none;
                            }
                        }
                        .paste {
                            display: none;
                        }
                    }
                    .loginTitle {
                        font-weight: bold;
                        font-size: 32px;
                        line-height: 1;
                    }

                    .loginBtn {
                        height: 54px;
                        margin-top: 20px;
                        font-size: 16px;
                        border-radius: 10px;
                        font-weight: 500;
                        background: var(--primary);
                        color: var(--contentColor);
                        &:hover{
                            opacity: 0.8;
                        }
                    }
                    .verifyCodeBtn {
                        width: 90px;
                        margin-right: 8px;
                        font-size: 14px;
                        background: none;
                        border: 0;
                    }
                }
                .linkBar {
                    display: flex;
                    justify-content: center;
                    margin-top: 12px;
                    a {
                        color: var(--color);
                    }
                    .link{
                        color: var(--primary);
                        cursor: pointer;
                    }
                }

                .verifyCodeCell {
                    :deep {
                        .checkCodeBar {
                            height: 57px;
                            border: solid 1px var(--lineColor);
                            border-radius: 9px;
                            background: var(--contentColor);
                            .checkCodeInput {
                                font-size: 14px;
                            }
                            .getCodeBtn {
                                margin: 0 18px;
                                color: var(--primary);
                                font-size: 14px;
                                cursor: pointer;
                                &:disabled {
                                    color: var(--minorColor);
                                    cursor: default;
                                }
                            }
                            .input {
                                width: 100%;
                                height: 57px;
                                padding: 0 5px;
                                padding-left: 18px;
                            }
                        }
                    }
                }
                .emailInput{
                    background: var(--contentColor);
                    border-radius: 9px;
                    :deep(.pcInput){
                        border-radius: 8px;
                        height: 57px;
                        background: var(--contentColor);
                    }
                }
                .pwdInput{
                    background: var(--contentColor);
                    border-radius: 9px;
                    :deep(.pcInput){
                        border-radius: 8px;
                        height: 57px;
                        background: var(--contentColor);
                    }
                    .eyeBtn{
                        padding: 0 10px;
                        cursor: pointer;
                    }
                    .eyeClosedIcon{
                        width:17px;
                        height: 8px;
                    }
                    .eyeOpenIcon{
                        width:17px;
                        height: 13px;
                    }
                }
                .mobileInput{
                    background: var(--contentColor);
                    border-radius: 9px;
                    border:1px solid var(--lineColor);
                    height: 57px;
                    &:hover{
                        border:1px solid var(--primary);
                    }
                    :deep(.zone){
                        margin-right: 0;

                    }
                    :deep{
                        .inputWrapper{
                            .input{
                                font-size: 14px;
                            }
                        }
                    }

                }
            }
        }
    }
}
</style>

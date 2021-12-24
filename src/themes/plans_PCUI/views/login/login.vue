<template>
    <div class='login'>
        <topNav class='header' />
        <div class='main'>
            <loginTypeBar v-model='loginType' />
            <form class='loginForm'>
                <h2 class='loginTitle'>
                    {{ loginType==='password' ? $t("signIn.loginByPwd") : $t("signIn.loginByCode") }}
                </h2>
                <div class='field'>
                    <compInput ref='loginNameEl' v-model.trim='loginName' block :placeholder="$t('signIn.loginNamePlaceholder')" @keyup.enter='onLoginNameKeyupEnter' />
                </div>
                <div v-if="loginType==='password'" class='field'>
                    <compInput
                        ref='pwdEl'
                        v-model='pwd'
                        block
                        :placeholder="$t('signIn.pwd')"
                        type='password'
                        @keyup.enter='loginHandle'
                    />
                </div>
                <div v-else class='field'>
                    <compInput ref='checkCodeEl' v-model.trim='checkCode' block :placeholder="$t('signIn.verifyCode')" @keyup.enter='loginHandle'>
                        <van-button
                            class='verifyCodeBtn'
                            :disabled='!isNaN(verifyCodeBtnText)'
                            :loading='sendVerifyLoading'
                            plain
                            size='small'
                            type='primary'
                            @click='sendVerifyHandler'
                        >
                            {{ verifyCodeBtnText }}
                        </van-button>
                    </compInput>
                </div>
                <van-button block class='loginBtn' :disabled='loading' type='primary' @click='loginHandle'>
                    {{ $t('signIn.loginBtn') }}
                </van-button>
            </form>
            <div class='linkBar'>
                <router-link to='/register'>
                    {{ $t('signIn.register') }}
                </router-link>
                <router-link to='/forgot'>
                    {{ $t('signIn.forgot') }}
                </router-link>
            </div>
            <div v-if='thirdLoginArr.length > 0' class='three-way-login'>
                <p class='title'>
                    {{ $t('login.otherLogin') }}
                </p>
                <div class='otherLogin'>
                    <LoginByGoogle v-if="thirdLoginArr.includes('google')" />
                    <LoginByFacebook v-if="thirdLoginArr.includes('facebook')" />
                    <LoginByTwitter v-if="thirdLoginArr.includes('twitter')" />
                </div>
            </div>
        </div>
        <div class='footer'>
            © 2021 Trade Switcher. All rights reserved
        </div>

        <!-- 设置登录密码弹窗 -->
        <LoginPwdDialog v-model='loginPwdPop' />

        <!-- 加载效果 -->
        <Loading :show='loading' />
    </div>
</template>

<script>
import topNav from '@planspc/layout/topNav'
import loginTypeBar from './loginTypeBar'
import compInput from '@planspc/components/form/input'
import LoginPwdDialog from './loginPwdDialog.vue'
import { reactive, ref, toRefs, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { localGet, isEmpty } from '@/utils/util'
import { Dialog } from 'vant'
import LoginHook from './loginHook'
import LoginByGoogle from '@/themeCommon/user/login/components/loginByGoogle.vue'
import LoginByFacebook from '@/themeCommon/user/login/components/loginByFacebook.vue'
import LoginByTwitter from '@/themeCommon/user/login/components/loginByTwitter.vue'

export default {
    name: 'Login',
    components: {
        LoginPwdDialog,
        loginTypeBar,
        topNav,
        compInput,
        LoginByGoogle,
        LoginByFacebook,
        LoginByTwitter,
    },
    setup () {
        const router = useRouter()
        const store = useStore()
        const loginNameEl = ref()
        const pwdEl = ref()
        const checkCodeEl = ref()
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            loading: false,
            pwdVisible: false,
            loginPwdPop: false,
            sendVerifyLoading: false,
            loginName: '',
            pwd: '',
            checkCode: '',
            token: '', // 验证码token
            loginType: 'password', // password 密码登录   checkCode 验证码登录
        })

        const countryList = computed(() => store.state.countryList)
        const thirdLoginArr = computed(() => store.state._base.wpCompanyInfo?.thirdLogin || [])

        const { loginSubmit, loginToPath, verifyCodeBtnText, sendVerifyCode } = LoginHook()

        // 跳转路由
        const toRoute = path => {
            router.push('/home').then(() => {
                router.push('/home' + path)
            })
        }

        // 点击登录
        const loginHandle = () => {
            state.loading = true
            loginSubmit({
                loginName: state.loginName,
                loginType: state.loginType,
                checkCode: state.checkCode,
                pwd: state.pwd,
                token: state.token,
            }).then(res => {
                console.log('success')
                // 登录KYC,kycAuditStatus:0未认证跳,需转到认证页面,1待审核,2审核通过,3审核不通过
                // companyKycStatus 公司KYC开户状态，1开启 2未开启
                if (res.invalid()) return res
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
                state.loginPwdPop = true
            } else {
                loginToPath()
            }
        }

        // 发送验证码
        const sendVerifyHandler = () => {
            const param = {
                loginName: state.loginName,
            }
            state.sendVerifyLoading = false
            sendVerifyCode(param).then(res => {
                console.log(res)
                if (res.check()) {
                    state.token = res.data.token
                }
            }).finally(() => {
                state.sendVerifyLoading = false
            })
        }

        // 按键回车键
        const onLoginNameKeyupEnter = () => {
            console.log('onLoginNameKeyupEnter')
            if (state.loginType === 'password' && state.pwd === '') {
                const iputEl = pwdEl.value?.$el?.querySelector('input')
                iputEl && iputEl.focus()
            } else if (state.loginType === 'checkCode' && state.checkCode === '') {
                const iputEl = checkCodeEl.value?.$el?.querySelector('input')
                iputEl && iputEl.focus()
            } else {
                console.log('调用登录')
            }
        }

        onMounted(() => {
            if (isEmpty(countryList.value) && !isEmpty(thirdLoginArr.value)) {
                // 获取国家区号
                store.dispatch('getCountryListByParentCode')
            }
            // 获取三方登录配置
            store.dispatch('_base/getLoginConfig')
        })

        return {
            ...toRefs(state),
            loginHandle,
            verifyCodeBtnText,
            sendVerifyHandler,
            loginNameEl,
            pwdEl,
            checkCodeEl,
            thirdLoginArr,
            onLoginNameKeyupEnter,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.login{
    height: 100%;
    display: flex;
    flex-flow: column;
    font-size: 14px;
    justify-content: space-between;
    background: var(--bgColor);
    .footer{
        text-align: center;
        font-size: 12px;
        padding-bottom: 16px;
        color: var(--minorColor);
    }
    .main{
        margin: 0 auto;
        width: 520px;
        padding: 60px;
        border-radius: 10px;
        background: var(--contentColor);
    }
}
.loginForm{
    margin-top: 34px;
    .field{
        margin-top: 24px;
        :deep(.pcInputBar){
            border-radius: 4px;
        }
        :deep(.pcInput){
            font-size: 16px;
        }
    }
    .loginTitle{
        font-size: 32px;
        font-weight: bold;
        line-height: 1;
    }
    .loginBtn{
        height: 48px;
        border-radius: 4px;
        font-size: 20px;
        margin-top: 40px;
    }
    .verifyCodeBtn{
        width: 90px;
        margin-right: 8px;
        font-size: 14px;
        border: 0;
        background: none;
    }
}
.linkBar{
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    a{
        color: var(--color)
    }
}
.three-way-login{
    margin-top: 50px;
    .title{
        text-align: center;
        color: var(--placeholdColor);
        margin-bottom: 10px;
    }
    .otherLogin {
        text-align: center;
        display: flex;
        justify-content: space-evenly;
        width: 200px;
        margin: 15px auto 0;
    }
}
</style>

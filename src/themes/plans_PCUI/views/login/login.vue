<template>
    <div class='login'>
        <topNav class='header' />
        <div class='main'>
            <loginTypeBar v-model='loginType' />
            <form class='loginForm'>
                <h2 class='loginTitle'>
                    账号密码登录
                </h2>
                <div class='field'>
                    <compInput v-model.trim='loginName' block :placeholder="$t('login.loginNamePlaceholder')" />
                </div>
                <div v-if="loginType==='password'" class='field'>
                    <compInput v-model='pwd' block :placeholder="$t('login.pwd')" pwd type='password' />
                </div>
                <div v-else class='field'>
                    <compInput v-model.trim='checkCode' block :placeholder="$t('login.verifyCode')">
                        <van-button size='small' type='primary'>
                            获取验证码
                        </van-button>
                    </compInput>
                </div>
                <van-button block class='loginBtn' :disabled='loading' type='primary' @click='loginHandle'>
                    {{ $t('login.loginBtn') }}
                </van-button>
            </form>
            <div class='linkBar'>
                <router-link to='/register'>
                    注册
                </router-link>
                <router-link to='/forgot'>
                    忘记密码
                </router-link>
            </div>
        </div>
        <div class='footer'>
            © 2013 - 2021 CATS. All rights reserved
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
import Schema from 'async-validator'
import md5 from 'js-md5'
import { reactive, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { getDevice, localGet, localSet, getArrayObj } from '@/utils/util'
import MsgSocket from '@/plugins/socket/msgSocketEvent'
import RuleFn from './rule'
import { Toast, Dialog } from 'vant'
import LoginHook from './loginHook'
export default {
    name: 'Login',
    components: {
        LoginPwdDialog,
        loginTypeBar,
        topNav,
        compInput,
    },
    setup () {
        const router = useRouter()
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            loading: false,
            pwdVisible: false,
            loginPwdPop: false,
            loginName: '',
            pwd: '',
            checkCode: '',
            token: '', // 验证码token
            loginType: 'password', // password 密码登录   checkCode 验证码登录
        })

        const { loginSubmit, loginToPath } = LoginHook()

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
                            router.push('/authentication')
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
                            router.push('/authentication')
                        })
                    } else if (Number(res.data.kycAuditStatus === 2)) {
                        Dialog.alert({
                            title: t('common.tip'),
                            confirmButtonText: t('common.ok'),
                            message: t('common.reviewSuccess'),

                        }).then(() => {
                            noticeSetPwd(res.data.loginPassStatus)
                        })
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
        return {
            ...toRefs(state),
            loginHandle,
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
        background: var(--contentColor);
    }
}
.loginForm{
    margin-top: 34px;
    .field{
        margin-top: 24px;
    }
    .loginTitle{
        font-size: 32px;
        line-height: 1;
    }
    .loginBtn{
        font-size: 20px;
        margin-top: 40px;
    }
}
.linkBar{
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
}
</style>

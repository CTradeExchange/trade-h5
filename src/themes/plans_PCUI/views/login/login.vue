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
    </div>
</template>

<script>
import topNav from '@planspc/layout/topNav'
import loginTypeBar from './loginTypeBar'
import compInput from '@planspc/components/form/input'
import Schema from 'async-validator'
import md5 from 'js-md5'
import { reactive, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { getDevice, localGet, localSet, getArrayObj } from '@/utils/util'
import MsgSocket from '@/plugins/socket/msgSocketEvent'
import RuleFn from './rule'
import { Toast, Dialog } from 'vant'
import LoginHook from './loginHook'
export default {
    name: 'Login',
    components: {
        loginTypeBar,
        topNav,
        compInput,
    },
    setup () {
        const router = useRouter()
        const route = useRoute()
        const store = useStore()
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

        const { loginSubmit } = LoginHook()

        // 点击登录
        const loginHandle = () => {
            loginSubmit({
                loginName: state.loginName,
                loginType: state.loginType,
                checkCode: state.checkCode,
                pwd: state.pwd,
                token: state.token,
            }).then(() => {
                console.log('success')
            })
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

<template>
    <div class='pageWrap'>
        <Top :right-action='rightAction' @rightClick='changeLoginType' />
        <header class='header'>
            <h1 class='pageTitle'>
                {{ loginType==='password'? '账号密码登录':'验证码登录' }}
            </h1>
            <!-- <LanguageDiv /> -->
        </header>
        <form class='loginForm'>
            <div v-if="loginAccount==='mobile'" class='field'>
                <MobileInput v-model='mobile' v-model:zone='zone' clear placeholder='请输入手机号' />
            </div>
            <div v-else class='field'>
                <InputComp v-model='email' clear label='邮箱' />
            </div>
            <div v-if="loginType==='password'" class='field'>
                <InputComp v-model='pwd' v-model:zone='zone' clear label='密码' pwd />
            </div>
            <div v-else class='field'>
                <CheckCode v-model='checkCode' clear label='验证码' @verifyCodeSend='verifyCodeSendHandler' />
            </div>
            <van-button block class='loginBtn' type='primary' @click='loginHandle'>
                登录
            </van-button>
            <div class='toolBtns'>
                <a class='btn' href='javascript:;' @click="$router.push({ name:'Register' })">
                    注册新账户
                </a>
                <Vline />
                <a class='btn' href='javascript:;' @click="$router.push({ name:'Forgot' })">
                    忘记密码
                </a>
                <Vline />
                <a v-if="loginAccount==='mobile'" class='btn' href='javascript:;' @click="loginAccount='email'">
                    邮箱验证码登录
                </a>
                <a v-else class='btn' href='javascript:;' @click="loginAccount='mobile'">
                    手机验证码登录
                </a>
            </div>
        </form>
        <!-- <div class='otherLogin'>
            <LoginByGoogle />
            <span class='empty'></span>
            <LoginByFacebook />
        </div> -->
        <footer class='footer'>
            <a class='link' href='javascript:;'>
                <i class='icon_icon_service'></i>
                在线客服
            </a>
        </footer>
    </div>
</template>

<script>
import Schema from 'async-validator'
import LanguageDiv from '@m/modules/languageDiv'
import MobileInput from '@m/components/form/mobileInput'
import InputComp from '@m/components/form/input'
import Vline from '@/components/vline'
import CheckCode from '@m/components/form/checkCode'
import LoginByGoogle from '@m/components/loginByGoogle/loginByGoogle'
import LoginByFacebook from '@m/components/loginByFacebook/loginByFacebook'
import Top from '@/components/top'
import { getDevice } from '@/utils/util'
import { verifyCodeSend } from '@/api/base'
import { computed, reactive, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Toast } from 'vant'
import Rule from './rule'
export default {
    components: {
        LanguageDiv,
        Vline,
        InputComp,
        MobileInput,
        LoginByGoogle,
        LoginByFacebook,
        CheckCode,
        Top,
    },
    setup () {
        const router = useRouter()
        const route = useRoute()
        const store = useStore()
        const state = reactive({
            pwdVisible: false,
            zone: '+86',
            email: '',
            mobile: '13200001111',
            pwd: '',
            checkCode: '',
            loginType: 'checkCode',
            loginAccount: 'mobile',
        })
        let token = ''
        const rightAction = computed(() => {
            return {
                title: state.loginType === 'password' ? '验证码登录' : '账号密码登录'
            }
        })
        const changeLoginType = () => {
            const loginType = state.loginType
            state.loginType = loginType === 'password' ? 'checkCode' : 'password'
        }
        const loginHandle = () => {
            const loginParams = {
                type: state.loginAccount === 'mobile' ? 2 : 1,
                loginName: state.loginAccount === 'mobile' ? state.mobile : state.email,
                phoneArea: state.loginAccount === 'mobile' ? String(state.zone) : undefined,
                device: getDevice(),
                verifyCode: state.loginType === 'checkCode' ? state.checkCode : undefined,
                loginPwd: state.loginType === 'password' ? state.pwd : undefined,
                token: state.loginType === 'checkCode' ? token : undefined,
            }
            const validator = new Schema(Rule)
            validator.validate(loginParams, { ...state, first: true }, (errors, fields) => {
                // console.log(errors, fields)
                if (errors) {
                    Toast(errors[0].message)
                    return
                }
                loginSubmit(loginParams)
            })
        }
        // 发送登录接
        const loginSubmit = (params) => {
            store.dispatch('_user/login', params).then(res => {
                // console.log(res)
                if (res.check()) {
                    const toURL = route.query.back ? decodeURIComponent(route.query.back) : '/'
                    router.replace(toURL)
                }
            })
        }
        const topRightClick = () => {
            console.log('rightClick')
        }

        // 发送验证码
        const verifyCodeSendHandler = (callback) => {
            const verifyParams = {
                type: state.loginAccount === 'mobile' ? 2 : 1,
                loginName: state.loginAccount === 'mobile' ? state.mobile : state.email,
                phoneArea: state.loginAccount === 'mobile' ? String(state.zone) : undefined,
            }
            const validator = new Schema(Rule)
            validator.validate(verifyParams).then(res => {
                const params = {
                    bizType: state.loginAccount === 'mobile' ? 'SMS_LOGIN_VERIFICATION_CODE' : 'EMAIL_LOGIN_VERIFICATION_CODE',
                    toUser: state.loginAccount === 'mobile' ? String(state.zone * 1) + ' ' + state.mobile : state.email,
                }
                verifyCodeSend(params).then(res => {
                    if (res.check()) {
                        token = res.data.token
                        callback && callback()
                    }
                })
            }).catch(({ errors, fields }) => {
                if (errors) {
                    Toast(errors[0].message)
                }
            })
        }
        // 获取国家验区号
        store.dispatch('getListByParentCode')
        return {
            ...toRefs(state),
            changeLoginType,
            rightAction,
            loginHandle,
            topRightClick,
            verifyCodeSendHandler,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.pageWrap {
    position: relative;
    height: 100%;
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: rem(40px) rem(30px);
    }
    .pageTitle {
        font-weight: normal;
        font-size: rem(50px);
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
    margin: rem(50px) rem(30px);
    .field {
        position: relative;
        display: flex;
        align-items: center;
        &:not(:first-of-type) {
            margin-top: rem(45px);
        }
        &.toolWrap {
            justify-content: space-between;
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
            color: var(--bdColor);
            font-size: rem(36px);
        }
        .icon_icon_default,
        .icon_icon_pressed {
            margin-left: rem(10px);
            color: var(--bdColor);
            font-size: rem(36px);
        }
    }
    .loginBtn {
        width: 100%;
        height: rem(100px);
        margin-top: rem(90px);
        color: var(--color);
        font-size: rem(30px);
        line-height: rem(80px);
        background: var(--bgColor);
        border-color: var(--bdColor);
        border-radius: rem(4px);
        &.light {
            margin-top: rem(40px);
            color: var(--primary);
            background: none;
        }
    }
}
.tools {
    font-size: rem(26px);
    // margin-top: rem(50px);
    text-align: center;
    .line {
        margin: 0 1em;
        color: var(--mutedColor);
    }
}
.otherLogin {
    margin-top: rem(30px);
    text-align: center;
    .empty {
        display: inline-block;
        width: rem(50px);
        height: rem(30px);
        vertical-align: middle;
    }
}
.footer {
    position: absolute;
    bottom: 20px;
    left: 0;
    width: 100%;
    text-align: center;
    .icon_icon_service {
        font-size: 1.2em;
        vertical-align: middle;
    }
}
.toolBtns {
    margin-top: rem(30px);
    text-align: center;
    .btn {
        @include active();
        color: var(--color);
    }
}

</style>

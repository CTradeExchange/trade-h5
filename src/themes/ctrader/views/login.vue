<template>
    <div class='pageWrap'>
        <Top back :menu='false' />
        <a class='icon_icon_close_big' href='javascript:;' @click='$router.back()'></a>
        <header class='header'>
            <h1 class='pageTitle'>
                {{ loginType==='password'? '账号密码登录':'验证码快捷登录' }}
            </h1>
            <LanguageDiv />
        </header>
        <div class='loginAccount'>
            <a class='item' :class="{ 'active':loginAccount==='mobile' }" href='javascript:;' @click="loginAccount='mobile'">
                手机号
            </a>
            <span class='line'></span>
            <a class='item' :class="{ 'active':loginAccount==='email' }" href='javascript:;' @click="loginAccount='email'">
                邮箱
            </a>
        </div>
        <form class='loginForm'>
            <div v-if="loginAccount==='mobile'" class='field'>
                <areaInput v-model='account' v-model:zone='zone' clear placeholder='请输入手机号' />
            </div>
            <div v-else class='field'>
                <InputComp v-model='email' clear label='邮箱' />
            </div>
            <div v-if="loginType==='password'" class='field'>
                <InputComp v-model='pwd' v-model:zone='zone' clear label='密码' pwd />
            </div>
            <div v-else class='field'>
                <CheckCode v-model='checkCode' clear label='验证码' />
            </div>
            <div class='field toolWrap'>
                <van-checkbox v-model='savePwd' shape='square'>
                    保存密码
                </van-checkbox>
                <div class='tools'>
                    <router-link class='link' to='/register'>
                        我要注册
                    </router-link>
                    <i class='line'>
                        |
                    </i>
                    <router-link class='link' to='/forgot'>
                        忘记密码
                    </router-link>
                </div>
            </div>
            <van-button block class='loginBtn' type='primary' @click="$router.replace('/')">
                登录
            </van-button>
            <van-button block class='loginBtn light' @click='changeLoginType'>
                {{ loginType==='password'? '验证码快捷登录':'账号密码登录' }}
            </van-button>
        </form>
        <div class='otherLogin'>
            <LoginByGoogle />
            <span class='empty'></span>
            <LoginByFacebook />
        </div>
        <footer class='footer'>
            <a class='link' href='javascript:;'>
                <i class='icon_icon_service'></i>
                在线客服
            </a>
        </footer>
    </div>
</template>

<script>
import LanguageDiv from '@ct/modules/languageDiv'
import areaInput from '@ct/components/form/areaInput'
import InputComp from '@ct/components/form/input'
import CheckCode from '@ct/components/form/checkCode'
import LoginByGoogle from '@ct/components/loginByGoogle/loginByGoogle'
import LoginByFacebook from '@ct/components/loginByFacebook/loginByFacebook'
import Top from '@ct/layout/top'
export default {
    components: {
        LanguageDiv,
        InputComp,
        areaInput,
        LoginByGoogle,
        LoginByFacebook,
        CheckCode,
        Top,
    },
    data () {
        return {
            pwdVisible: false,
            zone: 86,
            account: '',
            pwd: '',
            checkCode: '',
            savePwd: true,
            loginType: 'password',
            loginAccount: 'mobile',
        }
    },
    methods: {
        changeLoginType () {
            const loginType = this.loginType
            this.loginType = loginType === 'password' ? 'checkCode' : 'password'
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
.loginAccount {
    display: flex;
    align-items: center;
    margin: rem(0) rem(30px);
    .line {
        display: inline-block;
        width: 1px;
        height: 0.9em;
        margin: 0 1em;
        vertical-align: middle;
        background: var(--bdColor);
    }
    .item {
        color: inherit;
        &.active {
            color: var(--primary);
        }
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
        height: rem(80px);
        margin-top: rem(90px);
        font-size: rem(30px);
        line-height: rem(80px);
        background: var(--primary);
        border-color: var(--primary);
        border-radius: rem(40px);
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

</style>

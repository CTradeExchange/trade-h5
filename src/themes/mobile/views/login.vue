<template>
    <div class='pageWrap'>
        <top back :menu='false' />
        <a class='icon_icon_close_big' href='javascript:;' @click='$router.back()'></a>
        <header class='header'>
            <h1 class='pageTitle'>登录</h1>
            <languageDiv />
        </header>
        <form class='loginForm'>
            <div class='field of-1px of-1px-bottom'>
                <input id='account' v-model.trim='account' class='input' required type='text' />
                <label for='account'>请输入登录账号</label>
                <a v-show='account.length' class='van-icon van-icon-clear' href='javascript:;' @click="account=''"></a>
            </div>
            <div class='field of-1px of-1px-bottom'>
                <input id='pwd' v-model.trim='pwd' class='input' required :type='pwdVisible ? "text" : "password"' />
                <label for='pwd'>密码</label>
                <a v-show='pwd.length' class='van-icon van-icon-clear' href='javascript:;' @click="pwd=''"></a>
                <a :class='[pwdVisible?"icon_icon_pressed":"icon_icon_default"]' href='javascript:;' @click='pwdVisible=!pwdVisible'></a>
            </div>
            <div class='field'>
                <van-checkbox v-model='savePwd' shape='square'>保存密码</van-checkbox>
            </div>
            <van-button block class='loginBtn' type='primary'>登录</van-button>
        </form>
        <!-- <div class='tools'>
            <a class='link' href='javascript:;'>我要注册</a>
            <i class='line'>|</i>
            <a class='link' href='javascript:;'>忘记密码</a>
        </div> -->
        <!-- <footer class='footer'>
            <a class='link' href='javascript:;'>
                <i class='icon_icon_service'></i>
                在线客服
            </a>
        </footer> -->
    </div>
</template>

<script>
import languageDiv from '@m/modules/languageDiv'
import top from '@m/layout/top'
export default {
    components: {
        languageDiv,
        top,
    },
    data () {
        return {
            pwdVisible: false,
            account: '',
            pwd: '',
            savePwd: true,
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.pageWrap{
    position: relative;
    height: 100%;
    .header{
        margin: rem(40px) rem(30px);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .pageTitle{
        font-size: rem(50px);
        font-weight: normal;
    }

}
.icon_icon_close_big{
    position: absolute;
    left: rem(30px);
    top: rem(30px);
    font-size: rem(34px);
    color: var(--color);
}
.loginForm{
    margin: rem(40px) rem(30px);
    .field{
        position: relative;
        display: flex;
        align-items: center;
        &:not(:first-of-type){
            margin-top: rem(50px);
        }
        label{
            position: absolute;
            left: 0;
            top: 0;
            height: rem(75px);
            line-height: rem(75px);
            color: var(--placeholder);
            font-size: rem(30px);
            transition: all cubic-bezier(.4,0,.2,1) .15s;
            &.active{
                transform: scale(.8) translateY(-90%);
            }
        }
        .input{
            display: block;
            flex: 1;
            height: rem(75px);
            line-height: 1;
            font-size: rem(30px);
            &:focus ~ label,
            &:valid ~ label{
                transform-origin: bottom left;
                transform: scale(.8) translateY(-90%);
            }
        }
        .van-icon-clear{
            color: var(--bdColor);
            font-size: rem(36px);
        }
        .icon_icon_default, .icon_icon_pressed{
            margin-left: rem(10px);
            color: var(--bdColor);
            font-size: rem(36px);
        }
    }
    .loginBtn{
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        margin-top: rem(90px);
        height: rem(80px);
        line-height: rem(80px);
        background: var(--primary);
        border-color: var(--primary);
        font-size: rem(34px);
    }
}
.tools{
    margin-top: rem(50px);
    text-align: center;
    font-size: rem(26px);
    .line{
        color: var(--mutedColor);
        margin: 0 1em;
    }
}
.footer{
    position: absolute;
    bottom: 20px;
    left: 0;
    width: 100%;
    text-align: center;
    .icon_icon_service{
        font-size: 1.2em;
        vertical-align: middle;
    }
}

</style>

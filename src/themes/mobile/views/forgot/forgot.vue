<template>
    <div class='pageWrap'>
        <top back :menu='false' />
        <a class='icon_icon_close_big' href='javascript:;' @click='$router.back()'></a>
        <header class='header'>
            <h1 class='pageTitle'>找回密码</h1>
        </header>
        <van-tabs
            v-model:active='loginType'
            background='#F2F2F2'
            class='loginTypeWrapper'
            :color='$store.state.style.primary'
            title-active-color='#fff'
            title-inactive-color='#333'
            type='card'
        >
            <van-tab name='mobile' title='手机号' />
            <van-tab name='email' title='邮箱' />
        </van-tabs>
        <form class='loginForm'>
            <div class='field'>
                <mobileInput v-model='mobile' v-model:zone='zone' placeholder='手机号' />
            </div>
            <div class='field'>
                <checkCode v-model='checkCode' />
            </div>
            <van-button block class='loginBtn' type='primary' @click="$router.replace('/')">下一步</van-button>
        </form>
    </div>
</template>

<script>
import top from '@m/layout/top'
import mobileInput from '@m/components/form/mobileInput'
import checkCode from '@m/components/form/checkCode'
export default {
    components: {
        mobileInput,
        checkCode,
        top,
    },
    data () {
        return {
            pwdVisible: false,
            zone: 86,
            mobile: '',
            checkCode: '',
            account: '',
            pwd: '',
            savePwd: true,
            loginType: 'mobile',
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
.loginTypeWrapper{
    margin: rem(74px) auto rem(50px);
    width: rem(580px);
    :deep(.van-tabs__nav,.van-tabs__wrap){
        height: rem(60px);
        line-height: rem(60px);
        border: 0;
        border-radius: rem(60px);
        overflow: hidden;
    }
    :deep(.van-tab){
        height: rem(60px);
        line-height: rem(60px);
        font-size: rem(28px);
    }
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
        &.toolWrap{
            justify-content: space-between;
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
    // margin-top: rem(50px);
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

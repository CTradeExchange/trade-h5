<template>
    <div class='pageWrap'>
        <top back :menu='false' />
        <a class='icon_icon_close_big' href='javascript:;' @click='$router.back()'></a>
        <header class='header'>
            <h1 class='pageTitle'>
                找回密码
            </h1>
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
                <areaInput v-model='mobile' v-model:zone='zone' placeholder='手机号' />
            </div>
            <div class='field'>
                <checkCode v-model='checkCode' />
            </div>
            <van-button block class='loginBtn' type='primary' @click="$router.replace('/')">
                下一步
            </van-button>
        </form>
    </div>
</template>

<script>
import top from '@ct/layout/top'
import areaInput from '@ct/components/form/areaInput'
import checkCode from '@ct/components/form/checkCode'
export default {
    components: {
        areaInput,
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
        margin-bottom: rem(10px);
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
.loginTypeWrapper {
    width: rem(580px);
    margin: rem(74px) auto rem(50px);
    :deep(.van-tabs__nav,.van-tabs__wrap) {
        height: rem(60px);
        overflow: hidden;
        line-height: rem(60px);
        border: 0;
        border-radius: rem(60px);
    }
    :deep(.van-tab) {
        height: rem(60px);
        font-size: rem(28px);
        line-height: rem(60px);
    }
}
.loginForm {
    margin: rem(40px) rem(30px);
    .field {
        position: relative;
        display: flex;
        align-items: center;
        &:not(:first-of-type) {
            margin-top: rem(50px);
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
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: rem(80px);
        margin-top: rem(90px);
        font-size: rem(34px);
        line-height: rem(80px);
        background: var(--primary);
        border-color: var(--primary);
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

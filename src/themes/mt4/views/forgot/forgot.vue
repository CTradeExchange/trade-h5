<template>
    <div class='pageWrap'>
        <top back :menu='false' />
        <a class='icon_icon_close_big' href='javascript:;' @click='$router.back()'></a>
        <header class='header'>
            <h1 class='pageTitle'>
                找回密码
            </h1>
        </header>
        <van-tabs v-model:active='active' type='line' @click='handleTabChange'>
            <van-tab title='手机找回'>
                <form class='loginForm'>
                    <div class='field'>
                        <MobileInput v-model='mobile' v-model:zone='zone' clear placeholder='请输入手机号' />
                    </div>
                    <div class='field'>
                        <checkCode v-model='checkCode' placeholder='请输入验证码' :tips='tips' />
                    </div>
                </form>
            </van-tab>
            <van-tab title='邮箱找回'>
                <form class='loginForm'>
                    <div class='field'>
                        <u-input v-model='email' placeholder='请输入邮箱' />
                    </div>
                    <div class='field'>
                        <checkCode v-model='emailCode' :label='请输入验证码' placeholder='请输入验证码' />
                    </div>
                </form>
            </van-tab>
        </van-tabs>
        <van-button block class='loginBtn' type='primary' @click='next'>
            <span>下一步</span>
        </van-button>
    </div>
</template>

<script>
import top from '@/components/top'
import {
    reactive, toRefs
} from 'vue'
import MobileInput from '@m/components/form/mobileInput'
import checkCode from '@m/components/form/checkCode'
import { Toast } from 'vant'
import { useRouter } from 'vue-router'
import uInput from '@/themes/mt4/components/form/input.vue'
import Schema from 'async-validator'
import Rule from './rule'
import { useStore } from 'vuex'

export default {
    components: {
        top,
        MobileInput,
        checkCode,
        uInput
    },
    setup (props) {
        const store = useStore()
        const router = useRouter()
        const state = reactive({
            mobile: '',
            checkCode: '',
            email: '',
            emailCode: '',
            zone: '+86',
            curTab: 0,
            tips: {
                flag: true,
                msg: ''
            }
        })

        const handleTabChange = (name, title) => {
            state.curTab = name
        }

        const next = () => {
            const params = {
                mobile: state.mobile,
                email: state.email,
                checkCode: state.checkCode,
                emailCode: state.emailCode,
                type: state.curTab
            }
            const validator = new Schema(Rule)
            validator.validate(params, (errors, fields) => {
                console.log(errors, fields)
                debugger
                if (errors) {
                    return Toast(errors[0].message)
                }
                router.push('/resetPwd')
            })
        }
        // 获取国家验区号
        store.dispatch('getListByParentCode')
        return {
            ...toRefs(state),
            next,
            handleTabChange
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
}
.loginBtn {
    position: fixed;
    bottom: 0;
    background: var(--bdColor);
    border-color: var(--bdColor);
    span {
        color: var(--color);
        font-size: rem(34px);
    }
}

</style>

<style>
.pageWrap .van-tabs__line {
    background-color: #333;
}
</style>

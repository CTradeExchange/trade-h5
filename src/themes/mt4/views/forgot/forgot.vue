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
                        <mobileInput v-model='mobile' v-model:zone='zone' placeholder='请输入手机号' @input='inputMobile' />
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
import mobileInput from '@m/components/form/mobileInput'
import checkCode from '@m/components/form/checkCode'
import { Toast } from 'vant'
import { useRouter } from 'vue-router'
import uInput from '@/themes/mt4/components/form/input.vue'

export default {
    components: {
        top,
        mobileInput,
        checkCode,
        uInput
    },
    setup (props) {
        const router = useRouter()
        const state = reactive({
            mobile: '',
            checkCode: '',
            email: '',
            emailCode: '',
            zone: 86,
            curTab: 0,
            tips: {
                flag: true,
                msg: ''
            }
        })

        // 手机正则校验
        const mobileReg = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/

        // 邮箱正则校验
        const emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

        const handleTabChange = (name, title) => {
            state.curTab = name
        }

        const inputMobile = (val) => {
            console.log(val)
            if (Number(state.curTab) === 0) {
                if (!state.mobile) {
                    state.tips = {
                        flag: false,
                        msg: '请输入手机号'
                    }
                }
                if (!mobileReg.test(state.mobile)) {
                    state.tips = {
                        flag: false,
                        msg: '手机号输入错误，请重新输入'
                    }
                }
            } else {
                if (!state.email) {
                    state.tips = {
                        flag: false,
                        msg: '请输入邮箱'
                    }
                }
                if (!emailReg.test(state.email)) {
                    state.tips = {
                        flag: false,
                        msg: '邮箱格式输入错误，请重新输入'
                    }
                }
            }
        }

        const next = () => {
            console.log(state)
            if (Number(state.curTab) === 0) {
                if (!state.mobile) {
                    return Toast('请输入手机号')
                }
                if (!mobileReg.test(state.mobile)) {
                    return Toast('手机号输入错误，请重新输入')
                }
                if (!state.checkCode) {
                    return Toast('请输入验证码')
                }
            } else {
                if (!state.email) {
                    return Toast('请输入邮箱')
                }
                if (!emailReg.test(state.email)) {
                    return Toast('邮箱格式输入错误，请重新输入')
                }
                if (!state.emailCode) {
                    return Toast('请输入验证码')
                }
            }

            router.push('/resetPwd')
        }
        return {
            ...toRefs(state),
            next,
            handleTabChange,
            inputMobile
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

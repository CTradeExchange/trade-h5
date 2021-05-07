<template>
    <div class='pageWrap'>
        <Top back left-icon='arrow-left' :menu='false' :right-action='false' :show-center='false'>
            <template #right>
            </template>
            <template #center>
            </template>
        </Top>

        <a class='icon_icon_close_big' href='javascript:;' @click='$router.back()'></a>
        <header class='header'>
            <h1 class='pageTitle'>
                找回密码
            </h1>
        </header>
        <div class='tabs-wrap'>
            <van-tabs
                v-model:active='active'
                :color='style.color'
                line-height='2px'
                line-width='20px'
                :title-active-color='style.color'
                :title-inactive-color='style.mutedColor'
                type='line'
                @click='handleTabChange'
            >
                <van-tab title='手机找回' />
                <van-tab title='邮箱找回' />
            </van-tabs>
        </div>
        <div class='tabs-content'>
            <form v-show='curTab === 0' class='loginForm'>
                <div class='field'>
                    <MobileInput v-model='mobile' v-model:zone='zone' clear placeholder='请输入手机号' />
                </div>
                <div class='field'>
                    <checkCode v-model='checkCode' label='请输入验证码' @verifyCodeSend='handleVerifyCodeSend' />
                </div>
            </form>

            <form v-show='curTab === 1' class='loginForm'>
                <div class='field'>
                    <u-input v-model='email' clear label='请输入邮箱' />
                </div>
                <div class='field'>
                    <checkCode v-model='emailCode' label='请输入验证码' @verifyCodeSend='handleVerifyCodeSend' />
                </div>
            </form>
        </div>
        <van-button block class='next-btn' type='primary' @click='next'>
            <span>下一步</span>
        </van-button>
    </div>
</template>

<script>
import Top from '@/components/top'
import {
    reactive, toRefs, computed
} from 'vue'
import MobileInput from '@m/components/form/mobileInput'
import checkCode from '@m/components/form/checkCode'
import { Toast } from 'vant'
import { useRouter } from 'vue-router'
import uInput from '@/components/input.vue'
import Schema from 'async-validator'
import Rule from './rule'
import { useStore } from 'vuex'
import { verifyCodeSend, verifyCodeCheck } from '@/api/base'

export default {
    components: {
        Top,
        MobileInput,
        checkCode,
        uInput
    },
    setup (props) {
        const style = computed(() => store.state.style)
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
            },
            sendToken: ''
        })

        const handleTabChange = (name, title) => {
            state.curTab = name
        }

        // 发送验证码
        const handleVerifyCodeSend = (callback) => {
            const params = {
                bizType: state.curTab === 0 ? 'SMS_PASSWORD_VERIFICATION_CODE' : 'EMAIL_PASSWORD_VERIFICATION_CODE',
                toUser: state.curTab === 0 ? state.zone + ' ' + state.mobile : state.email,
            }

            const validator = new Schema(Rule)
            validator.validate({
                type: state.curTab,
                mobile: state.mobile,
                email: state.email,
            }, (errors, fields) => {
                console.log(errors, fields)
                if (errors) {
                    return Toast(errors[0].message)
                }
                console.log(params)
                verifyCodeSend(params).then(res => {
                    if (res.check()) {
                        if (res.code === '0') {
                            state.sendToken = res.data.token
                            Toast('验证码发送成功，请注意查收!')
                            callback && callback()
                        }
                    }
                })
            })
        }

        const next = () => {
            const params = {
                mobile: state.mobile,
                email: state.email,
                checkCode: state.checkCode,
                emailCode: state.emailCode,
                type: state.curTab,
                needCheckCode: true
            }
            const validator = new Schema(Rule)
            validator.validate(params, (errors, fields) => {
                console.log(errors, fields)
                if (errors) {
                    return Toast(errors[0].message)
                }
                verifyCodeCheck({
                    bizType: state.curTab === 0 ? 'SMS_PASSWORD_VERIFICATION_CODE' : 'EMAIL_PASSWORD_VERIFICATION_CODE',
                    toUser: state.curTab === 0 ? state.zone + ' ' + state.mobile : state.email,
                    sendToken: state.sendToken,
                    code: state.curTab === 0 ? state.checkCode : state.emailCode
                }).then(res => {
                    if (res.ok) {
                        router.push({
                            path: '/resetPwd',
                            query: {
                                verifyCodeToken: res.data.token,
                                sendToken: state.sendToken,
                                type: state.curTab === 0 ? 2 : 1,
                                loginName: state.curTab === 0 ? state.mobile : state.email,
                                verifyCode: state.curTab === 0 ? state.checkCode : state.emailCode,
                            }
                        })
                    } else {
                        Toast(res.msg)
                    }
                })
            })
        }
        // 获取国家验区号
        store.dispatch('getListByParentCode')
        return {
            ...toRefs(state),
            next,
            handleTabChange,
            handleVerifyCodeSend,
            style
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
        margin-bottom: rem(10px);
        font-weight: normal;
        font-size: rem(50px);
    }
    .tabs-wrap {
        width: 40%;
        margin: rem(60px) auto 0;
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
            margin-top: rem(30px);
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
.next-btn {
    position: absolute;
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

<template>
    <div class='pageWrap'>
        <Top :back='true' :menu='false' />
        <Loading :show='loading' />
        <form class='form'>
            <div class='field'>
                <!-- <label class='label'>
                    请输入手机号
                </label> -->
                <u-input v-model='email' clear label='请输入邮箱' />
            </div>
            <div class='field'>
                <!-- <label class='label'>
                    验证码
                </label> -->
                <CheckCode v-model='checkCode' clear label='验证码' @verifyCodeSend='handleVerifyCodeSend' />
            </div>
            <van-button block class='confirm-btn' type='primary' @click='handleConfirm'>
                <span>确定</span>
            </van-button>
        </form>
    </div>
</template>

<script>
import Top from '@m/layout/top'
import CheckCode from '@m/components/form/checkCode'
import uInput from '@/components/input.vue'
import { Toast } from 'vant'
import { reactive, toRefs } from 'vue'
import { isEmpty, emailReg } from '@/utils/util'
import { verifyCodeSend } from '@/api/base'
import { bindEmail } from '@/api/user'
import { useRouter } from 'vue-router'
export default {
    components: {
        Top,
        uInput,
        CheckCode
    },
    setup (props) {
        const router = useRouter()
        const state = reactive({
            email: '',
            sendToken: '',
            checkCode: '',
            loading: false
        })
        const handleConfirm = () => {
            if (isEmpty(state.email)) {
                return Toast('请输入邮箱')
            }
            if (!emailReg.test(state.email)) {
                return Toast('请输入正确的邮箱')
            }
            if (isEmpty(state.checkCode)) {
                return Toast('请输入验证码')
            }
            const params = {
                email: state.email,
                verifyCode: state.checkCode,
                sendToken: state.sendToken
            }
            state.loading = true
            bindEmail(params).then(res => {
                state.loading = false
                if (res.check()) {
                    Toast('绑定邮箱成功')
                    setTimeout(() => {
                        router.push('/setting')
                    }, 1500)
                }
            }).catch(err => {
                state.loading = false
            })
        }

        // 发送验证码
        const handleVerifyCodeSend = (callback) => {
            if (isEmpty(state.email)) {
                return Toast('请输入邮箱')
            }
            if (!emailReg.test(state.email)) {
                return Toast('请输入正确的邮箱')
            }
            const params = {
                bizType: 'EMAIL_COMMON_VERIFICATION_CODE',
                toUser: state.email,
            }

            verifyCodeSend(params).then(res => {
                if (res.check()) {
                    if (res.code === '0') {
                        state.sendToken = res.data.token
                        Toast('验证码发送成功，请注意查收!')
                        callback && callback()
                    }
                }
            })
        }

        return {
            handleConfirm,
            handleVerifyCodeSend,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.pageWrap {
    position: relative;
    .form {
        margin-top: rem(30px);
        .field {
            padding: 0 rem(30px);
            .label {
                color: var(--assistColor);
            }
        }
        .confirm-btn {
            position: absolute;
            bottom: 0;
            background: var(--bdColor);
            border-color: var(--bdColor);
            span {
                color: var(--color);
                font-size: rem(34px);
            }
        }
    }
}
</style>

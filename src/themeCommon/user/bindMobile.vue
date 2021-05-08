<template>
    <div class='pageWrap'>
        <Top :back='true' :menu='false' />
        <Loading :show='loading' />
        <form class='form'>
            <div class='field'>
                <!-- <label class='label'>
                    请输入手机号
                </label> -->
                <MobileInput v-model='mobile' v-model:zone='zone' clear placeholder='请输入手机号' />
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
import MobileInput from '@m/components/form/mobileInput'
import CheckCode from '@m/components/form/checkCode'
import { toRefs, reactive } from 'vue'
import { isEmpty, mobileReg, emailReg } from '@/utils/util'
import { Toast } from 'vant'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { verifyCodeSend } from '@/api/base'
import { bindPhone } from '@/api/user'
import { useStore } from 'vuex'
export default {
    components: {
        Top,
        MobileInput,
        CheckCode
    },
    setup (props) {
        const store = useStore()
        const router = useRouter()
        const state = reactive({
            zone: '+86',
            sendToken: '',
            mobile: '',
            checkCode: '',
            loading: false
        })
        store.dispatch('getListByParentCode')

        // 发送验证码
        const handleVerifyCodeSend = (callback) => {
            if (isEmpty(state.mobile)) {
                return Toast('请输入手机号')
            }

            if (state.zone === '+86' && !mobileReg.test(state.mobile)) {
                return Toast('请输入正确的手机号')
            }
            const params = {
                bizType: 'SMS_COMMON_VERIFICATION_CODE',
                toUser: state.zone + ' ' + state.mobile
            }

            verifyCodeSend(params).then(res => {
                if (res.check()) {
                    if (Number(res.code) === 0) {
                        state.sendToken = res.data.token
                        Toast('验证码发送成功，请注意查收!')
                        callback && callback()
                    }
                }
            })
        }

        const handleConfirm = () => {
            if (isEmpty(state.mobile)) {
                return Toast('请输入手机号')
            }
            if (state.zone === '+86' && !mobileReg.test(state.mobile)) {
                return Toast('请输入正确的手机号')
            }
            if (isEmpty(state.checkCode)) {
                return Toast('请输入验证码')
            }
            state.loading = true
            const params = {
                phone: state.mobile,
                phoneArea: state.zone,
                verifyCode: state.checkCode,
                sendToken: state.sendToken
            }
            bindPhone(params).then(res => {
                state.loading = false
                if (res.check()) {
                    Toast('绑定手机成功')
                    store.dispatch('_user/findCustomerInfo')
                    setTimeout(() => {
                        router.push('/setting')
                    }, 1500)
                }
            }).catch(err => {
                state.loading = false
            })
        }

        return {
            handleVerifyCodeSend,
            handleConfirm,
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

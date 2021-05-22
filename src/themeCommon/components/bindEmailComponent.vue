<template>
    <div class='pageWrap'>
        <LayoutTop :back='true' :menu='false' />
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
import CheckCode from '@/components/form/checkCode'
import uInput from '@/components/input.vue'
import { Toast, Dialog } from 'vant'
import { reactive, toRefs, computed } from 'vue'
import { isEmpty, emailReg } from '@/utils/util'
import { verifyCodeSend } from '@/api/base'
import { bindEmail, changeEmail, checkCustomerExist } from '@/api/user'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
export default {
    components: {
        uInput,
        CheckCode
    },
    props: {
        type: {
            type: String
        }

    },
    setup (props) {
        const store = useStore()
        const router = useRouter()
        const state = reactive({
            email: '',
            sendToken: '',
            checkCode: '',
            loading: false
        })

        const onlineServices = computed(() => store.state._base.wpCompanyInfo?.onlineService)

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

            if (props.type === 'bind') {
                bindEmail(params).then(res => {
                    state.loading = false
                    if (res.check()) {
                        Toast('绑定邮箱成功')
                        store.dispatch('_user/findCustomerInfo')
                        setTimeout(() => {
                            router.replace('/setting')
                        }, 1500)
                    }
                }).catch(err => {
                    state.loading = false
                })
            } else if (props.type === 'change') {
                changeEmail(params).then(res => {
                    state.loading = false
                    if (res.check()) {
                        Toast('更换邮箱成功')
                        store.dispatch('_user/findCustomerInfo')
                        setTimeout(() => {
                            router.replace('/setting')
                        }, 1500)
                    }
                }).catch(err => {
                    state.loading = false
                })
            }
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
            const existParams = {
                type: 1,
                loginName: state.email
            }
            state.loading = true
            checkCustomerExist(existParams).then(res => {
                state.loading = false
                if (res.check()) {
                    if (res.data === 1) {
                        return Dialog.confirm({
                            theme: 'round-button',
                            title: '提示',
                            message: '该邮箱已被其他账号绑定，如有疑问请联系在线客服',
                            confirmButtonText: '联系客服',
                            cancelButtonText: '关闭'
                        }).then(() => {
                            if (onlineServices.value) { location.href = onlineServices.value }
                        }).catch(() => {
                            // on cancel
                        })
                    } else {
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
                }
            }).catch(err => {
                state.loading = false
                console.log(err)
            })
        }

        return {
            handleConfirm,
            onlineServices,
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

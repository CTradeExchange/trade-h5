<template>
    <div class='pageWrap'>
        <LayoutTop :back='true' :menu='false' />
        <Loading :show='loading' />
        <form class='form'>
            <div class='field'>
                <!-- <label class='label'>
                    请输入手机号
                </label> -->
                <areaInput v-model='mobile' v-model:zone='zone' clear placeholder='请输入手机号' />
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
import areaInput from '@/components/form/areaInput'
import CheckCode from '@/components/form/checkCode'
import { toRefs, reactive, computed } from 'vue'
import { isEmpty, getArrayObj } from '@/utils/util'
import { Toast, Dialog } from 'vant'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { verifyCodeSend } from '@/api/base'
import { bindPhone, changePhone, checkCustomerExist } from '@/api/user'
export default {
    components: {
        areaInput,
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
            zone: '+86',
            sendToken: '',
            mobile: '',
            checkCode: '',
            loading: false
        })
        store.dispatch('getListByParentCode')
        const onlineServices = computed(() => store.state._base.wpCompanyInfo?.onlineService)
        const zoneList = computed(() => store.state.zoneList)
        // 手机正则表达式
        const mobileReg = computed(() => getArrayObj(zoneList.value, 'code', state.zone).extend || '')

        // 发送验证码
        const handleVerifyCodeSend = (callback) => {
            if (isEmpty(state.mobile)) {
                return Toast('请输入手机号')
            }

            if (!RegExp(mobileReg.value).test(state.mobile)) {
                return Toast('请输入正确的手机号')
            }
            const params = {
                bizType: 'SMS_COMMON_VERIFICATION_CODE',
                toUser: state.zone + ' ' + state.mobile
            }

            const existParams = {
                type: 2,
                loginName: state.mobile,
                phoneArea: state.zone
            }
            checkCustomerExist(existParams).then(res => {
                if (res.check()) {
                    if (res.data === 1) {
                        return Dialog.confirm({
                            theme: 'round-button',
                            title: '提示',
                            message: '该手机号已被其他账号绑定，如有疑问请联系在线客服',
                            confirmButtonText: '联系客服',
                            cancelButtonText: '关闭'
                        }).then(() => {
                            if (onlineServices.value) location.href = onlineServices.value
                        }).catch(() => {
                            // on cancel
                        })
                    } else {
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
                }
            }).catch(err => {
                console.log(err)
            })
        }

        const handleConfirm = () => {
            if (isEmpty(state.mobile)) {
                return Toast('请输入手机号')
            }
            if (!RegExp(mobileReg.value).test(state.mobile)) {
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

            if (props.type === 'bind') {
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
            } else if (props.type === 'change') {
                changePhone(params).then(res => {
                    state.loading = false
                    if (res.check()) {
                        Toast('更换手机成功')
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

        return {
            handleVerifyCodeSend,
            handleConfirm,
            onlineServices,
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

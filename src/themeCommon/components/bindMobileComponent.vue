<template>
    <div class='pageWrap'>
        <LayoutTop :back='true' :menu='false' />
        <Loading :show='loading' />
        <form class='form'>
            <div class='field'>
                <areaInput v-model='mobile' v-model:zone='zoneText' clear :disabled='true' placeholder='请输入手机号' />
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

import areaInput from '@/components/form/areaInput'
import CheckCode from '@/components/form/checkCode'
import { toRefs, reactive, computed } from 'vue'
import { isEmpty, getArrayObj } from '@/utils/util'
import { Toast, Dialog } from 'vant'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { verifyCodeSend } from '@/api/base'
import { bindPhone, changePhone, checkUserStatus } from '@/api/user'
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
            zone: '',
            sendToken: '',
            mobile: '',
            checkCode: '',
            loading: false
        })

        store.dispatch('getCountryListByParentCode')
        const onlineServices = computed(() => store.state._base.wpCompanyInfo?.onlineService)

        const countryList = computed(() => store.state.countryList)
        const customInfo = computed(() => store.state._user.customerInfo)
        const zoneText = computed(() => {
            const countryObj = getArrayObj(countryList.value, 'code', customInfo.value.country)
            state.zone = countryObj.countryCode
            return countryObj.name + ' (' + countryObj.countryCode + ')'
        })
        // 手机正则表达式
        const mobileReg = computed(() => getArrayObj(countryList.value, 'code', customInfo.value.country).extend || '')

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
                toUser: '+' + state.zone + ' ' + state.mobile
            }

            const existParams = {
                type: 2,
                loginName: state.mobile,
                phoneArea: '+' + state.zone
            }
            checkUserStatus(existParams).then(res => {
                if (res.check()) {
                    if (Number(res.data.status) === 1) {
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
                verifyCode: state.checkCode,
                sendToken: state.sendToken,
                phoneArea: '+' + state.zone
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
            zoneText,
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

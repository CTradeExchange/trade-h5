<template>
    <div class='pageWrap'>
        <LayoutTop :back='true' :menu='false' />
        <Loading :show='loading' />
        <form class='form'>
            <div class='field'>
                <areaInput v-model='mobile' v-model:zone='zoneText' clear :disabled='true' :placeholder='type === "bind" ? $t("common.inputPhone"): $t("common.inputNewPhone")' />
            </div>
            <div class='field'>
                <!-- <label class='label'>
                    验证码
                </label> -->
                <CheckCode v-model='checkCode' clear :label='$t("login.verifyCode")' @verifyCodeSend='handleVerifyCodeSend' />
            </div>
            <van-button block class='confirm-btn' type='primary' @click='handleConfirm'>
                <span>{{ $t('common.sure') }}</span>
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
import { useI18n } from 'vue-i18n'
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
        const { t } = useI18n({ useScope: 'global' })
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
            if (countryObj) state.zone = countryObj.countryCode
            return countryObj.name + ' (' + countryObj.countryCode + ')'
        })
        // 手机正则表达式
        const mobileReg = computed(() => getArrayObj(countryList.value, 'code', customInfo.value.country).extend || '')

        // 发送验证码
        const handleVerifyCodeSend = (callback) => {
            if (isEmpty(state.mobile)) {
                callback && callback(false)
                return Toast(t('common.inputPhone'))
            }

            if (!RegExp(mobileReg.value).test(state.mobile)) {
                callback && callback(false)
                return Toast(t('common.inputRealPhone'))
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
                        callback && callback(false)
                        return Dialog.confirm({
                            title: t('common.tip'),
                            message: t('common.phoneBinded'),
                            confirmButtonText: t('common.serivce'),
                            cancelButtonText: t('common.close')
                        }).then(() => {
                            if (onlineServices.value) location.href = onlineServices.value
                        }).catch(() => {
                            // on cancel
                            callback && callback(false)
                        })
                    } else if (Number(res.data.status === -1)) {
                        callback && callback(false)
                        return Toast(t('c.userDisable'))
                    } else {
                        verifyCodeSend(params).then(res => {
                            if (res.check()) {
                                if (Number(res.code) === 0) {
                                    state.sendToken = res.data.token
                                    Toast(t('common.verifySended'))
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
                return Toast(t('common.inputPhone'))
            }
            if (!RegExp(mobileReg.value).test(state.mobile)) {
                return Toast(t('common.inputRealPhone'))
            }
            if (isEmpty(state.checkCode)) {
                return Toast(t('common.inputVerifyCode'))
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
                        Toast(t('common.phoneBindSuccess'))
                        store.dispatch('_user/findCustomerInfo')
                        setTimeout(() => {
                            router.back()
                        }, 1500)
                    }
                }).catch(err => {
                    state.loading = false
                })
            } else if (props.type === 'change') {
                changePhone(params).then(res => {
                    state.loading = false
                    if (res.check()) {
                        Toast(t('common.replacePhoneSuccess'))
                        store.dispatch('_user/findCustomerInfo')
                        setTimeout(() => {
                            router.back()
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
    padding-top: rem(100px);
    .form {
        //margin-top: rem(30px);
        .field {
            padding: 0 rem(30px);
            background: var(--contentColor);
            .label {
                color: var(--minorColor);
            }
        }
        .confirm-btn {
            position: absolute;
            bottom: 0;
            background: var(--lineColor);
            border-color: var(--lineColor);
            span {
                color: var(--color);
                font-size: rem(34px);
            }
        }
    }
}
</style>

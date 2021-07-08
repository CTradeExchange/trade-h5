<template>
    <div class='pageWrap'>
        <LayoutTop :back='true' :menu='false' />
        <Loading :show='loading' />
        <form class='form'>
            <div class='field'>
                <areaInput
                    v-model='email'
                    v-model:zone='zoneText'
                    clear
                    :disabled='true'
                    :placeholder='$t("common.inputEmail")'
                    type='email'
                />
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
import Top from '@/components/top'
import CheckCode from '@/components/form/checkCode'
import areaInput from '@/components/form/areaInput.vue'
import { Toast, Dialog } from 'vant'
import { reactive, toRefs, computed } from 'vue'
import { isEmpty, emailReg, getArrayObj } from '@/utils/util'
import { verifyCodeSend } from '@/api/base'
import { bindEmail, changeEmail, checkCustomerExist } from '@/api/user'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
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
            email: '',
            sendToken: '',
            checkCode: '',
            loading: false,
            zone: '+86',
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

        store.dispatch('getListByParentCode')

        const handleConfirm = () => {
            if (isEmpty(state.email)) {
                return Toast(t('common.inputEmail'))
            }
            if (!emailReg.test(state.email)) {
                return Toast(t('common.inputRealEmail'))
            }
            if (isEmpty(state.checkCode)) {
                return Toast(t('common.inputVerifyCode'))
            }
            const params = {
                email: state.email,
                verifyCode: state.checkCode,
                sendToken: state.sendToken,
                emailArea: state.zone
            }
            state.loading = true

            if (props.type === 'bind') {
                bindEmail(params).then(res => {
                    state.loading = false
                    if (res.check()) {
                        Toast(t('common.emailBindSuccess'))
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
                        Toast(t('common.replaceEmailSuccess'))
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
                return Toast(t('common.inputEmail'))
            }
            if (!emailReg.test(state.email)) {
                return Toast(t('common.inputRealEmail'))
            }
            const params = {
                bizType: 'EMAIL_COMMON_VERIFICATION_CODE',
                toUser: state.email,
            }
            const existParams = {
                type: 1,
                loginName: state.email,
                emailArea: state.zone
            }
            state.loading = true
            checkCustomerExist(existParams).then(res => {
                state.loading = false
                if (res.check()) {
                    if (res.data === 1) {
                        return Dialog.confirm({
                            theme: 'round-button',
                            title: t('common.tip'),
                            message: t('common.emailBinded'),
                            confirmButtonText: t('common.serivce'),
                            cancelButtonText: t('common.close')
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
                                    Toast(t('common.verifySended'))
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
    background-color: var(--contentColor);
    .form {
        //margin-top: rem(30px);
        .field {
            padding: 0 rem(30px);
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

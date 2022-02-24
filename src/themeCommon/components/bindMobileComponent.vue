<template>
    <div class='pageWrap'>
        <Top back show-center />
        <Loading :show='loading' />
        <form class='form'>
            <div class='field'>
                <areaInput v-model='mobile' v-model:zone='zoneText' clear :disabled='true' :placeholder='type === "bind" ? $t("common.inputPhone"): $t("common.inputNewPhone")' />
            </div>

            <div v-if='type === "change"' class='field'>
                <p class='title'>
                    将发送验证码到您的新手机号码
                </p>
                <CheckCode v-model='checkCode' clear :label='$t("login.verifyCode")' @verifyCodeSend='handleVerifyCodeSend' />
            </div>

            <div v-if='type === "change"' class='field'>
                <p class='title'>
                    将发送验证码到您的 {{ customInfo.phone }}
                </p>
                <CheckCode v-model='checkCodeOld' clear :label='$t("login.verifyCode")' @verifyCodeSend='handleVerifyCodeSendOld' />
            </div>
            <googleVerifyCode @getGooleVerifyCode='getGooleVerifyCode' />
            <van-button block class='confirm-btn' type='primary' @click='handleConfirm'>
                <span>{{ $t('common.sure') }}</span>
            </van-button>
        </form>
    </div>
</template>

<script>
import googleVerifyCode from '@/themeCommon/components/googleVerifyCode.vue'
import Top from '@/components/top'
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
        Top,
        areaInput,
        CheckCode,
        googleVerifyCode
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
            sendTokenOld: '',
            mobile: '',
            checkCode: '',
            checkCodeOld: '',
            loading: false,
            gooogleCode: ''
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
                toUser: state.zone + ' ' + state.mobile
            }

            const existParams = {
                type: 2,
                loginName: state.mobile,
                phoneArea: state.zone
            }
            checkUserStatus(existParams).then(res => {
                if (res.check()) {
                    if (Number(res.data.status) === 1) {
                        callback && callback(false)
                        return Dialog.confirm({
                            title: t('common.tip'),
                            message: t('common.phoneBinded'),
                            confirmButtonText: t('common.serivce'),
                            cancelButtonText: t('common.close'),
                            showConfirmButton: !!onlineServices.value
                        }).then(() => {
                            if (onlineServices.value) {
                                router.push({
                                    name: 'Otherpage',
                                    params: { type: 'page' },
                                    query: { pageTitle: t('route.onlineService'), url: encodeURIComponent(onlineServices.value) }
                                })
                            }
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

        const getGooleVerifyCode = val => {
            state.gooogleCode = val
        }

        const handleVerifyCodeSendOld = (callback) => {
            const params = {
                bizType: 'SMS_LOGINED_VERIFICATION_CODE'
            }
            verifyCodeSend(params).then(res => {
                if (res.check()) {
                    if (Number(res.code) === 0) {
                        state.sendTokenOld = res.data.token
                        Toast(t('common.verifySended'))
                        callback && callback()
                    }
                }
            })
        }

        const handleConfirm = () => {
            if (isEmpty(state.mobile)) {
                return Toast(t('common.inputPhone'))
            }
            if (!RegExp(mobileReg.value).test(state.mobile)) {
                return Toast(t('common.inputRealPhone'))
            }
            if (isEmpty(state.checkCode) || isEmpty(state.checkCodeOld)) {
                return Toast(t('common.inputVerifyCode'))
            }

            if (isEmpty(state.sendToken) || isEmpty(state.sendTokenOld)) {
                return Toast(t('common.getVerifyCode'))
            }

            state.loading = true
            const params = {
                phone: state.mobile,
                verifyCode: state.checkCode,
                sendToken: state.sendToken || '11',
                phoneArea: state.zone,
                verifyCodeOld: state.checkCodeOld,
                sendTokenOld: state.sendTokenOld,
                gooogleCode: state.gooogleCode
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
            handleVerifyCodeSendOld,
            handleConfirm,
            getGooleVerifyCode,
            onlineServices,
            zoneText,
            customInfo,
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
        padding-top: rem(20px);
        .field {
            padding: 0 rem(30px);
            margin-bottom: rem(20px);
            background: var(--contentColor);
            .label {
                color: var(--minorColor);
            }
            .title{
                color: var(--normalColor);
                padding: rem(20px) 0;
            }

        }
        .confirm-btn {
            height: rem(90px);
            position: absolute;
            bottom: 0;
            background: var(--contentColor);
            border-color: var(--lineColor);
            span {
                color: var(--color);
                font-size: rem(32px);
            }
        }
    }
}
</style>

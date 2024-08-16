<template>
    <div class='register'>
        <router-view v-if='!isMobile()' />
        <LayoutTop v-if='isMobile()' :back='true' class='topBar' @back='onBack' />
        <Loading :show='loading' />
        <div class='auth-content'>
            <!-- 授权成功 -->
            <div class='auth-success'>
                <div class='text'>
                    {{ $t('thirdRegister.tip1') }}
                </div>
                <div class='text'>
                    {{ thirdInfo.thirdSource }} {{ $t('thirdRegister.tip2') }}
                </div>
            </div>
            <div class='register-form'>
                <div class='tip'>
                    {{ $t('thirdRegister.tip3') }}
                </div>
                <div class='tip'>
                    {{ $t('thirdRegister.tip4') }}
                </div>
                <div class='tabs'>
                    <div :class="{ 'item': true, 'active': openType === 'email' }" @click="switchTab('email')">
                        {{ $t('thirdRegister.safetyEmail') }}
                    </div>
                    <div :class="{ 'item': true, 'active': openType === 'mobile' }" @click="switchTab('mobile')">
                        {{ $t('thirdRegister.safetyPhone') }}
                    </div>
                </div>
                <!-- 邮箱 -->
                <div v-show="openType === 'email'">
                    <div class='block'>
                        <div class='label'>
                            {{ $t('register.email') }}
                        </div>
                        <div class='box'>
                            <InputComp
                                v-model.trim='email'
                                clear
                                :label='$t("common.inputEmail")'
                            />
                        </div>
                    </div>
                    <div class='block'>
                        <div class='label'>
                            {{ $t('login.verifyCode') }}
                        </div>
                        <div class='box'>
                            <CheckCode
                                v-model.trim='emailCheckCode'
                                clear
                                :label='$t("common.inputVerifyCode")'
                                :loading='verifyCodeLoading'
                                @verifyCodeSend='isBind ? handleVerifyCodeSend($event) : verifyCodeSendHandler($event)'
                            />
                        </div>
                    </div>
                </div>
                <!-- 手机 -->
                <div v-show="openType === 'mobile'">
                    <div class='block'>
                        <div class='label'>
                            {{ $t('register.phoneNo') }}
                        </div>
                        <div class='box'>
                            <areaInputPc
                                v-if='isPC'
                                ref='loginNameEl'
                                v-model.trim='mobile'
                                v-model:zone='zone'
                                block
                                :country-code='countryCode'
                                :placeholder="$t('common.inputPhone')"
                                @zoneSelect='zoneSelect'
                            />
                            <areaInput
                                v-else
                                ref='zoneSelectRef'
                                v-model.trim='mobile'
                                v-model:zone='zone'
                                :account-type='0'
                                clear
                                :country-code='countryCode'
                                :placeholder='$t("common.inputPhone")'
                                :show-select='true'
                                @zoneSelect='zoneSelect'
                            />
                        </div>
                    </div>
                    <div class='block'>
                        <div class='label'>
                            {{ $t('login.verifyCode') }}
                        </div>
                        <div class='box'>
                            <CheckCode
                                v-model.trim='mobileCheckCode'
                                clear
                                :label='$t("common.inputVerifyCode")'
                                :loading='verifyCodeLoading'
                                @verifyCodeSend='isBind ? handleVerifyCodeSend($event) : verifyCodeSendHandler($event)'
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 底部按钮 -->
        <div :id="thirdInfo.thirdSource === 'telegram' ? 'telegram-Login' : 'ios-Login'" class='confirm-set' @click='onConfirm'>
            {{ $t('thirdRegister.confirmSet') }}
        </div>
    </div>
</template>

<script>
import { bindEmail, bindPhone, checkUserStatus, thirdRegist } from '@/api/user'
import { verifyCodeSend, getCountryListByParentCode } from '@/api/base'
import { reactive, toRefs, computed, getCurrentInstance, onMounted, onUnmounted, watch, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Toast, Dialog } from 'vant'
import { getDevice, getQueryVariable, sessionGet, localGetJSON, localRemove, getArrayObj, getDefaultZoneIndex, setToken, isMobile } from '@/utils/util'
import RuleFn, { checkCustomerExistRule } from './rule'
import { setQuoteService } from '@/plugins/socket/socket'
import Schema from 'async-validator'
import Top from '@/components/top'
import Loading from '@/components/loading'
import CheckCode from '@/components/form/checkCode'
import areaInput from './components/areaInput'
import areaInputPc from '@/components/form/areaInputPc'

import InputComp from '@/components/form/input'
import { firebaseAnalytics } from '@/utils/firebase'

export default {
    components: {
        Top,
        Loading,
        CheckCode,
        areaInput,
        InputComp,
        areaInputPc
    },
    setup () {
        const instance = getCurrentInstance()
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const { t, locale } = useI18n({ useScope: 'global' })
        const entrySearch = sessionGet('entrySearch')

        const customInfo = computed(() => store.state._user.customerInfo)
        const registList = computed(() => store.state._base.wpCompanyInfo?.registList)
        // 公司id
        const companyId = computed(() => store.state._base.wpCompanyInfo.companyId)
        // 国家地区列表数据
        const countryList = computed(() => store.state.countryList)
        // 默认选择的国家地区
        const defaultCountry = computed(() => {
            const countryList = store.state.countryList
            const defaultZone = store.state._base.wpCompanyInfo?.defaultZone
            const index = getDefaultZoneIndex(countryList, defaultZone?.code)
            const defaultZoneConfig = (index === -1) ? countryList[0] : countryList[index]
            return defaultZoneConfig
        })
        // 手机正则表达式
        const mobileReg = computed(() => getArrayObj(countryList.value, 'countryCode', state.countryZone).extend || '')
        // 联系客服链接
        const onlineServices = computed(() => store.state._base.wpCompanyInfo?.onlineService)

        const zoneSelectRef = ref(null)
        const state = reactive({
            // 页面加载效果
            loading: false,
            // cats返回的第三方信息
            thirdInfo: localGetJSON('thirdInfo') || {},
            zone: '',
            countryZone: '',
            countryCode: '',
            verifyCodeLoading: false,
            emailCheckCode: '',
            mobileCheckCode: '',
            mobile: '',
            openType: 'email', // mobile 手机号开户， email 邮箱开户
            email: '',
            protocol: true,
            visited: false, // 是否已点击过获取验证码
            countrySheetVisible: false,
            country: {},
            allCountry: [], // 所有国家列表
            mobileToken: '',
            emailToken: '',
            isPC: window.isPC,
            isBind: route.query?.type === 'add' && !!customInfo.value,
        })

        // 根据国家获取对应的客户组
        const getCustomerGroupIdByCountry = country => {
            if (!country || !registList.value?.length) return null
            let _resultGroup = registList.value.find(el => el.registCountry.code === country)
            if (!_resultGroup) _resultGroup = registList.value.find(el => el.registCountry.isOther)
            return _resultGroup
        }

        // 点击返回
        const onBack = () => {
            Dialog.confirm({
                title: t('tip'),
                message: t('thirdRegister.tip5'),
                confirmButtonText: t('thirdRegister.continue'),
                cancelButtonText: t('thirdRegister.back')
            }).then(() => {}).catch(() => {
                router.back()
            })
        }

        // 切换选项卡
        const switchTab = (value) => {
            state.openType = value
        }

        // 打开选择国家弹窗
        const showZoneSelect = () => {
            zoneSelectRef.value.handleVisible(true)
        }

        // 选择国家
        const zoneSelect = item => {
            if (state.isPC) {
                state.countryCode = item.nationalCode
                state.zone = item.code
                state.countryZone = item.code
            } else {
                state.countryCode = item.code
                state.zone = item.countryCode
                state.countryZone = item.countryCode
            }
        }

        // 发送验证码
        const handleVerifyCodeSend = (callback) => {
            const existParams = {
                type: state.openType === 'mobile' ? 2 : 1,
                loginName: state.openType === 'mobile' ? state.mobile : state.email,
            }
            if (state.openType === 'mobile') {
                existParams.phoneArea = String(state.zone)
            } else {
                existParams.emailArea = defaultCountry.value.countryCode
            }
            const params = {
                bizType: state.openType === 'mobile' ? 'SMS_COMMON_VERIFICATION_CODE' : 'EMAIL_COMMON_VERIFICATION_CODE',
                toUser: state.openType === 'mobile' ? state.zone + ' ' + state.mobile : state.email
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
                            if (onlineServices.value) {
                                window.open(onlineServices.value)
                            }
                        }).catch(() => {
                            callback && callback(false)
                        })
                    } else if (Number(res.data.status === -1)) {
                        callback && callback(false)
                        return Toast(t('c.userDisable'))
                    } else {
                        verifyCodeSend(params).then(res => {
                            if (res.check()) {
                                if (Number(res.code) === 0) {
                                    state.openType === 'mobile' ? state.mobileToken = res.data.token : state.emailToken = res.data.token
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

        // 发送验证码
        const verifyCodeSendHandler = (callback) => {
            state.visited = true
            const verifyParams = {
                type: state.openType === 'mobile' ? 2 : 1,
                loginName: state.openType === 'mobile' ? state.mobile : state.email,
                protocol: state.protocol,
                mobileReg: new RegExp(mobileReg.value)
            }

            if (state.openType === 'mobile') {
                verifyParams.phoneArea = String(state.zone)
            } else {
                verifyParams.emailArea = defaultCountry.value.countryCode
            }

            const validator = new Schema(checkCustomerExistRule(t))
            state.verifyCodeLoading = true
            validator.validate(verifyParams, { first: true }).then(res => {
                // 检测客户是否存在,同时获取区号
                checkUserStatus(verifyParams).then(res => {
                    if (res.check()) {
                        if (Number(res.data.status) !== 2) {
                            state.verifyCodeLoading = false
                            const msg = t(verifyParams.type === 1 ? 'common.existEmail' : 'common.existPhone')
                            callback && callback(false)
                            return Toast(msg)
                        } else {
                            // state.zone = res.data.phoneArea
                            const params = {
                                bizType: state.openType === 'mobile' ? 'SMS_REGISTER_VERIFICATION_CODE' : 'EMAIL_REGISTER_VERIFICATION_CODE',
                                toUser: state.openType === 'mobile' ? state.countryZone + ' ' + state.mobile : state.email,
                                country: state.openType === 'mobile' ? state.countryCode : defaultCountry.value.code
                            }
                            verifyCodeSend(params).then(res => {
                                state.verifyCodeLoading = false
                                if (res.check()) {
                                    state.openType === 'mobile' ? state.mobileToken = res.data.token : state.emailToken = res.data.token
                                    callback && callback()
                                } else {
                                    callback && callback(false)
                                }
                            })
                        }
                    }
                })
            }).catch(({ errors, fields }) => {
                callback && callback(false)
                state.verifyCodeLoading = false
                if (errors) {
                    Toast(errors[0].message)
                }
            })
        }

        // 点击确认按钮
        const onConfirm = () => {
            // 手机注册验证
            if (state.openType === 'mobile') {
                if (!state.mobile) {
                    return Toast(t('common.inputPhone'))
                }
                // 验证手机号是否匹配
                const reg = new RegExp(mobileReg.value)
                if (mobileReg.value && !reg.test(state.mobile)) {
                    return Toast(t('common.inputRealPhone'))
                }
                if (!state.mobileToken) {
                    return Toast(t('common.getVerifyCode'))
                }
                if (!state.mobileCheckCode) {
                    return Toast(t('common.inputVerifyCode'))
                }
            }

            // 邮箱注册验证
            if (state.openType === 'email') {
                if (!state.email) {
                    return Toast(t('common.inputEmail'))
                }
                if (!state.emailToken) {
                    return Toast(t('common.getVerifyCode'))
                }
                if (!state.emailCheckCode) {
                    return Toast(t('common.inputVerifyCode'))
                }
            }

            // 处理第三方注册
            state.isBind ? handleBindEP() : handleThirdRegist()
        }

        const handleBindEP = () => {
            state.loading = true
            const params = {}
            if (state.openType === 'email') {
                params.email = state.email
                params.sendToken = state.emailToken
                params.verifyCode = state.emailCheckCode
                params.emailArea = defaultCountry.value.countryCode
            } else {
                params.phone = state.mobile
                params.sendToken = state.mobileToken
                params.verifyCode = state.mobileCheckCode
                params.phoneArea = state.zone
            }
            const bindApi = state.openType === 'email' ? bindEmail : bindPhone
            bindApi(params).then(res => {
                state.loading = false
                if (res.check()) {
                    Toast(t('common.phoneBindSuccess'))
                    store.dispatch('_user/findCustomerInfo', false)

                    setTimeout(() => {
                        router.back()
                    }, 1500)
                }
            }).catch(err => {
                state.loading = false
            })
        }

        // 处理第三方注册
        const handleThirdRegist = () => {
            state.loading = true
            const country = state.openType === 'email' ? defaultCountry.value.code : state.countryCode
            state.customerGroupId = getCustomerGroupIdByCountry(country)?.customerGroupId
            const params = {
                companyId: companyId.value,
                userId: state.thirdInfo.userId,
                thirdSource: state.thirdInfo.thirdSource,
                customerGroupId: state.customerGroupId,
                country,
                verifyCode: state.openType === 'email' ? state.emailCheckCode : state.mobileCheckCode,
                sendToken: state.openType === 'email' ? state.emailToken : state.mobileToken,
                registerSource: getDevice(),
                utmSource: getQueryVariable('utm_source', entrySearch),
                utmMedium: getQueryVariable('utm_medium', entrySearch),
                utmCampaign: getQueryVariable('utm_campaign', entrySearch),
                utmContent: getQueryVariable('utm_content', entrySearch),
                utmTerm: getQueryVariable('utm_term', entrySearch),
            }
            if (state.openType === 'email') {
                params.email = state.email
            } else {
                params.phone = state.mobile
                params.phoneArea = state.countryZone
            }
            if (state.thirdInfo.thirdSource === 'telegram') {
                firebaseAnalytics('sign_up_summit_tg', {
                    key: 'sign_up_summit_tg',
                    value: JSON.stringify({
                        sign_up_summit_tg: 'phone',
                        phone: state.mobile
                    }),
                })
            } else if (state.thirdInfo.thirdSource === 'google') {
                firebaseAnalytics('sign_up_summit_gg', {
                    key: 'sign_up_summit_gg',
                    value: JSON.stringify({
                        sign_up_summit_gg: 'email',
                        email: state.email
                    }),
                })
            } else if (state.thirdInfo.thirdSource === 'apple') {
                const value = {}
                if (state.email) value.email = state.email
                if (state.mobile) value.phone = state.mobile
                firebaseAnalytics('sign_up_summit_ap', {
                    key: 'sign_up_summit_ap',
                    value: JSON.stringify({
                        sign_up_summit_ap: state.email ? 'email' : 'phone',
                        ...value,
                    }),
                })
            }
            thirdRegist(params).then(res => {
                state.loading = false
                if (res?.code === 'CUSTOMER_API_00010001') {
                    // 人工审核
                    router.replace({ name: 'RegisterHandler' })
                } else if (res.check()) {
                    // firebase
                    firebaseAnalytics('sign_up_success', {
                        key: 'sign_up_success',
                        value: state.thirdInfo.thirdSource === 'telegram' ? 'tg' : state.thirdInfo.thirdSource === 'google' ? 'gmail' : state.thirdInfo.thirdSource
                    }, res.data)
                    // 注册成功
                    sessionStorage.setItem('RegisterParams', JSON.stringify({ ...params, openType: 4 }))
                    sessionStorage.setItem('RegisterData', JSON.stringify(res))
                    if (res.data.token) setToken(res.data.token)

                    // 注册成功重新获取客户信息
                    store.dispatch('_user/findCustomerInfo')
                    // 重新登录清除账户信息
                    store.commit('_user/Update_accountAssets', {})
                    // 登录websocket
                    instance.appContext.config.globalProperties.$MsgSocket.login()

                    // 切换登录后的行情websocket
                    setQuoteService()

                    if (res.data.list.length > 0) {
                        // 需要KYC认证
                        sessionStorage.setItem('kycList', JSON.stringify(res.data.list))
                        router.replace(
                            {
                                name: 'RegKyc',
                                query: { levelCode: res.data.list[0].levelCode }
                            })
                    } else {
                        router.replace({ name: 'RegisterSuccess' })
                    }
                } else {
                    res.toast()
                }
            }).catch(err => {
                state.loading = false
            })
        }

        onMounted(() => {
            // 获取国家区号
            store.dispatch('getCountryListByParentCode').then(() => {
                state.countryCode = defaultCountry.value.nationalCode
                state.zone = defaultCountry.value.countryCode
                state.countryZone = defaultCountry.value.countryCode
            })
        })

        onUnmounted(() => {
            // 删除缓存数据
            localRemove('thirdInfo')
        })

        return {
            ...toRefs(state),
            onBack,
            switchTab,
            zoneSelectRef,
            showZoneSelect,
            zoneSelect,
            verifyCodeSendHandler,
            handleVerifyCodeSend,
            onConfirm,
            getDevice,
            isMobile
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.register {
    position: relative;
    display: flex;
    flex-flow: column;
    height: 100%;
    background: var(--contentColor);
    .topBar {
        height: rem(100px);
    }
}
.auth-content {
    padding: 0 rem(50px);
}

.auth-success {
	text-align: center;
	font-size: rem(30px);
	padding-top: rem(20px);
	padding-bottom: rem(40px);
    border-bottom: 1px solid var(--lineColor);
}
.register-form {
	padding-top: rem(30px);
	font-size: rem(28px);
	.tip {
		line-height: rem(40px);
	}
    .tabs {
		display: flex;
        justify-content: space-between;
        margin-top: rem(30px);
        margin-bottom: rem(30px);
		.item {
            display: inline-flex;
            cursor: pointer;
            justify-content: center;
            align-items: center;
			width: calc(50% - 15px);
			height: rem(60px);
            background-color: var(--lineColor);
		}
        .active {
            color: #fff;
            background-color: var(--primary);
        }
	}
    .block {
        margin-bottom: rem(30px);
        .label {
            margin-bottom: rem(12px);
        }
        .box {
            display: flex;
            align-items: center;
            color: var(--color);
            height: rem(80px);
            border: 1px solid var(--lineColor);
            &:deep {
                .mobileBar {
                    padding-right: rem(20px);
                    background: #fff;
                    border: none;
                    .zone {
                        width: min-content;
                    }
                    .zone-wrap{
                        width: 90px;
                        border: none;
                        border-right: solid 1px var(--lineColor);
                        height: 35px;
                        line-height: 35px;
                        .zone-text{
                            font-size: 12px;
                        }
                    }
                    .inputWrapper{
                        border: none;
                    }
                }
                .getCodeBtn {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-width: rem(160px);
                    height: rem(80px);
                    padding: rem(0px) rem(16px);
                    border-left: 1px solid var(--lineColor);
                }
            }
	    }
    }
}
.confirm-set {
    position: absolute;
    cursor: pointer;
    left: rem(50px);
    right: rem(50px);
    bottom: rem(40px);
    display: flex;
    justify-content: center;
    align-items: center;
    height: rem(90px);
    font-size: rem(30px);
    color: #fff;
    background-color: var(--primary);
    border-radius: rem(10px);
}
</style>

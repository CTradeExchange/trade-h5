<template>
    <LayoutTop :menu='false' :show-title='false' :title="$t('route.mine')" :custom-back='true' @back='back'  />
    <div class='registe-step1'>
        <div class='container'>
            <p class='pageTitle'> {{ $t('login.createAccount') }} </p>
            <van-tabs v-model:active='state.openType' class='openTypeTab'  shrink >
                    <van-tab name='email' :title="$t('register.email')" />
                    <van-tab name='mobile' :title="$t('register.phoneNo')" />
            </van-tabs>
            <div v-show="state.openType === 'mobile'" class='cell'>
                        <areaInput
                            ref='zoneSelectRef'
                            v-model.trim='state.mobile'
                            v-model:zone='state.zone'
                            :account-type='state.openAccountType'
                            clear
                            :country-code='state.countryCode'
                            :placeholder="$t('register.phoneNo')"
                            :show-select='true'
                            @zoneSelect='zoneSelect'
                        />
            </div>
            <div v-show="state.openType === 'email'" class='cell'>
                <InputComp v-model.trim='state.email' clear :label="$t('register.email')" />
            </div>
            <button class="nextBtn" @click="confirmNext">{{$t('businessKYC.next')}}</button>
            <div class="tipsBox">{{ $t('login.tipsText') }}
                <a class="hot" href="https://www.headline.net/html/headline_agreement.html?v=1" target="_blank">{{ $t('login.tipsText1') }}</a> {{ $t('login.tipsText2') }}
                <a class="hot" href="https://www.headline.net/html/headline_privacy.html?v=1" target="_blank">{{ $t('login.tipsText3') }}</a>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive ,computed,ref,onMounted,watch} from "vue";
import { useStore } from 'vuex'
import { Toast } from 'vant'
import { useI18n } from 'vue-i18n'
import Schema from 'async-validator'
import { useRouter, useRoute } from 'vue-router'

import { checkUserStatus } from '@/api/user'
import {  getArrayObj, getDefaultZoneIndex,} from '@/utils/util'
import { sessionGet, sessionSet,sessionRemove } from '@/utils/util'

import areaInput from './components/areaInput'
import InputComp from '@/components/form/input'
import RuleFn, { checkCustomerExistRule } from './rule'

const store = useStore()
const router = useRouter()
const route = useRoute()
const { t, locale } = useI18n({ useScope: 'global' })
const zoneSelectRef = ref(null)
const state = reactive({
            zone: '',
            countryZone: '86',
            countryCode: 'ISO_3166_156',
            loading: false,
            mobile: '',
            email: '',
            openType: 'email', // mobile 手机号开户， email 邮箱开户
            openAccountType: Number(route.query.openAccountType) || 0, // 开户类型 0:个人 1.企业 默认为个人
            country: {},
            defaultCountry: '', // 根据语言获取到的默认国家
        })
        const businessConfig = computed(() => store.state.businessConfig)
        const countryList = computed(() => { return state.openAccountType === 0 ? store.state.countryList : store.getters.companyCountryList })
        // 手机正则表达式
        const mobileReg = computed( () => getArrayObj(countryList.value, 'countryCode', state.countryZone) .extend || '')
        // 注册信息
        const {value:registerInfo} = computed(() => JSON.parse(sessionGet('registerInfo')))
        const inletRegister=JSON.parse(sessionGet('inletRegister'))
        // 设置默认开户类型
        if (businessConfig.value.enterpriseLogin && openAccountType) {
            state.openAccountType = openAccountType
        }
         // 初始化区号
         watch([() => store.state.countryList,() => store.state._base.wpCompanyInfo?.defaultZone],(value) => {
                if (value[0] && value[0].length) {
                    const countryList = value[0]
                    const defaultZone = value[1]
                    const index = getDefaultZoneIndex(
                        countryList,
                        defaultZone?.code
                    )
                    const defaultZoneConfig =
                        index === -1 ? countryList[0] : countryList[index]
                    if (defaultZoneConfig?.code) {
                        state.defaultCountry = defaultZoneConfig
                        state.zone = defaultZoneConfig.countryCode
                        state.countryZone = defaultZoneConfig.countryCode
                        state.countryCode = defaultZoneConfig.code
                        state.country = defaultZoneConfig
                    }
                }
            },
            { immediate: true }
        )

        const zoneSelect = (item) => {
            state.country = item
            state.countryCode = item.code // 国家code
            state.zone = item.countryCode
            state.countryZone = item.countryCode
        }
        // 下一步校验
        const confirmNext=()=>{
             // 发送验证码
             verifyCodeSendHandler()
        }

        const back=()=>{
            sessionRemove('inletRegister')
            sessionRemove('registerInfo')
            router.replace('/register')
        }

        const verifyCodeSendHandler = (callback) => {
            const verifyParams = {
                type: state.openType === 'mobile' ? 2 : 1,
                loginName: state.openType === 'mobile' ? state.mobile : state.email,
                mobileReg: new RegExp(mobileReg.value)
            }
            if (state.openType === 'mobile') {
                verifyParams.phoneArea = String(state.zone)
            } else {
                verifyParams.emailArea = String(
                    state.defaultCountry.countryCode
                )
            }
            const validator = new Schema(checkCustomerExistRule(t))
            validator.validate(verifyParams, { first: true }).then((res) => {
                    // 检测客户是否存在,同时获取区号
                    checkUserStatus(verifyParams).then((res) => {
                        if (res.check()) {
                            if (Number(res.data.status) !== 2) {
                                const msg = t(verifyParams.type === 1 ? 'common.existEmail' : 'common.existPhone')
                                callback && callback(false)
                                return Toast(msg)
                            } 
                            sessionSet('registerInfo',JSON.stringify(state))
                            router.push('/register/step2')
                        }
                    })
                }).catch(({ errors, fields }) => {
                    callback && callback(false)
                    if (errors) {
                        Toast(errors[0].message)
                    }
                })
        }



        onMounted(() => {
            if(!inletRegister){
                back()
                return
            }
            if(registerInfo){
                const { mobile, email } = registerInfo
                if (mobile) {
                    state.mobile = mobile
                    state.openType = 'mobile'
                } else if (email) {
                    state.email = email
                    state.openType = 'email'
                }
            }
            
            // 获取支持企业注册国家
            store.dispatch('getCompanyCountry')
            // 获取国家区号
            store.dispatch('getCountryListByParentCode')
        })
</script>

<style lang="scss" scoped>
@import "@/sass/mixin.scss";
.registe-step1 {
    position: relative;
    height: 100%;
    background: var(--contentColor);
    padding: 0 rem(40px);
    .topBar {
        height: rem(100px);
    }
    .container {
        .pageTitle {
            margin-top: rem(54px);
            font-size: rem(52px);
            color: var(--primaryText);
            font-family: Poppins;
            font-style: normal;
            line-height: normal;
        }
        .openTypeTab {
            margin-left: rem(-16px);
            margin-top: rem(80px);
            display: flex;
            height: rem(68px);
            justify-content: flex-start;
            --van-padding-md: 0px;
            --van-tabs-card-height: 30px;
            :deep(.van-tabs__wrap) {
                height: auto;
            }
            :deep(.van-tabs__nav--line) {
                background-color: var(--contentColor);
            }
            :deep(.van-tabs__nav){
                border: none;
            }
            :deep(.van-tabs__line) {
                border-radius: rem(4px);
                background: var(--primary);
            }
            :deep(.van-tab) {
                line-height: rem(40px);
                .van-tab__text {
                    font-size: rem(32px);
                    font-weight: 600;
                }
                &:first-of-type {
                    margin-right: rem(48px);
                }
        }
        }

        .cell {
            height: rem(114px);
            display: flex;
            justify-content: space-between;
            margin-top: rem(80px);
            border-radius: rem(10px);
            background-color: var(--contentColor);
            border: 1px solid #ADADAD;
            padding: 0 rem(32px);
            .inputWrapper {
                padding-right: 0;
            }
            :deep(input) {
                font-size: rem(28px);
            }
            .van-hairline--bottom:after {
                border-bottom: none;
            }
            div {
                flex: 1;
            }
            .zone {
                flex: none;
                width: rem(200px);
                margin-right: rem(20px);
            }
        }
        .nextBtn{
            margin-top: rem(48px);
            width: 100%;
            height: rem(108px);
            border-radius: rem(20px);
            background: var(--primary);
            color: #FFF;
            text-align: center;
            font-family: Poppins;
            font-size: rem(32px);
            font-style: normal;
            font-weight: 500;
            line-height:  rem(108px);
        }
        .tipsBox{
            margin-top: rem(24px);
            color: var(--btnTextDisabledColor);
            font-family: Poppins;
            font-size: rem(26px);
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            .hot{
                color: var(--primary);
            }
        }
    }
}


</style>


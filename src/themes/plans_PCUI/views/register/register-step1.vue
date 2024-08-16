<template>
    <div class='register'>
        <topNav class='header' />
        <div class='container'>
            <RegisterLeftCard />
            <div class='rightBox'>
                <div class='Rcontainer'>
                    <div class='back' @click='back'>
                        <el-icon size='20'>
                            <Back />
                        </el-icon>
                        <span>Back</span>
                    </div>
                    <p class='pageTitle'>
                        {{ $t('login.createAccount') }}
                    </p>
                    <van-tabs v-model:active='state.openType' class='openTypeTab' shrink>
                        <van-tab name='email' :title="$t('register.email')" />
                        <van-tab name='mobile' :title="$t('register.phoneNo')" />
                    </van-tabs>
                    <div v-show="state.openType === 'mobile'" class='cell'>
                        <areaInputPc
                            v-model.trim='state.mobile'
                            v-model:zone='state.zone'
                            clear
                            :country-code='state.countryCode'
                            :disabled='false'
                            :is-business='openAccountType === 1'
                            :placeholder="$t('common.inputPhone')"
                            type='mobile'
                            @zoneSelect='zoneSelect'
                        />
                    </div>
                    <div v-show="state.openType === 'email'" class='cell'>
                        <InputComp v-model.trim='state.email' clear :label="$t('register.email')" />
                    </div>
                    <button class='nextBtn' @click='confirmNext'>
                        {{ $t('businessKYC.next') }}
                    </button>
                    <div class='tipsBox'>
                        {{ $t('login.tipsText') }}
                        <a class='hot' href='https://www.headline.net/html/headline_agreement.html?v=1' target='_blank'>
                            {{ $t('login.tipsText1') }}
                        </a> {{ $t('login.tipsText2') }}
                        <a class='hot' href='https://www.headline.net/html/headline_privacy.html?v=1' target='_blank'>
                            {{ $t('login.tipsText3') }}
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <router-view />
    </div>
</template>

<script setup>
import { reactive, computed, ref, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { Toast } from 'vant'
import { useI18n } from 'vue-i18n'
import Schema from 'async-validator'
import { useRouter, useRoute } from 'vue-router'

import { checkUserStatus } from '@/api/user'
import { getArrayObj, getDefaultZoneIndex, sessionGet, sessionSet, sessionRemove } from '@/utils/util'

import RuleFn, { checkCustomerExistRule } from './rule'

import areaInputPc from '@/components/form/areaInputPc'
import InputComp from '@/components/form/input'
import RegisterLeftCard from './registerLeftCard'
import topNav from '@planspc/layout/topNav'

const store = useStore()
const router = useRouter()
const route = useRoute()
const { t, locale } = useI18n({ useScope: 'global' })
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
const mobileReg = computed(() => getArrayObj(countryList.value, 'countryCode', state.countryZone).extend || '')
// 注册信息
const { value: registerInfo } = computed(() => JSON.parse(sessionGet('registerInfo')))
const inletRegister = JSON.parse(sessionGet('inletRegister'))
// 设置默认开户类型
if (businessConfig.value.enterpriseLogin && openAccountType) {
    state.openAccountType = openAccountType
}
// 初始化区号
watch([() => store.state.countryList, () => store.state._base.wpCompanyInfo?.defaultZone], (value) => {
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

// 选择国家
const zoneOnSelect = (val) => {
    const country = countryList.value.find((el) => el.code === val)
    if (country) {
        state.zone = country.countryCode
        state.countryZone = country.countryCode
        state.countryCode = country.code
    }
}

const zoneSelect = (item) => {
    state.countryVal = item.countryCode
    zoneOnSelect(item.countryCode)
}
// 下一步校验
const confirmNext = () => {
    // 发送验证码
    verifyCodeSendHandler()
}

const back = () => {
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
                sessionSet('registerInfo', JSON.stringify(state))
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

// 检测是否用户直接随意复制连接进来的注册页面
const ruleCheckRoute = () => {
    if (document.referrer === '' || !registerInfo) {
        router.replace('register')
        // 通过复制打开
        console.log('This website was opened by copying the URL')
    } else {
        // 正常打开
        console.log('This website was opened normally')
    }
}

onMounted(() => {
    if (!inletRegister) {
        back()
        return
    }
    if (registerInfo) {
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
.register {
    position: relative;
    display: flex;
    flex-flow: column;
    min-height: 100%;
    height: auto;
    .container {
        flex: 1;
        display: grid;
		grid-template-columns: repeat(2, 1fr);
        .flexCenter{
            display: flex;
            flex-direction: column;
            align-items: center;
        }
       .rightBox{
            padding-left: 141px;
            background: var(--contentColor);
            .Rcontainer{
                width: 418px;
                .back{
                    padding-top: 84px;
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    span{
                        margin-left: 8px;
                        color: #666;
                        font-family: Poppins;
                        font-size: 16px;
                        font-style: normal;
                        font-weight: 400;
                        line-height: normal;
                    }

                }
                .pageTitle {
                    margin-top:44px;
                    font-size: 32px;
                    color: var(--primaryText);
                    font-family: Poppins;
                    font-style: normal;
                    line-height: normal;
                }
                .openTypeTab {
                    margin-left: -8px;
                    margin-top:32px;
                    display: flex;
                    height: 34px;
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
                        border-radius: 2px;
                        background: var(--primary);
                    }
                    :deep(.van-tab) {
                        line-height: 20px;
                        .van-tab__text {
                            font-size: 16px;
                            font-weight: 600;
                        }
                        &:first-of-type {
                            margin-right: 40px;
                        }
                }
                }

                .cell {
                    height: 57px;
                    display: flex;
                    justify-content: space-between;
                    margin-top:40px;
                    border-radius: 9px;
                    background-color: var(--contentColor);
                    border: 1px solid #ADADAD;
                    padding: 0 16px;
                    .inputWrapper {
                        padding-right: 0;
                    }
                    :deep(input) {
                        font-size: 14px;
                    }
                    .van-hairline--bottom:after {
                        border-bottom: none;
                    }
                    div {
                        flex: 1;
                        border: none;
                        background-color: var(--contentColor);
                    }
                    .zone {
                        flex: none;
                        width: 100px;
                        margin-right: 10px;
                    }
                }
                .nextBtn{
                    margin-top: 24px;
                    width: 100%;
                    height: 54px;
                    border-radius: 10px;
                    background: var(--primary);
                    color: #FFF;
                    text-align: center;
                    font-family: Poppins;
                    font-size: 16px;
                    font-style: normal;
                    font-weight: 500;
                    line-height:  54px;
                    cursor: pointer;
                }
                .tipsBox{
                    margin-top:12px;
                    color: var(--btnTextDisabledColor);
                    font-family: Poppins;
                    font-size: 13px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: normal;
                    .hot{
                        color: var(--primary);
                        text-decoration: underline;
                    }
                }

            }
        }
    }
}
</style>

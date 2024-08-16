<template>
    <LayoutTop :menu='false' :show-title='false' />
    <div class='pageWrap'>
        <p class='pageTitle'>
            {{ tabActive === 0 ? $t('login.loginByPersonal') : $t('login.loginByCorporate') }}
        </p>
        <van-tabs
            v-model:active='loginNameType'
            class='openTypeTab'
            shrink
            @change='loginNameTypeChange'
        >
            <van-tab name='email' :title='$t("register.email")' />
            <van-tab name='mobile' :title='$t("register.phoneNo")' />
        </van-tabs>

        <form class='loginForm'>
            <div v-if="loginNameType==='mobile'" class='field'>
                <areaInputMobile
                    v-model.trim='loginName'
                    v-model:zone='phoneArea'
                    clear
                    :country-code='countryCode'
                    :country-list='countryList'
                    :placeholder="$t('common.inputPhone')"
                    @onBlur='checkUserMfa'
                    @zoneSelect='zoneSelect'
                />
            </div>
            <div v-else class='field'>
                <InputComp v-model.trim='email' clear :label="$t('common.inputEmail')" @onBlur='checkUserMfa' />
            </div>
            <div v-if="loginType==='password'" class='field'>
                <InputComp v-model='pwd' clear :label="$t('login.pwd')" pwd />
            </div>
            <div v-else class='field'>
                <CheckCode v-show="loginNameType==='mobile'" v-model.trim='checkCodeMobile' clear :label="$t('login.verifyCode')" @verifyCodeSend='verifyCodeSendHandler' />
                <CheckCode v-show="loginNameType==='email'" v-model.trim='checkCodeEmail' clear :label="$t('login.verifyCode')" @verifyCodeSend='verifyCodeSendHandler' />
            </div>
            <div v-if='googleCodeVis' class='field field-google'>
                <googleVerifyCode @getGooleVerifyCode='getGooleVerifyCode' />
            </div>
            <!-- <div class='forget-bar'>
                <a class='btn' href='javascript:;' @click='changeLoginType'>
                    {{ $t(loginType === 'password' ? 'login.loginByCode' : 'login.loginByPwd') }}
                </a>
                <a class='btn' href='javascript:;' @click='goForgot'>
                    {{ $t('login.forgot') }}
                </a>
            </div> -->
            <van-button block class='loginBtn' :disabled='loading' type='primary' @click='loginHandle'>
                {{ $t('login.loginBtn') }}
            </van-button>
            <!-- <div class='toolBtns'>
                <span class='btn'>
                    {{ $t('login.goRegister') }}
                    <a href='javascript:;' @click="$router.push({ name:'Register' })">
                        {{ $t('login.register') }}
                    </a>
                </span>
            </div> -->
        </form>
        <!-- <third-login v-if='thirdLoginArr && thirdLoginArr.length > 0 && tabActive === 0' /> -->
        <div
            v-if='businessConfig.enterpriseLogin'
            class='account-type'
        >
            <div v-if='tabActive === 1' class='ac-item' @click='tabActive = 0'>
                {{ $t('login.loginByPersonal') }}&nbsp;&nbsp;>>
            </div>
            <div v-if='tabActive === 0' class='ac-item' @click='tabActive = 1'>
                {{ $t('login.loginByCorporate') }}&nbsp;&nbsp;>>
            </div>
        </div>
    </div>

    <!-- 设置登录密码 -->
    <!-- <van-popup
      v-model:show='loginPwdPop'
      :close-on-click-overlay='false'
      :style="{ 'border-radius':'8px','background-color': $style.bgColor }"
  >
      <section class='popContainer'>
          <a class='noTip' href='javascript:;' @click='noTip'>
              {{ $t('login.neverTip') }}
          </a>
          <div class='containerBox'>
              <p class='iconPwd'>
                  <span class='icon_password'></span>
              </p>
              <p class='tipContent'>
                  {{ $t('login.pwdTips') }}
              </p>
          </div>
          <div class='btnBox'>
              <button class='btn' @click='loginPwdSet'>
                  {{ $t('login.goSet') }}
              </button>
              <button class='btn muted' @click='loginPwdSetNext'>
                  {{ $t('login.nextTime') }}
              </button>
          </div>
      </section>
  </van-popup> -->
    <Loading :show='loading' />
</template>

<script>
import Schema from 'async-validator'
import Vline from '@/components/vline'
import InputComp from '@/components/form/input'
import CheckCode from '@/components/form/checkCode'
import thirdLogin from '@/themeCommon/components/thirdLogin'
import googleVerifyCode from '@/themeCommon/components/googleVerifyCode.vue'
import areaInputMobile from '@/themeCommon/user/register/components/areaInput'

import { getDevice, localGet, localSet, isEmpty, localGetJSON, getDefaultZoneIndex } from '@/utils/util'
import { computed, reactive, toRefs, getCurrentInstance, onMounted, watch } from 'vue'
import { checkUserStatus, checkGoogleMFAStatus } from '@/api/user'
import { firebaseAnalytics } from '@/utils/firebase'
import { useRoute, useRouter } from 'vue-router'
import { verifyCodeSend } from '@/api/base'
import { Toast, Dialog } from 'vant'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import RuleFn from './rule'
import md5 from 'js-md5'

export default {
    components: {
        Vline,
        areaInputMobile,
        InputComp,
        CheckCode,
        googleVerifyCode,
        thirdLogin
    },
    setup () {
        const router = useRouter()
        const route = useRoute()
        const store = useStore()

        const { t } = useI18n({ useScope: 'global' })

        const instance = getCurrentInstance()
        const businessConfig = computed(() => store.state.businessConfig)
        const state = reactive({
            loading: false,
            pwdVisible: false,
            loginPwdPop: false,
            tabActive: 0,
            loginName: '',
            email: '',
            pwd: '',
            phoneArea: '',
            formatPhoneArea: '', // 区号和国家 用于显示
            checkCodeMobile: '', // 手机号验证码
            checkCodeEmail: '', // 邮箱验证码
            loginType: 'checkCode', // checkCode
            loginNameType: 'email',
            bindAddShow: false,
            userId: '',
            googleCodeVis: false,
            googleCode: '',
            countryCode: '' // 国家编码
        })
        let token = ''
        const rightAction = computed(() => {
            return {
                title: t(state.loginType === 'password' ? 'login.loginByCode' : 'login.loginByPwd')
            }
        })

        // 国家列表
        const countryList = computed(() => {
            return state.tabActive === 1 ? store.getters.companyCountryList : store.state.countryList
        })

        // 检测客户是否开启GoogleMFA
        const checkUserMfa = (val) => {
            if (val) {
                checkGoogleMFAStatus({
                    loginName: val,
                    phoneArea: state.phoneArea,
                    type: state.loginNameType === 'email' ? 1 : 2
                }).then(res => {
                    if (res.check()) {
                        state.googleCodeVis = res.data > 0
                    }
                }).catch(err => {
                    console.log('err', err)
                })
            }
        }

        // 初始化区号
        watch([countryList, () => store.state._base.wpCompanyInfo?.defaultZone], (value) => {
            const countryList = value[0]
            const defaultZone = value[1]
            // 如果有缓存则显示缓存信息
            let index = -1
            const loginInfo = localGetJSON('loginInfo')
            if (loginInfo?.phoneArea) {
                index = countryList.findIndex(el => el.countryCode === loginInfo.phoneArea)
            }
            if (loginInfo?.accountType) {
                if (loginInfo.accountType === 1) {
                    state.email = loginInfo?.loginName || ''
                    // 当路由携带了这个说明是从改密码跳转过来的就用路由的参数
                    if (route.query.loginNameType) {
                        state.loginNameType = route.query.loginNameType
                    } else {
                        state.loginNameType = 'email'
                    }
                } else {
                    state.loginName = loginInfo?.loginName || ''
                    // 当路由携带了这个说明是从改密码跳转过来的就用路由的参数
                    if (route.query.loginNameType) {
                        state.loginNameType = route.query.loginNameType
                    } else {
                        state.loginNameType = 'mobile'
                    }
                }
            }
            if (index === -1) {
                index = getDefaultZoneIndex(countryList, defaultZone?.code)
            }
            if (countryList.length > 0) {
                const defaultZoneConfig = (index === -1) ? countryList[0] : countryList[index]
                state.phoneArea = defaultZoneConfig.countryCode
                state.formatPhoneArea = defaultZoneConfig.formatName
                state.countryCode = defaultZoneConfig.code
            }
            if (loginInfo?.loginName) {
                checkUserMfa(loginInfo?.loginName)
            }
        }, { immediate: true })

        const thirdLoginArr = computed(() => store.state._base.wpCompanyInfo?.thirdLogin || [])
        // 获取白标企业开户登录的国家区号列表
        store.dispatch('getCompanyCountry')
        // 获取国家区号
        store.dispatch('getCountryListByParentCode')

        const changeLoginType = () => {
            const loginType = state.loginType
            state.loginType = loginType === 'password' ? 'checkCode' : 'password'
        }
        const getGooleVerifyCode = val => {
            state.googleCode = val
        }

        // 切换个人登录、企业登录方式
        const tabActiveChange = (e) => {
            const hasArea = countryList.value.find(el => el.countryCode === state.phoneArea)
            if (!hasArea) {
                state.phoneArea = countryList.value[0].countryCode
            }
        }

        // 切换手机号邮箱登录方式
        const loginNameTypeChange = () => {
            state.pwd = ''
            const loginName = state.loginNameType === 'email' ? state.email : state.loginName
            if (loginName) {
                checkUserMfa(loginName)
            }
        }

        // 选择登录手机号区号
        const zoneSelect = (data) => {
            state.phoneArea = data.countryCode
            state.formatPhoneArea = data.formatName
            state.countryCode = data.code
        }

        const loginHandle = () => {
            if (state.googleCodeVis && isEmpty(state.googleCode)) {
                return Toast(t('common.inputGoogleCode'))
            }
            const verifyCode = state.loginNameType === 'email' ? state.checkCodeEmail : state.checkCodeMobile
            const loginParams = {
                type: state.loginNameType === 'email' ? 1 : 2,
                loginName: state.loginNameType === 'email' ? state.email : state.loginName,
                phoneArea: state.phoneArea,
                device: getDevice(),
                verifyCode: state.loginType === 'checkCode' ? verifyCode : undefined,
                loginPwd: state.loginType === 'password' ? md5(state.pwd) : undefined,
                sendToken: state.loginType === 'checkCode' ? token : undefined,
                thirdSource: route.query.thirdSource || '',
                bindThirdUserId: route.query.bindThirdUserId || '',
                isThird: false, // true为三方登录 false 系统登录
                googleCode: state.googleCode
            }

            const validator = new Schema(RuleFn(t))
            state.loading = true

            validator.validate(
                {
                  ...loginParams
                }, {
                  ...state,
                  first: true
                }, (errors, fields) => {
                    if (errors) {
                        state.loading = false
                        Toast(errors[0].message)
                        return
                    }
                    loginSubmit(loginParams)
                })
        }

        // 登录成功跳转
        const loginToPath = () => {
            router.push('/order')
        }

        const goForgot = () => {
            store.commit('_user/Update_loginQuery', `/login/select?loginType=${state.loginType}&loginNameType=${state.loginNameType}&data=${state.loginNameType == 'email' ? state.email : state.loginName}`)
            router.push({ path: '/forgot', query: { type: 'login', loginNameType: state.loginNameType } })
        }

        // 发送登录接
        const loginSubmit = (params) => {
            state.loading = true
            store.dispatch('_user/login', params).then(res => {
                state.loading = false
                if (res.invalid()) return false

                // firebase
                firebaseAnalytics('login_success', {
                    key: 'login_success',
                    value: state.loginNameType === 'email' ? 'email' : 'phone'
                })
                // 切换登录后的行情websocket
                // setQuoteService()

                // 登录websocket
                instance.appContext.config.globalProperties.$MsgSocket.login()
                store.commit('del_cacheViews', 'Home')
                store.commit('del_cacheViews', 'Layout')

                // 缓存注册信息
                localSet('loginInfo', JSON.stringify({
                    accountType: params.type,
                    loginName: params.loginName,
                    phoneArea: params.phoneArea || '',
                }))

                // 登录KYC,kycAuditStatus:0未认证跳,需转到认证页面,1待审核,2审核通过,3审核不通过
                // companyKycStatus 公司KYC开户状态，1开启 2未开启
                if (Number(res.data.companyKycStatus) === 1) {
                    if (Number(res.data.kycAuditStatus === 0)) {
                        return Dialog.alert({
                            title: t('common.tip'),
                            confirmButtonText: t('login.goAuthenticate'),
                            message: t('login.goAuthenticateMsg'),

                        }).then(() => {
                            router.push('/authentication')
                        })
                    } else if (Number(res.data.kycAuditStatus === 1)) {
                        return Dialog.alert({
                            title: t('common.tip'),
                            confirmButtonText: t('common.close'),
                            message: t('common.inReview'),

                        }).then(() => {
                            store.dispatch('_user/logout').then(() => {
                                return router.push('/login')
                            }).then(() => {
                                location.reload()
                            })
                        })
                    } else if (Number(res.data.kycAuditStatus === 3)) {
                        return Dialog.alert({
                            title: t('common.tip'),
                            confirmButtonText: t('common.reSubmit'),
                            message: t('common.reviewFailed') + '\n' + t('common.reviewReson') + res.data.kycAuditRemark,

                        }).then(() => {
                            router.push('/authentication')
                        })
                    } else if (Number(res.data.kycAuditStatus === 2)) {
                        noticeSetPwd(res.data.loginPassStatus)
                    }
                } else if (Number(res.data.companyKycStatus) === 2) {
                    noticeSetPwd(res.data.loginPassStatus)
                }
            })
        }

        // 设置登录密码弹窗
        const noticeSetPwd = (loginPassStatus) => {
            if (parseInt(loginPassStatus) === 1 && !localGet('loginPwdIgnore')) {
                // state.loginPwdPop = true
                // TODO: 暂时隐藏设置登录密码
                loginToPath()
            } else {
                loginToPath()
            }
        }

        // 发送验证码
        const verifyCodeSendHandler = (callback) => {
            const verifyParams = {
                type: state.loginNameType === 'email' ? 1 : 2,
                loginName: state.loginNameType === 'email' ? state.email : state.loginName
            }
            if (state.loginNameType === 'mobile') verifyParams.phoneArea = state.phoneArea

            const validator = new Schema(RuleFn(t))
            validator.validate({
              ...verifyParams
            }).then(res => {
                // 检测客户是否存在,同时获取区号
                checkUserStatus(verifyParams).then(res => {
                    if (res.check()) {
                        if (Number(res.data.status) === 2) {
                            const msg = t(verifyParams.type === 1 ? 'common.noEmail' : 'common.noPhone')
                            callback && callback(false)
                            return Toast(msg)
                        } else if (Number(res.data.status === -1)) {
                            callback && callback(false)
                            return Toast(t('c.userDisable'))
                        } else {
                            // state.zone = res.data.phoneArea
                            const params = {
                                bizType: state.loginNameType === 'email' ? 'EMAIL_LOGIN_VERIFICATION_CODE' : 'SMS_LOGIN_VERIFICATION_CODE',
                                toUser: state.loginNameType === 'email' ? state.email : String(state.phoneArea) + ' ' + state.loginName,
                            }
                            verifyCodeSend(params).then(res => {
                                if (res.check()) {
                                    // firebase
                                    firebaseAnalytics('login_code', {
                                        key: 'login_code',
                                        value: state.loginNameType === 'email' ? 'email' : 'phone'
                                    })
                                    token = res.data.token
                                    // if (res.data.code) state.checkCode = res.data.code
                                    callback && callback()
                                } else {
                                    callback && callback(false)
                                }
                            }).catch(err => {
                                callback && callback(false)
                            })
                        }
                    }
                })
            }).catch(({
                errors,
                fields
            }) => {
                callback && callback(false)
                if (errors) {
                    Toast(errors[0].message)
                }
            })
        }

        // 设置登录密码
        const loginPwdSet = () => {
            state.loginPwdPop = false
            router.push({
                name: 'SetLoginPwd'
            })
        }
        // 下次设置登录密码
        const loginPwdSetNext = () => {
            state.loginPwdPop = false
            loginToPath()
        }
        // 设置登录密码不再提醒
        const noTip = () => {
            localSet('loginPwdIgnore', true)
            state.loginPwdPop = false
            loginToPath()
        }

        onMounted(() => {
            const { data, loginNameType } = route.query
            if (loginNameType === 'email')state.email = data
            if (loginNameType === 'mobile')state.loginName = data
            // 获取支持企业注册国家
            store.dispatch('getCompanyCountry')
            // 获取国家区号
            store.dispatch('getCountryListByParentCode')
        })
        return {
          ...toRefs(state),
          changeLoginType,
          countryList,
          tabActiveChange,
          loginNameTypeChange,
          zoneSelect,
          loginHandle,
          verifyCodeSendHandler,
          loginPwdSetNext,
          loginPwdSet,
          noTip,
          loginSubmit,
          checkUserMfa,
          getGooleVerifyCode,
          thirdLoginArr,
          businessConfig,
          goForgot
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.pageWrap {
  position: relative;
  height: 100%;
  background: var(--contentColor);
  padding: 0 rem(40px);
  .logo{
      padding-left: rem(30px);
      margin-bottom: rem(10px);
      img{
          width: rem(180px);
      }
  }
  .pageTitle{
      font-family: Poppins;
      font-size: rem(52px);
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      color: var(--primaryText);
  }
  .account-type {
      display: flex;
      align-items: center;
      justify-content: center;
      height: rem(76px);
      margin: rem(60px) rem(30px) rem(60px);
      padding: 0 rem(10px);
      border-radius: rem(8px);
      border: solid 1px var(--primary);
      color: var(--primary);
      .ac-item{
          width: 100%;
          text-align: center;
      }
      .btn {
          display: flex;
          flex: 1;
          align-items: center;
          justify-content: center;
          height: rem(58px);
          color: var(--minorColor);
          font-size: rem(28px);
          background: none;
          border-radius: rem(36px);
          cursor: pointer;
          &:hover {
              color: var(--primary);
          }
      }
      .active {
          color: var(--primary);
          font-weight: bold;
          background: #FFF;
      }
  }
}
.openTypeTab {
          margin-left: rem(-30px);
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
.icon_icon_close_big {
  position: absolute;
  top: rem(30px);
  left: rem(30px);
  color: var(--color);
  font-size: rem(34px);
}
.loginForm {
  margin-top: rem(80px);
  .field {
      height: rem(114px);
      position: relative;
      display: flex;
      align-items: center;
      padding: 0 rem(20px);
      border-radius: rem(18px);
      border: 1px solid #ADADAD;
      overflow: hidden;
      &:not(:first-of-type) {
          margin-top: rem(55px);
      }
      &.toolWrap {
          justify-content: space-between;
      }
      .inputWrapper {
          padding-right: 0;
      }
      .van-hairline--bottom:after {
          border-bottom: none;
      }
      label {
          position: absolute;
          top: 0;
          left: 0;
          height: rem(75px);
          color: var(--placeholder);
          font-size: rem(30px);
          line-height: rem(75px);
          transition: all cubic-bezier(0.4, 0, 0.2, 1) 0.15s;
          &.active {
              transform: scale(0.8) translateY(-90%);
          }
      }
      .input {
          display: block;
          flex: 1;
          height: rem(75px);
          font-size: rem(30px);
          line-height: 1;
          &:focus~label,
          &:valid~label {
              transform: scale(0.8) translateY(-90%);
              transform-origin: bottom left;
          }
      }
      .van-icon-clear {
          color: var(--lineColor);
          font-size: rem(36px);
      }
      .icon_icon_default,.icon_icon_pressed {
          margin-left: rem(10px);
          color: var(--lineColor);
          font-size: rem(36px);
      }
      &.field-google {
          height: 100%;
          :deep(.form-item){
              border: none;
              margin-bottom: 0;

          }
          :deep(.van-cell){
              --van-cell-vertical-padding: 8px;
              padding-left: 0;
              &::after{
                  border-bottom: none;
              }
              input{
                  padding: 0 rem(10px);
              }
          }
      }
  }
  .forget-bar {
      text-align: right;
      margin-top: rem(22px);
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      > a {
          font-size: rem(26px);
          color: var(--primary);
      }
  }
  .loginBtn {
      margin-top: rem(48px);
      height: rem(108px);
      font-size: rem(32px);
      line-height: rem(108px);
      color: var(--contentColor);
      background: var(--primary);
      border-radius: rem(20px);
      border: none;
      &.light {
          color: var(--primary);
          background: none;
      }
  }
}
.tools {
  font-size: rem(26px);
  text-align: center;
  .line {
      margin: 0 1em;
      color: var(--minorColor);
  }
}
:deep(.three-way-login) {
  margin-top: rem(98px);
  padding: 0 rem(30px);
  .title{
      display: flex;
      align-items: center;
      text-align: center;
      color: var(--textColor);
      margin-bottom: rem(20px);
      font-size: rem(24px);
      .text{
          padding: 0 rem(30px);
      }
       &::after{
          background: #e9ebf2;
          content: "";
          flex: 1;
          height: 1px;
      }
      &::before{
          background: #e9ebf2;
          content: "";
          flex: 1;
          height: 1px;
      }

  }
  .otherLogin {
      text-align: center;
      display: flex;
      justify-content: space-evenly;
      width: rem(470px);
      margin: rem(30px) auto 0;
  }
}
.footer {
  position: absolute;
  bottom: 20px;
  left: 0;
  width: 100%;
  text-align: center;
  .icon_icon_service {
      font-size: 1.2em;
      vertical-align: middle;
  }
}
.toolBtns {
  display: flex;
  justify-content: center;
  margin-top: rem(42px);
  .btn {
      @include active();
      color: var(--minorColor);
      vertical-align: middle;
      font-size: rem(26px);
      >a{
          color: var(--primary);
      }
  }
}
.popContainer {
  position: relative;
  width: 80vw;
  background: var(--contentColor);
  border-radius: 8px;
  .kycTimeLine {
      padding: rem(60px);
  }
  .containerBox {
      padding: rem(80px) rem(60px);
  }
  .tipContent {
      font-size: rem(28px);
      line-height: 1.5;
      text-align: center;
  }
  .iconPwd {
      padding-bottom: rem(35px);
      text-align: center;
  }
  .icon_password {
      color: var(--primary);
      font-size: rem(60px);
  }
  .noTip {
      position: absolute;
      top: rem(20px);
      right: rem(20px);
      color: var(--minorColor);
  }
  .btnBox {
      position: relative;
      display: flex;
      color: var(--color);
      font-size: rem(34px);
      text-align: center;
      background: var(--bgColor);
      border-top: 1px solid var(--lineColor);
      &::after {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 1px;
          height: rem(50px);
          background: var(--lineColor);
          transform: translateY(-50%);
          content: '';
      }
      .btn {
          @include active();
          flex: 1;
          height: rem(100px);
          line-height: 1;
          background: none;
      }
  }
}
</style>

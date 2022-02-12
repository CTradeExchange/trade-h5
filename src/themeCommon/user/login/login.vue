<template>
    <div class='pageWrap'>
        <Top :right-action='rightAction' @back="$router.push('/')" @rightClick='changeLoginType' />
        <header class='header'>
            <h1 class='pageTitle'>
                {{ $t(loginType==='password'?'login.loginByPwd':'login.loginByCode') }}
            </h1>
        </header>
        <form class='loginForm'>
            <div v-if="loginAccount==='mobile'" class='field'>
                <InputComp v-model.trim='loginName' clear :label="$t('login.loginNamePlaceholder')" />
            </div>
            <div v-else class='field'>
                <InputComp v-model.trim='email' clear :label="$t('login.email')" />
            </div>
            <div v-if="loginType==='password'" class='field'>
                <InputComp v-model='pwd' clear :label="$t('login.pwd')" pwd />
            </div>
            <div v-else class='field'>
                <CheckCode v-model.trim='checkCode' clear :label="$t('login.verifyCode')" @verifyCodeSend='verifyCodeSendHandler' />
            </div>
            <van-button block class='loginBtn' :disabled='loading' type='primary' @click='loginHandle'>
                {{ $t('login.loginBtn') }}
            </van-button>
            <div class='toolBtns'>
                <a class='btn' href='javascript:;' @click="$router.push({ name:'Register' })">
                    {{ $t('login.register') }}
                </a>
                <Vline />
                <a class='btn' href='javascript:;' @click="$router.push({ name:'Forgot',query: { type: 'login' } })">
                    {{ $t('login.forgot') }}
                </a>
            </div>
        </form>

        <div v-if='thirdLoginArr && thirdLoginArr.length > 0' class='three-way-login'>
            <p class='title'>
                {{ $t('login.otherLogin') }}
            </p>
            <div class='otherLogin'>
                <LoginByGoogle v-if="thirdLoginArr.includes('google')" />
                <LoginByFacebook v-if="thirdLoginArr.includes('facebook')" />
                <LoginByTwitter v-if="thirdLoginArr.includes('twitter')" />
            </div>
        </div>

        <!-- <footer class='footer'>
            <a class='link' href='javascript:;'>
                <i class='icon_icon_service'></i>
                在线客服
            </a>
        </footer> -->
        <div class='support'>
            <img alt='' src='/images/support.png' />
        </div>
    </div>

    <!-- 设置登录密码 -->
    <van-popup v-model:show='loginPwdPop' :close-on-click-overlay='false' :style="{ 'border-radius':'8px','background-color': $style.bgColor }">
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
    </van-popup>
    <Loading :show='loading' />
</template>

<script>
import Schema from 'async-validator'
import InputComp from '@/components/form/input'
import Vline from '@/components/vline'
import CheckCode from '@/components/form/checkCode'
import LoginByGoogle from '@/themeCommon/user/login/components/loginByGoogle.vue'
import LoginByFacebook from '@/themeCommon/user/login/components/loginByFacebook.vue'
import LoginByTwitter from '@/themeCommon/user/login/components/loginByTwitter.vue'

import Top from '@/components/top'
import { getDevice, localGet, localSet, getArrayObj, sessionGet, isEmpty } from '@/utils/util'
import { verifyCodeSend } from '@/api/base'
import { computed, reactive, toRefs, getCurrentInstance, onUnmounted, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Toast, Dialog } from 'vant'
import RuleFn from './rule'
import md5 from 'js-md5'
import { timeline, timelineItem } from '@/components/timeline'
import { checkUserStatus } from '@/api/user'
import { setQuoteService } from '@/plugins/socket/socket'
import { useI18n } from 'vue-i18n'
//  import hooks from './hooks'

export default {
    components: {
        Vline,
        InputComp,
        LoginByGoogle,
        LoginByFacebook,
        LoginByTwitter,
        CheckCode,
        Top,
    },
    setup () {
        // const { getPlansByCountry, getCustomerGroupIdByCountry } = hooks()
        const router = useRouter()
        const route = useRoute()
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const instance = getCurrentInstance()
        const state = reactive({
            loading: false,
            pwdVisible: false,
            loginPwdPop: false,
            loginName: '',
            pwd: '',
            checkCode: '',
            loginType: 'password', // checkCode
            loginAccount: 'mobile',
            bindAddShow: false,
            userId: ''
        })
        let token = ''
        const rightAction = computed(() => {
            return {
                title: t(state.loginType === 'password' ? 'login.loginByCode' : 'login.loginByPwd')
            }
        })

        const countryList = computed(() => store.state.countryList)
        const thirdLoginArr = computed(() => store.state._base.wpCompanyInfo?.thirdLogin || [])
        if (isEmpty(countryList.value) && !isEmpty(thirdLoginArr.value)) {
            // 获取国家区号
            store.dispatch('getCountryListByParentCode')
        }

        const changeLoginType = () => {
            const loginType = state.loginType
            state.loginType = loginType === 'password' ? 'checkCode' : 'password'
        }
        const loginHandle = () => {
            const loginParams = {
                type: state.loginName.includes('@') ? 1 : 2,
                loginName: state.loginName,
                device: getDevice(),
                verifyCode: state.loginType === 'checkCode' ? state.checkCode : undefined,
                loginPwd: state.loginType === 'password' ? md5(state.pwd) : undefined,
                sendToken: state.loginType === 'checkCode' ? token : undefined,
                thirdSource: route.query.thirdSource || '',
                bindThirdUserId: route.query.bindThirdUserId || '',
                isThird: false // true为三方登录 false 系统登录
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
                    // console.log(errors, fields)
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
            // const toURL = route.query.back ? decodeURIComponent(route.query.back) : '/'
            router.replace('/')
        }

        // 发送登录接
        const loginSubmit = (params) => {
            state.loading = true
            store.dispatch('_user/login', params).then(res => {
                state.loading = false
                if (res.invalid()) return false

                // 切换登录后的行情websocket
                // setQuoteService()

                // 登录websocket
                instance.appContext.config.globalProperties.$MsgSocket.login()
                store.commit('del_cacheViews', 'Home')
                store.commit('del_cacheViews', 'Layout')

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

        const noticeSetPwd = (loginPassStatus) => {
            if (parseInt(loginPassStatus) === 1 && !localGet('loginPwdIgnore')) {
                state.loginPwdPop = true
            } else {
                loginToPath()
            }
        }

        const topRightClick = () => {
            console.log('rightClick')
        }

        // 发送验证码
        const verifyCodeSendHandler = (callback) => {
            const verifyParams = {
                type: state.loginName.includes('@') ? 1 : 2,
                loginName: state.loginName
            }

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
                            state.zone = res.data.phoneArea
                            const params = {
                                bizType: state.loginName.includes('@') ? 'EMAIL_LOGIN_VERIFICATION_CODE' : 'SMS_LOGIN_VERIFICATION_CODE',
                                toUser: state.loginName.includes('@') ? state.loginName : String(state.zone) + ' ' + state.loginName,
                            }
                            verifyCodeSend(params).then(res => {
                                if (res.check()) {
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

        // 获取三方登录配置
        store.dispatch('_base/getLoginConfig')

        return {
            ...toRefs(state),
            changeLoginType,
            rightAction,
            loginHandle,
            topRightClick,
            verifyCodeSendHandler,
            loginPwdSetNext,
            loginPwdSet,
            noTip,
            loginSubmit,
            thirdLoginArr
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
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: rem(40px) rem(30px);
    }
    .pageTitle {
        margin-bottom: rem(10px);
        font-weight: normal;
        font-size: rem(50px);
    }
    .support {
        position: absolute;
        bottom: rem(30px);
        width: rem(300px);
        left: 50%;
        margin-left: rem(-150px);
        color: var(--placeholdColor);
        font-size: rem(20px);
        line-height: rem(32px);
        text-align: center;
        img{
            width: 100%;
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
    margin: rem(50px) rem(30px);
    .field {
        position: relative;
        display: flex;
        align-items: center;
        &:not(:first-of-type) {
            margin-top: rem(45px);
        }
        &.toolWrap {
            justify-content: space-between;
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
        .icon_icon_default,
        .icon_icon_pressed {
            margin-left: rem(10px);
            color: var(--lineColor);
            font-size: rem(36px);
        }
    }
    .loginBtn {
        width: 100%;
        height: rem(100px);
        margin-top: rem(90px);
        color: var(--color);
        font-size: rem(30px);
        line-height: rem(80px);
        background: var(--lineColor);
        border-color: var(--lineColor);
        border-radius: rem(4px);
        &.light {
            margin-top: rem(40px);
            color: var(--primary);
            background: none;
        }
    }
}
.tools {
    font-size: rem(26px);
    // margin-top: rem(50px);
    text-align: center;
    .line {
        margin: 0 1em;
        color: var(--minorColor);
    }
}
.three-way-login{
    margin-top: rem(200px);
    .title{
        text-align: center;
        color: var(--placeholdColor);
        margin-bottom: rem(20px);
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
    margin-top: rem(30px);
    text-align: center;
    .btn {
        @include active();
        color: var(--color);
        vertical-align: middle;
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

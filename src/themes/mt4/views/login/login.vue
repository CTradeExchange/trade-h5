<template>
    <div class='pageWrap'>
        <Top :right-action='rightAction' @rightClick='changeLoginType' />
        <header class='header'>
            <h1 class='pageTitle'>
                {{ loginType==='password'? '账号密码登录':'验证码登录' }}
            </h1>
        <!-- <LanguageDiv /> -->
        </header>
        <form class='loginForm'>
            <div v-if="loginAccount==='mobile'" class='field'>
                <areaInput v-model.trim='loginName' v-model:zone='zone' clear placeholder='请输入手机号或邮箱' />
            </div>
            <div v-else class='field'>
                <InputComp v-model.trim='email' clear label='邮箱' />
            </div>
            <div v-if="loginType==='password'" class='field'>
                <InputComp v-model='pwd' v-model:zone='zone' clear label='密码' pwd />
            </div>
            <div v-else class='field'>
                <CheckCode v-model.trim='checkCode' clear label='验证码' @verifyCodeSend='verifyCodeSendHandler' />
            </div>
            <van-button block class='loginBtn' :disabled='loading' type='primary' @click='loginHandle'>
                登录
            </van-button>
            <div class='toolBtns'>
                <a class='btn' href='javascript:;' @click="$router.push({ name:'Register' })">
                    注册新账户
                </a>
                <Vline />
                <a class='btn' href='javascript:;' @click="$router.push({ name:'Forgot' })">
                    忘记密码
                </a>
            </div>
        </form>
    <!-- <div class='otherLogin'>
            <LoginByGoogle />
            <span class='empty'></span>
            <LoginByFacebook />
        </div> -->
    <!-- <footer class='footer'>
            <a class='link' href='javascript:;'>
                <i class='icon_icon_service'></i>
                在线客服
            </a>
        </footer> -->
    </div>

    <!-- 用户KYC资料验证 -->
    <van-popup v-model:show='kycPop' :close-on-click-overlay='false' :style="{ 'border-radius':'8px' }">
        <section class='popContainer'>
            <div class='kycTimeLine'>
                <timeline>
                    <timelineItem>
                        <template #icon>
                            <span class='icon_upload primary'></span>
                        </template>
                        <p>2021.03.26 16:23:26提交成功</p>
                    </timelineItem>
                    <timelineItem>
                        <template #icon>
                            <span class='icon_wait primary'></span>
                        </template>
                        <p>您的资料正在审核中，请耐心等待</p>
                    </timelineItem>
                    <timelineItem>
                        <template #icon>
                            <span class='icon_fail red'></span>
                        </template>
                        <p>您的资料审核失败</p>
                        <p>原因：姓名和身份证号不匹配</p>
                    </timelineItem>
                </timeline>
            </div>
            <div class='btnBox'>
                <!-- <button class="btn">重新提交</button> -->
                <button class='btn' @click='kycPop=false'>
                    关闭
                </button>
            </div>
        </section>
    </van-popup>

    <!-- 设置登录密码 -->
    <van-popup v-model:show='loginPwdPop' :close-on-click-overlay='false' :style="{ 'border-radius':'8px' }">
        <section class='popContainer'>
            <a class='noTip' href='javascript:;' @click='noTip'>
                不再提醒
            </a>
            <div class='containerBox'>
                <p class='iconPwd'>
                    <span class='icon_password'></span>
                </p>
                <p class='tipContent'>
                    您的登录密码还未设置，设置后便可通过密码进行登录，是否现在去设置？
                </p>
            </div>
            <div class='btnBox'>
                <button class='btn' @click='loginPwdSet'>
                    去设置
                </button>
                <button class='btn muted' @click='loginPwdSetNext'>
                    下次
                </button>
            </div>
        </section>
    </van-popup>

    <Loading :show='loading' />
</template>

<script>
import Schema from 'async-validator'
import LanguageDiv from '@m/modules/languageDiv'
import areaInput from '@/components/form/areaInput'
import InputComp from '@/components/form/input'
import Vline from '@/components/vline'
import CheckCode from '@/components/form/checkCode'
import LoginByGoogle from '@m/components/loginByGoogle/loginByGoogle'
import LoginByFacebook from '@m/components/loginByFacebook/loginByFacebook'
import Top from '@/components/top'
import { getDevice, localGet, localSet, getArrayObj } from '@/utils/util'
import { verifyCodeSend } from '@/api/base'
import { computed, reactive, toRefs, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Toast, Dialog } from 'vant'
import Rule from './rule'
import md5 from 'js-md5'
import { timeline, timelineItem } from '@m/components/timeline'

export default {
    components: {
        timeline,
        timelineItem,
        LanguageDiv,
        Vline,
        InputComp,
        areaInput,
        LoginByGoogle,
        LoginByFacebook,
        CheckCode,
        Top,
    },
    setup () {
        const router = useRouter()
        const route = useRoute()
        const store = useStore()
        const instance = getCurrentInstance()
        const state = reactive({
            loading: false,
            pwdVisible: false,
            kycPop: false,
            loginPwdPop: false,
            zone: '+86',
            loginName: '',
            pwd: '',
            checkCode: '',
            loginType: 'checkCode',
            loginAccount: 'mobile',
        })
        let token = ''
        const rightAction = computed(() => {
            return {
                title: state.loginType === 'password' ? '验证码登录' : '账号密码登录'
            }
        })
        const zoneList = computed(() => store.state.zoneList)
        // 手机正则表达式
        const mobileReg = computed(() => {
            return getArrayObj(zoneList.value, 'code', state.zone).extend || ''
        })

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

            }

            if (state.loginName.includes('@')) {
                loginParams.emailArea = String(state.zone)
            } else {
                loginParams.phoneArea = String(state.zone)
            }

            const validator = new Schema(Rule)
            state.loading = true

            validator.validate(
                {
                    ...loginParams,
                    mobileReg: new RegExp(mobileReg.value)
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
            const toURL = route.query.back ? decodeURIComponent(route.query.back) : '/'
            router.replace(toURL)
        }

        // 发送登录接
        const loginSubmit = (params) => {
            store.dispatch('_user/login', params).then(res => {
                state.loading = false
                // console.log(res)
                if (res.invalid()) return false

                // 重新登录清除账户信息
                store.commit('_user/Update_accountAssets', {})

                // 登录KYC,kycAuditStatus:0未认证跳,需转到认证页面,1待审核,2审核通过,3审核不通过
                // companyKycStatus 公司KYC开户状态，1开启 2未开启
                if (Number(res.data.companyKycStatus) === 1) {
                    if (Number(res.data.kycAuditStatus === 0)) {
                        return Dialog.alert({
                            title: '提示',
                            confirmButtonText: '去认证',
                            message: '您还未进行KYC认证，点击去认证',
                            theme: 'round-button',
                        }).then(() => {
                            router.push('/authentication')
                        })
                    } else if (Number(res.data.kycAuditStatus === 1)) {
                        return Dialog.alert({
                            title: '提示',
                            confirmButtonText: '关闭',
                            message: '您的资料正在审核中，等耐心等待',
                            theme: 'round-button',
                        }).then(() => {
                            store.dispatch('_user/logout')
                        })
                    } else if (Number(res.data.kycAuditStatus === 3)) {
                        return Dialog.alert({
                            title: '提示',
                            confirmButtonText: '重新提交',
                            message: '您的资料审核失败',
                            theme: 'round-button',
                        }).then(() => {
                            router.push('/authentication')
                        })
                    } else if (Number(res.data.kycAuditStatus === 2)) {
                        Dialog.alert({
                            title: '提示',
                            confirmButtonText: '好的',
                            message: '您的资料已经审核通过，现在就开启您的财富之旅吧！',
                            theme: 'round-button',
                        }).then(() => {
                            // 登录websocket
                            instance.appContext.config.globalProperties.$MsgSocket.login()
                            // 重新登录清除账户信息
                            store.commit('_user/Update_accountAssets', {})
                            if (parseInt(res.data.loginPassStatus) === 1 && !localGet('loginPwdIgnore')) {
                                state.loginPwdPop = true
                            } else {
                                loginToPath()
                            }
                        })
                    }
                }
            })
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

            if (state.loginName.includes('@')) {
                verifyParams.emailArea = String(state.zone)
            } else {
                verifyParams.phoneArea = String(state.zone)
            }

            const validator = new Schema(Rule)
            validator.validate({
                ...verifyParams,
                mobileReg: new RegExp(mobileReg.value)
            }).then(res => {
                const params = {
                    bizType: state.loginName.includes('@') ? 'EMAIL_LOGIN_VERIFICATION_CODE' : 'SMS_LOGIN_VERIFICATION_CODE',
                    toUser: state.loginName.includes('@') ? state.loginName : String(state.zone) + ' ' + state.loginName,
                }
                verifyCodeSend(params).then(res => {
                    if (res.check()) {
                        token = res.data.token
                        // if (res.data.code) state.checkCode = res.data.code
                        callback && callback()
                    }
                })
            }).catch(({
                errors,
                fields
            }) => {
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

        // 获取国家验区号
        store.dispatch('getListByParentCode')
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
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.pageWrap {
    position: relative;
    height: 100%;
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
            color: var(--bdColor);
            font-size: rem(36px);
        }
        .icon_icon_default,
        .icon_icon_pressed {
            margin-left: rem(10px);
            color: var(--bdColor);
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
        background: var(--btnColor);
        border-color: var(--bdColor);
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
        color: var(--mutedColor);
    }
}
.otherLogin {
    margin-top: rem(30px);
    text-align: center;
    .empty {
        display: inline-block;
        width: rem(50px);
        height: rem(30px);
        vertical-align: middle;
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
    }
}
.popContainer {
    position: relative;
    width: 80vw;
    background: var(--white);
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
        color: var(--mutedColor);
    }
    .btnBox {
        position: relative;
        display: flex;
        color: var(--btnText);
        font-size: rem(34px);
        text-align: center;
        background: var(--btnColor);
        border-top: 1px solid var(--btnLine);
        &::after {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 1px;
            height: rem(50px);
            background: var(--btnInterval);
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

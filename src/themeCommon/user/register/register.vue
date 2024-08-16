<template>
    <LayoutTop :menu='false' :show-title='false' :title="$t('route.mine')" />
    <div class='register'>
        <div class='container'>
            <p class='pageTitle'>
                {{ $t('login.welcome') }}&nbsp;<span>Headline.net</span>
            </p>
            <div class='btnBox'>
                <div v-if="thirdLoginArr.includes('google') && !isTGweb" class='btn'>
                    <LoginByGoogle />
                    {{ $t('login.googel') }}
                </div>
                <div v-if="thirdLoginArr.includes('telegram')" class='btn'>
                    <LoginByTelegram />
                    {{ $t('login.telegram') }}
                </div>
                <div v-if="thirdLoginArr.includes('apple') && isIOS" class='btn'>
                    <LoginByApple />
                    {{ $t('login.apple') }}
                </div>
            </div>
            <!-- <div class='divider'>
                <span></span><div class='text'>
                    {{ $t('login.or') }}
                </div><span></span>
            </div>
            <div class='epbtn' @click='goPage'>
                <img alt='' src='/images/userBtnIcon.svg' /> {{ $t('login.registerPE') }}
            </div> -->
            <div class='tipsBox'>
                {{ $t('login.goLogin') }}&nbsp;
                <div class='hot' @click='goLogin'>
                    {{ $t('forgot.goLogin') }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useStore } from 'vuex'
import { sessionGet, sessionSet } from '@/utils/util'
import { useRoute, useRouter } from 'vue-router'
import { firebaseAnalytics } from '@/utils/firebase'

import LoginByGoogle from '@/themeCommon/user/login/components/loginByGoogle.vue'
import LoginByTelegram from '@/themeCommon/user/login/components/loginByTelegram'
import LoginByApple from '@/themeCommon/user/login/components/LoginByApple'

// 获取三方登录配置
const store = useStore()
store.dispatch('_base/getLoginConfig')
// 获取支持企业注册国家
store.dispatch('getCompanyCountry')
// 获取国家区号
store.dispatch('getCountryListByParentCode')

const thirdLoginArr = computed(() => store.state._base.wpCompanyInfo?.thirdLogin || [])
const isIOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // 增加IOS的判断
const isTGweb = sessionGet('isTGweb') == '1'
const router = useRouter()

const goLogin = () => {
    router.replace('/login')
}

const goPage = () => {
    // firebase
    firebaseAnalytics('sign_up_entrance_email_phone')
    // 是否从注册register进入的
    sessionSet('inletRegister', true)
    router.push('/register/step1')
}
</script>

<style lang="scss" scoped>
@import "@/sass/mixin.scss";
.register {
    position: relative;
    height: 100%;
    background: var(--contentColor);
    padding: 0 rem(40px);
    .topBar {
        height: rem(100px);
    }
    .container {
        overflow: auto;
        .pageTitle {
        margin-top: rem(54px);
        font-size: rem(52px);
        color: var(--primaryText);
        font-family: Poppins;
        font-style: normal;
        line-height: normal;
        text-align: center;
            span{
                font-weight: 600;
            }
        }
        .btnBox{
            margin-top: rem(82px);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            grid-row-gap: 17px;

            .btn{
                width: 100%;
                height: rem(110px);
                border-radius:rem(18px);
                background: #F1F1F1;
                text-align: center;
                color: var(--color);
                font-family: Poppins;
                font-size: rem(30px);
                font-style: normal;
                font-weight: 500;
                line-height: rem(110px);
                position: relative;
                :deep(.login-google){
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: rem(670px);
                    height: rem(108px);
                    overflow: visible;
                    z-index: 99;
                }
                :deep(a.login){
                    border: none;
                    justify-content: flex-start;
                    padding-left: rem(32px);
                }
                :deep(.login-telegram){
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: rem(670px);
                    height: rem(108px);
                    overflow: visible;
                    z-index: 99;
                }
                :deep(.loginByApple){
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: rem(670px);
                    height: rem(108px);
                    overflow: visible;
                    z-index: 99;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    padding-left: rem(32px);
                }
                img{
                    width: rem(50px);
                    height: rem(50px);
                    object-fit: contain;
                    position: absolute;
                    top:rem(28px);
                    left: rem(32px);
                }
            }
        }

        .divider{
            margin-top: rem(48px);
            display: flex;
            align-items: center;
            color: var(--noticeTextColor);
            text-align: center;
            font-family: Poppins;
            font-size: rem(30px);
            font-style: normal;
            font-weight: 500;
            line-height: normal;
            span{
                flex: 1;
                height: rem(1px);
                border-radius: rem(2px);
                background: #EBEBEB;
            }
            .text{
                padding: 0 rem(28px);
            }
        }
        .epbtn{
            padding-left: rem(86px);
            margin-top: rem(48px);
            width: 100%;
            height: rem(110px);
            border-radius: rem(20px);
            border: 1px solid #E6E6E6;
            text-align: center;
            color: var(--color);
            font-family: Poppins;
            font-size: rem(30px);
            font-style: normal;
            font-weight: 500;
            line-height: rem(110px);
            position: relative;
            img{
                width: rem(50px);
                height: rem(50px);
                object-fit: contain;
                position: absolute;
                top:rem(28px);
                left: rem(32px);
            }
        }
        .tipsBox{
            margin-top: rem(32px);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--btnTextDisabledColor);
            text-align: center;
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

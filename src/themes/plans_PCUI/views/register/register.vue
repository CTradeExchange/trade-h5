<template>
    <div class='register'>
        <topNav class='header' />
        <div class='container'>
            <RegisterLeftCard />
            <div class='rightBox'>
                <div class='Rcontainer'>
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
                    <!-- <div class="divider"><span></span><div class="text">{{ $t('login.or') }}</div><span></span></div>
                        <div class="epbtn" @click="goPage" >
                            <img src="/images/userBtnIcon.svg" alt=""> {{$t('login.registerPE')}}
                        </div> -->
                    <div class='tipsBox'>
                        {{ $t('login.goLogin') }}&nbsp;
                        <div class='hot' @click='goLogin'>
                            {{ $t('forgot.goLogin') }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <router-view />
    </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useStore } from 'vuex'
import { sessionGet, sessionSet } from '@/utils/util'
import { useRoute, useRouter } from 'vue-router'
import { firebaseAnalytics } from '@/utils/firebase'

import topNav from '@planspc/layout/topNav'
import RegisterLeftCard from './registerLeftCard'
import LoginByGoogle from '@/themeCommon/user/login/components/loginByGoogle.vue'
import LoginByTelegram from '@/themeCommon/user/login/components/loginByTelegram'
import LoginByApple from '@/themeCommon/user/login/components/LoginByApple'
import thirdLogin from '@/themeCommon/components/thirdLogin'

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
const route = useRoute()
const { rouType } = route.query

const goLogin = () => {
    if (rouType) {
        router.replace({ path: '/login', query: { rouType } })
    } else {
        router.replace('/login')
    }
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
                .pageTitle {
                    padding-top: 202px;
                    font-size: 32px;
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
                    margin-top: 32px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    grid-row-gap: 17px;

                    .btn{
                        width: 100%;
                        height: 55px;
                        border-radius:9px;
                        background: #F1F1F1;
                        text-align: center;
                        color: var(--color);
                        font-family: Poppins;
                        font-size: 16px;
                        font-style: normal;
                        font-weight: 500;
                        line-height: 55px;
                        position: relative;
                        :deep(.login-google){
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 418px;
                            height: 55px;
                            overflow: visible;
                            z-index: 99;
                        }
                        :deep(a.login){
                            border: none;
                            justify-content: flex-start;
                            padding-left: 16px;
                        }
                        :deep(.login-telegram){
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 418px;
                            height: 55px;
                            overflow: visible;
                            z-index: 99;
                        }
                        :deep(.loginByApple){
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 418px;
                            height: 55px;
                            overflow: visible;
                            z-index: 99;
                            border: none;
                            display: flex;
                            align-items: center;
                            justify-content: flex-start;
                            padding-left: 16px;
                        }
                        img{
                            width: 25px;
                            height: 25px;
                            object-fit: contain;
                            position: absolute;
                            top:15px;
                            left: 16px;
                        }
                    }
                }
                .divider{
                    margin-top: 24px;
                    display: flex;
                    align-items: center;
                    color: var(--noticeTextColor);
                    text-align: center;
                    font-family: Poppins;
                    font-size: 16px;
                    font-style: normal;
                    font-weight: 500;
                    line-height: normal;
                    span{
                        flex: 1;
                        height: 1px;
                        border-radius: 2px;
                        background: #EBEBEB;
                    }
                    .text{
                        padding: 0 13px;
                    }
                }
                .epbtn{
                    padding-left: 43px;
                    margin-top: 24px;
                    width: 100%;
                    height: 55px;
                    border-radius: 10px;
                    border: 1px solid #E6E6E6;
                    text-align: center;
                    color: var(--color);
                    font-family: Poppins;
                    font-size: 16px;
                    font-style: normal;
                    font-weight: 500;
                    line-height: 55px;
                    position: relative;
                    cursor: pointer;
                    img{
                        width: 25px;
                        height: 25px;
                        object-fit: contain;
                        position: absolute;
                        top:15px;
                        left: 16px;
                    }
                }
                .tipsBox{
                    margin-top: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--btnTextDisabledColor);
                    text-align: center;
                    font-family: Poppins;
                    font-size: 13px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: normal;
                    .hot{
                        color: var(--primary);
                        cursor: pointer;
                    }
                }
         }
       }
    }

}
</style>

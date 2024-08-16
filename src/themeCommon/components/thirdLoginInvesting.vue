<template>
    <div v-if='thirdLoginArr.length > 0' class='three-way-login'>
        <p class='title'>
            <span style='padding: 0 16px; color: #999; font-size: 14px; font-family: Inter'>
                {{ $t('login.otherLogin') }}
            </span>
        </p>
        <div class='otherLogin'>
            <LoginByGoogle v-if="thirdLoginArr.includes('google') && !isTGweb" />
            <LoginByFacebook v-if="thirdLoginArr.includes('facebook')" />
            <LoginByTwitter v-if="thirdLoginArr.includes('twitter')" />
            <LoginByTelegram v-if="thirdLoginArr.includes('telegram')" />
            <LoginByApple v-if="thirdLoginArr.includes('apple') && isIOS" />
        </div>
    </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { computed } from 'vue'
import { sessionGet } from '@/utils/util'
import LoginByGoogle from '@/themeCommon/user/login/components/loginByGoogle.vue'
import LoginByFacebook from '@/themeCommon/user/login/components/loginByFacebook.vue'
import LoginByTwitter from '@/themeCommon/user/login/components/loginByTwitter.vue'
import LoginByTelegram from '@/themeCommon/user/login/components/loginByTelegram'
import LoginByApple from '@/themeCommon/user/login/components/LoginByApple'

const store = useStore()
// 获取三方登录配置
store.dispatch('_base/getLoginConfig')

const thirdLoginArr = computed(() => store.state._base.wpCompanyInfo?.thirdLogin || [])
const isIOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // 增加IOS的判断
const isTGweb = sessionGet('isTGweb') == '1'
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
@import url('https://fonts.googleapis.com/css2?family=Inter&family=Poppins&display=swap');
.three-way-login {
    margin-top: 44px;
    .title {
        margin-bottom: 10px;
        color: var(--textColor);
        text-align: center;
        display: flex;
        align-items: center;
        padding: 0 10px;
        justify-content: center;
        &::after {
            background: #999;
            content: '';
            flex: 1;
            height: 1px;
            max-width: 40px;
        }
        &::before {
            background: #999;
            content: '';
            flex: 1;
            height: 1px;
            max-width: 40px;
        }
    }
    .otherLogin {
        display: flex;
        justify-content: space-evenly;
        width: 330px;
        margin: 15px auto 0;
        text-align: center;
    }
}
@media screen and (max-width: 767px) {
    .three-way-login {
        margin-top: 25px !important;
    }
}
</style>

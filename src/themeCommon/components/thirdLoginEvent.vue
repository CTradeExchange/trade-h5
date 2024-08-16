<template>
    <div v-if='thirdLoginArr.length > 0' class='three-way-login'>
        <div class='otherLogin'>
            <LoginByGoogle v-if="thirdLoginArr.includes('google') && !isTGweb" />
            <!--<LoginByFacebook v-if="thirdLoginArr.includes('facebook')" />-->
            <!--<LoginByTwitter v-if="thirdLoginArr.includes('twitter')" />-->
            <LoginByTelegram v-if="thirdLoginArr.includes('telegram')" />
            <!--<LoginByApple v-if="thirdLoginArr.includes('apple') && isIOS" />-->
        </div>
    </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { computed } from 'vue'
import { sessionGet } from '@/utils/util'
import LoginByGoogle from '@/themeCommon/user/login/components/loginByGoogleEvent.vue'
import LoginByFacebook from '@/themeCommon/user/login/components/loginByFacebook.vue'
import LoginByTwitter from '@/themeCommon/user/login/components/loginByTwitter.vue'
import LoginByTelegram from '@/themeCommon/user/login/components/loginByTelegramEvent.vue'
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
.three-way-login {
    margin-top: 20px;
    .title {
        margin-bottom: 10px;
        color: var(--textColor);
        text-align: center;
        display: flex;
        align-items: center;
        padding: 0 10px;
        color: #fff;
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
        display: flex;
        justify-content: space-evenly;
        margin: 15px auto 0;
        text-align: center;
    }
}
</style>

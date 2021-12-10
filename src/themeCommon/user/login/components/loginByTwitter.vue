<template>
    <a id='my-sign-twitter' class='loginByGoogle' @click="login_twitter('twitter')">
        <i class='icon'></i>
    </a>
    <!-- <Loading :show='loading' /> -->
    <!-- 请补充您所在国家信息 -->
    <van-action-sheet
        v-model:show='bindAddShow'
        :actions='areaActions'
        teleport='#app'
        title='请补充您所在国家信息'
        @select='onSelectCountry'
    />
</template>

<script>
import { reactive, toRefs, computed, onMounted, watch, getCurrentInstance } from 'vue'
import loadScript from '@/utils/loadScript'
import hello from 'hellojs/dist/hello.all.js'
import hooks from '../loginHooks'
export default {
    setup (props) {
        const state = reactive({
            bindAddShow: false,
            userId: '',
            thirdSource: '',
            customerGroupId: '',
            country: '',
            loading: false,
            loginType: 'twitter'
        })

        const { handleCBLogin, onSelectCountry, areaActions } = hooks(state)

        const login_twitter = (network) => { // 登录方法，并将twitter 作为参数传入
            // Twitter instance
            console.log(network)
            var twitter = hello(network)
            console.log(twitter)
            // Login
            twitter.login().then(function (res) {
                // Get Profile
                console.log(JSON.stringify(res))
                handleCBLogin(res.authResponse)
                return twitter.api('/me')
            }).then(function (p) {
                console.log('Connected to ' + network + ' as ' + p.name)
                var res = JSON.stringify(p)// 因为得不到token，但是这步已经得到用户所有信息，所以将用户信息转成JSON字符串给后台
                console.log(res)
            })
        }
        onMounted(() => {
            hello.init({
                'twitter': '0yvXSv2dhPs9fE2bHPHt9FkkW'
            })
        })

        return {
            login_twitter,
            onSelectCountry,
            areaActions
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.loginByGoogle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: rem(80px);
    height: rem(80px);
    border: 1px solid var(--lineColor);
    border-radius: 50%;
    .icon {
        display: inline-block;
        width: rem(46px);
        height: rem(46px);
        background-image:  url('/images/twitter.png');
        background-size: 100%;
    }
}
</style>

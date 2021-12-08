<template>
    <a id='my-sign-google' class='loginByGoogle'>
        <i class='icon'></i>
    </a>
</template>

<script>
import { reactive, toRefs, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import loadScript from '@/utils/loadScript'
import { googleLoginVerify } from '@/api/user'
export default {
    setup (props, context) {
        var auth2 = ''
        const store = useStore()
        const companyId = () => store.state._base.wpCompanyInfo.companyId

        const renderBtn = () => {
            loadScript('https://apis.google.com/js/api:client.js').then(() => {
                startApp()
            })
        }

        const attachSignin = (element) => {
            auth2.attachClickHandler(element, {}, function (googleUser) {
                console.log(googleUser)
                var profile = auth2.currentUser.get().getBasicProfile()
                console.log('ID666: ' + profile.getId())
                console.log('Full Name: ' + profile.getName())
                console.log('Given Name: ' + profile.getGivenName())
                console.log('Family Name: ' + profile.getFamilyName())
                console.log('Image URL: ' + profile.getImageUrl())
                console.log('Email: ' + profile.getEmail())
                var id_token = googleUser.getAuthResponse().id_token
                console.log('id_token: ' + id_token)
                context.emit('loginSuccess', id_token)
                handleLogin(id_token)
            }, function (error) {
                console.log(error)
            })
        }

        const startApp = () => {
            gapi.load('auth2', function () {
                // Retrieve the singleton for the GoogleAuth library and set up the client.
                auth2 = gapi.auth2.init({
                    client_id: '954651094385-iv1r7mo5mo24a5nlt1ldp3m5qug9u0ta.apps.googleusercontent.com', // 客户端ID
                    cookiepolicy: 'single_host_origin',
                    scope: 'profile' // 可以请求除了默认的'profile' and 'email'之外的数据
                })
                attachSignin(document.getElementById('my-sign-google'))
            })
        }
        const handleLogin = (id_token) => {
            console.log('login come in ')
            googleLoginVerify({
                id_token,
                companyId: companyId.value
            }).then(res => {
                if (res.check()) {
                    console.log('res', res)
                }
            })
        }

        onMounted(() => {
            renderBtn()
        })

        return {

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
        background-image:  url('/images/google.png');
        background-size: 100%;
    }
}
</style>

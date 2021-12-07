<template>
    <a id='my-signin2' class='loginByGoogle'>
        <i class='icon'></i>
    </a>
</template>

<script>
import loadScript from '@/utils/loadScript'
export default {
    mounted () {
        this.renderBtn()
    },
    methods: {
        renderBtn () {
            loadScript('https://apis.google.com/js/api:client.js').then(() => {
                this.startApp()
            })
        },
        attachSignin (element) {
            console.log(element.id)
            const that = this
            this.auth2.attachClickHandler(element, {}, function (googleUser) {
                console.log(googleUser)
                var profile = that.auth2.currentUser.get().getBasicProfile()
                console.log('ID: ' + profile.getId())
                console.log('Full Name: ' + profile.getName())
                console.log('Given Name: ' + profile.getGivenName())
                console.log('Family Name: ' + profile.getFamilyName())
                console.log('Image URL: ' + profile.getImageUrl())
                console.log('Email: ' + profile.getEmail())
                var id_token = googleUser.getAuthResponse().id_token
                console.log('id_token: ' + id_token)
            }, function (error) {
                console.log(error)
            })
        },
        startApp () {
            const _this = this
            gapi.load('auth2', function () {
                // Retrieve the singleton for the GoogleAuth library and set up the client.
                _this.auth2 = gapi.auth2.init({
                    client_id: '954651094385-iv1r7mo5mo24a5nlt1ldp3m5qug9u0ta.apps.googleusercontent.com', // 客户端ID
                    cookiepolicy: 'single_host_origin',
                    scope: 'profile' // 可以请求除了默认的'profile' and 'email'之外的数据
                })
                _this.attachSignin(document.getElementById('my-signin2'))
            })
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

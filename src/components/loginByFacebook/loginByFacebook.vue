<template>
    <a class='loginByFacebook' @click='onLogin'>
        <i class='icon'></i>
    </a>
</template>

<script>
export default {
    mounted () {
        this.renderBtn()
    },
    methods: {
        renderBtn () {
            window.fbAsyncInit = function () {
                FB.init({
                    appId: '429914884488177',
                    autoLogAppEvents: true,
                    xfbml: true,
                    version: 'v9.0'
                })
            };

            (function (d, s, id) {
                var js; var fjs = d.getElementsByTagName(s)[0]
                if (d.getElementById(id)) { return }
                js = d.createElement(s); js.id = id
                js.src = 'https://connect.facebook.net/en_US/sdk.js'
                fjs.parentNode.insertBefore(js, fjs)
            }(document, 'script', 'facebook-jssdk'))
        },
        onLogin () {
            FB.login(function (response) {
                console.log(response)
                if (response.status === 'connected') {
                    // Logged into your webpage and Facebook.
                } else {
                    // The person is not logged into your webpage or we are unable to tell.
                }
            }, { scope: 'public_profile,email' })
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.loginByFacebook {
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
        background-image:  url('/images/facebook.png');
        background-size: 100%;
    }
}
</style>

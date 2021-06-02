<template>
    <a class='loginByFacebook' @click='onLogin'>
        <i class='icon'></i>
        Facebook
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
    position: relative;
    display: inline-block;
    width: rem(220px);
    height: rem(60px);
    padding-left: rem(60px);
    color: var(--white);
    line-height: rem(60px);
    background: var(--primary);
    border-radius: rem(5px);
    .icon {
        position: absolute;
        top: 1px;
        left: 1px;
        width: rem(56px);
        height: rem(56px);
        background: url(../../assets/facebook.svg) no-repeat center;
        background-size: rem(56px);
    }
}
</style>

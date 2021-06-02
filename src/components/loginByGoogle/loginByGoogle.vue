<template>
    <a id='my-signin2' class='loginByGoogle'>
        <i class='icon'></i>
        Google
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
            this.auth2.attachClickHandler(element, {},
                                          function (googleUser) {
                                              console.log(googleUser)
                                              //   document.getElementById('name').innerText = 'Signed in: ' +
                                              //       googleUser.getBasicProfile().getName()
                                          }, function (error) {
                                              console.log(error)
                                              //   alert(JSON.stringify(error, undefined, 2))
                                          })
        },
        startApp () {
            const _this = this
            gapi.load('auth2', function () {
                // Retrieve the singleton for the GoogleAuth library and set up the client.
                _this.auth2 = gapi.auth2.init({
                    client_id: '507643510387-ff4on5fmgb2h06tmd5vou0trprtnk0b9.apps.googleusercontent.com',
                    cookiepolicy: 'single_host_origin',
                    // Request scopes in addition to 'profile' and 'email'
                    // scope: 'additional_scope'
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
        background: #FFF url(../../assets/googleLogo.jpg) no-repeat center;
        background-size: rem(28px);
    }
}
</style>

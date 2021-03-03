<template>
    <router-view />
</template>

<script>
import {pageConfig} from '@api/base'
import {login} from '@api/user'
export default {
    data () {
        return {
        }
    },
    created () {
        window.vm = this
        console.log(this)
        pageConfig('Nav').then(res=>{
            console.log(res)
        })
        login({
            type:2,
            loginName:13200001111,
            loginPwd:123123,
        }).then(res=>{
            console.log(res)
        }).catch(err=>{
            // console.log(err)
        })
    },
}
</script>

<style lang="scss">
@import '~@m/style.scss';
@import '~@m/font/iconfont.css';
@import '~@/sass/mixin.scss';
</style>

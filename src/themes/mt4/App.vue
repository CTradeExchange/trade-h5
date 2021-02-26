<template>
    <router-view />
</template>

<script>
import {pageConfig} from '@api/base'
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
    },
}
</script>

<style lang="scss">
@import '~@m/style.scss';
@import '~@m/font/iconfont.css';
@import '~@/sass/mixin.scss';
</style>

<template>
    <router-view />
</template>

<script>
export default {
    data () {
        return {
        }
    },
    created () {
        window.vm = this
        console.log(this)
    },
}
</script>>

<style lang="scss">
@import '~@ct/style.scss';
@import '~@ct/font/iconfont.css';
@import '~@/sass/mixin.scss';
</style>

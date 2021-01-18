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
@import '~@m/style.scss';
@import '~@m/font/iconfont.css';
@import '~@/sass/mixin.scss';
</style>

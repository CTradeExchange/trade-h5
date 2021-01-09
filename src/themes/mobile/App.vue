<template>
    <router-view class='pageRouter' />
</template>

<script>
export default {
    data () {
        return {
            aa: 111
        }
    },
    created () {
        window.vm = this
    },
}
</script>>

<style lang="scss">
@import '~@/fonts/iconfont.css';
@import '~@/sass/global.scss';
@import '~@/sass/mixin.scss';
</style>

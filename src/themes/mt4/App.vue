<template>
    <router-view v-slot='{ Component, route }'>
        <keep-alive>
            <component :is='Component' v-if='route.meta.keepAlive' :key='route.fullPath' />
        </keep-alive>
        <component :is='Component' v-if='!route.meta.keepAlive' :key='route.fullPath' />
    </router-view>
    <!-- <router-view />  -->
</template>

<script>
export default {
    created () {
        window.vm = this
        window.store = this.$store
        document.body.addEventListener('notice', res => {
            console.log(res)
        }, false)
    }
}
</script>

<style lang="scss">
@import '~@m/style.scss';
@import '~@m/font/iconfont.css';
@import '~@/sass/mixin.scss';
</style>

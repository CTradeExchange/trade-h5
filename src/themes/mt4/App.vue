<template>
    <router-view v-slot='{ Component, route }'>
        <keep-alive>
            <component :is='Component' v-if='route.meta.keepAlive' :key='route.fullPath' />
        </keep-alive>
        <component :is='Component' v-if='!route.meta.keepAlive' :key='route.fullPath' />
    </router-view>
    <Notice />
    <!-- <router-view />  -->
</template>

<script>
import Notice from '@m/components/notice'
export default {
    components: {
        Notice
    },
    data () {
        return {
            show: false,
            noticeContent: ''
        }
    },
    created () {
        window.vm = this
        window.store = this.$store
    },
    methods: {

    }
}
</script>

<style lang="scss">
@import '~@m/style.scss';
@import '~@m/font/iconfont.css';
@import '~@/sass/mixin.scss';
</style>

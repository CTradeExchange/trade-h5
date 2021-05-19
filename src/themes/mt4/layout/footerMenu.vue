<template>
    <van-tabbar v-model='active'>
        <van-tabbar-item name='Quote' to='/quote'>
            <i class='icon icon_hangqing'></i>
        </van-tabbar-item>
        <van-tabbar-item name='Chart' to='/chart'>
            <i class='icon icon_tubiao'></i>
        </van-tabbar-item>
        <van-tabbar-item name='Position' to='/position'>
            <i class='icon icon_jiaoyi'></i>
        </van-tabbar-item>
        <van-tabbar-item name='History' to='/history'>
            <i class='icon icon_lishi'></i>
        </van-tabbar-item>
        <!-- <van-tabbar-item name='News' to='/news'>
            <i class='icon icon_xinwen'></i>
        </van-tabbar-item> -->
        <!-- <van-tabbar-item name='OnlineService' to='/onlineService'>
            <i class='icon icon_xinxi'></i>
        </van-tabbar-item> -->
    </van-tabbar>
</template>

<script>
import { reactive, toRefs, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
export default {
    setup () {
        const route = useRoute()
        const state = reactive({
            active: route.name
        })
        watchEffect(() => (state.active = route.name))
        return {
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.icon {
    font-size: rem(50px);
}
</style>

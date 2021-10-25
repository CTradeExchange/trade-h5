<template>
    <div class='topNav'>
        <p>这里是头部的导航</p>
        <router-link to='/home'>
            首页
        </router-link>
        <router-link to='/quote'>
            行情
        </router-link>
        <router-link to='/order'>
            交易
        </router-link>
    </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
export default {
    setup () {
        const store = useStore()

        return {}
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.topNav{
    background: #000;
    font-size: 14px;
    color: #fff;
    text-align: center;
    line-height: 40px;
}
</style>

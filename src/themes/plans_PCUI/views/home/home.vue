<template>
    <div class='home'>
        <p>这里是首页</p>
        <p>这里是首页</p>
        <p>这里是首页</p>
        <p>这里是首页</p>
        <p>这里是首页</p>
        <p>这里是首页</p>
        <p>这里是首页</p>
        <p>这里是首页</p>
        <p>这里是首页</p>
        <p>这里是首页</p>
        <p>这里是首页</p>
    </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
export default {
    name: 'Home',
    setup () {
        const store = useStore()
        return {}
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.home{
    line-height: 90px;
    font-size: 14px;
}
</style>

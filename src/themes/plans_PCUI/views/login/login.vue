<template>
    <div class='login'>
        <p>这里是登录页面</p>
        <p>这里是登录页面</p>
        <p>这里是登录页面</p>
        <p>这里是登录页面</p>
        <p>这里是登录页面</p>
        <p>这里是登录页面</p>
        <p>这里是登录页面</p>
        <p>这里是登录页面</p>
        <p>这里是登录页面</p>
        <p>这里是登录页面</p>
        <p>这里是登录页面</p>
    </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
export default {
    name: 'Login',
    setup () {
        const store = useStore()

        return {}
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.login{
    line-height: 90px;
    font-size: 14px;
}
</style>

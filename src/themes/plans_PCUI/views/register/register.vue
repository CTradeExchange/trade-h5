<template>
    <div class='register'>
        <p>这里是注册页面</p>
        <p>这里是注册页面</p>
        <p>这里是注册页面</p>
        <p>这里是注册页面</p>
        <p>这里是注册页面</p>
        <p>这里是注册页面</p>
        <p>这里是注册页面</p>
        <p>这里是注册页面</p>
        <p>这里是注册页面</p>
        <p>这里是注册页面</p>
        <p>这里是注册页面</p>
    </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
export default {
    name: 'Register',
    setup () {
        const store = useStore()

        return {}
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.register{
    line-height: 90px;
    font-size: 14px;
}
</style>

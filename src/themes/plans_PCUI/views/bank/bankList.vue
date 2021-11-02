<template>
    <div class='bankListPage'>
        <p>这里是bankList页面</p>
        <p>这里是bankList页面</p>
        <p>这里是bankList页面</p>
        <p>这里是bankList页面</p>
        <p>这里是bankList页面</p>
        <p>这里是bankList页面</p>
        <p>这里是bankList页面</p>
        <p>这里是bankList页面</p>
        <p>这里是bankList页面</p>
        <p>这里是bankList页面</p>
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

</style>

<template>
    <div class='assets'>
        <p>这里是资产页面</p>
        <p>这里是资产页面</p>
        <p>这里是资产页面</p>
        <p>这里是资产页面</p>
        <p>这里是资产页面</p>
        <p>这里是资产页面</p>
        <p>这里是资产页面</p>
        <p>这里是资产页面</p>
        <p>这里是资产页面</p>
        <p>这里是资产页面</p>
        <p>这里是资产页面</p>
    </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
export default {
    name: 'Assets',
    setup () {
        const store = useStore()

        return {}
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.assets{
    line-height: 90px;
    font-size: 14px;
}
</style>

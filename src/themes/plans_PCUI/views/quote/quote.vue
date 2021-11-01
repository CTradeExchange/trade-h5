<template>
    <div class='quote'>
        <router-view />
        <p>
            <a href='javascript:;' @click="$router.push($route.path+'/bindEmail?symbolId=28&tradeType=1')">
                这里是绑定邮箱
            </a>
        </p>
        <p>这里是行情页面</p>
        <p>这里是行情页面</p>
        <p>这里是行情页面</p>
        <p>这里是行情页面</p>
        <p>这里是行情页面</p>
        <p>这里是行情页面</p>
        <p>这里是行情页面</p>
        <p>这里是行情页面</p>
        <p>这里是行情页面</p>
        <p>这里是行情页面</p>
    </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { useStore } from 'vuex'

export default {
    name: 'Quote',
    setup () {
        const store = useStore()

        return {}
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.quote{
    line-height: 90px;
    font-size: 14px;
}
</style>

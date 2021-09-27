<template>
    <div id='homeContent' ref='homeContent' class='home'>
        <PageComp :data='pageModules' />
    </div>
</template>

<script>
import { QuoteSocket } from '@/plugins/socket/socket'
import { onActivated, ref } from 'vue'
import { useStore } from 'vuex'
export default {
    name: 'Home',
    setup () {
        const store = useStore()
        const pageModules = ref([])
        const products = ['3_1', '33_1', '37_2']

        store.dispatch('_base/getPageConfig', 'Home').then(res => {
            console.log(res)
            pageModules.value = res
        })

        onActivated(() => {
            // 订阅产品
            QuoteSocket.send_subscribe(products)
        })
        return {
            pageModules,
        }
    }
}
</script>

<style lang="scss" scoped >
@import '~@/sass/mixin.scss';
.home {
    height: 100%;
    margin-bottom: rem(80px);
    overflow: auto;
    background: var(--contentColor);
}
.noticeBar,
.newBar {
    margin-top: rem(20px);
}
</style>

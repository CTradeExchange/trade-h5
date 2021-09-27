<template>
    <div id='homeContent' ref='homeContent' class='home'>
        <PageComp :data='pageModules' />
    </div>
</template>

<script>
import { QuoteSocket } from '@/plugins/socket/socket'
import { onActivated, computed, ref } from 'vue'
import { useStore } from 'vuex'
export default {
    name: 'Home',
    setup () {
        const store = useStore()
        const pageModules = ref([])
        const customerGroupId = computed(() => store.getters.customerGroupId)
        const products = []

        // 产品订阅
        const sendSubscribe = () => {
            if (products.length > 0) QuoteSocket.send_subscribe(products)
        }
        store.dispatch('_base/getPageConfig', 'Home').then(res => {
            console.log(res)
            pageModules.value = res

            // 找到行情模块的产品，并开始订阅
            const productModule = res.find(el => el.tag === 'productsSwipe')
            if (productModule) {
                const symbolKeys = Object.entries(productModule.data.product || {}).map(([tradeType, item]) => {
                    const list = item[customerGroupId.value] || []
                    return list.map(symbolId => `${symbolId}_${tradeType}`)
                }).flat()
                products.push(...symbolKeys)
                sendSubscribe()
            }
        })

        onActivated(() => {
            // 订阅产品
            sendSubscribe()
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

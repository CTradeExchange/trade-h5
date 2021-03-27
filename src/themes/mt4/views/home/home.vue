<template>
    <main class='productMain'>
        <Top />
        <productListComp />
    </main>
</template>

<script>
import Top from '@m/layout/top'
import productListComp from '@m/modules/productList/productList.vue'
import { socket } from '@/plugins/socket/socket'
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
    components: {
        productListComp,
        Top,
    },
    setup () {
        const store = useStore()
        const productList = computed(() => store.state._quote.productList)

        // 订阅产品
        const subscribList = productList.value.map(({ symbolId }) => symbolId)
        socket.send_subscribe(subscribList)

        store.dispatch('_quote/querySymbolBaseInfoList', {
            symbolIds: subscribList.join(),
            tradeType: store.state._base.tradeType,
        }, { root: true })
        return {}
    }
}
</script>

<style lang="scss" scoped>

</style>

<template>
    <main class='productMain'>
        <Top />
        <productListComp />
    </main>
</template>

<script>
import Top from '@m/layout/top'
import productListComp from '@m/modules/productList/productList.vue'
import { QuoteSocket } from '@/plugins/socket/socket'
import { computed } from 'vue'
import { useStore } from 'vuex'
import { getLoginParams } from '@/utils/util'

export default {
    components: {
        productListComp,
        Top,
    },
    setup () {
        // 登录之后重新初始化msg socket,否则token取不到
        // MsgSocket.initPing()

        const store = useStore()
        const productList = computed(() => store.getters['_quote/productListByUser'])
        // 订阅产品

        const subscribList = productList.value.map(({ symbolId }) => symbolId)

        if (subscribList.length > 0) {
            QuoteSocket.send_subscribe(subscribList)
            store.dispatch('_quote/querySymbolBaseInfoList', subscribList)
        }

        const loginParams = getLoginParams()

        if (loginParams) {
            store.dispatch('_trade/queryPositionPage')
        }
        return {}
    }
}
</script>

<style lang="scss" scoped>

</style>

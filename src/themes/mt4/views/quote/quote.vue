<template>
    <main class='productMain'>
        <Top>
            <template #right>
                <van-icon class='icon-add' name='plus' @click="$router.push({ name: 'Search' })" />
            </template>
        </Top>
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
        const store = useStore()
        const productList = computed(() => store.state._quote.productList)
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
@import '@/sass/mixin.scss';
.icon-add {
    font-size: rem(40px);
}
</style>

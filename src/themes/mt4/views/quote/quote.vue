<template>
    <Top>
        <template #right>
            <van-icon class='icon-add' name='plus' @click="$router.push({ name: 'Search' })" />
        </template>
    </Top>
    <productListComp />
</template>

<script>
import Top from '@m/layout/top'
import productListComp from '@m/modules/productList/productList.vue'
import { QuoteSocket } from '@/plugins/socket/socket'
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
    name: 'Quote',
    components: {
        productListComp,
        Top,
    },
    setup () {
        const store = useStore()
        const customerInfo = computed(() => store.state._user.customerInfo)
        const productList = computed(() => store.getters.userSelfSymbolList)
        // 订阅产品

        const subscribList = productList.value.map(({ symbolId }) => symbolId)

        if (subscribList.length > 0) {
            QuoteSocket.send_subscribe(subscribList)
        }

        if (customerInfo.value) {
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

<template>
    <top
        back
        :menu='false'
        :sub-title='product.symbolCode'
        :title='product.symbolName'
    />
    <div class='container'>
        <van-cell size='large' title='点差' :value='product.bidSpread' />
        <van-cell size='large' title='报价小数位' :value='product.symbolDigits' />
        <van-cell size='large' title='止损距离' :value='product.stopLossMinPoint +"-"+ product.stopLossMaxPoint' />
        <van-cell size='large' title='合约大小' :value='product.contractSize' />
        <van-cell size='large' title='盈亏计算公式' value='Forex' />
        <van-cell size='large' title='即保证金计算公式' value='Forex' />
        <van-cell size='large' title='锁仓保证金' :value='product.maxVolume' />
        <van-cell size='large' title='挂单有效期' value='Forex' />
        <van-cell size='large' title='隔夜利息类型' value='Forex' />
        <van-cell size='large' title='买入隔夜利息' :value='product.buyInterest' />
        <van-cell size='large' title='卖出隔夜利息' :value='product.sellInterest' />
        <van-cell size='large' title='保证金' value='Forex' />
        <van-cell size='large' title='交易时间' value='Forex' />
    </div>
</template>

<script>
import top from '@m/layout/top'
import { useStore } from 'vuex'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { QuoteSocket } from '@/plugins/socket/socket'
export default {
    components: {
        top,
    },
    setup () {
        const store = useStore()
        const route = useRoute()
        const symbolId = route.query.symbolId

        store.dispatch('_quote/querySymbolInfo', symbolId)
        const product = computed(() => store.state._quote.productMap[symbolId])

        QuoteSocket.send_subscribe([symbolId])
        return {
            product
        }
    }
}
</script>

<style lang="scss" scoped>
.container {
    flex: 1;
    overflow-y: auto;
}
</style>

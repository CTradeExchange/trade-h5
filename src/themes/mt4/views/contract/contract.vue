<template>
    <top
        back
        :menu='false'
        :sub-title='product.symbolCode'
        :title='product.symbolName'
    />
    <div class="container">
        <van-cell size='large' title='点差' value='浮动' />
        <van-cell size='large' title='小数位' :value='product.symbolDigits' />
        <van-cell size='large' title='止损水平' value='8' />
        <van-cell size='large' title='合约数量' :value='product.contractSize' />
        <van-cell size='large' title='利润计算公式' value='CFD' />
        <van-cell size='large' title='预付款计算公式' value='CFD' />
        <van-cell size='large' title='预付款对冲' value='50%' />
        <van-cell size='large' title='直到取消挂单' value='否' />
        <van-cell size='large' title='库存费类型' value='百分比模式' />
        <van-cell size='large' title='买入库存费' value='Forex' />
        <van-cell size='large' title='卖出库存费' value='Forex' />
        <van-cell size='large' title='卖出库存费' value='Forex' />
        <van-cell size='large' title='卖出库存费' value='Forex' />
        <van-cell size='large' title='卖出库存费' value='Forex' />
        <van-cell size='large' title='卖出库存费' value='Forex' />
        <van-cell size='large' title='卖出库存费' value='Forex' />
        <van-cell size='large' title='卖出库存费' value='Forex' />
        <van-cell size='large' title='卖出库存费' value='Forex' />
        <van-cell size='large' title='卖出库存费' value='Forex' />
        <van-cell size='large' title='卖出库存费' value='Forex' />
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
        const product = computed(() => store.state._quote.productMap[symbolId])
        store.dispatch('_quote/querySymbolInfo', symbolId)
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

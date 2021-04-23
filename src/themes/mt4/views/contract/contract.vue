<template>
    <top
        back
        :menu='false'
        :sub-title='product.symbolCode'
        :title='product.symbolName'
    />

    <div class='container'>
        <van-cell size='large' title='点差' value='浮动' />
        <van-cell size='large' title='小数位' :value='product.symbolDigits' />
        <van-cell size='large' title='止损水平' :value='product.stopLossMinPoint +"-"+ product.stopLossMaxPoint' />
        <van-cell size='large' title='合约数量' :value='product.contractSize' />
        <van-cell size='large' title='利润计算公式' value='Forex' />
        <van-cell size='large' title='预付款金计算公式' :value="Number(product.marginType) === 1 ? 'Forex': 'CFD'" />
        <van-cell size='large' title='预付款对冲' value='单边较大值' />
        <van-cell size='large' title='挂单有效期' value='当日/当周' />
        <van-cell size='large' title='库存费类型' value='百分比' />
        <van-cell size='large' title='买入库存费' :value='product.buyInterest' />
        <van-cell size='large' title='卖出库存费' :value='product.sellInterest' />
        <van-cell size='large' title='预付款' value='Forex' />
        <van-cell size='large' title='交易时间'>
            {{ product.tradeTimeList }}
            <div class='item-item'></div>
        </van-cell>
    </div>
</template>

<script>
import top from '@m/layout/top'
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
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
        const message = ref('dfsa大大阿达顶顶顶打发打发打发发发多发发顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶')
        store.dispatch('_quote/querySymbolInfo', symbolId)
        const product = computed(() => store.state._quote.productMap[symbolId])

        QuoteSocket.send_subscribe([symbolId])
        return {
            product,
            message
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

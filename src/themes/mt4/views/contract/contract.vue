<template>
    <top
        back
        :menu='false'
        :sub-title='product.symbolCode'
        :title='product.symbolName'
    />
    <div>
        <van-cell size='large' title='点差' value='浮动' />
        <van-cell size='large' title='小数位' value='5' />
        <van-cell size='large' title='止损水平' value='8' />
        <van-cell size='large' title='合约数量' value='10000' />
        <van-cell size='large' title='利润计算模式' value='Forex' />
        <van-cell size='large' title='利润计算模式' value='Forex' />
        <van-cell size='large' title='利润计算模式' value='Forex' />
        <van-cell size='large' title='利润计算模式' value='Forex' />
        <van-cell size='large' title='利润计算模式' value='Forex' />
        <van-cell size='large' title='利润计算模式' value='Forex' />
    </div>
</template>

<script>
import top from '@m/layout/top'
import { useStore } from 'vuex'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { socket } from '@/plugins/socket/socket'
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
        socket.send_subscribe([symbolId])
        return {
            product
        }
    }
}
</script>

<style lang="scss" scoped>

</style>

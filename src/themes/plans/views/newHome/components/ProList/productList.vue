<template>
    <div ref='productListEl' class='productListWrap'>
        <productItem v-for='item in productList' :key='item' :item='item' @open='openProduct(item)' />
    </div>
</template>

<script>
import { computed, nextTick, reactive, ref, toRefs, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import productItem from './productItem'
import { useRouter } from 'vue-router'
import { debounce, parseJSON } from '@/utils/util'
import { QuoteSocket } from '@/plugins/socket/socket'

export default {
    components: {
        productItem,
    },
    props: ['trades'],
    setup (props) {
        const store = useStore()
        const router = useRouter()
        const productListEl = ref(null)
        const state = reactive({
            list: [...new Array(10)],
            show: false,
            productList: []
        })
        // 产品列表
        const productMap = computed(() => store.state._quote.productMap)

        watch(() => props.trades, () => {
            if (!Array.isArray(props.trades)) return
            const tradesArr = props.trades.map(i => {
                const id = parseJSON(i.Extra)?.SymbolId
                const keyId = id ? `${id}_2` : ''
                if (keyId) return productMap.value[keyId]
                return ''
            }).filter((i, k) => i && k < 5)
            state.productList = tradesArr
        }, {
            immediate: true
        })

        const openProduct = (data) => {
            // router.push({ name: 'Order', query: { symbolId: data.symbolId, direction: 'buy' } })
            router.push(`/product?symbolId=${data.symbolId}&tradeType=${data.tradeType}`)
        }

        return {
            ...toRefs(state),
            productListEl,
            productMap,
            openProduct,

        }
    },
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.productListWrap {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    margin:rem(-5px)
}
</style>

<template>
    <div v-if='isShow' class='cardBox'>
        <div class='tradeTitle'>
            <div>{{ $t("news.relatedTrade") }}</div>
        </div>
        <ProductList :list='productList' :trade-type='2' />
    </div>
</template>

<script>
import { isEmpty, getProductList, localGet } from '@/utils/util.js'
import { ref, computed, watch, reactive, toRefs } from 'vue'
import useProduct from '@planspc/hooks/useProduct'
import { QuoteSocket } from '@/plugins/socket/socket'
import ProductList from './ProductList.vue'
import { useStore } from 'vuex'
import _ from 'lodash'

export default {
    components: { ProductList },
    props: {
        trades: {
            type: Array,
            default: () => {
                return []
            }
        }
    },

    setup (props) {
        const tradeType = ref('1')
        const categoryType = ref('1')

        const state = reactive({
            sortField: localGet('productListSortField') || '',
            sortType: localGet('productListSortType') || '',
            tradesProList: [],
            list: []
        })

        const { categoryList } = useProduct({
            tradeType, categoryType
        })

        const productList = computed(() => _.intersectionBy(state.list, state.tradesProList, 'symbolKey'))
        const isShow = computed(() => !isEmpty(state.tradesProList))
        const symbolKeys = computed(() => state.tradesProList.map(i => i.symbolKey))

        watch(symbolKeys, (n) => {
            QuoteSocket.send_subscribe24H(n)
        })

        watch(() => categoryList.value, (cList) => {
            if (isEmpty(cList)) return
            let list = []
            cList.map((item, index) => {
                const { productList: arr } = useProduct({
                    tradeType, categoryType: ref(String(index))
                })

                list = list.concat(arr.value)
            })
            state.list = list
        }, { immediate: true })

        watch(() => props.trades, (n) => {
            state.tradesProList = getProductList(n)
        }, { deep: true, immediate: true })

        return {
            isShow,
            productList,
            isEmpty,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
.cardBox {
    padding-top:30px;
    .tradeTitle {
        font-size: 36px;
        font-weight: bold;
        color: var(--mainColor);
        margin-bottom:15px;

    }
}
</style>

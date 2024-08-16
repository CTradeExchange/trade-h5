<template>
    <div v-if='isShow' class='cardBox'>
        <div class='tradeTitle'>
            <div>{{ $t("news.relatedTrade") }}</div>
        </div>
        <!--<ProductList :list='productList' :trade-type='2' />-->
        <TitleCard :info='info' />
        <TradeList class='trade-card' :trades='info.Trades' />
    </div>
</template>

<script>
import { isEmpty, getProductList, localGet } from '@/utils/util.js'
import TitleCard from './TitleCard.vue'
import TradeList from '@plans/components/TradeList'
import _ from 'lodash'
import { ref, computed, watch, reactive, toRefs } from 'vue'
import useProduct from '@planspc/hooks/useProduct'
import { QuoteSocket } from '@/plugins/socket/socket'
import { useStore } from 'vuex'

export default {
    components: { TitleCard, TradeList, },
    props: {
        trades: {
            type: Array,
            default: () => {
                return []
            }
        }
    },

    setup (props) {
        const store = useStore()
        const productListEl = ref(null)
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
    background-color: #fff;
    padding:0 30px;
    position: relative;
    overflow: hidden;
    .tradeTitle {
        font-size: 36px;
        font-weight: bold;
        color: #BB2423;
        margin-bottom:15px;
        padding-left: 20px;

    }
}
</style>

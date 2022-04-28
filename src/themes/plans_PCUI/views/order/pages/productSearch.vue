<template>
    <div class='productSearch'>
        <search
            :trade-type='tradeType'
            @onInput='onInput'
            @onSearch='onSearch'
        >
            <template v-if='searching' #default>
                <slot :list='searchList' name='list'>
                    <ProductList :list='searchList' />
                </slot>
            </template>
            <!-- 搜索结果 -->
            <template v-else #default>
                <TopTab
                    v-model='categoryType'
                    :list='categoryList'
                />
                <slot :list='productList' name='list'>
                    <ProductList :list='productList' />
                </slot>
            </template>
        </search>
    </div>
</template>

<script setup>
import { ref, computed, unref, watch, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import useProduct from '@planspc/hooks/useProduct'
import search from './components/search'
import TopTab from './components/topTab'
import ProductList from './components/ProductList'
import { QuoteSocket } from '@/plugins/socket/socket'

const props = defineProps({
    tradeType: {
        type: [String, Number],
        default: ''
    }
})

const store = useStore()
const productMap = computed(() => store.state._quote.productMap)
const productActived = computed(() => store.getters.productActived)
// 玩法类型
const tradeType = computed(() => props.tradeType || String(unref(productActived).tradeType))
// 板块类型
const categoryType = ref('1')
// 获取板块列表和所选板块的产品列表
const { categoryList, productList } = useProduct({
    tradeType, categoryType
})

const searching = ref(false)
const searchList = ref([])
const onSearch = (result) => {
    const list = []
    result.forEach(e => {
        if (!unref(productMap)[e.id + '_' + unref(tradeType)]) return
        list.push({
                ...e,
                symbolId: e.id,
                symbolKey: e.id + '_' + unref(tradeType),
                tradeType: unref(tradeType),
                symbolCode: e.code,
                symbolName: e.name
        })
    })
    searchList.value = list
}
const onInput = (val) => {
    searching.value = !!val
}
let unSubscribe = () => {}
const subscribeProducts = () => {
    const symbolList = store.state._quote.planMap[tradeType.value]?.symbolList || [] // 每个玩法下配置的产品
    const symbolKeys = symbolList.map(el => `${el}_${tradeType.value}`)
    if (symbolKeys.length === 0) return false
    console.log(symbolKeys)
    unSubscribe = QuoteSocket.add_subscribe24H({ moduleId: 'productSearch', symbolKeys })
}

watch(
    tradeType,
    (newval) => {
        categoryType.value = '1'
        subscribeProducts()
    },
    {
        immediate: true
    }
)

onBeforeUnmount(() => {
    unSubscribe()
})

</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.productSearch {
    width: 360px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    height: 100%;
    overflow: hidden;
    background: var(--contentColor);
    border-radius: 10px;
    padding: 16px 0;
    .margin {
        margin-top: rem(30px);
    }
}
</style>

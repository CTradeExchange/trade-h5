<template>
    <div id='productSearch' class='productSearch'>
        <search
            :trade-type='tradeType'
            @onChangeQuoteListType='onChangeQuoteListType'
            @onInput='onInput'
            @onSearch='onSearch'
        >
            <template v-if='searching' #default>
                <slot :list='searchList' name='list'>
                    <ProductListSpread
                        v-if='quoteListType==="block" && searchList.length > 0'
                        :list='searchList'
                        @item-click='handleItem'
                    />
                    <ProductList
                        v-else-if='searchList.length > 0'
                        :is-add-choose='isAddChoose'
                        :list='searchList'
                        @item-click='handleItem'
                    />
                    <van-empty v-if='searchList.length === 0' :description="$t('common.noData')" image='/images/empty.png' />
                </slot>
            </template>
            <!-- 搜索结果 -->
            <template v-else #default>
                <TopTab
                    v-model='categoryType'
                    :list='categoryList'
                />
                <slot :list='productList' name='list'>
                    <ProductListSpread
                        v-if='quoteListType==="block" && productList.length > 0'
                        :category-type='categoryType'
                        :list='productList'
                        @item-click='handleItem'
                    />
                    <ProductList
                        v-else-if='productList.length > 0'
                        :is-add-choose='isAddChoose'
                        :list='productList'
                        @item-click='handleItem'
                    />
                    <van-empty v-if='productList.length === 0' :description="$t('common.noData')" image='/images/empty.png' />
                </slot>
            </template>
        </search>
    </div>
</template>

<script setup>
import { ref, computed, unref, watch, onBeforeUnmount, provide, defineEmits, defineProps } from 'vue'
import { useStore } from 'vuex'
import useProduct from '@planspc/hooks/useProduct'
import search from './components/search'
import TopTab from './components/topTab'
import ProductList from './components/ProductList'
import ProductListSpread from './components/productListSpread'
import { QuoteSocket } from '@/plugins/socket/socket'
import { localGet } from '@/utils/util'

const props = defineProps({
    tradeType: {
        type: [String, Number],
        default: ''
    },
    /** 是否是自选弹窗 */
    isAddChoose: {
        type: Boolean,
    }
})

const store = useStore()
const quoteListType = computed(() => store.state._quote.quoteListType)
const productMap = computed(() => store.state._quote.productMap)
const productActived = computed(() => store.getters.productActived)
// 玩法类型
const tradeType = computed(() => props.tradeType || String(unref(productActived)?.tradeType))

// 读取本地缓存起来的分类
const categoryCacheType = localGet('add_optional_type')
// 板块类型
const categoryType = ref(categoryCacheType || '1')
// 获取板块列表和所选板块的产品列表
const { categoryList, productList } = useProduct({
    tradeType, categoryType, sortEnabled: true
})

const localSymbolUpdate = computed(() => store.state._user.localSelfSymbolList)

const searching = ref(false)
const searchList = ref([])
const onSearch = (result) => {
    const list = []
    result.forEach(e => {
        const product = unref(productMap)[e.id + '_' + unref(tradeType)]
        if (!product) return
        list.push(product)
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
    const quoteListType = store.state._quote.quoteListType
    if (symbolKeys.length === 0 || quoteListType === 'block') return false

    // console.log(symbolKeys)
    unSubscribe = QuoteSocket.add_subscribe24H({ moduleId: 'productSearch', symbolKeys })
}

// 根据当前页面的产品设置当前产品分类
const setCurCategoryType = () => {
    const { tradeType, symbolId } = store.getters.productActived
    const categoryList = store.getters.userProductCategory[tradeType] || []
    categoryList.forEach((el, i) => {
        const id = el.listByUser.find(id => parseInt(id) === symbolId)
        if (id) {
            categoryType.value = String(i + 1)
        }
    })
}

// 监听列表样式的类型变化
const onChangeQuoteListType = (type) => {
    if (type === 'normal') {
        // 取消之前列表的所有实时报价
        // 订阅当前图表产品的实时报价
        QuoteSocket.send_subscribe([store.getters.productActived.symbolKey])

        // 订阅24H滚动报价
        subscribeProducts()
    } else {
        // 取消之前列表的所有24H报价
        // 订阅当前图表产品的24H报价
        QuoteSocket.send_subscribe24H([store.getters.productActived.symbolKey])
    }
}

const emit = defineEmits(['item-click'])
const handleItem = (item) => {
    emit('item-click', item)
}

provide('isReLoadProductSearch', (value, productId) => {
    // if (value === true) {
    //     const tempCur = categoryType.value
    //     categoryType.value = categoryType.value === '1' ? '0' : '1'
    //     categoryType.value = tempCur
    // }
})

watch(
    productActived,
    (val) => {
        // setCurCategoryType()
        subscribeProducts()
    },
    {
        immediate: true
    }
)

watch(
    () => localSymbolUpdate.value, list => {
        // if (unref(categoryType) === '0') {
        const tempCur = categoryType.value
        categoryType.value = categoryType.value === '1' ? '0' : '1'
        categoryType.value = tempCur
        // }
    }
)

onBeforeUnmount(() => {
    unSubscribe()
})

</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.productSearch {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    height: 100%;
    padding: 16px 0;
    overflow: hidden;
    background: var(--contentColor);
    border-radius: 10px;
    .margin {
        margin-top: rem(30px);
    }
    :deep(.tabs) {
        padding: 0;
        .el-tabs__item {
            font-size: 12px;
        }
    }
}
</style>

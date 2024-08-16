<template>
    <div ref='root' class='product-search-container'>
        <div class='product-search-header'>
            <van-search v-model='searchKeyword' autocomplete='off' :placeholder="$t('common.searchPlaceholder')" />
            <div v-if='(searchResults.length === 0 && !searchKeyword.length) || !searchKeyword.length' class='product-category'>
                <div
                    v-for='(category, index) in categoryList'
                    :key='category.id'
                    :class='{ active: activeCategory == index }'
                    @click='activeCategory = index'
                >
                    {{ category.title }}（{{ category?.listByUser?.length || 0 }}）
                </div>
            </div>
        </div>
        <div class='product-search-content'>
            <van-empty v-if='searchKeyword && searchResults.length === 0'>
                <template #description>
                    <div class='text-center'>
                        {{ $t('common.resultNotFound') }} &nbsp;
                        <strong>&quot;{{ searchKeyword }}&quot;</strong>
                        .
                        <br />
                        {{ $t('common.checkSpelling') }}
                    </div>
                </template>
            </van-empty>
            <template v-else>
                <div
                    v-for='item in searchKeyword ? searchResults : products'
                    :key='item.symbolId'
                    class='product-item'
                    :class="{ select: product.symbolId === item.symbolId, 'pl-3': !showFavorite }"
                    @click='selectProduct(item)'
                >
                    <div
                        v-if='showFavorite'
                        class='cursor-pointer pr-2 pl-2 h-full flex items-center justify-center'
                        @click.stop='toggleFavorite(item)'
                    >
                        <van-icon
                            :color="isCollected(item.tradeType, item.symbolId) ? 'var(--focusColor)' : 'var(--color)'"
                            :name="isCollected(item.tradeType, item.symbolId) ? 'star' : 'star-o'"
                            size='20'
                        />
                    </div>
                    <div class='flex items-center'>
                        <product-icon :symbol-key='item.symbolKey' />
                        <div class='product-name ml-2 truncate'>
                            {{ item.symbolName }}
                        </div>
                    </div>
                    <div class='flex-1 text-right price-info'>
                        <div class='price' :class='productMap[item.symbolKey]?.last_color'>
                            {{ productMap[item.symbolKey]?.rolling_last_price || '- -' }}
                        </div>
                        <div class='rolling' :class='productMap[item.symbolKey]?.rolling_upDownColor'>
                            {{ productMap[item.symbolKey]?.rolling_upDownWidth || '- -' }}
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import { computed, watch, ref, defineProps, unref, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { isEmpty, localGet, debounce, localSet } from '@/utils/util'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { addCustomerOptional, removeCustomerOptional, getSymbolList } from '@/api/trade'
import productIcon from '@/components/product-icon.vue'
import { useRouter, useRoute } from 'vue-router'
import { QuoteSocket } from '@/plugins/socket/socket'
import { onClickOutside } from '@vueuse/core'

const props = defineProps({
    showFavorite: {
        type: Boolean,
        default: true,
    },
    onSelect: {
        type: Function,
    },
})

const store = useStore()
const router = useRouter()
const route = useRoute()
const { t } = useI18n({ useScope: 'global' })

const root = ref(null)
// 正在操作的产品loading列表
const operationList = ref([])
const customerInfo = computed(() => store.state._user.customerInfo)
const product = computed(() => store.getters.productActived)
const tradeType = computed(() => store.state._base.tradeType)
const productMap = computed(() => store.state._quote.productMap)
const productSearchVisible = computed(() => store.state._trade.productSearchVisible)
const selfSymbolList = computed(() => store.state._user.selfSymbolList)
const localSelfSymbolList = computed(() => store.state._user.localSelfSymbolList)
const bitcoinId = computed(() => store.state._quote.bitcoinId)

/**
 * 产品列表
 * 排序优先级
 * 1、点击收藏的显示在最顶部，按crypto/商品/外汇排序
 * 默认收藏为wordpress配置的6个，可修改
 * 2、未点击收藏，按crypto/商品/外汇排序
 * 3、crypto排序 btc/usdt，eth/usdt 为前2名
 * 4、商品排序 gold usoil为前2
 * 5、外汇排序 USD/JPY，USD/CAD，EUR/USD，EUR/JPY为前4名
 */
const productList = computed(() => {
    const newsSysConfig = store.state._base.newsSysConfig
    const productSorting = JSON.parse(newsSysConfig && newsSysConfig.find((o) => o.Key === 'productSorting').Value) || []

    // 获取当前交易类型的产品列表
    const getProductListByType = (typeChecker) => {
        return store.state._quote.productList.filter((item) => Number(item.tradeType) == tradeType.value && typeChecker(item))
    }

    // 通用排序函数
    const sortProducts = (products) => {
        return products.sort((a, b) => {
            const indexA = productSorting.indexOf(Number(a.symbolId))
            const indexB = productSorting.indexOf(Number(b.symbolId))
            if (indexA === -1 && indexB === -1) {
                // 如果两个ID都不在order数组中，保持原来的顺序
                return 0
            } else if (indexA === -1) {
                // 如果a的ID不在order数组中，排在后面
                return 1
            } else if (indexB === -1) {
                // 如果b的ID不在order数组中，排在后面
                return -1
            } else {
                // 按order数组中的顺序排序
                return indexA - indexB
            }
        })
    }

    // 获取并排序不同类型的产品列表
    const cryptoProducts = sortProducts(getProductListByType((item) => item.isCryptocurrency))
    const forexProducts = sortProducts(getProductListByType((item) => item.isFX))
    const commodityProducts = sortProducts(getProductListByType((item) => !item.isCryptocurrency && !item.isFX))

    // 合并所有产品列表
    const allProducts = [...cryptoProducts, ...commodityProducts, ...forexProducts]

    // 获取自选列表
    const selfList = allProducts.filter((item) => {
        if (!customerInfo.value) {
            // 未登录取本地自选
            return localSelfSymbolList.value.includes(item.symbolKey)
        } else {
            // 已登录取接口自选
            const list = selfSymbolList.value?.[tradeType.value] || []
            return list.some((el) => el.symbolId === item.symbolId)
        }
    })

    // 获取非自选列表
    const uniqueProductList = allProducts.filter((item) => !selfList.some((el) => el.symbolId === item.symbolId))

    // 返回最终排序的列表
    return [...selfList, ...uniqueProductList]
})

// 当前分类产品列表
const products = computed(() => {
    const currentCategory = categoryList.value[activeCategory.value]
    return productList.value.filter((item) => currentCategory.listByUser.indexOf(String(item.symbolId)) !== -1)
})

const activeCategory = ref(localGet('add_optional_type') || '0')
const userProductCategory = computed(() => store.getters.userProductCategory)

// 所选玩法的板块列表
const categoryList = computed(() => {
    const tradeTypeQuote = (unref(userProductCategory)[unref(tradeType)] || [])
        .filter((e) => e.listByUser.length)
        .sort((a, b) => {
            // 加密货币排在前面
            if (a.listByUser.includes(String(bitcoinId.value))) return -1
            return 0
        })
    const all = {
        title: t('c.all'),
        id: 'all',
        listByUser: tradeTypeQuote.map((item) => item.listByUser).flat(),
    }
    return [all, ...tradeTypeQuote]
})

const searchKeyword = ref('')
const searchResults = ref([])
const loading = ref(false)

if (window.isPC) {
    onClickOutside(
        root,
        (event) => {
            // 外部点击关闭弹窗
            if (productSearchVisible.value) {
                changeDialogVisibility(false)
            }
        },
        { ignore: ['.product-search-popup-trigger'] },
    )
}

onUnmounted(() => {
    changeDialogVisibility(false)
})

watch(
    () => products.value,
    (value) => {
        // 订阅24小时报价
        if (value?.length) {
            QuoteSocket.send_subscribe24H(value.map((item) => item.symbolKey))
        }
    },
    {
        immediate: true,
    },
)

watch(
    () => searchResults.value,
    (value) => {
        if (value?.length) {
            QuoteSocket.send_subscribe24H(value.map((item) => item.symbolKey))
        }
    },
)

watch(productSearchVisible, (value) => {
    if (value) {
        searchKeyword.value = ''
        activeCategory.value = localGet('add_optional_type') || '0'
    }
})

watch(searchKeyword, (value) => {
    if (value) {
        loading.value = true
        performSearch(value)
    }
})

const changeDialogVisibility = (isVisible) => {
    store.commit('_trade/Update_productSearchVisible', isVisible)
}

const performSearch = debounce((keyword) => {
    getSymbolList({ name: keyword, customerGroupId: store.getters.customerGroupId, tradeType: tradeType.value })
        .then((res) => {
            if (res.check()) {
                searchResults.value = productList.value.filter((item) => res.data.find((el) => el.code === item.symbolCode))
            }
        })
        .finally(() => {
            loading.value = false
        })
})

const selectProduct = (product) => {
    changeDialogVisibility(false)
    if (props?.onSelect) {
        return props.onSelect(product)
    }
    localSet('add_optional_type', activeCategory.value)
    store.commit('_quote/Update_productActivedID', `${product.symbolId}_${product.tradeType}`)
    router.replace({
        query: {
            ...route.query,
            name: product.symbolName.replace(/ /g, '_'),
            symbolId: product.symbolId,
            tradeType: product.tradeType,
        },
    })
}

const isCollected = (tradeType, symbolId) => {
    if (isEmpty(customerInfo.value)) {
        const newId = `${symbolId}_${tradeType}`
        return localSelfSymbolList.value.includes(newId)
    } else {
        return selfSymbolList.value[tradeType]?.some((el) => el.symbolId === parseInt(symbolId))
    }
}

const toggleFavorite = (product) => {
    const { symbolId, tradeType } = product
    if (!customerInfo.value) {
        const localList = localGet('selfSymbolListStorage') ? JSON.parse(localGet('selfSymbolListStorage')) : []
        const newId = `${symbolId}_${tradeType}`
        const index = localList.indexOf(newId)
        if (index > -1) {
            localList.splice(index, 1)
            ElMessage.success(t('trade.removeOptionalOk'))
        } else {
            localList.push(newId)
            ElMessage.success(t('trade.addOptionalOk'))
        }
        store.dispatch('_user/queryLocalCustomerOptionalList', localList)
    } else {
        if (operationList.value.includes(symbolId)) return
        operationList.value.push(symbolId)
        if (isCollected(tradeType, symbolId)) {
            for (const key in selfSymbolList.value) {
                const index = selfSymbolList.value[key].findIndex((el) => el.symbolId === parseInt(symbolId))
                if (index > -1) {
                    selfSymbolList.value[key].splice(index, 1)
                }
            }
            store.commit('_user/Update_selfSymbolList', selfSymbolList.value)
            removeCustomerOptional({ symbolList: [symbolId], tradeType })
                .then((res) => {
                    if (res.check()) {
                        ElMessage.success(t('trade.removeOptionalOk'))
                    }
                })
                .finally(() => {
                    operationList.value = operationList.value.filter((item) => item !== symbolId)
                })
        } else {
            if (!selfSymbolList.value[tradeType]) {
                selfSymbolList.value[tradeType] = []
            }

            addCustomerOptional({ symbolList: [symbolId], tradeType })
                .then((res) => {
                    if (res.check()) {
                        selfSymbolList.value[tradeType].push(product)
                        store.commit('_user/Update_selfSymbolList', selfSymbolList.value)
                        store.commit('_user/Update_optional', 1)
                        ElMessage.success(t('trade.addOptionalOk'))
                    }
                })
                .finally(() => {
                    operationList.value = operationList.value.filter((item) => item !== symbolId)
                })
        }
    }
}
</script>

<style lang="scss">
.product-search-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    .van-icon-star-o {
        cursor: pointer;
        transition: transform 0.05s ease-in-out;
        &:hover {
            transform: scale(1.2);
        }
        &:active {
            transform: scale(1);
        }
    }
}

.product-search-header {
    padding: 8px 8px 0 8px;
    border-bottom: 1px solid var(--lineColor);

    .van-search {
        padding: 0;
    }

    .van-search__content {
        padding-left: 0;

        .van-search__field {
            background-color: var(--assistColor);
            border-radius: 4px;
            border: 1px solid var(--lineColor);

            &:focus-within {
                border-color: var(--primary);
            }
        }
    }

    .product-category {
        display: flex;
        flex-wrap: wrap;
        margin-top: 8px;

        > div {
            border: 1px solid var(--lineColor);
            padding: 6px 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 700;
            border-radius: 2px;
            color: var(--normalColor);
            line-height: 1;
            user-select: none;
            margin-right: 8px;
            margin-bottom: 8px;
            &.active {
                color: var(--primary);
            }
        }
    }
}

.product-search-content {
    flex: 1;
    overflow-y: auto;
    --van-empty-description-padding: 0 20px;
    --van-skeleton-row-height: 48px;
    @include scroll-bar-vertical;
    .van-skeleton__row {
        width: 100% !important;
    }
    .van-skeleton {
        padding: 0 8px;
    }
    .product-item {
        width: 100%;
        position: relative;
        cursor: pointer;
        display: flex;
        align-items: center;
        height: 56px;
        padding-right: 12px;

        &:hover,
        &.select {
            background-color: var(--primaryAssistColor);
        }

        .product-name {
            font-weight: 700;
            font-size: 16px;
        }

        .price-info {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
        }

        .price {
            font-size: 16px;
            font-weight: 700;
            line-height: 1;
            margin-bottom: 6px;
        }

        .rolling {
            font-size: 12px;
            line-height: 1;
            text-transform: uppercase;
        }
    }
}
</style>

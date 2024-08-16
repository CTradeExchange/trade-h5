<template>
    <div class='content'>
        <div class='header'>
            <PlansType v-model='tradeType' />
            <Autocomplete :trade-type='tradeType' />
        </div>
        <div
            v-if="tradeBanner.state == 1 && itemDetail"
            :style="{ backgroundImage: 'url(' + (itemDetail?.CoverPC || itemDetail?.CoverURL) + ')' }"
            class="quote-banner"
            @click="handleItemDetail"
        >
            <div>
                <h4 :style="{ color: tradeBanner?.textColor || '#EDBE2C' }">{{ itemDetail?.ItemLanguages[0]?.Title }}</h4>
            </div>
        </div>
        <CategoryList v-model='categoryType' :list='computedCategoryList' />
        <div class='productWrapper'>
            <ProductList v-if='tradeType' :list='productList' :trade-type='tradeType' :category-type="categoryType" />
            <div v-if='categoryType === "0" && productList.length === 0' class='AddToOptional'>
                <van-button plain size='small' type='primary' @click='goAddOptional'>
                    <van-icon name='add' /> {{ $t('trade.addToOptional') }}
                </van-button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, unref, computed, onUnmounted, onMounted, onBeforeMount, provide } from 'vue'
import PlansType from './PlansType'
import useProduct from '@planspc/hooks/useProduct'
import { QuoteSocket } from '@/plugins/socket/socket'
import ProductList from './ProductList'
import CategoryList from './CategoryList'
import Autocomplete from './Autocomplete'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { getCookie, parseJSON } from '@/utils/util'
import { GetItemByID } from '@/api/newApi'

const store = useStore()
const router = useRouter()
const tradeType = ref('')
const itemDetail = ref(null)
const productListData = ref([])

// 获取板块列表和所选板块的产品列表
const categoryType = ref('1')
const { categoryList, productList } = useProduct({
    tradeType, categoryType
})

const planMap = computed(() => store.state._quote.planMap) // 每个玩法下配置的产品

provide('isReLoadProductList', (value, productId) => {
    if (value === true) {
        const ArrPro = unref(productListData).value
        const tempCur = categoryType.value
        categoryType.value = categoryType.value === '1' ? '0' : '1'
        categoryType.value = tempCur
    }
})

const computedCategoryList = computed((el) => {
    const list = [...unref(categoryList)]
    list.forEach(el => {
        if (el.id === 'selfSymbol') {
            el.slot = {
                label: <div>
                            <span class="icon iconfont icon_lansezixuan"></span>
                            <span>
                                {el.title}
                            </span>
                        </div>
            }
        }
    })
    return list
})

// 需要订阅的产品列表
const subscribeSymbolsList = computed(() => {
    const symbolList = planMap.value[tradeType.value]?.symbolList || []
    const symbolKeys = symbolList.map(symbolId => `${symbolId}_${tradeType.value}`).sort((a, b) => a.localeCompare(b))
    return symbolKeys
})

const tradeBanner = computed(() => {
    const arr = store.state._base.newsSysConfig
    const obj = arr.find(i => i.Key === 'quoteBanner') || {}
    return parseJSON(obj.Value) || {}
})

watch(tradeBanner, () => {
    const { jumpValue } = tradeBanner.value || {}
    if (!jumpValue) return
    GetItemByID({
        body: {
            ID: Number(jumpValue),
            Language: getCookie('lang')
        } 
    }).then(res => {
        itemDetail.value = res.Item
    })
}, {
    immediate: true
})

const handleItemDetail = () => {
    const { jumpType, jumpValue } = tradeBanner.value
    if (!jumpValue) return
    const url = jumpType == 1 ? `infoDetail` : `economicCalendar`
    router.push(`/${url}?id=${jumpValue}`)
}

const moduleId = 'quote_' + Date.now()
let unSubscribe = () => {}

watch(
    () => unref(tradeType),
    () => {
        categoryType.value = '1'
        if (unref(subscribeSymbolsList).length === 0) return false
        unSubscribe = QuoteSocket.add_subscribe24H({ moduleId, symbolKeys: subscribeSymbolsList.value })
    }
)

const initList = () => {
    productListData.value = ref(productList)
}

const goAddOptional = () => {
    categoryType.value = '1'
}

onBeforeMount(() => {
    initList()
})

onUnmounted(() => {
    unSubscribe()
})

</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    margin-bottom: 80px;
    padding-bottom: 20px;
    background: var(--contentColor);
    border-radius: 10px;
    .header {
        position: relative;
        display: flex;
        flex: 0 0 56px;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 0 20px;
        line-height: 56px;
        &::after {
            position: absolute;
            bottom: -1px;
            left: 0;
            z-index: var(--el-index-normal);
            width: 100%;
            height: 3px;
            background-color: var(--assistColor);
            content: '';
        }
    }
    .icon_lansezixuan {
        margin-right: 5px;
        font-size: 14px;
    }
}
.quote-banner {
    width: 1250px;
    height: 140px;
    max-width: 100%;
    margin: 24px auto 0;
    border-radius: 8px;
    background-repeat: no-repeat;
    background-size: cover;
    overflow: hidden;
    & > div {
        width: 100%;
        height: 100%;
        background: rgba(1, 1, 1, 0.35);
        padding: 24px;
        display: flex;
        align-items: center;
        cursor: pointer;
        & > h4 {
            line-height: 1.8;
            font-size: 28px;
            color: #EDBE2C;
            text-align: center;
            word-break: keep-all !important;
            @include ellipsisLn(2);
        }
    }
}
.productWrapper {
    width: 100%;
    position: relative;
    max-width: 100%;
    overflow-x: auto;
}
.AddToOptional {
    position: absolute;
    top: 45%;
    right: 20%;
    left: 20%;
    z-index: 9;
    display: inline-block;
    margin: 0 0 20px;
    text-align: center;
    .van-button {
        width: 200px;
        height: 80px;
        color: var(--primary);
        font-weight: bold;
        font-size: 18px;
        line-height: 80px;
        background: var(--contentColor);
        border: none;
        transition: ease-in 0.2s;
        &:hover {
            background: var(--assistColor);
        }
    }
}
</style>

<template>
    <div class='quoteWrap'>
        <div v-if='categoryList.length > 0' class='tradeNav'>
            <TopTab
                ref='tabList'
                v-model='activeTab'
                :background='$style.contentColor'
                class='tradeSortNav'
                :dot='true'
                line-height='0'
                line-width='0'
                :list='categoryList'
                @change='tabChange'
                @tabClick='tabClick'
            />
        </div>
        <div class='titleBar van-hairline--bottom'>
            <span class='item'>
                {{ $t('trade.nameCode') }}
            </span>
            <span class='item'>
                {{ $t('trade.sellPrice') }}
            </span>
            <span class='item'>
                {{ $t('trade.buyPrice') }}
            </span>
        </div>
        <productListComp v-if='productList.length' :product-list='productList' />
    </div>
</template>

<script>
import TopTab from './topTab'
import productListComp from '@c/modules/productList/productList.vue'
import { computed, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'

export default {
    name: 'Quote',
    components: {
        productListComp,
        TopTab,
    },
    setup () {
        const store = useStore()
        const customerGroupId = computed(() => store.getters.customerGroupId)
        const productMap = computed(() => store.state._quote.productMap)
        // 板块分类列表
        const categoryList = computed(() => {
            const wpProductCategory = store.state._base.wpProductCategory || []
            const quoteList = wpProductCategory.find(el => el.tag === 'quoteList')
            if (!quoteList) return []
            const resultList = quoteList.data.items.map(el => {
                return {
                    id: el.id,
                    title: el.title,
                    list: el.code_ids_all[customerGroupId.value]
                }
            })
            return resultList
        })
        // 当前板块下的产品列表
        const productList = computed(() => {
            const list = categoryList.value[state.activeTab]?.list || []
            const products = []
            const productMapVal = productMap.value
            list.forEach(el => {
                if (productMapVal[el]?.symbolName) products.push(productMapVal[el])
            })
            return products
        })

        const state = reactive({
            activeTab: 0,
        })
        const tabChange = (i) => {}
        const tabClick = (i) => {}
        return {
            ...toRefs(state),
            categoryList,
            productList,
            tabChange,
            tabClick,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.quoteWrap {
    flex: 1;
    width: 100%;
    margin-top: rem(90px);
    padding-bottom: rem(100px);
    overflow: auto;
    background: var(--bgColor);
}
.tradeNav {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    //padding-bottom: rem(10px);
    background-color: var(--contentColor);
    //border-bottom: solid 4px var(--lineColor);
    .van-tab {
        background: yellow !important;
    }
}
.titleBar {
    display: flex;
    height: rem(60px);
    padding: 0 rem(30px);
    color: var(--minorColor);
    font-size: rem(20px);
    line-height: rem(60px);
    background-color: var(--contentColor);
    .item {
        width: rem(210px);
        text-align: right;
        &:first-child {
            flex: 1;
            text-align: left;
        }
        &:nth-child(2) {
            width: rem(210px);
            text-align: left;
        }
    }
}
</style>

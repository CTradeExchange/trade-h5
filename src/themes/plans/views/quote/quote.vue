<template>
    <div class='quoteWrap'>
        <plansType :value='planType' @change='handlePlayType' />
        <div class='tradeNav'>
            <TopTab
                ref='tabList'
                v-model='categoryType'
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
        <productListComp v-if='productList.length' ref='productListEl' :product-list='productList' />
    </div>
</template>

<script>
import TopTab from '@plans/components/topTab'
import productListComp from '@plans/modules/productList/productList.vue'
import { ref, watch } from 'vue'
import plansType from '@/themes/plans/components/plansType.vue'
import useProduct from '@plans/hooks/useProduct'

export default {
    name: 'Quote',
    components: {
        productListComp,
        TopTab,
        plansType
    },
    setup () {
        const productListEl = ref(null)

        // 1.玩法类型
        const planType = ref(1)
        // 2.板块类型
        const categoryType = ref(0)
        // 监听玩法类型
        const handlePlayType = (val) => {
            planType.value = val
            categoryType.value = 0
        }

        // 获取板块列表和所选板块的产品列表
        const { categoryList, productList } = useProduct({
            planType, categoryType
        })

        // 监听玩法类型/板块类型的变化，触发产品订阅
        // 获取productList.vue组件的ref对象和产品列表均是异步，所以第一次产品订阅在productList.vue组件内
        watch(
            [planType, categoryType],
            () => {
                if (productListEl.value) productListEl.value.calcProductsDebounce()
            }
        )

        const tabChange = (i) => {}
        const tabClick = (i) => {}

        const showSidebar = ref(false)

        return {
            categoryType,
            productListEl,
            categoryList,
            productList,
            tabChange,
            tabClick,
            handlePlayType,
            planType,
            showSidebar
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.quoteWrap {
    flex: 1;
    width: 100%;
    // margin-top: rem(90px);
    padding-bottom: rem(100px);
    overflow: auto;
    background: var(--bgColor);
}
.tradeNav {
    // position: absolute;
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

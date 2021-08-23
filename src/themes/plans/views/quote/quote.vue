<template>
    <div class='quoteWrap'>
        <plansType v-if='plansList.length>1' :list='plansList' :value='tradeType' @change='handleTradeType' />
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
            <van-icon name="search" @click="openSearch"/>
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
import { ref, watch, computed, onActivated } from 'vue'
import plansType from '@/themes/plans/components/plansType.vue'
import useProduct from '@plans/hooks/useProduct'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
    name: 'Quote',
    components: {
        productListComp,
        TopTab,
        plansType
    },
    setup () {
        const store = useStore()
        const router = useRouter()
        const productListEl = ref(null)
        // 玩法列表
        const plansList = computed(() => store.state._base.plans)

        // 1.玩法类型
        const tradeType = ref(plansList.value[0].id)
        // 2.板块类型
        const categoryType = ref(0)
        // 监听玩法类型
        const handleTradeType = (val) => {
            tradeType.value = val
            categoryType.value = 0
        }

        // 获取板块列表和所选板块的产品列表
        const { categoryList, productList } = useProduct({
            tradeType, categoryType
        })

        // 监听玩法类型/板块类型的变化，触发产品订阅
        // 获取productList.vue组件的ref对象和产品列表均是异步，所以第一次产品订阅在productList.vue组件内
        watch(
            [tradeType, categoryType],
            () => {
                if (productListEl.value) productListEl.value.calcProductsDebounce()
            }
        )

        onActivated(() => {
            if (productListEl.value) productListEl.value.calcProductsDebounce()
        })

        const tabChange = (i) => {}
        const tabClick = (i) => {}

        const showSidebar = ref(false)
        const openSearch = ()=>{
            router.push('/productSearch')
        }
        return {
            openSearch,
            categoryType,
            productListEl,
            plansList,
            categoryList,
            productList,
            tabChange,
            tabClick,
            handleTradeType,
            tradeType,
            showSidebar
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.quoteWrap {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: flex-start;
    width: 100%;
    // margin-top: rem(90px);
    padding-bottom: rem(100px);
    overflow: auto;
    background: var(--bgColor);
    .productListWrap {
        flex: 1;
        overflow-y: auto;
    }
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
    .tradeSortNav {
        padding-right: rem(64px) !important;
    }
    i {
        position: relative;
        right: rem(40px);
        bottom: rem(60px);
        float: right;
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
    &::after {
        border-color: var(--bgColor);
    }
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

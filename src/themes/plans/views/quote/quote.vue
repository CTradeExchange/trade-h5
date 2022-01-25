<template>
    <div class='quoteWrap' :class='{ hasNav: $hasNav }'>
        <plansType v-if='plansLen>1' :list='plansList' :value='tradeType' @change='handleTradeType' />
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
            <!-- <van-icon class='iconSearch' name='search' @click='openSearch' /> -->
            <i class='icon_sousuo iconSearch' @click='openSearch'></i>
        </div>

        <!-- etf banner -->
        <a v-if='categoryType===2 && tradeType==="5"' class='etfBanner' href='javascript:;' @click='toETF'>
            <img alt='' :src='locale==="en-US" ?"/images/ETF_banner2.png":"/images/ETF_banner.png"' />
        </a>

        <div class='titleBar van-hairline--bottom'>
            <span class='item'>
                {{ $t('trade.nameCode') }}
            </span>
            <span class='item'>
                {{ $t('trade.buyPrice') }}
            </span>
            <span class='item'>
                {{ $t('trade.sellPrice') }}
            </span>
        </div>
        <productListComp v-if='productList.length' ref='productListEl' :product-list='productList' />
    </div>
</template>

<script>
import TopTab from '@plans/components/topTab'
import productListComp from '@plans/modules/productList/productList.vue'
import { ref, watch, computed, onActivated, unref, nextTick } from 'vue'
import plansType from '@/themes/plans/components/plansType.vue'
import useProduct from '@plans/hooks/useProduct'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
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
        const { t, locale } = useI18n({ useScope: 'global' })
        console.log(locale)
        const productListEl = ref(null)
        // 玩法列表
        const isWallet = store.state._base.wpCompanyInfo.isWallet
        const plansList = computed(() =>
            store.state._base.plans.filter(e => !(e.tradeType === '5' && isWallet))
                .map(el => {
                    el.name = t('tradeType.' + el.tradeType)
                    return el
                })
        )
        const symbolKey = computed(() => store.state._quote.productActivedID || '')
        const productTradeType = computed(() => unref(symbolKey).split('_')[1] || 0)
        // 1.玩法类型
        const tradeType = ref(unref(productTradeType))
        // 2.板块类型
        const categoryType = ref(0)
        // 获取板块列表和所选板块的产品列表
        const { categoryList, productList } = useProduct({
            tradeType, categoryType
        })
        const plansLen = computed(() => {
            const userProductCategory = store.getters.userProductCategory
            let arr = Object.keys(userProductCategory)
            arr = arr.filter(el => {
                return userProductCategory[el]?.find(o => o.listByUser?.length)
            })
            return arr.length
        })

        // 监听玩法类型
        const handleTradeType = async (val) => {
            tradeType.value = val
            categoryType.value = 0
            await nextTick()
            unref(productList).length && store.commit('_quote/Update_productActivedID', unref(productList)[0].symbolId + '_' + val)
        }

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
        const openSearch = () => {
            router.push(`/productSearch?tradeType=${tradeType.value}`)
        }

        // 进入基金产品列表页面
        const toETF = () => {
            store.commit('del_cacheViews', 'FundProductList')
            router.push('/fundProductList')
        }
        return {
            locale,
            openSearch,
            categoryType,
            productListEl,
            plansLen,
            plansList,
            categoryList,
            productList,
            tabChange,
            tabClick,
            handleTradeType,
            tradeType,
            toETF,
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
    height: 100%;
    flex-direction: column;
    justify-content: flex-start;
    width: 100%;
    // margin-top: rem(90px);
    overflow: auto;
    background: var(--bgColor);
    &.hasNav{
        padding-bottom: rem(100px);
    }
    .productListWrap {
        flex: 1;
        overflow-y: auto;
    }
}
.tradeNav {
    position: relative;
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
    .iconSearch {
        position: absolute;
        top: rem(30px);
        right: rem(28px);
        font-size: rem(32px);
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
.etfBanner{
    display: block;
    padding: 4px 0;
    background: var(--contentColor);
    img{
        display: block;
        width: 100%;
    }
}
</style>

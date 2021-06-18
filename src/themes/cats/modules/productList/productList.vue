<template>
    <div ref='productListEl' class='pageWrap'>
        <productItem v-for='item in productList' :key='item' :product='productMap[item.symbolId]' @open='openProduct(item)' />
    </div>
    <van-popup v-model:show='show'>
        <section class='popContainer'>
            <p class='title'>
                {{ cur.symbolName }}
            </p>
            <div class='menulist'>
                <a class='item of-1px-bottom ' href='javascript:;' @click='toOrder'>
                    {{ $t('trade.newTrade') }}
                </a>
                <a class='item of-1px-bottom ' href='javascript:;' @click='toChart()'>
                    {{ $t('trade.openChart') }}
                </a>
                <a class='item of-1px-bottom ' href='javascript:;' @click='toContract'>
                    {{ $t('trade.contract') }}
                </a>
                <a v-if='quoteMode===2' class='item of-1px-bottom ' href='javascript:;' @click='switchQuoteMode'>
                    {{ $t('trade.simpleMode') }}
                </a>
                <a v-else class='item of-1px-bottom ' href='javascript:;' @click='switchQuoteMode'>
                    {{ $t('trade.highMode') }}
                </a>
            </div>
        </section>
    </van-popup>
</template>

<script>
import { computed, nextTick, reactive, ref, toRefs, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import productItem from './productItem'
import { useRouter } from 'vue-router'
import { debounce, localSet } from '@/utils/util'
import { QuoteSocket } from '@/plugins/socket/socket'

export default {
    components: {
        productItem,
    },
    setup () {
        const store = useStore()
        const router = useRouter()
        const productListEl = ref(null)
        const state = reactive({
            list: [...new Array(10)],
            show: false,
            cur: {},
        })

        let symbolId = null
        // 行情列表模式 1高级模式 2简单模式
        const productMap = computed(() => store.state._quote.productMap)
        const quoteMode = computed(() => store.state.quoteMode)
        // 产品列表
        const productList = computed(() => store.getters.userSelfSymbolList.filter(el => productMap.value[el.symbolId] && productMap.value[el.symbolId].symbolName))
        // 切换行情列表模式
        const switchQuoteMode = () => {
            store.commit('Update_quoteMode', quoteMode.value === 1 ? 2 : 1)
            state.show = false
        }
        // 点击某个产品
        const openProduct = (item) => {
            symbolId = item.symbolId
            store.commit('_quote/Update_productActivedID', symbolId)
            state.cur = item
            state.show = true
        }
        // 去交易
        const toOrder = () => {
            router.push({ name: 'Order', query: { symbolId } })
        }
        // 去合约属性
        const toContract = () => {
            router.push({ name: 'Contract', query: { symbolId } })
        }

        // 去图表
        const toChart = () => {
            state.show = false
            localSet('symbolIdForChart', symbolId)
            router.push('/chart')
        }

        // 订阅当前屏和上半屏、下半屏的产品报价，给上层组件使用
        const calcSubscribeProducts = () => {
            const el = productListEl.value
            if (!el || el.children.length === 0) return []
            const elHeight = el.clientHeight
            const scrollTop = el.scrollTop
            const itemHeight = el.firstElementChild.offsetHeight
            const productsScreen = Math.ceil(elHeight / itemHeight) // 一屏显示的产品数
            let start = Math.floor(scrollTop / itemHeight) // 显示的第一个产品
            start -= productsScreen / 2
            start = Math.max(start, 0)
            const end = Math.round(start + productsScreen * 2)
            const subscribeArr = productList.value.slice(start, end).map(({ symbolId }) => symbolId)
            // console.log('订阅产品', subscribeArr)
            return subscribeArr
        }
        const calcProductsDebounce = debounce(() => {
            const subscribList = calcSubscribeProducts()
            if (subscribList.length > 0) QuoteSocket.send_subscribe(subscribList)
        })

        watch(
            () => productList.value.length,
            async () => {
                await nextTick()
                const subscribList = calcSubscribeProducts()
                if (subscribList.length > 0) QuoteSocket.send_subscribe(subscribList)
            },
            { immediate: true }
        )

        onMounted(() => {
            productListEl.value.addEventListener('scroll', calcProductsDebounce, false)
        })

        return {
            ...toRefs(state),
            productListEl,
            calcSubscribeProducts,
            quoteMode,
            productMap,
            productList,
            switchQuoteMode,
            toOrder,
            openProduct,
            toContract,
            toChart
        }
    },
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.popContainer {
    width: 80vw;
    background: var(--white);
    .title {
        padding: rem(35px) rem(30px);
        color: var(--primary);
        font-size: rem(40px);
        border-bottom: 2px solid var(--primary);
    }
    .menulist {
        .item {
            @include active();
            display: block;
            padding: 0 rem(30px);
            color: var(--color);
            line-height: rem(94px);
        }
    }
}
</style>

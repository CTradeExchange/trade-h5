<template>
    <div class='selfSymbolList'>
        <TabBar v-model:dType='displayType' v-model:sType='sortType' />
        <ul ref='productListEl' class='selfSymbolListUl'>
            <li v-for='item in productList' :key='item' class='van-hairline--bottom'>
                <productItem :display-type='displayType' :product='productMap[item.symbolId]' @open='openProduct(item)' />
            </li>
        </ul>
    </div>
</template>

<script>
import { computed, nextTick, reactive, ref, toRefs, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import productItem from './selfSymbolItem'
import { useRouter } from 'vue-router'
import { debounce, localSet } from '@/utils/util'
import { QuoteSocket } from '@/plugins/socket/socket'
import TabBar from './tabBar'

export default {
    components: {
        productItem,
        TabBar,
    },
    setup () {
        const store = useStore()
        const router = useRouter()
        const productListEl = ref(null)
        const state = reactive({
            list: [...new Array(10)],
            show: false,
            displayType: 2, // 1显示涨跌点数 2显示价格
            sortType: 1, // 1 default默认排序 2 up按涨幅排序 3 down按跌幅排序
            cur: {},
        })

        const productMap = computed(() => store.state._quote.productMap)
        // 产品列表
        const productList = computed(() => {
            let list = store.getters.userSelfSymbolList
            const sortField = state.displayType === 1 ? 'upDownAmount_pip' : 'upDownAmount'
            if (state.sortType === 2) list = list.slice(0).sort((a, b) => parseFloat(b[sortField]) - parseFloat(a[sortField]))
            if (state.sortType === 3) list = list.slice(0).sort((a, b) => parseFloat(a[sortField]) - parseFloat(b[sortField]))
            list = list.filter(el => productMap.value[el.symbolId] && productMap.value[el.symbolId].symbolName)
            return list
        })

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

        const openProduct = (data) => {
            router.push({ name: 'Order', query: { symbolId: data.symbolId } })
        }

        onMounted(() => {
            productListEl.value.addEventListener('scroll', calcProductsDebounce, false)
        })

        return {
            ...toRefs(state),
            productListEl,
            calcSubscribeProducts,
            productMap,
            productList,
            openProduct,
        }
    },
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.selfSymbolList {
    display: flex;
    flex-direction: column;
    width: 100%;
}
.selfSymbolListUl {
    flex: 1;
    padding-top: rem(20px);
    overflow: auto;
    li {
        padding: rem(20px) 0;
    }
}
</style>

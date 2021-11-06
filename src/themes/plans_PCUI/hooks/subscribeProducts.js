
import { computed, unref, onMounted, watch, nextTick, ref } from 'vue'
import { useStore } from 'vuex'
import { QuoteSocket } from '@/plugins/socket/socket'
import { debounce } from '@/utils/util'

export default function (productList) {
    const store = useStore()
    // 产品列表
    const productMap = computed(() => store.state._quote.productMap)
    const product = computed(() => store.getters.productActived)
    const productListEl = ref(null)

    // 订阅当前屏和上半屏、下半屏的产品报价，给上层组件使用
    const calcSubscribeProducts = () => {
        const el = unref(productListEl)
        if (!el || el.children.length === 0) return []
        const elHeight = el.clientHeight
        const scrollTop = el.scrollTop
        const itemHeight = el.firstElementChild.offsetHeight
        const productsScreen = Math.ceil(elHeight / itemHeight) // 一屏显示的产品数
        let start = Math.floor(scrollTop / itemHeight) // 显示的第一个产品
        start -= productsScreen / 2
        start = Math.max(start, 0)
        const end = Math.round(start + productsScreen * 2)
        const subscribeArr = unref(productList).slice(start, end).map(({ symbolKey }) => symbolKey)
        // console.log('订阅产品', subscribeArr)
        return subscribeArr
    }
    const calcProductsDebounce = debounce(() => {
        const subscribList = calcSubscribeProducts()
        // 把当前路由的产品加入订阅列表
        subscribList.unshift(product.value?.symbolKey)
        if (subscribList.length > 0) QuoteSocket.send_subscribe(subscribList)
    })

    watch(
        () => productList.value,
        async () => {
            await nextTick()
            calcProductsDebounce()
        },
        { immediate: true }
    )

    onMounted(() => {
        unref(productListEl) && unref(productListEl).addEventListener('scroll', calcProductsDebounce, false)
    })

    return {
        productListEl,
        productMap,
        refresh: calcProductsDebounce
    }
}

import { watch, computed, ref, onBeforeUnmount } from 'vue'
import { debounce } from 'lodash'
import { useStore } from 'vuex'
import { useAssets } from '@/hooks/assets'

/** 获取交易汇率 */
const useGetTradeExchangeRate = () => {
    const store = useStore()
    const product = computed(() => store.getters.productActived)
    const timer = ref(null)
    // 当前账户
    const assets = useAssets()

    const getTradeExchangeRate = debounce((params) => {
        clearTimeout(timer.value)
        /** 获取产品币种和账户币种的汇率转换 */
        store.dispatch('_trade/getTradeExchangeRate', params)
        timer.value = setTimeout(() => {
            getTradeExchangeRate(params)
        }, 120 * 1000)
    }, 300)

    watch(() => [product.value?.profitCurrency], () => {
        const profitCurrency = product.value?.profitCurrency
        const accountCurrency = assets.value?.currency
        if (profitCurrency && accountCurrency) {
            getTradeExchangeRate({
                targetCurrency: accountCurrency,
                sourceCurrency: profitCurrency,
            })
        }
    }, {
        immediate: true,
    })

    onBeforeUnmount(() => {
        clearTimeout(timer.value)
    })
}

export default useGetTradeExchangeRate

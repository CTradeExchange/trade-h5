import { getFundInfo } from '@/api/trade'
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'

// 基金详情
export function useFundInfo () {
    const store = useStore()
    const fundInfo = ref(null)
    const symbolKey = computed(() => store.state._quote.productActivedID)
    const product = computed(() => store.getters.productActived)
    const getFundInfoData = () => {
        getFundInfo({ fundId: product.value.fundId }).then(res => {
            if (res.check()) fundInfo.value = res.data
        })
    }

    // 每次切换产品的时候重新获取基金信息
    watch(
        () => symbolKey.value,
        (newval) => {
            getFundInfoData()
        },
        { immediate: true }
    )

    return { fundInfo }
}

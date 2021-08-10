import { computed } from 'vue'
import { useStore } from 'vuex'
import { gt, lt, mul } from '@/utils/calculation'

export default function hooks (state) {
    const store = useStore()
    const customerInfo = computed(() => store.state._user.customerInfo)
    const product = computed(() => store.getters.productActived)
    const account = computed(() => {
        let account = ''
        if (!product.value) return account
        const accountList = customerInfo.value?.accountList || []
        const productTradeType = parseInt(product.value?.tradeType)
        if ([1, 2].includes(productTradeType)) {
            account = accountList.find(el => el.tradeType === productTradeType)
        } else {
            const outCurrency = product.value[state.direction === 'buy' ? 'profitCurrency' : 'baseCurrency']
            account = customerInfo?.value?.accountMap[outCurrency]
        }
        return account
    })
    const bizType = computed(() => {
        let bizType = state.orderType
        if (bizType === 10 && [1, 2].includes(product.value?.tradeType)) {
            const requestPrice = state.pendingPrice
            if (state.direction === 'buy') {
                bizType = lt(requestPrice, product.value.buy_price) ? 10 : 11
            } else {
                bizType = gt(requestPrice, product.value.sell_price) ? 10 : 11
            }
        }
        return bizType
    })
    return {
        account,
        bizType,
    }
}

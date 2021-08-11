import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { gt, lt, mul } from '@/utils/calculation'

export default function hooks (state) {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const customerInfo = computed(() => store.state._user.customerInfo)
    const productMap = computed(() => store.state._quote.productMap)
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
    // 查找板块分类下第一个有效的产品
    const findProductInCategory = (category, tradeType) => {
        let resultProduct = null
        for (let i = 0; i < category.length; i++) {
            const item = category[i]
            item.listByUser.forEach(el => {
                if (resultProduct) return
                const symbolKey = `${el}_${tradeType}`
                if (productMap.value[symbolKey]?.symbolName) resultProduct = symbolKey
            })
            if (resultProduct) return resultProduct
        }
    }
    // 切换产品
    const switchProduct = (symbolId, tradeType) => {
        return router.replace({
            query: {
                ...route.query,
                symbolId,
                tradeType,
            }
        }).then(() => {
            store.commit('_quote/Update_productActivedID', `${symbolId}_${tradeType}`)
        })
    }

    return {
        account,
        bizType,
        findProductInCategory,
        switchProduct,
    }
}

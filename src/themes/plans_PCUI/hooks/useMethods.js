import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default function () {
    const store = useStore()
    const router = useRouter()

    // 跳转到下单页面并优先显示指定产品
    const toOrderPriority = (tradeType) => {
        tradeType = Number(tradeType)
        const productList = store.state._quote.productList
        const arr = productList.filter(el => Number(el.tradeType) === tradeType)
        const symbolKyes = ['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'SOL/USDT', 'ADA/USDT']
        let product = null
        for (let i = 0; i < symbolKyes.length; i++) {
            if (product) break
            for (let j = 0; j < arr.length; j++) {
                const el = arr[j]
                const key = el.baseCurrency + '/' + el.profitCurrency
                if (symbolKyes[i] === key) {
                    product = el
                    break
                }
            }
        }
        if (!product) product = arr[0]
        const symbolId = product.symbolId
        store.commit('_quote/Update_productActivedID', `${symbolId}_${tradeType}`)
        router.push({
            path: '/order',
            query: {
                symbolId,
                tradeType
            }
        })
    }

    return {
        toOrderPriority
    }
}

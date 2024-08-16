import { useStore } from 'vuex'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { localGetJSON } from '@/utils/util'
import { useI18n } from 'vue-i18n'

export default function () {
    const store = useStore()
    const router = useRouter()
    const { t } = useI18n({ useScope: 'global' })
    const businessConfig = computed(() => store.state.businessConfig)
    // 根据tradeType获取默认品种
    const getDefaultProduct = (tradeType) => {
        tradeType = Number(tradeType)

        // 有效的品种
        const availableList = store.getters['_quote/userProductCategoryKeys'] || []

        let product = null
        // 优先进入上一次访问的产品
        const lastProductSymbolKey = (localGetJSON('lastProductActived', {})[tradeType]) || ''
        if (lastProductSymbolKey && availableList.includes(lastProductSymbolKey)) {
            const lastProduct = store.state._quote.productMap[lastProductSymbolKey]
            if (lastProduct?.symbolName && lastProduct?.symbolId) {
                return lastProduct
            }
        }
        const arr = store.state._quote.productList.filter(el => {
            return Number(el.tradeType) === tradeType && availableList.includes(el.symbolKey)
        }).sort((a, b) => {
            return a.sortNum - b.sortNum
        })
        const symbolKyes = ['XAUUSD', 'EURUSD', 'GBPUSD', 'USDJPY', 'BTCUSDT']
        for (let i = 0; i < symbolKyes.length; i++) {
            if (product) break
            for (let j = 0; j < arr.length; j++) {
                const el = arr[j]
                if (symbolKyes[i] === 'XAUUSD') {
                    if (symbolKyes[i] === el.symbolCode) {
                        product = el
                        break
                    }
                } else {
                    if (symbolKyes[i] === (el.baseCurrency + el.profitCurrency)) {
                        product = el
                        break
                    }
                }
            }
        }
        if (!product && arr.length) product = arr[0]
        return product
    }

    // 跳转到下单页面并优先显示指定产品
    const toOrderPriority = (tradeType) => {
        const product = getDefaultProduct(tradeType)
        if (product) {
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
    }

    return {
        toOrderPriority,
        getDefaultProduct
    }
}

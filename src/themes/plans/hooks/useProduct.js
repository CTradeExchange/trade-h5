import { computed, unref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

export default function ({ tradeType, categoryType }) {
    const { t } = useI18n({ useScope: 'global' })
    const store = useStore()
    const productMap = computed(() => store.state._quote.productMap)
    const userProductCategory = computed(() => store.getters.userProductCategory)
    const userSelfSymbolList = computed(() => store.getters.userSelfSymbolList)
    // 产品排序顺序
    const currencys = ['V10', 'BTC', 'ETH', 'BNB', 'SOL', 'ADA', 'XRP', 'LUNA', 'DOT', 'AVAX', 'DOGE', 'MATIC', 'SHIB', 'LINK', 'NEAR', 'UNI', 'ALGO', 'LTC', 'ATOM', 'ICP', 'BCH', 'TRX', 'XLM', 'FTM', 'FTT', 'MANA', 'HBAR', 'VET', 'AXS', 'FIL', 'SAND']

    // 所选玩法的板块列表
    const categoryList = computed(() => {
        const listByUser = unref(userSelfSymbolList)[unref(tradeType)] || []
        const selfSymbol = {
            title: t('trade.favorites'),
            id: 'selfSymbol',
            listByUser: Array.isArray(listByUser) ? listByUser : [listByUser]
        }
        const tradeTypeQuote = (unref(userProductCategory)[unref(tradeType)] || []).filter(e => e.listByUser.length)

        return [
            selfSymbol,
            ...tradeTypeQuote
        ]
    })

    // 所选板块的产品列表
    const productList = computed(() => {
        const productMapVal = unref(productMap)
        let arr = []
        let result = []

        unref(categoryList)[unref(categoryType)].listByUser.forEach(id => {
            const newId = `${id}_${unref(tradeType)}`
            if (productMapVal[newId]?.symbolName) {
                arr.push(productMapVal[newId])
            }
        })

        // 产品排序
        currencys.map(currency => {
            arr.map(elem => {
                if (elem.baseCurrency === currency) {
                    result.push(elem)
                    arr = arr.filter(el => el.symbolId !== elem.symbolId)
                }
            })
        })
        result = result.concat(arr)

        return result
    })

    return {
        categoryList,
        productList
    }
}

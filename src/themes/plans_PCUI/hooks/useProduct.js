import { computed, unref } from 'vue'
import { useStore } from 'vuex'
import globalData from './globalData'
import { useI18n } from 'vue-i18n'

export default function ({ tradeType, categoryType, isSelfSymbol = true }) {
    // wp拖拽预览的时候直接返回空数据
    const { h5Preview } = globalData()
    if (h5Preview) {
        return {
            categoryList: [],
            productList: []
        }
    }

    const { t } = useI18n({ useScope: 'global' })
    const store = useStore()
    const productMap = computed(() => store.state._quote.productMap)
    const userProductCategory = computed(() => store.getters.userProductCategory)
    const userSelfSymbolList = computed(() => store.getters.userSelfSymbolList)
    // 产品排序顺序
    const currencys = ['V10/USDT', 'BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'SOL/USDT', 'ADA/USDT', 'XRP/USDT', 'LUNA/USDT', 'DOT/USDT', 'AVAX/USDT', 'DOGE/USDT', 'MATIC/USDT', 'SHIB/USDT', 'LINK/USDT', 'NEAR/USDT', 'UNI/USDT', 'ALGO/USDT', 'LTC/USDT', 'ATOM/USDT', 'ICP/USDT', 'BCH/USDT', 'TRX/USDT', 'XLM/USDT', 'FTM/USDT', 'FTT/USDT', 'MANA/USDT', 'HBAR/USDT', 'VET/USDT', 'AXS/USDT', 'FIL/USDT', 'SAND/USDT']

    // 所选玩法的板块列表
    const categoryList = computed(() => {
        const listByUser = unref(userSelfSymbolList)[unref(tradeType)] || []
        const selfSymbol = {
            title: t('trade.favorites'),
            id: 'selfSymbol',
            listByUser: Array.isArray(listByUser) ? listByUser : [listByUser]
        }
        const tradeTypeQuote = (unref(userProductCategory)[unref(tradeType)] || []).filter(e => e.listByUser.length)

        return isSelfSymbol ? [selfSymbol, ...tradeTypeQuote] : [...tradeTypeQuote]
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
                if (elem.baseCurrency + '/' + elem.profitCurrency === currency) {
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

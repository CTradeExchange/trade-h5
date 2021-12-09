import { computed, unref } from 'vue'
import { useStore } from 'vuex'
import globalData from './globalData'

export default function ({ tradeType, categoryType, isSelfSymbol = true }) {
    // wp拖拽预览的时候直接返回空数据
    const { h5Preview } = globalData()
    if (h5Preview) {
        return {
            categoryList: [],
            productList: []
        }
    }

    const store = useStore()
    const productMap = computed(() => store.state._quote.productMap)
    const userProductCategory = computed(() => store.getters.userProductCategory)
    const userSelfSymbolList = computed(() => store.getters.userSelfSymbolList)

    // 所选玩法的板块列表
    const categoryList = computed(() => {
        const listByUser = unref(userSelfSymbolList)[unref(tradeType)] || []
        const selfSymbol = {
            title: '自选',
            id: 'selfSymbol',
            listByUser: Array.isArray(listByUser) ? listByUser : [listByUser]
        }
        const tradeTypeQuote = unref(userProductCategory)[unref(tradeType)] || []

        return isSelfSymbol ? [selfSymbol, ...tradeTypeQuote] : [...tradeTypeQuote]
    })

    // 所选板块的产品列表
    const productList = computed(() => {
        const productMapVal = unref(productMap)
        const result = []

        unref(categoryList)[unref(categoryType)].listByUser.forEach(id => {
            const newId = `${id}_${unref(tradeType)}`
            if (productMapVal[newId]?.symbolName) {
                result.push(productMapVal[newId])
            }
        })
        return result
    })

    return {
        categoryList,
        productList
    }
}

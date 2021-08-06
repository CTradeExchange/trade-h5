import { computed, unref } from 'vue'
import { useStore } from 'vuex'

export default function ({ tradeType, categoryType }) {
    const store = useStore()
    const productMap = computed(() => store.state._quote.productMap)
    const userProductCategory = computed(() => store.getters.userProductCategory)
    const userSelfSymbolList = computed(() => store.getters.userSelfSymbolList)

    // 所选玩法的板块列表
    const categoryList = computed(() => {
        const selfSymbol = {
            title: '自选',
            listByUser: unref(userSelfSymbolList)[unref(tradeType)]
        }
        return [
            selfSymbol,
            ...unref(userProductCategory)[unref(tradeType)]
        ]
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

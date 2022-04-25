import { computed, unref, ref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { gte } from '@/utils/calculation'

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

    // 排序
    const sortField = ref('') // 排序字段
    const sortType = ref('') // 排序方式， asc-升序； desc-降序；

    // 所选板块的产品列表
    const productList = computed(() => {
        const productMapVal = unref(productMap)
        let arr = []
        let resultList = []

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
                    resultList.push(elem)
                    arr = arr.filter(el => el.symbolId !== elem.symbolId)
                }
            })
        })
        resultList = resultList.concat(arr)

        // 按字段排序
        if (unref(sortField) && unref(sortType)) {
            resultList.sort((a, b) => {
                // 根据享元模式封装，默认是asc排序
                let firstEl = a
                let secondEl = b

                if (sortType.value === 'desc') {
                    firstEl = b
                    secondEl = a
                }
                if (sortField.value === 'symbolName') {
                    return firstEl[sortField.value].localeCompare(secondEl[sortField.value])
                } else if (sortField.value === 'rolling_upDownWidth') {
                    const firtstValue = parseFloat(firstEl[sortField.value]) || -9999
                    const secondValue = parseFloat(secondEl[sortField.value]) || -9999
                    return firtstValue - secondValue
                } else {
                    const firtstValue = firstEl[sortField.value] || -9999
                    const secondValue = secondEl[sortField.value] || -9999
                    return gte(firtstValue, secondValue) ? 1 : -1
                }
            })
        }

        return resultList
    })

    // 排序方法
    const sortFunc = (field) => {
        if (sortField.value === field || sortType.value === '') {
            switch (sortType.value) {
            case 'asc':
                sortType.value = 'desc'
                break
            case 'desc':
                sortType.value = ''
                break
            default:
                sortType.value = 'asc'
            }
        }
        sortField.value = field
    }

    return {
        categoryList,
        productList,
        sortField,
        sortType,
        sortFunc,
    }
}

// 行情页面，产品列表排序
export const sortProductListHook = () => {
    const sortField = ref('') // 排序字段
    const sortType = ref('') // 排序方式， asc-升序； desc-降序；
    // 排序方法
    const sortFunc = (field, type, list) => {
        sortField.value = field
        sortType.value = type
        list.sort((a, b) => {
            // 根据享元模式封装，默认是asc排序
            let firstEl = a
            let secondEl = b

            if (sortType.valeu === 'desc') {
                firstEl = b
                secondEl = a
            }
            if (sortField.value === 'symbolName') {
                return firstEl[sortField.value].localeCompare(secondEl[sortField.value])
            } else {
                return firstEl[sortField.value] - secondEl[sortField.value]
            }
        })
    }

    return {
        sortField,
        sortType,
        sortFunc,
    }
}

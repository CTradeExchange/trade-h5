import { computed, onMounted, ref, unref } from 'vue'
import { useStore } from 'vuex'
import globalData from './globalData'
import { useI18n } from 'vue-i18n'
import { gte } from '@/utils/calculation'
import { localGet, localSet } from '@/utils/util'
// 排序
const sortField = ref(localGet('productListSortField') || '') // 排序字段
const sortType = ref(localGet('productListSortType') || '') // 排序方式， asc-升序； desc-降序；
export default function ({
    tradeType,
    categoryType, // 版本分类的索引值
    isSelfSymbol = true, // 是否显示自选
    defaultSortField = null, // 初始化排序字段
    defaultSortType = null, // 初始化排序类型
    sortEnabled = true, // 是否需要排序功能， 交易页面含点差的产品列表不需要排序
    notUseType = false // 不使用sortType进行相关逻辑排序
}) {
    // wp拖拽预览的时候直接返回空数据
    const { h5Preview } = globalData()
    if (h5Preview) {
        return {
            categoryList: [],
            productList: []
        }
    }

    onMounted(() => {
        if (defaultSortField !== null) {
            sortField.value = defaultSortField
        }
        if (defaultSortType !== null) {
            sortType.value = defaultSortType
        }
    })

    const { t } = useI18n({ useScope: 'global' })
    const store = useStore()
    const customerInfo = computed(() => store.state._user.customerInfo)
    const productMap = computed(() => store.state._quote.productMap)
    const bitcoinId = computed(() => store.state._quote.bitcoinId)

    const userProductCategory = computed(() => store.getters.userProductCategory)
    const userSelfSymbolList = computed(() => store.getters.userSelfSymbolList)

    // 所选玩法的板块列表
    const categoryList = computed(() => {
        const listByUser = unref(userSelfSymbolList)[unref(tradeType)] || []
        const selfSymbol = {
            title: t('trade.favorites'),
            id: 'selfSymbol',
            listByUser: Array.isArray(listByUser) ? listByUser : [listByUser]
        }
        const tradeTypeQuote = (unref(userProductCategory)[unref(tradeType)] || []).filter(e => e.listByUser.length)

        const cryptoItem = tradeTypeQuote.find((item) => item?.listByUser.includes(bitcoinId.value))
        if (cryptoItem) {
            const noHasCryptoArr = tradeTypeQuote.filter(item => item.id !== cryptoItem.id)
            return isSelfSymbol ? [selfSymbol, cryptoItem, ...noHasCryptoArr] : [cryptoItem, ...noHasCryptoArr]
        } else {
            return isSelfSymbol ? [selfSymbol, ...tradeTypeQuote] : [...tradeTypeQuote]
        }
    })

    // 排序列表
    const sortList = (list, sortType, sortField) => {
        list.sort((a, b) => {
            // 根据享元模式封装，默认是asc排序
            let firstEl = a
            let secondEl = b
            const defaultInfinity = sortType === 'asc' ? Infinity : -Infinity

            if (sortType === 'desc') {
                firstEl = b
                secondEl = a
            }
            if (sortField === 'symbolName') {
                // 将有报价的产品排序到前面
                if (parseFloat(firstEl['rolling_last_price']) && parseFloat(secondEl['rolling_last_price'])) {
                    return firstEl[sortField].localeCompare(secondEl[sortField])
                } else if (parseFloat(firstEl['rolling_last_price']) || parseFloat(secondEl['rolling_last_price'])) {
                    const firtstValue = firstEl['rolling_last_price'] || defaultInfinity
                    const secondValue = secondEl['rolling_last_price'] || defaultInfinity
                    return gte(firtstValue, secondValue) ? 1 : -1
                } else {
                    return 0
                }
            } else if (['rolling_upDownAmount', 'rolling_upDownWidth'].includes(sortField)) {
                const firtstValue = firstEl[sortField] !== undefined ? parseFloat(firstEl[sortField]) : defaultInfinity
                const secondValue = secondEl[sortField] !== undefined ? parseFloat(secondEl[sortField]) : defaultInfinity
                return gte(firtstValue, secondValue) ? 1 : -1
            } else if (sortField === 'rolling_last_price') {
                const firtstValue = firstEl[sortField] || defaultInfinity
                const secondValue = secondEl[sortField] || defaultInfinity
                return gte(firtstValue, secondValue) ? 1 : -1
            } else {
                // 默认按后台的排序
                return firstEl.sortNum - secondEl.sortNum
            }
        })
        // console.log('字典排序后--->', list)
        return list
    }

    // 所选板块的产品列表
    const productList = computed(() => {
        const productMapVal = unref(productMap)
        let arr = []
        let listByUserData = [] // 用户自主添加的自选列表
        const systemOptional = unref(categoryList.value)[unref(categoryType.value)]?.listByUser || [] // 系统默认推送的自选列表

        // console.log('categoryList----------->',categoryType.value,JSON.stringify(systemOptional))
        if (!customerInfo.value) { // 未登录
            if (unref(categoryType.value) === '0' && isSelfSymbol) {
                // 取本地缓存的自选列表
                const localSelfSymbolList = localGet('selfSymbolListStorage') ? JSON.parse(localGet('selfSymbolListStorage')) : []

                const newArr = {}
                if (localSelfSymbolList.length > 0) {
                    // 重组存储自选的格式 id_玩法 加在数列中输出arr
                    localSelfSymbolList.map(el => {
                        const tradeType = el.split('_')[1]
                        if (newArr[tradeType] !== undefined) {
                            newArr[tradeType].push(el.split('_')[0])
                        } else {
                            newArr[tradeType] = [el.split('_')[0]]
                        }
                    })
                    listByUserData = newArr[unref(tradeType)] || []
                }
            } else { // 其它玩法的正常输出列表
                listByUserData = systemOptional
            }
        } else { // 已登录 正常输出列表
            listByUserData = systemOptional
        }
        if (listByUserData?.length > 0) {
            listByUserData.forEach(id => {
                const newId = `${id}_${unref(tradeType)}`
                if (productMapVal[newId]?.symbolName) {
                    arr.push(productMapVal[newId])
                }
            })
        }
        const newsSysConfig = store.state._base.newsSysConfig
        const productSorting = JSON.parse(newsSysConfig && newsSysConfig.find((o) => o.Key === 'productSorting').Value) || []
        // 通用排序函数
        const sortProducts = (products) => {
            return products.sort((a, b) => {
                const indexA = productSorting.indexOf(Number(a.symbolId))
                const indexB = productSorting.indexOf(Number(b.symbolId))
                if (indexA === -1 && indexB === -1) {
                    // 如果两个ID都不在order数组中，保持原来的顺序
                    return 0
                } else if (indexA === -1) {
                    // 如果a的ID不在order数组中，排在后面
                    return 1
                } else if (indexB === -1) {
                    // 如果b的ID不在order数组中，排在后面
                    return -1
                } else {
                    // 按order数组中的顺序排序
                    return indexA - indexB
                }
            })
        }
        // 获取并排序不同类型的产品列表
        const cryptoProducts = sortProducts(arr.filter((item) => item.isCryptocurrency))
        const forexProducts = sortProducts(arr.filter((item) => item.isFX))
        const commodityProducts = sortProducts(arr.filter((item) => !item.isCryptocurrency && !item.isFX))

        // 合并所有产品列表
        arr = [...cryptoProducts, ...commodityProducts, ...forexProducts]
        // 按字段排序
        if (sortEnabled) {
            return sortList(arr, sortType.value, sortField.value)
        }

        return arr
    })

    return {
        sortField,
        sortType,
        sortList,
        categoryList,
        productList,
    }
}

export const sortFieldFn = () => {
    return sortField
}
export const sortTypeFn = () => {
    return sortType
}

// 排序方法
export const sortFunc = (field) => {
    // console.log('-------->', field)
    if (sortField.value === field) {
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
    } else {
        sortType.value = 'asc'
    }
    sortField.value = sortType.value ? field : ''

    localSet('productListSortField', sortType.value ? field : '')
    localSet('productListSortType', sortType.value)
}

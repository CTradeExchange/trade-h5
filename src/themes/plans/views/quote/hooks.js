import { computed, unref } from 'vue'
import { useStore } from 'vuex'

export function useProduct ({ planType, categoryType }) {
    const store = useStore()
    const productMap = computed(() => store.state._quote.productMap)
    // const customerGroupId = computed(() => store.getters.customerGroupId)
    // const wpProductCategory = store.state._base.wpProductCategory || []
    // const quoteList = wpProductCategory.find(el => el.tag === 'quoteList')
    // const plansList = quoteList.data.items
    // const wpSelfSymbol = store.state._base.wpSelfSymbol || []
    // const selfSymbolData = wpSelfSymbol.find(el => el.tag === 'selfSymbol')?.data.product

    // 假数据
    // 结构 玩法 -> 板块列表 -> 产品列表
    const plansList = {
        1: [
            {
                list: ['36'],
                id: 'SJMJ4175632_10',
                title: '自选_1',
            },
            {
                list: ['36', '37', '38'],
                id: 'SJMJ4175632_10',
                title: '数字币_1',
            },
            {
                list: ['36', '37', '38'],
                id: 'SJMJ4175632_10',
                title: '其他_1',
            }
        ],
        2: [
            {
                list: ['37'],
                id: 'SJMJ4175632_10',
                title: '自选_2',
            },
            {
                list: ['36', '37', '38'],
                id: 'SJMJ4175632_10',
                title: '数字币_2',
            },
            {
                list: ['36', '37', '38'],
                id: 'SJMJ4175632_10',
                title: '其他_2',
            }
        ],
        3: [
            {
                list: ['38'],
                id: 'SJMJ4175632_10',
                title: '自选_3',
            },
            {
                list: ['36', '37', '38'],
                id: 'SJMJ4175632_10',
                title: '数字币_3',
            },
            {
                list: ['36', '37', '38'],
                id: 'SJMJ4175632_10',
                title: '其他_3',
            }
        ]
    }

    // 所选玩法的板块列表
    const categoryList = computed(() => plansList[unref(planType)])

    // 所选板块的产品列表
    const productList = computed(() => {
        const productMapVal = unref(productMap)
        const result = []

        unref(categoryList)[unref(categoryType)].list.forEach(id => {
            const newId = `${id}_${unref(planType)}`
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

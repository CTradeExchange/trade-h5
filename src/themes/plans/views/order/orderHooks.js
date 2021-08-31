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
        const tradeType = parseInt(product.value?.tradeType)
        if ([1, 2].includes(tradeType)) {
            account = accountList.find(el => el.tradeType === tradeType)
        } else {
            const outCurrency = product.value[state.direction === 'buy' ? 'profitCurrency' : 'baseCurrency']
            account = customerInfo?.value?.accountMap[`${tradeType}_${outCurrency}`]
        }
        return account
    })
    const bizType = computed(() => {
        let bizType = state.orderType
        const tradeType = product.value?.tradeType
        if (state.orderType === 10 ) { // 限价单
            if([1, 2].includes(tradeType)){
                // CFD全仓和CFD逐仓 区分10-限价预埋单；11-停损预埋单
                const requestPrice = state.pendingPrice
                if (state.direction === 'buy') {
                    bizType = lt(requestPrice, product.value.buy_price) ? 10 : 11
                } else {
                    bizType = gt(requestPrice, product.value.sell_price) ? 10 : 11
                }
            }else if([3, 5, 9].includes(tradeType)){
                // 现货撮合、杠杆全仓、ABCC玩法限价单，按手数13，按额14
                bizType = state.entryType===1? 13 : 14;
            }
        }else if(state.orderType===1){ // 市价单
            if([3, 5].includes(tradeType) && state.entryType===2){
                // 现货撮合、杠杆全仓 按额下单
                bizType = 12;
            }
        }
        return bizType
    })
    // 查找板块分类下第一个有效的产品
    const findProductInCategory = (tradeType) => {
        const category = store.getters.userProductCategory[tradeType]
        if (!category) return false
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

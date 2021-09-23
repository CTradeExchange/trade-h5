import { computed, watch } from 'vue'
import { useStore } from 'vuex'
import { shiftedBy, plus } from '@/utils/calculation'
export default function ({ showPending }) {
    const store = useStore()

    const product = computed(() => store.getters.productActived)

    // 获取产品的深度小数位
    const deepthDigits = computed(() => {
        if (parseFloat(store.state._quote?.deepthDigits) >= 1) {
            return parseFloat(store.state._quote?.deepthDigits)
        } else {
            return store.state._quote?.deepthDigits?.toString().split('.')?.[1].length
        }
    })

    // 当前玩法挂单列表
    const pendingList = computed(() => store.state._trade?.pendingList[product.value?.tradeType])

    const handicapList = computed(() => store.state._quote.handicapList.find(item => item.symbol_id === String(product.value?.symbolId)))

    const handicapResult = computed(() => {
        if (handicapList.value) {
            const result = JSON.parse(JSON.stringify(handicapList.value))
            const tempArr = [] // 总量
            if (result?.ask_deep.length > 0) {
                result.ask_deep.forEach(ask => {
                    tempArr.push(ask.volume_ask)
                })
            }

            if (result?.bid_deep.length > 0) {
                result.bid_deep.forEach(bid => {
                    tempArr.push(bid.volume_bid)
                })
            }

            const maxValue = Math.max(...tempArr)
            const minValue = Math.min(...tempArr)

            const diff = maxValue - minValue
            // 计算买入报价长度
            if (result?.ask_deep.length > 0) {
                const buyPendingList = pendingList.value && pendingList.value.filter(item => Number(item.direction === 2))

                result.ask_deep.forEach(ask => {
                    ask.width = diff === 0 ? 0 : (parseFloat(ask.volume_ask) - parseFloat(minValue)) / diff * 100
                    ask.unitNum = 0
                    // 计算合并挂单数量
                    if (buyPendingList?.length > 0 && showPending) {
                        buyPendingList.forEach(bl => {
                            bl.requestPrice = parseFloat(parseFloat(bl.requestPrice).toFixed(deepthDigits.value))

                            if (bl.requestPrice === parseFloat(ask.price_ask)) {
                                ask.unitNum = plus(bl.requestNum, ask.unitNum)
                            }
                        })
                    }
                })
            }

            // 计算卖出报价长度
            if (result?.bid_deep.length > 0) {
                const sellPendingList = pendingList.value && pendingList.value.filter(item => Number(item.direction === 1))
                result.bid_deep.forEach(bid => {
                    bid.width = diff === 0 ? 0 : (parseFloat(bid.volume_bid) - parseFloat(minValue)) / diff * 100
                    bid.unitNum = 0
                    // 计算合并挂单数量
                    if (sellPendingList?.length > 0 && showPending) {
                        sellPendingList.forEach(sl => {
                            sl.requestPrice = parseFloat(parseFloat(sl.requestPrice).toFixed(deepthDigits.value))
                            if (sl.requestPrice === parseFloat(bid.price_bid)) {
                                bid.unitNum = plus(sl.requestNum, bid.unitNum)
                            }
                        })
                    }
                })
            }
            return result
        }
        return {
            ask_deep: [],
            bid_deep: [],
            price_digits: 0,
            seq: Date.now().toString(),
            symbol_id: String(product.value?.symbolId),
            trade_info: [],
            trade_type: product.value?.tradeType,
        }
    })

    return {
        handicapResult

    }
}

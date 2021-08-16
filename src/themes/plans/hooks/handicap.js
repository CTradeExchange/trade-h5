import { computed, watch } from 'vue'
import { useStore } from 'vuex'
import { shiftedBy, plus } from '@/utils/calculation'
export default function ({ symbolId, tradeType, showPending }) {
    const store = useStore()
    // 获取盘口深度报价
    const handicapList = computed(() => store.state._quote.handicapList.find(item => item.symbol_id === symbolId))

    // 获取当前产品
    const product = computed(() => store.state._quote.productMap[symbolId + '_' + tradeType])

    // 当前玩法挂单列表
    const pendingList = computed(() => store.state._trade.pendingList[tradeType])

    // 计算长度
    watch(() => [handicapList.value], (newValues) => {
        const result = handicapList.value
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
        // 计算卖出报价长度
        if (result?.ask_deep.length > 0) {
            const sellPendingList = pendingList.value && pendingList.value.filter(item => Number(item.direction === 1))
            result.ask_deep.forEach(ask => {
                ask.width = diff === 0 ? 0 : (parseFloat(ask.volume_ask) - parseFloat(minValue)) / diff
                ask.unitNum = 0
                // 计算合并挂单数量
                if (sellPendingList?.length > 0 && showPending) {
                    sellPendingList.forEach(sl => {
                        const requestPrice = shiftedBy(sl.requestPrice, -1 * product.value.price_digits)
                        if (parseFloat(requestPrice) === parseFloat(ask.price_ask)) {
                            ask.unitNum = plus(sl.requestNum, ask.unitNum)
                        }
                    })
                }
            })
        }

        // 计算买入报价长度
        if (result?.bid_deep.length > 0) {
            const buyPendingList = pendingList.value && pendingList.value.filter(item => Number(item.direction === 2))
            result.bid_deep.forEach(bid => {
                bid.width = diff === 0 ? 0 : (parseFloat(bid.volume_bid) - parseFloat(minValue)) / diff
                bid.unitNum = 0
                // 计算合并挂单数量
                if (buyPendingList?.length > 0 && showPending) {
                    buyPendingList.forEach(bl => {
                        const requestPrice = shiftedBy(bl.requestPrice, -1 * product.value.price_digits)
                        if (parseFloat(requestPrice) === parseFloat(bid.price_bid)) {
                            bid.unitNum = plus(bl.requestNum, bid.unitNum)
                        }
                    })
                }
            })
        }
    }, {
        deep: true
    })
}

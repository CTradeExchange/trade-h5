import { computed, watch } from 'vue'
import { useStore } from 'vuex'
import { shiftedBy, plus, retainDecimal } from '@/utils/calculation'
import { deepClone } from '@/utils/deepClone'
export default function ({ showPending }) {
    const store = useStore()
    const product = computed(() => store.getters.productActived)

    // 获取产品的深度小数位
    const deepthDigits = computed(() => {
        if (parseFloat(store.state._quote?.deepthDigits) === 1) {
            return 0
        } else if (parseFloat(store.state._quote?.deepthDigits) > 1) {
            return -(store.state._quote?.deepthDigits.length - 1)
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
                const buyPendingList = deepClone(pendingList.value && pendingList.value.filter(item => Number(item.direction === 2)))

                result.ask_deep.forEach(ask => {
                    ask.width = diff === 0 ? 0 : (parseFloat(ask.volume_ask) - parseFloat(minValue)) / diff * 100
                    ask.unitNum = 0
                    // 计算合并挂单数量
                    if (buyPendingList?.length > 0 && showPending) {
                        buyPendingList.forEach(bl => {
                            if (deepthDigits.value >= 0) {
                                bl.requestPrice = parseFloat(retainDecimal(bl.requestPrice, deepthDigits.value))
                            } else {
                                const tempNum = retainDecimal(bl.requestPrice, 0)
                                bl.requestPrice = tempNum - parseInt(tempNum.substr(deepthDigits.value))
                            }

                            if (bl.requestPrice === parseFloat(ask.price_ask)) {
                                ask.unitNum = plus(bl.requestNum, ask.unitNum)
                            }
                        })
                    }
                })
            }

            // 计算卖出报价长度
            if (result?.bid_deep.length > 0) {
                const sellPendingList = deepClone(pendingList.value && pendingList.value.filter(item => Number(item.direction === 1)))
                result.bid_deep.forEach(bid => {
                    bid.width = diff === 0 ? 0 : (parseFloat(bid.volume_bid) - parseFloat(minValue)) / diff * 100
                    bid.unitNum = 0
                    // 计算合并挂单数量
                    if (sellPendingList?.length > 0 && showPending) {
                        sellPendingList.forEach(sl => {
                            if (deepthDigits.value >= 0) {
                                sl.requestPrice = parseFloat(retainDecimal(sl.requestPrice, deepthDigits.value))
                            } else {
                                const tempNum = retainDecimal(sl.requestPrice, 0)
                                sl.requestPrice = tempNum - parseInt(tempNum.substr(deepthDigits.value))
                            }

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

export const toolHooks = function () {
    // 成交模式: 1:MM(不展示盘口和成交记录)，2:蝴蝶（不显示挂单tab），3:撮合
    const dealModeShowMap = computed(() => {
        return {
            '1': {
                handicap: false,
                pendingTab: true
            },
            '2': {
                handicap: true,
                pendingTab: true
            },
            '3': {
                handicap: true,
                pendingTab: true
            },
            '4': {
                handicap: true,
                pendingTab: false
            }
        }
    })

    return {
        dealModeShowMap
    }
}

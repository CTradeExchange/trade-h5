import { computed } from 'vue'
import { useStore } from 'vuex'
import { mul, plus, } from '@/utils/calculation'
import { deepClone } from '@/utils/deepClone'
export default function ({ showPending }) {
    const store = useStore()
    const product = computed(() => store.getters.productActived)

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

            // 计算买入报价长度
            if (result?.ask_deep.length > 0) {
                const buyPendingList = deepClone(pendingList.value && pendingList.value.filter(item => item.direction === 2))

                result.ask_deep.forEach(ask => {
                    // 盘口每一档量的长度 barLength = 当前档量/max(盘口所有档) *100%
                    ask.width = maxValue === 0 ? 0 : parseFloat(ask.volume_ask) / maxValue * 100
                    ask.unitNum = 0
                    // 计算合并挂单数量
                    if (buyPendingList?.length > 0 && showPending) {
                        buyPendingList.forEach(bl => {
                            // 判断请求价格和盘口报价一致，unitNum叠加,ask.price_ask需要根据小数位转换为整数，2.5 => 250
                            if (String(bl.requestPrice) === mul(ask.price_ask, Math.pow(10, product.value.price_digits || 0))) {
                                // 盘口我的数量
                                ask.unitNum = plus(bl.requestNum, ask.unitNum)
                            }
                        })
                    }
                })
            }

            // 计算卖出报价长度
            if (result?.bid_deep.length > 0) {
                const sellPendingList = deepClone(pendingList.value && pendingList.value.filter(item => item.direction === 1))

                result.bid_deep.forEach(bid => {
                    // 盘口每一档量的长度 barLength = 当前档量/max(盘口所有档) *100%
                    bid.width = maxValue === 0 ? 0 : parseFloat(bid.volume_bid) / maxValue * 100
                    bid.unitNum = 0
                    // 计算合并挂单数量
                    if (sellPendingList?.length > 0 && showPending) {
                        sellPendingList.forEach(sl => {
                            // 判断请求价格和盘口报价一致，unitNum叠加,ask.price_ask需要根据小数位转换为整数，2.5 => 250
                            if (String(sl.requestPrice) === mul(bid.price_bid, Math.pow(10, product.value.price_digits || 0))) {
                                // 盘口我的数量
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
                pendingTab: {
                    tradeType: [1, 2, 3, 5], // 哪些玩法显示限价单
                    show: true, // 限价单是否显示
                }
            },
            '2': {
                handicap: true,
                pendingTab: {
                    tradeType: [1, 2, 3, 5], // 哪些玩法显示限价单
                    show: false, // 限价单是否显示
                }
            },
            '3': {
                handicap: true,
                pendingTab: {
                    tradeType: [1, 2, 3, 5], // 哪些玩法显示限价单
                    show: true, // 限价单是否显示
                }
            },
            '4': {
                handicap: true,
                pendingTab: {
                    tradeType: [5], // 哪些玩法显示限价单
                    show: true, // 限价单是否显示
                }
            },
            '6': {
                handicap: true,
                pendingTab: {
                    tradeType: [1, 2, 3, 5], // 哪些玩法显示限价单
                    show: true, // 限价单是否显示
                }
            }
        }
    })

    return {
        dealModeShowMap
    }
}

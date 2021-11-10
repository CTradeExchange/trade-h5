import { unref, computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { minus } from '@/utils/calculation'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import ClosePosition from '@planspc/views/assets/components/close-position.vue'
import Sltp from '@planspc/views/assets/components/sltp.vue'
import AdjustMargin from '@planspc/views/assets/components/adjust-margin.vue'

const formatTime = val => window.dayjs(val).format('YYYY-MM-DD HH:mm:ss')

// 获取资产列表配置
export const getAssetColumns = (tradeType) => {
    const { t } = useI18n({ useScope: 'global' })
    const store = useStore()
    const router = useRouter()
    const customerInfo = computed(() => store.state._user.customerInfo)
    const productMap = computed(() => store.state._quote.productMap)
    const currentProduct = (row) => {
        return productMap.value[row.symbolId + '_' + row.tradeType]
    }
    const assetsInfo = computed(() => customerInfo.value.accountList?.find(el => Number(el.tradeType) === tradeType) || {})

    const closePosition = ref(null)
    const sltp = ref(null)
    const adjustMargin = ref(null)
    // 平仓调窗
    const openClosePosition = (row) => {
        store.commit('_quote/Update_productActivedID', row.symbolId + '_' + row.tradeType)
        closePosition.value.open(row)
    }

    // 止盈止损弹窗
    const openSltp = (row) => {
        store.commit('_quote/Update_productActivedID', row.symbolId + '_' + row.tradeType)
        store.commit('_trade/Update_modifyPositionId', row.positionId + '_' + row.tradeType)
        sltp.value.open(row)
    }

    // 调整保证金弹窗
    const openAdjustMargin = (row) => {
        adjustMargin.value.open(row)
    }

    // 跳转到借款页面
    const goLoan = (row) => {
        if (row.accountId) {
            router.push({
                path: '/assets/loan',
                query: {
                    currency: row.currency,
                    accountId: row.accountId,
                    tradeType
                }
            })
        } else {
            router.push({
                path: '/assets/chooseAccount',
                query: {
                    accountId: assetsInfo.value.accountId,
                    tradeType,
                    type: 1
                }
            })
        }
    }

    // 跳转到还款页面
    const goRepayment = (row) => {
        if (row.accountId) {
            router.push({
                path: '/assets/returnMoney',
                query: {
                    currency: row.currency,
                    accountId: row.accountId,
                    tradeType
                }
            })
        } else {
            router.push({
                path: '/assets/chooseAccount',
                query: {
                    accountId: assetsInfo.value.accountId,
                    tradeType,
                    type: 3
                }
            })
        }
    }

    const columnsMap = computed(() => ({
        1: [
            { name: t('trade.name'), prop: 'symbolName', align: 'left', width: 120 },
            {
                name: t('trade.profit') + '(' + unref(assetsInfo).currency + ')',
                align: 'right',
                width: 100,
                formatter: row => {
                    return <span className={[parseFloat(row.profitLoss) > 0 ? 'riseColor' : 'fallColor']}>{row.profitLoss}</span>
                }
            },
            {
                name: t('trade.direction'),
                align: 'right',
                formatter: row => {
                    return <span className={[parseFloat(row.direction) > 0 ? 'riseColor' : 'fallColor']}>
                        { Number(row.direction) === 1 ? t('trade.buy') : t('trade.sell') }
                    </span>
                }
            },
            {
                name: t('trade.pendingUnit') + '(' + t('trade.volumeUnit') + ')',
                align: 'right',
                width: 100,
                formatter: row => minus(row.openVolume, row.closeVolume)
            },
            {
                name: t('trade.positionPrice'),
                prop: 'openPrice',
                align: 'right',
                width: 100,
            },
            {
                name: t('trade.currentPrice'),
                align: 'right',
                width: 100,
                formatter: row => Number(row.direction) === 1 ? currentProduct(row)?.sell_price : currentProduct(row)?.buy_price
            },
            {
                name: t('trade.stopLossPrice'),
                align: 'right',
                width: 100,
                formatter: row => parseFloat(row.stopLossDecimal) ? row.stopLossDecimal : '--'
            },
            {
                name: t('trade.stopProfitPrice'),
                align: 'right',
                width: 100,
                formatter: row => parseFloat(row.takeProfitDecimal) ? row.takeProfitDecimal : '--'
            },
            {
                name: t('trade.openTime'),
                align: 'right',
                width: 200,
                formatter: row => formatTime(row.openTime)
            },
            {
                name: t('trade.positionId'),
                prop: 'positionId',
                width: 130,
                align: 'right',
            },
            {
                name: t('c.handle'),
                fixed: 'right',
                className: 'operate',
                align: 'right',
                width: 130,
                slots: {
                    default: ({ row }) => {
                        return (
                            <>
                                <span className="link" onclick={openSltp.bind(null, row)} type="text">
                                    { t('trade.tackStopSetup') }
                                </span>
                                <span className="link" onclick={openClosePosition.bind(null, row)} type="text">
                                    { t('trade.closed') }
                                </span>
                                {/* 平仓组件 */}
                                <ClosePosition ref={closePosition} />
                                {/* 止盈止损 */}
                                <Sltp ref={sltp} />
                            </>
                        )
                    }
                }
            },
        ],
        2: [
            { name: t('trade.name'), prop: 'symbolName', className: 'symbolName', align: 'left' },
            {
                name: t('trade.profit') + '(' + unref(assetsInfo).currency + ')',
                prop: 'direction',
                align: 'right',
                width: 100,
                formatter: row => <span class={parseFloat(row.profitLoss) > 0 ? 'riseColor' : 'fallColor'}>
                    { row.profitLoss }
                </span>
            },
            { name: t('trade.swap_2') + '(' + unref(assetsInfo).currency + ')', prop: 'interest', align: 'right', width: 100, },
            {
                name: t('trade.direction'),
                prop: 'requestNum',
                align: 'right',
                formatter: row => <span class={Number(row.direction) === 1 ? 'riseColor' : 'fallColor'}>
                    { Number(row.direction) === 1 ? t('trade.buy') : t('trade.sell') }
                </span>
            },
            {
                name: t('trade.pendingUnit') + '(' + t('trade.volumeUnit') + ')',
                prop: 'requestPrice',
                align: 'right',
                formatter: row => minus(row.openVolume, row.closeVolume),
                width: 100,
            },
            { name: t('trade.positionPrice'), prop: 'openPrice', align: 'right' },
            {
                name: t('trade.currentPrice'),
                align: 'right',
                formatter: row => Number(row.direction) === 1 ? currentProduct(row)?.sell_price : currentProduct(row)?.buy_price
            },
            { name: t('trade.prospectMandatory'), prop: 'previewStopPrice', align: 'right', width: 100, },
            { name: t('trade.originalMargin'), prop: 'occupyTheMargin', align: 'right', width: 100, },
            { name: t('trade.holdMargin'), prop: 'maintenanceMargin', align: 'right', width: 100, },
            {
                name: t('trade.stopLossPrice'),
                align: 'right',
                formatter: row => parseFloat(row.stopLossDecimal) ? row.stopLossDecimal : '--'
            },
            {
                name: t('trade.stopProfitPrice'),
                align: 'right',
                formatter: row => parseFloat(row.takeProfitDecimal) ? row.takeProfitDecimal : '--'
            },
            {
                name: t('trade.openTime'),
                align: 'right',
                width: 200,
                formatter: row => formatTime(row.openTime)
            },
            { name: t('trade.positionId'), prop: 'loanAmount', align: 'right' },
            {
                name: t('c.handle'),
                fixed: 'right',
                className: 'operate',
                align: 'right',
                width: 130,
                slots: {
                    default: ({ row }) => {
                        return (
                            <>
                                <span className="link" onclick={openAdjustMargin.bind(null, row)} type="text">
                                    { t('trade.modifyMargin') }
                                </span>
                                <span className="link" onclick={openSltp.bind(null, row)} type="text">
                                    { t('trade.tackStopSetup') }
                                </span>
                                <span className="link" onclick={openClosePosition.bind(null, row)} type="text">
                                    { t('trade.closed') }
                                </span>

                                {/* 调整保证金组件 */}
                                <AdjustMargin ref={adjustMargin} />
                            </>
                        )
                    }
                }
            },
        ],
        3: [
            { name: t('trade.name'), prop: 'currency', align: 'left' },
            { name: t('trade.totalAssets'), prop: 'balance', align: 'right' },
            { name: t('trade.free'), prop: 'available', align: 'right' },
            { name: t('trade.frozen'), prop: 'frozen', align: 'right' },
            { name: t('trade.loan'), prop: 'liabilitiesPrincipal', align: 'right' },
            { name: t('trade.swap_2'), prop: 'interest', align: 'right' },
            { name: t('trade.carry'), prop: 'withdrawAmount', align: 'right' },
            {
                name: t('c.handle'),
                fixed: 'right',
                className: 'operate',
                align: 'right',
                width: 130,
                slots: {
                    default: ({ row }) => {
                        return (
                            <>
                                <span className="link" onclick={goLoan.bind(null, row)} type="text">
                                    { t('trade.loan') }
                                </span>
                                <span className="link" onclick={goRepayment.bind(null, row)} type="text">
                                    { t('trade.repayment') }
                                </span>
                            </>
                        )
                    }
                }
            },
        ],
        5: [
            { name: t('trade.name'), prop: 'currency', align: 'left' },
            { name: t('trade.totalAssets'), prop: 'balance', align: 'right' },
            { name: t('trade.free'), prop: 'available', align: 'right' },
            { name: t('trade.frozen'), prop: 'frozen', align: 'right' },
            { name: t('trade.carry'), prop: 'withdrawAmount', align: 'right' },
        ]
    }))

    return unref(columnsMap)[tradeType]
}

// 获取成交记录列表配置
export const getTransactionColumns = (tradeType) => {
    const { t } = useI18n({ useScope: 'global' })

    // 判断是否是平仓
    const isCloseType = (bizType) => {
        if ([4, 5, 6, 7, 8].indexOf(Number(bizType)) > -1) {
            return true
        } else {
            return false
        }
    }

    const columnsMap = computed(() => ({
        1: [
            {
                name: t('trade.dealTime'),
                align: 'left',
                width: 160,
                formatter: row => formatTime(row.executeTime)
            },
            { name: t('trade.name'), prop: 'symbolName', align: 'right', width: 120 },
            {
                name: t('trade.direction'),
                align: 'right',
                formatter: row => <span class={Number(row.direction) === 1 ? 'riseColor' : 'fallColor'}>
                    { Number(row.direction) === 1 ? t('trade.buy') : t('trade.sell') }
                </span>
            },
            {
                name: t('trade.orderType'),
                align: 'right',
                formatter: (row, column, cellValue, index, rawResponse) => {
                    return rawResponse.data.bizTypeText[row.bizType]
                }
            },
            {
                name: t('trade.pendingUnit') + ' (' + t('trade.volumeUnit') + ')',
                prop: 'requestNum',
                align: 'right',
                width: 100
            },
            {
                name: t('trade.dealVolume') + '(' + (t('trade.volumeUnit')) + ')',
                prop: 'executeNum',
                align: 'right',
                width: 100
            },
            {
                name: t('trade.trustPrice'),
                prop: 'requestPrice',
                align: 'right',
                width: 120,
                slots: {
                    header: row => isCloseType(row.bizType) ? t('trade.positionPrice') : t('trade.trustPrice')
                }
            },
            { name: t('trade.dealAvgPrice'), prop: 'executePrice', align: 'right', width: 120, },
            {
                name: t('trade.stopLossPrice'),
                align: 'right',
                width: 120,
                formatter: row => parseFloat(row.stopLoss) > 0 ? row.stopLoss : '--',
                directives: { if: row => isCloseType(row.bizType) }
            },
            {
                name: t('trade.stopProfitPrice'),
                align: 'right',
                width: 120,
                formatter: row => parseFloat(row.takeProfit) > 0 ? row.takeProfit : '--',
                directives: { if: row => isCloseType(row.bizType) }

            },
            {
                name: t('trade.profit'),
                align: 'right',
                formatter: row => parseFloat(row.profitLoss) > 0 ? row.profitLoss : '--',
                directives: { if: row => isCloseType(row.bizType) }
            },
            { name: t('trade.fee'), prop: 'commission', align: 'right' },
            { name: t('trade.pendingNo'), prop: 'dealId', align: 'right' },
        ],
        2: [
            { name: t('trade.dealTime'), align: 'left', width: 160, formatter: row => formatTime(row.executeTime) },
            { name: t('trade.name'), prop: 'symbolName', align: 'right', width: 120 },
            {
                name: t('trade.direction'),
                align: 'right',
                formatter: row => <span class={Number(row.direction) === 1 ? 'riseColor' : 'fallColor'}>
                    { Number(row.direction) === 1 ? t('trade.buy') : t('trade.sell') }
                </span>
            },
            {
                name: t('trade.orderType'),
                align: 'right',
                formatter: (row, column, cellValue, index, rawResponse) => {
                    return rawResponse.data.bizTypeText[row.bizType]
                }
            },
            {
                prop: 'requestNum',
                align: 'left',
                width: 120,
                slots: {
                    header: row => Number(row.numberStatisticMode) === 1 ? t('trade.pendingUnit') + '(' + t('trade.volumeUnit') + ')' : t('trade.pendingAmount') + ' (' + row.accountCurrency + ')'
                }
            },
            {
                name: t('trade.dealVolume') + '(' + (t('trade.volumeUnit')) + ')',
                prop: 'executeNum',
                align: 'right',
                width: 120,
            },
            {
                name: t('trade.trustPrice'),
                prop: 'requestPrice',
                align: 'right',
                slots: {
                    header: row => isCloseType(row.bizType) ? t('trade.positionPrice') : t('trade.trustPrice')
                },
            },
            { name: t('trade.dealAvgPrice'), prop: 'executePrice', align: 'right' },
            {
                name: t('trade.stopLossPrice'),
                prop: 'stopLoss',
                align: 'right',
                formatter: row => parseFloat(row.stopLoss) > 0 ? row.stopLoss : '--'
            },
            {
                name: t('trade.stopProfitPrice'),
                prop: 'takeProfit',
                align: 'right',
                directives: { if: row => isCloseType(row.bizType) }

            },
            {
                name: t('trade.profit'),
                prop: 'profitLoss',
                align: 'right',
                directives: { if: row => isCloseType(row.bizType) }
            },
            { name: t('trade.fee'), prop: 'commission', align: 'right' },
            // {
            //     name: t('trade.swap'),
            //     prop: 'overnightInterest',
            //     align: 'right',
            //     directives: { if: row => isCloseType(row.bizType) }
            // },
            { name: t('trade.pendingNo'), prop: 'dealId', align: 'right' },
        ],
        3: [
            {
                name: t('trade.dealTime'),
                align: 'left',
                width: 160,
                formatter: row => formatTime(row.executeTime)
            },
            { name: t('trade.name'), prop: 'symbolName', align: 'right', width: 120 },
            {
                name: t('trade.direction'),
                align: 'right',
                formatter: row => <span class={Number(row.direction) === 1 ? 'riseColor' : 'fallColor'}>
                    { Number(row.direction) === 1 ? t('trade.buy') : t('trade.sell') }
                </span>
            },
            {
                name: t('trade.orderType'),
                align: 'right',
                formatter: (row, column, cellValue, index, rawResponse) => {
                    return rawResponse.data.bizTypeText[row.bizType]
                }
            },
            {
                prop: 'requestNum',
                align: 'right',
                width: 100,
                slots: {
                    header: row => Number(row.direction) === 1 ? t('trade.pendingAmount') + '(' + row.outCurrency + ')' : t('trade.pendingUnit') + '(' + (row.outCurrency || '') + ')'
                }
            },
            {
                prop: 'executeNum',
                align: 'right',
                width: 100,
                slots: {
                    header: row => Number(row.direction) === 1 ? t('trade.orderAmount') : t('trade.dealVolume'),
                },
            },
            {
                name: t('trade.trustPrice'),
                prop: 'requestPrice',
                align: 'right',
                slots: {
                    header: row => isCloseType(row.bizType) ? t('trade.positionPrice') : t('trade.trustPrice')
                },
            },
            { name: t('trade.dealAvgPrice'), prop: 'executePrice', align: 'right' },
            // {
            //     name: t('trade.profit'),
            //     prop: 'profitLoss',
            //     align: 'right',
            //     directives: { if: row => isCloseType(row.bizType) }
            // },
            {
                name: t('trade.loan'),
                prop: 'loanAmount',
                align: 'right',
                slots: {
                    header: row => t('trade.loan') + '(' + (row.outCurrency || '') + ')'
                }
            },
            {
                name: t('trade.fee'),
                prop: 'commission',
                align: 'right',
                formatter: row => t('trade.fee') + (row.inCurrency || '--')
            },
            { name: t('trade.pendingNo'), prop: 'dealId', align: 'right' },
        ],
        5: [
            { name: t('trade.dealTime'), align: 'left', width: 160, formatter: row => formatTime(row.executeTime) },
            { name: t('trade.name'), prop: 'symbolName', align: 'right', width: 120 },
            {
                name: t('trade.direction'),
                align: 'right',
                formatter: row => <span class={Number(row.direction) === 1 ? 'riseColor' : 'fallColor'}>
                    { Number(row.direction) === 1 ? t('trade.buy') : t('trade.sell') }
                </span>
            },
            {
                name: t('trade.orderType'),
                align: 'right',
                formatter: (row, column, cellValue, index, rawResponse) => {
                    return rawResponse.data.bizTypeText[row.bizType]
                }
            },
            {
                prop: 'requestNum',
                align: 'right',
                width: 120,
                slots: {
                    header: row => Number(row.direction) === 1 ? t('trade.pendingAmount') + '(' + (row.outCurrency || '') + ')' : t('trade.pendingUnit') + '(' + (row.outCurrency || '') + ')'
                }
            },
            {
                prop: 'executeNum',
                align: 'right',
                slots: {
                    header: row => Number(row.direction) === 1 ? t('trade.orderAmount') : t('trade.dealVolume'),
                },
            },
            {
                name: t('trade.trustPrice'),
                prop: 'requestPrice',
                align: 'right',
                slots: {
                    header: row => isCloseType(row.bizType) ? t('trade.positionPrice') : t('trade.trustPrice')
                },
            },
            { name: t('trade.dealAvgPrice'), prop: 'executePrice', align: 'right' },
            {
                name: t('trade.profit'),
                prop: 'profitLoss',
                align: 'right',
                directives: { if: row => isCloseType(row.bizType) }
            },
            {
                name: t('trade.fee'),
                prop: 'commission',
                align: 'right',
                formatter: row => t('trade.fee') + (row.inCurrency || '--')
            },
            { name: t('trade.pendingNo'), prop: 'dealId', align: 'right' },
        ],
    }))

    return unref(columnsMap)[tradeType]
}

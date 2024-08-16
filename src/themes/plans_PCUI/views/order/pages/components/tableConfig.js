import ETF from '@planspc/components/etfIcon'
import { unref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { lte, mul, div, minus, toFixed, plus, gt } from '@/utils/calculation'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { Dialog, Toast, Button } from 'vant'
import { closePboOrder, closeTradePboOrder } from '@/api/trade'
import { getCookie } from '@/utils/util'
import { ElMessage } from 'element-plus'
import mitt from '@/utils/mitt'

const formatTime = val => window.dayjs(val).format('YYYY-MM-DD HH:mm:ss')
const locale = getCookie('lang') === 'zh-CN' ? 'zh' : 'en'

// 成交量/额
const getFormatExecuteNum = t => (val, tradeType, row) => {
    const { numberStatisticMode, direction, inCurrency, outCurrency, accountCurrency } = row
    switch (Number(tradeType)) {
    case 1:
    case 2: {
        return `${val} ${t('trade.volumeUnit')}`
    }
    case 3:
    case 5: {
        if (numberStatisticMode === 1) {
            return val + (direction === 1 ? inCurrency : outCurrency)
        } else if (numberStatisticMode === 2) {
            return val + (direction === 1 ? outCurrency : inCurrency)
        }
        break
    }
    default: {
        return numberStatisticMode === 1 ? `${val} ${t('trade.volumeUnit')}` : val + accountCurrency
    }
    }
}

const getnumberStatisticModeMap = (t) => ({
    1: t('transRecords.orderbyAuantity'),
    2: t('transRecords.orderByAmount')
})

// 获取委托/挂单列表/当前订单配置
export const getPendingColumns = tradeType => {
    const { t } = useI18n({ useScope: 'global' })
    const store = useStore()
    const productMap = computed(() => store.state._quote.productMap)
    const customerInfo = computed(() => store.state._user.customerInfo)
    const assetsInfo = computed(() => customerInfo.value.accountList?.find(el => Number(el.tradeType) === tradeType) || {})
    const currency = assetsInfo.value?.currency
    const currentProduct = (row) => {
        return productMap.value[row.symbolId + '_' + row.tradeType]
    }
    const getVal = (symbolKey, key) => unref(productMap)[symbolKey]?.[key] || '--'

    const numberStatisticModeMap = getnumberStatisticModeMap(t)

    const cancelOrder = (row) => {
        const params = {
            customerNo: row.customerNo,
            customerId: row.customerId,
            accountId: row.accountId,
            tradeType: row.tradeType,
            bizType: row.bizType
        }
        // 玩法2的判断，如果不是撮合就调用closePboOrder，是的话就调用closeTradePboOrder
        if ([5, 9].includes(Number(row.tradeType)) || (Number(row.tradeType) === 2 && currentProduct(row)?.dealMode === 6)) {
            return closeTradePboOrder({
                orderId: row.id,
                ...params,
            })
                .then(res => {
                    if (!res.check()) {
                        Toast(res.msg)
                    }
                    return res.check()
                })
                .catch(err => {
                    console.log(err)
                })
        } else {
            return closePboOrder({
                pboId: String(row.id),
                ...params,
            }, {
                toastErr: false,
            })
                .then(res => {
                    if (!res.check()) {
                        if (res?.code === '10011012') {
                            ElMessage({
                                type: 'error',
                                message: t('trade.closePboOrderFail'),
                            })
                        } else {
                            Toast(res.msg)
                        }
                    }
                    return res.check()
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
    // 撤单
    const handleCancelOrder = (row) => {
        Dialog.confirm({
            title: t('tip'),
            message: t('trade.cancelPendingOrder'),
            confirmButtonText: t('common.sure'),
            cancelButtonText: t('common.cancel')
        }).then(() => {
            cancelOrder(row)
                .then((bool) => {
                    if (bool) {
                        Toast(t('trade.cancalPendingSucc'))
                        store.dispatch('_trade/queryPBOOrderPage', {
                            tradeType: row.tradeType,
                            sortFieldName: 'orderTime',
                            sortType: 'desc',
                        })
                    }
                })
        }).catch(() => { })
    }

    const columnsMap = computed(() => ({
        1: [
            {
                minWidth: 140,
                name: t('headLineTrade.contracts'),
                prop: 'symbolName',
                slots: {
                    default: ({ row }) => {
                        return (
                            <div class={Number(row.direction) === 1 ? 'rise-border font-bold px-1' : 'fall-border font-bold px-1'} >
                                <div>{row.symbolName}</div>
                                <div class="flex items-center text-sm">
                                    <div class={Number(row.direction) === 1 ? 'riseColor font-bold' : 'fallColor font-bold'} >
                                        {Number(row.direction) === 1 ? t('trade.long') : t('trade.short')}
                                    </div>
                                    <div class="text-color bg-primaryAssistColor px-2 ml-1 text-xs">
                                        {row.crossLevelNum}x
                                    </div>
                                </div>
                            </div>
                        )
                    }
                }
            },
            {
                name: `${t('trade.margin')}${currency ? `(${currency})` : ''}`,
                prop: 'occupyTheMargin',
                minWidth: 160,
                formatter: row => row.requestNum ? `${row.requestNum} ${currency}` : '--'
            },
            {
                name: t('trade.size'),
                minWidth: 160,
                formatter: row => row.requestNum ? `${mul(row.requestNum, row.crossLevelNum)} ${currency}` : '--'
            },
            {
                name: t('trade.trustPrice'),
                prop: 'requestPrice',
                minWidth: 140,
            },

            {
                name: t('trade.currentPrice'),
                minWidth: 140,
                formatter: row => {
                    const product = currentProduct(row)
                    return <div class={product?.cur_color}>{product?.cur_price || '--'}</div>
                }
            },
            {
                name: t('headLineTrade.liqPrice'),
                minWidth: 140,
                formatter: row => {
                    const product = currentProduct(row)
                    const requestPrice = row.requestPriceTarget
                    const methods = row.direction === 1 ? minus : plus
                    return requestPrice ? `${toFixed(methods(requestPrice, div(mul(requestPrice, 0.8), row.crossLevelNum)), product.price_digits)}` : '--'
                }
            },
            {
                name: t('headLineTrade.tpSl'),
                minWidth: 120,
                slots: {
                    default: ({ row, }) => {
                        if (!row.takeProfitTarget && !row.stopLossTarget) return '--'
                        return (
                            <div>
                                <div class="flex items-center ">
                                    <div>{locale === 'en' ? 'TP' : t('trade.takeProfit')}:</div>
                                    <div class='ml-1'>
                                        {row.takeProfitTarget ? row.takeProfitTarget : '--'}
                                    </div>
                                </div>
                                <div class="flex items-center">
                                    <div>{locale === 'en' ? 'SL' : t('trade.stopLoss')}:</div>
                                    <div class='ml-1'>
                                        {row.stopLossTarget ? row.stopLossTarget : '--'}
                                    </div>
                                </div>
                            </div>
                        )
                    }
                }
            },
            { name: t('trade.pendingTime'), minWidth: 140, formatter: row => formatTime(row.orderTime) },
            { name: t('trade.pendingNo'), prop: 'id', minWidth: 160 },
            {
                name: t('trade.operating'),
                fixed: 'right',
                align: 'center',
                className: 'operate',
                minWidth: 100,
                slots: {
                    default: ({ row }) => {
                        return (
                            <Button size="small" type="normal" style="color:var(--primary)" onclick={handleCancelOrder.bind(null, row)} >  Cancle</Button>
                        )
                    }
                }
            },
        ],
        2: [
            {
                minWidth: 140,
                name: t('headLineTrade.contracts'),
                prop: 'symbolName',
                slots: {
                    default: ({ row }) => {
                        return (
                            <div class={Number(row.direction) === 1 ? 'rise-border font-bold px-1' : 'fall-border font-bold px-1'} >
                                <div>{row.symbolName}</div>
                                <div class="flex items-center text-sm">
                                    <div class={Number(row.direction) === 1 ? 'riseColor font-bold' : 'fallColor font-bold'} >
                                        {Number(row.direction) === 1 ? t('trade.long') : t('trade.short')}
                                    </div>
                                    <div class="text-color bg-primaryAssistColor px-2 ml-1 text-xs">
                                        {row.crossLevelNum}x
                                    </div>
                                </div>
                            </div>
                        )
                    }
                }
            },
            {
                name: `${t('trade.margin')}`,
                prop: 'occupyTheMargin',
                minWidth: 160,
                formatter: row => row.requestNum ? `${row.requestNum} ${currency}` : '--'
            },
            {
                name: t('trade.size'),
                minWidth: 160,
                formatter: row => <div>
                    <div>
                        {row.requestNum ? `${mul(row.requestNum, row.crossLevelNum)} ${currency}` : '--'}
                    </div>
                    <div class="text-minorColor">
                        {row.requestNum ? `${toFixed(div(mul(row.requestNum, row.crossLevelNum), row.requestPriceTarget), currentProduct(row).numberDigits, 1)} ${currentProduct(row).numberCurrency}` : '--'}
                    </div>
                </div>

            },
            {
                name: t('trade.trustPrice'),
                prop: 'requestPrice',
                minWidth: 140,
            },

            {
                name: t('trade.currentPrice'),
                minWidth: 140,
                formatter: row => {
                    const product = currentProduct(row)
                    return <div class={product?.cur_color}>{product?.cur_price || '--'}</div>
                }
            },
            {
                name: t('headLineTrade.liqPrice'),
                minWidth: 140,
                formatter: row => {
                    const product = currentProduct(row)
                    const requestPrice = row.requestPriceTarget
                    const methods = row.direction === 1 ? minus : plus
                    return requestPrice ? `${toFixed(methods(requestPrice, div(mul(requestPrice, 0.8), row.crossLevelNum)), product.price_digits)}` : '--'
                }
            },
            {
                name: t('headLineTrade.tpSl'),
                minWidth: 120,
                slots: {
                    default: ({ row, }) => {
                        if (!row.takeProfitTarget && !row.stopLossTarget) return '--'
                        return (
                            <div>
                                <div class="flex items-center">
                                    <div>{locale === 'en' ? 'SL' : t('trade.stopLoss')}:</div>
                                    <div class='ml-1'>
                                        {row.stopLossTarget ? row.stopLossTarget : '--'}
                                    </div>
                                </div>
                                <div class="flex items-center ">
                                    <div>{locale === 'en' ? 'TP' : t('trade.takeProfit')}:</div>
                                    <div class='ml-1'>
                                        {row.takeProfitTarget ? row.takeProfitTarget : '--'}
                                    </div>
                                </div>
                            </div>
                        )
                    }
                }
            },
            { name: t('trade.pendingTime'), minWidth: 140, formatter: row => formatTime(row.orderTime) },
            { name: t('trade.pendingNo'), prop: 'id', minWidth: 160 },
            {
                name: t('trade.operating'),
                fixed: 'right',
                align: 'center',
                className: 'operate',
                minWidth: 100,
                slots: {
                    default: ({ row }) => {
                        return (
                            <Button size="small" type="normal" style="color:var(--primary)" onclick={handleCancelOrder.bind(null, row)} >  Cancle</Button>
                        )
                    }
                }
            },
        ],
        3: [
            { name: t('trade.name'), prop: 'symbolName', align: 'left' },
            {
                name: t('trade.direction'),
                prop: 'direction',
                align: 'right',
                width: 100,
                formatter: row => <span class={Number(row.direction) === 1 ? 'riseColor' : 'fallColor'}>
                    {Number(row.direction) === 1 ? t('trade.long') : t('trade.short')}
                </span>
            },
            {
                name: t('transRecords.byAmount'),
                align: 'right',
                minWidth: 150,
                formatter: row => numberStatisticModeMap[row.entryType]
            },
            {
                name: t('transRecords.entrustedAmount'),
                align: 'right',
                minWidth: 150,
                formatter: row => row.requestNum + row.accountCurrency
            },
            { name: t('trade.trustPrice'), prop: 'requestPrice', align: 'right' },
            {
                name: t('trade.currentPrice'),
                align: 'right',
                formatter: row => {
                    const product = currentProduct(row)
                    return <div class={product?.cur_color}>{product?.cur_price || '--'}</div>
                }
            },
            {
                name: t('trade.loan'),
                align: 'right',
                formatter: row => row.loanAmount + row.accountCurrency
            },
            { name: t('trade.trustTime'), align: 'right', minWidth: 180, formatter: row => formatTime(row.trustTime) },
            { name: t('trade.pendingNo'), prop: 'id', align: 'right', minWidth: 200 },
            {
                name: t('c.handle'),
                fixed: 'right',
                align: 'right',
                minWidth: 100,
                slots: {
                    default: ({ row }) => {
                        return (
                            <span
                                className="link"
                                onclick={handleCancelOrder.bind(null, row)}
                            >
                                {t('trade.cancelOrder')}
                            </span>
                        )
                    }
                }
            },
        ],
        5: [
            {
                name: t('trade.name'),
                align: 'left',
                formatter: row => (<div>
                    <span class='name'>
                        {row.symbolName}
                    </span>
                    <ETF v-show={getVal(row.symbolId + '_5', 'etf') === true} />
                </div>)
            },
            {
                name: t('trade.direction'),
                prop: 'direction',
                align: 'right',
                width: 100,
                formatter: row => <span class={Number(row.direction) === 1 ? 'riseColor' : 'fallColor'}>
                    {Number(row.direction) === 1 ? t('trade.long') : t('trade.short')}
                </span>
            },
            {
                name: t('transRecords.byAmount'),
                prop: 'numberStatisticMode',
                align: 'right',
                minWidth: 150,
                formatter: row => numberStatisticModeMap[row.numberStatisticMode]
            },
            {
                name: t('transRecords.entrustedAmount'),
                prop: 'requestNum',
                align: 'right',
                minWidth: 150,
                // formatter: row => row.requestNum + (row.numberStatisticMode === 2 ? row.outCurrency : t('trade.volumeUnit'))
                formatter: row => row.requestNum + row.outCurrency
            },
            { name: t('trade.trustPrice'), prop: 'requestPrice', align: 'right' },
            {
                name: t('trade.currentPrice'),
                align: 'right',
                formatter: row => {
                    const product = currentProduct(row)
                    return <div class={product?.cur_color}>{product?.cur_price || '--'}</div>
                }
            },
            { name: t('trade.trustTime'), align: 'right', minWidth: 180, formatter: row => formatTime(row.trustTime) },
            { name: t('trade.pendingNo'), prop: 'id', align: 'right' },
            {
                name: t('c.handle'),
                fixed: 'right',
                align: 'right',
                minWidth: 100,
                slots: {
                    default: ({ row }) => {
                        return (
                            <span
                                className="link"
                                onclick={handleCancelOrder.bind(null, row)}
                            >
                                {t('trade.cancelOrder')}
                            </span>
                        )
                    }
                }
            },
        ]
    }))
    return unref(columnsMap)[tradeType]
}

// 获取成交记录列表配置
export const getTransactionColumns = (tradeType) => {
    const store = useStore()
    const { t } = useI18n({ useScope: 'global' })
    const productMap = computed(() => store.state._quote.productMap)
    const getVal = (symbolKey, key) => unref(productMap)[symbolKey]?.[key] || '--'
    const currentProduct = (row) => {
        return productMap.value[row.symbolId + '_' + tradeType]
    }

    // 判断是否是平仓
    const isCloseType = (bizType) => {
        if ([4, 5, 6, 7, 8].includes(Number(bizType))) {
            return true
        } else {
            return false
        }
    }

    const customerInfo = computed(() => store.state._user.customerInfo)
    const assetsInfo = computed(() => customerInfo.value.accountList?.find(el => Number(el.tradeType) === Number(tradeType)) || {})
    const currency = assetsInfo.value?.currency

    const formatExecuteNum = getFormatExecuteNum(t)
    const numberStatisticModeMap = getnumberStatisticModeMap(t)
    const columnsMap = computed(() => ({
        1: [
            {
                minWidth: 140,
                name: t('headLineTrade.contracts'),
                prop: 'symbolName',
                slots: {
                    default: ({ row }) => {
                        return (
                            <div class={Number(row.direction) === 1 ? 'rise-border font-bold px-1' : 'fall-border font-bold px-1'} >
                                <div>{row.symbolName}</div>
                                <div class="flex items-center text-sm">
                                    <div class={Number(row.direction) === 1 ? 'riseColor font-bold' : 'fallColor font-bold'} >
                                        {Number(row.direction) === 1 ? t('trade.long') : t('trade.short')}
                                    </div>
                                </div>
                            </div>
                        )
                    }
                }
            },
            {
                name: `${t('trade.margin')}${currency ? `(${currency})` : ''}`,
                prop: 'margin',
                minWidth: 160,
                formatter: (row) => {
                    // 开仓显示该笔开仓的占用保证金
                    if ([1, 2, 3, 9, 12, 13].includes(row.bizType) && row.occupyMargin) return `${row.occupyMargin} ${row.accountCurrency}`
                    return '--'
                }
            },
            {
                name: `${t('trade.profit')}`,
                prop: 'profitLoss',
                minWidth: 160,
                formatter: row => <span class={{ 'riseColor': parseFloat(row.profitLoss) > 0, 'fallColor': parseFloat(row.profitLoss) < 0 }}>
                    {row.profitLoss ? `${row.profitLoss} ${currency}` : '--'}
                </span>
            },
            {
                name: `${t('trade.fee')}`,
                prop: 'commission',
                minWidth: 110,
                formatter: row => row.commission ? `${row.commission} ${row.accountCurrency}` : '--'
            },
            {
                name: t('headLineTrade.entryPrice'),
                prop: 'requestPrice',
                minWidth: 140,
                formatter: row => {
                    // 成交记录限价平仓单新增了个originalRequestPrice字段，作为前端的订单价
                    if (row.bizType === 14) {
                        return row.originalRequestPrice
                    }
                    return isCloseType(row.bizType) ? '--' : row.requestPrice
                }
            },
            {
                name: t('trade.executePrice'),
                prop: 'executePrice',
                minWidth: 140,
            },
            {
                name: t('headLineTrade.tpSl'),
                minWidth: 100,
                slots: {
                    default: ({ row, }) => {
                        return (
                            <div>
                                <div class="flex items-center">
                                    <div>{locale === 'en' ? 'SL' : t('trade.stopLoss')}:</div>
                                    <div class='ml-1'>
                                        {row.stopLoss * 1 !== 0 ? row.stopLoss : '--'}
                                    </div>
                                </div>
                                <div class="flex items-center ">
                                    <div>{locale === 'en' ? 'TP' : t('trade.takeProfit')}:</div>
                                    <div class='ml-1'>
                                        {row.takeProfit * 1 !== 0 ? row.takeProfit : '--'}
                                    </div>
                                </div>
                            </div>
                        )
                    }
                }
            },
            {
                name: t('trade.orderType'),
                minWidth: 120,
                formatter: (row, column, cellValue, index, rawResponse) => {
                    return rawResponse.bizTypeText[row.bizType]
                }
            },
            {
                name: t('trade.dealTime'),
                width: 160,
                formatter: row => formatTime(row.executeTime)
            },
            { name: t('trade.pendingNo'), minWidth: 120, prop: 'dealId', },
        ],
        2: [
            {
                minWidth: 140,
                name: t('headLineTrade.contracts'),
                prop: 'symbolName',
                slots: {
                    default: ({ row }) => {
                        return (
                            <div class={Number(row.direction) === 1 ? 'rise-border font-bold px-1' : 'fall-border font-bold px-1'} >
                                <div>{row.symbolName}</div>
                                <div class="flex items-center text-sm">
                                    <div class={Number(row.direction) === 1 ? 'riseColor font-bold' : 'fallColor font-bold'} >
                                        {Number(row.direction) === 1 ? t('trade.long') : t('trade.short')}
                                    </div>
                                </div>
                            </div>
                        )
                    }
                }
            },
            {
                name: t('trade.dealTime'),
                width: 160,
                formatter: row => formatTime(row.executeTime)
            },
            { name: t('trade.pendingNo'), minWidth: 120, prop: 'dealId', },
            {
                name: t('trade.orderType'),
                minWidth: 120,
                formatter: (row, column, cellValue, index, rawResponse) => {
                    return rawResponse.bizTypeText[row.bizType]
                }
            },
            {
                name: `${t('trade.margin')}`,
                prop: 'margin',
                minWidth: 140,
                formatter: (row) => {
                    // 开仓显示该笔开仓的占用保证金
                    if ([1, 2, 3, 9, 12, 13].includes(row.bizType) && row.occupyMargin) return `${row.occupyMargin} ${row.accountCurrency}`
                    return '--'
                }
            },
            // {
            //     name: t('trade.size'),
            //     minWidth: 140,
            //     formatter: row => <div>
            //         <div>
            //             {row.requestNum ? `${mul(row.requestNum, row.crossLevelNum)} ${currency}` : '--'}
            //         </div>
            //         <div class="text-minorColor">
            //             {row.realExecuteNum ? `${row.realExecuteNum} ${currentProduct(row).numberCurrency}` : '--'}
            //         </div>
            //     </div>
            // },
            {
                name: t('trade.executePrice'),
                prop: 'executePrice',
                minWidth: 140,
            },
            {
                name: t('headLineTrade.tpSl'),
                minWidth: 140,
                slots: {
                    default: ({ row, }) => {
                        return (
                            <div>
                                <div class="flex items-center">
                                    <div>{locale === 'en' ? 'SL' : t('trade.stopLoss')}:</div>
                                    <div class='ml-1'>
                                        {row.stopLoss * 1 !== 0 ? row.stopLoss : '--'}
                                    </div>
                                </div>
                                <div class="flex items-center ">
                                    <div>{locale === 'en' ? 'TP' : t('trade.takeProfit')}:</div>
                                    <div class='ml-1'>
                                        {row.takeProfit * 1 !== 0 ? row.takeProfit : '--'}
                                    </div>
                                </div>
                            </div>
                        )
                    }
                }
            },
            {
                name: `${t('trade.profit')}`,
                prop: 'profitLoss',
                minWidth: 140,
                formatter: row => <span class={{ 'riseColor': parseFloat(row.profitLoss) > 0, 'fallColor': parseFloat(row.profitLoss) < 0 }}>
                    {row.profitLoss ? `${row.profitLoss} ${currency}` : '--'}
                </span>
            },
            {
                name: `${t('trade.fee')}`,
                prop: 'commission',
                minWidth: 120,
                formatter: row => row.commission ? `${row.commission} ${row.accountCurrency}` : '--'
            },
            {
                name: t('headLineTrade.interest'),
                prop: 'interest',
                minWidth: 120,
                formatter: row => row.overnightInterest && ![1, 2, 3, 9, 12, 13].includes(row.bizType) ? `${row.overnightInterest} ${currency}` : '--'
            },
            {
                name: t('trade.netPL'),
                minWidth: 140,
                formatter: row => {
                    // net p/l=p/l-fees+interest（interest为负数）
                    return `${plus(minus(row.profitLoss || 0, row.commission || 0), row.overnightInterest || 0)} ${currency}`
                }
            },
        ],
        3: [
            {
                name: t('trade.dealTime'),
                align: 'left',
                width: 160,
                formatter: row => formatTime(row.executeTime)
            },
            {
                name: t('trade.name'),
                align: 'left',
                minWidth: 120,
                prop: 'symbolName'
            },
            {
                name: t('trade.direction'),
                align: 'right',
                width: 80,
                formatter: row => <span class={Number(row.direction) === 1 ? 'riseColor' : 'fallColor'}>
                    {Number(row.direction) === 1 ? t('trade.long') : t('trade.short')}
                </span>
            },
            {
                name: t('trade.orderType'),
                align: 'right',
                width: 140,
                formatter: (row, column, cellValue, index, rawResponse) => {
                    return rawResponse.bizTypeText[row.bizType]
                }
            },
            {
                name: t('transRecords.byAmount'),
                prop: 'numberStatisticMode',
                align: 'right',
                width: 160,
                formatter: row => numberStatisticModeMap[row.numberStatisticMode]
            },
            {
                name: t('transRecords.entrustedAmount'),
                prop: 'requestNum',
                align: 'right',
                minWidth: 150,
                formatter: row => row.requestNum + row.outCurrency
            },
            {
                name: t('transRecords.volumeAmount'),
                align: 'right',
                minWidth: 150,
                formatter: row => formatExecuteNum(row.executeNum, tradeType, row)
            },
            {
                name: t('trade.trustPrice'),
                prop: 'requestPrice',
                align: 'right',
                minWidth: 140,
                formatter: row => (Number(row.bizType) === 1 || isCloseType(row.bizType)) ? '--' : row.requestPrice
            },
            { name: t('trade.dealAvgPrice'), prop: 'executePrice', align: 'right', minWidth: 120, },
            {
                name: t('trade.loan'),
                prop: 'loanAmount',
                align: 'right',
                minWidth: 150,
                formatter: row => row.loanAmount + row.outCurrency
            },
            {
                name: t('trade.fee'),
                align: 'right',
                minWidth: 150,
                formatter: row => row.commission + row.inCurrency
            },
            { name: t('trade.pendingNo'), prop: 'dealId', align: 'right' },
        ],
        5: [
            {
                name: t('trade.dealTime'),
                align: 'left',
                width: 160,
                formatter: row => formatTime(row.executeTime)
            },
            {
                name: t('trade.name'),
                align: 'left',
                minWidth: 120,
                formatter: row => (<div>
                    <span class='name'>
                        {row.symbolName}
                    </span>
                    <ETF v-show={getVal(row.symbolId + '_5', 'etf') === true} />
                </div>)
            },
            {
                name: t('trade.direction'),
                align: 'right',
                width: 80,
                formatter: row => <span class={Number(row.direction) === 1 ? 'riseColor' : 'fallColor'}>
                    {Number(row.direction) === 1 ? t('trade.long') : t('trade.short')}
                </span>
            },
            {
                name: t('trade.orderType'),
                align: 'right',
                minWidth: 140,
                formatter: (row, column, cellValue, index, rawResponse) => {
                    return rawResponse.bizTypeText[row.bizType]
                }
            },
            {
                name: t('transRecords.byAmount'),
                prop: 'numberStatisticMode',
                align: 'right',
                minWidth: 160,
                formatter: row => numberStatisticModeMap[row.numberStatisticMode] || '--'
            },
            {
                name: t('transRecords.entrustedAmount'),
                prop: 'requestNum',
                align: 'right',
                minWidth: 150,
                // formatter: row => row.requestNum + `(${row.numberStatisticMode === 2 ? row.accountCurrency : t('trade.volumeUnit')})`
                formatter: row => row.requestNum + row.outCurrency

            },
            {
                name: t('transRecords.volumeAmount'),
                align: 'right',
                minWidth: 150,
                // formatter: row => formatExecuteNum(row.executeNum, tradeType, row)
                formatter: row => row.executeNum + row.outCurrency
            },
            {
                name: t('trade.trustPrice'),
                prop: 'requestPrice',
                align: 'right',
                minWidth: 150,
            },
            { name: t('trade.dealAvgPrice'), prop: 'executePrice', align: 'right', minWidth: 120, },
            {
                name: t('trade.fee'),
                align: 'right',
                minWidth: 150,
                formatter: row => row.commission + row.inCurrency
            },
            { name: t('trade.pendingNo'), prop: 'dealId', align: 'right' },
        ],
    }))
    return unref(columnsMap)[tradeType]
}

// 获取持仓列表配置
export const getAssetColumns = (tradeType) => {
    const { t } = useI18n({ useScope: 'global' })
    const store = useStore()
    const router = useRouter()
    const customerInfo = computed(() => store.state._user.customerInfo)
    const productMap = computed(() => store.state._quote.productMap)
    const productActived = computed(() => store.getters.productActived)
    const currentProduct = (row) => {
        return productMap.value[row.symbolId + '_' + row.tradeType]
    }
    const assetsInfo = computed(() => customerInfo.value.accountList?.find(el => Number(el.tradeType) === tradeType) || {})

    // 平仓调窗
    const openClosePosition = (row, closePosition, isLimit) => {
        unref(closePosition).open(row, isLimit)
    }

    // 止盈止损弹窗
    const openSltp = (row, sltp) => {
        store.dispatch('_quote/querySymbolInfo', row.symbolId)
        unref(sltp).open(row)
    }

    // 跳转到还款页面
    const goRepayment = (row) => {
        if (row.accountId) {
            router.push({
                path: '/order/returnMoney',
                query: {
                    currency: row.currency,
                    accountId: row.accountId,
                    tradeType
                }
            })
        } else {
            router.push({
                path: '/order/chooseAccount',
                query: {
                    accountId: assetsInfo.value.accountId,
                    tradeType,
                    type: 3
                }
            })
        }
    }

    const currency = assetsInfo.value?.currency

    const columnsMap = computed(() => ({
        1: [
            {
                minWidth: 140,
                name: t('headLineTrade.contracts'),
                prop: 'symbolName',
                slots: {
                    default: ({ row }) => {
                        return (
                            <div class={Number(row.direction) === 1 ? 'rise-border font-bold px-1' : 'fall-border font-bold px-1'} >
                                <div>{row.symbolName}</div>
                                <div class="flex items-center text-sm">
                                    <div class={Number(row.direction) === 1 ? 'riseColor font-bold' : 'fallColor font-bold'} >
                                        {Number(row.direction) === 1 ? t('trade.long') : t('trade.short')}
                                    </div>
                                    <div class="text-color bg-primaryAssistColor px-2 ml-1 text-xs">
                                        {row.crossLevelNum}x
                                    </div>
                                </div>
                            </div>
                        )
                    }
                }
            },
            {
                name: `${t('trade.margin')}${currency ? `(${currency})` : ''}`,
                prop: 'occupyTheMargin',
                minWidth: 160,
                formatter: row => <span>
                    {row.occupyTheMargin ? `${row.occupyTheMargin} ${currency}` : '--'}
                </span>
            },
            {
                name: `${t('trade.size')}${currency ? `(${currency})` : ''}`,
                minWidth: 160,
                formatter: row => <span>
                    {row.currentTradeAmount ? `${row.currentTradeAmount} ${currency}` : '--'}
                </span>
            },
            {
                name: `${t('trade.profit')}${currency ? `(${currency})` : ''}`,
                prop: 'direction',
                minWidth: 160,
                formatter: row => <span class={{ 'riseColor': parseFloat(row.profitLoss) > 0, 'fallColor': parseFloat(row.profitLoss) < 0 }}>
                    {row.profitLoss ? `${row.profitLoss} ${currency}` : '--'}
                </span>
            },
            {
                name: t('headLineTrade.entryPrice'),
                prop: 'openPrice',
                minWidth: 140,
            },
            {
                name: t('trade.currentPrice'),
                minWidth: 140,
                formatter: row => {
                    const product = currentProduct(row)
                    return <div class={product?.cur_color}>{product?.cur_price || '--'}</div>
                }
            },
            {
                name: t('headLineTrade.liqPrice'),
                minWidth: 140,
                formatter: row => {
                    const product = currentProduct(row)
                    const openPrice = row.openPrice
                    const methods = row.direction === 1 ? minus : plus
                    return openPrice ? `${toFixed(methods(openPrice, div(mul(openPrice, 0.8), row.crossLevelNum)), product.price_digits)}` : '--'
                }
            },
            {
                name: t('headLineTrade.tpSl'),
                width: 160,
                slots: {
                    default: ({ row, onGetComponentRefs }) => {
                        const refs = onGetComponentRefs()
                        if (lte(parseFloat(row.takeProfitDecimal || 0), 0) && lte(parseFloat(row.stopLossDecimal || 0), 0)) {
                            return <Button icon="plus" type="normal" size="small" onclick={(e) => {
                                e.stopPropagation()
                                openSltp(row, refs.sltp)
                            }}>{t('compLang.add')}</Button>
                        }

                        return (
                            <div class="flex items-center">
                                <div>
                                    <div class="flex items-center ">
                                        <div>{locale === 'en' ? 'TP' : t('trade.takeProfit')}:</div>
                                        <div class='ml-1'>
                                            {row.takeProfitDecimal * 1 !== 0 ? row.takeProfitDecimal : '--'}
                                        </div>
                                    </div>
                                    <div class="flex items-center">
                                        <div>{locale === 'en' ? 'SL' : t('trade.stopLoss')}:</div>
                                        <div class='ml-1'>
                                            {row.stopLossDecimal * 1 !== 0 ? row.stopLossDecimal : '--'}
                                        </div>
                                    </div>
                                </div>
                                <Button size="small" type="normal" class="ml-2" onclick={(e) => {
                                    e.stopPropagation()
                                    openSltp(row, refs.sltp)
                                }}>{t('compLang.edit')}</Button>
                            </div>
                        )
                    }
                }
            },
            {
                name: t('trade.operating'),
                fixed: 'right',
                className: 'operate',
                align: 'center',
                width: 80,
                slots: {
                    default: ({ row, onGetComponentRefs }) => {
                        const refs = onGetComponentRefs()
                        return (
                            <Button size="small" type="primary" onclick={(e) => {
                                e.stopPropagation()
                                openClosePosition(row, refs.closePosition)
                            }} >  {t('trade.closed')}</Button>
                        )
                    }
                }
            },
        ],
        2: [
            {
                minWidth: 160,
                name: t('headLineTrade.contracts'),
                prop: 'symbolName',
                slots: {
                    default: ({ row }) => {
                        const isOpen = !store.state._trade.closeChartPositionLineId?.includes(row.positionId)
                        return (
                            <div class="flex items-center w-full">
                                <div class={Number(row.direction) === 1 ? 'rise-border font-bold px-1' : 'fall-border font-bold px-1'} >
                                    <div>{row.symbolName}</div>
                                    <div class="flex items-center text-sm">
                                        <div class={Number(row.direction) === 1 ? 'riseColor font-bold' : 'fallColor font-bold'} >
                                            {Number(row.direction) === 1 ? t('trade.long') : t('trade.short')}
                                        </div>
                                        <div class="text-color bg-primaryAssistColor px-2 ml-1 text-xs">
                                            {row.crossLevelNum}x
                                        </div>
                                    </div>
                                </div>
                                {/* 持仓与当前交易品种不同，点击持仓交易线icon，切换为持仓的k线图，並打開交易線 */}
                                <div class="flex-1 flex justify-end" onclick={(e) => {
                                    e.stopPropagation()

                                    if (productActived.value.symbolId != row.symbolId) {
                                        router.push({
                                            path: '/order',
                                            query: {
                                                tradeType: row.tradeType,
                                                symbolId: row.symbolId,
                                            },
                                        })
                                        if (!isOpen) {
                                            mitt.emit('addPositionLine', row)
                                        }
                                    } else {
                                        mitt.emit(isOpen ? 'removePositionLine' : 'addPositionLine', row)
                                    }
                                }}>
                                    <img src={isOpen ? '/images/position-line-open.svg' : '/images//position-line-close.svg'} class="ml-2" />
                                </div>
                            </div>
                        )
                    }
                }
            },
            {
                name: `${t('trade.margin')}`,
                prop: 'occupyTheMargin',
                minWidth: 160,
                formatter: row => <span>
                    {row.occupyTheMargin ? `${row.occupyTheMargin} ${currency}` : '--'}
                </span>
            },
            {
                name: t('trade.size'),
                minWidth: 160,
                formatter: row => <div>
                    <div>
                        {row.currentTradeAmount ? `${row.currentTradeAmount} ${currency}` : '--'}
                    </div>
                    <div class="text-minorColor">
                        {row.currentTradeAmount ? `${toFixed(div(row.currentTradeAmount, row.openPrice), currentProduct(row).numberDigits, 1)} ${currentProduct(row).numberCurrency}` : '--'}
                    </div>
                </div>
            },
            {
                name: t('headLineTrade.entryPrice'),
                prop: 'openPrice',
                minWidth: 140,
            },
            {
                name: t('trade.currentPrice'),
                minWidth: 140,
                formatter: row => {
                    const product = currentProduct(row)
                    return <div class={product?.cur_color}>{product?.cur_price || '--'}</div>
                }
            },
            {
                name: t('headLineTrade.liqPrice'),
                minWidth: 140,
                formatter: row => {
                    const product = currentProduct(row)
                    const openPrice = row.openPrice
                    const methods = row.direction === 1 ? minus : plus
                    return openPrice ? `${toFixed(methods(openPrice, div(mul(openPrice, 0.8), row.crossLevelNum)), product.price_digits)}` : '--'
                }
            },
            {
                name: t('headLineTrade.tpSl'),
                width: 160,
                slots: {
                    default: ({ row, onGetComponentRefs }) => {
                        const refs = onGetComponentRefs()
                        const slots = {
                            reference: () => <div class="flex" onclick={(e) => {
                                e.stopPropagation()
                                openSltp(row, refs.sltp)
                            }}>
                                <div>
                                    <div class="flex items-center">
                                        <div>{locale === 'en' ? 'SL' : t('trade.stopLoss')}:</div>
                                        <div class='ml-1'>
                                            {row.stopLossDecimal * 1 !== 0 ? row.stopLossDecimal : '--'}
                                        </div>
                                    </div>
                                    <div class="flex items-center ">
                                        <div>{locale === 'en' ? 'TP' : t('trade.takeProfit')}:</div>
                                        <div class='ml-1'>
                                            {row.takeProfitDecimal * 1 !== 0 ? row.takeProfitDecimal : '--'}
                                        </div>
                                    </div>
                                </div>
                                <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="pen" class="w-3 h-3 ml-3 mt-1 edit-icon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M36.4 360.9L13.4 439 1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1L73 498.6l78.1-23c12.4-3.6 23.7-9.9 33.4-18.4c1.4-1.2 2.7-2.5 4-3.8L492.7 149.3c21.9-21.9 24.6-55.6 8.2-80.5c-2.3-3.5-5.1-6.9-8.2-10L453.3 19.3c-25-25-65.5-25-90.5 0L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4zm46 13.5c1.7-5.6 4.5-10.8 8.4-15.2c.6-.6 1.1-1.2 1.7-1.8L321 129 383 191 154.6 419.5c-4.7 4.7-10.6 8.2-17 10.1l-23.4 6.9L59.4 452.6l16.1-54.8 6.9-23.4z"></path></svg>
                            </div>,
                        }
                        return (
                            <popover v-slots={slots} placement="bottom">
                                {`${t('compLang.edit')} ${t('headLineTrade.tpSl')}`}
                            </popover>
                        )
                    }
                }
            },
            {
                name: t('headLineTrade.interest'),
                prop: 'interest',
                minWidth: 120,
                formatter: row => row.interest ? `${row.interest} ${currency}` : '--'
            },
            {
                name: `${t('trade.profit')}`,
                prop: 'direction',
                minWidth: 160,
                formatter: row => <span class={{ 'riseColor': parseFloat(row.profitLoss) > 0, 'fallColor': parseFloat(row.profitLoss) < 0 }}>
                    {row.profitLoss ? `${row.profitLoss} ${currency}` : '--'}
                </span>
            },
            {
                name: t('trade.operating'),
                fixed: 'right',
                className: 'operate',
                align: 'center',
                width: 100,
                slots: {
                    default: ({ row, onGetComponentRefs }) => {
                        const refs = onGetComponentRefs()
                        return (
                            <Button size="small" class="h-7 px-3" type="primary" onclick={(e) => {
                                e.stopPropagation()
                                openClosePosition(row, refs.closePosition)
                            }} >  {t('trade.closed')}</Button>
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
            // { name: t('assets.maxLoan'), prop: 'availableLoan', align: 'right' },
            { name: t('trade.carry'), prop: 'withdrawAmount', align: 'right' },
            {
                name: t('c.handle'),
                fixed: 'right',
                className: 'operate',
                align: 'right',
                width: locale === 'zh' ? 100 : 145,
                slots: {
                    default: ({ row }) => {
                        return (
                            <>
                                {/* <span className='link' onclick={goLoan.bind(null, row)} type='text'>
                                    { t('trade.loan') }
                                </span> */}
                                <span className='link' onclick={goRepayment.bind(null, row)} type='text'>
                                    {t('trade.repayment')}
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

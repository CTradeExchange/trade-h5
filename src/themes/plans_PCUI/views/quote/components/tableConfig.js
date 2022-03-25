import ETF from '@planspc/components/etfIcon'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { computed, ref, unref } from 'vue'
import { addCustomerOptional, removeCustomerOptional } from '@/api/trade'
import { findFundPage } from '@/api/fund.js'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { Toast } from 'vant'

export const getColumns = tradeType => {
    const store = useStore()
    const router = useRouter()
    const { t } = useI18n({ useScope: 'global' })
    const productMap = computed(() => store.state._quote.productMap)
    const getVal = (symbolKey, key) => unref(productMap)[symbolKey]?.[key] || '--'
    // 基金列表
    const fundList = ref([])

    /** 添加自选逻辑 */
    const userSelfSymbolList = computed(() => store.getters.userSelfSymbolList || {})
    const isCollect = (tradeType, symbolId) => userSelfSymbolList.value[tradeType]?.find(id => parseInt(id) === parseInt(symbolId))
    const addOptional = (event, { symbolId, tradeType }) => {
        event.stopPropagation()
        if (isCollect(tradeType, symbolId)) {
            removeCustomerOptional({ symbolList: [symbolId], tradeType }).then(res => {
                if (res.check()) {
                    store.dispatch('_user/queryCustomerOptionalList')
                    ElMessage.success(t('trade.removeOptionalOk'))
                }
            }).catch(err => {
            })
        } else {
            addCustomerOptional({ symbolList: [symbolId], tradeType }).then(res => {
                if (res.check()) {
                // 手动修改optional值
                    store.commit('_user/Update_optional', 1)
                    store.dispatch('_user/queryCustomerOptionalList')
                    ElMessage.success(t('trade.addOptionalOk'))
                }
            }).catch(err => {
            })
        }
    }
    /** 添加自选逻辑 */

    // 获取基金产品列表，
    const getFundPage = () => {
        findFundPage({ customerGroupId: store.getters.customerGroupId, size: 1000 }).then(res => {
            if (res.check()) {
                fundList.value = res.data.records
            }
        })
    }
    getFundPage()

    // 去交易
    const gotoOrder = (event, product) => {
        event.stopPropagation()
        router.push({
            name: 'Order',
            query: {
                symbolId: product.symbolId,
                tradeType: product.tradeType
            }
        })
    }

    // 去基金
    const gotoFund = (event, product) => {
        event.stopPropagation()
        const fund = fundList.value.find(el => el.shareTokenCode === product.baseCurrency)
        if (fund) {
            router.push({
                name: 'Fund',
                query: {
                    fundId: product.fundId
                }
            })
        } else {
            Toast(t('trade.noFeature'))
        }
    }

    const commonBtns = ({ row }) => (
        <>
            <span class='btn active' onclick={(event) => gotoFund(event, row)} v-show={row.etf}>
                { t('fundInfo.buy') }
            </span>
            <span class='btn' onclick={(event) => gotoOrder(event, row)}>
                { t('route.trade') }
            </span>
        </>
    )

    const columnsMap = {
        1: [
            {
                name: t('trade.name'),
                align: 'left',
                minWidth: 160,
                className: 'name',
                formatter: row => (<div class='chunk'>
                    {
                        isCollect(row.tradeType, row.symbolId) ? <i class='icon icon_hangqingliebiaoyijiazixuan star' onclick={(event) => addOptional(event, row)}></i> : <i class='icon icon_hangqingliebiaoweijiazixuan star' onclick={(event) => addOptional(event, row)}></i>
                    }
                    <div>
                        <span class='name'>
                            { row.symbolCode }
                        </span>
                    </div>
                </div>)
            },
            {
                name: t('trade.sellPrice'),
                align: 'left',
                minWidth: 160,
                formatter: row => getVal(row.symbolKey, 'sell_price')
            },
            {
                name: t('trade.buyPrice'),
                align: 'left',
                minWidth: 160,
                formatter: row => getVal(row.symbolKey, 'buy_price')
            },
            {
                name: t('trade.upDownWidth'),
                align: 'left',
                minWidth: 160,
                className: 'upDownWidth',
                formatter: row => (
                    <span className={unref(productMap)[row.symbolKey]?.upDownColor}>
                        {getVal(row.symbolKey, 'upDownWidth')}
                    </span>
                )

            },
            {
                name: t('trade.highPrice'),
                align: 'left',
                minWidth: 160,
                formatter: row => getVal(row.symbolKey, 'high_price')
            },
            {
                name: t('trade.lowPrice'),
                align: 'left',
                minWidth: 160,
                formatter: row => getVal(row.symbolKey, 'low_price')
            },
            {
                name: t('trade.operating'),
                align: 'right',
                minWidth: 200,
                fixed: 'right',
                slots: {
                    default: commonBtns
                }
            },
        ],
        2: [
            {
                name: t('trade.name'),
                align: 'left',
                minWidth: 160,
                className: 'name',
                formatter: row => (<div class='chunk'>
                    {
                        isCollect(row.tradeType, row.symbolId) ? <i class='icon icon_hangqingliebiaoyijiazixuan star' onclick={(event) => addOptional(event, row)}></i> : <i class='icon icon_hangqingliebiaoweijiazixuan star' onclick={(event) => addOptional(event, row)}></i>
                    }
                    <div>
                        <span class='name'>
                            { row.symbolCode }
                        </span>
                    </div>
                </div>)
            },
            {
                name: t('trade.sellPrice'),
                align: 'left',
                minWidth: 160,
                formatter: row => getVal(row.symbolKey, 'sell_price')
            },
            {
                name: t('trade.buyPrice'),
                align: 'left',
                minWidth: 160,
                formatter: row => getVal(row.symbolKey, 'buy_price')
            },
            {
                name: t('trade.upDownWidth'),
                align: 'left',
                minWidth: 160,
                className: 'upDownWidth',
                formatter: row => (
                    <span className={unref(productMap)[row.symbolKey]?.upDownColor}>
                        {getVal(row.symbolKey, 'upDownWidth')}
                    </span>
                )

            },
            {
                name: t('trade.highPrice'),
                align: 'left',
                minWidth: 160,
                formatter: row => getVal(row.symbolKey, 'high_price')
            },
            {
                name: t('trade.lowPrice'),
                align: 'left',
                minWidth: 160,
                formatter: row => getVal(row.symbolKey, 'low_price')
            },
            {
                name: t('trade.operating'),
                align: 'right',
                minWidth: 200,
                fixed: 'right',
                slots: {
                    default: commonBtns
                }
            }
        ],
        3: [
            {
                name: t('trade.name'),
                align: 'left',
                minWidth: 160,
                className: 'name',
                formatter: row => (<div class='chunk'>
                    {
                        isCollect(row.tradeType, row.symbolId) ? <i class='icon icon_hangqingliebiaoyijiazixuan star' onclick={(event) => addOptional(event, row)}></i> : <i class='icon icon_hangqingliebiaoweijiazixuan star' onclick={(event) => addOptional(event, row)}></i>
                    }
                    <div>
                        <span class='name'>
                            { row.symbolCode }
                        </span>
                    </div>
                </div>)
            },
            {
                name: t('trade.newPrice'),
                align: 'left',
                minWidth: 160,
                formatter: row => (
                    <span className={unref(productMap)[row.symbolKey]?.upDownColor}>
                        {getVal(row.symbolKey, 'price')}
                    </span>
                )
            },
            {
                name: t('trade.changePrice'),
                align: 'left',
                minWidth: 160,
                formatter: row => (
                    <span className={unref(productMap)[row.symbolKey]?.upDownColor}>
                        { getVal(row.symbolKey, 'upDownAmount') > 0 ? '+' : '' }{ getVal(row.symbolKey, 'upDownAmount') }
                    </span>
                )

            },
            {
                name: t('trade.upDownWidth'),
                align: 'left',
                minWidth: 160,
                className: 'upDownWidth',
                formatter: row => (
                    <span className={unref(productMap)[row.symbolKey]?.upDownColor}>
                        {getVal(row.symbolKey, 'upDownWidth')}
                    </span>
                )

            },
            {
                name: t('trade.highPrice'),
                align: 'left',
                minWidth: 160,
                formatter: row => getVal(row.symbolKey, 'high_price')
            },
            {
                name: t('trade.lowPrice'),
                align: 'left',
                minWidth: 160,
                formatter: row => getVal(row.symbolKey, 'low_price')
            },
            {
                name: t('trade.operating'),
                align: 'right',
                minWidth: 200,
                fixed: 'right',
                slots: {
                    default: commonBtns
                }
            }
        ],
        5: [
            {
                name: t('trade.name'),
                align: 'left',
                minWidth: 160,
                className: 'name',
                formatter: row => (<div class='chunk'>
                    {
                        isCollect(row.tradeType, row.symbolId) ? <i class='icon icon_hangqingliebiaoyijiazixuan star' onclick={(event) => addOptional(event, row)}></i> : <i class='icon icon_hangqingliebiaoweijiazixuan star' onclick={(event) => addOptional(event, row)}></i>
                    }
                    <div>
                        <span class='name'>
                            { row.symbolCode }
                        </span>
                        <ETF v-show={getVal(row.symbolKey, 'etf') === true} />
                    </div>
                </div>)
            },
            {
                name: t('trade.newPrice'),
                align: 'left',
                minWidth: 160,
                formatter: row => (
                    <span className={unref(productMap)[row.symbolKey]?.upDownColor}>
                        {getVal(row.symbolKey, 'price')}
                    </span>
                )
            },
            {
                name: t('trade.changePrice'),
                align: 'left',
                minWidth: 160,
                formatter: row => (
                    <span className={unref(productMap)[row.symbolKey]?.upDownColor}>
                        { getVal(row.symbolKey, 'upDownAmount') > 0 ? '+' : '' }{ getVal(row.symbolKey, 'upDownAmount') }
                    </span>
                )

            },
            {
                name: t('trade.upDownWidth'),
                align: 'left',
                minWidth: 160,
                className: 'upDownWidth',
                formatter: row => (
                    <span className={unref(productMap)[row.symbolKey]?.upDownColor}>
                        {getVal(row.symbolKey, 'upDownWidth')}
                    </span>
                )

            },
            {
                name: t('trade.highPrice'),
                align: 'left',
                minWidth: 160,
                formatter: row => getVal(row.symbolKey, 'high_price')
            },
            {
                name: t('trade.lowPrice'),
                align: 'left',
                minWidth: 160,
                formatter: row => getVal(row.symbolKey, 'low_price')
            },
            {
                name: t('trade.operating'),
                align: 'right',
                minWidth: 200,
                fixed: 'right',
                slots: {
                    default: commonBtns
                }
            }
        ]
    }

    return columnsMap[tradeType]
}

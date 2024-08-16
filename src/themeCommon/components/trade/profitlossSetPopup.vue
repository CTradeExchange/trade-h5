<template>
    <popup v-model:show='show' closeable :position="$isPC ? 'center' : 'bottom'" :title="$t('trade.slForPosition')" @close='close'>
        <div class='flex items-center mb-5'>
            <van-tag
                :color="Number(data.direction) === 1 ? 'var(--riseColor)' : 'var(--fallColor)'"
                size='medium'
                style='--van-tag-border-radius: 4px'
                text-color='#fff'
            >
                {{ Number(data.direction) === 1 ? 'L' : 'S' }}
            </van-tag>
            <span class='text-base font-bold mx-2'>
                {{ product.symbolName }}
            </span>
        </div>

        <div class='flex justify-space-between items-center mb-5 text-sm'>
            <span class='text-minorColor'>
                {{ $t('trade.currentPrice') }}
            </span>
            <span class='font-bold' :class='product?.cur_color'>
                {{ product?.cur_price || '--' }}
            </span>
        </div>

        <div class='mb-5'>
            <div class='text-base mb-1'>
                {{ $t('trade.stopLossPrice') }}
                <span
                    :class="{
                        'text-fallColor': lte(parseFloat(lossPercentage), 0) || isEmpty(stopLossPrice),
                        'text-riseColor': gt(parseFloat(lossPercentage), 0),
                        'text-line-through': lossPercentage === '-100%' || lossPercentage === '500%',
                    }"
                >
                    ({{ lossPercentage }})
                </span>
            </div>
            <div class='flex justify-space-between filed-wrap'>
                <van-stepper
                    v-model='stopLossPrice'
                    allow-empty
                    :decimal-length='product.price_digits'
                    :default-value='0'
                    max='999999999'
                    min='0'
                    :placeholder="$t('trade.priceLabel')"
                    :show-minus='false'
                    :show-plus='false'
                />
                <van-button
                    class='ml-4'
                    :disabled='Boolean(stopLossWarning) || isEmpty(stopLossPrice)'
                    :loading='stopLossLoading'
                    type='primary'
                    @click="submitHandler('loss')"
                >
                    {{ $t('trade.update') }}
                </van-button>
            </div>
            <div class='text-warn mt-1'>
                {{ stopLossWarning }}
            </div>
        </div>
        <div>
            <div class='text-base mb-1'>
                {{ $t('trade.stopProfitPrice') }}
                <span
                    :class="{
                        'text-fallColor': lt(parseFloat(profitPercentage), 0) || isEmpty(stopProfitPrice),
                        'text-riseColor': gte(parseFloat(profitPercentage), 0),
                        'text-line-through': profitPercentage === '-100%' || profitPercentage === '500%',
                    }"
                >
                    ({{ profitPercentage }})
                </span>
            </div>
            <div class='flex justify-space-between filed-wrap'>
                <van-stepper
                    v-model='stopProfitPrice'
                    allow-empty
                    :decimal-length='product.price_digits'
                    :default-value='0'
                    max='999999999'
                    min='0'
                    :placeholder="$t('trade.priceLabel')"
                    :show-minus='false'
                    :show-plus='false'
                />
                <van-button
                    class='ml-4'
                    :disabled='Boolean(stopProfitWarning) || isEmpty(stopProfitPrice)'
                    :loading='stopProfitLoading'
                    type='primary'
                    @click="submitHandler('profit')"
                >
                    {{ $t('trade.update') }}
                </van-button>
            </div>
            <div class='text-warn mt-1'>
                {{ stopProfitWarning }}
            </div>
        </div>

        <div class='mb-4 text-minorColor mt-10'>
            {{ $t('trade.orderTriggeredTips') }}
        </div>
    </popup>
</template>

<script>
import { reactive, toRefs, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { mul, pow, minus, div, toFixed, lte, lt, gt, gte, eq } from '@/utils/calculation'
import { useI18n } from 'vue-i18n'
import { Toast } from 'vant'
import { updateOrder } from '@/api/trade'
import popup from './components/popup.vue'
import { useAssets } from '@/hooks/assets'
import { profitLossPriceCompare } from '../order/profitLossSet/checkProfitLoss'
import { isEmpty } from '@/utils/util'

export default {
    components: {
        popup,
    },
    setup () {
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            // 是否显示弹窗
            show: false,
            // 止损提交loading
            stopLossLoading: false,
            // 止盈提交loading
            stopProfitLoading: false,
            // 持仓数据
            data: {},
            // 止损价
            stopLossPrice: null,
            // 止盈价
            stopProfitPrice: null,
        })
        // 产品数据
        const product = computed(() => {
            return store.state._quote.productMap[state.data.symbolId + '_' + state.data.tradeType] || {}
        })
        const account = useAssets()

        const profitLossRange = computed(() => store.getters['_trade/marketProfitLossRang'](product.value, state.data.positionId))
        const positionList = computed(() => store.state._trade.positionList[product.value?.tradeType] || [])

        const stopLossRange = computed(() =>
            state.data.direction === 1 ? profitLossRange.value.buyStopLossRange : profitLossRange.value.sellStopLossRange,
        )

        const profitRange = computed(() =>
            state.data.direction === 1 ? profitLossRange.value.buyProfitRange : profitLossRange.value.sellProfitRange,
        )

        const stopLossWarning = computed(() => {
            const { stopLossPrice } = state
            if (eq(stopLossPrice, 0)) return ''
            const [min, max] = stopLossRange.value
            const isMinInvalid = stopLossPrice && lt(stopLossPrice, min)
            const isMaxInvalid = stopLossPrice && gt(stopLossPrice, max)
            return isMinInvalid || isMaxInvalid
                ? profitLossPriceCompare('stopLoss', state.data.direction, state.stopLossPrice, profitLossRange.value, t)
                : ''
        })

        const stopProfitWarning = computed(() => {
            const { stopProfitPrice } = state
            if (eq(stopProfitPrice, 0)) return ''
            const [min, max] = profitRange.value
            const isMinInvalid = stopProfitPrice && lt(stopProfitPrice, min)
            const isMaxInvalid = stopProfitPrice && gt(stopProfitPrice, max)
            return isMinInvalid || isMaxInvalid
                ? profitLossPriceCompare('profit', state.data.direction, state.stopProfitPrice, profitLossRange.value, t)
                : ''
        })

        const lossPercentage = computed(() => {
            const { stopLossPrice, data } = state
            const { crossLevelNum, openPrice } = data
            // 检查止损价格是否有效
            if (lte(stopLossPrice, 0) || isEmpty(stopLossPrice)) return t('headLineTrade.none')

            // 计算 (止损价格 - 下单价格) / 下单价格 * 杠杆
            const priceDifference = minus(stopLossPrice, openPrice)
            const percentage = toFixed(mul(mul(div(priceDifference, openPrice), crossLevelNum), 100), 1)
            const value = state.data.direction === 2 ? -percentage : percentage
            if (lt(value, -100)) return '-100%'
            return value + '%'
        })

        const profitPercentage = computed(() => {
            const { stopProfitPrice, data } = state
            const { crossLevelNum, openPrice } = data
            // 检查止盈价格是否有效
            if (lte(stopProfitPrice, 0) || isEmpty(stopProfitPrice)) return t('headLineTrade.none')

            // 计算 (止盈价格 - 下单价格) / 下单价格 * 杠杆
            const priceDifference = minus(stopProfitPrice, openPrice)
            const percentage = toFixed(mul(mul(div(priceDifference, openPrice), crossLevelNum), 100), 1)
            const value = state.data.direction === 2 ? -percentage : percentage
            if (lt(value, -100)) return '-100%'
            return value + '%'
        })

        // 打开弹窗
        const open = (row) => {
            store.dispatch('_quote/querySymbolInfo', {
                symbolId: row.symbolId,
                tradeType: row.tradeType,
            })
            state.data = row
            state.stopLossPrice = state.data.stopLossDecimal
            state.stopProfitPrice = state.data.takeProfitDecimal
            state.stopLossLoading = false
            state.stopProfitLoading = false
            state.show = true
        }

        // 关闭弹窗
        const close = () => {
            state.show = false
        }

        // 获取修改止盈止损参数
        const submitParams = (type) => {
            const data = state.data
            const p = pow(10, product.value.price_digits)

            const params = {
                orderId: data.orderId,
                positionId: data.positionId,
                tradeType: data.tradeType,
                accountId: account.value.accountId,
                accountDigits: account.value.digits,
                accountCurrency: account.value.currency,
            }
            if (type === 'profit') {
                params.takeProfit = lte(state.stopProfitPrice, 0) ? 0 : mul(state.stopProfitPrice, p)
                params.stopLoss = state.data.stopLoss
            }
            if (type === 'loss') {
                params.stopLoss = lte(state.stopLossPrice, 0) ? 0 : mul(state.stopLossPrice, p)
                params.takeProfit = state.data.takeProfit
            }

            return params
        }

        // 提交修改止盈止损
        const submitHandler = (type) => {
            const params = submitParams(type)
            if (!params) return false
            if (type === 'loss') {
                state.stopLossLoading = true
            } else {
                state.stopProfitLoading = true
            }
            updateOrder(params)
                .then((res) => {
                    if (res.check()) {
                        // 更新当前止盈止损
                        if (type === 'loss') {
                            state.data.stopLoss = params.stopLoss
                        } else {
                            state.data.takeProfit = params.takeProfit
                        }

                        queryPositionList()
                        Toast(t('common.setSuccess'))
                    } else {
                        if (res?.code === '30001') {
                            state.show = false
                        }
                        Toast(res.msg)
                    }
                })
                .catch((res) => {
                    Toast(res.msg)
                })
                .finally(() => {
                    if (type === 'loss') {
                        state.stopLossLoading = false
                    } else {
                        state.stopProfitLoading = false
                    }
                })
        }

        watch(
            () => positionList.value,
            (value) => {
                if (!state.show) return
                // 监听用户这个仓位是否被平仓了，如果被平仓直接关闭当前弹窗
                if (!value.find((item) => item.positionId === state.data.positionId)) {
                    state.show = false
                }
            },
        )

        // 获取持仓列表
        const queryPositionList = () => {
            const data = state.data
            const accountId = account.value.accountId
            store.dispatch('_trade/queryPositionPage', {
                tradeType: data.tradeType,
                sortFieldName: 'openTime',
                sortType: 'desc',
                accountId,
            })
        }

        return {
            ...toRefs(state),
            open,
            close,
            product,
            submitHandler,
            profitPercentage,
            lossPercentage,
            stopProfitWarning,
            stopLossWarning,
            gte,
            lte,
            gt,
            lt,
            isEmpty,
        }
    },
}
</script>

<style lang="scss" scoped>
.filed-wrap {
    :deep {
        .van-stepper {
            width: 100%;
            .van-stepper__input {
                width: 100%;
                height: 100%;
                background: var(--contentColor);
                border: 1px solid var(--lineColor);
                border-radius: 4px;
                text-align: left;
                padding-left: 8px;
                &:focus {
                    border-color: var(--primary);
                }
            }
        }
        button {
            width: 120px;
        }
    }
}
</style>

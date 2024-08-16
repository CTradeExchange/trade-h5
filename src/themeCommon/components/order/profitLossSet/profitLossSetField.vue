<template>
    <div v-if='isEnabled' class='profit-loss'>
        <div>
            <div class='mb-5'>
                <div class='flex justify-space-between items-center'>
                    <div>
                        {{ $t('trade.stopLossPrice') }}
                        <span
                            class='text-fallColor'
                            :class="{
                                'text-line-through': lossPercentage === '-100%' || lossPercentage === '500%',
                            }"
                        >
                            ({{ lossPercentage }})
                        </span>
                    </div>
                    <div class='text-fallColor'>
                        {{ lossAmount }}
                    </div>
                </div>
                <div class='flex justify-space-between van-hairline--top-bottom py-2 mt-2 select-rate'>
                    <span :class='{ active: stopLossRate === -0.1 }' @click='setStopLossRate(-0.1)'>
                        -10%
                    </span>
                    <span :class='{ active: stopLossRate === -0.2 }' @click='setStopLossRate(-0.2)'>
                        -20%
                    </span>
                    <span :class='{ active: stopLossRate === -0.3 }' @click='setStopLossRate(-0.3)'>
                        -30%
                    </span>
                    <span :class='{ active: stopLossRate === -0.5 }' @click='setStopLossRate(-0.5)'>
                        -50%
                    </span>
                    <span :class='{ active: stopLossRate === -0.8 }' @click='setStopLossRate(-0.8)'>
                        -80%
                    </span>
                    <van-stepper
                        v-model='stopLossPrice'
                        allow-empty
                        :decimal-length='product?.price_digits'
                        max='999999999'
                        min='0'
                        :placeholder="$t('trade.priceLabel')"
                        :show-minus='false'
                        :show-plus='false'
                        @focus='stopLossRate = null'
                    />
                </div>
                <div v-if='stopLossWarning' class='text-warn mt-1 text-xs'>
                    {{ stopLossWarning }}
                </div>
            </div>
            <div class='mb-5'>
                <div class='flex justify-space-between items-center'>
                    <div>
                        {{ $t('trade.stopProfitPrice') }}
                        <span
                            class='text-riseColor'
                            :class="{
                                'text-line-through': profitPercentage === '-100%' || profitPercentage === '500%',
                            }"
                        >
                            ({{ profitPercentage }})
                        </span>
                    </div>
                    <div class='text-riseColor'>
                        {{ profitAmount }}
                    </div>
                </div>
                <div class='flex justify-space-between van-hairline--top-bottom py-2 mt-2 select-rate'>
                    <span :class='{ active: stopProfitRate === 0.25 }' @click='setStopProfitRate(0.25)'>
                        25%
                    </span>
                    <span :class='{ active: stopProfitRate === 0.5 }' @click='setStopProfitRate(0.5)'>
                        50%
                    </span>
                    <span :class='{ active: stopProfitRate === 1 }' @click='setStopProfitRate(1)'>
                        100%
                    </span>
                    <span :class='{ active: stopProfitRate === 3 }' @click='setStopProfitRate(3)'>
                        300%
                    </span>
                    <span :class='{ active: stopProfitRate === 5 }' @click='setStopProfitRate(5)'>
                        500%
                    </span>
                    <van-stepper
                        v-model='stopProfitPrice'
                        allow-empty
                        :decimal-length='product?.price_digits'
                        max='999999999'
                        min='0'
                        :placeholder="$t('trade.priceLabel')"
                        :show-minus='false'
                        :show-plus='false'
                        @focus='stopProfitRate = null'
                    />
                </div>
                <div v-if='stopProfitWarning' class='text-warn mt-1 text-xs'>
                    {{ stopProfitWarning }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { computed, reactive, ref, toRefs, watch } from 'vue'
import { profitLossPriceCompare } from './checkProfitLoss'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { useAssets } from '@/hooks/assets'
import { mul, div, plus, minus, toFixed, lt, gt } from '@/utils/calculation'

export default {
    props: ['stopLoss', 'stopProfit', 'direction', 'requestPrice', 'multipleVal', 'volume', 'isEnabled', 'currentProduct', 'positionId'],
    emits: ['update:stopLoss', 'update:stopProfit'],
    setup (props, { emit }) {
        const store = useStore()
        const stopLossRef = ref(null)
        const stopProfitRef = ref(null)
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            isEnabled: false,
            stopLossPrice: '',
            stopProfitPrice: '',
            // 止损选择的百分比
            stopLossRate: -0.8,
            // 止盈选择的百分比
            stopProfitRate: 5,
        })
        const account = useAssets()
        // 当前产品
        const product = computed(() => store.getters.productActived)
        const profitLossRange = computed(() => store.getters['_trade/marketProfitLossRang'](product.value))

        const stopLossRange = computed(() =>
            props.direction === 'buy' ? profitLossRange.value.buyStopLossRange : profitLossRange.value.sellStopLossRange,
        )

        const profitRange = computed(() =>
            props.direction === 'buy' ? profitLossRange.value.buyProfitRange : profitLossRange.value.sellProfitRange,
        )

        const stopLossWarning = computed(() => {
            const stopLoss = props.stopLoss
            const [min, max] = stopLossRange.value
            const isMinInvalid = stopLoss && lt(stopLoss, min)
            const isMaxInvalid = stopLoss && gt(stopLoss, max)
            const directionType = props.direction === 'buy' ? 1 : 2
            return isMinInvalid || isMaxInvalid ? profitLossPriceCompare('stopLoss', directionType, stopLoss, profitLossRange.value, t) : ''
        })

        const stopProfitWarning = computed(() => {
            const directionType = props.direction === 'buy' ? 1 : 2
            const stopProfit = props.stopProfit
            const [min, max] = profitRange.value
            const isMinInvalid = stopProfit && lt(stopProfit, min)
            const isMaxInvalid = stopProfit && gt(stopProfit, max)
            return isMinInvalid || isMaxInvalid ? profitLossPriceCompare('profit', directionType, stopProfit, profitLossRange.value, t) : ''
        })

        // 计算百分比，百分比保留一位小数
        const calculatePercentage = (priceDifference, requestPrice, multipleVal) => {
            return toFixed(mul(mul(div(priceDifference, requestPrice), multipleVal), 100), 1)
        }

        // 计算止盈止损价格
        const calculatePrice = (requestPrice, rate, multipleVal, direction, digits) => {
            const method = direction === 'buy' ? plus : minus
            return toFixed(method(requestPrice, div(mul(requestPrice, rate), multipleVal)), digits)
        }

        // 获取百分比并处理上下限
        const getPercentage = (stopPrice, requestPrice, multipleVal) => {
            const percentage = calculatePercentage(minus(stopPrice, requestPrice), requestPrice, multipleVal)

            if (lt(percentage, -100)) return '-100%'
            if (gt(percentage, 500)) return '500%'

            return (props.direction === 'sell' ? -percentage : percentage) + '%'
        }

        // 计算金额
        const calculateAmount = (volume, rate, percentage, digits, currency) => {
            const amount = rate ? mul(volume, rate) : mul(volume, div(parseFloat(percentage), 100))
            return `${toFixed(amount, digits)} ${currency}`
        }

        // 计算止损百分比
        const lossPercentage = computed(() => {
            const { stopLossRate, stopLossPrice } = state
            const { requestPrice, multipleVal, direction } = props

            if (!requestPrice || (!stopLossPrice && !stopLossRate)) {
                emit('update:stopLoss', '')
                return t('headLineTrade.unset')
            }

            if (!stopLossPrice) {
                // 做多：当前价格 + 当前价格 * 选择百分比 / 杠杆
                // 做空：当前价格 - 当前价格 * 选择百分比 / 杠杆
                const price = calculatePrice(requestPrice, stopLossRate, multipleVal, direction, product.value?.price_digits)
                emit('update:stopLoss', price)
                return price
            }

            // （止损价格 - 挂单价格） / 挂单价格 * 杠杆，精确到小数点后一位，其他四舍五入
            return getPercentage(stopLossPrice, requestPrice, multipleVal)
        })

        // 计算止盈百分比
        const profitPercentage = computed(() => {
            const { stopProfitRate, stopProfitPrice } = state
            const { requestPrice, multipleVal, direction } = props

            if (!requestPrice || (!stopProfitPrice && !stopProfitRate)) {
                emit('update:stopProfit', '')
                return t('headLineTrade.unset')
            }

            if (!stopProfitPrice) {
                // 做多：当前价格 + 当前价格 * 选择百分比 / 杠杆
                // 做空：当前价格 - 当前价格 * 选择百分比 / 杠杆
                const price = calculatePrice(requestPrice, stopProfitRate, multipleVal, direction, product.value?.price_digits)
                emit('update:stopProfit', price)
                return price
            }

            // （止盈价格 - 挂单价格） / 挂单价格 * 杠杆，精确到小数点后一位，其他四舍五入
            return getPercentage(stopProfitPrice, requestPrice, multipleVal)
        })

        // 计算止损亏损金额
        const lossAmount = computed(() => {
            const { stopLossRate, stopLossPrice } = state
            const { requestPrice, volume } = props
            const { digits, currency } = account.value

            if (!requestPrice || (!stopLossPrice && !stopLossRate)) {
                return t('headLineTrade.none')
            }

            return calculateAmount(volume, stopLossRate, lossPercentage.value, digits, currency)
        })

        // 计算止盈亏损金额
        const profitAmount = computed(() => {
            const { stopProfitRate, stopProfitPrice } = state
            const { requestPrice, volume } = props
            const { digits, currency } = account.value

            if (!requestPrice || (!stopProfitPrice && !stopProfitRate)) {
                return t('headLineTrade.none')
            }

            return calculateAmount(volume, stopProfitRate, profitPercentage.value, digits, currency)
        })

        watch(
            () => state.stopLossPrice,
            (price) => {
                emit('update:stopLoss', price)
            },
        )

        watch(
            () => state.stopProfitPrice,
            (price) => {
                emit('update:stopProfit', price)
            },
        )

        const clear = () => {
            emit('update:stopProfit', '')
            emit('update:stopLoss', '')
            state.stopLossPrice = ''
            state.stopProfitPrice = ''
            state.stopLossRate = -0.8
            state.stopProfitRate = 5
        }

        watch(
            () => props.isEnabled,
            (value) => {
                if (!value) {
                    clear()
                }
            },
            {
                immediate: true,
            },
        )

        watch(
            () => product.value,
            () => {
                clear()
            },
            {
                immediate: true,
            },
        )

        const setStopProfitRate = (value) => {
            state.stopProfitRate = value
            state.stopProfitPrice = ''
        }

        const setStopLossRate = (value) => {
            state.stopLossRate = value
            state.stopLossPrice = ''
        }

        return {
            ...toRefs(state),
            stopLossWarning,
            stopProfitWarning,
            stopLossRef,
            stopProfitRef,
            profitLossRange,
            stopLossRange,
            profitRange,
            account,
            lossPercentage,
            profitPercentage,
            gt,
            lt,
            mul,
            div,
            setStopLossRate,
            setStopProfitRate,
            toFixed,
            profitAmount,
            lossAmount,
            product,
        }
    },
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.profit-loss {
    user-select: none;
    .select-rate {
        span {
            display: flex;
            align-items: center;
            cursor: pointer;
            color: var(--minorColor);
            &.active {
                color: var(--color);
                font-weight: bold;
            }
        }
        :deep(.van-stepper__input) {
            width: 66px;
            background: transparent;
            border: 1px solid var(--lineColor);
            border-radius: 4px;
        }
    }
}
.h5 {
    .profit-loss {
        .profit-loss-title {
            font-size: 12px;
        }
    }
}
</style>

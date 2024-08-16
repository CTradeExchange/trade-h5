<template>
    <div class='contract'>
        <van-cell v-if='$isPC' :border='false' :value="requestPrice ? ` ${requestPrice}` : '--'" value-class='font-bold'>
            <template #title>
                <popover placement='left' :text="$t('headLineTrade.execution')">
                    <template #reference>
                        <span class='tooltip-cursor'>
                            {{ $t('trade.estimatedExecutionPrice') }}
                        </span>
                    </template>
                </popover>
            </template>
        </van-cell>
        <van-cell
            v-if='$isPC'
            :border='false'
            :value='liqPrice'
            value-class='font-bold'
        >
            <template #title>
                <popover placement='left' :text="$t('headLineTrade.liquidation')">
                    <template #reference>
                        <span class='tooltip-cursor'>
                            {{ $t('trade.estimatedLiquidationPrice') }}
                        </span>
                    </template>
                </popover>
            </template>
        </van-cell>
        <van-cell v-if='$isPC' :border='false'>
            <template #value>
                <div class='flex items-center justify-end h-full'>
                    <img alt='star' class='mr-1' src='/images/star.svg' />
                    <span class='font-bold text-xs'>
                        0.000%
                    </span>
                </div>
            </template>
            <template #title>
                <popover placement='left'>
                    <template #default>
                        <div v-html="$t('headLineTrade.avgSpreadTips')"></div>
                    </template>
                    <template #reference>
                        <span class='tooltip-cursor'>
                            {{ $t('headLineTrade.avgSpread') }}
                        </span>
                    </template>
                </popover>
            </template>
        </van-cell>
        <van-cell :border='false'>
            <div>
                <div>{{ `${positionSize} ${currency}` }}</div>
                <div v-if='requestPrice' class='text-minorColor text-xs'>
                    {{ `${toFixed(div(positionSize, requestPrice), product.numberDigits, 1)} ${product.numberCurrency}` }}
                </div>
            </div>
            <template #title>
                <popover placement='left'>
                    <template #default>
                        <div v-if='$isPC'>
                            {{ `${$t('trade.margin')} * ${$t('trade.leverage')}` }}
                        </div>
                        <div v-else class='text-left'>
                            <div class='font-bold text-base mb-4'>
                                {{ $t('headLineTrade.positionSize') }}
                            </div>
                            <div class='font-bold text-sm mb-4 text-minorColor'>
                                {{ `${$t('trade.margin')} * ${$t('trade.leverage')}` }}
                            </div>
                            <div class='font-bold text-sm'>
                                {{ `${volume} ${currency}` }}*{{ leverage }} = {{ `${positionSize} ${currency}` }}
                            </div>
                        </div>
                    </template>
                    <template #reference>
                        <span class='tooltip-cursor'>
                            {{ $t('headLineTrade.positionSize') }}
                        </span>
                    </template>
                </popover>
            </template>
        </van-cell>
        <van-cell :border='false'>
            <template #value>
                <div v-if='feeRate'>
                    <span>
                        {{ `${fee} ${currency}` }}
                    </span>
                    <popover v-if='$isPC' placement='left' :text="$t('headLineTrade.fees')">
                        <template #default>
                            <div>
                                <div class='flex justify-space-between items-center'>
                                    <span class='mr-15'>
                                        {{ $t('trade.cost') }}
                                    </span>
                                    <span>{{ $t('headLineTrade.positionSize') }} * {{ $t('headLineTrade.feeRate') }}</span>
                                </div>
                                <div v-if='feeRate' class='font-bold text-right'>
                                    {{ `${positionSize} ${currency}` }} * {{ feeRate }} = {{ `${fee} ${currency}` }}
                                </div>
                            </div>
                        </template>
                        <template #reference>
                            <span class='text-minorColor text-underline'>
                                {{ `(${feeRate})` }}
                            </span>
                        </template>
                    </popover>
                </div>
                <div v-else>
                    --
                </div>
            </template>
            <template #title>
                <popover placement='left' :text="$t('headLineTrade.fees')">
                    <template #default>
                        <div v-if='$isPC'>
                            {{ $t('headLineTrade.fees') }}
                        </div>
                        <div v-else class='text-left'>
                            <div class='font-bold text-base mb-4'>
                                {{ $t('trade.cost') }}
                            </div>
                            <div class='font-bold text-sm mb-4 text-minorColor'>
                                {{ $t('headLineTrade.fees') }}
                            </div>
                            <div class='font-bold text-sm mb-4 text-minorColor'>
                                {{ $t('headLineTrade.positionSize') }} * {{ $t('headLineTrade.feeRate') }}
                            </div>
                            <div class='font-bold text-sm'>
                                {{ `${positionSize} ${currency}` }} * {{ feeRate }} = {{ `${fee} ${currency}` }}
                            </div>
                        </div>
                    </template>
                    <template #reference>
                        <span class='tooltip-cursor'>
                            {{ $t('trade.cost') }}
                        </span>
                    </template>
                </popover>
            </template>
        </van-cell>
        <van-cell v-if='$isPC' :border='false'>
            <template #value>
                <div v-if='interest'>
                    <span>
                        {{ `${interestAmount} ${currency}` }}
                    </span>
                    <popover v-if='$isPC' placement='left' :text="$t('headLineTrade.fees')">
                        <template #default>
                            <div>
                                <div class='flex justify-space-between items-center'>
                                    <span class='mr-15'>
                                        {{
                                            product.isCryptocurrency
                                                ? $t('headLineTrade.hourlyInterest')
                                                : $t('headLineTrade.dailyInterest')
                                        }}
                                    </span>
                                    <span>
                                        {{ $t('headLineTrade.positionSize') }} *
                                        {{ product.isCryptocurrency ? $t('headLineTrade.hHourlyRate') : $t('headLineTrade.dailyRate') }}
                                    </span>
                                </div>
                                <div v-if='interestAmount' class='font-bold text-right'>
                                    {{ positionSize }} * {{ `${interest}%` }} = {{ `${interestAmount} ${currency}` }}
                                </div>
                            </div>
                        </template>
                        <template #reference>
                            <span class='text-minorColor text-underline'>
                                {{ `(${interest}%)` }}
                            </span>
                        </template>
                    </popover>
                </div>
                <div v-else>
                    --
                </div>
            </template>
            <template #title>
                <popover placement='left'>
                    <template #default>
                        <div v-if='$isPC'>
                            {{
                                product.isCryptocurrency
                                    ? $t('headLineTrade.estHourlyInterestTips')
                                    : $t('headLineTrade.estDailyInterestTips')
                            }}
                        </div>
                        <div v-else class='text-left'>
                            <div class='font-bold text-base mb-4'>
                                {{
                                    product.isCryptocurrency ? $t('headLineTrade.estHourlyInterest') : $t('headLineTrade.estDailyInterest')
                                }}
                            </div>
                            <div class='font-bold text-sm mb-4 text-minorColor'>
                                {{
                                    product.isCryptocurrency
                                        ? $t('headLineTrade.estHourlyInterestTips')
                                        : $t('headLineTrade.estDailyInterestTips')
                                }}
                            </div>
                            <div class='font-bold text-sm mb-4 text-minorColor'>
                                {{ $t('headLineTrade.positionSize') }} *
                                {{ product.isCryptocurrency ? $t('headLineTrade.hHourlyRate') : $t('headLineTrade.dailyRate') }}
                            </div>
                            <div class='font-bold text-sm'>
                                {{ positionSize }} * {{ `${interest}%` }} = {{ `${interestAmount} ${currency}` }}
                            </div>
                        </div>
                    </template>
                    <template #reference>
                        <span class='tooltip-cursor'>
                            {{ product.isCryptocurrency ? $t('headLineTrade.estHourlyInterest') : $t('headLineTrade.estDailyInterest') }}
                        </span>
                    </template>
                </popover>
            </template>
        </van-cell>
        <van-cell
            v-if='!$isPC'
            :border='false'
            :value='liqPrice'
            value-class='font-bold'
        >
            <template #title>
                <popover placement='left' :text="$t('headLineTrade.liquidation')">
                    <template #reference>
                        <span class='tooltip-cursor'>
                            {{ $t('trade.previewStopPriceShort') }}
                        </span>
                    </template>
                </popover>
            </template>
        </van-cell>
    </div>
</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'
import { useAssets } from '@/hooks/assets'
import { mul, minus, div, toFixed, plus } from '@/utils/calculation'
export default {
    props: {
        // 维持保证金比例
        maintainMargin: {
            type: [Number, String],
        },
        direction: {
            type: String,
        },
        /** 开仓保证金预计 */
        previewMargin: {
            type: String,
        },
        /** 预计执行价格 */
        requestPrice: {
            type: String,
        },
        /** 仓位大小 */
        positionSize: {
            type: String,
        },
        /** 预估手续费 */
        previewFee: {
            type: String,
        },
        /** 预计强平价格 */
        evaluateClosePrice: {
            type: String,
        },
        /** 下单手数保证金 */
        volume: {
            type: [String, Number],
        },
        /** 杠杆 */
        leverage: {
            type: [String, Number],
        },
        /** 预计执行下单数量 */
        calculateNum: {
            type: [String, Number],
        },
    },
    setup (props) {
        const assetsInfo = useAssets()
        const store = useStore()
        const product = computed(() => store.getters.productActived)
        const currency = computed(() => assetsInfo.value?.currency || '')

        // 手续费
        const fee = computed(() => {
            if (product.value?.feeRate === undefined) return null
            return toFixed(mul(props.positionSize, product.value.feeRate), assetsInfo.value?.digits)
        })

        // 手续费率
        const feeRate = computed(() => {
            if (['1', '3'].includes(product.value.feeFormula)) {
                if (product.value?.feeRate === undefined) return null
                return toFixed(mul(product.value.feeRate, 100), 4, 1) + '%'
            }
            return null
        })

        // 利率
        const interest = computed(() => {
            if (product.value.buyInterest === null || product.value.sellInterest === undefined) return null
            const value = mul(props.direction === 'buy' ? product.value.buyInterest : product.value.sellInterest, 100)

            // 數值為後台設置數值/360，精確到小數點後4位，4位以後的數值cut掉
            const dailyInterest = toFixed(div(value, 360), 4, 1)
            // 加密货币用小时利率
            return `${product.value?.isCryptocurrency ? toFixed(div(dailyInterest, 24), 4, 1) : dailyInterest}`
        })

        // 利率值
        const interestAmount = computed(() => {
            // 計算數額顯示小數點後4位，多餘數位四捨五入
            return toFixed(mul(props.positionSize, div(interest.value, 100)), assetsInfo.value?.digits)
        })

        const liqPrice = computed(() => {
            if (!props.requestPrice) return '--'
            const methods = props.direction === 'buy' ? minus : plus
            return `${toFixed(methods(props.requestPrice, div(mul(props.requestPrice, 0.8), props.leverage)), product.value.price_digits)}`
        })
        return {
            product,
            fee,
            interest,
            minus,
            assetsInfo,
            feeRate,
            interestAmount,
            mul,
            currency,
            div,
            toFixed,
            liqPrice
        }
    },
}
</script>

<style lang="scss" scoped>
.contract {
    :deep {
        .van-cell {
            padding: 0;
            font-size: 12px;
            margin-bottom: 4px;
            .van-cell__title {
                flex: none;
            }
        }
    }
}
</style>

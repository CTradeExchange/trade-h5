<template>
    <div class='px-4 pb-4 van-hairline--bottom'>
        <div class='flex justify-space-between py-3 items-center'>
            <div class='flex items-center text-color my-1'>
                <van-tag
                    :color="Number(item.direction) === 1 ? 'var(--riseColor)' : 'var(--fallColor)'"
                    size='large'
                    style='--van-tag-border-radius: 4px'
                    text-color='#fff'
                >
                    {{ Number(item.direction) === 1 ? 'L' : 'S' }}
                </van-tag>
                <span class='text-base font-bold mx-3'>
                    {{ item.symbolName }}
                </span>
                <van-tag v-if='item.crossLevelNum' class='font-bold' color='var(--assistColor)' size='large' text-color='var(--color) '>
                    {{ item.crossLevelNum }}x
                </van-tag>
            </div>
            <span class='text-sm font-bold'>
                {{ bizTypeText ? bizTypeText[item.bizType] : '--' }}
            </span>
        </div>

        <div class='flex justify-space-between'>
            <div>
                <div>
                    <div class='text-xs text-minorColor mb-1'>
                        {{ `${$t('trade.margin')}${currency ? ` (${currency})` : ''}` }}
                    </div>
                    <div class='text-sm text-color font-bold'>
                        {{ item.occupyMargin ? `${item.occupyMargin}` : '--' }}
                    </div>
                </div>

                <div v-if='isCloseType(item.bizType)' class='mt-4'>
                    <div class='text-xs text-minorColor mb-1'>
                        {{ `${$t('trade.netPL')}${currency ? ` (${currency})` : ''}` }}
                    </div>
                    <div
                        class='text-sm text-color font-bold'
                        :class='{ riseColor: parseFloat(item.netPL) > 0, fallColor: parseFloat(item.netPL) < 0 }'
                    >
                        {{ netPL }}
                    </div>
                </div>

                <div v-if='item.stopLoss * 1 !== 0 || item.takeProfit * 1 !== 0' class='mt-4'>
                    <div class='text-xs text-minorColor mb-1'>
                        {{ $t('trade.stopLossPrice') }}
                    </div>
                    <div class='text-sn text-color font-bold'>
                        {{ item.stopLoss * 1 !== 0 ? item.stopLoss : '--' }}
                    </div>
                </div>
                <div v-else class='mt-4'>
                    <div class='text-xs text-minorColor mb-1'>
                        {{ `${$t('trade.fee')}${currency ? ` (${currency})` : ''}` }}
                    </div>
                    <div class='text-sm text-color font-bold'>
                        {{ item.commission ? `${item.commission}` : '--' }}
                    </div>
                </div>
            </div>

            <div>
                <div>
                    <div class='text-xs text-minorColor mb-1'>
                        {{ $t('headLineTrade.entryPrice') }}
                    </div>
                    <div class='text-sm text-color font-bold'>
                        <template v-if='item.bizType === 14'>
                            {{ item.originalRequestPrice }}
                        </template>
                        <template v-else>
                            {{ isCloseType(item.bizType) ? '--' : item.requestPrice }}
                        </template>
                    </div>
                </div>
                <div v-if='isCloseType(item.bizType)' class='mt-4'>
                    <div class='text-xs text-minorColor mb-1'>
                        {{ `${$t('headLineTrade.interest')}${currency ? ` (${currency})` : ''}` }}
                    </div>
                    <div class='text-sm text-color font-bold'>
                        {{ item.overnightInterest && isCloseType(item.bizType) ? item.overnightInterest : '--' }}
                    </div>
                </div>

                <div v-if='item.stopLoss * 1 !== 0 || item.takeProfit * 1 !== 0' class='mt-4'>
                    <div class='text-xs text-minorColor mb-1'>
                        {{ $t('trade.stopProfitPrice') }}
                    </div>
                    <div class='text-sm text-color font-bold'>
                        {{ item.takeProfit * 1 !== 0 ? item.takeProfit : '--' }}
                    </div>
                </div>
            </div>

            <div class='text-right'>
                <div>
                    <div class='text-xs text-minorColor mb-1'>
                        {{ $t('trade.executePrice') }}
                    </div>
                    <div class='text-sm text-color font-bold'>
                        {{ item.executePrice || '--' }}
                    </div>
                </div>
                <div v-if='item.stopLoss * 1 !== 0 || item.takeProfit * 1 !== 0 || isCloseType(item.bizType)' class='mt-4'>
                    <div class='text-xs text-minorColor mb-1'>
                        {{ `${$t('trade.fee')}${currency ? ` (${currency})` : ''}` }}
                    </div>
                    <div class='text-sm text-color font-bold'>
                        {{ item.commission ? `${item.commission}` : '--' }}
                    </div>
                </div>
            </div>
        </div>
        <div class='flex items-center mt-3 text-minorColor'>
            <span class='mr-8'>
                {{ `${$t('trade.pendingNo')} : ${item.dealId || '--'}` }}
            </span>
            <span>
                {{ item.executeTime ? formatTime(item.executeTime, 'YYYY/MM/DD HH:mm:ss') : '--' }}
            </span>
        </div>
    </div>
</template>

<script>
// components

// vue
import { computed } from 'vue'
// vuex
import { useStore } from 'vuex'
import { useAssets } from '@/hooks/assets'
import { toFixed, minus, plus } from '@/utils/calculation'

export default {
    props: {
        // 数据
        item: {
            type: Object,
            defaulut: () => {},
        },
        // bizTypeText
        bizTypeText: {
            type: Object,
            default: () => {},
        },
        // 玩法类型
        tradeType: {
            type: [Number, String],
            default: '',
        },
    },

    setup (props) {
        const store = useStore()
        const productMap = computed(() => store.state._quote.productMap)
        const assets = useAssets()

        // 判断是否是平仓
        const isCloseType = (bizType) => {
            if ([1, 2, 3, 9, 12, 13].indexOf(Number(bizType)) > -1) {
                return false
            } else {
                return true
            }
        }

        // 是否显示止盈止损价
        const showLossOrProfit = (item) => {
            // 玩法cfd全仓和cfd逐仓才显示止盈止损价
            if ([1, 2].indexOf(Number(props.tradeType)) > -1 && !isCloseType(item.bizType)) {
                return true
            } else {
                return false
            }
        }

        const currency = computed(() => assets.value?.currency || '')
        // net p/l=p/l-fees+interest（interest为负数）
        const netPL = computed(
            () =>
                `${plus(minus(props.item.profitLoss || 0, props.item.commission || 0), props.item.overnightInterest || 0)} ${
                    currency.value
                }`,
        )

        return {
            isCloseType,
            showLossOrProfit,
            currency,
            productMap,
            toFixed,
            netPL,
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
</style>

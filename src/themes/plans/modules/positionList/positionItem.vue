<template>
    <div class='product-item'>
        <div class='item' :data='activeNames'>
            <van-collapse v-model='activeNames' class='activeNames'>
                <van-collapse-item :name='data.positionId'>
                    <template #title>
                        <div class='flex items-center text-color my-1'>
                            <van-tag
                                :color="Number(data.direction) === 1 ? 'var(--riseColor)' : 'var(--fallColor)'"
                                size='large'
                                style='--van-tag-border-radius: 4px'
                                text-color='#fff'
                            >
                                {{ Number(data.direction) === 1 ? 'L' : 'S' }}
                            </van-tag>
                            <span class='text-base font-bold mx-4'>
                                {{ data.symbolName }}
                            </span>
                            <van-tag
                                v-if='data.crossLevelNum'
                                class='font-bold'
                                color='var(--assistColor)'
                                size='large'
                                text-color='var(--color) '
                            >
                                {{ data.crossLevelNum }}x
                            </van-tag>
                            <div class='w-20 flex items-center' @click.stop='openChart'>
                                <img class='w-4 h-4 ml-4 mr-1' src='/images/chart.svg' />
                                <img alt='arrow' :class="[showChart ? 'rotate--180 ' : 'rotate-0']" src='/images/arrow.svg' />
                            </div>
                        </div>
                    </template>
                    <div v-if='showChart' class='h-60 van-hairline--bottom'>
                        <Chart
                            :container-id='`position-chart-${data.positionId}${new Date().getTime()}`'
                            :disabled-features="['timeframes_toolbar', 'left_toolbar']"
                            :position-id='data.positionId'
                            :props-product='product'
                        />
                    </div>
                    <div class='px-4 mt-2'>
                        <div class='flex justify-space-between'>
                            <div>
                                <div>
                                    <div class='text-xs text-minorColor mb-1'>
                                        {{ `${$t('trade.size')}${`(${showVolume ? product.numberCurrency : currency})`}` }}
                                    </div>
                                    <div class='flex items-center'>
                                        <div v-if='!showVolume' class='text-sm text-color font-bold mr-1'>
                                            {{ data.currentTradeAmount ? `${data.currentTradeAmount}` : '--' }}
                                        </div>
                                        <div v-else class='text-sm text-color font-bold mr-1'>
                                            {{
                                                data.openNum
                                                    ? toFixed(div(data.currentTradeAmount, data.openPrice), product.numberDigits, 1)
                                                    : '--'
                                            }}
                                        </div>
                                        <img src='/images/switch.svg' @click='showVolume = !showVolume' />
                                    </div>
                                </div>
                                <div class='mt-4'>
                                    <div class='text-xs text-minorColor mb-1'>
                                        {{ $t('headLineTrade.entryPrice') }}
                                    </div>
                                    <div class='text-sm text-color font-bold'>
                                        {{ data.openPrice || '--' }}
                                    </div>
                                </div>
                                <div v-if='hasSlTp' class='mt-4'>
                                    <div class='text-xs text-minorColor mb-1'>
                                        {{ $t('trade.stopLossPrice') }}
                                    </div>
                                    <div class='text-sm text-color font-bold'>
                                        {{ data.stopLossDecimal * 1 !== 0 ? data.stopLossDecimal : '--' }}
                                    </div>
                                </div>
                                <div v-else class='mt-4'>
                                    <div class='text-xs text-minorColor mb-1'>
                                        {{ $t('headLineTrade.interest') }}
                                    </div>
                                    <div class='text-sm text-color font-bold'>
                                        {{ data.interest ? data.interest : '--' }}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <div class='text-xs text-minorColor mb-1'>
                                        {{ `${$t('trade.margin')}${currency ? ` (${currency})` : ''}` }}
                                    </div>
                                    <div class='text-sm text-color font-bold'>
                                        {{ data.occupyTheMargin ? `${data.occupyTheMargin}` : '--' }}
                                    </div>
                                </div>
                                <div class='mt-4'>
                                    <div class='text-xs text-minorColor mb-1'>
                                        {{ $t('trade.currentPrice') }}
                                    </div>
                                    <div class='text-sm text-color font-bold' :class='product?.cur_color'>
                                        {{ product?.cur_price || '--' }}
                                    </div>
                                </div>
                                <div v-if='hasSlTp' class='mt-4'>
                                    <div class='text-xs text-minorColor mb-1'>
                                        {{ $t('trade.stopProfitPrice') }}
                                    </div>
                                    <div class='text-sm text-color font-bold'>
                                        {{ data.takeProfitDecimal * 1 !== 0 ? data.takeProfitDecimal : '--' }}
                                    </div>
                                </div>
                            </div>
                            <div class='text-right'>
                                <div>
                                    <div class='text-xs text-minorColor mb-1'>
                                        {{ `${$t('trade.profit')}${currency ? ` (${currency})` : ''}` }}
                                    </div>
                                    <div
                                        class='text-sm text-color font-bold'
                                        :class='{ riseColor: parseFloat(data.profitLoss) > 0, fallColor: parseFloat(data.profitLoss) < 0 }'
                                    >
                                        {{ `${data.profitLoss || '--'}` }}
                                    </div>
                                </div>
                                <div class='mt-4'>
                                    <div class='text-xs text-minorColor mb-1'>
                                        {{ $t('headLineTrade.liqPrice') }}
                                    </div>
                                    <div class='text-sm text-color font-bold'>
                                        {{ liqPrice }}
                                    </div>
                                </div>
                                <div v-if='hasSlTp' class='mt-4'>
                                    <div class='text-xs text-minorColor mb-1'>
                                        {{ $t('headLineTrade.interest') }}
                                    </div>
                                    <div class='text-sm text-color font-bold'>
                                        {{ gt(data.interest, 0) ? data.interest : '--' }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class='flex justify-space-between mt-4'>
                            <van-button block class='mr-5' plain size='small' type='primary' @click.stop="$emit('showSLTP', data)">
                                {{ $t('trade.tackStopSetup') }}
                            </van-button>
                            <van-button block size='small' type='primary' @click.stop="$emit('showClose', data)">
                                {{ $t('trade.closed') }}
                            </van-button>
                        </div>
                    </div>
                </van-collapse-item>
            </van-collapse>
        </div>
    </div>

    <!-- 说明弹窗 -->
    <ExplainPopup v-model='isExplain' :explain-type='explainType' />
</template>

<script>
import { computed, reactive, toRefs, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { minus, plus, retainDecimal, toFixed, mul, div, gt } from '@/utils/calculation'
import ExplainPopup from '@plans/views/assets/components/explain-popup.vue'
import { useAssets } from '@/hooks/assets'
import Chart from '@/components/chart/positionChart.vue'

export default {
    components: {
        ExplainPopup,
        Chart,
    },
    props: ['data'],
    emits: ['showClose', 'showAdjustPopup', 'showSLTP', 'showMultiplePopup', 'showPositionInfo'],
    setup (props) {
        const store = useStore()
        const router = useRouter()
        const assets = useAssets()
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            show: false,
            loading: false,
            cur: {},
            cpVis: false,
            activeNames: [],
            // 是否显示说明弹窗
            isExplain: false,
            // 说明类型
            explainType: 0,
            // 显示手数
            showVolume: false,
            showChart: false,
        })
        // 风险状态等级文案
        const riskLevelMap = {
            1: t('riskLevel.safety'),
            2: t('riskLevel.warn'),
            3: t('riskLevel.danger'),
        }
        // 获取玩法列表
        const positionList = computed(() => store.state._trade.positionList[props.data.tradeType])
        const currency = computed(() => assets.value?.currency || '')
        const product = computed(() => store.state._quote.productMap[props.data.symbolId + '_' + props.data.tradeType])
        const btnBg = computed(() => store.state.style.primary + '0D')
        // 是否有止盈止损
        const hasSlTp = computed(() => gt(props.data?.takeProfitDecimal, 0) || gt(props.data?.stopLossDecimal, 0))
        const roiNumber = computed(() => {
            const { occupyTheMargin, profitLoss } = props.data
            return retainDecimal((profitLoss / occupyTheMargin) * 100, 2)
        })

        const liqPrice = computed(() => {
            if (!props.data.openPrice) return '--'
            const methods = props.data.direction === 1 ? minus : plus
            return `${toFixed(
                methods(props.data.openPrice, div(mul(props.data.openPrice, 0.8), props.data.crossLevelNum)),
                product.value.price_digits,
            )}`
        })

        const toPositionDetail = (item) => {
            store.commit('_quote/Update_productActivedID', `${item.symbolId}_${item.tradeType}`)
            router.push({
                path: '/positionDetail',
                query: {
                    symbolId: item.symbolId,
                    positionId: item.positionId,
                    tradeType: item.tradeType,
                },
            })
        }
        const updateShow = (val) => {
            state.cpVis = val
        }
        const openChart = () => {
            setTimeout(() => {
                state.showChart = !state.showChart
            })
            if (!state.activeNames.includes(props.data.positionId)) {
                state.activeNames.push(props.data.positionId)
            }
        }

        // 显示说明弹窗
        const showExplain = (type) => {
            state.explainType = type
            state.isExplain = true
        }

        watch(
            () => positionList.value,
            (newValue, oldValue) => {
                const newIds = newValue
                    .filter((item) => !oldValue.find((el) => el.positionId === item.positionId))
                    .map((item) => item.positionId)
                state.activeNames = [...state.activeNames, ...newIds]
            },
        )

        onMounted(() => {
            if (positionList.value?.length > 0 && !state.activeNames?.length) {
                state.activeNames = positionList.value.map((item) => item.positionId)
            }
        })

        const formatAmount = (amount) => {
            if (!amount || !assets.value) return '--'
            return `${amount} ${assets.value.currency}`
        }

        return {
            ...toRefs(state),
            positionList,
            assets,
            product,
            toPositionDetail,
            updateShow,
            minus,
            plus,
            btnBg,
            riskLevelMap,
            showExplain,
            formatAmount,
            roiNumber,
            currency,
            toFixed,
            mul,
            div,
            hasSlTp,
            gt,
            liqPrice,
            openChart
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';

:deep {
    .van-cell::after {
        border: 0;
    }
    .van-collapse-item__title {
        align-items: center;
        padding: 16px;
    }
    .van-collapse-item__content {
        padding: 0 0 24px 0;
    }
}
</style>

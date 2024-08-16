<template>
    <div class='page-wrap'>
        <LayoutTop
            :custom-style='{
                background: $style.bgColor,
            }'
            :title='positionData?.symbolName'
        >
            <template #right>
                <i class='icon_tubiao hidden' @click='toProduct(positionData.symbolId)'></i>
            </template>
        </LayoutTop>
        <div v-if='positionData' class='main'>
            <div class='m-orderInfo'>
                <div class='layout layout-1'>
                    <div class='item item-2'>
                        <div class='col'>
                            <div class='sub alignLeft'>
                                {{ $t('trade.profit') }}({{ assetsInfo?.currency }})
                            </div>
                            <div class='name profit' :class="parseFloat(positionData?.profitLoss) > 0 ? 'riseColor' : 'fallColor'">
                                {{ positionData?.profitLoss || '--' }}
                            </div>
                        </div>
                    </div>
                    <div class='btns'>
                        <van-button block class='text-white p-0 flex-1 h-10 mr-4' type='primary' @click.stop='closeHandler'>
                            {{ $t('trade.closed') }}
                        </van-button>
                        <van-button class='plain-button p-0 flex-1 h-10' plain type='primary' @click.stop='showSetProfit = true'>
                            {{ $t('trade.tackStopSetup') }}
                        </van-button>
                    </div>
                </div>
                <div class='layout layout-1'>
                    <div class='py-4 van-hairline--bottom'>
                        <div class='flex items-center'>
                            <van-tag
                                :color="Number(positionData.direction) === 1 ? 'var(--riseColor)' : 'var(--fallColor)'"
                                size='medium'
                                text-color='#fff'
                            >
                                {{ Number(positionData.direction) === 1 ? $t('trade.long') : $t('trade.short') }}
                            </van-tag>
                            <span class='text-base font-bold mx-2'>
                                {{ `${positionData.occupyTheMargin} ${assetsInfo?.currency || ''}` }}
                            </span>
                            <van-tag
                                v-if='positionData.crossLevelNum'
                                color='var(--assistColor)'
                                size='medium'
                                text-color='var(--minorColor)'
                            >
                                {{ positionData.crossLevelNum }}x
                            </van-tag>
                        </div>
                    </div>
                    <div class='py-4'>
                        <div class='text-sm font-bold mb-2'>
                            {{ $t('trade.ratesAndValues') }}
                        </div>
                        <div class='flex justify-space-between mb-2'>
                            <span class='text-minorColor'>
                                {{ $t('trade.positionPrice') }}
                            </span>
                            <strong>{{ positionData.openPrice || '--' }}</strong>
                        </div>
                        <div class='flex justify-space-between mb-2'>
                            <span class='text-minorColor'>
                                {{ $t('trade.currentPrice') }}
                            </span>
                            <strong v-if='product.tradeType == 2 && product.dealMode===6' :class='[product?.last_color]'>
                                {{ product?.rolling_last_price || '--' }}
                            </strong>
                            <strong v-else :class='[Number(positionData.direction) === 1 ? product?.sell_color : product?.buy_color]'>
                                {{ (Number(positionData.direction) === 1 ? product?.sell_price : product?.buy_price) || '--' }}
                            </strong>
                        </div>

                        <!-- <div class='flex justify-space-between mb-2' :class='product.rolling_upDownColor'>
                            <span class='text-minorColor'>
                                {{ $t('trade.priceChange') }}
                            </span>
                            <strong>{{ product.rolling_upDownWidth }}</strong>
                        </div> -->
                        <div v-if='Number(positionData.tradeType) === 2' class='flex justify-space-between mb-2'>
                            <span class='text-minorColor'>
                                {{ $t('trade.previewStopPrice') }}
                            </span>
                            <strong>{{ positionData.previewStopPrice || '--' }}</strong>
                        </div>

                        <div class='text-sm font-bold mb-2'>
                            {{ $t('trade.margin') }}
                        </div>

                        <div class='flex justify-space-between mb-2'>
                            <span class='text-minorColor'>
                                {{ $t('trade.originalMargin') }}
                            </span>
                            <strong>{{ positionData.occupyTheMargin || '--' }}</strong>
                        </div>

                        <div class='flex justify-space-between mb-2'>
                            <div class='text-minorColor flex' @click.stop='showExplain(8)'>
                                <span>
                                    {{ $t('trade.postionSize') }}
                                </span>
                            </div>
                            <div class='text-right'>
                                <div class='font-bold'>
                                    {{ formatAmount(positionData.currentTradeAmount) }}
                                </div>
                            </div>
                        </div>
                        <div class='flex justify-space-between mb-2'>
                            <span class='text-minorColor'>
                                {{ $t('trade.marginBalance') }}
                            </span>
                            <!--  保证金余额 = 初始保证金+盈亏+利息 -->
                            <strong v-if='positionData.occupyTheMargin && positionData.profitLoss && positionData.interest'>
                                {{ plus(plus(positionData.occupyTheMargin, positionData.profitLoss), positionData.interest) }}
                            </strong>
                            <strong v-else>
                                --
                            </strong>
                        </div>
                        <!-- <div class='flex justify-space-between mb-2'>
                            <span class='text-minorColor'>
                                {{ $t('trade.holdMargin') }}
                            </span>
                            <strong>{{ positionData.maintenanceMargin || '--' }}</strong>
                        </div>
                        <div class='flex justify-space-between mb-2'>
                            <span class='text-minorColor'>
                                <span @click.stop='showExplain(10)'>
                                    {{ $t('assetsExplain.text20') }}
                                </span>
                                <van-icon class='question' name='question-o' @click.stop='showExplain(10)' />
                            </span>
                            <div class='flex items-center'>
                                <span :class="['riskLevel', 'riskLevel' + positionData?.riskStatus]">
                                    {{ riskLevelMap?.[positionData?.riskStatus] || '' }}
                                </span>
                                <span
                                    v-if='Number(positionData.tradeType) === 2'
                                    class='btn ml-1 text-primary text-underline'
                                    @click.stop='adjustVisible = true'
                                >
                                    {{ $t('trade.modifyMargin') }}
                                </span>
                            </div>
                        </div> -->
                        <div class='text-sm font-bold mb-2'>
                            {{ $t('trade.limitPirce') }}
                        </div>

                        <div class='flex justify-space-between mb-2'>
                            <div class='text-minorColor'>
                                {{ $t('trade.stopProfitPrice') }}
                            </div>
                            <strong class='val'>
                                {{ parseFloat(positionData.takeProfitDecimal) ? positionData.takeProfitDecimal : '--' }}
                            </strong>
                        </div>
                        <div class='flex justify-space-between mb-2'>
                            <div class='text-minorColor'>
                                {{ $t('trade.stopLossPrice') }}
                            </div>
                            <strong class='val'>
                                {{ parseFloat(positionData.stopLossDecimal) ? positionData.stopLossDecimal : '--' }}
                            </strong>
                        </div>

                        <div class='text-sm font-bold mb-2'>
                            {{ $t('trade.otherDetail') }}
                        </div>

                        <div class='flex justify-space-between mb-2'>
                            <div class='text-minorColor'>
                                {{ $t('trade.swap_2') }}
                            </div>
                            <strong class='val'>
                                {{ positionData.interest || '--' }}({{ assetsInfo.currency }})
                            </strong>
                        </div>
                        <div class='flex justify-space-between mb-2'>
                            <div class='text-minorColor'>
                                {{ $t('trade.openTime') }}
                            </div>
                            <strong class='val'>
                                {{ positionData.openTime ? formatTime(positionData.openTime) : '--' }}
                            </strong>
                        </div>
                        <div class='flex justify-space-between mb-2'>
                            <div class='text-minorColor'>
                                {{ $t('trade.positionId') }}
                            </div>
                            <strong class='val'>
                                {{ positionData.positionId || '--' }}
                            </strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <DialogClosePosition v-if='positionData' v-model:show='closeVisible' :data='positionData' :product='product' />
    <!-- 调整保证金 -->
    <DialogAdjustMargin v-model:show='adjustVisible' :data='positionData' />
</template>

<script>
import DialogClosePosition from '@plans/components/dialogClosePosition'
import { reactive, toRefs, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { MsgSocket, QuoteSocket } from '@/plugins/socket/socket'
import DialogAdjustMargin from '@plans/components/dialogAdjustMargin'
import { minus, plus } from '@/utils/calculation'
import { useI18n } from 'vue-i18n'
import useSubscribe24H from '@/hooks/product/useSubscribe24H.js'

export default {
    components: {
        DialogClosePosition,
        DialogAdjustMargin,
    },
    setup (props) {
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const state = reactive({
            showSetProfit: false,
            closeVisible: false,
            adjustVisible: false,
        })
        const { t } = useI18n({ useScope: 'global' })
        // 风险状态等级文案
        const riskLevelMap = {
            1: t('riskLevel.safety'),
            2: t('riskLevel.warn'),
            3: t('riskLevel.danger'),
        }

        const { orderId, positionId, symbolId, tradeType } = route.query

        const assetsInfo = computed(() =>
            store.state._user.customerInfo.accountList.find((el) => Number(el.tradeType) === Number(tradeType)),
        )

        const customerInfo = computed(() => store.state._user.customerInfo)

        const positionData = computed(() => store.state._trade.positionMap[positionId + '_' + tradeType])

        const product = computed(() => store.state._quote.productMap[symbolId + '_' + tradeType])

        const positionVolume = computed(() => minus(positionData.value?.openVolume, positionData.value?.closeVolume))
        const style = computed(() => store.state.style)
        const symbolKeys = computed(() => [symbolId + '_' + tradeType])
        useSubscribe24H(symbolKeys)

        const btnBg = style.value.primary + '0D'
        const accountId = customerInfo.value.accountList.find((item) => Number(item.tradeType) === Number(tradeType))?.accountId
        // 初始化设置
        const init = () => {
            QuoteSocket.send_subscribe([product.value.symbolKey])
            // 订阅资产数据
            setTimeout(() => {
                MsgSocket.subscribeAsset(tradeType)
            })
            if (!product.value?.minVolume) {
                // 获取产品详情
                store
                    .dispatch('_quote/querySymbolInfo', {
                        symbolId,
                        tradeType: tradeType,
                    })
                    .then((res) => {
                        if (res.symbolId) {
                            QuoteSocket.send_subscribe24H([`${res.symbolId}_${res.tradeType}`])
                        }
                    })
            }
            // 订阅报价
            if (positionId && !positionData.value?.positionId) {
                store.dispatch('_trade/queryPositionPage', {
                    tradeType: tradeType,
                    accountId,
                })
            }
        }

        const setProfitSuccess = () => {}
        const updateSLTPVisible = (val) => {
            state.showSetProfit = val
        }
        // 平仓
        const closeHandler = () => {
            state.closeVisible = true
        }

        const toProduct = (symbolId) => {
            router.push({ path: '/product', query: { symbolId, tradeType } })
        }

        store.commit('_quote/Update_productActivedID', symbolId + '_' + tradeType)

        onMounted(() => {
            init()
        })

        onBeforeUnmount(() => {
            MsgSocket.cancelSubscribeAsset()
        })

        const formatAmount = (amount) => {
            if (!amount) return '--'
            return `${amount} ${assetsInfo.value.currency}`
        }

        return {
            ...toRefs(state),
            setProfitSuccess,
            updateSLTPVisible,
            positionVolume,
            closeHandler,
            product,
            positionData,
            orderId,
            assetsInfo,
            positionId,
            toProduct,
            btnBg,
            plus,
            minus,
            riskLevelMap,
            formatAmount
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    position: relative;
    height: 100%;
    padding-top: 1.2rem;
    font-size: 0.37333rem;
    background: var(--bgColor);
    .riskLevel {
        font-size: rem(26px);
        &.riskLevel1 {
            color: var(--success);
        }
        &.riskLevel2 {
            color: var(--focusColor);
        }
        &.riskLevel3 {
            color: var(--warn);
        }
    }
    .m-orderInfo {
        padding: 12px;
        .layout {
            padding: 0 rem(30px) 0;
            margin-bottom: rem(20px);
            background-color: var(--contentColor);
            border-radius: 10px;
            .item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 0 rem(40px);
                &.item-1 {
                    padding-bottom: 0;
                }
            }
        }
        .layout-1 {
            .item-2 {
                padding-top: rem(30px);
                .col {
                    .name {
                        margin-bottom: rem(4px);
                        .number {
                            color: var(--minorColor);
                        }
                    }
                    :nth-child(1n) {
                        .name {
                            text-align: left;
                        }
                    }
                }
            }
            .btns {
                padding-bottom: rem(30px);
                display: flex;
                justify-content: space-between;
                .item-btn {
                    height: rem(56px);
                    line-height: rem(56px);
                    border-radius: rem(6px);
                    background: v-bind(btnBg);
                    color: var(--primary);
                    flex: 1;
                    text-align: center;
                    margin-right: rem(25px);
                    &:last-child {
                        margin-right: 0;
                    }
                }
            }
            .name {
                font-size: rem(28px);
                &.lx {
                    font-size: rem(34px);
                }
                &.profit {
                    font-size: rem(70px);
                }
            }
            .code {
                color: var(--minorColor);
                font-size: rem(20px);
            }
            .sub {
                color: var(--minorColor);
                font-size: rem(28px);
            }
            .direction {
                display: inline-block;
                height: rem(36px);
                line-height: rem(40px);
                border-radius: rem(6px);
                color: #fff;
                text-align: center;
                padding: 0 rem(8px);
                font-size: rem(24px);
                margin-right: rem(10px);
                &.riseColor {
                    background: var(--riseColor);
                }
                &.fallColor {
                    background: var(--fallColor);
                }
            }
            .active {
                color: var(--color);
                font-size: rem(28px);
            }
        }
    }
}
</style>

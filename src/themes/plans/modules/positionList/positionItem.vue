<template>
    <div class='product-item'>
        <div class='item' :data='activeNames'>
            <van-collapse
                v-model='activeNames'
                :accordion='true'
                class='activeNames'
            >
                <van-collapse-item :name='data.positionId'>
                    <template #title>
                        <div class='cell'>
                            <div class='th'>
                                <div class='tl'>
                                    <span class='name'>
                                        {{ data.symbolName }}
                                    </span>
                                    <span class='lot'>
                                        {{ data.symbolCode }}
                                    </span>
                                    <span>
                                        <span :class="Number(data.direction) === 1 ? 'riseColor' : 'fallColor'">
                                            {{ Number(data.direction) === 1 ? $t('trade.buy') :$t('trade.sell') }}&nbsp;
                                        </span>{{ minus(data.openVolume, data.closeVolume) }} {{ $t('trade.volumeUnit') }}
                                    </span>
                                </div>

                                <div>
                                    <span class='ft amount' :class="parseFloat(data.profitLoss) > 0 ? 'riseColor': 'fallColor'">
                                        {{ data.profitLoss }} {{ customerInfo.currency }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </template>
                    <div class='cell' @click.stop='toPositionDetail(data)'>
                        <div class='flex-wrap'>
                            <div class='flex-item'>
                                <div class='title'>
                                    {{ $t('trade.positionPrice') }}
                                </div>
                                <div class='val'>
                                    {{ data.openPrice }}
                                </div>
                            </div><div class='flex-item alignRight'>
                                <div class='title'>
                                    {{ $t('trade.currentPrice') }}
                                </div>
                                <div :class='[Number(data.direction) === 1 ? product?.sell_color : product?.buy_color]'>
                                    {{ Number(data.direction) === 1 ? product?.sell_price : product?.buy_price }}
                                </div>
                            </div>
                        </div>
                        <div class='flex-wrap'>
                            <div class='flex-item'>
                                <div class='title'>
                                    {{ $t('trade.stopProfitPrice') }}
                                </div>
                                <div class='val'>
                                    {{ parseFloat(data.takeProfitDecimal) ? data.takeProfitDecimal : '--' }}
                                </div>
                            </div>
                            <div class='flex-item'>
                                <div class='title'>
                                    {{ $t('trade.stopLossPrice') }}
                                </div>
                                <div class='val'>
                                    {{ parseFloat(data.stopLossDecimal) ? data.stopLossDecimal : '--' }}
                                </div>
                            </div>
                        </div>

                        <div v-if='Number(tradeType) === 2' class='flex-wrap'>
                            <div class='flex-item'>
                                <div class='title'>
                                    {{ $t('trade.originalMargin') }}
                                </div>
                                <div class='val'>
                                    {{ data.occupyTheMargin || '--' }}
                                </div>
                            </div>
                            <div class='flex-item'>
                                <div class='title'>
                                    {{ $t('trade.holdMargin') }}
                                </div>
                                <div class='val'>
                                    {{ data?.maintenanceMargin || '--' }}
                                </div>
                            </div>
                            <div class='flex-item'>
                                <div class='title alignRight'>
                                    {{ $t('trade.previewStopPrice') }}
                                </div>
                                <div class='val alignRight'>
                                    {{ data.previewStopPrice || '--' }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class='cell'>
                        <div class='flex-wrap'>
                            <div class='flex-item'>
                                <div class='title'>
                                    {{ $t('trade.dealTime') }}
                                </div>
                                <div class='val'>
                                    {{ formatTime(data.openTime) }}
                                </div>
                            </div><div class='flex-item alignRight'>
                                <div class='title'>
                                    {{ $t('trade.dealNo') }}
                                </div>
                                <div class='val'>
                                    {{ data.orderId }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class='cell'>
                        <div class='ft'>
                            <div class='bd' @click.stop='toProduct(data.symbolId)'>
                                <i class='icon_icon_chart hidden'></i>
                            </div>
                            <van-button
                                v-if='Number(tradeType) === 2'
                                hairline
                                size='mini'
                                type='default'
                                @click.stop='$emit("showAdjustPopup",data)'
                            >
                                {{ $t('trade.modifyMargin') }}
                            </van-button>
                            <van-button
                                hairline
                                size='mini'
                                type='default'
                                @click.stop='$emit("showSLTP",data)'
                            >
                                {{ $t('trade.tackStopSetup') }}
                            </van-button>
                            <van-button
                                hairline
                                size='mini'
                                type='default'
                                @click.stop='$emit("showClose",data)'
                            >
                                {{ $t('trade.closed') }}
                            </van-button>
                        </div>
                    </div>
                </van-collapse-item>
            </van-collapse>
        </div>
    </div>
</template>

<script>
import { computed, reactive, toRefs, onMounted, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { minus } from '@/utils/calculation'
export default {
    props: ['data'],
    // emits: ['showClose', 'showAdjustPopup', 'showSLTP'],
    setup ({ data }) {
        const store = useStore()
        const router = useRouter()
        const state = reactive({
            show: false,
            loading: false,
            cur: {},
            cpVis: false,
            activeNames: ''
        })
        const plans = computed(() => store.state._base.plans)
        const tradeType = computed(() => store.state._quote.curTradeType || plans.value[0].id)
        const customerInfo = computed(() => store.state._user.customerInfo)
        const positionList = computed(() => store.state._trade.positionList[tradeType.value])
        const product = computed(() => store.state._quote.productMap[data.symbolId + '_' + tradeType.value])

        const toPositionDetail = (item) => {
            store.commit('_quote/Update_productActivedID', item.symbolId)
            router.push({
                path: '/positionDetail',
                query: { symbolId: item.symbolId, positionId: item.positionId, tradeType: item.tradeType }
            })
        }
        const updateShow = (val) => {
            state.cpVis = val
        }

        const toProduct = (symbolId) => {
            router.push({ path: '/product', query: { symbolId, tradeType: tradeType.value } })
        }

        watchEffect(() => {
            if (positionList.value?.length > 0) { state.activeNames = positionList.value[0].positionId }
        })

        return {
            ...toRefs(state),
            positionList,
            customerInfo,
            product,
            toPositionDetail,
            updateShow,
            toProduct,
            minus,
            tradeType
        }
    }
}
</script>

<style lang='scss' scoped>
@import '@/sass/mixin.scss';
.product-item {
    .item {
        position: relative;
        //height: rem(100px);
        //margin-bottom: rem(20px);
        overflow: hidden;
        background: var(--contentColor);
        border-bottom: solid rem(1px) var(--lineColor);
        border-radius: rem(10px);
        :deep(.van-collapse-item__title) {
            padding: rem(20px) rem(30px) 0 rem(30px);
            .van-cell__right-icon {
                color: var(--color);
                vertical-align: middle;
            }
        }
        :deep(.van-collapse) {
            .van-cell {
                &::after {
                    border: none;
                }
            }
            &::after {
                border: none;
            }
        }
        .cell {
            width: 100%;
            margin-bottom: rem(20px);
            color: var(--minorColor);
            font-size: rem(20px);
            line-height: 1.45;
            .th {
                display: flex;
                align-items: baseline;
                justify-content: space-between;
            }
            &:last-child {
                align-items: flex-end;
            }
            .bd {
                position: relative;
                display: inline-block;
                //margin-right: rem(15px);
                text-align: center;
            }
            .flex-wrap {
                display: flex;
                justify-content: space-between;
                margin-bottom: rem(30px);
                .flex-item {
                    display: inline-block;
                    >div {
                        padding: 0 rem(4px);
                    }
                    .title {
                        margin-right: rem(4px);
                        padding: 0;
                        color: var(--minorColor);
                    }
                    .val {
                        color: var(--normalColor);
                    }
                }
            }
            .ft {
                display: flex;
                vertical-align: middle;
                .van-button {
                    color: var(--primary);
                    vertical-align: middle;
                    background: var(--primaryAssistColor);
                    border-color: var(--primaryAssistColor);
                }
            }
            .amount {
                padding-right: rem(16px);
                font-weight: 600;
                font-size: rem(34px);
            }
            .arrow {
                color: var(--color);
                vertical-align: middle;
            }
            .warn {
                color: var(--color);
                background-color: var(--focusColor);
            }
            .name {
                display: inline-block;
                max-width: rem(360px);
                color: var(--color);
                font-size: rem(28px);
                line-height: rem(38px);
                vertical-align: bottom;
            }
            .lot {
                display: inline-block;
                margin-left: 0.5em;
                vertical-align: bottom;
            }
            .time {
                color: var(--minorColor);
                font-size: rem(20px);
            }
        }
        .icon_icon_chart {
            display: inline-block;
            width: rem(52px);
            height: rem(52px);
            font-size: rem(30px);
            font-style: normal;
            line-height: rem(52px);
            text-align: center;
            border-radius: rem(6px);
            &.hidden {
                color: var(--primary);
                background-color: var(--primaryAssistColor);
            }
        }
        .van-button {
            //width: rem(165px);
            flex: 1;
            height: rem(52px);
            margin-left: rem(20px);
            color: var(--primary) !important;
            font-size: rem(24px);
            line-height: rem(48px);
            background: var(--primaryAssistColor) !important;
            border: none;
            border-color: var(--primaryAssistColor) !important;
            border-radius: rem(6px);
        }
    }
}
</style>

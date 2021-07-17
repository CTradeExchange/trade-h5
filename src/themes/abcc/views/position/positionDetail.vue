<template>
    <div class='page-wrap'>
        <LayoutTop />
        <div v-if='positionData' class='main'>
            <div class='m-orderInfo'>
                <div class='layout layout-1'>
                    <div v-if='product' class='item item-1'>
                        <div class='left'>
                            <div class='name'>
                                {{ product.symbolName }}
                            </div>
                            <div class='code'>
                                {{ product.symbolName }}
                            </div>
                        </div>
                    </div>
                    <div class='item item-2'>
                        <!-- <div class='col'>
                            <div class='sub'>
                                {{ $t('trade.netProfit') }} (USD)
                            </div><div class='name riseColor'>
                            </div>
                        </div> -->
                        <div class='col'>
                            <div class='sub'>
                                {{ $t('trade.profit') }}({{ customerInfo.currency }})
                            </div>
                            <div class='name' :class="parseFloat(positionData.profitLoss) > 0 ? 'riseColor': 'fallColor'">
                                {{ positionData.profitLoss }}
                            </div>
                        </div><div class='col'>
                            <div class='sub'>
                                {{ $t('trade.swap_2') }}({{ customerInfo.currency }})
                            </div>
                            <div class='name'>
                                {{ positionData.interest || '--' }}
                            </div>
                        </div>
                        <!-- abcc版本不需要显示手续费 -->
                        <!-- <div class='col'>
                            <div class='sub'>
                                {{ $t('trade.fee') }}({{ customerInfo.currency }})
                            </div>
                            <div class='name'>
                                {{ positionData.openFee || '--' }}
                            </div>
                        </div> -->
                    </div>
                </div>
                <div class='layout layout-1'>
                    <div class='item item-2 van-hairline--bottom'>
                        <div class='col'>
                            <div class='sub' :class="Number(positionData.direction) === 1 ? 'riseColor' : 'fallColor'">
                                {{ Number(positionData.direction) === 1 ? $t('trade.buy') :$t('trade.sell') }}&nbsp;
                            </div><div class='name'>
                                {{ positionVolume }} {{ $t('trade.volumeUnit') }}
                            </div>
                        </div>
                        <div class='col'>
                            <div class='sub'>
                                {{ $t('trade.positionPrice') }}
                            </div>
                            <div class='name'>
                                {{ positionData.openPrice }}
                            </div>
                        </div>
                        <div class='col'>
                            <div class='sub'>
                                {{ $t('trade.currentPrice') }}
                            </div>
                            <div class='name' :class='[Number(positionData.direction) === 1 ? product.sell_color : product.buy_color]'>
                                {{ Number(positionData.direction) === 1 ? product.sell_price : product.buy_price }}
                            </div>
                        </div>
                    </div>
                    <div class='item item-2 van-hairline--bottom'>
                        <div class='col'>
                            <div class='sub'>
                                {{ $t('trade.stopLossPrice') }}
                            </div>
                            <div class='name'>
                                <span class='number'>
                                    {{ parseFloat(positionData.stopLossDecimal) ? positionData.stopLossDecimal : $t('trade.nosSet') }}
                                </span>
                            </div>
                        </div>
                        <div class='col'>
                            <div class='sub'>
                                {{ $t('trade.stopProfitPrice') }}
                            </div>
                            <div class='name'>
                                <span class='number'>
                                    {{ parseFloat(positionData.takeProfitDecimal) ? positionData.takeProfitDecimal : $t('trade.nosSet') }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class='layout layout-3'>
                    <div class='item van-hairline--bottom'>
                        <div class='left'>
                            <div class='title'>
                                {{ $t('trade.openTime') }}
                            </div>
                        </div><div class='right'>
                            {{ formatTime(positionData.openTime) }}
                        </div>
                    </div><div class='item'>
                        <div class='left'>
                            <div class='title'>
                                {{ $t('trade.positionId') }}
                            </div>
                        </div><div class='right'>
                            ID : {{ positionId }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class='submitBox'>
            <van-button plain size='normal' type='default' @click='showSetProfit = true'>
                {{ $t('trade.tackStopSetup') }}
            </van-button>
            <van-button size='normal' type='primary' @click='closeHandler'>
                {{ $t('trade.closeOrder') }}
            </van-button>
        </div>
    </div>
    <!-- :positionData='activeOrder' -->
    <DialogSLTP
        :data='positionData'
        :product='product'
        :show='showSetProfit'
        @submit='setProfitSuccess'
        @update:show='updateSLTPVisible'
    />
    <DialogClosePosition v-model:show='closeVisible' :data='positionData' :product='product' />
</template>

<script>
import DialogSLTP from '@c/components/dialogSLTP'
import DialogClosePosition from '@c/components/dialogClosePosition'
import { reactive, toRefs, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { QuoteSocket } from '@/plugins/socket/socket'
import { minus } from '@/utils/calculation'
export default {
    components: {
        DialogSLTP,
        DialogClosePosition,
    },
    setup (props) {
        const store = useStore()
        const route = useRoute()
        const state = reactive({
            showSetProfit: false,
            closeVisible: false,
        })

        const { orderId, positionId, symbolId } = route.query
        store.commit('_quote/Update_productActivedID', symbolId)
        const customerInfo = computed(() => store.state._user.customerInfo)
        const positionData = computed(() => store.state._trade.positionMap[positionId])
        const product = computed(() => store.state._quote.productMap[symbolId])
        const positionVolume = computed(() => minus(positionData.value?.openVolume, positionData.value?.closeVolume))
        // 初始化设置
        const init = () => {
            if (!product.value.minVolume) {
                // 获取产品详情
                store.dispatch('_quote/querySymbolInfo', symbolId)
            }
            // 订阅报价
            QuoteSocket.send_subscribe([symbolId])
            if (positionId && !positionData.value?.positionId) {
                store.dispatch('_trade/queryPositionPage')
            }
        }
        onMounted(() => {
            init()
        })

        const setProfitSuccess = () => {

        }
        const updateSLTPVisible = (val) => {
            state.showSetProfit = val
        }
        // 平仓
        const closeHandler = () => {
            state.closeVisible = true
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
            customerInfo,
            positionId
        }
    }
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
    .m-orderInfo {
        padding: rem(20px) rem(20px) rem(7px) rem(20px);
        .layout {
            margin-bottom: rem(20px);
            background-color: var(--contentColor);
            border-radius: 10px;
            .item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: rem(32px) rem(30px);
                &.item-1 {
                    padding-bottom: 0;
                }
            }
        }
        :deep(.van-button) {
            border-radius: rem(6px);
        }
        :deep(.van-button__text) {
            color: var(--primary);
        }
        :deep(.van-button__text) {
            width: rem(124px);
            height: rem(48px);
            font-size: rem(24px);
            line-height: rem(48px);
        }
        .layout-1 {
            .item-2 {
                .col {
                    .name {
                        margin-bottom: rem(4px);
                        .number {
                            color: var(--minorColor);
                        }
                    }
                    &:last-child {
                        text-align: right;
                    }
                }
            }
            .name {
                font-size: rem(28px);
            }
            .code {
                color: var(--minorColor);
                font-size: rem(20px);
            }
            .sub {
                color: var(--minorColor);
                font-size: rem(24px);
            }
            .active {
                color: var(--color);
                font-size: rem(28px);
            }
        }
        .layout-3 {
            font-size: rem(28px);
            .left {
                color: var(--minorColor);
                .title {
                    display: inline-block;
                    margin-right: rem(20px);
                }
                i {
                    position: relative;
                    top: rem(6px);
                    font-size: rem(30px);
                }
            }
            .right {
                color: var(--color);
                text-align: right;
            }
        }
    }
    .submitBox {
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 2;
        display: flex;
        width: 100%;
        .van-button {
            flex: 1;
            height: rem(90px);
            font-size: rem(30px);
            background: var(--primary);
            border: none;
            border-radius: 0;
            &.van-button--default {
                color: var(--primary);
                background: var(--contentColor);
            }
        }
    }
}

</style>

<template>
    <div class='page-wrap'>
        <LayoutTop :back='true' :menu='false' />
        <div v-if='orderInfo' class='main'>
            <div class='m-orderInfo'>
                <div class='layout layout-1'>
                    <div class='item item-1'>
                        <div class='left'>
                            <div class='name'>
                                {{ orderInfo.symbolName }}
                            </div>
                            <div class='code'>
                                {{ orderInfo.symbolCode }}
                            </div>
                        </div>
                    </div>
                    <div class='item item-2'>
                        <div class='col'>
                            <div class='sub' :class="Number(orderInfo.direction) === 1 ? 'riseColor' : 'fallColor'">
                                {{ Number(orderInfo.direction) === 1 ? $t('trade.buy') :$t('trade.sell') }}&nbsp;
                            </div>
                            <div class='name'>
                                {{ orderInfo.requestNum }} {{ $t('trade.volumeUnit') }}
                            </div>
                        </div><div class='col'>
                            <div class='sub'>
                                {{ $t('trade.pendingPrice') }}
                            </div>
                            <div class='name'>
                                {{ pendingPrice }}
                            </div>
                        </div><div class='col'>
                            <div class='sub' :class='[product.cur_color]'>
                                {{ $t('trade.currentPrice') }}
                            </div>
                            <div class='name' :class='[Number(orderInfo.direction) === 1 ? product.buy_color : product.sell_color]'>
                                {{ Number(orderInfo.direction) === 1 ? product.buy_price : product.sell_price }}
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
                                    {{ orderInfo.stopLoss ? shiftedBy(orderInfo.stopLoss, -1*product.price_digits): $t("c.noSetup") }}
                                </span>
                            </div>
                        </div>
                        <div class='col'>
                            <div class='sub'>
                                {{ $t('trade.stopProfitPrice') }}
                            </div>
                            <div class='name'>
                                <span class='number'>
                                    {{ orderInfo.takeProfit ? shiftedBy(orderInfo.takeProfit, -1*product.price_digits) : $t("c.noSetup") }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class='layout layout-3'>
                    <div class='item van-hairline--bottom'>
                        <div class='left'>
                            <div class='title'>
                                {{ $t('trade.expiryTime') }}
                            </div>
                        </div>
                        <div class='right'>
                            {{ $t( orderInfo.expireType===1?'trade.expireType1' :'trade.expireType2') }}
                        </div>
                    </div>
                    <div class='item van-hairline--bottom'>
                        <div class='left'>
                            <div class='title'>
                                {{ $t('trade.pendingTime') }}
                            </div>
                        </div>
                        <div class='right'>
                            {{ formatTime(orderInfo.orderTime) }}
                        </div>
                    </div>
                    <div class='item'>
                        <div class='left'>
                            <div class='title'>
                                {{ $t('trade.orderSn') }}
                            </div>
                        </div>
                        <div class='right'>
                            ID : {{ id }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class='submitBox'>
            <van-button plain size='normal' type='default' @click='showCancelOrderTip = true'>
                {{ $t('trade.cancelPending') }}
            </van-button>
        </div>
        <DialogBottomTip
            v-model:show='showCancelOrderTip'
            :tips="$t('trade.cancelPendingConfirm')"
            :title="$t('trade.cancelPending')"
            @submit='cancelOrderHandler'
        />
        <Loading :show='loading' />
    </div>
</template>

<script>
import { reactive, toRefs, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { shiftedBy } from '@/utils/calculation'
import { closePboOrder } from '@/api/trade'
import { QuoteSocket } from '@/plugins/socket/socket'
import DialogBottomTip from '@c/components/dialogBottomTip'
import { Toast } from 'vant'
import { useI18n } from 'vue-i18n'
export default {
    components: {
        DialogBottomTip,
    },
    setup (props) {
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            showCancelOrderTip: false,
            loading: false,
        })

        const { id, symbolId } = route.query
        const product = computed(() => store.state._quote.productMap[symbolId])
        const customerInfo = computed(() => store.state._user.customerInfo)
        const orderInfo = computed(() => store.state._trade.pendingMap[id])
        const pendingPrice = computed(() => shiftedBy(orderInfo.value?.requestPrice, -1 * product.value?.price_digits))

        QuoteSocket.send_subscribe([symbolId])

        // 初始化设置
        const init = () => {
            if (!product.value?.minVolume) {
                // 获取产品详情
                store.dispatch('_quote/querySymbolInfo', symbolId)
            }
            // 订阅报价
            QuoteSocket.send_subscribe([symbolId])
            if (id && !orderInfo.value?.id) {
                store.dispatch('_trade/queryPBOOrderPage')
            }
        }

        // 取消挂单
        const cancelOrderHandler = () => {
            state.showCancelOrderTip = false
            // bizType 0-默认初始值；1-市价开；2-市价平；3-止损平仓单；4-止盈平仓单；5-爆仓强平单；6-到期平仓单；7-销户平仓单；8-手动强平单；9-延时订单；10-限价预埋单；11-停损预埋单；
            const params = {
                pboId: orderInfo.value.id,
                bizType: orderInfo.value.bizType
            }
            state.loading = true
            closePboOrder(params).then(res => {
                state.loading = false
                if (res.check()) {
                    router.back()
                    Toast(t('trade.cancelSuccess'))
                    store.dispatch('_trade/queryPBOOrderPage')
                }
            }).catch(err => {
                state.loading = false
                console.log(err)
            })
        }
        onMounted(() => {
            init()
        })

        return {
            ...toRefs(state),
            product,
            orderInfo,
            pendingPrice,
            customerInfo,
            shiftedBy,
            cancelOrderHandler,
            id
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
        :deep(.van-button__mini) {
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
                        &.riseColor {
                            color: var(--fallColor);
                        }
                        &.fallColor {
                            color: var(--riseColor);
                        }
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
                color: var(--color);
                font-size: rem(28px);
            }
            .code {
                color: var(--minorColor);
                font-size: rem(20px);
            }
            .sub {
                color: var(--minorColor);
                &.riseColor {
                    color: var(--fallColor);
                }
                &.fallColor {
                    color: var(--riseColor);
                }
            }
            .active {
                color: #333;
                font-size: rem(28px);
            }
        }
        .layout-3 {
            font-size: rem(28px);
            .left {
                color: #999;
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

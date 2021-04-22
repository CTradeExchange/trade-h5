<template>
    <top back :menu='false' :sub-title='product.symbolCode' :title='product.symbolName' />
    <div v-if='product' class='orderWrap'>
        <p class='header-info'>
            平仓：#{{ positionId }} {{ Number(direction) === 1 ? 'buy' : 'sell' }} {{ openVolume }}
        </p>
        <!-- 订单手数 -->
        <div class='cell'>
            <OrderVolumn v-model='volumn' :disabled='false' :product='product' />
        </div>

        <!-- 买卖价格 -->
        <div class='cell priceCell'>
            <div class='col fallColor'>
                <Price :digit='product.price_digits' :mode='2' :point-ratio='product.pointRatio' :price='product.sell_price' />
            </div>
            <div class='col riseColor'>
                <Price :digit='product.price_digits' :mode='2' :point-ratio='product.pointRatio' :price='product.buy_price' />
            </div>
        </div>
        <!-- {{ profitLossRang }} -->
        <!-- 挂单 -->
        <div v-if='openOrderSelected.val > 1' class='cell priceSet'>
            <div class='col'>
                <PriceStepper v-model='pendingPrice' :product='product' />
            </div>
        </div>

        <!-- 价格设置 -->
        <div class='cell priceSet'>
            <div class='col'>
                <PriceStepper v-model='stopLoss' :disabled='true' :product='product' />
            </div>
            <div class='col'>
                <PriceStepper v-model='takeProfit' :disabled='true' :product='product' />
            </div>
        </div>

        <!-- 图表 -->
        <div class='chart'>
            <lightweightChart v-if='product.symbolDigits' ref='chart' :product='product' />
        </div>
    </div>

    <!-- 底部下单按钮 -->
    <van-button block class='confirm-btn' @click='handleConfirm'>
        <span>平仓</span>
    </van-button>

    <van-popup v-model:show='pendingVisible' :close-on-click-overlay='false' :style="{ width: '100%', height: '100%' }">
        <Pending :data='orderParams' :product='product' @onHide='pendingVisible = false' />
    </van-popup>
    <van-popup v-model:show='successVisible' :close-on-click-overlay='false' :style="{ width: '100%', height: '100%' }">
        <Success :data='resData' @onHide='successVisible = false' />
    </van-popup>

    <Loading :show='loading' />
</template>

<script>
import top from '@m/layout/top'
import Price from '@m/components/price'
import { computed, onUnmounted, reactive, ref, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
import { QuoteSocket, MsgSocket } from '@/plugins/socket/socket'
import { addMarketOrder } from '@/api/trade'
import { useRoute, useRouter } from 'vue-router'
import lightweightChart from './components/lightweightChart'
import OrderVolumn from './components/orderVolumn'
import PriceStepper from './components/priceStepper'
import Pending from './pending'
import Success from './success'
import { minus, divide, getDecimalNum } from '@/utils/calculation'
import { Toast } from 'vant'
export default {
    components: {
        Pending,
        OrderVolumn,
        lightweightChart,
        PriceStepper,
        Price,
        top,
        Success
    },
    setup (props, { emit }) {
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const chart = ref(null)
        const { symbolId, positionId, direction, openVolume, openNum, stopLossDecimal, takeProfitDecimal } = route.query
        const state = reactive({
            loading: false,
            disabled: positionId,
            pendingVisible: false,
            successVisible: false,
            dropdownWrap: false,
            openOrderSelected: {}, // 1即时执行 2买入限价 3卖出限价 4买入止损 5卖出止损
            volumn: 0.01,
            value: 3,
            pendingPrice: 0, // 挂单价
            stopLoss: 0, // 止损单价
            takeProfit: 0, // 止盈单价
            orderParams: {}, // 订单入参
            resData: {}
        })
        watch(
            () => state.pendingPrice,
            newval => store.commit('_trade/Update_pendingPrice', newval),
            { immediate: true }
        )
        onUnmounted(() => store.commit('_trade/Update_pendingPrice', 0))

        // 当前产品
        const product = computed(() => store.getters.productActived)
        const positionList = computed(() => store.state._trade.positionList)
        const profitLossRang = computed(() => store.getters['_trade/marketProfitLossRang'])

        // 设置默认手数
        watch(
            () => product.value.minVolume,
            newval => (state.volumn = Math.max(newval, product.value.volumeStep)),
            { immediate: true }
        )
        // 止损价格变更
        watch(
            () => state.stopLoss,
            newval => {
                chart.value && chart.value.stopLossLineUpdate({ price: newval })
            }
        )
        // 止赢价格变更
        watch(
            () => state.takeProfit,
            newval => {
                chart.value && chart.value.takeProfitLineUpdate({ price: newval })
            }
        )
        if (!product.value) router.replace('/')

        QuoteSocket.send_subscribe([symbolId]) // 订阅产品报价
        store.dispatch('_quote/querySymbolInfo', symbolId) // 获取产品详情
        store.commit('_quote/Update_productActivedID', symbolId)

        initPositionInfo()
        function initPositionInfo () {
            if (!positionId) return false
            Promise.resolve()
                .then(() => {
                    if (positionList.value.length === 0) {
                        return store.dispatch('_trade/queryPositionPage').then(res => {
                            return res.data
                        })
                    } else {
                        return Promise.resolve(positionList.value)
                    }
                })
                .then(list => {
                    if (!list) return false
                    const curPosition = list.find(el => el.positionId === Number(positionId))
                    if (!curPosition) return
                    state.volumn = minus(curPosition.openVolume, curPosition.closeVolume)
                })
        }

        const handleConfirm = () => {
            const requestPrice = direction === 1 ? product.value.sell_price : product.value.buy_price
            const params = {
                bizType: 2, // 业务类型。0-默认初始值；1-市价开；2-市价平；3-止损平仓单；4-止盈平仓单；5-爆仓强平单；6-到期平仓单；7-销户平仓单；8-手动强平单；9-延时订单；10-限价预埋单；11-停损预埋单；
                direction: Number(direction) === 1 ? 2 : 1, // 订单买卖方向。1-买；2-卖；
                symbolId: symbolId,
                positionId: Number(positionId),
                requestTime: Date.now(),
                requestNum: Number(openNum),
                requestPrice: Number(requestPrice),
            }
            state.loading = true
            addMarketOrder(params).then(res => {
                state.loading = false
                if (res.invalid()) return false
                emit('refresh')
                state.resData = res.data
                state.successVisible = true
                setTimeout(() => {
                    state.successVisible = false
                }, 2000)
            }).catch(err => {
                state.loading = false
            })
        }

        return {
            ...toRefs(state),
            product,
            chart,
            profitLossRang,
            positionId,
            direction,
            openVolume,
            openNum,
            stopLossDecimal,
            takeProfitDecimal,
            handleConfirm
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.orderWrap {
    position: relative;
    flex: 1;
    margin-bottom: rem(10px);
    overflow-y: auto;
    .header-info {
        font-weight: bold;
        font-size: rem(30px);
        line-height: rem(80px);
        text-align: center;
        border-bottom: solid 1px var(--bdColor);
    }
    .cell {
        margin-right: rem(30px);
        margin-left: rem(30px);
    }
}
.confirm-btn {
    position: absolute;
    bottom: 0;
    background: var(--btnColor);
    border-color: var(--bdColor);
    span {
        color: var(--color);
        font-size: rem(34px);
    }
}
.openType {
    @include ftbd();
    margin-top: rem(20px);
    padding: 1px;
    text-align: center;
    .title {
        position: relative;
        padding: rem(15px) 0 rem(5px);
        overflow: hidden;
        font-size: rem(28px);
        &::after {
            position: absolute;
            right: -6px;
            bottom: -6px;
            width: 13px;
            height: 13px;
            background: var(--placeholder);
            transform: rotate(45deg);
            content: '';
        }
    }
    .dropdownWrap {
        position: absolute;
        top: 100%;
        left: 0;
        z-index: 3;
        width: 100%;
        background: var(--bgColor);
        box-shadow: 1px 1px rem(15px) rgba(0, 0, 0, 0.3);
        .item {
            display: block;
            color: inherit;
            font-size: rem(28px);
            line-height: rem(80px);
        }
    }
}
.priceCell {
    display: flex;
    justify-content: center;
    margin-top: rem(30px);
    .col {
        &:first-of-type {
            margin-right: rem(40px);
        }
    }
}
.priceSet {
    display: flex;
    margin-top: rem(40px);
    .col {
        @include ftbd();
        flex: 1;
        margin-left: rem(40px);
        &:first-of-type {
            margin-left: 0;
            &::before {
                border-color: var(--sellColor);
            }
        }
        &:last-of-type {
            &::before {
                border-color: var(--buyColor);
            }
        }
    }
}
.chart {
    height: rem(500px);
    margin-top: rem(40px);
    color: var(--color);
    font-size: rem(30px);
    line-height: rem(500px);
    text-align: center;
    background: var(--bdColor);
}
</style>

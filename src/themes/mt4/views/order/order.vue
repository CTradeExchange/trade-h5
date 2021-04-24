<template>
    <top back :menu='false' :sub-title='product.symbolCode' :title='product.symbolName' />
    <div v-if='product' class='orderWrap'>
        <!-- 订单类型 -->
        <div v-if='!$route.query.positionId' class='cell openType'>
            <p class='title' @click='dropdownWrap = !dropdownWrap'>
                {{ openOrderSelected.name }}
            </p>
            <div v-show='dropdownWrap' class='dropdownWrap' @click='dropdownWrap = false'>
                <a v-for='item in openOrderList' :key='item.val' class='item of-1px-bottom' href='javascript:;' @click='selectOpenOrder(item)'>
                    {{ item.name }}
                </a>
            </div>
        </div>

        <!-- 订单手数 -->
        <div class='cell'>
            <OrderVolumn v-model='volumn' :disabled='disabled' :product='product' />
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
                <PriceStepper v-model='stopLoss' :product='product' />
            </div>
            <div class='col'>
                <PriceStepper v-model='takeProfit' :product='product' />
            </div>
        </div>

        <!-- 图表 -->
        <div class='chart'>
            <lightweightChart v-if='product.symbolDigits' ref='chart' :product='product' />
        </div>
    </div>

    <!-- 底部下单按钮 -->
    <FooterBtn
        :loading='loading'
        :open-order-selected='openOrderSelected'
        :pending-price='pendingPrice'
        :stop-loss='stopLoss'
        :take-profit='takeProfit'
        @openOrder='openOrder'
    />

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
import FooterBtn from './components/footerBtn'
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
        FooterBtn,
        top,
        Success
    },
    setup () {
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const chart = ref(null)
        const { symbolId, positionId } = route.query
        const state = reactive({
            loading: false,
            disabled: positionId,
            pendingVisible: false,
            successVisible: false,
            dropdownWrap: false,
            openOrderSelected: {}, // 1即时执行 2买入限价 3卖出限价 4买入止损 5卖出止损
            openOrderList: [
                { name: '即时执行', val: 1 },
                { name: '买入限价', val: 2 },
                { name: '卖出限价', val: 3 },
                { name: '买入止损', val: 4 },
                { name: '卖出止损', val: 5 }
            ],
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

        state.openOrderSelected = state.openOrderList[0]

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

        // 检查下单参数是否有效
        const paramsInvalid = () => {
            let result = false
            const m = divide(state.volumn, product.value.minVolume)
            result = getDecimalNum(m) > 0 // 手数不是最小手数的整数倍
            if (result) Toast('手数不是最小手数的整数倍')
            return result
        }

        // 点击下单按钮
        const openOrder = direct => {
            if (paramsInvalid()) return false
            let requestPrice = direct === 'sell' ? product.value.sell_price : product.value.buy_price
            let direction = direct === 'sell' ? 2 : 1
            let bizType = 1
            switch (state.openOrderSelected.val) {
                case 2:
                case 3:
                    bizType = 10
                    requestPrice = state.pendingPrice
                    break
                case 4:
                case 5:
                    bizType = 11
                    requestPrice = state.pendingPrice
                    break
                default:
                    bizType = 1
                    break
            }
            if ([2, 4].includes(state.openOrderSelected.val)) {
                direction = 1
            } else if ([3, 5].includes(state.openOrderSelected.val)) {
                direction = 2
            }
            const p = Math.pow(10, product.value.symbolDigits)
            console.log('****', state.volumn, product.value.contractSize)
            const params = {
                bizType, // 业务类型。0-默认初始值；1-市价开；2-市价平；3-止损平仓单；4-止盈平仓单；5-爆仓强平单；6-到期平仓单；7-销户平仓单；8-手动强平单；9-延时订单；10-限价预埋单；11-停损预埋单；
                direction, // 订单买卖方向。1-买；2-卖；
                symbolId: Number(product.value.symbol_id),
                requestTime: Date.now(),
                requestNum: state.volumn * product.value.contractSize,
                requestPrice: requestPrice * p,
                stopLoss: Number(state.stopLoss) ? state.stopLoss * p : undefined,
                takeProfit: Number(state.takeProfit) ? state.takeProfit * p : undefined
            }

            state.loading = true
            addMarketOrder(params)
                .then(res => {
                    state.loading = false
                    if (res.invalid()) return false
                    state.orderParams = params
                    // state.pendingVisible = true
                    state.successVisible = true
                    state.resData = res.data
                    state.resData.tradeVolume = state.volumn
                    setTimeout(() => {
                        state.successVisible = false
                        router.push({ name: 'Position' })
                    }, 5000)
                })
                .catch(err => {
                    state.loading = false
                })
        }

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
        // 选择订单类型
        const selectOpenOrder = item => {
            state.openOrderSelected = item
            if (item.val === 1) store.commit('_trade/Update_pendingPrice', 0)
        }

        return {
            ...toRefs(state),
            product,
            chart,
            openOrder,
            profitLossRang,
            selectOpenOrder
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
    .cell {
        margin-right: rem(30px);
        margin-left: rem(30px);
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

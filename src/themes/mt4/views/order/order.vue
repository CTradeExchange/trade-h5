<template>
    <top back :menu='false' :sub-title='product.symbolCode' :title='product.symbolName' />
    <div v-if='product' class='orderWrap'>
        <!-- 订单类型 -->
        <div v-if='!positionId && !pendingId' class='cell openType'>
            <p class='title' @click='dropdownWrap = !dropdownWrap'>
                {{ openOrderSelected.name }}
            </p>
            <div v-show='dropdownWrap' class='dropdownWrap' @click='dropdownWrap = false'>
                <a v-for='item in openOrderList' :key='item.val' class='item of-1px-bottom' href='javascript:;' @click='selectOpenOrder(item)'>
                    {{ item.name }}
                </a>
            </div>
        </div>
        <p v-if='positionId' class='header-info'>
            <span v-if='isClosePosition'>
                {{ $t('trade.closeOrder')+t('colon') }}
            </span>
            <span v-if='isModifyPosition'>
                {{ $t('trade.modifyOrder') + $t('colon') }}
            </span>
            #{{ positionId }} {{ Number(curPosition.direction) === 1 ? 'buy' : 'sell' }} {{ minus(curPosition.openVolume, curPosition.closeVolume||0) }}
        </p>

        <!-- 订单手数 -->
        <div class='cell'>
            <OrderVolumn v-model='volumn' :disabled='!!isModifyPosition || !!isModifyPending' :max='volumnMax' :min='volumnMin' :product='product' />
        </div>

        <!-- 买卖价格 -->
        <div class='cell priceCell'>
            <div class='col' :class='[product.sell_color]'>
                <Price :digit='product.price_digits' :mode='2' :point-ratio='product.pointRatio' :price='product.sell_price' />
            </div>
            <div class='col' :class='[product.buy_color]'>
                <Price :digit='product.price_digits' :mode='2' :point-ratio='product.pointRatio' :price='product.buy_price' />
            </div>
        </div>
        <!-- 挂单 -->
        <p>{{ $t('trade.pendingRange') }}</p>
        <p>{{ pendingPriceRang }}</p>
        <div v-if='openOrderSelected.val > 1 || pendingId' class='cell priceSet'>
            <div class='col'>
                <PriceStepper v-model='pendingPrice' class='pendingPrice' :disabled='disabled' :product='product' />
            </div>
        </div>

        <!-- 止盈止损价格设置 -->
        <p>{{ $t('trade.profitLossRange') }}</p>
        {{ profitLossRang }}
        <div class='cell priceSet'>
            <div class='col'>
                <TakeProfit v-model='stopLoss' :disabled='!!isClosePosition' :product='product' />
            </div>
            <div class='col'>
                <TakeProfit v-model='takeProfit' :disabled='!!isClosePosition' :product='product' />
            </div>
        </div>

        <!-- 挂单有效期 -->
        <SelectComp v-if='openOrderSelected.val > 1' v-model='expireType' :disabled='disabled' :options='expireTypeOptions'>
            <p class='expireTypeTitle'>
                {{ $t('trade.expire') + $t('colon') + expireTypeItem.label }}
            </p>
        </SelectComp>

        <!-- 图表 -->
        <div class='chart'>
            <lightweightChart v-if='product.price_digits' ref='chart' :product='product' />
        </div>
    </div>
    <!-- 协助测试代码 start -->
    <div class='faceBtns'>
        <template v-if='openOrderSelected.val === 1'>
            <button class='fbtn' @click="openOrder('buy')">
                买方向测试
            </button>
            <button class='fbtn' @click="openOrder('sell')">
                卖方向测试
            </button>
        </template>
        <template v-else-if='isModifyPosition'>
            <button class='fbtn' :disabled='loading' @click='handleUpdateOrder()'>
                修改
            </button>
        </template>
        <template v-else-if='isModifyPending'>
            <button class='fbtn' :disabled='loading' @click='handleUpdatePending()'>
                修改
            </button>
        </template>
        <template v-else>
            <button class='fbtn ' @click='openOrder()'>
                下单
            </button>
        </template>
    </div>
    <!-- 协助测试代码 end -->
    <!-- 底部下单按钮 -->
    <FooterBtn
        :disabled='footerBtnDisabled'
        :is-modify-status='!!$route.query.pendingId'
        :open-order-selected='openOrderSelected'
        :pending-price='pendingPrice'
        :stop-loss='stopLoss'
        :take-profit='takeProfit'
        @closeOrder='handleCloseOrder'
        @openOrder='openOrder'
        @updateOrder='handleUpdateOrder'
        @updatePending='handleUpdatePending'
    />

    <van-popup v-model:show='pendingVisible' :close-on-click-overlay='false' :overlay='false' :style="{ width: '100%', height: '100%',zIndex: 100 }">
        <Pending :data='orderParams' :product='product' @onHide='pendingVisible = false' />
    </van-popup>
    <van-popup v-model:show='successVisible' :close-on-click-overlay='false' :overlay='false' :style="{ width: '100%', height: '100%',zIndex: 100 }">
        <Success :data='resData' @onHide='onHide' />
    </van-popup>

    <Loading :show='loading' />
</template>

<script>
import top from '@m/layout/top'
import Price from '@m/components/price'
import { computed, onUnmounted, reactive, ref, toRefs, watch, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { QuoteSocket } from '@/plugins/socket/socket'
import { addMarketOrder, updateOrder, updatePboOrder } from '@/api/trade'
import { useRoute, useRouter } from 'vue-router'
import lightweightChart from './components/lightweightChart'
import OrderVolumn from './components/orderVolumn'
import PriceStepper from './components/priceStepper'
import TakeProfit from './components/takeProfitSet'
import FooterBtn from './components/footerBtn'
import SelectComp from './components/select'
import Pending from './pending'
import Success from './success'
import { minus, divide, getDecimalNum, mul, toFixed } from '@/utils/calculation'
import { Toast } from 'vant'
import { useI18n } from 'vue-i18n'
export default {
    components: {
        Pending,
        OrderVolumn,
        lightweightChart,
        PriceStepper,
        TakeProfit,
        Price,
        FooterBtn,
        top,
        SelectComp,
        Success
    },
    setup () {
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const { t } = useI18n({ useScope: 'global' })
        const chart = ref(null)
        const { symbolId, positionId, pendingId, orderId, takeProfit, stopLoss, isClosePosition, isModifyPosition, isModifyPending } = route.query
        const state = reactive({
            loading: false,
            disabled: !!positionId || !!pendingId,
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
            pendingPrice: '', // 挂单价
            stopLoss: stopLoss || '', // 止损单价
            takeProfit: takeProfit || '', // 止盈单价
            orderParams: {}, // 订单入参
            expireType: 1, // 挂单有效期过期类型 1.当日有效 2.当周有效
            expireTypeOptions: [
                {
                    id: 1,
                    label: t('trade.expire1'),
                }, {
                    id: 2,
                    label: t('trade.expire2'),
                }
            ],
            resData: {},
            timeId: ''
        })
        if (positionId) store.commit('_trade/Update_modifyPositionId', positionId)
        watch(
            () => state.pendingPrice,
            newval => store.commit('_trade/Update_pendingPrice', newval),
            { immediate: true }
        )
        onUnmounted(() => {
            store.commit('_trade/Update_pendingPrice', 0)
            store.commit('_trade/Update_modifyPositionId', 0)
        })

        state.openOrderSelected = state.openOrderList[0]

        // 当前产品
        const product = computed(() => store.getters.productActived)
        const positionList = computed(() => store.state._trade.positionList) // 持仓列表
        const pendingList = computed(() => store.state._trade.pendingList) // 挂单列表
        const profitLossRang = computed(() => store.getters['_trade/marketProfitLossRang'])
        const pendingPriceRang = computed(() => store.getters['_trade/pendingPriceRang'])
        const expireTypeItem = computed(() => state.expireTypeOptions.find(el => el.id === state.expireType))
        const curPosition = computed(() => store.state._trade.positionMap[positionId] || {}) // 当前持仓
        const volumnMin = computed(() => product.value.minVolume)
        const volumnMax = computed(() => {
            if (positionId) {
                return minus(curPosition.value.openVolume, curPosition.value.closeVolume || 0)
            } else {
                return product.value.maxVolume
            }
        })
        const footerBtnDisabled = computed(() => state.loading || state.volumn === '')

        // 止损价格变更
        watch(
            () => state.stopLoss,
            newval => {
                chart.value && newval && chart.value.stopLossLineUpdate({ price: newval * 1 })
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
            if (result) Toast(t('trade.invalidVolume1'))
            return result
        }

        // 点击下单、平仓按钮
        const openOrder = direct => {
            if (paramsInvalid()) return false
            let requestPrice = direct === 'sell' ? product.value.sell_price : product.value.buy_price
            let direction = direct === 'sell' ? 2 : 1
            let bizType = 1
            if (curPosition?.value?.direction) direction = curPosition.value.direction
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
            if (isClosePosition) bizType = 2
            if ([2, 4].includes(state.openOrderSelected.val)) {
                direction = 1
            } else if ([3, 5].includes(state.openOrderSelected.val)) {
                direction = 2
            }
            const p = Math.pow(10, product.value.price_digits)
            const params = {
                bizType, // 业务类型。0-默认初始值；1-市价开；2-市价平；3-止损平仓单；4-止盈平仓单；5-爆仓强平单；6-到期平仓单；7-销户平仓单；8-手动强平单；9-延时订单；10-限价预埋单；11-停损预埋单；
                direction, // 订单买卖方向。1-买；2-卖；
                positionId,
                symbolId: Number(product.value.symbol_id),
                requestTime: Date.now(),
                requestNum: state.volumn,
                requestPrice: mul(requestPrice, p),
                expireType: state.expireType,
                stopLoss: Number(state.stopLoss) ? mul(state.stopLoss, p) : undefined,
                takeProfit: Number(state.takeProfit) ? mul(state.takeProfit, p) : undefined
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
                    state.resData.bizType = bizType
                    state.timeId = setTimeout(() => {
                        state.successVisible = false
                        router.push({ name: 'Position' })
                    }, 5000)
                })
                .catch(err => {
                    state.loading = false
                })
        }

        // 点击修改订单
        const handleUpdateOrder = () => {
            if (takeProfit === state.takeProfit && stopLoss === state.stopLoss) {
                return Toast(t('trade.unModify'))
            }
            const p = Math.pow(10, product.value.price_digits)
            const params = {
                orderId: orderId,
                positionId: positionId,
                stopLoss: Number(state.stopLoss) ? mul(state.stopLoss, p) : 0,
                takeProfit: Number(state.takeProfit) ? mul(state.takeProfit, p) : 0
            }

            state.loading = true
            updateOrder(params).then(res => {
                state.loading = false
                if (res.check()) {
                    Toast(t('trade.modifySuccess'))
                    router.push({ name: 'Position' })
                }
            }).catch(err => {
                state.loading = false
                console.log(err)
            })
        }

        // 修改挂单
        const handleUpdatePending = () => {
            const p = Math.pow(10, product.value.price_digits)
            const params = {
                pboId: pendingId,
                stopLoss: Number(state.stopLoss),
                takeProfit: Number(state.takeProfit)
            }
            state.loading = true
            updatePboOrder(params).then(res => {
                state.loading = false
                if (res.invalid()) return false
                state.orderParams = params
                // state.pendingVisible = true
                state.successVisible = true
                state.resData = res.data
                state.resData.tradeVolume = state.volumn
                state.timeId = setTimeout(() => {
                    state.successVisible = false
                    router.push({ name: 'Position' })
                }, 5000)
            }).catch(err => {
                state.loading = false
            })
        }

        const onHide = () => {
            state.successVisible = false
            clearTimeout(state.timeId)
        }

        QuoteSocket.send_subscribe([symbolId]) // 订阅产品报价
        store.commit('_quote/Update_productActivedID', symbolId)

        // 查询某持仓详情
        function initPositionInfo () {
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
                    state.volumn = minus(curPosition.openVolume, curPosition.closeVolume || 0)
                })
        }

        // 查询某挂单详情
        function initPendingInfo () {
            Promise.resolve()
                .then(() => {
                    if (pendingList.value.length === 0) {
                        return store.dispatch('_trade/queryPBOOrderPage').then(res => {
                            return res.data
                        })
                    } else {
                        return Promise.resolve(pendingList.value)
                    }
                })
                .then(list => {
                    if (!list) return false
                    const curPending = list.find(el => el.id === pendingId)
                    if (!curPending) return
                    state.volumn = curPending.requestNum / curPending.contractSize
                    const digits = curPending.digits
                    state.pendingPrice = toFixed(curPending.requestPrice * Math.pow(0.1, digits), digits)
                    if (curPending.stopLoss) state.stopLoss = toFixed(curPending.stopLoss * Math.pow(0.1, digits), digits)
                    if (curPending.takeProfit) state.takeProfit = toFixed(curPending.takeProfit * Math.pow(0.1, digits), digits)
                    state.openOrderSelected = state.openOrderList[curPending.direction === 1 ? 1 : 2]
                })
        }

        // 选择订单类型
        const selectOpenOrder = item => {
            state.openOrderSelected = item
            if (item.val === 1) store.commit('_trade/Update_pendingPrice', 0)
        }
        // 平仓
        const handleCloseOrder = item => {
            openOrder()
        }

        // 组件销毁之前清除定时器
        onBeforeUnmount(() => {
            clearTimeout(state.timeId)
        })

        // 初始化设置
        const init = () => {
            // 设置默认手数
            if (product.value.minVolume) {
                state.volumn = product.value.minVolume
            } else {
                // 获取产品详情
                store.dispatch('_quote/querySymbolInfo', symbolId).then(res => {
                    if (res.invalid() || positionId || pendingId) return false
                    state.volumn = res.data.minVolume // 设置默认手数
                })
            }

            if (positionId) {
                initPositionInfo()
            } else if (pendingId) {
                initPendingInfo()
            }
        }
        init()

        return {
            ...toRefs(state),
            positionId,
            pendingId,
            orderId,
            minus,
            footerBtnDisabled,
            isClosePosition,
            isModifyPosition,
            isModifyPending,
            product,
            volumnMin,
            volumnMax,
            chart,
            openOrder,
            handleUpdateOrder,
            profitLossRang,
            pendingPriceRang,
            selectOpenOrder,
            expireTypeItem,
            handleUpdatePending,
            handleCloseOrder,
            onHide,
            curPosition,
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
.faceBtns {
    display: flex;
    .fbtn {
        flex: 1;
        height: 40px;
        line-height: 40px;
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
.pendingPrice {
    :deep(.inputEl) {
        flex: 1;
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
.expireTypeTitle {
    position: relative;
    padding: rem(15px) rem(35px) rem(5px);
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
</style>

<template>
    <div v-if='$route.query.positionId' class='footerBtn'>
        <div class='col'>
            <button class='btn' :disabled='loading' @click='modifyOrder'>
                修改
            </button>
        </div>
    </div>
    <div v-else-if='openOrderSelected.val === 1' class='footerBtn line'>
        <div class='col'>
            <button class='btn sellColor' :disabled='loading || sellDisabled' @click="openOrder('sell')">
                SELL
            </button>
        </div>
        <div class='col'>
            <button class='btn buyColor' :disabled='loading || buyDisabled' @click="openOrder('buy')">
                BUY
            </button>
        </div>
    </div>
    <div v-else class='footerBtn'>
        <div class='col'>
            <button v-if='[2, 4].includes(openOrderSelected.val)' class='btn buyColor' :disabled='loading || buyDisabled' @click='openOrder()'>
                下单
            </button>
            <button v-else-if='[3, 5].includes(openOrderSelected.val)' class='btn sellColor' :disabled='loading || sellDisabled' @click='openOrder()'>
                下单
            </button>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
export default {
    props: ['loading', 'openOrderSelected', 'pendingPrice', 'stopLoss', 'takeProfit'],
    emits: ['openOrder'],
    setup (props, { emit }) {
        const store = useStore()
        const profitLossRang = computed(() => store.getters['_trade/marketProfitLossRang'])
        const pendingPriceRang = computed(() => store.getters['_trade/pendingPriceRang'])
        // 是否符合买入的止盈止损范围
        const buyDisabled = computed(() => {
            let { stopLoss, takeProfit, pendingPrice, openOrderSelected } = props
            const [buyProfitMin, buyProfitMax] = profitLossRang.value.buyProfitRange
            const [buyStopLossMin, buyStopLossMax] = profitLossRang.value.buyStopLossRange
            const [buyLimitMin, buyLimitMax] = pendingPriceRang.value.buyLimitRange
            const [buyStopMin, buyStopMax] = pendingPriceRang.value.buyStopRange
            const openOrderVal = openOrderSelected.val
            pendingPrice = Number(pendingPrice)
            stopLoss = Number(stopLoss)
            takeProfit = Number(takeProfit)

            console.log('买入止盈最小，最大', buyProfitMin, buyProfitMax)
            console.log('买入止损最小，最大', buyStopLossMin, buyStopLossMax)
            if (stopLoss > 0 && (stopLoss < buyStopLossMin || stopLoss > buyStopLossMax)) {
                return true
            } else if (takeProfit > 0 && (takeProfit < buyProfitMin || takeProfit > buyProfitMax)) {
                return true
            } else if (openOrderVal === 2 && (!buyLimitMax || pendingPrice < buyLimitMin || pendingPrice > buyLimitMax)) {
                return true
            } else if (openOrderVal === 4 && (!buyStopMax || pendingPrice < buyStopMin || pendingPrice > buyStopMax)) {
                return true
            } else {
                return false
            }
        })
        // 是否符合卖出的止盈止损范围
        const sellDisabled = computed(() => {
            let { stopLoss, takeProfit, pendingPrice, openOrderSelected } = props

            const [sellProfitMin, sellProfitMax] = profitLossRang.value.sellProfitRange
            const [sellStopLossMin, sellStopLossMax] = profitLossRang.value.sellStopLossRange
            const [sellLimitMin, sellLimitMax] = pendingPriceRang.value.sellLimitRange
            const [sellStopMin, sellStopMax] = pendingPriceRang.value.sellStopRange
            const openOrderVal = openOrderSelected.val
            console.log('卖出止盈最小，最大', sellProfitMin, sellProfitMax)
            console.log('卖出止损最小，最大', sellStopLossMin, sellStopLossMax)
            pendingPrice = Number(pendingPrice)
            stopLoss = Number(stopLoss)
            takeProfit = Number(takeProfit)

            if (stopLoss > 0 && (stopLoss < sellStopLossMin || stopLoss > sellStopLossMax)) {
                return true
            } else if (takeProfit > 0 && (takeProfit < sellProfitMin || takeProfit > sellProfitMax)) {
                return true
            } else if (openOrderVal === 3 && (!sellLimitMax || pendingPrice < sellLimitMin || pendingPrice > sellLimitMax)) {
                return true
            } else if (openOrderVal === 5 && (!sellStopMax || pendingPrice < sellStopMin || pendingPrice > sellStopMax)) {
                return true
            } else {
                return false
            }
        })

        // 下单操作
        const openOrder = param => {
            emit('openOrder', param)
        }
        const modifyOrder = () => {
            console.log('modifyOrder')
        }
        return {
            buyDisabled,
            sellDisabled,
            openOrder,
            modifyOrder
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.footerBtn {
    position: relative;
    display: flex;
    width: 100%;
    height: rem(100px);
    border-top: 1px solid var(--btnLine);
    &.line::before {
        position: absolute;
        top: 20%;
        bottom: 20%;
        left: 50%;
        width: 1px;
        background: var(--btnLine);
        content: '';
    }
    .col {
        flex: 1;
    }
    .btn {
        @include active();
        width: 100%;
        height: rem(100px);
        font-weight: bold;
        font-size: rem(28px);
        line-height: 1;
        text-align: center;
        background: var(--btnColor);
        &:disabled {
            opacity: 0.4;
        }
    }
}
</style>

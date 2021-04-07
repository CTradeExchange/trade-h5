<template>
    <div v-if="product" class="orderWrap">
        <top back :menu="false" :sub-title="product.symbolCode" :title="product.symbolName" />
        <!-- 订单类型 -->
        <div class="cell openType">
            <p class="title" @click="dropdownWrap = !dropdownWrap">
                即时执行
            </p>
            <div v-show="dropdownWrap" class="dropdownWrap" @click="dropdownWrap = false">
                <a class="item of-1px-bottom" href="javascript:;">
                    即时执行
                </a>
                <a class="item of-1px-bottom" href="javascript:;">
                    买入限价
                </a>
                <a class="item of-1px-bottom" href="javascript:;">
                    卖出限价
                </a>
                <a class="item of-1px-bottom" href="javascript:;">
                    买入止损
                </a>
                <a class="item of-1px-bottom" href="javascript:;">
                    卖出止损
                </a>
            </div>
        </div>

        <!-- 订单手数 -->
        <div class="cell">
            <OrderVolumn v-model="volumn" :product="product" :disabled="disabled" />
        </div>

        <!-- 买卖价格 -->
        <div class="cell priceCell">
            <div class="col fallColor">
                <Price :price="product.sell_price" :mode="2" :point-ratio="product.pointRatio" :digit="product.price_digits" />
            </div>
            <div class="col riseColor">
                <Price :price="product.buy_price" :mode="2" :point-ratio="product.pointRatio" :digit="product.price_digits" />
            </div>
        </div>
        {{ marketProfitLossRang }}
        <!-- 价格设置 -->
        <div class="cell priceSet">
            <div class="col">
                {{ stopLoss }}
                <PriceStepper v-model="stopLoss" :product="product"></PriceStepper>
            </div>
            <div class="col">
                <van-stepper v-model="takeProfit" class="priceStepper" :decimal-length="3" :step="product.volumeStep" :min="0" />
            </div>
        </div>

        <!-- 图表 -->
        <div class="chart">
            这里是图表
        </div>

        <!-- 底部下单按钮 -->
        <div class="footerBtn">
            <div class="col">
                <button class="btn sellColor" :disabled="loading" @click="openOrder('sell')">
                    SELL
                </button>
            </div>
            <div class="col">
                <button class="btn buyColor" :disabled="loading" @click="openOrder('buy')">
                    BUY
                </button>
            </div>
        </div>
    </div>
    <van-popup v-model:show="pendingVisible" :close-on-click-overlay="false" :style="{ width: '100%', height: '100%' }">
        <Pending @onHide="pendingVisible = false" />
    </van-popup>
</template>

<script>
import top from '@m/layout/top'
import Price from '@m/components/price'
import { computed, reactive, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
import { QuoteSocket } from '@/plugins/socket/socket'
import { addMarketOrder } from '@/api/trade'
import { useRoute, useRouter } from 'vue-router'
import OrderVolumn from './components/orderVolumn'
import PriceStepper from './components/priceStepper'
import Pending from './pending'
import { minus } from '@/utils/calculation'
export default {
    components: {
        Pending,
        OrderVolumn,
        PriceStepper,
        Price,
        top
    },
    setup() {
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const { symbolId, positionId } = route.query
        const state = reactive({
            loading: false,
            disabled: positionId,
            pendingVisible: false,
            dropdownWrap: false,
            volumn: 0.01,
            value: 3,
            stopLoss: 0, // 止损单价
            takeProfit: 0, // 止盈单价
            value2: '',
            option1: [
                { text: '全部商品', value: 0 },
                { text: '新款商品', value: 1 },
                { text: '活动商品', value: 2 }
            ]
        })

        // 当前产品
        const product = computed(() => store.getters.productActived)
        const positionList = computed(() => store.state._trade.positionList)
        const marketProfitLossRang = computed(() => store.getters['_trade/marketProfitLossRang'])
        watch(
            () => product.value.minVolume,
            newval => (state.volumn = newval)
        )
        if (!product.value) router.replace('/')
        // 点击下单按钮
        const openOrder = direction => {
            const requestPrice = direction === 'sell' ? product.value.sell_price : product.value.buy_price
            const params = {
                bizType: 1, // 业务类型。0-默认初始值；1-市价开；2-市价平；3-止损平仓单；4-止盈平仓单；5-爆仓强平单；6-到期平仓单；7-销户平仓单；8-手动强平单；9-延时订单；10-限价预埋单；11-停损预埋单；
                direction: direction === 'sell' ? 2 : 1, // 订单买卖方向。1-买；2-卖；
                symbolId: Number(product.value.symbol_id),
                requestTime: Date.now(),
                requestNum: state.volumn * product.value.contractSize,
                requestPrice: Number(requestPrice),
                stopLoss: Number(state.stopLoss) || undefined,
                takeProfit: Number(state.takeProfit) || undefined
            }
            state.loading = true
            addMarketOrder(params)
                .then(res => {
                    state.loading = false
                    if (res.invalid()) return false
                    state.pendingVisible = true
                })
                .catch(err => {
                    state.loading = false
                })
        }

        QuoteSocket.send_subscribe([symbolId]) // 订阅产品报价
        store.dispatch('_quote/querySymbolInfo', symbolId) // 获取产品详情
        store.commit('_quote/Update_productActivedID', symbolId)

        initPositionInfo()
        function initPositionInfo() {
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

        return {
            ...toRefs(state),
            product,
            openOrder,
            marketProfitLossRang
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.orderWrap {
    position: relative;
    height: 100%;
    padding-bottom: rem(100px);
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
        padding: rem(15px) 0 rem(5px);
        font-size: rem(28px);
    }
    .dropdownWrap {
        position: absolute;
        top: 100%;
        left: 0;
        z-index: 1;
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
        &:first-of-type {
            margin-right: rem(40px);
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
.footerBtn {
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    width: 100%;
    &::before {
        position: absolute;
        top: 20%;
        bottom: 20%;
        left: 50%;
        width: 1px;
        background: rgba(0, 0, 0, 0.15);
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
    }
}
</style>

<template>
    <div class='orderWrap'>
        <layoutTop>
            <div v-if='product' class='productTopInfo'>
                <p class='productName'>
                    {{ product.symbolName }}
                </p>
                <p class='short_name'>
                    {{ product.symbolCode }}
                </p>
            </div>
            <template #left>
                <span></span>
            </template>
            <template #right>
                <a href='javascript:;' @click='$router.back()'>
                    <i class='icon_icon_close_big'></i>
                </a>
            </template>
        </layoutTop>

        <div class='main'>
            <!-- 方向 -->
            <Direction v-model='direction' class='cellMarginTop' :product='product' />
            <!-- 订单类型 -->
            <CellType v-model='orderType' :btn-list='orderTypeList' class='cellMarginTop' :title="$t('trade.orderType')" @selected='changeOrderType' />
            <!-- 挂单设置 -->
            <PendingBar
                v-if='orderType===2'
                ref='pendingRef'
                v-model='pendingPrice'
                class='cellMarginTop'
                :direction='direction'
                :product='product'
            />
            <!-- 手数 -->
            <OrderVolume v-if='product' v-model='volume' class='cellMarginTop' :product='product' />
            <!-- 止盈止损 -->
            <ProfitlossSet
                v-if='product'
                v-model:stopLoss='stopLoss'
                v-model:stopProfit='stopProfit'
                class='cellMarginTop'
                :direction='direction'
                :product='product'
            />
            <!-- 过期类型 -->
            <CellType
                v-if='orderType===2'
                v-model='expireType'
                :btn-list='expireTypeList'
                class='mtop10'
                :title="$t('trade.expireTime')"
            />
        </div>
        <div class='footerBtn'>
            <van-button block :color='$style.primary' size='normal' @click='submitHandler'>
                {{ $t(direction==='buy'?'trade.buy':'trade.sell') + $t("submit") }}
            </van-button>
        </div>
    </div>
</template>

<script>
import { reactive, toRefs, computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { gt, lt, mul } from '@/utils/calculation'
import { QuoteSocket } from '@/plugins/socket/socket'
import Direction from './components/direction'
import OrderVolume from './components/orderVolume'
import ProfitlossSet from './components/profitLossSet'
import PendingBar from './components/pendingBar'
import CellType from '@c/components/cellType'
import { addMarketOrder } from '@/api/trade'
import { Toast } from 'vant'
export default {
    components: {
        Direction,
        CellType,
        OrderVolume,
        ProfitlossSet,
        PendingBar,
    },
    setup () {
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const { t } = useI18n({ useScope: 'global' })
        const { symbolId, direction } = route.query
        const state = reactive({
            loading: false,
            direction: direction,
            orderType: 1, // 订单类型
            orderTypeList: [{
                title: t('trade.marketPrice'),
                val: 1
            }, {
                title: t('trade.pending'),
                val: 2
            }],
            volume: 0.01,
            pendingPrice: '',
            stopLoss: '',
            stopProfit: '',
            expireType: 1,
            expireTypeList: [{
                title: t('trade.expireType2'),
                val: 2
            }, {
                title: t('trade.expireType1'),
                val: 1
            }],
        })
        const pendingRef = ref(null)
        const profitLossRef = ref(null)
        const pendingWarn = computed(() => pendingRef.value?.warn)
        const profitLossWarn = computed(() => profitLossRef.value?.stopLossWarn || profitLossRef.value?.stopProfitWarn)
        QuoteSocket.send_subscribe([symbolId]) // 订阅产品报价
        store.commit('_quote/Update_productActivedID', symbolId)
        store.commit('_trade/Update_modifyPositionId', 0)
        const product = computed(() => store.getters.productActived)
        // 切换订单类型
        const changeOrderType = (val) => {
            store.commit('_trade/Update_pendingEnable', val === 2)
        }
        // 初始化设置
        const init = () => {
            if (product.value.minVolume) {
                state.volume = product.value.minVolume
            } else {
                // 获取产品详情
                store.dispatch('_quote/querySymbolInfo', symbolId).then(res => {
                    if (res.invalid()) return false
                    state.volume = res.data.minVolume // 设置默认手数
                })
            }
        }

        // 验证下单数据是否异常
        const paramsInvalid = () => {
            if (state.orderType === 2 && !state.pendingPrice) return Toast(t('trade.inputPendingPrice'))
            return pendingWarn.value || profitLossWarn.value
        }

        // 点击提交按钮
        const submitHandler = () => {
            if (paramsInvalid()) return
            let requestPrice = state.direction === 'sell' ? product.value.sell_price : product.value.buy_price
            const direction = state.direction === 'sell' ? 2 : 1
            let bizType = 1
            if (state.orderType === 2) {
                requestPrice = state.pendingPrice
                if (state.direction === 'buy') {
                    bizType = lt(requestPrice, product.value.buy_price) ? 10 : 11
                } else {
                    bizType = gt(requestPrice, product.value.sell_price) ? 10 : 11
                }
            }
            const p = Math.pow(10, product.value.price_digits)
            const params = {
                bizType, // 业务类型。0-默认初始值；1-市价开；2-市价平；3-止损平仓单；4-止盈平仓单；5-爆仓强平单；6-到期平仓单；7-销户平仓单；8-手动强平单；9-延时订单；10-限价预埋单；11-停损预埋单；
                direction, // 订单买卖方向。1-买；2-卖；
                symbolId: Number(product.value.symbol_id),
                requestTime: Date.now(),
                requestNum: state.volume,
                requestPrice: mul(requestPrice, p),
                expireType: state.expireType,
                stopLoss: state.stopLoss ? mul(state.stopLoss, p) : undefined,
                takeProfit: state.stopProfit ? mul(state.stopProfit, p) : undefined
            }

            state.loading = true
            addMarketOrder(params)
                .then(res => {
                    state.loading = false
                    if (res.invalid()) return false
                    const data = res.data
                    const localData = Object.assign({}, params, data)
                    const orderId = data.orderId || data.id
                    sessionStorage.setItem('order_' + orderId, JSON.stringify(localData))
                    router.push({ name: 'OrderSuccess', query: { orderId } })
                })
                .catch(err => {
                    state.loading = false
                })
        }

        init()
        return {
            ...toRefs(state),
            pendingRef,
            profitLossRef,
            pendingWarn,
            profitLossWarn,
            product,
            changeOrderType,
            submitHandler,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.productTopInfo {
    font-size: rem(34px);
    line-height: 1;
    .short_name {
        margin-top: rem(8px);
        color: var(--minorColor);
        font-size: rem(20px);
    }
    .productName {
        @include single-line-clamp();
    }
}
.icon_icon_close_big {
    color: var(--color);
}
.orderWrap {
    position: relative;
    display: flex;
    flex: 1;
    margin-top: rem(90px);
    overflow-y: auto;
    color: var(--color);
    background: var(--bgColor);
    .main {
        @include scroll();
        flex: 1;
        margin-bottom: rem(90px);
        padding: 0 20px;
        overflow: auto;
        background: var(--contentColor);
    }
}
.cellMarginTop {
    margin-top: rem(40px);
}
.typeMarginTop {
    margin-top: rem(10px);
    overflow: hidden;
}
.footerBtn {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
}
</style>

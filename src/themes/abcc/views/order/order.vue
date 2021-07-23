<template>
    <div class='orderWrap'>
        <layoutTop>
            <div v-if='product' class='productTopInfo'>
                <p class='productName' @click='switchProductVisible=true'>
                    {{ product.symbolName }}
                    <span class='icon_icon_arrow'></span>
                </p>
            </div>
        </layoutTop>

        <div class='main'>
            <!-- 订单类型 -->
            <OrderTypeTab v-model='orderType' :btn-list='orderTypeList' @selected='changeOrderType' />
            <!-- 方向 -->
            <Direction v-model='direction' class='cellMarginTop' :product='product' />
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
            <!-- 订单金额 -->
            <Assets v-model:operation-type='operationType' :direction='direction' :product='product' :volume='volume' />
        </div>
        <div class='footerBtn' :class='[direction]'>
            <van-button block :loading='loading' size='normal' @click='submitHandler'>
                {{ $t(direction==='buy'?'trade.buy':'trade.sell') + $t("submit") }}
            </van-button>
        </div>

        <!-- 选择产品弹窗 -->
        <SwitchProduct v-model='switchProductVisible' />
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
import PendingBar from './components/pendingBar'
import OrderTypeTab from './components/orderType.vue'
import Assets from './components/assets.vue'
import SwitchProduct from './components/switchProduct.vue'
import { addMarketOrder } from '@/api/trade'
import { Toast } from 'vant'
export default {
    components: {
        Direction,
        OrderVolume,
        OrderTypeTab,
        SwitchProduct,
        Assets,
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
            switchProductVisible: false,
            direction: direction,
            orderType: 1, // 订单类型
            orderTypeList: [{
                title: t('trade.marketPrice'),
                val: 1
            }, {
                title: t('trade.pending'),
                val: 2
            }],
            volume: '',
            operationType: 2, // 操作类型。1-普通；2-自动借款；3-自动还款
            pendingPrice: '',
        })
        const pendingRef = ref(null)
        const profitLossRef = ref(null)
        const pendingWarn = computed(() => pendingRef.value?.warn)
        const account = computed(() => store.state._user.account)
        const profitLossWarn = computed(() => profitLossRef.value?.stopLossWarn || profitLossRef.value?.stopProfitWarn)
        QuoteSocket.send_subscribe([symbolId]) // 订阅产品报价
        store.dispatch('_user/queryAccountAssetsInfo')
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
            else if (state.orderType === 2 && isNaN(state.pendingPrice)) return Toast(t('trade.pendingPriceError'))
            else if (!state.volume) return Toast(t('trade.inputVolume'))
            else if (isNaN(state.volume)) return Toast(t('trade.volumeError'))
            return pendingWarn.value || profitLossWarn.value
        }

        // 点击提交按钮
        const submitHandler = () => {
            if (paramsInvalid()) return
            let requestPrice = state.direction === 'sell' ? product.value.sell_price : product.value.buy_price
            const direction = state.direction === 'sell' ? 2 : 1
            if (state.orderType === 2) {
                requestPrice = state.pendingPrice
            }
            const p = Math.pow(10, product.value.price_digits)
            const params = {
                bizType: state.orderType, // 业务类型。1-市价开；2-限价开
                direction, // 订单买卖方向。1-买；2-卖；
                symbolId: Number(product.value.symbol_id),
                accountCurrency: account.value.currency,
                accountId: account.value.accountId,
                requestTime: Date.now(),
                requestNum: state.volume,
                operationType: state.operationType,
                expireType: 1,
                requestPrice: mul(requestPrice, p),
            }
            console.log(params)
            if (state.loading) return false
            state.loading = true
            addMarketOrder(params)
                .then(res => {
                    state.loading = false
                    if (res.invalid()) return false
                    const data = res.data
                    const localData = Object.assign({}, params, data)
                    const orderId = data.orderId || data.id
                    sessionStorage.setItem('order_' + orderId, JSON.stringify(localData))
                    // router.push({ name: 'OrderSuccess', query: { orderId } })
                    Toast({
                        message: t('trade.orderSuccessToast'),
                        duration: 1000,
                        forbidClick: true,
                    })
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
    .icon_icon_arrow {
        margin-left: rem(5px);
        font-size: rem(24px);
        vertical-align: 2px;
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
        //margin-bottom: rem(90px);
        padding: 0 rem(40px) rem(100px) rem(40px);
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
    &.buy {
        .van-button {
            color: #FFF;
            background: var(--riseColor);
            border-color: var(--riseColor);
        }
    }
    &.sell {
        .van-button {
            color: #FFF;
            background: var(--fallColor);
            border-color: var(--fallColor);
        }
    }
}
</style>

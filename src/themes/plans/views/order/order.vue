<template>
    <div class='orderWrap'>
        <SwitchTradeType />

        <div class='main'>
            <!-- 订单类型 -->
            <OrderTypeTab v-model='orderType' :btn-list='orderTypeList' @selected='changeOrderType' />
            <!-- 方向 -->
            <Direction v-model='direction' class='cellMarginTop' :product='product' />
            <!-- 挂单设置 -->
            <PendingBar
                v-if='product && product.tradeType===3 && orderType===10'
                ref='pendingRef'
                v-model='pendingPrice'
                class='cellMarginTop'
                :direction='direction'
                :product='product'
            />
            <PendingBarCFD
                v-else-if='orderType===10'
                ref='pendingRef'
                v-model='pendingPrice'
                class='cellMarginTop'
                :direction='direction'
                :product='product'
            />
            <!-- 手数 -->
            <OrderVolume v-if='product' v-model='volume' class='cellMarginTop' :product='product' />
            <!-- 订单金额 -->
            <Assets
                v-if='account && product && product.tradeType===3'
                v-model:operation-type='operationType'
                :account='account'
                :direction='direction'
                :product='product'
                :volume='volume'
            />
            <!-- 止盈止损 -->
            <ProfitlossSet
                v-if='product'
                v-model:stopLoss='stopLoss'
                v-model:stopProfit='stopProfit'
                class='cellMarginTop'
                :direction='direction'
                :product='product'
            />
        </div>
        <div class='footerBtn' :class='[direction]'>
            <van-button block :loading='loading' size='normal' @click='submitHandler'>
                {{ $t(direction==='buy'?'trade.buyText':'trade.sellText') }}
            </van-button>
        </div>
        <!-- 委托列表 -->
        <Trust
            v-if='product'
            class='cellMarginTop'
            :direction='direction'
            :product='product'
        />

        <!-- 选择产品弹窗 -->
        <SwitchProduct v-model='switchProductVisible' />
    </div>
</template>

<script>
import { reactive, toRefs, computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { gt, lt, mul } from '@/utils/calculation'
import { QuoteSocket } from '@/plugins/socket/socket'
import SwitchTradeType from './components/switchTradeType'
import Direction from './components/direction'
import OrderVolume from './components/orderVolume'
import ProfitlossSet from './components/profitLossSet'
import PendingBar from './components/pendingBar'
import PendingBarCFD from './components/pendingBar_CFD'
import OrderTypeTab from './components/orderType.vue'
import Assets from './components/assets.vue'
import Trust from './components/trust.vue'
import SwitchProduct from './components/switchProduct.vue'
import { addMarketOrder } from '@/api/trade'
import { Toast } from 'vant'
export default {
    components: {
        Direction,
        OrderVolume,
        OrderTypeTab,
        SwitchTradeType,
        ProfitlossSet,
        SwitchProduct,
        Assets,
        Trust,
        PendingBar,
        PendingBarCFD,
    },
    setup () {
        const store = useStore()
        const route = useRoute()
        const { t } = useI18n({ useScope: 'global' })
        const { symbolId, direction, tradeType } = route.query
        if (symbolId && tradeType) store.commit('_quote/Update_productActivedID', `${symbolId}_${tradeType}`)
        const symbolKey = computed(() => store.state._quote.productActivedID)
        const state = reactive({
            loading: false,
            switchProductVisible: false,
            direction: direction || 'buy',
            orderType: 1, // 订单类型
            orderTypeList: [{
                title: t('trade.marketPrice'),
                val: 1
            }, {
                title: t('trade.pending'),
                val: 10
            }],
            volume: '',
            operationType: 2, // 操作类型。1-普通；2-自动借款；3-自动还款
            pendingPrice: '',
            stopLoss: '',
            stopProfit: '',
        })
        const pendingRef = ref(null)
        const profitLossRef = ref(null)
        const pendingWarn = computed(() => pendingRef.value?.warn)
        const product = computed(() => store.getters.productActived)
        const customerInfo = computed(() => store.state._user.customerInfo)
        const account = computed(() => {
            let account = ''
            const accountList = customerInfo.value?.accountList || []
            const productTradeType = parseInt(product.value?.tradeType)
            if ([1, 2].includes(productTradeType)) {
                account = accountList.find(el => el.tradeType === productTradeType)
            } else {
                const outCurrency = product.value[state.direction === 'buy' ? 'profitCurrency' : 'baseCurrency']
                account = customerInfo?.value?.accountMap[outCurrency]
            }
            return account
        })
        const bizType = computed(() => {
            let bizType = state.orderType
            if (bizType === 10 && [1, 2].includes(product.value?.tradeType)) {
                const requestPrice = state.pendingPrice
                if (state.direction === 'buy') {
                    bizType = lt(requestPrice, product.value.buy_price) ? 10 : 11
                } else {
                    bizType = gt(requestPrice, product.value.sell_price) ? 10 : 11
                }
            }
            return bizType
        })
        const profitLossWarn = computed(() => profitLossRef.value?.stopLossWarn || profitLossRef.value?.stopProfitWarn)
        QuoteSocket.send_subscribe([symbolKey.value]) // 订阅产品报价

        store.commit('_trade/Update_modifyPositionId', 0)

        // 获取账户信息
        const queryAccountInfo = () => {
            const currency = state.direction === 'buy' ? product.value?.profitCurrency : product.value?.baseCurrency
            const curAccount = customerInfo.value.accountList.find(el => el.currency === currency)
            if (curAccount)store.dispatch('_user/queryAccountAssetsInfo', { accountId: curAccount.accountId, tradeType: store.state._base.tradeType })
            else Toast(t('trade.nullAssets'))
        }

        // 买入卖出方向变化时重新获取资产信息
        watch(
            () => state.direction,
            () => {
                if (product.value?.tradeType === 3) queryAccountInfo()
            },
        )

        // 切换订单类型
        const changeOrderType = (val) => {
            store.commit('_trade/Update_pendingEnable', val === 10)
        }
        // 初始化设置
        const init = () => {
            new Promise(resolve => {
                if (product.value.minVolume) {
                    state.volume = product.value.minVolume
                    resolve()
                } else {
                    // 获取产品详情
                    const [symbolId, tradeType] = symbolKey.value.split('_')
                    store.dispatch('_quote/querySymbolInfo', { symbolId, tradeType }).then(res => {
                        if (res.invalid()) return false
                        state.volume = res.data.minVolume // 设置默认手数
                        resolve()
                    })
                }
            }).then(() => {
                if (product.value?.tradeType === 3) queryAccountInfo()
            })
        }

        // 验证下单数据是否异常
        const paramsInvalid = () => {
            if (state.orderType === 10 && !state.pendingPrice) return Toast(t('trade.inputPendingPrice'))
            else if (state.orderType === 10 && isNaN(state.pendingPrice)) return Toast(t('trade.pendingPriceError'))
            else if (!state.volume) return Toast(t('trade.inputVolume'))
            else if (isNaN(state.volume)) return Toast(t('trade.volumeError'))
            else if (product.value?.tradeType === 3 && !account.value) return Toast(t('trade.nullAssets'))
            return pendingWarn.value || profitLossWarn.value
        }

        // 下单参数
        const orderParams = () => {
            if (paramsInvalid()) return null
            let requestPrice = state.direction === 'sell' ? product.value.sell_price : product.value.buy_price
            const direction = state.direction === 'sell' ? 2 : 1
            if (state.orderType === 10) {
                requestPrice = state.pendingPrice
            }
            const p = Math.pow(10, product.value.price_digits)
            const params = {
                bizType: bizType.value, // 业务类型。1-市价开；2-限价开
                direction, // 订单买卖方向。1-买；2-卖；
                symbolId: Number(product.value.symbol_id),
                accountCurrency: account.value.currency,
                accountId: account.value.accountId,
                requestTime: Date.now(),
                requestNum: Number(state.volume),
                operationType: state.operationType,
                requestPrice: mul(requestPrice, p),
                accountDigits: account.value.digits,
                tradeType: tradeType,
            }
            return params
        }

        // 点击提交按钮
        const submitHandler = () => {
            const params = orderParams()
            if (!params) return
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
                    store.dispatch('_trade/queryPBOOrderPage')
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
            account,
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
    height: 100%;
    padding-bottom: rem(100px);
    overflow-y: auto;
    color: var(--color);
    background: var(--bgColor);
    .main {
        @include scroll();
        flex: 1;
        //margin-bottom: rem(90px);
        padding: 0 rem(40px) rem(70px) rem(40px);
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
    width: 100%;
    padding: rem(30px);
    background: var(--contentColor);
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

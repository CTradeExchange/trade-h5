<template>
    <div class='trade-header'>
        <!-- 订单类型 -->
        <OrderTypeTab v-model='orderType' :trade-type='product.tradeType' @selected='changeOrderType' />
        <div v-if='[1,2].includes(product.tradeType)' class='switch'>
            <span>{{ $t('trade.tackStopSetup') }}</span>
            <van-switch
                v-model='enabled'
                :active-color='$style.success'
                size='20'
            />
        </div>
    </div>

    <LoanBar v-if='[3, 9].includes(product.tradeType)' v-model='operationType' :account='account' class='loanBarMargin' :product='product' />

    <div class='trade-wrap'>
        <div class='buy-wrap'>
            <!-- 挂单设置 -->
            <div v-if='[3, 5, 9].includes(product.tradeType) && orderType===10' class='form-item'>
                <PendingBar
                    ref='pendingRef'
                    v-model='buy.pendingPrice'
                    class='cellMarginTop'
                    direction='buy'
                    :product='product'
                />
            </div>
            <div v-else-if='orderType===10' class='form-item'>
                <PendingBarCFD
                    ref='pendingRef'
                    v-model='buy.pendingPrice'
                    class='cellMarginTop'
                    direction='buy'
                    :product='product'
                />
            </div>
            <div v-else class='form-item disable'>
                <label for=''>
                    {{ $t('trade.buyPrice') }}  &nbsp;&nbsp;
                    <span class='minor'>
                        {{ $t('trade.bestPriceBuy') }}
                    </span>
                </label>
            </div>

            <div class='form-item'>
                <OrderVolume
                    v-model='buy.volume'
                    v-model:entryType='buy.entryType'
                    :account='account'
                    class='cellMarginTop'
                    direction='buy'
                    :product='product'
                />
            </div>

            <!-- 止盈止损 -->
            <ProfitlossSet
                v-if=' [1,2].includes(product.tradeType)'
                v-model:stopLoss='buy.stopLoss'
                v-model:stopProfit='buy.stopProfit'
                class='cellMarginTop'
                direction='buy'
                :enabled='enabled'
                :product='product'
            />

            <!-- 过期类型 -->
            <CellExpireType
                v-if='orderType===10 && [1,2].includes(product.tradeType)'
                v-model='buy.expireType'
                :btn-list='expireTypeList'
                class='mtop20'
                :title="$t('trade.expireTime')"
            />

            <!-- 订单金额 -->
            <Assets
                v-if='account'
                :account='account'
                direction='buy'
                :product='product'
                :volume='buy.volume'
            />
            <div v-if='customerInfo' class='footerBtn buy'>
                <van-button block :disabled='buy.loading' :loading='buy.loading' size='normal' @click='submitHandler("buy")'>
                    {{ $t('trade.buyText') }}
                </van-button>
            </div>
            <div v-else class='login-bar'>
                <router-link to='login'>
                    {{ $t('c.login') }}
                </router-link> {{ $t('c.or') }}
                <router-link to='register'>
                    {{ $t('c.register') }}
                </router-link>
            </div>
        </div>
        <div class='sell-wrap'>
            <!-- 挂单设置 -->
            <div v-if='[3, 5, 9].includes(product.tradeType) && orderType===10' class='form-item'>
                <PendingBar
                    v-if='[3, 5, 9].includes(product.tradeType) && orderType===10'
                    ref='pendingRef'
                    v-model='sell.pendingPrice'
                    class='cellMarginTop'
                    direction='buy'
                    :product='product'
                />
            </div>
            <div v-else-if='orderType===10' class='form-item'>
                <PendingBarCFD
                    ref='pendingRef'
                    v-model='sell.pendingPrice'
                    class='cellMarginTop'
                    direction='sell'
                    :product='product'
                />
            </div>
            <div v-else class='form-item disable'>
                <label for=''>
                    {{ $t('trade.sellPrice') }} &nbsp;&nbsp;
                    <span class='minor'>
                        {{ $t('trade.bestPriceSell') }}
                    </span>
                </label>
            </div>

            <div class='form-item'>
                <OrderVolume
                    v-model='sell.volume'
                    v-model:entryType='sell.entryType'
                    :account='account'
                    class='cellMarginTop'
                    direction='sell'
                    :product='product'
                />
            </div>

            <!-- 止盈止损 -->
            <ProfitlossSet
                v-if=' [1,2].includes(product.tradeType)'
                v-model:stopLoss='sell.stopLoss'
                v-model:stopProfit='sell.stopProfit'
                class='cellMarginTop'
                direction='sell'
                :enabled='enabled'
                :product='product'
            />

            <!-- 过期类型 -->
            <CellExpireType
                v-if='orderType===10 && [1,2].includes(product.tradeType)'
                v-model='sell.expireType'
                :btn-list='expireTypeList'
                class='mtop20'
                :title="$t('trade.expireTime')"
            />

            <!-- 可用余额 -->
            <Assets
                v-if='account'
                :account='account'
                direction='sell'
                :product='product'
                :volume='sell.volume'
            />

            <div v-if='customerInfo' class='footerBtn sell'>
                <van-button block :disabled='sell.loading' :loading='sell.loading' size='normal' @click='submitHandler("sell")'>
                    {{ $t('trade.sellText') }}
                </van-button>
            </div>
            <div v-else class='login-bar'>
                <router-link to='login'>
                    {{ $t('c.login') }}
                </router-link> {{ $t('c.or') }}
                <router-link to='register'>
                    {{ $t('c.register') }}
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import { reactive, toRefs, computed, ref, watch, onUnmounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { Toast } from 'vant'
import { useRoute, useRouter } from 'vue-router'
import { delayAwaitTime, isEmpty } from '@/utils/util'
import { addMarketOrder } from '@/api/trade'
import { mul, pow } from '@/utils/calculation'
import hooks from '../orderHooks'
import OrderVolume from './components/orderVolume'
import PendingBar from './components/pendingBar'
import CellExpireType from './components/cellExpireType'
import ProfitlossSet from './components/profitLossSet'
import OrderTypeTab from './components/orderType.vue'
import PendingBarCFD from './components/pendingBar_CFD'
import LoanBar from './components/loanBar'
import Assets from './components/assets.vue'

export default {
    components: {
        OrderVolume,
        PendingBar,
        ProfitlossSet,
        CellExpireType,
        OrderTypeTab,
        PendingBarCFD,
        LoanBar,
        Assets
    },
    setup () {
        const { t } = useI18n({ useScope: 'global' })
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const product = computed(() => store.getters.productActived)
        const pendingRef = ref(null)
        const profitLossRef = ref(null)
        const state = reactive({
            active: 0,
            buy: {
                volume: '',
                stopLoss: '',
                stopProfit: '',
                expireType: 1, // 挂单过期类型
                pendingPrice: '',
                loading: false,
                entryType: 1, // 1按数量下单 2按成交额下单
            },
            sell: {
                volume: '',
                stopLoss: '',
                stopProfit: '',
                expireType: 1, // 挂单过期类型
                pendingPrice: '',
                loading: false,
                entryType: 1, // 1按数量下单 2按成交额下单
            },
            operationType: 2, // 操作类型。1-普通；2-自动借款；3-自动还款
            enabled: false,
            orderType: 1, // 订单类型
            expireTypeList: [{
                title: t('trade.expireType2'),
                val: 2
            }, {
                title: t('trade.expireType1'),
                val: 1
            }],
            submitType: ''
        })

        const { bizType, account, findProductInCategory, switchProduct } = hooks(state)

        const customerInfo = computed(() => store.state._user.customerInfo)
        const pendingWarn = computed(() => pendingRef.value?.warn)
        const profitLossWarn = computed(() => profitLossRef.value?.stopLossWarn || profitLossRef.value?.stopProfitWarn)
        const symbolKey = computed(() => store.state._quote.productActivedID)
        const accountList = computed(() => store.state._user.customerInfo?.accountList)

        // 点击提交按钮
        const submitHandler = (type) => {
            state.submitType = type
            const params = orderParams()
            if (!params) return
            if (state[state.submitType].loading) return false
            state[state.submitType].loading = true
            addMarketOrder(params)
                .then(async res => {
                    if (res.invalid()) {
                        state[state.submitType].loading = false
                        return false
                    }
                    const data = res.data
                    if (data.hasDelay === 2) {
                        // 延时单，让loading效果多转2s
                        await delayAwaitTime(2000)
                    }
                    state[state.submitType].loading = false
                    const localData = Object.assign({}, params, data)
                    const orderId = data.orderId || data.id
                    sessionStorage.setItem('order_' + orderId, JSON.stringify(localData))

                    // 刷新委托列表
                    store.dispatch('_trade/queryPBOOrderPage', { tradeType: params.tradeType })
                    // 刷新成交记录
                    store.dispatch('_trade/tradeRecordList')
                    // 刷新持仓列表
                    if ([1, 2].includes(product.value?.tradeType)) {
                        store.dispatch('_trade/queryPositionPage', {
                            tradeType: params.tradeType,
                            sortFieldName: 'openTime',
                            sortType: 'desc',
                        })
                    } else {
                        queryAccountInfo()
                    }

                    state[state.submitType].volume = ''
                    state[state.submitType].pendingPrice = ''
                    Toast({
                        message: [1, 12].includes(params.bizType) ? t('trade.orderSuccessToast') : t('trade.orderPendingSuccessToast'),
                        duration: 1000,
                        forbidClick: true,
                    })
                })
                .catch(err => {
                    state[state.submitType].loading = false
                })
        }

        // 验证下单数据是否异常
        const paramsInvalid = () => {
            if (state.orderType === 10 && !state[state.submitType].pendingPrice) return Toast(t('trade.inputPendingPrice'))
            else if (state.orderType === 10 && isNaN(state[state.submitType].pendingPrice)) return Toast(t('trade.pendingPriceError'))
            else if (!state[state.submitType].volume) return Toast(t('trade.inputVolume'))
            else if (isNaN(state[state.submitType].volume)) return Toast(t('trade.volumeError'))
            else if (!account.value) return Toast(t('trade.nullAssets'))
            return pendingWarn.value || profitLossWarn.value
        }

        // 下单参数
        const orderParams = (ype) => {
            if (paramsInvalid()) return null
            let requestPrice = state.submitType === 'sell' ? product.value.sell_price : product.value.buy_price
            const [symbolId, tradeType] = symbolKey.value.split('_')
            const direction = state.submitType === 'sell' ? 2 : 1
            if (state.orderType === 10) {
                requestPrice = state[state.submitType].pendingPrice
            }
            const p = Math.pow(10, product.value.price_digits)
            const params = {
                bizType: bizType.value, // 业务类型。1-市价开；2-限价开
                direction, // 订单买卖方向。1-买；2-卖；
                symbolId: Number(symbolId),
                accountCurrency: account.value[state.submitType]?.currency,
                accountId: account.value[state.submitType]?.accountId,
                requestTime: Date.now(),
                requestNum: Number(state[state.submitType].volume),
                operationType: state.operationType ? 2 : 1,
                requestPrice: mul(requestPrice, p),
                accountDigits: account.value[state.submitType]?.digits,
                tradeType: parseInt(tradeType),
                stopLoss: mul(state[state.submitType].stopLoss, p),
                takeProfit: mul(state[state.submitType].stopProfit, p),
                expireType: state[state.submitType].expireType,
                entryType: state[state.submitType].entryType
            }

            return params
        }

        // 获取账户信息
        const queryAccountInfo = () => {
            if ([1, 2].includes(product.value?.tradeType)) return
            const proCurrency = state.submitType === 'buy' ? product.value?.profitCurrency : product.value?.baseCurrency
            const curAccount = customerInfo.value?.accountList?.find(({ currency, tradeType }) => (currency === proCurrency && tradeType === product.value.tradeType))
            if (curAccount) {
                store.dispatch('_user/queryAccountAssetsInfo', { accountId: curAccount.accountId, tradeType: product.value?.tradeType })
            }
        }

        // 切换订单类型
        const changeOrderType = (val) => {
            store.commit('_trade/Update_pendingEnable', val === 10)
        }

        // 设置按额或者按手数，切换产品或者切换方向时需要重新设置；现货撮合、杠杆玩法下单买入按额，其他都是按手数交易
        const setVolumeType = () => {
            // CFD逐仓和杠杆全仓玩法才支持按额下单功能
            const tradeType = parseInt(product.value?.tradeType)

            if ([2, 3, 5].includes(tradeType)) {
                if ([3, 5].includes(tradeType) && state.direction === 'buy') {
                    state['buy'].entryType = 2 // 1按数量下单 2按成交额下单
                    state['sell'].entryType = 2
                } else {
                    state['buy'].entryType = 1 // 1按数量下单 2按成交额下单
                    state['sell'].entryType = 1
                }
            } else {
                state['buy'].entryType = 1 // 1按数量下单 2按成交额下单
                state['sell'].entryType = 1
            }
        }

        const resetForm = () => {
            state.buy.stopLoss = ''
            state.buy.stopProfit = ''
            state.buy.volume = ''
            state.sell.stopProfit = ''
            state.sell.stopLoss = ''
            state.sell.volume = ''
        }

        // 初始化设置
        const init = () => {
            resetForm()
            state.orderType = 1
            // 获取产品详情
            const [symbolId, tradeType] = symbolKey.value.split('_')
            store.commit('_quote/Update_productActivedID', `${symbolId}_${tradeType}`)
            state.operationType = parseFloat(tradeType) !== 3 // 杠杆玩法默认是普通类型
            setVolumeType() // 设置按额或者按手数交易
            store.dispatch('_quote/querySymbolInfo', { symbolId, tradeType }).then(product => {
                state.sell.volume = ''
                if (!isEmpty(customerInfo.value)) {
                    const accountIds = accountList.value?.filter(el => el.tradeType === Number(product.tradeType)).map(el => el.accountId)
                    queryAccountInfo()
                    store.dispatch('_trade/queryPBOOrderPage', {
                        tradeType: product.tradeType,
                        sortFieldName: 'orderTime',
                        sortType: 'desc',
                        accountIds: accountIds + ''
                    })
                }
            })
        }

        // 监听路由变化
        watch(
            () => route.query, (val, oval) => {
                init()
            }
        )

        init()

        return {
            orderType: 1, // 订单类型
            bizType,
            product,
            account,
            pendingWarn,
            submitHandler,
            profitLossRef,
            changeOrderType,
            customerInfo,
            ...toRefs(state),
        }
    }

}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.trade-header{
    display: flex;
    justify-content: space-between;
    .tabs-trade{
        width: 150px;
        margin-bottom: 20px;

        :deep(.van-tab) {
            flex: 1;
            padding-bottom: 5px;
            flex-basis: auto !important;
            padding: 0;
            font-size: 14px;
            white-space: nowrap;
        }
        :deep(.van-tabs__wrap) {
            height: 30px;
            .van-tabs__nav--line {
                padding-bottom: 0;
            }
            .van-tabs__line {
                bottom: 0;
            }
        }
    }
    .switch{
        display: flex;
        align-items: center;
        >span{
            margin-right: 9px;
        }
    }
}

.trade-wrap{
    display: flex;
    width: 100%;
    .buy-wrap{
        flex: 1;
        padding-right: 15px;
        margin-right: 15px;
        border-right: dashed 1px var(--placeholdColor);
    }
    .sell-wrap{
        flex: 1;
    }
    .form-item{
        color: var(--minorColor);
        height: 40px;
        background: var(--bgColor);
        border-radius: 4px;
        display: flex;
        justify-content: space-between;
        padding: 10px 14px;
        margin-bottom: 16px;
        label{
            margin-right: 9px;
            color: var(--normalColor);
            .minor{
                color: var(--minorColor);
            }
        }
        &.disable{
            background-color: var(--lineColor);
        }
    }

    .footerBtn {
        width: 100%;
        background: var(--contentColor);
        height: 40px;
        border-radius: 4px;
        font-weight: bold;
        &.buy {
            .van-button {
                color: #FFF;
                background: var(--riseColor);
                border-color: var(--riseColor);
                border-radius: 4px;
            }
        }
        &.sell {
            .van-button {
                color: #FFF;
                background: var(--fallColor);
                border-color: var(--fallColor);
                border-radius: 4px;
            }
        }
    }
    .login-bar{
        margin-top: 16px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        border-radius: 4px;
        color: var(--normalColor);
        background: var(--lineColor);
        >a{
            color: var(--primary);
        }
    }
}

</style>

<template>
    <div class='quickTransaction-box'>
        <div class='quickTransaction'>
            <div class='quickTransaction-header'>
                <span class='product-name'>
                    {{ product?.symbolName }}
                </span>
                <span v-if='showClose' class='icon-cross' @click='close'>
                    <van-icon name='cross' size='18' />
                </span>
            </div>

            <div class='quickTransaction-scroll'>
                <div class='quickTransaction-content'>
                    <!-- 方向 -->
                    <Direction v-model='direction' :product='product' />
                    <!-- 订单类型 -->
                    <OrderTypeTab v-model='orderType' @selected='changeOrderType' />
                    <!-- 挂单 -->
                    <PendingBarCFD
                        v-if='orderType === 10'
                        ref='pendingRef'
                        v-model='pendingPrice'
                        :direction='direction'
                        :product='product'
                    />
                    <!-- 手数 -->
                    <OrderVolume
                        :key="'quickTransaction-' + orderType"
                        v-model='volume'
                        v-model:entryType='entryType'
                        :class="$isPC ? 'my-4' : 'my-3'"
                        :direction='direction'
                        :preview-margin='previewMargin'
                        :product='product'
                        @blur='checkTotalAmount'
                    />
                    <!-- 全仓、逐仓玩法杠杆设置 -->
                    <!-- 杠杆比例设置 -->
                    <LeverageRatioSet v-if='Number(product.marginInfo?.type) === 1' />
                    <!-- 杠杆倍数设置 -->
                    <LeverageMultipleSet
                        v-if='Number(product.marginInfo?.type) === 2'
                        v-model='multipleVal'
                        @blur='checkTotalMultipleVal'
                    />

                    <!-- 止盈止损 -->
                    <ProfitlossSet
                        ref='profitlossSetRef'
                        v-model:stopLoss='stopLoss'
                        v-model:stopProfit='stopProfit'
                        :direction='direction'
                        :multiple-val='multipleVal'
                        :product='product'
                        :request-price='requestPrice'
                        :volume='volume'
                    />
                </div>
                <div class='flex flex-col' :class="{ 'flex-col-reverse': !$isPC }">
                    <div class='quickTransaction-footer' :class="$isPC ? 'mb-4' : 'mt-3'">
                        <div class='footerBtn' :class='[direction]'>
                            <template v-if='isLogin'>
                                <van-button
                                    v-if='account?.availableMargin !== undefined && eq(account.availableMargin, 0)'
                                    block
                                    :class="[direction === 'buy' ? 'tradingBuy' : 'tradingSell']"
                                    size='normal'
                                    @click='confirmOpenBlockAtm'
                                >
                                    {{ $t('common.depositFunds') }}
                                </van-button>
                                <van-button
                                    v-else
                                    block
                                    :class="[direction === 'buy' ? 'tradingBuy' : 'tradingSell']"
                                    :disabled='!!tradeError'
                                    :loading='loading'
                                    size='normal'
                                    @click='submitHandler'
                                >
                                    {{ tradeError ? tradeError : direction === 'buy' ? $t('trade.long') : $t('trade.short') }}
                                </van-button>
                            </template>
                            <van-button
                                v-else
                                block
                                :class="direction === 'buy' ? 'tradingBuy' : 'tradingSell'"
                                size='normal'
                                @click='goLogin'
                            >
                                {{ $t('login.loginBtn') }} / {{ $t('register.registerBtn') }}
                            </van-button>
                        </div>
                    </div>

                    <Contract
                        :calculate-num='calculateNum'
                        :direction='direction'
                        :evaluate-close-price='evaluateClosePrice'
                        :leverage='multipleVal'
                        :maintain-margin='maintainMargin'
                        :position-size='positionSize'
                        :preview-fee='previewFee'
                        :preview-margin='previewMargin'
                        :request-price='requestPrice'
                        :volume='volume'
                    />
                </div>
            </div>
        </div>

        <!-- 下单弹窗 -->
        <Trade
            ref='tradeRef'
            :calculate-num='calculateNum'
            :position="isPC ? 'center' : 'bottom'"
            :request-price='requestPrice'
            :stop-loss='stopLoss'
            :take-profit='stopProfit'
            @callback='handleCallback'
        />
        <!-- 快捷交易 -->
        <QuickTransactionFloatingLayer v-if='isPC' :calculate-num='calculateNum' :leverage='multipleVal' module='order' :product='product' />
    </div>

    <blockAtmDialog ref='blockAtmDialogRef' />
</template>

<script>
import { ref, reactive, toRefs, watch, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { Toast } from 'vant'
import { isEmpty, localGet, localSet } from '@/utils/util'
import { mul, lt, gt, eq } from '@/utils/calculation'
import { calculateMarketOrder } from '@/api/trade'
import OrderTypeTab from './components/orderType.vue'
import Direction from './components/direction.vue'
import Contract from './components/contract.vue'
import PendingBarCFD from '@/themeCommon/components/order/pendingBar_CFD'
import OrderVolume from '@/themeCommon/components/order/orderVolume.vue'
import ProfitlossSet from '@/themeCommon/components/order/profitLossSet/index'
import LeverageRatioSet from '@/themeCommon/components/order/leverageRatioSet.vue'
import LeverageMultipleSet from '@/themeCommon/components/order/leverageMultipleSet.vue'
import Trade from '@/themeCommon/components/trade'
import QuickTransactionFloatingLayer from '@/themeCommon/components/quickTransaction/floating-layer.vue'
import { debounce } from 'lodash'
import { MsgSocket } from '@/plugins/socket/socket'
import mitt from '@/utils/mitt'
import blockAtmDialog from '@/components/blockAtmDialog'
import { useAssets } from '@/hooks/assets'
import { firebaseAnalytics } from '@/utils/firebase'

export default {
    components: {
        OrderTypeTab,
        Direction,
        PendingBarCFD,
        OrderVolume,
        ProfitlossSet,
        Trade,
        Contract,
        LeverageRatioSet,
        LeverageMultipleSet,
        QuickTransactionFloatingLayer,
        blockAtmDialog,
    },
    props: {
        // 当前模块
        module: {
            type: String,
            default: '',
        },
        // 是否显示遮罩层
        overlay: {
            type: Boolean,
            default: false,
        },
        // 当前显示关闭按钮
        showClose: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['onchange', 'onclose', 'setMultiple'],
    setup (props, { emit }) {
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const { t } = useI18n({ useScope: 'global' })
        const isPC = window.isPC

        const { showbtnType } = route.query
        // ref
        const tradeRef = ref(null)
        const pendingRef = ref(null)
        const loading = ref(null)
        const blockAtmDialogRef = ref(null)
        const profitlossSetRef = ref(null)

        // state
        const state = reactive({
            // 订单类型 1-市价单 10-限价单
            orderType: Number(localGet('__TRADE_ORDERTYPE__') || 1),
            // 操作类型。1-普通；2-自动借款；3-自动还款
            operationType: 2,
            // 当前选择的杠杆倍数
            multipleVal: '1',
            // 方向 buy-买入 sell-卖出
            direction: route.query.direction || localGet('__TRADE_DIRECTION__') || 'buy',
            // 挂单价
            pendingPrice: '',
            // 手数
            volume: null,
            // 下单类型 1-按数量下单 2-按成交额下单
            entryType: 2,
            // 挂单过期类型
            expireType: 2,
            // 挂单过期类型数据
            expireTypeList: [
                {
                    title: t('trade.expireType2'),
                    val: 2,
                },
                {
                    title: t('trade.expireType1'),
                    val: 1,
                },
            ],
            /** 预估保证金 */
            previewMargin: '',
            /** 预估手续费 */
            previewFee: '',
            /** 预计执行价格 */
            evaluateClosePrice: '',
            // 预计执行下单数量
            calculateNum: 0,
            // 止盈价
            stopLoss: '',
            // 止损价
            stopProfit: '',
            active: 0,
            // 维持保证金比例
            maintainMargin: 0,
        })

        // 用户信息
        const customerInfo = computed(() => store.state._user.customerInfo)
        // 当前产品
        const product = computed(() => store.getters.productActived)

        const isLogin = computed(() => !!store.state._user.customerInfo?.customerNo)
        // 当前账户
        const account = useAssets()

        // 是否显示过期类型组件
        const showCellExpireType = computed(() => {
            return state.orderType === 10 && [1].includes(product.value?.tradeType)
        })

        // 限价单挂单价格提示
        const pendingWarn = computed(() => pendingRef.value?.warn)

        // 打开弹窗
        const open = (product, direction) => {
            if (direction) state.direction = direction
            const { symbolId, tradeType } = product
            store.commit('_quote/Update_productActivedID', `${symbolId}_${tradeType}`)
            init()
        }

        // 初始化
        const init = () => {
            // 设置操作类型
            state.operationType = product.value.tradeType === 3 ? 1 : 2
            if (showbtnType) {
                if (showbtnType == 'buy') {
                    state.direction = 'buy'
                } else {
                    state.direction = 'sell'
                }
            }

            // 设置下单类型
            MsgSocket.subscribeAsset(product.value.tradeType)
        }

        // 重置数据
        const reset = () => {
            state.expireType = 1
            state.volume = ''
            state.pendingPrice = ''
        }

        // 关闭弹窗
        const close = () => {
            reset()
            emit('onclose')
        }

        // 获取账户信息
        const queryAccountInfo = () => {
            if ([3, 5, 9].indexOf(product.value?.tradeType) === -1) return false
            const proCurrency = state.direction === 'buy' ? product.value.value?.profitCurrency : product.value.value?.baseCurrency
            const curAccount = customerInfo.value?.accountList?.find(
                ({ currency, tradeType }) => currency && currency === proCurrency && tradeType === product.value.value.tradeType,
            )
            if (curAccount) {
                store.dispatch('_user/queryAccountAssetsInfo', { accountId: curAccount.accountId, tradeType: product.value?.tradeType })
            } else if (customerInfo.value) Toast(t('trade.nullAssets'))
        }

        // 切换订单类型
        const changeOrderType = (val) => {
            store.commit('_trade/Update_pendingEnable', val === 10)
        }

        // 获取预估手续费和保证金
        const calculateMarginRequest = (params) => {
            if (!product.value || !customerInfo.value) return
            calculateMarketOrder(params)
                .then((res) => {
                    if (res.check() && params.symbolId === product.value.symbolId) {
                        state.previewFee = res.data.fee
                        state.evaluateClosePrice = res.data.evaluateClosePrice
                        state.previewMargin = res.data.margin
                        state.maintainMargin = res.data.maintainMargin
                        state.calculateNum = res.data.calculateNum
                        // 因为汇率是实时变化所以需要重复调用试算接口
                        if (route.name === 'Order') {
                            previewMarinHandler()
                        }
                    } else {
                        clearPreviewMargin()
                    }
                })
                .catch(() => {
                    clearPreviewMargin()
                })
        }

        // 获取预估保证金
        const previewMarinHandler = debounce(() => {
            if ([1, 2].includes(product.value?.tradeType)) return false
            if (paramsInvalid()) {
                clearPreviewMargin()
                return null
            }
            const params = orderParams()
            calculateMarginRequest(params)
        }, 1000)

        // 清空预估保证金
        const clearPreviewMargin = () => {
            state.previewFee = ''
            state.previewMargin = ''
            state.evaluateClosePrice = ''
        }

        // 验证下单数据是否异常
        const paramsInvalid = () => {
            if (state.orderType === 10 && !state.pendingPrice) return t('trade.inputPendingPrice')
            else if (state.orderType === 10 && isNaN(state.pendingPrice)) return t('trade.pendingPriceError')
            else if (!state.volume) return state.entryType === 2 ? t('trade.inputVolume2') : t('trade.inputVolume')
            else if (isNaN(state.volume) || Number(state.volume) <= 0) return t('trade.volumeError')
            else if (!account.value) return t('trade.nullAssets')
            return pendingWarn.value
        }

        const bizType = () => {
            // 市价单
            if (state.orderType !== 10) {
                return 1
            }
            // 只有合约撮合的模式才用13、14， 其他模式应该还是原来的12
            return product.value.isContractMatching ? 13 : 12
        }

        /** 市价单请求价格 */
        const marketRequestPrice = computed(() => (state.direction === 'sell' ? product.value.sell_price : product.value.buy_price))

        const requestPrice = computed(() => (state.orderType === 10 ? state.pendingPrice : marketRequestPrice.value))

        /** 仓位大小： 输入保证金*杠杆 */
        const positionSize = computed(() => {
            return mul(state.volume, state.multipleVal)
        })

        const priceDigits = computed(() =>
            Math.pow(10, product.value.hasOwnProperty('price_digits') ? product.value.price_digits : product.value.symbolDigits),
        )

        // 下单参数
        const orderParams = () => {
            const paramsInvalidResult = paramsInvalid()
            if (typeof paramsInvalidResult === 'string' && paramsInvalidResult) {
                Toast(paramsInvalidResult)
                return null
            }
            const direction = state.direction === 'sell' ? 2 : 1

            const params = {
                bizType: bizType(),
                direction,
                symbolId: product.value.symbolId,
                accountCurrency: account.value.currency,
                accountId: account.value.accountId,
                requestTime: Date.now(),
                requestNum: state.volume,
                operationType: state.operationType,
                requestPrice: mul(requestPrice.value, priceDigits.value),
                accountDigits: account.value.digits,
                tradeType: product.value.tradeType,
                stopLoss: mul(state.stopLoss, priceDigits.value),
                takeProfit: mul(state.stopProfit, priceDigits.value),
                entryType: state.entryType,
                requestPriceTarget: requestPrice.value,
                stopLossTarget: state.stopLoss,
                takeProfitTarget: state.stopProfit,
            }
            // bizType不等于13需要传挂单过期类型
            if (params.bizType !== 13) {
                params.expireType = state.expireType
            }
            // 全仓、逐仓玩法产品设置杠杆倍数需要传crossLevelNum字段
            if ([1, 2].includes(product.value.tradeType) && Number(product.value.marginInfo?.type) === 2) {
                params.crossLevelNum = Number(state.multipleVal)
            }
            return params
        }

        // 点击提交按钮
        const submitHandler = () => {
            const params = orderParams()
            // 检查止盈止损是否有异常
            const warning = profitlossSetRef.value?.checkWarning?.()
            if (warning) {
                Toast(warning)
                return
            }
            if (!params) return
            setLoading(false)
            calculateMarginRequest(params)
            tradeRef.value.open({
                ...params,
                volume: state.volume,
            })
        }

        // 下单回调
        const handleCallback = ({ res, params, type }) => {
            if (type) {
                const url = route.path + '/' + 'recharge'
                router.push(url)
            } else {
                setLoading(false)
                if (res.check()) {
                    const data = res.data
                    const localData = Object.assign({}, params, data)
                    const orderId = data.orderId || data.id
                    sessionStorage.setItem('order_' + orderId, JSON.stringify(localData))
                    // 刷新委托列表
                    store.dispatch('_trade/queryPBOOrderPage', { tradeType: params.tradeType })
                    // 刷新成交记录
                    store.dispatch('_trade/tradeRecordList')
                    state.pendingPrice = ''
                }
            }
        }

        const setLoading = (value) => {
            loading.value = value
        }

        // 切换产品的时候清除数据
        watch([() => route.query.symbolId, () => route.query.tradeType], () => {
            state.pendingPrice = ''
            state.stopLoss = ''
            state.stopProfit = ''
        })

        watch(
            () => state.entryType,
            (value) => {
                clearPreviewMargin()
                localSet('__TRADE_ENTRY_TYPE__', value)
                store.commit('_trade/Update_entryType', value)
            },
        )

        watch(
            () => [product.value.isCryptocurrency, product.value?.singleMinAmount],
            (value) => {
                if (product.value?.singleMinAmount) {
                    state.volume = product.value?.singleMinAmount
                }
            },
            { immediate: true },
        )

        // // 最低预置交易总额
        // const defaultLeverage = computed(() => {
        //     try {
        //         const newsSysConfig = store.state._base.newsSysConfig
        //         // 有在新闻后台设置默认杠杆，则使用默认杠杆
        //         const newsConfig = newsSysConfig && newsSysConfig.find((o) => o.Key === 'leverageConfig')
        //         const { Value } = newsConfig || {}
        //         const leverageConfig = JSON.parse(Value)
        //         const defaultLeverage = leverageConfig[product.value.symbolId]
        //         return defaultLeverage || 1
        //     } catch (error) {
        //         const [min] = product.value.marginInfo?.values?.split('-') || [1]
        //         return min
        //     }
        // })

        // 持仓列表数据
        // const positionList = computed(() => store.state._trade.positionList[product.value?.tradeType] || [])
        // 当前产品对应的持仓数据
        // const productPosition = computed(() =>
        //     positionList.value.find((el) => el.tradeType === product.value.tradeType && el.symbolId === product.value.symbolId),
        // )
        // 杠杆倍数范围，全仓玩法的范围优先取当前产品的持仓数据，如果没有当前产品没有持仓则取产品信息里面的数据
        // const multipleRange = computed(() => {
        //     if (product.value.tradeType === 1 && !isEmpty(productPosition.value)) {
        //         return productPosition.value.adjustCrossLevel.split('-')
        //     } else {
        //         return product.value.marginInfo?.values?.split('-') || []
        //     }
        // })

        /** 交易总额的计算公式=输入的保证金*输入的杠杆 */
        // const totalTransactionAmount = computed(() => {
        //     return mul(product?.value?.singleMinAmount, defaultLeverage.value)
        // })

        // 检查输入值，预置最小值为默认杠杆*保证金的总和
        const checkTotalAmount = (volume) => {
            //  如果输入空值。则不改变
            // if (!volume) return
            // const curTotalAmount = mul(volume, state.multipleVal)
            // if (totalTransactionAmount.value && lt(curTotalAmount, totalTransactionAmount.value)) {
            //     const curMultipleVal = Math.ceil(divide(totalTransactionAmount.value, volume))
            //     state.multipleVal = gt(curMultipleVal, multipleRange.value[1]) ? parseInt(multipleRange.value[1]) : curMultipleVal
            // }
        }

        // 检查倍数，预置最小值为默认杠杆*保证金的总和
        const checkTotalMultipleVal = (value) => {
            // const curTotalAmount = mul(state.volume, value)
            // if (totalTransactionAmount.value && lt(curTotalAmount, totalTransactionAmount.value)) {
            //     const curVolume = Math.ceil(divide(totalTransactionAmount.value, value))
            //     state.volume = curVolume
            // }
        }

        // 买入卖出方向变化时重新获取资产信息
        watch(
            () => state.direction,
            () => {
                queryAccountInfo()
            },
        )

        /** 杠杆、方向、下单类型、保证金/数量、止损价、止盈价变化，重新调用计算接口 */
        watch(
            () => [
                state.pendingPrice,
                state.multipleVal,
                state.direction,
                state.entryType,
                state.orderType,
                state.stopProfit,
                state.stopLoss,
                state.volume,
                product.value,
            ],
            () => {
                previewMarinHandler()
            },
        )

        /** 盘口点击报价，填充买入卖出价 */
        const chooseHandicapPrice = (price) => {
            if (price) {
                state.pendingPrice = price
            }
        }

        onMounted(() => {
            init()
            // 盘口点击报价，填充买入卖出价
            mitt.on('chooseHandicapPrice', chooseHandicapPrice)
        })

        onUnmounted(() => {
            mitt.off('chooseHandicapPrice', chooseHandicapPrice)
        })

        const goLogin = () => {
            router.replace({ path: '/login', query: { rouType: 1 } })
        }

        const confirmOpenBlockAtm = () => {
            window.dataLayer?.push({
                event: 'depositBtn',
                'gtm.elementClasses': 'depositButton',
                eventModel: {
                    account_Number: customerInfo.value?.customerNo,
                },
            })
            firebaseAnalytics('ck_deposit_entrance', {
                key: 'ck_deposit_entrance',
                value: JSON.stringify({
                    email: customerInfo.value?.emailAll || customerInfo.value?.email || '',
                    phone: customerInfo.value?.phoneAll || customerInfo.value?.phone || '',
                    userID: customerInfo.value?.customerNo,
                }),
            })
            router.push(window.isPC ? '/order/recharge' : '/deposit')
        }

        const tradeError = computed(() => {
            const min = product.value?.singleMinAmount || 5
            const max = product.value?.singleMaxAmount || 100000
            const currency = account.value?.currency || ''
            const volume = state.volume || 0
            // 2、用戶輸入margin小於最低限額，button置灰，顯示min.X USDT, X=系統限制最低交易額。
            if (lt(volume, min)) return `${t('headLineTrade.minMargin')}${min} ${currency}`
            // 4、用戶輸入數額超過最高限額，顯示max. X USDT, X=系統限制最高交易額。
            if (gt(volume, max)) return `${t('headLineTrade.maxMargin')}${max} ${currency}`
            // 3、用戶輸入數額>available，button置灰，顯示Insufficient balance
            if (gt(volume, account.value?.availableMargin)) return t('headLineTrade.insufficientBalance')
            return null
        })

        return {
            isEmpty,
            isLogin,
            ...toRefs(state),
            goLogin,
            customerInfo,
            product,
            account,
            showCellExpireType,
            tradeRef,
            pendingRef,
            requestPrice,
            positionSize,
            close,
            open,
            loading,
            changeOrderType,
            previewMarinHandler,
            submitHandler,
            handleCallback,
            isPC,
            clearPreviewMargin,
            checkTotalAmount,
            checkTotalMultipleVal,
            blockAtmDialogRef,
            setLoading,
            tradeError,
            profitlossSetRef,
            gt,
            eq,
            confirmOpenBlockAtm,
            priceDigits,
            mul,
        }
    },
}
</script>

<style lang="scss" scoped>
.quickTransaction-box {
    display: inline-block;
    width: 100%;
    height: 100%;
    .quickTransaction-scroll {
        flex: 1;
        overflow-y: auto;
        @include scroll-bar-vertical;
    }
}

.quickTransaction {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
}

.quickTransaction-header {
    margin: 16px 0;
    .product-name {
        color: var(--color);
        font-size: 20px;
        font-weight: bold;
    }
    .icon-cross {
        position: absolute;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        right: 0;
        top: 0;
        cursor: pointer;
    }
}

.quickTransaction-content {
    &:deep {
        .orderVolume {
            margin-top: rem(20px);
        }
        .orderVolume input:focus {
            background-color: var(--contentColor);
        }
        .profitLossSetBar {
            .stepper:focus-within {
                background-color: var(--contentColor);
            }
        }
    }
}

.quickTransaction-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 0;
    max-height: 40px;
    .footerBtn {
        flex: 1;
        font-weight: bold;
        background: var(--contentColor);
        .icon {
            font-size: 14px;
            margin-right: rem(8px);
            font-weight: 700;
        }

        .van-button {
            color: #fff;
            font-size: 14px;
            height: 40px;
            &.van-button--disabled {
                background: #f9f9fb !important;
                border-color: #f9f9fb !important;
                color: #666;
            }
        }
        &.buy {
            .van-button {
                background: var(--riseColor);
                border-color: var(--riseColor);
            }
        }
        &.sell {
            .van-button {
                background: var(--fallColor);
                border-color: var(--fallColor);
            }
        }
    }
}

.pc {
    border-top: none;
    .quickTransaction-header {
        padding: 0 12px;
    }
    .quickTransaction-scroll {
        padding: 0 12px 40px 12px;
    }
    .quickTransaction-content {
        :deep {
            .orderVolume {
                .entryType,
                .volumeBox input,
                .volumeBox .currency {
                    font-size: 12px;
                }
                .direction {
                    font-size: 12px;
                }
            }
            .orderAssets {
                font-size: 12px;
                line-height: 24px;
            }
        }
    }
}
</style>

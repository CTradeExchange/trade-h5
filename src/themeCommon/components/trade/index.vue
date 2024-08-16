<template>
    <popup
        v-model:show='visible'
        closeable
        :overlay='overlay'
        :position='position'
        :title="$t('headLineTrade.transactionDetails')"
        @close='handleVisible(false)'
    >
        <div class='transaction-details-wrap'>
            <div class='transaction-details-content'>
                <template v-if='step === 1'>
                    <loading :text="$t('trade.opening')" />
                </template>
                <template v-else>
                    <info v-if='status.status === 3' :des='status.des' :status='status.status' :text='status.text' />
                    <div v-else>
                        <div class='flex items-center mb-5'>
                            <van-tag
                                :color="Number(params.direction) === 1 ? 'var(--riseColor)' : 'var(--fallColor)'"
                                size='medium'
                                style='--van-tag-border-radius: 4px'
                                text-color='#fff'
                            >
                                {{ Number(params.direction) === 1 ? 'L' : 'S' }}
                            </van-tag>
                            <span class='text-base font-bold mx-2'>
                                {{ product.symbolName }}
                            </span>
                        </div>
                        <van-cell :title="$t('trade.margin')" :value='`${params.volume} ${currency}`' />
                        <van-cell v-if='params.crossLevelNum' :title="$t('trade.leverage')" :value='`${params.crossLevelNum}x`' />
                        <van-cell :title="$t('headLineTrade.positionSize')">
                            <div>
                                <div>{{ `${positionSize} ${currency}` }}</div>
                                <div v-if='positionSize' class='text-minorColor text-xs'>
                                    {{ `${toFixed(div(positionSize, requestPrice), product.numberDigits, 1)} ${product.numberCurrency}` }}
                                </div>
                            </div>
                        </van-cell>
                        <van-cell
                            class='mt-4'
                            :title="params.bizType === 1 ? $t('trade.estimatedExecutionPrice') : $t('trade.pendingPrice')"
                            :value='requestPrice'
                        />
                        <van-cell :title="$t('trade.previewStopPriceShort')" :value='liqPrice' />
                        <van-cell :border='false' :title="$t('headLineTrade.avgSpread')">
                            <template #value>
                                <div class='flex items-center justify-end h-full'>
                                    <img alt='star' class='mr-1' src='/images/star.svg' />
                                    <span>0.000%</span>
                                </div>
                            </template>
                        </van-cell>
                        <van-cell
                            v-if='takeProfit || stopLoss'
                            :title="$t('headLineTrade.tpSl')"
                            :value="`${stopLoss || '-'}/${takeProfit || '-'}`"
                        />
                        <van-cell :border='false' class='mt-4' :title="$t('trade.cost')">
                            <template #value>
                                <div v-if='feeRate'>
                                    <span>
                                        {{ `${fee} ${assetsInfo?.currency || ''} ` }}
                                    </span>
                                    <popover placement='right' :text="$t('headLineTrade.fees')">
                                        <template #default>
                                            <div>
                                                <div class='flex justify-space-between items-center'>
                                                    <span class='mr-15'>
                                                        {{ $t('trade.cost') }}
                                                    </span>
                                                    <span>{{ $t('headLineTrade.positionSize') }} * {{ $t('headLineTrade.feeRate') }}</span>
                                                </div>
                                                <div v-if='feeRate' class='font-bold text-right'>
                                                    {{ `${positionSize} ${currency}` }} * {{ feeRate }} = {{ `${fee} ${currency}` }}
                                                </div>
                                            </div>
                                        </template>
                                        <template #reference>
                                            <span class='text-minorColor text-underline font-normal'>
                                                {{ `(${feeRate})` }}
                                            </span>
                                        </template>
                                    </popover>
                                </div>
                                <div v-else>
                                    --
                                </div>
                            </template>
                        </van-cell>
                        <van-cell :border='false'>
                            <template #value>
                                <div v-if='interest'>
                                    <span>
                                        {{ `${interestAmount} ${assetsInfo?.currency || ''}` }}
                                    </span>
                                    <popover placement='right' :text="$t('headLineTrade.fees')">
                                        <template #default>
                                            <div>
                                                <div class='flex justify-space-between items-center'>
                                                    <span class='mr-15'>
                                                        {{
                                                            product.isCryptocurrency
                                                                ? $t('headLineTrade.hourlyInterest')
                                                                : $t('headLineTrade.dailyInterest')
                                                        }}
                                                    </span>
                                                    <span>
                                                        {{ $t('headLineTrade.positionSize') }} *
                                                        {{
                                                            product.isCryptocurrency
                                                                ? $t('headLineTrade.hHourlyRate')
                                                                : $t('headLineTrade.dailyRate')
                                                        }}
                                                    </span>
                                                </div>
                                                <div v-if='interestAmount' class='font-bold text-right'>
                                                    {{ positionSize }} * {{ `${interest}%` }} = {{ `${interestAmount} ${currency}` }}
                                                </div>
                                            </div>
                                        </template>
                                        <template #reference>
                                            <span class='text-minorColor text-underline font-normal'>
                                                {{ `(${interest}%)` }}
                                            </span>
                                        </template>
                                    </popover>
                                </div>
                                <div v-else>
                                    --
                                </div>
                            </template>
                            <template #title>
                                {{
                                    product.isCryptocurrency ? $t('headLineTrade.estHourlyInterest') : $t('headLineTrade.estDailyInterest')
                                }}
                            </template>
                        </van-cell>
                    </div>
                </template>
            </div>
            <div class='mt-10'>
                <!-- 操作 -->
                <template v-if='step === 0'>
                    <van-button block class='w-full' :loading='loading' :loading-text="$t('confirm')" type='primary' @click='handleTrade'>
                        {{ $t('confirm') }}
                    </van-button>
                </template>
                <template v-else-if='step === 2'>
                    <div v-if='isDealDone' class='popup-link'>
                        <a @click='handleJump'>
                            {{ isDealDone ? $t('trade.viewPosition') : $t('trade.viewEntrust') }}
                        </a>
                    </div>
                    <div>
                        <van-button class='w-full' type='primary' @click='handleVisible(false)'>
                            {{ $t('compLang.close') }}
                        </van-button>
                    </div>
                </template>
                <template v-else-if='step === 3'>
                    <div class='flex justify-space-between'>
                        <van-button class='flex-1 mr-4' plain type='primary' @click='handleVisible(false)'>
                            {{ $t('compLang.close') }}
                        </van-button>

                        <van-button v-if='isBalanceLow' class='flex-1' type='primary' @click='confirmOpenBlockAtm'>
                            {{ $t('common.deposit') }}
                        </van-button>
                        <van-button v-else class='flex-1' type='primary' @click='handleService'>
                            {{ $t('common.service') }}
                        </van-button>
                    </div>
                </template>
            </div>
        </div>
    </popup>
</template>

<script>
import { computed, reactive, toRefs, onUnmounted, onMounted, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { setCrossLevelNum, addMarketOrder } from '@/api/trade'
import popup from './components/popup.vue'
import loading from './components/loading.vue'
import info from './components/info.vue'
import { isEmpty } from '@/utils/util.js'
import { minus, divide, lte, mul, toFixed, div, plus } from '@/utils/calculation'
import mitt from '@/utils/mitt'
import { toast } from 'vue3-toastify'
import { firebaseAnalytics } from '@/utils/firebase'
import { useAssets } from '@/hooks/assets'

export default {
    components: {
        popup,
        loading,
        info,
    },
    props: {
        // 弹窗位置
        position: {
            type: String,
            default: 'center',
        },
        // 弹窗样式
        style: {
            type: Object,
            default: () => {},
        },
        // 是否显示遮罩层
        overlay: {
            type: Boolean,
            default: true,
        },
        setLoading: {
            type: Function,
        },
        /** 预计执行价格 */
        requestPrice: {
            type: String,
        },
        /** 止损价 */
        stopLoss: {
            type: String,
        },
        /** 止盈价 */
        takeProfit: {
            type: String,
        },
        /** 预计执行下单数量 */
        calculateNum: {
            type: [String, Number],
        },
    },
    emits: ['callback', 'close'],
    setup (props, { emit }) {
        const store = useStore()
        const router = useRouter()
        const route = useRoute()
        const { t } = useI18n({ useScope: 'global' })
        const isPC = window.isPC
        const { proxy } = getCurrentInstance()

        const state = reactive({
            visible: false, // 弹窗开关
            step: 0, // 步骤，默认展示预览 1 (市价)倒计时 2 成功 3 失败
            loading: false, // 请求加载
            params: {}, // 请求数据
            res: {}, // 返回数据
            isDealDone: false, // 是否已成交
            previewMargin: '', // 预估保证金
            previewFee: '', // 预估手续费
            timer: null,
            showBlockAtm: false,
        })

        // 是否模拟账户
        const isDemo = computed(() => {
            return store.state._user.customerInfo?.companyType === 'demo'
        })

        const customerInfo = computed(() => store.state._user.customerInfo || {})

        // 钱包资产信息
        const assetsInfo = useAssets()
        // 产品信息
        const product = computed(() => store.getters.productActived)

        // 持仓列表数据
        const positionList = computed(() => store.state._trade.positionList[product.value?.tradeType] || [])

        // 当前产品对应的持仓数据
        const position = computed(() =>
            positionList.value.find((el) => el.tradeType === product.value.tradeType && el.symbolId === product.value.symbolId),
        )

        // 是否余额不足
        const isBalanceLow = computed(() => {
            return state.step === 3 && isDemo.value === false && ['20010'].includes(state.res?.code)
        })

        // 是否市价单
        const isPosition = computed(() => {
            return state.params?.bizType === 1
        })

        // 标题状态
        const status = computed(() => {
            const data = {
                status: state.step,
            }
            switch (state.step) {
                case 2:
                    // 成功
                    data.text = state.isDealDone ? t('trade.orderComplete') : t('trade.entrustSuccess')
                    data.des = !state.isDealDone ? t('trade.entrustDes') : ''
                    break
                case 3:
                    // 失败, 如果钱包的所有资产的“总资产估值”<=0 ，提示：您的交易账户余额不足，请先给钱包充值，然后将资产划入您的交易账户以继续交易。
                    data.text = isBalanceLow.value
                        ? lte(assetsInfo.value?.totalBalance, 0)
                            ? t('trade.balanceLowGoRecharge')
                            : t('trade.balanceLow')
                        : state.res?.msg
                    break
                default:
                    data.status = 1
                    data.text = t('trade.openConfirm')
            }
            return data
        })

        // 账户币种
        const currency = computed(() => {
            const item = store.state._user.customerInfo?.accountList?.find((el) => Number(el.tradeType) === Number(state.params?.tradeType))
            return item?.currency || ''
        })

        // 手续费
        const fee = computed(() => {
            if (product.value?.feeRate === undefined) return null
            return toFixed(mul(mul(state.params.volume, state.params.crossLevelNum), product.value.feeRate), assetsInfo.value?.digits)
        })

        // 手续费率
        const feeRate = computed(() => {
            if (['1', '3'].includes(product.value.feeFormula)) {
                if (product.value?.feeRate === undefined) return null
                return toFixed(mul(product.value.feeRate, 100), 4, 1) + '%'
            }
            return null
        })

        // 利率
        const interest = computed(() => {
            if (product.value.buyInterest === null || product.value.sellInterest === undefined) return null
            const value = mul(state.params.direction === 1 ? product.value.buyInterest : product.value.sellInterest, 100)

            // 數值為後台設置數值/360，精確到小數點後4位，4位以後的數值cut掉
            const dailyInterest = toFixed(div(value, 360), 4, 1)
            // 加密货币用小时利率
            return `${product.value?.isCryptocurrency ? toFixed(div(dailyInterest, 24), 4, 1) : dailyInterest}`
        })

        // 利率值
        const interestAmount = computed(() => {
            // 計算數額顯示小數點後4位，多餘數位四捨五入
            return toFixed(mul(mul(state.params.volume, state.params.crossLevelNum), div(interest.value, 100)), assetsInfo.value?.digits)
        })
        const positionSize = computed(() => {
            // 計算數額顯示小數點後4位，多餘數位四捨五入
            return mul(state.params.volume, state.params.crossLevelNum)
        })
        const priceDigits = computed(() =>
            Math.pow(10, product.value.hasOwnProperty('price_digits') ? product.value.price_digits : product.value.symbolDigits),
        )
        const liqPrice = computed(() => {
            if (!props.requestPrice) return '--'
            const methods = state.params.direction === 1 ? minus : plus
            return `${toFixed(
                methods(props.requestPrice, div(mul(props.requestPrice, 0.8), state.params.crossLevelNum)),
                product.value.price_digits,
            )}`
        })
        // 确认框
        const open = (params) => {
            // 重置并初始化
            state.step = 0
            state.res = {}
            state.isDealDone = false
            state.loading = false
            state.params = params
            state.visible = true
            clearTimeout(state.timer)
        }

        // 操作开关
        const handleVisible = (visible) => {
            if (visible === false) {
                emit('close')
            }
            state.visible = visible
        }

        // 下单
        const handleTrade = async () => {
            const tradeType = product.value.tradeType
            const symbolId = product.value.symbolId
            const crossLevelNum = Number(state.params.crossLevelNum)
            const isSetCrossLevelNum = tradeType === 1 && !isEmpty(position.value) && Number(position.value.crossLevelNum) !== crossLevelNum

            state.loading = true

            // 全仓玩法存在当前产品的持仓数据，并且杠杆倍数不同，需要先设置一下杠杆倍数
            if (isSetCrossLevelNum) {
                const result = await setCrossLevelNum({
                    tradeType,
                    symbolId,
                    crossLevelNum,
                })
                if (!result.check()) {
                    state.loading = false
                    props.setLoading(false)
                    return
                }
            }

            const res = await addMarketOrder({
                ...state.params,
                stopLoss: mul(props.stopLoss, priceDigits.value),
                takeProfit: mul(props.takeProfit, priceDigits.value),
                requestPriceTarget: props.requestPrice,
                requestPrice: mul(props.requestPrice, priceDigits.value),
                stopLossTarget: props.stopLoss,
                takeProfitTarget: props.takeProfit,
            })
            if (res.check()) {
                toast.success(`<div class="text-sm font-bold mb-1 text-color">${t('common.tradeSuccess')}</div>`, {
                    dangerouslyHTMLString: true,
                })
                handleVisible(false)
                // 回调
                emit('callback', {
                    params: state.params,
                    res: res,
                })
            } else {
                state.loading = false
                state.step = 3
                state.res = res
                state.visible = true
                // 回调
                emit('callback', {
                    params: state.params,
                    res: res,
                })
            }
        }

        // 划转
        const handleTransfer = () => {
            handleVisible(false)
            router.push({
                path: window.isPC ? '/order/transfer' : '/transfer',
                query: {
                    tradeType: product.value.tradeType,
                    toCurrency: state.params.accountCurrency,
                },
            })
        }

        // 查看委托
        const handleJump = () => {
            // 查看持仓
            if (state.isDealDone) {
                mitt.emit('OrderRecord', 'position')
            } else {
                mitt.emit('OrderRecord', 'pending')
            }
            // 不在下单页
            if (route.name !== 'Order') {
                router
                    .push({
                        path: '/order',
                        query: {
                            tradeType: product.value.tradeType,
                            symbolId: product.value.symbolId,
                        },
                    })
                    .then(() => {
                        // 查看持仓
                        if (state.isDealDone) {
                            mitt.emit('OrderRecord', 'position')
                        } else {
                            mitt.emit('OrderRecord', 'pending')
                        }
                    })
            }
            handleVisible(false)
        }

        // 在线客服
        const handleService = () => {
            proxy.openPasstoAIChat()
            handleVisible(false)
        }

        // 获取止盈止损
        const getDefaultTPSL = (val) => {
            return val || t('common.noSet')
        }

        // 跳转充值页面

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
            state.visible = false
            if (window.isPC) {
                emit('callback', {
                    type: 'deposit',
                })
            } else {
                router.push({
                    path: '/deposit',
                })
            }
        }

        /**
         * 查询持仓列表
         * @param {number} orderId
         */
        const queryPositionPage = (orderId) => {
            store
                .dispatch('_trade/queryPositionPage', {
                    sortFieldName: 'openTime',
                    sortType: 'desc',
                    tradeType: product.value.tradeType,
                })
                .finally(() => {
                    state.step = 2
                    state.loading = false
                })
        }

        onMounted(() => {
            // 收到撮合市价开仓成交消息时需同时更新平仓手数和平仓价格
            mitt.on('POSITION_OPEN', (paramMap) => {
                // 非1并且非3则认为订单完成
                if (paramMap.orderStatus !== '1' && paramMap.orderStatus !== '3') {
                    clearTimeout(state.timer)
                    // 请求持仓列表拿数据
                    queryPositionPage(Number(paramMap.orderId))
                }
            })
        })

        onUnmounted(() => {
            mitt.off('POSITION_OPEN')
        })

        return {
            open,
            isPC,
            product,
            isBalanceLow,
            isPosition,
            status,
            handleVisible,
            handleTrade,
            handleTransfer,
            handleJump,
            handleService,
            getDefaultTPSL,
            divide,
            minus,
            div,
            toFixed,
            currency,
            lte,
            confirmOpenBlockAtm,
            assetsInfo,
            mul,
            feeRate,
            fee,
            interest,
            interestAmount,
            positionSize,
            liqPrice,
            ...toRefs(state),
        }
    },
}
</script>

<style lang="scss" scoped>
.transaction-details-wrap {
    .transaction-details-content {
        min-height: 240px;
        :deep {
            .van-cell {
                padding: 0;
                margin-bottom: 4px;
                &:after {
                    display: none;
                }
                .van-cell__title {
                    color: var(--minorColor);
                }
                .van-cell__value {
                    color: var(--color);
                    font-weight: bold;
                }
            }
        }
    }
}
</style>

<template>
    <popup
        v-model:show='showCP'
        class='m-dialogPC'
        :close-on-click-overlay='true'
        :closeable='step > 0 ? false : true'
        position='bottom'
        :style="{ overflow: 'visible' }"
        :title="step > 0 ? '' : isLimit ? $t('trade.orderType9') : $t('trade.orderType8')"
        @closed='closed'
    >
        <van-tabs v-if='step === 0 && isContractMatching' v-model:active='isLimit' class='orderType mb-4' type='card'>
            <van-tab :title="$t('trade.orderType8')" />
            <van-tab :title="$t('trade.orderType9')" />
        </van-tabs>

        <template v-if='step === 1'>
            <info class='popup-info' :status='2' :text="$t('trade.closedSuccess')">
                <div class='dialog-body'>
                    <div v-if='res?.hasDelay !== 2' class='popup-list'>
                        <van-cell :title="$t('trade.symbol')" :value='data.symbolName' />
                        <van-cell
                            :title="$t('trade.closeDirection')"
                            :value="res?.direction === 2 ? $t('trade.sell') : $t('trade.buy')"
                            :value-class="res?.direction === 2 ? 'fallColor' : 'riseColor'"
                        />
                        <van-cell v-if='isLimit' :title="$t('trade.openOrderType')" :value="$t('trade.limitColseOrder')" />
                        <van-cell :title="$t('trade.closedPrice')" :value="`${res?.executePrice} ${product?.profitCurrency || ''}`" />
                        <!-- <van-cell :title="$t('trade.closeVolume')" :value="res?.tradeVolume + ' ' + $t('trade.volumeUnit')" /> -->
                        <van-cell
                            :title="isLimit ? $t('common.previewFee') : $t('trade.fee')"
                            :value="res?.fee ? `${res.fee} ${account.currency}` : '--'"
                        />
                    </div>
                    <div class='dialog-footer'>
                        <div class='popup-link'>
                            <a @click='handleJump'>
                                {{ $t('trade.tradeRecord') }}
                            </a>
                        </div>
                        <div class='popup-option'>
                            <van-button type='primary' @click='handleSucc'>
                                {{ $t('compLang.close') }}
                            </van-button>
                        </div>
                    </div>
                </div>
            </info>
        </template>
        <template v-else>
            <div v-if='!!closeVolumeWarn' class='floatTip'>
                {{ closeVolumeWarn }}
            </div>
            <div class='dialog-body'>
                <div>
                    <div class='flex justify-space-between mb-4'>
                        <div class='flex items-center'>
                            <van-tag
                                :color="Number(data.direction) === 1 ? 'var(--riseColor)' : 'var(--fallColor)'"
                                size='medium'
                                text-color='#fff'
                            >
                                {{ Number(data.direction) === 1 ? $t('trade.long') : $t('trade.short') }}
                            </van-tag>
                            <span class='text-base font-bold mx-2'>
                                {{ positionVolume }} {{ $t('trade.volumeUnit') }}
                            </span>
                            <van-tag v-if='data.crossLevelNum' color='var(--assistColor)' size='medium' text-color='var(--minorColor)'>
                                {{ data.crossLevelNum }}x
                            </van-tag>
                        </div>
                    </div>
                    <van-cell :title="$t('common.symbolName')" :value='data.symbolName' />
                    <van-cell :title='$t("trade.hold")' :value='data.symbolName'>
                        <div class='open-price'>
                            <van-tag
                                class='mr-2'
                                :color="Number(data.direction) === 1 ? 'var(--riseColor)' : 'var(--fallColor)'"
                                size='medium'
                                text-color='#fff'
                            >
                                {{ Number(data.direction) === 1 ? $t('trade.long') : $t('trade.short') }}
                            </van-tag>
                            {{ positionVolume }} {{ $t('trade.volumeUnit') }}
                        </div>
                    </van-cell>
                    <van-cell :title="$t('trade.positionPrice')" :value='data.openPrice' />
                    <van-cell :title='$t("trade.currentPrice")'>
                        <div v-if='product?.isMakingMatch' :class="[product?.last_color || '']">
                            {{ product?.rolling_last_price || '--' }}
                        </div>
                        <div v-else :class='[Number(data.direction) === 1 ? product.sell_color : product.buy_color]'>
                            {{ (Number(data.direction) === 1 ? product.sell_price : product.buy_price) || '--' }}
                        </div>
                    </van-cell>
                    <!-- <van-cell :title="$t('trade.initialMargin')" :value='data.openPrice'>
                        <div v-if='data.occupyTheMargin'>
                            {{ `${data.occupyTheMargin} ${(account && account.currency) || ''}` }}
                        </div>
                        <div v-else>
                            --
                        </div>
                    </van-cell>
                    <van-cell :title="$t('trade.warehouseValue')" :value='warehouseValue' />
                    <van-cell v-if='evaluateNetPnl?.length' :title="$t('trade.netPL')">
                        <span :class="parseFloat(evaluateNetPnl) > 0 ? 'riseColor' : 'fallColor'">
                            {{ `${evaluateNetPnl} ${(account && account.currency) || ''}` }}
                        </span>
                    </van-cell>
                    <van-cell v-else :title="$t('trade.netPL')">
                        --
                    </van-cell> -->
                </div>

                <!-- <van-cell :title='$t("trade.closedNumHands")' />
                <van-cell>
                    <Stepper
                        v-model='closeVolume'
                        class='stepper'
                        :digits='volumeDigit'
                        :max='positionVolume'
                        :min='product.minVolume'
                        :placeholder="$t('trade.positionNum')"
                        :step='product.volumeStep'
                        @change='change'
                    />
                </van-cell> -->
                <div class='text-lg font-bold mt-4'>
                    {{ $t('trade.closed') }}
                </div>
                <van-cell>
                    <div class='pcBtns mt-2'>
                        <a
                            v-for='(item, i) in fastBtns'
                            :key='i'
                            class='item'
                            :class='{ active: item.activeIndex === fastBtnIndex }'
                            href='javascript:;'
                            @click='fastVolumeHandler(item)'
                        >
                            {{ item.title }}
                        </a>
                    </div>
                </van-cell>

                <van-cell v-if='isLimit' :title="$t('trade.closePrice')" />
                <van-cell v-if='isLimit'>
                    <Stepper
                        v-model='brequestPrice'
                        class='stepper'
                        :digits='product.symbolDigits'
                        :placeholder="$t('common.input')"
                        :step='1'
                    />
                </van-cell>

                <div class='info'>
                    <!-- <div class='row'>
                  <div class='name'>
                      {{ $t('trade.closeProfit') }}
                  </div>
                  <div class='val'>
                      {{ data.profitLoss>0 ? data.profitLoss : data.profitLoss }} {{ customerInfo.currency }}
                  </div>
              </div> -->
                    <!-- <div class='row'>
                  <div class='name'>
                      {{ $t('trade.swap') }}
                  </div>
                  <div class='val'>
                      -- {{ customerInfo.currency }}
                  </div>
              </div> -->
                    <div v-if='data.closeFreeDigits' class='row'>
                        <div class='name'>
                            {{ $t('trade.fee') }}
                        </div>
                        <div class='val'>
                            {{ data.closeFreeDigits + customerInfo.currency }}
                        </div>
                    </div>
                </div>
            </div>
            <div class='dialog-footer'>
                <div class='popup-option'>
                    <van-button @click='closed'>
                        {{ $t('cancel') }}
                    </van-button>
                    <van-button :loading='loading' :loading-text="$t('confirm')" type='primary' @click='submitCloseHandler'>
                        {{ $t('confirm') }}
                    </van-button>
                </div>
            </div>
        </template>
    </popup>
</template>

<script>
import { reactive, toRefs, computed, watchEffect, watch, onMounted, onUnmounted } from 'vue'
import { div, gt, lt, minus, mul, plus, lte, toFixed } from '@/utils/calculation'
import { useStore } from 'vuex'
import Stepper from '@plans/components/stepper'
import BigNumber from 'bignumber.js'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { addMarketOrder, positionCalculation } from '@/api/trade'
import { Toast } from 'vant'
import { firebaseAnalytics } from '@/utils/firebase'
import { isDemoAccount } from '@/utils/util'

import popup from '@/themeCommon/components/trade/components/popup.vue'
import info from '@/themeCommon/components/trade/components/info.vue'
import mitt from '@/utils/mitt'

export default {
    components: {
        Stepper,
        popup,
        info,
    },
    props: ['show', 'product', 'data'],
    emits: ['update:show'],
    setup (props, context) {
        const store = useStore()
        const router = useRouter()
        const route = useRoute()
        const { t } = useI18n({ useScope: 'global' })

        const fastBtns = [
            { title: t('trade.allPosition'), activeIndex: 1, divValue: 1 },
            { title: '1/2', activeIndex: 2, divValue: 2 },
            { title: '1/3', activeIndex: 3, divValue: 3 },
            { title: '1/4', activeIndex: 4, divValue: 4 },
        ]
        const state = reactive({
            showCP: true,
            loading: false,
            fastBtnIndex: 1,
            closeVolume: '',
            step: 0, // 0操作页 1加载  2成功
            res: {}, // 返回结果
            /** 是否限价平仓 */
            isLimit: 0,
            /** 平仓价格 */
            brequestPrice: '',
            /** 预计净盈亏 */
            evaluateNetPnl: '',
            timer: null,
        })
        // 产品数据
        const product = computed(() => store.state._quote.productMap[props.data.symbolId + '_' + props.data.tradeType] || {})
        /** 是否是逐仓合约，成交模式是【合约撮合】 */
        const isContractMatching = computed(() => product.value && product.value.dealMode === 6 && product.value.tradeType === 2)
        const account = computed(() =>
            store.state._user.customerInfo.accountList.find((item) => Number(item.tradeType) === Number(props.data.tradeType)),
        )
        const customerInfo = computed(() => store.state._user.customerInfo)
        const volumeDigit = computed(() => props.product.numberDigits)
        const positionVolume = computed(() => minus(props.data?.openVolume, props.data?.closeVolume))
        const positionVolumeMin = computed(() => props.product.minVolume)
        const closeVolumeWarn = computed(() => {
            // 检测平仓手数是否合法
            const minVolume = props.product?.minVolume ?? 0
            const volumeStep = props.product?.volumeStep ?? minVolume
            const closeVolume = state.closeVolume
            const mod = BigNumber(closeVolume).minus(minVolume).mod(volumeStep).toNumber()

            if (lte(positionVolume.value, minVolume) && lt(closeVolume, positionVolume.value)) {
                return t('trade.closePositionTip', [minVolume])
            } else if (gt(closeVolume, positionVolume.value)) {
                return t('trade.closePositionTip2', [positionVolume.value])
            } else if (gt(positionVolume.value, minVolume) && lt(closeVolume, minVolume)) {
                return t('trade.closePositionTip3', [minVolume])
            } else if (mod > 0 && closeVolume !== positionVolume.value) {
                return t('trade.volumesOutScopeTip', { volume: volumeStep })
            } else {
                return false
            }
        })

        const change = () => {
            state.fastBtnIndex = ''
        }

        // 平仓接口参数
        const submitCloseParam = () => {
            if (!state.closeVolume) {
                Toast(t('trade.inputCloseNum'))
                return false
            }
            if (state.isLimit && !state.brequestPrice) {
                Toast(t('trade.closePriceTips'))
                return
            }
            if (closeVolumeWarn.value) return false
            const requestPrice = props.data.direction === 1 ? props.product.sell_price : props.product.buy_price
            const direction = props.data.direction === 1 ? 2 : 1
            const p = Math.pow(10, props.product.price_digits)
            const params = {
                bizType: state.isLimit ? 14 : 2, // 业务类型。0-默认初始值；1-市价开；2-市价平；3-止损平仓单；4-止盈平仓单；5-爆仓强平单；6-到期平仓单；7-销户平仓单；8-手动强平单；9-延时订单；10-限价预埋单；11-停损预埋单；
                direction, // 订单买卖方向。1-买；2-卖；
                positionId: props.data.positionId,
                symbolId: props.product.symbolId,
                requestTime: Date.now(),
                requestNum: state.closeVolume,
                requestPrice: state.isLimit ? mul(state.brequestPrice, p) : mul(requestPrice, p),
                expireType: props.data.expireType,
                stopLoss: props.data.stopLoss,
                takeProfit: props.data.takeProfit,
                tradeType: props.data.tradeType,
                accountId: account.value.accountId,
                accountCurrency: account.value.currency,
                accountDigits: account.value.digits,
            }
            return params
        }
        // 平仓
        const submitCloseHandler = () => {
            const params = submitCloseParam()
            if (!params) return false
            state.loading = true
            addMarketOrder(params)
                .then((res) => {
                    state.loading = false
                    if (res.check()) {
                        const data = res.data
                        const localData = Object.assign({}, params, data)
                        const orderId = data.orderId || data.id
                        sessionStorage.setItem('order_' + orderId, JSON.stringify(localData))
                        // 限价平仓单，第一步点击确认后，不需要进行转圈圈，直接进行第二步
                        // state.step = state.isLimit ? 2 : 1
                        state.res = res.data
                        handleSucc()
                        const { phone, email, emailAll, phoneAll } = customerInfo?.value || {}
                        firebaseAnalytics('trade_record', {
                            key: 'trade_record',
                            value: JSON.stringify({
                                trade_record_method: 'close',
                                trade_record_lot: state.closeVolume,
                                trade_record_account: isDemoAccount() ? 'demo' : 'real',
                                email: emailAll || email || '',
                                phone: phoneAll || phone || '',
                            }),
                        })
                        clearInterval(state.timer)
                    } else {
                        Toast(res.msg)
                    }
                })
                .catch((err) => {
                    state.loading = false
                })
        }
        const closed = () => {
            // 关闭弹出层且动画结束后触发
            context.emit('update:show', false)
            clearInterval(state.timer)
            state.step = 0
            state.fastBtnIndex = 1
            state.isLimit = 0
            state.brequestPrice = ''
        }

        // 快速设置平仓手数
        const fastVolumeHandler = (item) => {
            const minVolume = props.product.minVolume
            const volumeStep = props.product.volumeStep
            state.fastBtnIndex = item.activeIndex
            if (BigNumber(positionVolume.value).lte(minVolume) && state.fastBtnIndex !== 1) {
                state.closeVolume = positionVolume.value
                state.fastBtnIndex = 1
                Toast(t('trade.closePositionTip', [minVolume]))
            } else if (parseFloat(item.divValue) === 1) {
                state.closeVolume = positionVolume.value
            } else {
                const calcVolume = minus(positionVolume.value, minVolume)
                const fastVolume = div(calcVolume, item.divValue)
                const validVolume = BigNumber(fastVolume).div(volumeStep).integerValue(BigNumber.ROUND_DOWN).times(volumeStep).toString()
                state.closeVolume = plus(validVolume, minVolume)
            }
        }

        const goList = () => {
            router.replace({
                path: '/list',
                query: {
                    tradeType: props.data.tradeType,
                    active: 'deal',
                },
            })
        }

        // 关闭回调
        const handleSucc = () => {
            if (route.path === '/positionDetail') {
                router.go(-1)
            }
            closed()
        }

        // 查看记录
        const handleJump = () => {
            closed()
            // 当前是交易页则直接切换tab
            if (route.path === '/order') {
                mitt.emit('OrderRecord', 'deal')
            } else {
                goList()
            }
        }

        /** 预计净盈亏试算 */
        const positionCalculationRequest = () => {
            if (state.fastBtnIndex === -1) return
            positionCalculation({
                tradeType: props.data.tradeType,
                accountId: account.value.accountId,
                tradeVolume: state.closeVolume,
                positionId: props.data.positionId,
            }).then((res) => {
                state.evaluateNetPnl = res?.data?.evaluateNetPnl
            })
        }

        watch(
            () => props.show,
            () => {
                if (props.show) {
                    state.timer = setInterval(() => {
                        positionCalculationRequest()
                    }, 1000)
                } else {
                    clearInterval(state.timer)
                }
            },
            {
                immediate: true,
            },
        )

        watchEffect(() => {
            state.showCP = props.show
            if (props.show) {
                state.closeVolume = positionVolume.value
            }
        })

        /** 平仓价值：百分比计算出来的平仓手数*合约大小*当前产品的价格 */
        const warehouseValue = computed(() => {
            const contractSize = props.product.contractSize
            // 当前产品的价格
            const currentPrice = Number(props.data.direction) === 1 ? props.product.sell_price : props.product.buy_price
            if (!state.closeVolume || !contractSize || !currentPrice) return '--'
            return (
                toFixed(mul(mul(state.closeVolume, contractSize), currentPrice), account.value.digits) + ' ' + props.product.profitCurrency
            )
        })

        onMounted(() => {
            // 收到撮合市价平仓成交消息时需同时更新平仓手数和平仓价格
            mitt.on('POSITION_CLOSE', (paramMap) => {
                if (isContractMatching.value) {
                    state.res.tradeVolume = paramMap?.dealAmount || ''
                    state.res.executePrice = paramMap?.dealPrice || ''
                    state.step = 2
                }
            })
        })

        onUnmounted(() => {
            mitt.off('POSITION_CLOSE')
        })

        return {
            ...toRefs(state),
            fastBtns,
            closed,
            volumeDigit,
            positionVolume,
            positionVolumeMin,
            closeVolumeWarn,
            fastVolumeHandler,
            change,
            submitCloseHandler,
            customerInfo,
            handleSucc,
            handleJump,
            account,
            minus,
            isContractMatching,
            warehouseValue,
        }
    },
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.floatTip {
    position: absolute;
    top: rem(12px);
    left: 0;
    width: 100%;
    padding: 0 rem(8px);
    min-height: rem(50px);
    color: var(--warn);
    line-height: rem(50px);
    text-align: center;
    background: #fff0e2;
    transform: translateY(-100%);
}
.stepper {
    background: var(--assistColor);
    border-radius: rem(6px);
    &.warn {
        color: var(--warn);
    }
}
.dialog-header {
    padding: rem(30px) 0;
    text-align: center;
    .productName {
        color: var(--color);
    }
    .title {
        font-size: rem(32px);
    }
    .lot {
        color: #999;
        font-size: rem(20px);
        text-align: center;
    }
    .right {
        position: absolute;
        top: 0;
        right: 0;
        padding: rem(35px) rem(25px) rem(25px) rem(25px);
        color: var(--normalColor);
        font-size: rem(28px);
    }
}
.pcBtns {
    display: flex;
    justify-content: space-evenly;
    .item {
        display: inline-block;
        width: rem(120px);
        height: rem(45px);
        margin-right: rem(30px);
        color: var(--color);
        line-height: rem(45px);
        text-align: center;
        background: var(--assistColor);
        border-radius: rem(6px);
        flex: 1;
        margin-right: 15px;
        &:last-child {
            margin-right: 0;
        }
        &.active {
            color: #fff;
            background: var(--primary);
        }
    }
}
.dialog-footer {
    .popup-link {
        display: flex;
        align-items: center;
        justify-content: center;
        a {
            cursor: pointer;
            color: var(--primary);
            &:hover {
                opacity: 0.8;
            }
        }
    }
    .popup-option {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px 20px;
        @media screen and (max-width: 768px) {
            padding: 10px 0;
        }
        .van-button {
            flex: 1;
            &:nth-child(2) {
                margin-left: 20px;
            }
            &.van-button--default {
                border-color: var(--primary);
                color: var(--primary);
                background: transparent;
                &:active::before {
                    border-color: transparent;
                    background: none;
                    opacity: 0.8;
                }
            }
        }
    }
}
.m-dialogPC {
    z-index: 1000;
    overflow: visible;
    .dialog-body {
        position: relative;
        flex: none;
        :deep(.van-cell) {
            padding: 4px 0;
            &::after {
                display: none;
            }
        }
        .inputNumber {
            .title {
                color: var(--color);
                font-size: rem(28px);
                margin-bottom: rem(24px);
            }
            .tipNumber {
                color: #666;
                font-size: rem(24px);
                &.warn {
                    color: var(--warn);
                }
            }
            .tipWords {
                position: absolute;
                bottom: rem(-30px);
                left: rem(330px);
                color: var(--warn);
                font-size: rem(24px);
            }
            .name {
                color: #999;
                font-size: rem(24px);
            }
            .open-price {
                color: var(--color);
            }
            .right {
                display: flex;
                flex: 1;
                justify-content: space-between;
                .line {
                    position: relative;
                    flex: 1;
                    .lineInfo {
                        margin: 0 rem(40px);
                        padding-top: rem(20px);
                        padding-bottom: rem(10px);
                        text-align: center;
                        border-color: #999;
                    }
                }
            }
        }
        .direction {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            border-radius: rem(6px);
            width: 20px;
            height: 20px;
            color: #fff;
            text-align: center;
            font-size: 12px;
            margin-right: rem(10px);
            &.riseColor {
                background: var(--riseColor);
            }
            &.fallColor {
                background: var(--fallColor);
            }
        }
        .info {
            margin: 0 rem(40px) rem(20px) rem(35px);
            color: #999;
            font-size: rem(20px);
            .row {
                display: flex;
                justify-content: space-between;
            }
            .name {
                padding-bottom: rem(8px);
            }
            .val {
                flex: 1;
                text-align: right;
            }
        }
        .step-2 {
            padding-bottom: rem(60px);
            color: #333;
            font-size: rem(28px);
            text-align: center;
        }
    }
}
.popup-list {
    .van-cell {
        padding: 0 0 10px;
        &::after {
            content: none;
        }
        :deep {
            .van-cell__value {
                &.fallColor {
                    color: var(--fallColor);
                }
                &.riseColor {
                    color: var(--riseColor);
                }
            }
        }
    }
}
.loading {
    padding: 40px 0;
}
.orderType {
    :deep {
        > .van-tabs__wrap {
            height: auto;
        }
        .van-tabs__nav {
            display: flex;
            background-color: var(--assistColor);
            padding: 4px;
            margin: 0;
            border-radius: 5px;
            border: 1px solid var(--lineColor);
            height: 34px;
        }
        .van-tab--card {
            border-right: 0;
            .van-tab__text {
                &:hover {
                    opacity: 0.8;
                }
            }
            &.van-tab--active {
                border-radius: 4px;
                background-color: var(--contentColor);
                .van-tab__text {
                    color: var(--color);
                    &:hover {
                        opacity: 1;
                    }
                }
            }
        }
    }
}
</style>

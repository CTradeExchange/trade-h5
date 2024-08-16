<template>
    <popup
        v-model:show='show'
        :closeable='step > 0 ? false : true'
        :position="$isPC ? 'center' : 'bottom'"
        :title="$t('trade.closeOrder')"
        @close='close'
    >
        <van-tabs v-if='step === 0 && product?.isContractMatching' v-model:active='isLimit' class='orderType mb-4 px-3' type='card'>
            <van-tab :title="$t('trade.orderType8')" />
            <van-tab :title="$t('trade.orderType9')" />
        </van-tabs>
        <template v-if='step === 1'>
            <info class='popup-info' :status='2' :text="$t('trade.closedSuccess')">
                <!-- 延时单不显示列表 -->
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
                        <van-cell
                            :title="isLimit ? $t('common.previewFee') : $t('trade.fee')"
                            :value="res?.fee ? `${res.fee} ${currency}` : '--'"
                        />
                    </div>
                    <div class='dialog-footer'>
                        <div class='popup-link'>
                            <a @click='handleJump'>
                                {{ $t('trade.tradeRecord') }}
                            </a>
                        </div>
                        <div class='popup-option'>
                            <van-button type='primary' @click='close'>
                                {{ $t('compLang.close') }}
                            </van-button>
                        </div>
                    </div>
                </div>
            </info>
        </template>
        <template v-else>
            <div class='body-module'>
                <div>
                    <div class='flex justify-space-between mb-4'>
                        <div class='flex items-center'>
                            <van-tag
                                :color="Number(data.direction) === 1 ? 'var(--riseColor)' : 'var(--fallColor)'"
                                size='medium'
                                style='--van-tag-border-radius: 4px'
                                text-color='#fff'
                            >
                                {{ Number(data.direction) === 1 ? 'L' : 'S' }}
                            </van-tag>
                            <span class='text-base font-bold mx-2'>
                                {{ data.symbolName }}
                            </span>
                            <van-tag v-if='data.crossLevelNum' color='var(--assistColor)' size='medium' text-color='var(--color) '>
                                {{ data.crossLevelNum }}x
                            </van-tag>
                        </div>
                    </div>

                    <van-cell :title="$t('tradeType.3')">
                        {{ data.occupyTheMargin }} {{ currency }}
                    </van-cell>

                    <van-cell :title="$t('trade.leverage')">
                        {{ data.crossLevelNum }}X
                    </van-cell>

                    <van-cell :title="$t('headLineTrade.positionSize')">
                        <div>
                            <div>
                                {{ data.currentTradeAmount ? `${data.currentTradeAmount} ${currency}` : '--' }}
                            </div>
                            <div class='text-minorColor text-xs'>
                                {{ `${toFixed(div(data.currentTradeAmount, data.openPrice), product.numberDigits, 1)} ${product.numberCurrency}` }}
                            </div>
                        </div>
                    </van-cell>

                    <van-cell class='mt-4' :title="$t('headLineTrade.entryPrice')">
                        {{ data.openPrice }}
                    </van-cell>

                    <van-cell :title="$t('trade.currentPrice')">
                        <span :class='product?.cur_color'>
                            {{ product?.cur_price || '--' }}
                        </span>
                    </van-cell>

                    <van-cell class='mt-4' :title="$t('trade.profit')">
                        <span :class='{ riseColor: gt(data.profitLoss, 0), fallColor: lt(data.profitLoss, 0) }'>
                            {{ data.profitLoss > 0 ? data.profitLoss : data.profitLoss }} {{ currency }}
                        </span>
                    </van-cell>

                    <van-cell :title="$t('headLineTrade.closeFees')">
                        <div v-if='feeRate'>
                            <span>
                                {{ `${fee} ${currency} ` }}
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
                                            {{ `${mul(data.occupyTheMargin, data.crossLevelNum)} ${currency}` }} * {{ feeRate }} =
                                            {{ `${fee} ${currency}` }}
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
                    </van-cell>

                    <van-cell :title="$t('headLineTrade.interest')">
                        {{ data.interest ? `${data.interest} ${currency}` : '--' }}
                    </van-cell>

                    <van-cell :title="$t('trade.netPL')">
                        <popover placement='right'>
                            <template #default>
                                <div>
                                    <div class='flex justify-space-between items-center'>
                                        <span class='mr-15' :class="!$isPC ? 'text-base font-bold' : ''">
                                            {{ $t('trade.netPL') }}
                                        </span>
                                        <span :class="!$isPC ? 'text-base font-bold' : ''">
                                            {{
                                                `${$t('assets.profit')} - ${$t('headLineTrade.closeFees')} + ${$t(
                                                    'headLineTrade.interest',
                                                )}`
                                            }}
                                        </span>
                                    </div>
                                    <div class='text-right mt-2 font-bold text-sm'>
                                        {{ `${data.profitLoss} - ${fee} ${gt(data.interest, 0) ? '+' : '-'} ${Math.abs(data.interest)} = ` }}
                                        {{ `${netPL} ${currency}` }}
                                    </div>
                                </div>
                            </template>
                            <template #reference>
                                <span class='tooltip-cursor' :class='{ riseColor: gt(netPL, 0), fallColor: lt(netPL, 0) }'>
                                    {{ netPL }} {{ currency }}
                                </span>
                            </template>
                        </popover>
                    </van-cell>
                </div>
            </div>
            <div class='mt-10 flex justify-space-between'>
                <van-button class='flex-1 mr-4' plain type='primary' @click='close'>
                    {{ $t('cancel') }}
                </van-button>
                <van-button
                    class='flex-1'
                    :loading='isSubmit'
                    :loading-text="$t('trade.closeOrder')"
                    type='primary'
                    @click='submitCloseHandler'
                >
                    {{ $t('trade.closeOrder') }}
                </van-button>
            </div>
        </template>
    </popup>
</template>

<script>
import { reactive, toRefs, computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { pow, minus, plus, mul, div, gt, lt, toFixed } from '@/utils/calculation'
import { Toast } from 'vant'
import { addMarketOrder } from '@/api/trade'
import popup from '@/themeCommon/components/trade/components/popup.vue'
import info from '@/themeCommon/components/trade/components/info.vue'
import mitt from '@/utils/mitt'
import { useRoute, useRouter } from 'vue-router'
import BigNumber from 'bignumber.js'
import { toast } from 'vue3-toastify'
import { useAssets } from '@/hooks/assets'

export default {
    components: {
        popup,
        info,
    },
    setup () {
        const store = useStore()
        const router = useRouter()
        const route = useRoute()
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            // 是否显示弹窗
            show: false,
            // 提交状态
            isSubmit: false,
            // 持仓数据
            data: {},
            // 数量
            count: '',
            // 按钮选项
            tabs: [
                { title: t('trade.allPosition'), value: 1, divValue: 1 },
                { title: '1/2', value: 2, divValue: 2 },
                { title: '1/3', value: 3, divValue: 3 },
                { title: '1/4', value: 4, divValue: 4 },
            ],
            // 当前选项卡
            currentValue: 1,
            // 平仓结果
            res: {},
            // 进度 1 loading 2 成功页
            step: 0,
            // 平仓价格
            brequestPrice: '',
            // 是否限价平仓
            isLimit: 0,
            timer: null,
        })
        // 产品数据
        const product = computed(() => store.state._quote.productMap[state.data.symbolId + '_' + state.data.tradeType] || {})
        // 持有手数
        const positionVolume = computed(() => minus(state.data.openVolume, state.data.closeVolume))
        // 手续费
        const fee = computed(() => {
            if (product.value?.feeRate === undefined) return null
            return toFixed(mul(mul(state.data.occupyTheMargin, state.data.crossLevelNum), product.value.feeRate), account?.value.digits)
        })

        // 手续费率
        const feeRate = computed(() => {
            if (['1', '3'].includes(product.value.feeFormula)) {
                if (product.value?.feeRate === undefined) return null
                return toFixed(mul(product.value.feeRate, 100), 4, 1) + '%'
            }
            return null
        })

        // 手数小数位
        const volumeDigit = computed(() => product.value.numberDigits)
        // Net P/L=P/L-close fees+interests
        const netPL = computed(() => plus(minus(state.data.profitLoss || 0, fee.value || 0), state.data.interest || 0))
        // 账户信息
        const account = useAssets()
        const currency = account.value?.currency || ''

        // 打开弹窗
        const open = (row) => {
            store.dispatch('_quote/querySymbolInfo', {
                symbolId: row.symbolId,
                tradeType: row.tradeType,
            })
            state.step = 0
            state.data = row
            state.currentValue = 1
            state.count = positionVolume.value
            state.isSubmit = false
            state.isLimit = 0
            state.show = true
            state.brequestPrice = ''
        }

        // 关闭弹窗
        const close = () => {
            state.show = false
            clearInterval(state.timer)
        }

        const change = () => {
            state.currentValue = ''
        }

        // 快速设置平仓手数
        const volumeHandler = (item) => {
            const minVolume = product.value.minVolume
            const volumeStep = product.value.volumeStep
            state.currentValue = item.value
            if (BigNumber(positionVolume.value).lte(minVolume) && state.currentValue !== 1) {
                state.count = positionVolume.value
                state.currentValue = 1
                Toast(t('trade.closePositionTip', [minVolume]))
            } else if (BigNumber(positionVolume.value).eq(minVolume)) {
                state.count = positionVolume.value
                state.currentValue = 1
                Toast(t('trade.closePositionTip2', [minVolume]))
            } else if (parseFloat(item.divValue) === 1) {
                state.count = positionVolume.value
            } else {
                const calcVolume = minus(positionVolume.value, minVolume)
                const fastVolume = div(calcVolume, item.divValue)
                const validVolume = BigNumber(fastVolume).div(volumeStep).integerValue(BigNumber.ROUND_DOWN).times(volumeStep).toString()
                state.count = plus(validVolume, minVolume)
            }
        }

        // 平仓接口参数
        const submitCloseParam = () => {
            if (!state.count) {
                Toast(t('trade.inputCloseNum'))
                return
            }
            if (state.isLimit && !state.brequestPrice) {
                Toast(t('trade.closePriceTips'))
                return
            }
            const data = state.data
            const requestPrice = data.direction === 1 ? product.value.sell_price : product.value.buy_price
            const direction = data.direction === 1 ? 2 : 1
            const p = pow(10, product.value.price_digits)
            const params = {
                bizType: state.isLimit ? 14 : 2, // 业务类型。0-默认初始值；1-市价开；2-市价平；3-止损平仓单；4-止盈平仓单；5-爆仓强平单；6-到期平仓单；7-销户平仓单；8-手动强平单；9-延时订单；10-限价预埋单；11-停损预埋单；14-限价单
                direction, // 订单买卖方向。1-买；2-卖；
                positionId: data.positionId,
                symbolId: product.value.symbolId,
                requestTime: Date.now(),
                requestNum: state.count,
                requestPrice: state.isLimit ? mul(state.brequestPrice, p) : mul(requestPrice, p),
                expireType: data.expireType,
                stopLoss: data.stopLoss,
                takeProfit: data.takeProfit,
                tradeType: data.tradeType,
                accountId: account.value.accountId,
                accountCurrency: account.value.currency,
                accountDigits: account.value.digits,
            }
            return params
        }

        // 确认平仓
        const submitCloseHandler = () => {
            const params = submitCloseParam()
            if (!params) return

            state.isSubmit = true
            addMarketOrder(params)
                .then((res) => {
                    state.isSubmit = false
                    if (res.check()) {
                        toast.success(`<div class="text-sm font-bold mb-1 text-color">${t('common.tradeSuccess')}</div>`, {
                            dangerouslyHTMLString: true,
                        })
                        close()
                        state.res = res.data
                        queryPositionList()
                        store.dispatch('_trade/tradeRecordList')
                    } else {
                        Toast(res.msg)
                    }
                })
                .catch((res) => {
                    state.isSubmit = false
                    Toast(res.msg)
                })
        }

        // 获取持仓列表
        const queryPositionList = () => {
            const data = state.data
            const accountId = account.value.accountId
            store.dispatch('_trade/queryPositionPage', {
                tradeType: data.tradeType,
                sortFieldName: 'openTime',
                sortType: 'desc',
                accountId,
            })
        }

        // 查看记录
        const handleJump = () => {
            close()
            if (route.path === '/order') {
                mitt.emit('OrderRecord', 'deal')
            } else {
                // 成交记录
                router.push({
                    path: '/transRecords',
                    query: {
                        tradeType: state.data?.tradeType || 2,
                    },
                })
            }
        }

        return {
            ...toRefs(state),
            open,
            close,
            product,
            positionVolume,
            volumeDigit,
            volumeHandler,
            submitCloseHandler,
            change,
            handleJump,
            account,
            minus,
            gt,
            lt,
            fee,
            feeRate,
            currency,
            mul,
            netPL,
            div,
            toFixed
        }
    },
}
</script>

<style lang="scss" scoped>
.body-module {
    --van-cell-horizontal-padding: 0;
    --van-cell-vertical-padding: 4px;
    :deep(.van-cell) {
        padding-left: 0;
        .van-cell__title {
            color: var(--minorColor);
        }
        .van-cell__value {
            color: var(--color);
            font-weight: bold;
        }
        &::after {
            display: none;
        }
    }
    .row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 25px;
        font-size: 14px;
        .col {
            display: inline-flex;
            flex-direction: column;
            .name {
                color: var(--minorColor);
            }
            .value {
                margin-top: 5px;
                span {
                    margin-right: 3px;
                }
            }
        }
    }
    .handle-action {
        display: flex;
        justify-content: space-between;
        .title {
            color: var(--minorColor);
            font-size: 14px;
        }
        .stepper {
            background: var(--assistColor);
            border-radius: 5px;
        }
    }
    .tabs {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .item {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 60px;
            height: 25px;
            font-size: 13px;
            background: var(--assistColor);
            border-radius: 2px;
            cursor: pointer;
        }
        .item-active {
            background: var(--primary);
            color: #fff;
        }
    }
}
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
    padding-top: 12px;
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
.popup-list {
    padding: 0 20px;
    .van-cell {
        padding: 0 0 10px;
        &::after {
            content: none;
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
            background-color: var(--bgColor);
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

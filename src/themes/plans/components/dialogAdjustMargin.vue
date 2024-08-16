<template>
    <van-popup
        v-model:show='showDialog'
        class='m-dialogAdjust custom-popup'
        :duration='0.2'
        position='bottom'
        round
        teleport='body'
        :transition-appear='true'
        @closed='closed'
    >
        <div class='header'>
            <div class='header-title'>
                {{ $t('trade.modifyMargin') }}
            </div>
            <i class='icon_guanbi' @click="$emit('update:show', false)"></i>
        </div>

        <div class='dialog-body'>
            <p class='title text-xs flex' v-html="$t('trade.modifySymbolNameMargin', { name: data.symbolName })"></p>
            <div class='input-wrap focus-within'>
                <span class='fl' @click='operation'>
                    <!-- <img alt='' src='../images/transfer.png' srcset='' /> -->
                    <i class='icon icon_qiehuan1'></i>
                    <span class='oper-text'>
                        {{ operText }}
                    </span>
                </span>
                <span class='line'></span>
                <input v-model='amount' class='input' :placeholder="$t('trade.modifyAmount')" type='number' />
                <span class='all' @click='handleAll'>
                    {{ $t('common.all') }}
                </span>
            </div>
            <p class='desc text-xs'>
                <span v-if='operType' class='flex'>
                    {{ $t('trade.maxRaise') }}:
                    <p class='ml-1 text-color'>
                        {{ accountInfo?.available }} {{ accountInfo?.currency }}
                    </p>
                </span>
                <span v-else class='flex'>
                    {{ $t('trade.maxReduce') }}:
                    <p class='ml-1 text-color'>
                        {{ positionData?.canReduceMargin }} {{ accountInfo?.currency }}
                    </p>
                </span>
            </p>
            <div class='mt-4'>
                <van-cell :title="$t('trade.originalMargin')" :value="positionData?.occupyTheMargin || '--'" />
                <van-cell :title="$t('trade.marginBalance')" :value='marginBalance || "--"' />
                <van-cell :title="$t('trade.holdMargin')" :value="positionData?.maintenanceMargin || '--'" />
            </div>
            <div v-if='amount' class='mt-4'>
                <van-cell :title="$t('trade.newMaginUsed')" :value="newMaginUsed || '--'" />
                <van-cell :title="$t('trade.newMarginBalance')" :value="newMarginBalance || '--'" />
                <van-cell :title="$t('trade.newEstLiquidationPrice')" :value="evaluateClosePrice || '--'" />
            </div>
            <div v-else class='mt-4'>
                <van-cell :title="$t('trade.newMaginUsed')" value='--' />
                <van-cell :title="$t('trade.newMarginBalance')" value='--' />
                <van-cell :title="$t('trade.newEstLiquidationPrice')" value='--' />
            </div>
        </div>
        <div class='dialog-footer'>
            <van-button block class='pcHandler' :loading='loading' @click='submitAdjustMargin'>
                {{ $t('common.sure') }}
            </van-button>
        </div>
    </van-popup>
</template>

<script>
import { reactive, toRefs, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { Toast } from 'vant'
import { updateOccupyTheMargin } from '@/api/user'
import { isEmpty } from '@/utils/util'
import { pow, minus, plus } from '@/utils/calculation'
import { positionCalculation } from '@/api/trade'
import { useAssets } from '@/hooks/assets'
import { useRoute } from 'vue-router'

export default {
    props: ['show', 'data'],
    emits: ['update:show'],
    setup (props, context) {
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const assetsInfo = useAssets()
        const route = useRoute()
        const state = reactive({
            showDialog: false,
            loading: false,
            amount: '',
            operType: true,
            operText: t('trade.raise'),
            // 预计强平价格
            evaluateClosePrice: '',
            timer: null,
        })

        const tradeType = computed(() => store.state._quote.curTradeType || route.query.tradeType)

        // 获取账户
        const accountInfo = computed(() =>
            store.state._user.customerInfo.accountList.find((item) => Number(item.tradeType) === Number(tradeType.value)),
        )

        const positionData = computed(() => {
            return store.state._trade.positionList[tradeType.value]?.find((item) => item.positionId === props.data.positionId)
        })

        watch(
            () => props.show,
            (val) => {
                state.showDialog = props.show
                if (val) {
                    store.dispatch('_user/findCustomerInfo', false)
                    state.timer = setInterval(() => {
                        calculationBurstPriceRequest()
                    }, 1000)
                } else {
                    clearInterval(state.timer)
                }
            },
        )

        const closeHandler = () => {
            state.showDialog = false
        }

        const operation = () => {
            state.operType = !state.operType
            state.amount = ''

            if (state.operType) {
                store.dispatch('_user/findCustomerInfo', false)
            } else {
                store.dispatch('_trade/queryPositionPage', {
                    tradeType: tradeType.value,
                    hideLoading: true,
                    accountId: accountInfo.value.accountId,
                })
            }
            state.operText = state.operType ? t('trade.raise') : t('trade.reduce')
        }

        const handleAll = () => {
            if (state.operType) {
                state.amount = accountInfo.value.available
            } else {
                state.amount = positionData.value?.canReduceMargin
            }
        }

        // 调整保证金
        const submitAdjustMargin = () => {
            if (isEmpty(state.amount) || parseFloat(state.amount) === 0) {
                return Toast(t('trade.enterMarginAmountRequire'))
            }

            if (parseFloat(state.amount) < 0) {
                return Toast(t('trade.enterMarginAmountTip'))
            }

            state.loading = true
            // 处理金额*10 小数位次方
            const margin = state.operType ? parseFloat(state.amount) : -parseFloat(state.amount)
            const occupyTheMargin = margin * pow(10, props.data.openAccountDigits)

            const params = {
                tradeType: tradeType.value,
                accountId: accountInfo.value.accountId,
                positionId: props.data.positionId,
                accountDigits: props.data.openAccountDigits,
                occupyTheMargin,
                orderId: props.data.orderId,
                remark: '',
                resp: '',
            }

            updateOccupyTheMargin(params)
                .then((res) => {
                    state.loading = false
                    if (res.check()) {
                        Toast(t('common.submitSuccess'))
                        state.operType = true
                        state.operText = t('trade.raise')
                        state.amount = ''
                        state.showDialog = false
                        store.dispatch('_trade/queryPositionPage', {
                            tradeType: tradeType.value,
                            accountId: accountInfo.value.accountId,
                            sortFieldName: 'openTime',
                            sortType: 'desc',
                        })
                    }
                })
                .catch((res) => {
                    state.loading = false
                    Toast(res.msg)
                })
        }
        const closed = () => {
            // 关闭弹出层且动画结束后触发
            context.emit('update:show', false)
        }

        // 保证金余额 = 初始保证金+盈亏+利息
        const marginBalance = computed(() => {
            const { occupyTheMargin, profitLoss, interest } = positionData.value || {}

            if (!occupyTheMargin || !profitLoss) return ''
            return plus(plus(occupyTheMargin, profitLoss), interest)
        })

        // 新占用保证金
        const newMaginUsed = computed(() => {
            const { occupyTheMargin } = positionData.value || {}
            const amount = state.amount
            if (!amount || !occupyTheMargin) return ''
            if (state.operType) {
                return plus(amount, occupyTheMargin)
            }
            return minus(occupyTheMargin, amount)
        })

        // 新保证金余额
        const newMarginBalance = computed(() => {
            const amount = state.amount
            if (!amount || !marginBalance.value) return ''
            if (state.operType) {
                return plus(amount, marginBalance.value)
            }
            return minus(marginBalance.value, amount)
        })

        // 获取预计亏损和盈利
        const calculationBurstPriceRequest = () => {
            const { positionId } = positionData.value || {}
            if (!state.amount) return
            const adjustMargin = state.operType ? state.amount : 0 - state.amount
            positionCalculation({
                accountId: assetsInfo.value.accountId,
                adjustMargin,
                positionId,
                tradeType: tradeType.value,
            }).then((res) => {
                state.evaluateClosePrice = res.data.evaluateClosePrice
            })
        }

        return {
            ...toRefs(state),
            submitAdjustMargin,
            closeHandler,
            closed,
            operation,
            plus,
            accountInfo,
            tradeType,
            positionData,
            handleAll,
            marginBalance,
            newMaginUsed,
            newMarginBalance,
        }
    },
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
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
.dialog-footer {
    width: 100%;
    padding: rem(30px) 0;
    .pcHandler {
        color: #fff;
        background: var(--primary);
        border: none;
        border-radius: rem(6px);
    }
}
.m-dialogAdjust {
    z-index: 1000;
    overflow: visible;
    .dialog-body {
        flex: none;
        :deep(.van-cell) {
            padding: 10px 0;
            &::after {
                left: 0;
                right: 0;
            }
        }
        .title {
            margin: 0 0 rem(30px) 0;
            color: var(--normalColor);
            font-size: rem(28px);
        }
        .input-wrap {
            display: flex;
            align-items: center;
            padding: 0 rem(30px);
            //line-height: rem(80px);
            background-color: var(--assistColor);
            border-radius: rem(6px);
            .fl {
                margin: rem(20px) rem(20px) rem(20px) rem(10px);
                padding-right: rem(20px);
                border-right: solid 1px var(--lineColor);
                .icon {
                    width: rem(24px);
                    margin-right: rem(10px);
                    vertical-align: middle;
                }
                .oper-text {
                    color: var(--color);
                    vertical-align: middle;
                }
                .line {
                    // width: rem(1px);
                    // height: 1;
                }
            }
            .input {
                flex: 1;
            }
            .all {
                color: var(--primary);
            }
        }
        .desc {
            margin-top: rem(20px);
            color: var(--minorColor);
            font-size: rem(28px);
        }
    }
    .dialog-footer {
        .van-button {
            font-size: rem(28px);
        }
    }
}
</style>

<style lang="scss">
@import '~@/sass/mixin.scss';
.m-dialogAdjust {
    z-index: 1000;
    display: flex;
    flex-flow: column;
    overflow: visible;
    background-color: var(--contentColor);
    height: auto;
}
</style>

<template>
    <div class='dialog-layer'>
        <el-dialog
            v-model='show'
            :before-close='close'
            class='custom-el-dialog-header'
            :close-on-click-modal='false'
            :title="$t('trade.modifyMargin')"
            width='500px'
            :z-index='1000'
        >
            <div v-if='show' class='body-module'>
                <div class='title flex' v-html="$t('trade.modifySymbolNameMargin', { name: data.symbolName })"></div>
                <div class='box focus-within'>
                    <div class='switch'>
                        <el-select v-model='operType' class='w-25'>
                            <el-option v-for='item in operTypeOptions' :key='item.value' :label='item.label' :value='item.value' />
                        </el-select>
                    </div>
                    <view class='line' />
                    <input v-model='amount' :placeholder="$t('trade.modifyAmount')" type='number' />
                    <button class='all' @click='onAll'>
                        {{ $t('c.all') }}
                    </button>
                </div>
                <div class='mt-3 text-base'>
                    <span v-if="operType === '1'" class='flex'>
                        <p class='text-minorColor'>
                            {{ $t('trade.maxRaise') }}：
                        </p>
                        {{ accountInfo.available }} {{ accountInfo.currency }}
                    </span>
                    <span v-else class='flex'>
                        <p class='text-minorColor'>
                            {{ $t('trade.maxReduce') }}：
                        </p>
                        {{ positionData.canReduceMargin }} {{ accountInfo.currency }}
                    </span>
                </div>
                <div class='mt-4'>
                    <van-cell :title="$t('trade.originalMargin')" :value="positionData.occupyTheMargin || '--'" />
                    <van-cell :title="$t('trade.marginBalance')" :value='marginBalance' />
                    <van-cell :title="$t('trade.holdMargin')" :value="positionData.maintenanceMargin || '--'" />
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
            <template #footer>
                <van-button block class='w-full' :loading='isSubmit' type='primary' @click='onConfirm'>
                    <div class='text-white'>
                        {{ $t('confirm') }}
                    </div>
                </van-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { reactive, toRefs, computed, } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { isEmpty } from '@/utils/util.js'
import { pow, minus, plus } from '@/utils/calculation'
import { positionCalculation } from '@/api/trade'
import { useAssets } from '@/hooks/assets'
import { Toast, Dialog } from 'vant'

// api
import { updateOccupyTheMargin } from '@/api/user'

export default {
    setup () {
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const assetsInfo = useAssets()
        const state = reactive({
            // 是否显示弹窗
            show: false,
            // 持仓数据
            data: {},
            // 调整类型 1:追加 2:减少
            operType: '1',
            // 调整的金额
            amount: '',
            // 按钮提交状态
            isSubmit: false,
            // 预计强平价格
            evaluateClosePrice: '',
            timer: null,
        })
        const operTypeOptions = [
            {
                label: t('trade.raise'),
                value: '1',
            },
            {
                label: t('trade.reduce'),
                value: '2',
            },
        ]
        // 账户列表
        const accountList = computed(() => store.state._user.customerInfo?.accountList)
        // 账户信息
        const accountInfo = computed(() => accountList.value.find((el) => Number(el.tradeType) === Number(state.data.tradeType)))
        // 持仓数据
        const positionData = computed(() =>
            store.state._trade.positionList[state.data.tradeType]?.find((item) => item.positionId === state.data.positionId),
        )

        // 打开弹窗
        const open = (row) => {
            state.data = row
            state.operType = '1'
            state.amount = ''
            state.isSubmit = false
            state.show = true
            store.dispatch('_user/findCustomerInfo', false)
            queryPositionList()
            state.timer = setInterval(() => {
                calculationBurstPriceRequest()
            }, 1000)
        }

        // 关闭弹窗
        const close = () => {
            state.show = false
            clearInterval(state.timer)
        }

        // 点击全部
        const onAll = () => {
            state.amount = state.operType === '1' ? accountInfo.value.available : positionData.value.canReduceMargin
        }

        // 确定调整保证金
        const onConfirm = () => {
            // 参数验证
            if (isEmpty(state.amount) || parseFloat(state.amount) === 0) {
                Toast(t('trade.enterMarginAmount'))
                return
            }
            if (parseFloat(state.amount) < 0) {
                Toast(t('trade.enterMarginAmountTip'))
                return
            }

            submitData()
        }

        // 发起调整保证金请求
        const submitData = () => {
            const data = state.data
            const margin = state.operType === '1' ? parseFloat(state.amount) : -parseFloat(state.amount)
            const occupyTheMargin = margin * pow(10, data.openAccountDigits)
            const params = {
                tradeType: data.tradeType,
                accountId: accountInfo.value.accountId,
                positionId: data.positionId,
                accountDigits: data.openAccountDigits,
                occupyTheMargin,
                orderId: data.orderId,
                remark: '',
                resp: '',
            }
            state.isSubmit = true
            updateOccupyTheMargin(params)
                .then((res) => {
                    state.isSubmit = false
                    if (res.check()) {
                        state.show = false
                        Toast(t('c.handleSuccess'))
                    } else {
                        Dialog.alert({
                            title: t('common.tip'),
                            message: res.msg,
                        })
                    }
                })
                .catch((res) => {
                    state.isSubmit = false
                    Toast(res.msg)
                })
                .finally(() => {
                    queryPositionList()
                })
        }

        // 获取持仓列表
        const queryPositionList = () => {
            const data = state.data
            store.dispatch('_trade/queryPositionPage', {
                tradeType: data.tradeType,
                sortFieldName: 'openTime',
                sortType: 'desc',
            })
        }

        // 保证金余额 = 初始保证金+盈亏+利息
        const marginBalance = computed(() => {
            const { occupyTheMargin, profitLoss, interest } = positionData.value || {}

            if (!occupyTheMargin || !profitLoss) return '--'
            return plus(plus(occupyTheMargin, profitLoss), interest)
        })

        // 新占用保证金
        const newMaginUsed = computed(() => {
            const { occupyTheMargin } = positionData.value || {}
            const amount = state.amount
            if (!amount || !occupyTheMargin) return '--'
            if (state.operType === '1') {
                return plus(amount, occupyTheMargin)
            }
            return minus(occupyTheMargin, amount)
        })

        // 新保证金余额
        const newMarginBalance = computed(() => {
            const amount = state.amount
            if (!amount || !marginBalance.value) return '--'
            if (state.operType === '1') {
                return plus(amount, marginBalance.value)
            }
            return minus(marginBalance.value, amount)
        })

        // 获取预计亏损和盈利
        const calculationBurstPriceRequest = () => {
            const { positionId, tradeType } = positionData.value
            const adjustMargin = state.operType !== '1' ? 0 - state.amount : state.amount
            positionCalculation({
                accountId: assetsInfo.value.accountId,
                adjustMargin,
                positionId,
                tradeType,
            }).then((res) => {
                state.evaluateClosePrice = res.data.evaluateClosePrice
            })
        }

        return {
            ...toRefs(state),
            positionData,
            accountInfo,
            open,
            close,
            onAll,
            onConfirm,
            operTypeOptions,
            marginBalance,
            plus,
            minus,
            newMarginBalance,
            newMaginUsed,
        }
    },
}
</script>

<style lang="scss" scoped>
.body-module {
    .title {
        color: var(--minorColor);
    }

    :deep(.van-cell) {
        padding: 10px 0;
        &::after {
            left: 0;
            right: 0;
        }
    }
    .box {
        display: flex;
        align-items: center;
        background: var(--assistColor);
        height: 50px;
        margin-top: 15px;
        border-radius: 3px;
        .switch {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0 8px;
            cursor: pointer;
            :deep(.el-select .el-input.is-focus .el-input__wrapper) {
                box-shadow: inherit !important;
            }
            :deep(.el-select) {
                .el-input__wrapper {
                    background: none;
                    box-shadow: inherit !important;
                }
            }
            i {
                margin-left: 12px;
                font-size: 12px;
            }
            span {
                font-size: 14px;
            }
        }
        .line {
            background: var(--lineColor);
            width: 1px;
            height: 40px;
        }
        input {
            flex: 1;
            height: 100%;
            padding: 0 20px;
            font-size: 14px;
        }
        .all {
            margin-right: 20px;
            font-size: 14px;
            color: var(--primary);
            background: none;
            cursor: pointer;
        }
    }
}
.handle-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--primary);
    width: 100%;
    height: 48px;
    font-size: 16px;
    color: #fff;
    border-radius: 4px;
    cursor: pointer;
}
</style>

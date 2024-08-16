<template>
    <centerViewDialog class='dialog-boxs-tf'>
        <LayoutTop />
        <div v-if='!finished.time' class='transferBody'>
            <div class='page-content'>
                <div class='title-box'>
                    <span>{{ $t('common.from') }}</span>
                    <img alt='' src='../../../../assets/newUI/wallet_icon.png' />
                </div>
                <inputCard
                    :amount='amount'
                    class='card-top'
                    :currency="fromPlan.tradeType === '5' ? transferCurrency : defCurrency"
                    :currency-list="fromPlan.tradeType === '5' ? availableTransferCurrencyList : []"
                    :currency-rate="fromPlan.tradeType === '5' ? rateConfig?.exchangeRate : 1"
                    :title="fromPlan.tradeType == '5' ? $t('wallet.wallet') : $t('wallet.tradingAccount')"
                    @onAmount='handleAmount'
                    @onCurrency='handleCurrency'
                >
                    {{ $t("assets.maxTransfer") }}： {{ maxTransfer }} {{ fromPlan.tradeType === '5' ? transferCurrency : defCurrency }}
                    <span @click='amount = maxTransfer'>
                        {{ $t("common.all") }}
                    </span>
                </inputCard>
                <div class='trans-icon'>
                    <img alt='' src='../../../../assets/newPCUI/assets_td.png' @click='handleSwap' />
                </div>
                <div class='title-box'>
                    <span>{{ $t('common.to') }}</span>
                    <img alt='' src='../../../../assets/newUI/trade_icon.png' />
                </div>
                <inputCard
                    :amount='estimateAmount'
                    class='card-top'
                    :currency="toPlan.tradeType === '5' ? transferCurrency : defCurrency"
                    :currency-list="toPlan.tradeType === '5' ? availableTransferCurrencyList : []"
                    :currency-rate="toPlan.tradeType === '5' ? rateConfig?.exchangeRate : 1"
                    :input-disabled='true'
                    :title="toPlan.tradeType === '5' ? $t('wallet.wallet') : $t('wallet.tradingAccount')"
                    @onCurrency='handleCurrency'
                >
                    {{ $t("common.balance") }}： {{ balance }} {{ toPlan.tradeType === '5' ? transferCurrency : defCurrency }}
                </inputCard>
                <div class='rate-box'>
                    {{ $t("wallet.ratio") }} 1 {{ transferCurrency }} ≈ {{ rateConfig?.exchangeRate }} {{ defCurrency }}
                </div>
                <div class='footerBtn'>
                    <van-button
                        block
                        class='returnBtn'
                        :loading='loading'
                        type='primary'
                        @click='handleTransfer'
                    >
                        {{ $t("news.confirm") }}
                    </van-button>
                </div>
            </div>
            <Loading :show='loading' />
        </div>
        <div v-else class='success-box'>
            <img class='success-img' src='../../../../assets/newPCUI/tran_s.png' />
            <p>{{ $t('withdrawCoin.tips.tips9') }}</p>
            <div>
                <p>
                    <span>{{ $t("wallet.currency") }}</span>
                    <span>{{ fromPlan?.tradeType === '5' ? transferCurrency : defCurrency }}</span>
                </p>
                <p>
                    <span>{{ $t("withdrawCoin.transferFrom") }}</span>
                    <span>{{ fromPlan?.tradeType === '5' ? $t("wallet.walletAccount") : $t("wallet.tradingAccount") }}</span>
                </p>
                <p>
                    <span>{{ $t("withdrawCoin.transferTo") }}</span>
                    <span>{{ fromPlan?.tradeType === '5' ? $t("wallet.tradingAccount") : $t("wallet.walletAccount") }}</span>
                </p>
                <p>
                    <span>{{ $t("wallet.amount") }}</span>
                    <span>{{ finished.amount }}</span>
                </p>
                <p>
                    <span>{{ $t("common.time") }}</span>
                    <span>{{ finished.time }}</span>
                </p>
                <p>
                    <span>{{ $t("common.status") }}</span>
                    <span>{{ $t("competition.finished") }}</span>
                </p>
            </div>
        </div>
    </centerViewDialog>
</template>

<script>
import CurrencyIcon from '@/components/currencyIcon'
import inputCard from '@planspc/components/inputCard.vue'
import centerViewDialog from '@planspc/layout/centerViewDialog'
import { computed, onMounted, reactive, toRefs, watch } from 'vue'
import {
    queryAccountById,
    queryDepositExchangeRate,
    capitalTransferSupportDiffCurr
} from '@/api/user'
import { pow, gt, lt } from '@/utils/calculation'
import { useRoute } from 'vue-router'
import { isEmpty } from '@/utils/util'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { Toast } from 'vant'
import dayjs from 'dayjs'
export default {
    components: {
        CurrencyIcon,
        centerViewDialog,
        inputCard
    },
    setup () {
        const route = useRoute()
        const { t, tm } = useI18n({ useScope: 'global' })
        const store = useStore()
        const state = reactive({
            open: false,
            loading: false,
            amount: '',
            curAccount: {}, // 当前账户
            fromPlan: {}, // 从玩法
            toPlan: {}, // 到玩法
            tradeType: '', // 玩法类型
            accountId: '', // 账户id
            transferCurrency: '', // 划转币种
            rateConfig: {}, // 存款配置数据
            curAccountId: '', // 当前账户id
            curCurrency: '', // 当前账户货币
            minTransfer: '', // 最少可划转
            maxTransfer: '', // 最大可划转
            balance: '0.00', // 余额
            defCurrency: 'USDT', // 默认货币
            finished: {},
        })
        // 预估到账资产数量
        const estimateAmount = computed(() => {
            return state.fromPlan.tradeType === '5'
                ? state.amount > 0
                    ? state.rateConfig.exchangeRate * state.amount
                    : 0
                : state.amount > 0
                    ? state.amount / state.rateConfig.exchangeRate
                    : 0
        })
        // 获取玩法列表
        const plans = computed(() => store.state._base.plans || [])
        // 可选择的玩法列表
        const selectPlans = computed(() =>
            plans.value.filter((el) => Number(el.tradeType) !== 5)
        )
        // 获取账户信息
        const { value: customInfo } = computed(
            () => store.state._user.customerInfo
        )

        const accountMap = computed(() => store.state._user.customerInfo?.accountMap)
        const rateConfigList = computed(() => store.state._base.rateConfigList)
        const userAccount = computed(() => store.state._user.accountAssets[2])

        // 从玩法账户列表
        const accountList = computed(
            () =>
                customInfo.accountList?.filter(
                    (el) =>
                        Number(el.tradeType) ===
                        Number(state.fromPlan.tradeType)
                ) || []
        )
        // 到账户
        const toAccount = computed(() => {
            const list = customInfo.accountList?.filter(
                (el) => Number(el.tradeType) === Number(state.toPlan.tradeType)
            )
            const currency = state.fromPlan?.tradeType === '5' ? state.defCurrency : state.transferCurrency
            return list.find((el) => el.currency === currency)
        })

        const availableTransferCurrencyList = computed(() => {
            const accountList = customInfo?.accountList
            return accountList
                ? accountList.filter((el) => Number(el.tradeType) === 5)
                : []
        })

        const queryAccount = () => {
            queryAccountById({
                accountId: state.curAccount.accountId,
                tradeType: state.curAccount.tradeType
            })
                .then((res) => {
                    if (res.check()) {
                        state.maxTransfer = res.data.withdrawAmount
                    }
                })
                .catch(() => {
                    state.loading = false
                })
        }

        // 获取存款货币对汇率
        const getDepositExchangeRate = () => {
            const param = {
                tradeType: 5,
                accountCurrency: state.defCurrency,
                paymentCurrency: state.transferCurrency
            }
            queryDepositExchangeRate(param)
                .then((res) => {
                    state.rateConfig = res.data
                })
                .catch((res) => {
                    Toast(res.msg)
                })
        }

        const changeData = (data, flag) => {
            if (data.length > 0) {
                const currency =
                    state.fromPlan?.tradeType === '5'
                        ? state.transferCurrency
                        : state.defCurrency
                const account =
                    data.find((el) => el.currency === currency) ||
                    accountList.value[0]
                state.accountId = account.accountId
                state.curAccount = account
                state.curAccountId = account.accountId
                state.curCurrency = account.currency
                state.amount = ''
                state.minTransfer = pow(0.1, account.digits)
                queryAccount()
            }
        }

        watch(
            () => state.fromPlan,
            () => {
                changeData(accountList.value)
            }, {
                deep: true
            }
        )

        onMounted(() => {
            const { accountIds, tradeTypes, currencys } = route.query || {}
            state.open = true
            // 路由传入默认 从：现货玩法 到：全仓玩法
            state.tradeType = Number(tradeTypes) || ''
            state.accountId = Number(accountIds) || ''
            state.transferCurrency = currencys || ''
            // 设置默认从、到的玩法
            state.fromPlan =
                plans.value.find((el) => Number(el.tradeType) == tradeTypes) ||
                {}
            state.toPlan =
                selectPlans.value.find((el) => Number(el.tradeType) == 1) || {}
            // 获取汇率
            getDepositExchangeRate()
            // 获取余额
            const toCurrency =
                state.fromPlan?.tradeType === '5'
                    ? state.defCurrency
                    : state.transferCurrency
            handleSetBalance(toCurrency)
        })

        const handleTransfer = () => {
            if (isEmpty(state.amount)) {
                return Toast(t('assets.transferTip1'))
            }
            if (state.amount <= 0) {
                return Toast(t('assets.transferTip6'))
            }
            if (isEmpty(toAccount.value)) {
                return Toast(
                    t('tradeType' + '.' + state.toPlan?.tradeType) +
                        t('common.notFound') +
                        state.curAccount?.currency +
                        t('common.account')
                )
            }

            if (gt(state.amount, state.maxTransfer)) {
                return Toast(t('assets.transferTip4'))
            }
            if (lt(state.amount, state.minTransfer)) {
                return Toast(t('assets.transferTip5'))
            }
            handleCapitalTransfer()
        }

        // 发起划转
        const handleCapitalTransfer = () => {
            const currency =
                state.fromPlan?.tradeType === '5'
                    ? state.transferCurrency
                    : state.defCurrency
            const toCurrency =
                state.fromPlan?.tradeType === '5'
                    ? state.defCurrency
                    : state.transferCurrency
            const params = {
                amount: parseFloat(state.amount),
                companyId: customInfo.companyId,
                customerId: customInfo.id,
                customerGroupId: customInfo.customerGroupId,
                customerNo: customInfo.customerNo,
                toCustomerNo: customInfo.customerNo,
                currency,
                toCurrency,
                tradeType: state.fromPlan.tradeType,
                toTradeType: state.toPlan.tradeType
            }
            state.loading = true
            capitalTransferSupportDiffCurr(params)
                .then((res) => {
                    state.loading = false
                    if (res.check() && res.data) {
                        Toast(t('assets.transferSuccess'))
                        state.finished = true
                        state.finished = {
                            amount: parseFloat(state.amount),
                            time: dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
                        }
                        state.amount = ''
                        queryAccount()
                        store.dispatch('_user/queryCustomerAssetsInfo', {
                            tradeType: 5
                        })
                    }
                })
                .catch(() => {
                    state.loading = false
                })
        }

        const onPickerConfirm = (idx) => {
            const { currency, accountId } =
                availableTransferCurrencyList?.value.find(
                    (i) => (i.currency == idx)
                ) || {}
            state.amount = ''
            state.accountId = accountId
            state.transferCurrency = currency
            // 获取汇率
            getDepositExchangeRate()
            changeData(accountList.value)
        }

        const handleSetBalance = (val) => {
            if (!rateConfigList.value) return
            if (state.toPlan.tradeType == 5) {
                const list = Object.values(accountMap.value) || []
                const item = list.find(i => i.currency === val)
                state.balance = item.balance
            } else {
                state.balance = userAccount.value?.balance
            }
        }

        const handleSwap = () => {
            const fromPlan = state.fromPlan
            const toPlan = state.toPlan
            state.fromPlan = toPlan
            state.toPlan = fromPlan
            state.amount = ''
            // 获取余额
            const toCurrency =
                state.fromPlan?.tradeType === '5'
                    ? state.defCurrency
                    : state.transferCurrency
            handleSetBalance(toCurrency)
        }

        store.commit('_base/Update_plansNames', tm('tradeType'))

        const handleAmount = (value) => {
            state.amount = value
        }

        const handleCurrency = ({ value }) => {
            onPickerConfirm(value)
            if (state.fromPlan?.tradeType !== '5') {
                handleSetBalance(value)
            }
        }

        return {
            plans,
            handleTransfer,
            handleSwap,
            accountList,
            estimateAmount,
            handleAmount,
            handleCurrency,
            availableTransferCurrencyList,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@/sass/mixin.scss";
.success-box {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    & > img {
        width: 52px;
        height: 52px;
        margin-top: 44px;
    }

    & > p {
        font-size: 16px;
        font-weight: 700;
        color: var(--primaryText);
        margin: 20px 0 32px;
    }

    & > div {
        width: 448px;
        height: auto;
        border-radius: 8px;
        background: #FAF9F9;
        padding: 12px 24px;
        display: flex;
        flex-direction: column;
        & > p {
            line-height: 2.5;
            font-size: 14px;
            color: var(--primaryText);
            display: flex;
            justify-content: space-between;
            & > span:first-of-type {
                color: #999999;
            }
        }
    }
}
.tipText {
    font-size: remFree(20px);
    color: var(--placeholdColor);
    line-height: 1.8;
    & > span {
        color: var(--primaryText);
    }
}
.tipBox {
    display: flex;
    align-items: flex-end;
    line-height: 1.2;
    font-size: remFree(20px);
    color: var(--placeholdColor);
    & > h1 {
        flex: 1;
        font-weight: 400;
        font-size: remFree(30px);
        color: var(--primaryText);
    }
    & > h3 {
        font-weight: 400;
        color: var(--primaryText);
        margin: 0 remFree(6px);
        line-height: 1;
    }
    .icons {
        font-size: remFree(24px);
        margin-left: remFree(10px);
        margin-top: remFree(-5px);
    }
}
.dataPopover {
    width: remFree(367px);
    font-size: remFree(22px);
    color: var(--primaryText);
    text-align: center;
    line-height: 2;
    padding: remFree(30px) 0;
    span {
        color: var(--primary);
        text-decoration: underline;
    }
}
.transferBody {
    height: 100%;
    overflow-y: overlay;
    display: flex;
    flex-direction: column;
    align-items: center;
    @include scroll-bar-vertical;
    &:deep(.van-popup) {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
    }
    .page-content {
        width: 100%;
        height: 100%;
        padding: 14px 36px;
        display: flex;
        flex-direction: column;
        .title-box {
            height: 24px;
            display: flex;
            align-items: center;
            font-size: 14px;
            font-weight: 600;
            color: var(--primaryText);
            margin: 16px 0 8px;
            line-height: 1;
            & > img {
                width: 22px;
                height: 22px;
                margin-left: 8px;
            }
        }
        .trans-icon {
            display: flex;
            justify-content: center;
            margin-top: 16px;
            & > img {
                width: 24px;
                height: 24px;
                cursor: pointer;
                &:active {
                    opacity: 0.85;
                }
            }
        }
        .rate-box {
            width: 100%;
            height: 45px;
            background: rgba(243, 245, 250, 0.6);
            padding: 0 24px;
            display: flex;
            align-items: center;
            font-size: 14px;
            color: var(--primaryText);
            margin-top: 24px;
        }
        .header {
            padding-bottom: remFree(10px);
            font-size: remFree(38px);
        }
        .transfer {
            display: flex;
            align-items: center;
            margin-top: remFree(30px);
            background: var(--contentColor);
            border-radius: remFree(6px);
            overflow: hidden;
            .label {
                color: var(--color);
                font-size: remFree(38px);
                line-height: remFree(27px);
                text-align: center;
                word-wrap: break-word;
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding: 0 remFree(20px);
                .dots {
                    margin: remFree(20px) 0;
                    text-align: center;
                    .dot {
                        display: block;
                        width: remFree(6px);
                        height: remFree(6px);
                        margin: 0 auto remFree(10px) auto;
                        text-align: center;
                        background: var(--placeholdColor);
                        border-radius: 50%;
                    }
                }
            }
            .center {
                flex: 1;
                border-top-left-radius: remFree(6px);
                border-bottom-left-radius: remFree(6px);
                .account {
                    display: flex;
                    align-items: center;
                    height: remFree(96px);
                    padding-right: remFree(30px);
                    padding-left: remFree(30px);
                    font-size: remFree(24px);
                    line-height: remFree(100px);
                    & > span {
                        margin-right: remFree(20px);
                    }
                    &.from {
                        border-bottom: solid 1px var(--lineColor);
                    }
                    .van-icon {
                        color: var(--minorColor);
                    }
                }
            }
            .right {
                padding: remFree(20px);
                cursor: pointer;
                .icon_zhuanhuan {
                    color: var(--color);
                    font-size: remFree(36px);
                }
            }
        }
        .action-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: remFree(100px);
            margin: remFree(20px) 0;
            padding: 0 remFree(30px);
            color: var(--color);
            font-size: remFree(22px);
            background: var(--contentColor);
            border-radius: remFree(6px);
            input {
                flex: 1;
            }
            .unit {
                margin-right: remFree(30px);
                padding-right: remFree(30px);
                color: var(--placeholdColor);
                border-right: solid 1px var(--lineColor);
            }
            .all {
                color: var(--primary);
                cursor: pointer;
            }
            .label {
                flex: 1;
                padding-left: remFree(20px);
            }
        }
        .tip {
            margin-left: remFree(23px);
            color: var(--minorColor);
            text-align: right;
            .val {
                color: var(--color);
            }
        }
        .mt60 {
            margin: remFree(40px) 0 remFree(10px);
        }
    }
    .footerBtn {
        width: 448px;
        display: flex;
        align-items: flex-end;
        position: absolute;
        bottom: 32px;
        .returnBtn {
            border: none;
            color: #fff;
            font-weight: bold;
            font-size: remFree(26px);
            background: var(--primary);
            border-radius: remFree(6px);
        }
    }
    .right-title {
        color: var(--contentColor);
        font-size: remFree(20px);
    }
}
.currency-text {
    font-size: remFree(28px);
    color: var(--primaryText);
}
.currency-icon {
    width: remFree(44px);
    margin-right: remFree(20px);
}
.icon-box {
    width: 100%;
    height: remFree(100px);
    font-size: remFree(22px);
    background: var(--contentColor);
    border-radius: remFree(6px);
    margin: remFree(20px) 0;
    :deep(.select-trigger) {
        height: 100%;
        box-sizing: border-box;
    }
    :deep(.el-input) {
        height: 100%;
        font-size: inherit;
        line-height: 100% !important;
    }
    :deep(.el-input__inner) {
        height: 100%;
        border: none !important;
        background: transparent;
    }
    :deep(.el-input__suffix) {
        display: flex;
        align-items: center;
    }
    :deep(.el-input__wrapper) {
        --el-select-input-focus-border-color: transparent;
        box-shadow: none !important;
    }
}
.currencyOption {
    display: flex;
    align-items: center;
    height: 52px;
    line-height: 2;
    & > span {
        font-size: remFree(22px);
        margin-left: 10px;
        color: var(--textColor);
    }
}
</style>

<style lang="scss">
.dialog-boxs-tf {
    .el-dialog__body {
        height: 676px;
    }
}
</style>

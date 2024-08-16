<template>
    <div class="transferBody">
        <div class="page-content">
            <div class="transfer">
                <div class="label">
                    {{ $t("common.from") }}
                    <div class="dots">
                        <span class="dot"></span>
                        <span class="dot"></span>
                    </div>
                    {{ $t("common.to") }}
                </div>

                <div class="center">
                    <div class="from account">
                        <span>{{
                            fromPlan.tradeType == "5"
                                ? $t("wallet.wallet")
                                : $t("wallet.tradingAccount")
                        }}</span>
                        <CurrencyIcon
                            :currency="
                                fromPlan.tradeType == '5'
                                    ? transferCurrency
                                    : 'USDT'
                            "
                            :size="23"
                        />
                    </div>
                    <div class="to account">
                        <span>{{
                            toPlan.tradeType === "5"
                                ? $t("wallet.wallet")
                                : $t("wallet.tradingAccount")
                        }}</span>
                        <CurrencyIcon
                            :currency="
                                toPlan.tradeType === '5'
                                    ? transferCurrency
                                    : 'USDT'
                            "
                            :size="23"
                        />
                    </div>
                </div>
                <div class="right" @click="handleSwap">
                    <i class="icon_zhuanhuan"></i>
                </div>
            </div>

            <p class="header mt60">
                {{
                    fromPlan.tradeType == "5"
                        ? $t("assets.transferAsset")
                        : $t("assets.walletAsset")
                }}
            </p>
            <p class="currency-text">{{ $t("wallet.currency") }}</p>
            <el-select
                class="icon-box"
                placeholder="---"
                v-model="transferCurrency"
                @change="onPickerConfirm"
            >
                <template #prefix>
                    <CurrencyIcon :currency="transferCurrency" :size="24" />
                </template>
                <el-option
                    v-for="(item, index) in availableTransferCurrencyList"
                    :key="index"
                    :value="item.currency"
                    :label="item.currency"
                    class="currencyOption"
                >
                    <CurrencyIcon :currency="item.currency" :size="20" />
                    <span>{{ item.currency }}</span>
                </el-option>
            </el-select>
            <div class="tipBox">
                <h1>{{ $t("trade.orderVolume") }}</h1>
                <span>{{ $t("assets.maxTransfer") }}</span>
                <h3>{{ maxTransfer }}</h3>
                <span>{{ curAccount?.currency }}</span>
            </div>
            <div class="action-bar">
                <input
                    v-model="amount"
                    :placeholder="$t('assets.minTransfer') + minTransfer"
                    type="number"
                />
                <span class="unit">
                    {{ curAccount?.currency }}
                </span>
                <span class="all" @click="amount = maxTransfer">
                    {{ $t("common.all") }}
                </span>
            </div>
            <p class="tipText" v-if="transferCurrency !== 'USDT'">
                {{ $t("wallet.ratio") }} 1 {{ transferCurrency }} =
                <span>{{ rateConfig?.exchangeRate }} USDT</span>
            </p>
            <p class="tipText">
                {{ $t("wallet.estimate") }}
                <span
                    >{{ estimateAmount }}
                    {{
                        fromPlan.tradeType === "5" ? "USDT" : transferCurrency
                    }}</span
                >
            </p>
        </div>
        <div class="footBtnBox">
            <div class="footerBtn">
                <van-button
                    block
                    class="returnBtn"
                    :loading="loading"
                    type="primary"
                    @click="handleTransfer"
                >
                    {{ $t("trade.transfer") }}
                </van-button>
            </div>
        </div>
        <Loading :show="loading" />
    </div>
</template>

<script>
import CurrencyIcon from '@/components/currencyIcon'
import { computed, onMounted, reactive, toRefs, watch } from 'vue'
import {
    queryAccountById,
    queryDepositExchangeRate,
    capitalTransferSupportDiffCurr
} from '@/api/user'
import { pow, gt, lt } from '@/utils/calculation'
import { isEmpty } from '@/utils/util'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { Toast } from 'vant'
export default {
    components: {
        CurrencyIcon
    },
    props: ['currencys', 'tradeTypes', 'accountIds'],
    setup (props, { emit }) {
        const { t, tm } = useI18n({ useScope: 'global' })
        const store = useStore()
        const state = reactive({
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
            maxTransfer: '' // 最大可划转
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
            const currency = state.fromPlan.tradeType === '5' ? 'USDT' : state.curAccount.currency
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
                .catch((err) => {
                    state.loading = false
                })
        }

        // 获取存款货币对汇率
        const getDepositExchangeRate = () => {
            const param = {
                tradeType: 5,
                accountCurrency: 'USDT',
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
                const account =
                    data.find((el) => el.accountId === state.accountId) ||
                    accountList.value[0]
                state.accountId = account.accountId
                state.curAccount = account
                state.curAccountId = account.accountId
                state.curCurrency = account.currency
                flag && (state.transferCurrency = account.currency) // 切换方向要重置transferCurrency，交易账户只有USDT账户
                state.amount = ''
                state.minTransfer = pow(0.1, account.digits)
                queryAccount()
            }
        }

        watch(
            () => accountList,
            (data) => changeData(data.value, true)
        )

        watch(
            () => [state.accountId, state.fromPlan],
            () => changeData(accountList.value)
        )

        onMounted(() => {
            const { accountIds, tradeTypes, currencys } = props || {}
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
                    t('tradeType' + '.' + state.toPlan.tradeType) +
                        t('common.notFound') +
                        state.curAccount.currency +
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
                state.fromPlan.tradeType === '5'
                    ? state.transferCurrency
                    : 'USDT'
            const toCurrency =
                state.fromPlan.tradeType === '5'
                    ? 'USDT'
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
                        state.amount = ''
                        Toast(t('assets.transferSuccess'))
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
            console.log(state.accountId, accountId)
            state.transferCurrency = currency
            // 获取汇率
            getDepositExchangeRate()
        }

        const customField = {
            text: 'currency'
        }

        const handleSwap = () => {
            const fromPlan = state.fromPlan
            const toPlan = state.toPlan
            state.fromPlan = toPlan
            state.toPlan = fromPlan
            state.amount = ''
        }

        store.commit('_base/Update_plansNames', tm('tradeType'))
        return {
            plans,
            handleTransfer,
            handleSwap,
            onPickerConfirm,
            customField,
            accountList,
            estimateAmount,
            availableTransferCurrencyList,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@/sass/mixin.scss";
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
    @include scroll-bar-vertical;
    &:deep(.van-popup) {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
    }
    .page-content {
        position: relative;
        padding: 0 remFree(30px);
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
        position: absolute;
        bottom: 0;
        left: 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        width: 100%;
        .returnBtn {
            margin: remFree(30px);
            color: #fff;
            font-weight: bold;
            font-size: remFree(26px);
            background: var(--primary);
            border: none;
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
.footBtnBox {
    flex: 1;
    min-height: remFree(160px);
    position: relative;
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

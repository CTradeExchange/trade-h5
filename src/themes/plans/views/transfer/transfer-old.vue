<template>
    <div class='fullPageWrappers'>
        <LayoutTop :title="$t('trade.asset')">
            <template #right>
                <a class='right-title' href='javascript:;' @click='toRecord'>
                    {{ $t("assets.transferRecord") }}
                </a>
                <van-icon name='arrow' />
            </template>
        </LayoutTop>

        <div class='page-content'>
            <div class='transfer'>
                <div class='label'>
                    {{ $t("common.from") }}
                    <div class='dots'>
                        <span class='dot'></span>
                        <span class='dot'></span>
                    </div>
                    {{ $t("common.to") }}
                </div>
                <div class='center'>
                    <div class='from account'>
                        <span>
                            {{
                                fromPlan.tradeType == "5"
                                    ? $t("wallet.wallet")
                                    : $t("wallet.tradingAccount")
                            }}
                        </span>
                        <CurrencyIcon
                            :currency="
                                fromPlan.tradeType == '5'
                                    ? transferCurrency
                                    : 'USDT'
                            "
                            :size='18'
                        />
                    </div>
                    <div class='to account'>
                        <span>
                            {{
                                toPlan.tradeType === "5"
                                    ? $t("wallet.wallet")
                                    : $t("wallet.tradingAccount")
                            }}
                        </span>
                        <CurrencyIcon
                            :currency="
                                toPlan.tradeType === '5'
                                    ? transferCurrency
                                    : 'USDT'
                            "
                            :size='18'
                        />
                    </div>
                </div>
                <div class='right' @click='handleSwap'>
                    <div class='icon-wrap'>
                        <i class='icon_zhuanhuan'></i>
                    </div>
                </div>
            </div>

            <p class='header mt60'>
                {{
                    fromPlan.tradeType == "5"
                        ? $t("assets.transferAsset")
                        : $t("assets.walletAsset")
                }}
            </p>
            <p class='currency-text'>
                {{ $t("wallet.currency") }}
            </p>
            <div class='action-bar mb60' @click='accountShow = true'>
                <CurrencyIcon :currency='transferCurrency' :size='18' />
                <span class='label'>
                    {{ transferCurrency }}
                </span>
                <van-icon name='arrow' />
            </div>

            <div class='tipBox'>
                <h1>{{ $t("trade.orderVolume") }}</h1>
                <span>{{ $t("assets.maxTransfer") }}</span>
                <h3>{{ maxTransfer }}</h3>
                <span>{{ curAccount?.currency }}</span>
                <van-popover v-if="fromPlan.tradeType === '5'" v-model:show='showPopover'>
                    <div class='available-con' @click='toDesposit'>
                        <span>
                            {{ $t("deposit.balanceNot") }}？
                            <span class='text2'>
                                {{ $t("deposit.immediateRecharge") }}
                            </span>
                        </span>
                    </div>
                    <template #reference>
                        <van-icon name='question-o' style='margin: 0 0.1rem' />
                    </template>
                </van-popover>
            </div>
            <div class='action-bar'>
                <input
                    v-model='amount'
                    :placeholder="$t('assets.minTransfer') + minTransfer"
                    type='number'
                />
                <span class='unit'>
                    {{ curAccount?.currency }}
                </span>
                <span class='all' @click='amount = maxTransfer'>
                    {{ $t("common.all") }}
                </span>
            </div>
            <p v-if="transferCurrency !== 'USDT'" class='tipText'>
                {{ $t("wallet.ratio") }} 1 {{ transferCurrency }} =
                <span>{{ rateConfig?.exchangeRate }} USDT</span>
            </p>
            <p class='tipText'>
                {{ $t("wallet.estimate") }}
                <span>
                    {{ estimateAmount }}
                    {{
                        fromPlan.tradeType === "5" ? "USDT" : transferCurrency
                    }}
                </span>
            </p>
        </div>

        <div class='footerBtn'>
            <van-button
                block
                class='returnBtn'
                :loading='loading'
                type='primary'
                @click='handleTransfer'
            >
                {{ $t("trade.transfer") }}
            </van-button>
        </div>
        <Loading :show='loading' />
        <van-popup
            v-model:show='accountShow'
            class='assetsPicker'
            :duration='0.2'
            position='bottom'
        >
            <van-picker
                :cancel-button-text="$t('common.cancel')"
                :columns='availableTransferCurrencyList'
                :columns-field-names='customField'
                :confirm-button-text="$t('common.sure')"
                @cancel='accountShow = false'
                @confirm='onPickerConfirm'
            />
        </van-popup>
    </div>
</template>

<script>
import CurrencyIcon from '@/components/currencyIcon'
import { computed, onMounted, reactive, ref, toRefs, watch } from 'vue'
import {
    queryAccountById,
    queryDepositExchangeRate,
    capitalTransferSupportDiffCurr
} from '@/api/user'
import { pow, gt, lt } from '@/utils/calculation'
import { useRoute, useRouter } from 'vue-router'
import { isEmpty } from '@/utils/util'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { Dialog, Toast } from 'vant'
export default {
    components: {
        CurrencyIcon
    },
    setup (props, { emit }) {
        const showPopover = ref(false)
        const { t, tm } = useI18n({ useScope: 'global' })
        const store = useStore()
        const router = useRouter()
        const route = useRoute()
        const state = reactive({
            accountShow: false,
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

        // 跳转充值页面
        const toDesposit = () => {
            router.replace({
                path: '/deposit'
            })
        }

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
            console.log(200, data)
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
            const { accountId, tradeType, currency } = route.query || {}
            // 路由传入默认 从：现货玩法 到：全仓玩法
            state.tradeType = Number(tradeType)
            state.accountId = Number(accountId)
            state.transferCurrency = currency
            // 设置默认从、到的玩法
            state.fromPlan =
                plans.value.find((el) => Number(el.tradeType) == tradeType) ||
                {}
            state.toPlan =
                selectPlans.value.find((el) => Number(el.tradeType) == 1) || {}
            // 获取汇率
            getDepositExchangeRate()
        })

        const handleTransfer = () => {
            if (state.fromPlan.tradeType === '5' && state.amount <= 0) {
                Dialog.alert({
                    title: t('common.tip'),
                    // showCancelButton: true,
                    confirmButtonText: t('deposit.immediateRecharge'),
                    message: t('deposit.balanceNot'),
                }).then(() => toDesposit())
                return
            }
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

        const onPickerConfirm = (val) => {
            state.accountShow = false
            const { currency, accountId } = val
            if (state.transferCurrency !== currency) {
                state.amount = ''
                state.accountId = accountId
                state.transferCurrency = currency
                // 获取汇率
                getDepositExchangeRate()
            }
        }
        const toRecord = () => {
            router.push({
                path: '/record',
                query: {
                    accountId: state.accountId,
                    tradeType: state.tradeType,
                    type: 3
                }
            })
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
            toRecord,
            toDesposit,
            accountList,
            showPopover,
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
    font-size: rem(24px);
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
    font-size: rem(24px);
    color: var(--placeholdColor);
    & > h1 {
        flex: 1;
        font-size: rem(42px);
        font-weight: 400;
        color: var(--primaryText);
    }
    & > h3 {
        font-weight: 400;
        color: var(--primaryText);
        margin: 0 rem(6px);
    }
    .icons {
        font-size: rem(32px);
        margin-left: rem(10px);
        margin-top: rem(-5px);
    }
}
.dataPopover {
    width: rem(367px);
    font-size: rem(28px);
    color: var(--primaryText);
    text-align: center;
    line-height: 2;
    padding: rem(30px) 0;
    span {
        color: var(--primary);
        text-decoration: underline;
    }
}
.available-con {
    padding: rem(30px);
    .text1 {
        font-size: rem(26px);
        color: var(--textColor);
    }
    .text2 {
        font-size: rem(26px);
        color: var(--primary);
    }
}
.fullPageWrappers {
    flex: 1;
    overflow-y: auto;
    .page-content {
        position: relative;
        z-index: 1;
        padding: 0 rem(30px);
        overflow: hidden;
        .header {
            padding-bottom: rem(10px);
            font-size: rem(48px);
        }
        .transfer {
            display: flex;
            align-items: center;
            margin-top: rem(30px);
            .label {
                height: rem(200px);
                padding: rem(45px) rem(44px) 0 rem(20px);
                color: var(--color);
                font-size: rem(48px);
                line-height: rem(27px);
                text-align: center;
                word-wrap: break-word;
                background: var(--contentColor);
                .dots {
                    margin: rem(20px) 0;
                    text-align: center;
                    .dot {
                        display: block;
                        width: rem(6px);
                        height: rem(6px);
                        margin: 0 auto rem(10px) auto;
                        text-align: center;
                        background: var(--placeholdColor);
                        border-radius: 50%;
                    }
                }
            }
            .center {
                flex: 1;
                background: var(--contentColor);
                border-top-left-radius: rem(6px);
                border-bottom-left-radius: rem(6px);
                .account {
                    display: flex;
                    align-items: center;
                    height: rem(100px);
                    padding-right: rem(30px);
                    padding-left: rem(30px);
                    font-size: rem(28px);
                    line-height: rem(100px);
                    & > span {
                        margin-right: rem(20px);
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
                display: flex;
                align-items: center;
                height: rem(200px);
                background: var(--contentColor);
                border-top-right-radius: rem(6px);
                border-bottom-right-radius: rem(6px);
                .icon-wrap {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    .icon_zhuanhuan {
                        margin: 0 rem(32px);
                        color: var(--color);
                        font-size: rem(40px);
                    }
                }
            }
        }
        .action-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: rem(100px);
            margin: rem(20px) 0;
            padding: 0 rem(30px);
            color: var(--color);
            font-size: rem(28px);
            background: var(--contentColor);
            border-radius: rem(6px);
            input {
                flex: 1;
            }
            .unit {
                margin-right: rem(30px);
                padding-right: rem(30px);
                color: var(--placeholdColor);
                border-right: solid 1px var(--lineColor);
            }
            .all {
                color: var(--primary);
            }
            .label {
                flex: 1;
                padding-left: rem(20px);
            }
        }
        .tip {
            margin-left: rem(23px);
            color: var(--minorColor);
            text-align: right;
            .val {
                color: var(--color);
            }
        }
        .mt60 {
            margin-top: rem(60px);
        }
        .mb60 {
            margin-bottom: rem(60px);
        }
    }
    .footerBtn {
        position: fixed;
        bottom: 0;
        left: 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        width: 100%;
        .returnBtn {
            margin: rem(20px);
            color: #fff;
            font-weight: bold;
            font-size: rem(30px);
            background: var(--primary);
            border: none;
            border-radius: rem(6px);
        }
    }
    .right-title {
        color: var(--textColor);
        font-size: rem(24px);
        text-align: right;
    }
}
.currency-text {
    margin-bottom: rem(10px);
    font-size: rem(28px);
    color: var(--textColor);
}
.currency-icon {
    width: rem(44px);
    margin-right: rem(20px);
}
</style>

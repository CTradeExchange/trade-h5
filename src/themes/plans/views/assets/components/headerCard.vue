<template>
    <div class='headerCardBox'>
        <div class='card'>
            <div style='display: flex; align-items: center'>
                <span>{{ $t('wallet.totalAssetValuation') }}(USD)</span>
                <van-icon
                    class='hide'
                    :name="state.showAmout ? 'eye-o' : 'closed-eye'"
                    size='18'
                    @click='state.showAmout = !state.showAmout'
                />
            </div>
            <div class='totalAmount'>
                <span v-if='state.showAmout' :class='getTotalFontSize(addThousandthSign(userAccount.netWorth || 0, digits))' @click='toRecord'>
                    {{ `$${addThousandthSign(userAccount.netWorth || 0, digits)}` }}
                </span>
                <img v-if='state.showAmout' src='../../../images/assets/arrowright.svg' @click='toRecord' />
                <div v-else>
                    <div class='amount'>
                        <span>******</span>
                        <img
                            :class="['hideImgRight', state.showAmout ? '' : 'arrow-hide']"
                            src='../../../images/assets/arrowright.svg'
                            @click='toRecord'
                        />
                    </div>
                </div>
            </div>
        </div>

        <div class='action-info'>
            <div v-if='isRealTran' class='action-info-item' @click.stop='confirmOpenBlockAtm'>
                <img alt='' src='@/themeCommon/image/Deposit.png' />
                <span>{{ $t('wallet.desposit') }}</span>
            </div>

            <div v-if='isRealTran' class='action-info-item' @click="toWirhdraw('USDT')">
                <img alt='' src='@/themeCommon/image/Withdraw.png' />
                <span>{{ $t('wallet.withdraw') }}</span>
            </div>

            <div class='action-info-item' @click='onRecord'>
                <img alt='' src='@/themeCommon/image/Records.png' />
                <span>{{ $t('headLineTrade.records') }}</span>
            </div>

            <div v-if='isRealTran' class='action-info-item' @click='toRecord'>
                <img alt='' src='@/themeCommon/image/Flows.png' />
                <span>{{ $t('fund.flow') }}</span>
            </div>
        </div>
        <!-- <div class='btns'>
            <div v-if='isSupportFiat' class='item' @click="toDesposit('USDT', 1)">
                <img alt='' src='../../../images/assets/addcircle.svg' />
                <div class='text'>
                    {{ $t('wallet.buyText') }}
                </div>
            </div>
            <SwichAccount v-if='!isRealTran' :slot-fn='1' :slot-no-auto='true'>
                <div class='item'>
                    <img alt='' src='../../../images/assets/switch.svg' />
                    <div class='text'>
                        {{ $t("demoAccount.demo") }}
                    </div>
                </div>
            </SwichAccount>
            <div v-if='!isRealTran' class='item' @click='resetFn'>
                <img alt='' src='../../../images/assets/reset.svg' />
                <div class='text'>
                    {{ $t("demoAccount.reset") }}
                </div>
            </div>
        </div> -->
    </div>
    <blockAtmDialog ref='blockAtmDialogRef' />

    <Loading :show='state.loading' />
</template>

<script setup>
import { reactive, computed, watch, defineEmits, ref } from 'vue'
import { useStore } from 'vuex'
import { Toast, } from 'vant'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { mul, toFixed, plus } from '@/utils/calculation'
import { isDemoAccount, addThousandthSign } from '@/utils/util'
import { withdrawCurrencyList } from '@/api/user'
import { firebaseAnalytics } from '@/utils/firebase'
import blockAtmDialog from '@/components/blockAtmDialog'
import { useAssets } from '@/hooks/assets'

const store = useStore()
const router = useRouter()
const { t } = useI18n({ useScope: 'global' })
const emit = defineEmits(['callback', 'show'])
const blockAtmDialogRef = ref(null)

const state = reactive({
    allList: [],
    totalAssetValuation: 0,
    tradingAccountBalance: 0,
    cloudWalletValuation: 0,
    loading: false,
    showAmout: true,
})

const isRealTran = computed(() => !isDemoAccount()) // 判断是否模拟交易
const rateConfigList = computed(() => store.state._base.rateConfigList)
const accountMap = computed(() => store.state._user.customerInfo?.accountMap)
const assetsInfo = computed(() => store.state._user.assetsInfo[tradeType.value] || {})
const tradeType = computed(() => store.state._base.tradeType)

const userAccount = useAssets()
const digits = computed(() => userAccount.value.digits)
const { value: customInfo } = computed(() => store.state._user.customerInfo)

watch(
    () => accountMap.value,
    (newVal, oldVal) => {
        if (newVal) updateAssetsInfoCurrencyList()
    },
)
watch(
    () => rateConfigList.value,
    (newVal, oldVal) => {
        if (newVal) updateAssetsInfoCurrencyList()
    },
)
watch(
    () => state.showAmout,
    (newVal) => {
        emit('show', newVal)
    },
    { immediate: true },
)

const customerInfo = computed(() => store.state._user.customerInfo || {})

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

    const { accountId } = userAccount.value || {}
    if (accountId) {
        router.push({
            path: '/deposit'
        })
    }
}

// 跳转提现页面
const toWirhdraw = (currency) => {
    if (!checkAssets()) return
    firebaseAnalytics('ck_without_entrance')
    const { accountId } = userAccount.value || {}
    withdrawCurrencyList({
        customerGroupId: customInfo.customerGroupId,
        customerNo: customInfo.customerNo,
        tradeType: tradeType.value,
        accountId,
    }).then((res) => {
        if (res.check() && res.data.list.length > 0) {
            const withdrawMethodArr = new Set()
            res.data.list.forEach((item) => {
                // 数据里的withdrawMethod字符串有可能传来多个通道，用逗号隔开的数据格式
                const methodArr = item.withdrawMethod.split(',')
                methodArr.forEach((k) => {
                    withdrawMethodArr.add(k)
                })
            })
            const formatWithdrawMethod = [...withdrawMethodArr]
            if (formatWithdrawMethod.length) {
                router.push({
                    path: '/withdrawCoin',
                    query: {
                        tradeType: tradeType.value,
                        accountId,
                        currency,
                        // 如果有这个blockatm_webhook默认取这个,没有就默认取列表第一个
                        withdrawMethod: formatWithdrawMethod.includes('blockatm_webhook') ? 'blockatm_webhook' : formatWithdrawMethod[0],
                    },
                })
            } else {
                Toast(t('withdraw.tips1'))
            }
        } else {
            Toast(t('withdraw.tips1'))
        }
    })
}

// 验证是否有资产
const checkAssets = () => {
    if (assetsInfo.value) {
        return true
    } else {
        Toast(t('trade.nullAssets'))
        return false
    }
}
const updateAssetsInfoCurrencyList = () => {
    if (!rateConfigList.value || !accountMap.value) return
    const list = Object.values(accountMap.value) || []
    const data = list.map((item) => {
        const rateItem = rateConfigList.value.find((o) => o.sourceCurrency === item.currency)
        const usd = rateItem ? toFixed(mul(item.available, rateItem.rate), 2) : ''
        return { ...item, usd }
    })
    state.allList = data
    handleState()
}
const handleState = () => {
    state.tradingAccountBalance = userAccount?.availableMargin || 0
    let cloudWalletValuation = 0
    state.allList.forEach((item) => {
        const { usd } = item
        cloudWalletValuation = plus(cloudWalletValuation, usd)
    })
    state.cloudWalletValuation = cloudWalletValuation
    state.totalAssetValuation = plus(state.tradingAccountBalance, cloudWalletValuation)
    emit('callback', state)
}
// 点击按钮跳转资金流水页面
const toRecord = () => {
    router.push({
        path: '/capitalList',
        query: {
            tradeType: tradeType.value,
        },
    })
}
// 获取字体大小
const getTotalFontSize = (text) => {
    const length = String(text).length
    if (length > 14) {
        return 'amountScale'
    }
    return 'amount'
}

const onRecord = () => {
    const accountList = store.state._user.customerInfo.accountList.filter((el) => Number(el.tradeType) === tradeType.value)
    const { accountId } = accountList.find((e) => e.currency === 'USDT') || {}
    router.push({
        path: '/changList',
        query: {
            accountId,
            tradeType: tradeType.value,
            withdrawType: 2,
            type: 3
        }
    })
}
</script>

<style lang="scss" scoped>
.headerCardBox {
    background: var(--contentColor);
    width: 100%;
    padding: 0 16px;
    padding-bottom: 16px;
    .card {
        width: 100%;
        height: 104px;
        padding: 20px 15px;
        background: url('../../../images/assets/funds-wallet.png') no-repeat center;
        background-size: cover;
        color: var(--contentColor);
        border-radius: 4px;
        .hide {
            margin-left: 5px;
            margin-top: -2px;
        }
        .totalAmount {
            display: flex;
            align-items: center;
            margin-top: 16px;
            font-weight: 700;
            font-family: 'Roboto';
            .amount {
                max-width: 300px;
                overflow: hidden;
                display: flex;
                white-space: nowrap;
                text-overflow: ellipsis;
                font-size: 24px;
                .hideImgRight {
                    height: 25px;
                    margin-top: 4px;
                    &.arrow-hide {
                        margin-top: 0;
                    }
                }
            }
            .amountScale {
                max-width: rem(600px);
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                font-size: 24px;
            }
            img {
                margin-left: rem(8px);
            }
        }
    }
    .action-info {
        margin-top: 15px;
        display: flex;
        justify-content: space-between;
        .action-info-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            position: relative;
            & > img {
                width: 48px;
                height: 48px;
            }
            & > span {
                color: #0c0c0c;
                font-family: 'Roboto';
                font-size: 14px;
                font-weight: 400;
            }
        }
    }

}
</style>

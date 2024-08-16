<template>
    <div class='flex items-center justify-space-between p-4'>
        <div class='flex items-center'>
            <CurrencyIcon :currency="userAccount?.currency ? userAccount.currency : 'USDT'" :size='32' />
            <div class='ml-2'>
                <div class='font-bold text-sm'>
                    {{ currency || 'USDT' }}
                </div>
                <div class='text-minorColor text-xs'>
                    {{ rate ? `$${addThousandthSign(rate, 2)}` : '' }}
                </div>
            </div>
        </div>
        <div>
            <div class='font-bold text-sm'>
                {{ !showAmout ? '*******' : addThousandthSign(userAccount.netWorth || 0, digits) }}
            </div>
            <div class='text-minorColor text-xs'>
                {{ !showAmout ? '*******' : `$${addThousandthSign(mul(userAccount.netWorth, rate), digits)}` }}
            </div>
        </div>
    </div>
    <div class='p-3 bg-assistColor'>
        <div class='flex justify-space-between items-center mb-3'>
            <div>
                <span class='text-minorColor mr-1 text-xs tooltip-cursor' @click='showExplain(1)'>
                    {{ $t('trade.jingzhi') }}
                </span>
            </div>
            <div class='font-bold text-sm'>
                {{ !showAmout ? '*******' : `${addThousandthSign(totalInitialMargin, digits)} ${currency}` }}
            </div>
        </div>
        <div class='flex justify-space-between items-center mb-3'>
            <div>
                <span class='text-minorColor mr-1 text-xs'>
                    {{ $t('trade.positionProfit') }}
                </span>
            </div>
            <div class='font-bold text-sm' :class='{ riseColor: userAccount?.profitLoss > 0, fallColor: userAccount?.profitLoss < 0 }'>
                {{ !showAmout ? '*******' : `${gt(userAccount?.profitLoss, 0) ? '+' : ''}${addThousandthSign(userAccount.profitLoss || 0, digits)} ${currency}` }}
            </div>
        </div>
        <div class='flex justify-space-between items-center mb-3'>
            <div>
                <span class='text-minorColor mr-1 text-xs tooltip-cursor' @click='showExplain(2)'>
                    {{ $t('trade.free') }}
                </span>
            </div>
            <div class='font-bold text-sm'>
                {{ !showAmout ? '*******' : `${addThousandthSign(userAccount.availableMargin || 0, digits)} ${currency}` }}
            </div>
        </div>
        <div class='flex justify-space-between items-center mb-3'>
            <div>
                <span class='text-minorColor mr-1 text-xs tooltip-cursor' @click='showExplain(3)'>
                    {{ $t('trade.originalMargin') }}
                </span>
            </div>
            <div class='font-bold text-sm'>
                {{ !showAmout ? '*******' : `${addThousandthSign(userAccount.occupyMargin || 0, digits)} ${currency}` }}
            </div>
        </div>
        <div v-if='tradeType === 1' class='flex justify-space-between items-center'>
            <div>
                <span class='text-minorColor mr-1 text-xs tooltip-cursor' @click='showExplain(4)'>
                    {{ $t('trade.marginLevel') }}
                </span>
            </div>
            <div v-if='showAmout' class='text-sm font-bold flex items-center'>
                <span class='tradeing-assets-value'>
                    {{ userAccount?.marginRadio ? `${userAccount.marginRadio}%` : '--' }}
                </span>
                <span v-if='userAccount?.riskStatus' :class="['riskLevel', 'riskLevel' + userAccount?.riskStatus]">
                    {{ riskLevelMap[userAccount?.riskStatus] }}
                </span>
            </div>
            <div v-else class='text-sm font-bold flex items-center'>
                *******
            </div>
        </div>
    </div>
    <div class='flex items-center justify-space-between mt-5 px-4 pb-4 van-hairline--bottom'>
        <van-button block class='mr-5 h-10 rounded-xs' type='primary' @click='deposit'>
            {{ $t('wallet.desposit') }}
        </van-button>
        <van-button block class='h-10 rounded-xs plain-button' plain type='primary' @click='withdraw'>
            {{ $t('wallet.withdraw') }}
        </van-button>
    </div>
    <!-- 说明弹窗 -->
    <explain-popup v-model='state.isExplain' :explain-type='state.explainType' :user-account='userAccount' />
</template>

<script setup>
import { addThousandthSign } from '@/utils/util'
import { computed, defineProps, reactive } from 'vue'
import { useStore } from 'vuex'
import CurrencyIcon from '@/components/currencyIcon'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { firebaseAnalytics } from '@/utils/firebase'
import { withdrawCurrencyList } from '@/api/user'
import { Toast } from 'vant'
import { mul, gt, plus } from '@/utils/calculation'
import explainPopup from './explain-popup.vue'
import { useAssets } from '@/hooks/assets'
defineProps({
    showAmout: Boolean,
})
const store = useStore()
const router = useRouter()
const { t } = useI18n({ useScope: 'global' })
const customerInfo = computed(() => store.state._user.customerInfo || {})
const state = reactive({
    // 是否显示说明弹窗
    isExplain: false,
    // 说明类型
    explainType: 0,
})

// 显示说明弹窗
const showExplain = (type) => {
    state.explainType = type
    state.isExplain = true
}
const userAccount = useAssets()

const rate = computed(() => store.state._base.rateConfigList?.find?.((item) => item.sourceCurrency === userAccount.value.currency)?.rate)
const currency = computed(() => userAccount.value.currency)
const digits = computed(() => userAccount.value.digits)
const tradeType = computed(() => store.state._base.tradeType)
const totalInitialMargin = computed(() => {
    const { availableMargin, profitLoss, occupyMargin, netWorth } = userAccount.value || {}
    // 全仓直接返回接口返回的净值
    if (tradeType.value === 1) return netWorth || 0
    // 总初始保证金+盈亏+可用保证金余额兑换成美金的价值
    return plus(plus(profitLoss, availableMargin), occupyMargin)
})

const riskLevelMap = {
    1: t('riskLevel.safety'),
    2: t('riskLevel.warn'),
    3: t('riskLevel.danger'),
}

const deposit = () => {
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
    router.push({
        path: '/deposit'
    })
}

// 跳转提现页面
const withdraw = () => {
    const { tradeType, accountId, currency } = userAccount.value
    withdrawCurrencyList({
        customerGroupId: customerInfo.value.customerGroupId,
        customerNo: customerInfo.value.customerNo,
        tradeType,
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
                        tradeType,
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
</script>

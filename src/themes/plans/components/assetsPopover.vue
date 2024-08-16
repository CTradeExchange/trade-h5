<template>
    <van-popover v-if='customerInfo?.customerNo' v-model:show='visible' class='assetsPopover' :offset='[-1, 0]' overlay :show-arrow='false'>
        <template #reference>
            <div class='flex items-center h-full cursor-pointer'>
                <div class='mr-1 text-right'>
                    <div class='font-bold text-sm'>
                        {{ `${addThousandthSign(userAccount.availableMargin || 0, digits)} ${currency}` }}
                    </div>
                    <div class='text-minorColor text-xs'>
                        {{ $t('trade.free') }}
                    </div>
                </div>
                <div class='collapse-icon'>
                    <img
                        alt='arrow'
                        :class="[visible ? 'rotate--180 ' : 'rotate-0']"
                        src='/images/arrow.svg'
                    />
                </div>
            </div>
        </template>
        <template #default>
            <div class='p-5'>
                <div>
                    <van-row :gutter='20'>
                        <van-col :span='12'>
                            <div class='rounded-xs bg-assistColor p-3 mb-5'>
                                <div class='text-minorColor text-xs'>
                                    {{ $t('trade.jingzhi') }}
                                </div>
                                <div class='text-color text-sm font-bold mt-1'>
                                    {{ `${addThousandthSign(totalInitialMargin, digits)} ${currency}` }}
                                </div>
                            </div>
                        </van-col>
                        <van-col :span='12'>
                            <div class='rounded-xs bg-assistColor p-3 mb-5'>
                                <div class='text-minorColor text-xs'>
                                    {{ $t('wallet.contractProfit') }}
                                </div>
                                <div
                                    class='text-color text-sm font-bold mt-1'
                                    :class='{ riseColor: userAccount?.profitLoss > 0, fallColor: userAccount?.profitLoss < 0 }'
                                >
                                    {{
                                        `${gt(userAccount?.profitLoss, 0) ? '+' : ''}${addThousandthSign(
                                            userAccount.profitLoss || 0,
                                            digits,
                                        )} ${currency}`
                                    }}
                                </div>
                            </div>
                        </van-col>
                        <van-col :span='12'>
                            <div class='rounded-xs bg-primaryLight p-3 mb-5'>
                                <div class='text-minorColor text-xs'>
                                    {{ $t('trade.free') }}
                                </div>
                                <div class='text-color text-sm font-bold mt-1'>
                                    {{ `${addThousandthSign(userAccount.availableMargin || 0, digits)} ${currency}` }}
                                </div>
                            </div>
                        </van-col>
                        <van-col :span='12'>
                            <div class='rounded-xs bg-assistColor p-3 mb-5'>
                                <div class='text-minorColor text-xs'>
                                    {{ $t('trade.originalMargin') }}
                                </div>
                                <div class='text-color text-sm font-bold mt-1'>
                                    {{ `${addThousandthSign(userAccount.occupyMargin || 0, digits)} ${currency}` }}
                                </div>
                            </div>
                        </van-col>
                        <van-col v-if='tradeType === 1' :span='12'>
                            <div class='rounded-xs bg-assistColor p-3 mb-5'>
                                <div class='text-minorColor text-xs'>
                                    {{ $t('trade.marginLevel') }}
                                </div>
                                <div class='text-color text-sm font-bold mt-1 flex items-center'>
                                    <span class='tradeing-assets-value'>
                                        {{ userAccount?.marginRadio ? `${userAccount.marginRadio}%` : '--' }}
                                    </span>
                                    <span v-if='userAccount?.riskStatus' :class="['riskLevel', 'riskLevel' + userAccount?.riskStatus]">
                                        {{ riskLevelMap[userAccount?.riskStatus] }}
                                    </span>
                                </div>
                            </div>
                        </van-col>
                        <van-col :span='12' />
                    </van-row>
                </div>
                <div class='flex items-center justify-space-between'>
                    <van-button block class='mr-5 h-10 rounded-xs' type='primary' @click='confirmOpenBlockAtm'>
                        {{ $t('wallet.desposit') }}
                    </van-button>
                    <van-button block class='h-10 rounded-xs plain-button' plain type='primary' @click="toWirhdraw('USDT')">
                        {{ $t('wallet.withdraw') }}
                    </van-button>
                </div>
            </div>
        </template>
    </van-popover>
</template>

<script setup>
import { useStore } from 'vuex'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { addThousandthSign } from '@/utils/util'
import { firebaseAnalytics } from '@/utils/firebase'
import { useRouter } from 'vue-router'
import { withdrawCurrencyList } from '@/api/user'
import { Toast } from 'vant'
import { gt, plus } from '@/utils/calculation'
import { useAssets } from '@/hooks/assets'
const router = useRouter()
const store = useStore()
const visible = ref(false)
const { t } = useI18n({ useScope: 'global' })
const customerInfo = computed(() => store.state._user.customerInfo || {})
const userAccount = useAssets()

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

const confirmOpenBlockAtm = () => {
    visible.value = false
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
        path: '/deposit',
    })
}

// 跳转提现页面
const toWirhdraw = () => {
    visible.value = false
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

<style lang="scss">
.assetsPopover {
    position: fixed !important;
    left: 0 !important;
    .van-popover__content {
        border-top-right-radius: 0;
        border-top-left-radius: 0;
        width: 100vw;
    }
}
</style>

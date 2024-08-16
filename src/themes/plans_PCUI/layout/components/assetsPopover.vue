<template>
    <el-popover
        :popper-style="{ borderRadius: '8px', padding: 0, border: 'none', minWidth: '400px' }"
        :show-arrow='false'
        @hide='visible = false'
        @show='visible = true'
    >
        <template #reference>
            <div class='flex items-center h-8 cursor-pointer mr-2'>
                <div class='mr-6'>
                    <div class='font-bold text-sm'>
                        {{ `${addThousandthSign(userAccount.availableMargin || 0, digits)} ${currency}` }}
                    </div>
                    <div class='text-minorColor text-xs'>
                        {{ $t('trade.free') }}
                    </div>
                </div>
                <div>
                    <div
                        class='font-bold text-sm'
                        :class='{ riseColor: userAccount?.profitLoss > 0, fallColor: userAccount?.profitLoss < 0 }'
                    >
                        {{
                            `${gt(userAccount?.profitLoss, 0) ? '+' : ''}${addThousandthSign(
                                userAccount.profitLoss || 0,
                                digits,
                            )} ${currency}`
                        }}
                    </div>
                    <div class='text-minorColor text-xs'>
                        {{ $t('trade.profit') }}
                    </div>
                </div>
                <div class='collapse-icon mx-4'>
                    <img alt='arrow' :class="[visible ? 'rotate--180 ' : 'rotate-0']" src='/images/arrow.svg' />
                </div>
            </div>
        </template>
        <template #default>
            <div>
                <div class='p-5 van-hairline--bottom font-bold text-base text-color w-full'>
                    {{ $t('common.preview') }} (USDT)
                </div>
                <div class='p-5'>
                    <el-row :gutter='32'>
                        <el-col :span='12'>
                            <div>
                                <div class='text-minorColor text-sm'>
                                    {{ $t('trade.jingzhi') }}
                                </div>
                                <div class='text-color text-base font-bold mt-1 '>
                                    {{ `${addThousandthSign(totalInitialMargin|| 0, digits)} ${currency}` }}
                                </div>
                            </div>
                        </el-col>
                        <el-col :span='12'>
                            <div>
                                <div class='text-minorColor text-sm'>
                                    {{ $t('wallet.contractProfit') }}
                                </div>
                                <div
                                    class='text-color text-base font-bold mt-1 '
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
                        </el-col>
                        <el-col :span='12'>
                            <div class='mt-5'>
                                <div class='text-minorColor text-sm'>
                                    {{ $t('trade.free') }}
                                </div>
                                <div class='text-color text-base font-bold mt-1 '>
                                    {{ `${addThousandthSign(userAccount.availableMargin || 0, digits)} ${currency}` }}
                                </div>
                            </div>
                        </el-col>
                        <el-col :span='12'>
                            <div class='mt-5'>
                                <div class='text-minorColor text-sm'>
                                    {{ $t('trade.originalMargin') }}
                                </div>
                                <div class='text-color text-base font-bold mt-1 '>
                                    {{ `${addThousandthSign(userAccount.occupyMargin || 0, digits)} ${currency}` }}
                                </div>
                            </div>
                        </el-col>
                        <el-col v-if='tradeType === 1' :span='12'>
                            <div clas='mb-1 mt-5'>
                                <div class='text-minorColor text-sm'>
                                    {{ $t('trade.marginLevel') }}
                                </div>
                                <div class='text-color text-base font-bold mt-1 flex items-center'>
                                    <span class='tradeing-assets-value'>
                                        {{ userAccount?.marginRadio ? `${userAccount.marginRadio}%` : '--' }}
                                    </span>
                                    <span v-if='userAccount?.riskStatus' :class="['riskLevel', 'riskLevel' + userAccount?.riskStatus]">
                                        {{ riskLevelMap[userAccount?.riskStatus] }}
                                    </span>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </template>
    </el-popover>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { addThousandthSign } from '@/utils/util'
import { gt, plus } from '@/utils/calculation'
import { useAssets } from '@/hooks/assets'
import { useStore } from 'vuex'

const visible = ref(false)
const { t } = useI18n({ useScope: 'global' })
const store = useStore()
// 全仓合约资产
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
</script>

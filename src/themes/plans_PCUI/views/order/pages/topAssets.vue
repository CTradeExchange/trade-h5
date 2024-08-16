<template>
    <div class='h-14 w-full top-assets px-6'>
        <div class='flex h-full items-center justify-end'>
            <div class='flex flex-col justify-center mr-15'>
                <div class='text-white text-sm leading-6 font-medium'>
                    {{ isHide ? '***' : userAccount.profitLoss ? `${userAccount.profitLoss} USDT` : '0.00 USDT' }}
                </div>
                <div class='label text-xs'>
                    {{ $t('wallet.contractProfit') }}
                </div>
            </div>

            <div class='flex flex-col justify-center mr-15'>
                <div class='text-white text-sm leading-6 font-medium'>
                    {{ isHide ? '***' : userAccount.netWorth ? `${userAccount.netWorth} USDT` : '0.00 USDT' }}
                </div>
                <div class='label text-xs'>
                    {{ $t('wallet.tradingAccountBalance') }}
                </div>
            </div>
            <div class='flex flex-col justify-center mr-15'>
                <div class='text-white text-sm leading-6 font-medium'>
                    {{ isHide ? '***' : userAccount.availableMargin ? `${userAccount.availableMargin} USDT` : '0.00 USDT' }}
                </div>
                <div class='label text-xs'>
                    {{ $t('trade.freeMargin') }}
                </div>
            </div>
            <div class='flex flex-col justify-center mr-15'>
                <div class='text-white text-sm leading-6 font-medium'>
                    {{ isHide ? '***' : userAccount.occupyMargin ? `${userAccount.occupyMargin} USDT` : '0.00 USDT' }}
                </div>
                <div class='label text-xs'>
                    {{ $t('trade.originalMargin') }}
                </div>
            </div>
            <div v-if='isLogin' class='flex flex-col justify-center  mr-15'>
                <div class='text-white text-sm leading-6 font-medium flex items-center'>
                    <template v-if='!isHide'>
                        <span>{{ userAccount.marginRadio ? `${userAccount.marginRadio}%` : '--' }}</span>
                        <span v-if='userAccount?.riskStatus' :class="['riskLevel', 'riskLevel' + userAccount?.riskStatus]">
                            {{ riskLevelMap[userAccount?.riskStatus] }}
                        </span>
                    </template>
                    <template v-else>
                        ***
                    </template>
                </div>
                <div class='label text-xs'>
                    {{ $t('fund.marginLevel') }} <van-icon class='question cursor-pointer' name='question-o' @click='showExplain(4)' />
                </div>
            </div>
            <div class='text-white cursor-pointer' @click='isHide = !isHide'>
                <van-icon v-if='isHide' name='closed-eye' size='20' />
                <van-icon v-else name='eye-o' size='20' />
            </div>
        </div>
        <!-- 说明弹窗 -->
        <explain-popup
            v-model='state.isExplain'
            :explain-type='state.explainType'
            :user-account='userAccount'
        />
    </div>
</template>

<script setup>
import { computed, ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import explainPopup from './components/explain-popup.vue'
import { useAssets } from '@/hooks/assets'
const { t } = useI18n({ useScope: 'global' })

const store = useStore()
const isHide = ref(false)
const userAccount = useAssets()
const isLogin = computed(() => !!store.state._user.customerInfo?.customerNo)
const riskLevelMap = {
    1: t('riskLevel.safety'),
    2: t('riskLevel.warn'),
    3: t('riskLevel.danger'),
}

const state = reactive({
    // 是否显示说明弹窗
    isExplain: false,
    // 说明类型
    explainType: 0

})

// 显示说明弹窗
const showExplain = (type) => {
    state.explainType = type
    state.isExplain = true
}

</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.top-assets {
    background: #2a2e3f;
    .label {
        color: #9399a4;
    }
    .riskLevel {
        position: relative;
        margin-left: 10px;
        padding-left: 10px;
        font-size: rem(22px);
        font-weight: normal;
        &::before {
            content: '';
            display: block;
            position: absolute;
            top: 50%;
            left: 0;
            transform: translate(0, -50%);
            width: 6px;
            height: 6px;
            border-radius: 50%;
        }
        &.riskLevel1 {
            color: var(--success);
            &::before {
                background: var(--success);
            }
        }
        &.riskLevel2 {
            color: var(--focusColor);
            &::before {
                background: var(--focusColor);
            }
        }
        &.riskLevel3 {
            color: var(--warn);
            &::before {
                background: var(--warn);
            }
        }
    }
}
</style>

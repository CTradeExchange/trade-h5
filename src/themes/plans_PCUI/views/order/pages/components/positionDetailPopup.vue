<template>
    <van-popup
        v-model:show='show'
        class='position-detail-popup'
        :close-on-click-overlay='false'
        closeable
        lock-scroll
        :style="{ width: '420px', borderRadius: '10px' }"
        teleport='body'
    >
        <div class='pb-2'>
            <div class='flex items-center mt-4 justify-center'>
                <div class='mr-1'>
                    <ProductIcon :symbol-key='`${details.symbolId}_${details.tradeType}`' />
                </div>
                <div class='text-xl font-bold'>
                    {{ details.symbolName }}
                </div>
            </div>
            <div class='text-center text-base mb-2 font-medium' :class="Number(details?.direction) === 1 ? 'riseColor' : 'fallColor'">
                {{ Number(details?.direction) === 1 ? $t('trade.long') : $t('trade.short') }}
            </div>
            <van-cell :title="$t('fund.accupyMargin')" :value="details.occupyTheMargin ? `${details.occupyTheMargin} ${currency}` : '--'" />
            <van-cell :title="$t('trade.leverage')" :value="details.crossLevelNum ? `${details.crossLevelNum}x` : '--'" />
            <van-cell :title="$t('trade.postionSize')">
                <div>
                    <div>
                        {{ details.currentTradeAmount ? `${details.currentTradeAmount} ${currency}` : '--' }}
                    </div>
                </div>
            </van-cell>
            <van-cell :title="$t('trade.positionPrice')" :value="details.openPrice || '-'" />

            <van-cell
                :title="$t('trade.currentPrice')"
            >
                <div :class='currentProduct?.cur_color'>
                    {{ currentProduct?.cur_price || '--' }}
                </div>
            </van-cell>

            <!-- <van-cell :title="$t('trade.swap_2')" :value="details.interest ? `${details.interest} ${currency}` : '--'" /> -->
            <van-cell
                :title="$t('trade.holdMargin')"
                :value="details.maintenanceMargin ? `${details.maintenanceMargin} ${currency}` : '--'"
            />
            <van-cell :title="$t('trade.profit')">
                <span :class='{ riseColor: parseFloat(details.profitLoss) > 0, fallColor: parseFloat(details.profitLoss) < 0 }'>
                    {{ `${details.profitLoss || '+0'} ${currency}` }}
                </span>
            </van-cell>
            <!-- <van-cell :title="$t('assetsExplain.text20')">
                <span :class="['riskLevel', 'riskLevel' + details?.riskStatus]">
                    {{ riskLevelMap[details?.riskStatus] }}
                </span>
            </van-cell> -->
        </div>
    </van-popup>
</template>

<script setup>
import { ref, computed, defineExpose } from 'vue'
import { useStore } from 'vuex'
import ProductIcon from '@/components/product-icon.vue'
import { useI18n } from 'vue-i18n'

const store = useStore()
const { t } = useI18n()

const show = ref(false)
const details = ref()

const customerInfo = computed(() => store.state._user.customerInfo)
const assetsInfo = computed(() => customerInfo.value.accountList?.find((el) => Number(el.tradeType) === 2))
// 获取当产品数据
const currentProduct = computed(() => store.state._quote.productMap?.[details.value?.symbolId + '_' + details.value?.tradeType])
const currency = computed(() => assetsInfo.value?.currency || '')

// 风险状态等级文案
const riskLevelMap = {
    1: t('riskLevel.safety'),
    2: t('riskLevel.warn'),
    3: t('riskLevel.danger'),
}

const open = (_details) => {
    details.value = _details
    console.log(store.state._quote.productMap?.[details.value?.symbolId + '_' + details.value?.tradeType])
    show.value = true
}

defineExpose({
    open,
})
</script>

<style lang="scss">
.position-detail-popup {
  .riskLevel {
      &.riskLevel1 {
          color: var(--success);
      }
      &.riskLevel2 {
          color: var(--focusColor);
      }
      &.riskLevel3 {
          color: var(--warn);
      }
  }
}
</style>

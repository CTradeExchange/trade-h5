<template>
    <div>
        <div v-if='$isPC' center class='my-4 flex justify-space-between items-center'>
            <span class='text-color text-sm'>
                {{ $t('trade.tackStopSetup') }}
            </span>
            <van-switch v-model='isEnabled' :active-color='$style.primary' size='24' @change='change' />
        </div>
        <div v-else center class='my-4 flex justify-space-between items-center'>
            <div v-if='isEnabled' class='flex items-center' @click='isEnabled = false'>
                <img alt='' class='w-6 h-6' src='@/themeCommon/image/mobile-selected.png' />
                <span class='text-color text-xs ml-1'>
                    {{ $t('trade.tackStopSetup') }}
                </span>
            </div>
            <div v-else class='flex items-center' @click='show = true'>
                <img alt='' class='w-6 h-6' src='@/themeCommon/image/mobile-select.png' />
                <span class='text-color text-xs ml-1'>
                    {{ $t('trade.tackStopSetup') }}
                </span>
            </div>
            <div v-if='(profit || loss) && isEnabled' class='tooltip-cursor' @click='open'>
                {{ `${loss || '-'}/${profit || '-'}` }}
            </div>
        </div>
        <!-- 移动端弹窗方式展示 -->
        <van-popup v-if='!$isPC' v-model:show='show' :close-on-click-overlay='false' position='bottom'>
            <div class='p-5'>
                <div class='flex items-center justify-space-between mb-5'>
                    <div class='text-lg font-bold break-all'>
                        {{ $t('trade.slForPosition') }}
                    </div>
                    <van-icon class='font-bold cursor-pointer' name='cross' size='20' @click='close' />
                </div>
                <div class='flex justify-space-between items-center mb-5 text-sm'>
                    <span class='text-minorColor'>
                        {{ $t('trade.currentPrice') }}
                    </span>
                    <span class='font-bold' :class='product?.cur_color'>
                        {{ product?.cur_price || '--' }}
                    </span>
                </div>

                <profitLossSetField
                    ref='profitLossSetFieldRef'
                    v-model:stopLoss='loss'
                    v-model:stopProfit='profit'
                    :direction='props.direction'
                    :is-enabled='isEnabled || show'
                    :multiple-val='props.multipleVal'
                    :request-price='props.requestPrice'
                    :volume='props.volume'
                />
                <van-button block class='mt-10' type='primary' @click='confirm'>
                    {{ $t('compLang.confirm') }}
                </van-button>
            </div>
        </van-popup>
        <profitLossSetField
            v-else
            ref='profitLossSetFieldRef'
            :direction='props.direction'
            :is-enabled='isEnabled'
            :multiple-val='props.multipleVal'
            :request-price='props.requestPrice'
            :stop-loss='props.stopLoss'
            :stop-profit='props.stopProfit'
            :volume='props.volume'
            @update:stopLoss="(e) => emit('update:stopLoss', e)"
            @update:stopProfit="(e) => emit('update:stopProfit', e)"
        />
    </div>
</template>

<script setup>
import profitLossSetField from './profitLossSetField.vue'
import { ref, defineExpose, defineProps, computed, watch, defineEmits } from 'vue'
import { useStore } from 'vuex'

const isEnabled = ref(false)
const show = ref(false)
const profitLossSetFieldRef = ref()

const emit = defineEmits(['update:stopLoss', 'update:stopProfit'])
const store = useStore()
// 当前产品
const product = computed(() => store.getters.productActived)
const props = defineProps({
    stopLoss: {
        type: [Number, String],
    },
    stopProfit: {
        type: [Number, String],
    },
    direction: {
        type: String,
    },
    requestPrice: {
        type: [Number, String],
    },
    multipleVal: {
        type: [Number, String],
    },
    volume: {
        type: [Number, String],
    },
})

const profit = ref('')
const loss = ref('')
// 缓存第一次打开止盈止损弹窗状态
const profitLossSetFieldPreState = ref('')

const change = (e) => {
    isEnabled.value = e
}

const checkWarning = () => {
    return profitLossSetFieldRef.value?.stopProfitWarning || profitLossSetFieldRef.value?.stopLossWarning
}

defineExpose({
    checkWarning,
})

const close = () => {
    show.value = false
    // 关闭时恢复初始状态
    profitLossSetFieldRef.value.stopLossPrice = profitLossSetFieldPreState.value.stopLossPrice
    profitLossSetFieldRef.value.stopLossRate = profitLossSetFieldPreState.value.stopLossRate
    profitLossSetFieldRef.value.stopProfitPrice = profitLossSetFieldPreState.value.stopProfitPrice
    profitLossSetFieldRef.value.stopProfitRate = profitLossSetFieldPreState.value.stopProfitRate
    loss.value = profitLossSetFieldRef.value.stopLoss
    profit.value = profitLossSetFieldRef.value.stopProfit
}

const open = () => {
    show.value = true
    // 缓存当前打开止盈止损组件状态
    profitLossSetFieldPreState.value = {
        stopLossPrice: profitLossSetFieldRef.value.stopLossPrice,
        stopLossRate: profitLossSetFieldRef.value.stopLossRate,
        stopProfitPrice: profitLossSetFieldRef.value.stopProfitPrice,
        stopProfitRate: profitLossSetFieldRef.value.stopProfitRate,
    }
}

watch(
    () => [loss.value, profit.value],
    (val) => {
        emit('update:stopLoss', val[0])
        emit('update:stopProfit', val[1])
    },
)

const confirm = () => {
    if (checkWarning()) {
        return
    }
    if (loss.value || profit.value) {
        // 如果开启则更新止盈止损
        isEnabled.value = true
    }
    if (!loss.value && !profit.value) {
        isEnabled.value = false
    }
    profitLossSetFieldPreState.value = null
    show.value = false
}
</script>

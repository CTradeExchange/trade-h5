<template>
    <div class='popup-wrap'>
        <van-popup
            v-model:show='modelValue'
            class='popup-content'
            :close-on-click-overlay='false'
            :closeable='true'
            :round='true'
            @close='close'
        >
            <FundRecord />
        </van-popup>
    </div>
</template>

<script setup>
import FundRecord from '@planspc/views/funds/components/fund-record.vue'
import { defineProps, defineEmits } from 'vue'
defineProps({
    // 是否显示弹窗
    modelValue: {
        type: Boolean,
        default: false
    }
})
const emit = defineEmits(['update:modelValue'])

// 关闭弹窗
const close = () => {
    emit('update:modelValue', false)
}
</script>

<style lang="scss" scoped>
.popup-wrap {
    position: relative;
    z-index: 1000;
    :deep {
        .popup-content {
            width: 100%;
            height: calc(100vh - 100px);
            max-width: 1200px;
        }
        .van-popup__close-icon {
            color: #000;
        }
        .history-record {
            .van-popup {
                width: 360px !important;
                margin-left: -180px;
                margin-top: -180px;
                transform: translate(0, 0) !important;
            }
            .filter {
                margin-right: 40px;
            }
        }
    }
}
</style>

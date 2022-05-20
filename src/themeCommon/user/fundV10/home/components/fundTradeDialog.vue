<template>
    <div class='popup-wrap'>
        <van-popup
            v-model:show='modelValue'
            :closeable='true'
            :round='true'
            @close='close'
        >
            <div class='popup-content'></div>
        </van-popup>
    </div>
</template>

<script setup>
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

<style scoped lang="scss">
.popup-wrap {
    :deep {
        .van-icon {
            color: #000;
        }
    }
}
.popup-content {
    width: 750px;
    height: calc(100vh - 100px);
    background: #fff;
    border-radius: 20px;
}
</style>

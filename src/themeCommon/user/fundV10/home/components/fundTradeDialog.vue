<template>
    <van-popup
        v-model:show='modelValue'
        class='popup-wrap'
        :closeable='true'
        :round='true'
        @close='close'
    >
        <div class='popup-content'></div>
    </van-popup>
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
    .van-icon {
        color: #000;
    }
}
.popup-content {
    width: 750px;
    height: 600px;
    background: #fff;
    border-radius: 20px;
}
</style>

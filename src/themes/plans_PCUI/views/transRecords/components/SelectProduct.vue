<template>
    <van-popup class='py-4 w-125 rounded-sm flex flex-col overflow-hidden' :duration='0' overlay :show='modelValue' :style="{ height: '80vh' }">
        <div class='flex items-center justify-space-between mb-5  px-5 '>
            <div class='text-lg font-bold break-all'>
                {{ $t("common.chooseProduct") }}
            </div>
            <van-icon class='font-bold cursor-pointer' name='cross' size='20' @click="emit('closed')" />
        </div>
        <div class='flex-1 overflow-hidden'>
            <productSearch v-if='modelValue' :on-select='onSelect' :show-favorite='false' />
        </div>
    </van-popup>
</template>

<script setup>
import productSearch from '@/themeCommon/components/productSearch/index.vue'

import { defineEmits, defineProps } from 'vue'
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue', 'closed', 'onSelect'])
const onSelect = (product) => {
    emit('onSelect', product)
}
</script>

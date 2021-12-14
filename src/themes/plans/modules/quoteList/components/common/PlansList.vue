<template>
    <div class='playType'>
        <van-tabs v-if='reRender' v-model:active='active' class='tabs' :swipe-threshold='1'>
            <van-tab v-for='item in props.list' :key='item.tradeType' :name='item.tradeType' :title='item.name' />
        </van-tabs>
    </div>
</template>

<script setup>
import { computed, ref, nextTick } from 'vue'

const props = defineProps({
    modelValue: {
        type: [Number, String],
        default: ''
    },
    list: {
        type: [Array],
        default: null
    }
})
const emit = defineEmits(['update:modelValue'])

const active = computed({
    get: () => props.modelValue,
    set: (val) => {
        emit('update:modelValue', val)
    }
})

const reRender = ref(true)

const reset = () => {
    reRender.value = false
    nextTick(() => {
        reRender.value = true
    })
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.playType {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: flex-start;
    box-sizing: border-box;
    height: rem(100px);
    padding-right: rem(30px);
    padding-left: rem(20px);
    background-color: var(--contentColor);
    border: 1px solid var(--bgColor);
    .tabs {
        :deep(.van-tab) {
            margin-left: rem(55px);
            padding: 0;
            font-weight: bold;
            font-size: rem(32px);
            &:first-child {
                margin-left: 0;
            }
            .van-tab__text {
                color: var(--minorColor);
            }
        }
        :deep(.van-tab--active) {
            font-weight: bold;
            font-size: rem(48px);
            .van-tab__text {
                color: var(--primary);
            }
        }
        :deep(.van-tabs__line) {
            display: none;
        }
    }
}
</style>

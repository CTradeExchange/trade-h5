<template>
    <van-tabs v-model:active='orderType' class='orderTypeTab' @change='changeOrderType'>
        <van-tab v-for='(item,i) in btnList' :key='i' :name='item.val' :title='item.title' />
    </van-tabs>
</template>

<script>
import { reactive, toRefs, watchEffect } from 'vue'
export default {
    props: ['modelValue', 'btnList'],
    emits: ['update:modelValue', 'selected'],
    setup (props, { emit }) {
        const state = reactive({
            orderType: 1
        })
        watchEffect(() => {
            if (props.modelValue !== state.orderType) state.orderType = props.modelValue
        })
        const changeOrderType = (val) => {
            console.log(val)
            emit('update:modelValue', val)
            emit('selected', val)
        }
        return {
            ...toRefs(state),
            changeOrderType,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.orderTypeTab {
    margin: 0 rem(-10px);
    border-bottom: rem(20px) solid var(--bgColor);

    --van-tabs-bottom-bar-width: 20vw;
    --van-tabs-line-height: 40px;
    --van-tabs-bottom-bar-color: var(--primary);
    :deep(.van-tab) {
        flex: none;
        min-width: rem(130px);
        margin-right: rem(40px);
        padding: 0 rem(20px);
        text-align: center;
    }
}
</style>

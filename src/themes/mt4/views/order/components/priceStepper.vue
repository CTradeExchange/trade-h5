<template>
    <van-stepper v-model='value' class='priceStepper' :decimal-length='product.symbolDigits' :step='step' :min="0" @change="onChange" />
</template>

<script>
import { reactive, toRefs, watch } from 'vue'
import { minus } from '@/utils/calculation'
export default {
    props: ['modelValue','product'],
    emits:['update:modelValue'],
    setup (props,{emit}) {
        let prevVvalue = props.modelValue
        const state = reactive({
            value: props.modelValue,
            step: Math.pow(0.1, props.product.symbolDigits),
        })
        watch(
            ()=>props.modelValue,
            newVal=>{
                if(newVal!==state.value) state.value = newVal
            }
        )
        const onChange = (...ars)=>{
            let newVal = state.value;
            if(Number(prevVvalue)===0){
                newVal = minus(props.product.sell_price, props.product.volumeStep)
                console.log(newVal)
                state.value = newVal
            }
            emit('update:modelValue', newVal)
            prevVvalue = newVal
        }

        return {
            ...toRefs(state),
            onChange,
        }
    }
}
</script>

<style lang="scss" scoped>

.priceStepper {
    display: flex;
    width: 100%;
    :deep(.van-stepper__input) {
        flex: 1;
    }
    :deep(.van-stepper__minus,.van-stepper__plus) {
        color: var(--primary);
        background: none;
    }
    :deep(.van-stepper__input) {
        background: none;
    }
}
</style>

<template>
    <div class='volumn'>
        <a v-show='product.volumeStep' class='item' :class='{ disabled:disabledSub }' href='javascript:;' @click='minusVolumn(product.volumeStep*10)'>
            -{{ mul(product.volumeStep,10) }}
        </a>
        <a v-show='product.volumeStep' class='item' :class='{ disabled:disabledSub }' href='javascript:;' @click='minusVolumn(product.volumeStep)'>
            -{{ product.volumeStep }}
        </a>
        <span class='item' :class='{ disabled }'>
            <input
                class='volumnInput'
                :class='{ disabled }'
                :disabled='disabled'
                type='text'
                :value='modelValue'
                @blur='onBlur'
                @input='onInput'
            />
        </span>
        <a v-show='product.volumeStep' class='item' :class='{ disabled:disabledAdd }' href='javascript:;' @click='plusVolumn(product.volumeStep)'>
            +{{ product.volumeStep }}
        </a>
        <a v-show='product.volumeStep' class='item' :class='{ disabled:disabledAdd }' href='javascript:;' @click='plusVolumn(product.volumeStep*10)'>
            +{{ mul(product.volumeStep,10) }}
        </a>
    </div>
</template>

<script>
import { computed, reactive, toRefs, watchEffect } from 'vue'
import { minus, plus, mul, toFixed, getDecimalNum } from '@/utils/calculation'
export default {
    props: ['modelValue', 'product', 'disabled', 'min', 'max'],
    emits: ['update:modelValue'],
    setup (props, { emit }) {
        const state = reactive({
            volumn: props.modelValue
        })
        // watchEffect(() => (state.volumn = props.modelValue))
        const disabledSub = computed(() => (props.disabled || Number(props.modelValue) <= props.min))
        const disabledAdd = computed(() => (props.disabled || Number(props.modelValue) >= props.max))
        const onInput = (e) => {
            let newval = e.target.value
            const volumeDigit = getDecimalNum(props.product.minVolume)
            const reg = new RegExp('^\\d*(\\.?\\d{0,' + volumeDigit + '})', 'g')
            if (getDecimalNum(newval) > volumeDigit) {
                newval = (newval.match(reg)[0]) || ''
                if (volumeDigit === 0 && newval.endsWith('.')) newval = newval.replace(/\./g, '') // 浏览器不允许给number输入框输入'1.'字符串
                e.target.value = newval
            }
            // const inputVal = $event.target.value.trim().replace(/[a-zA-Z]/g, '')
            // if (inputVal !== $event.target.value) {
            //     $event.target.value = inputVal
            //     state.volumn = inputVal
            // }
            // let newval = Number(inputVal)
            // const inputDigit = getDecimalNum(inputVal)
            // // if (newval === 0) return false
            // if (newval > props.max) {
            //     newval = props.max
            //     $event.target.value = newval
            //     state.volumn = newval
            // } else if (newval < props.min) {
            //     newval = props.min
            //     $event.target.value = newval
            //     state.volumn = newval
            // }
            // if (inputDigit > volumeDigit) {
            //     newval = toFixed(newval, volumeDigit)
            //     $event.target.value = newval
            //     state.volumn = newval
            // }
            emit('update:modelValue', newval)
        }
        const onBlur = e => {
            let value = e.target.value
            const volumeDigit = getDecimalNum(props.product.minVolume)
            if (value === props.modelValue) return false
            value = value ? toFixed(value, volumeDigit) : value
            this.$emit('update:modelValue', value)
        }

        // 快速加减
        const plusVolumn = (num) => {
            if (disabledAdd.value) return false
            const newval = plus(state.volumn, num)
            state.volumn = newval > props.max ? props.max : newval
            emit('update:modelValue', state.volumn)
        }
        // 快速减
        const minusVolumn = (num) => {
            if (disabledSub.value) return false
            const newval = minus(state.volumn, num)
            state.volumn = newval < props.min ? props.min : newval
            emit('update:modelValue', state.volumn)
        }

        return {
            ...toRefs(state),
            onInput,
            onBlur,
            mul,
            plusVolumn,
            minusVolumn,
            disabledSub,
            disabledAdd,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.volumn {
    @include ftbd();
    position: relative;
    display: flex;
    margin-top: rem(40px);
    padding: 1px;
    padding-bottom: rem(10px);
    line-height: rem(44px);
    text-align: center;
    .item {
        flex: 1;
        font-size: rem(26px);
        &:not(.disabled) {
            @include active();
        }
        &.disabled {
            color: var(--placeholder);
        }
    }
    .volumnInput {
        width: 100%;
        text-align: center;
        &:disabled {
            color: var(--color);
            background: none;
        }
    }
}
</style>

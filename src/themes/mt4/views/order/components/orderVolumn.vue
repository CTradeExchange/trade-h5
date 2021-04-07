<template>
    <div class='volumn'>
        <a class='item' :class="{disabled}" href='javascript:;' v-show="product.minVolume" @click='minusVolumn(product.minVolume*10)'>
            -{{product.minVolume*10}}
        </a>
        <a class='item' :class="{disabled}" href='javascript:;' v-show="product.minVolume" @click='minusVolumn(product.minVolume)'>
            -{{product.minVolume}}
        </a>
        <span class='item' :class="{disabled}">
            <input v-model.trim='volumn' class='volumnInput' :disabled="disabled" :class="{disabled}" type='text' @input='onInput' />
        </span>
        <a class='item' :class="{disabled}" href='javascript:;' v-show="product.minVolume" @click='plusVolumn(product.minVolume)'>
            +{{product.minVolume}}
        </a>
        <a class='item' :class="{disabled}" href='javascript:;' v-show="product.minVolume" @click='plusVolumn(product.minVolume*10)'>
            +{{product.minVolume*10}}
        </a>
    </div>
</template>

<script>
import { reactive, toRefs, watch } from 'vue'
import { minus, plus } from '@/utils/calculation'
export default {
    props: ['modelValue', 'product', 'disabled'],
    emits: ['update:modelValue'],
    setup (props, { emit }) {
        const state = reactive({
            volumn: props.modelValue
        })
        watch(
            () => props.modelValue,
            newval => (state.volumn = newval)
        )
        const onInput = ($event) => {
            emit('update:modelValue', $event.target.value)
        }
        // 快速加减
        const plusVolumn = (num) => {
            if(props.disabled) return false;
            state.volumn = plus(state.volumn, num)
            emit('update:modelValue', state.volumn)
        }
        // 快速减
        const minusVolumn = (num) => {
            if(props.disabled) return false;
            state.volumn = minus(state.volumn, num)
            emit('update:modelValue', state.volumn)
        }
        return {
            ...toRefs(state),
            onInput,
            plusVolumn,
            minusVolumn,
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

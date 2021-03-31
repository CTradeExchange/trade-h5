<template>
    <div class='volumn'>
        <a class='item' href='javascript:;' @click='minusVolumn(0.1)'>
            -0.1
        </a>
        <a class='item' href='javascript:;' @click='minusVolumn(0.01)'>
            -0.01
        </a>
        <span class='item'>
            <input v-model.trim='volumn' class='volumnInput' type='text' @input='onInput' />
        </span>
        <a class='item' href='javascript:;' @click='plusVolumn(0.01)'>
            +0.01
        </a>
        <a class='item' href='javascript:;' @click='plusVolumn(0.1)'>
            +0.1
        </a>
    </div>
</template>

<script>
import { reactive, toRefs, watch } from 'vue'
import { minus, plus } from '@/utils/calculation'
export default {
    props: ['modelValue'],
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
            state.volumn = plus(state.volumn, num)
            emit('update:modelValue', state.volumn)
        }
        // 快速减
        const minusVolumn = (num) => {
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
        @include active();
        flex: 1;
        font-size: rem(26px);
    }
    .volumnInput {
        width: 100%;
        text-align: center;
    }
}
</style>

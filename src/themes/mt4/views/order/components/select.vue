<template>
    <div class='selectWrapper'>
        <div :class='{ disabled }' @click='toggleVisible'>
            <slot>
                <p class='titleBar'>
                    {{ openOrderSelected && openOrderSelected[nameField] }}
                </p>
            </slot>
        </div>

        <div v-show='dropdownWrap' class='dropdownWrap' @click='dropdownWrap = false'>
            <a v-for='(item,index) in options' :key='item.val' class='item of-1px-bottom' href='javascript:;' @click='selectedItem(item,index)'>
                {{ item[nameField] }}
            </a>
        </div>
    </div>
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
export default {
    props: {
        modelValue: [String, Number],
        options: Array,
        disabled: {
            type: Boolean,
            default: false
        },
        valueField: {
            type: String,
            default: 'id'
        },
        nameField: {
            type: String,
            default: 'label'
        },
    },
    emits: ['selected', 'update:modelValue'],
    setup (props, { emit, slots }) {
        const state = reactive({
            dropdownWrap: false
        })
        const openOrderSelected = computed(() => {
            const valueField = props.valueField
            return props.options.find(el => el[valueField] === props.modelValue)
        })
        // 选中选项
        const selectedItem = (item, index) => {
            emit('selected', item, index)
            emit('update:modelValue', item[props.valueField])
        }

        const toggleVisible = () => {
            console.log(props.disabled)
            if (props.disabled) return false
            state.dropdownWrap = !state.dropdownWrap
        }
        return {
            ...toRefs(state),
            selectedItem,
            openOrderSelected,
            toggleVisible,
        }
    }
}
</script>

<style lang="scss">
@import '~@/sass/mixin.scss';
.selectWrapper {
    @include ftbd();
    margin-top: rem(20px);
    padding: 1px;
    text-align: center;
    .disabled {
        color: var(--mutedColor);
    }
    .titleBar {
        position: relative;
        padding: rem(15px) 0 rem(5px);
        overflow: hidden;
        font-size: rem(28px);
        &::after {
            position: absolute;
            right: -6px;
            bottom: -6px;
            width: 13px;
            height: 13px;
            background: var(--placeholder);
            transform: rotate(45deg);
            content: '';
        }
    }
    .dropdownWrap {
        position: absolute;
        top: 100%;
        left: 0;
        z-index: 3;
        width: 100%;
        background: var(--bgColor);
        box-shadow: 1px 1px rem(15px) rgba(0, 0, 0, 0.3);
        .item {
            display: block;
            color: inherit;
            font-size: rem(28px);
            line-height: rem(80px);
        }
    }
}
</style>

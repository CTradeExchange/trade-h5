<template>
    <van-dropdown-menu class='menu'>
        <van-dropdown-item v-model='flowType' :options='flowTypes' @change='onChange' />
    </van-dropdown-menu>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

export default {
    emits: ['change'],
    setup (props, context) {
        const { tm } = useI18n({ useScope: 'global' })
        const proBtns = tm('fund.proBtns')
        const flowTypes = Object.keys(proBtns).map(key => ({
            text: proBtns[key],
            value: key
        }))
        const flowType = ref(flowTypes[0].value)

        const onChange = (value) => {
            context.emit('change', value)
        }

        return {
            flowType,
            flowTypes,
            onChange
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.menu {
    height: rem(48px);
    margin-left: rem(20px);
    padding: 0 rem(27px) 0 rem(6px);
    background: var(--contentColor);
    border-radius: rem(6px);
    :deep(.van-dropdown-menu__title) {
        color: var(--normalColor);
    }
    :deep(.van-dropdown-menu__bar) {
        height: 100%;
        box-shadow: none;
    }
    :deep(.van-dropdown-menu__title--active) {
        color: var(--primary);
    }
    :deep(.van-dropdown-item__icon) {
        color: var(--primary);
    }
}
</style>

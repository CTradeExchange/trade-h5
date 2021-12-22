<template>
    <!--
    <van-dropdown-menu class='menu'>
        <van-dropdown-item v-model='flowType' :options='flowTypes' @change='onChange' />
    </van-dropdown-menu>
-->
    <el-dropdown>
        <div class='flowType'>
            {{ flowText }}<i class='el-icon-caret-bottom'></i>
        </div>
        <template #dropdown>
            <el-dropdown-menu v-model='flowType'>
                <el-dropdown-item v-for='item in flowTypes' @click.native='onChange(item.value)'>
                    {{ item.text }}
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { computed, reactive, toRefs } from 'vue'

export default {
    emits: ['change'],
    props: {
        value: {
            type: [String, Number],
            default: ''
        },
        tradeType: {
            type: [String, Number],
            default: ''
        }
    },
    setup (props, context) {
        const { t, tm } = useI18n({ useScope: 'global' })
        const flowCategories = tm(`fund.flowCategories.${props.tradeType}`)
        const flowTypes = [
            {
                text: t('common.all'),
                value: ''
            }
        ]
        const state = reactive({
            flowText: t('common.all')
        })

        flowTypes.push(...Object.keys(flowCategories).map(key => ({
            text: flowCategories[key],
            value: key
        })))

        const flowType = computed({
            get: () => props.value || flowTypes[0].value,
            set () {}
        })
        const formatFlowType = (flowType) => {
            flowTypes.forEach(el => {
                if (el.value == flowType) {
                    state.flowText = el.text
                }
            })
        }

        const onChange = (value) => {
            formatFlowType(value)
            context.emit('change', value)
        }

        return {
            flowType,
            flowTypes,
            onChange,
            formatFlowType,
            ...toRefs(state)
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
.flowType{
        background: var(--contentColor);
        font-size: 12px;
        padding: 5px;
        margin-left: 10px;
        color: var(--color);
    }
</style>

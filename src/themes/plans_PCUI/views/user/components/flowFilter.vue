<template>
    <el-select
        v-model='flowType'
        class='flow-select'
        placeholder='---'
        suffix-icon="CaretBottom"
        @change='onChange'
    >
        <el-option
            v-for='(item, index) in flowTypes'
            :key='index'
            :label='item.text'
            :value='item.value'
            :class="flowType === item.value ? 'flow-selected' : ''"
        >
            <span >
                {{ item.text }}
                <el-icon v-if="flowType === item.value"><Check /></el-icon>
            </span>
        </el-option>
    </el-select>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

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
        flowTypes.push(...Object.keys(flowCategories).map(key => ({
            text: flowCategories[key],
            value: key
        })))

        const flowType = computed({
            get: () => props.value || flowTypes[0].value,
            set () {}
        })

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

<style lang="scss" scope>
@import '@/sass/mixin.scss';
.flow-select {
    width: 160px;
    height: 40px;
    background: #fff;
    border-radius: 2px;
    border: none;
    display: flex;
    align-items: center;
    margin-right: 16px;
    overflow: hidden;
    .is-focus {
        box-shadow: none !important;
    }
    .el-input.is-focus .el-input__wrapper {
        box-shadow: none !important;
    }
    .el-input__wrapper {
        font-size: 16px;
        font-weight: 600;
        line-height: 1.2;
        padding: 0 16px !important;
        box-shadow: none !important;
        background: transparent;
    }
    .el-input__inner {
        margin: 0 2px;
        font-size: 16px;
        line-height: 1.2;
        box-shadow: none !important;
    }
    .el-input__wrapper.is-focus {
        box-shadow: none !important;
    }
}
</style>
<style lang="scss">
.flow-selecteds {
    position: relative;
    & > span {
        color: var(--primary);
        & > i {
            color: var(--primary);
            position: absolute;
            right: 8px;
            top: 8px;
        }
    }
}
</style>

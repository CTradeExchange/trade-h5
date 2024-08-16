<template>
    <el-select
        v-model='dateModel'
        class='flow-select'
        placeholder='---'
        suffix-icon="CaretBottom"
        @change='onDateChange'
    >
        <el-option
            v-for='(item, index) in dateOption'
            :key='index'
            :label="item.text"
            :value='item.value'
            :class="dateModel === item.value ? 'flow-selected' : ''"
        >
            <span >
                {{ item.text }}
                <el-icon v-if="dateModel === item.value"><Check /></el-icon>
            </span>
        </el-option>
    </el-select>
</template>

<script>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
export default {
    emits: ['change'],
    setup (props, context) {
        const { t } = useI18n({ useScope: 'global' })
        const dateOption = computed(() => [
            { text: t('common.curToday'), value: 1 },
            { text: t('common.curWeek'), value: 2 },
            { text: t('common.curMonth'), value: 3 },
            { text: t('common.curThreeMonth'), value: 4 },
            // { text: t('common.curTimeZone'), value: 5 },
        ])

        const getTime = (type) => {
            return window.dayjs().startOf(type).valueOf()
        }

        const period = {
            1: getTime('day'),
            2: window.dayjs(window.dayjs().subtract(7, 'day').format('YYYY/MM/DD')).valueOf(),
            3: window.dayjs(window.dayjs().subtract(1, 'month').format('YYYY/MM/DD')).valueOf(),
            4: window.dayjs(window.dayjs().subtract(3, 'month').format('YYYY/MM/DD')).valueOf(),
            5: window.dayjs(window.dayjs().subtract(10, 'year').format('YYYY/MM/DD')).valueOf(),
        }
        // 下拉菜单Ref
        const dropdownItemRef = ref(null)
        // 下拉菜单的值
        const dateModel = ref(2)
        // 监听下拉菜单变化
        const onDateChange = (value) => {
            const startTime = period[value]
            const endTime = window.dayjs().endOf('day').valueOf()
            context.emit('change', startTime ? [startTime, endTime] : null)
        }

        const onRangeChange = value => {
            dateModel.value = 5
            context.emit('change', value)
        }

        return {
            dateModel,
            dateOption,
            onDateChange,
            dropdownItemRef,
            onRangeChange,
            context
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
.flow-selected {
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

<template>
    <popover v-if='$isPC' :text="$t('trade.lineTypeSet')" touch-disabled>
        <template #reference>
            <van-popover v-model:show='show'>
                <div
                    v-for='(value, name) in chartTypeList'
                    :key='name'
                    class='px-4 h-8 flex items-center border-bottom cursor-pointer'
                    :class="chartType == name ? 'text-primary' : ''"
                    @click='_setChartType(name)'
                >
                    <span class='flex items-center' :class="chartType == name ? 'text-primary' : ''">
                        <ChartTypeIcon class='mr-1' :value='name' />
                        {{ value }}
                    </span>
                </div>
                <template #reference>
                    <ChartTypeIcon class='flex items-center h-full' :value='chartType' />
                </template>
            </van-popover>
        </template>
    </popover>
    <van-dropdown-menu v-else class='chart-type'>
        <van-dropdown-item ref='chartTypeDropdown'>
            <template #title>
                <ChartTypeIcon class='kIcon' :value='chartType' />
            </template>
            <van-cell v-for='(value, name) in chartTypeList' :key='name' @click='_setChartType(name)'>
                <template #title>
                    <span class='flex items-center'>
                        <ChartTypeIcon class='kIcon' :value='name' />
                        {{ value }}
                    </span>
                </template>
                <template #right-icon>
                    <van-icon
                        v-if='chartType == name'
                        class='klineTypeRightIcon'
                        :class="chartType == name ? 'text-primary' : ''"
                        name='success'
                    />
                </template>
            </van-cell>
        </van-dropdown-item>
    </van-dropdown-menu>
</template>

<script setup>
import { defineProps, ref } from 'vue'
import useChartConfig from './useChartConfig'
import ChartTypeIcon from './chartTypeIcon'
const { chartTypeList } = useChartConfig()
const chartTypeDropdown = ref()
const show = ref()
const props = defineProps({
    setChartType: Function,
    chartType: [Number, String],
})

const _setChartType = (value) => {
    props.setChartType(value)
    chartTypeDropdown.value?.toggle?.()
    show.value = false
}
</script>

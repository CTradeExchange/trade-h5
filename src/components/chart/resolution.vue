<template>
    <van-popover v-if='$isPC' v-model:show='visible'>
        <div
            v-for='(value, name) in resolutionConfig'
            :key='name'
            class='px-4 h-8 flex items-center border-bottom cursor-pointer'
            :class="resolution === name ? 'text-primary' : ''"
            @click='_setResolution(name)'
        >
            {{ value }}
        </div>
        <template #reference>
            <div class='border-right cursor-pointer text-xs px-4 menu  py-1'>
                <span>{{ resolutionConfig[resolution] }}</span>
                <van-icon class='ml-1' :name="visible ? 'arrow-up' : 'arrow-down'" />
            </div>
        </template>
    </van-popover>
    <div v-else class='flex-1'>
        <div class='flex items-center justify-space-between mr-4 text-minorColor'>
            <template v-for='(value, name, index) in resolutionConfig' :key='name'>
                <div
                    v-if='index < 4'
                    class='cursor-pointer text-xs'
                    :class="resolution === name ? 'text-color' : ''"
                    @click='_setResolution(name)'
                >
                    {{ value }}
                </div>
            </template>

            <van-dropdown-menu>
                <van-dropdown-item ref='dropdownItem' @close='visible = false' @open='visible = true'>
                    <template #title>
                        <div :class="visible ? 'text-primary' : ![1, 5, 15, 30].includes(Number(resolution)) ? 'text-color' : ''">
                            <span class='text-xs'>
                                {{ ![1, 5, 15, 30].includes(Number(resolution)) ? resolutionConfig[resolution] : $t('chart.more') }}
                            </span>
                            <van-icon class='ml-1' :name="visible ? 'arrow-up' : 'arrow-down'" size='12' />
                        </div>
                    </template>

                    <template v-for='(value, name, index) in resolutionConfig' :key='name'>
                        <van-cell v-if='index > 3' @click='_setResolution(name, true)'>
                            <template #title>
                                <span class='flex items-center text-xs'>
                                    {{ value }}
                                </span>
                            </template>
                            <template #right-icon>
                                <van-icon
                                    v-if='resolution === name'
                                    class='klineTypeRightIcon'
                                    :class="resolution === name ? 'text-primary' : 'text-minorColor'"
                                    name='success'
                                />
                            </template>
                        </van-cell>
                    </template>
                </van-dropdown-item>
            </van-dropdown-menu>
        </div>
    </div>
</template>

<script setup>
import { defineProps, ref } from 'vue'
import useChartConfig from './useChartConfig'
const { resolutionConfig } = useChartConfig()
const visible = ref(false)
const dropdownItem = ref(null)
const props = defineProps({
    setResolution: Function,
    resolution: [Number, String],
})

const _setResolution = (value, flag) => {
    visible.value = false
    props.setResolution(value)
    flag && dropdownItem.value?.toggle()
}
</script>

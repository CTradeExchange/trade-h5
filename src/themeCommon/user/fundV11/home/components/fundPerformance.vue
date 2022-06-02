<template>
    <div id='chartDom' ref='chartDom' class='chartDom'></div>
</template>

<script setup>
import { useChart } from '../hooks.js'
import { onMounted, ref, defineProps } from 'vue'
const props = defineProps({
    // 基金id
    fundId: {
        fundId: String,
        default: ''
    },
    // 旋转角度
    rotate: {
        type: Number,
        default: 0
    }
})

const chartDom = ref(null)
const { getAssetPerformance, newBarChart } = useChart({ fundId: props.fundId })

onMounted(() => {
    // 获取单资产表现柱状图数据
    getAssetPerformance(props.symbolId).then(data => {
        const chartXData = []
        const chartYData = []
        data.forEach(el => {
            chartYData.push({
                value: el.quoteChange,
                itemStyle: {
                    color: el.quoteChange < 0 ? '#a90000' : '#2b70ae'
                }
            })
            chartXData.push(el.xAxisName)
        })
        if (chartDom.value) {
            newBarChart(chartDom.value, [chartXData, chartYData], props.rotate)
        }
    })
})
</script>

<style scoped lang="scss">
.chartDom {
    height: 300px;
}
</style>

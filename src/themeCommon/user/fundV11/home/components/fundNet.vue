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
    }
})

const chartDom = ref(null)
const { getMarketPerformanceData, newChart } = useChart({ fundId: props.fundId })

onMounted(() => {
    // 市场价格 vs 基金净值
    getMarketPerformanceData().then(res => {
        const [data1, data2] = res
        const xData = []
        const yData = []
        const xDataSource = data1 || data2 || ['', []]
        xDataSource[1].forEach(el => {
            xData.push(el.time)
        })
        if (data1?.length) {
            yData.push({
                name: data1[0],
                type: 'line',
                // stack: 'Total',
                showSymbol: false,
                data: data1[1].map(el => el.value)
            })
        }

        if (data2?.length) {
            yData.push({
                name: data2[0],
                type: 'line',
                // stack: 'Total',
                showSymbol: false,
                data: data2[1].map(el => el.value)
            })
        }

        if (yData) {
            newChart(chartDom.value, [xData, yData])
        } else {
            chartDom.value.style.display = 'none'
        }
    })
})
</script>

<style scoped lang="scss">
.chartDom {
    height: 300px;
}
</style>

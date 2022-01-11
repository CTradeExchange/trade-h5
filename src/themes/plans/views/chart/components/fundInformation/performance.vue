<template>
    <div class='fundPerformance'>
        <h4 class='title'>
            {{ $t('fundInfo.fundChart1') }}
        </h4>
        <div class='chartModule'>
            <div id='marketPriceJZ_DOM' ref='marketPriceJZ_DOM' class='chartLine'></div>
        </div>
        <div class='chartModule'>
            <div id='marketPriceJZ_DOM1' ref='marketPriceJZ_DOM1' class='chartLine'></div>
        </div>
        <h4 class='title spaceLine'>
            {{ $t('fundInfo.fundChart2') }}
        </h4>
        <div class='chartModule'>
            <div id='marketAppearance_DOM' ref='marketAppearance_DOM' class='chartLine'></div>
        </div>
        <div class='chartModule'>
            <div id='marketAppearance_DOM1' ref='marketAppearance_DOM1' class='chartLine'></div>
        </div>
        <p class='minorTip'>
            {{ $t('fundInfo.fundChartTip') }}
        </p>
    </div>
</template>

<script setup>
import { nextTick, onMounted, ref } from 'vue'
import { usePerformance } from './hooks/persormanceData'

const marketPriceJZ_DOM = ref('')
const marketPriceJZ_DOM1 = ref('')
const marketAppearance_DOM = ref('')
const marketAppearance_DOM1 = ref('')
const { getMarketPerformanceData, getMarketPerformanceData1, getMarketPerformanceQuoteChange, getMarketPerformanceQuoteChange1, newChart } = usePerformance()
onMounted(async () => {
    await nextTick()

    // 市场价格 vs 基金净值
    getMarketPerformanceData().then(res => {
        const [data1, data2] = res
        if (!data1?.length || !data2?.length) return false
        const xData = []
        const yData = []
        data1[1].forEach(el => {
            xData.push(el.time)
        })
        yData.push({
            name: data1[0],
            type: 'line',
            stack: 'Total',
            data: data1[1].map(el => el.value)
        })
        yData.push({
            name: data2[0],
            type: 'line',
            stack: 'Total',
            data: data2[1].map(el => el.value)
        })

        newChart(marketPriceJZ_DOM.value, [xData, yData], {
            width: marketPriceJZ_DOM.value.clientWidth,
            height: 260
        })
    })
    getMarketPerformanceData1().then(res => {
        const [data1, data2] = res
        if (!data1?.length || !data2?.length) return false
        const xData = []
        const yData = []
        data1[1].forEach(el => {
            xData.push(el.time.slice(0, 16))
        })
        yData.push({
            name: data1[0],
            type: 'line',
            stack: 'Total',
            data: data1[1].map(el => el.value)
        })
        yData.push({
            name: data2[0],
            type: 'line',
            stack: 'Total',
            data: data2[1].map(el => el.value)
        })
        newChart(marketPriceJZ_DOM1.value, [xData, yData], {
            width: marketPriceJZ_DOM1.value.clientWidth,
            height: 260
        })
    })

    // 市场表现
    getMarketPerformanceQuoteChange().then(res => {
        const [data1, data2] = res
        if (!data1?.length || !data2?.length) return false
        const xData = []
        const yData = []
        data1[1].forEach(el => {
            xData.push(el.time.slice(0, 16))
        })
        yData.push({
            name: data1[0],
            type: 'line',
            stack: 'Total',
            data: data1[1].map(el => el.value)
        })
        yData.push({
            name: data2[0],
            type: 'line',
            stack: 'Total',
            data: data2[1].map(el => el.value)
        })
        newChart(marketAppearance_DOM.value, [xData, yData], {
            width: marketAppearance_DOM.value.clientWidth,
            height: 260
        })
    })

    getMarketPerformanceQuoteChange1().then(res => {
        const [data1, data2] = res
        if (!data1?.length || !data2?.length) return false
        const xData = []
        const yData = []
        data1[1].forEach(el => {
            xData.push(el.time.slice(0, 16))
        })
        yData.push({
            name: data1[0],
            type: 'line',
            stack: 'Total',
            data: data1[1].map(el => el.value)
        })
        yData.push({
            name: data2[0],
            type: 'line',
            stack: 'Total',
            data: data2[1].map(el => el.value)
        })
        console.log(xData, yData)
        newChart(marketAppearance_DOM1.value, [xData, yData], {
            width: marketAppearance_DOM1.value.clientWidth,
            height: 260
        })
    })
})
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.fundPerformance{
    .title{
        font-size: rem(32px);
    }
    .chartModule{
        margin-top: rem(30px);
    }
    .spaceLine{
        border-top: 6px solid var(--bgColor);
        margin-top: rem(40px);
        padding-top: rem(40px);
    }
    .minorTip{
        text-align: center;
        margin-top: rem(50px);
        color: var(--minorColor);
    }
}
.chartLine{
    height: rem(500px);
}
</style>

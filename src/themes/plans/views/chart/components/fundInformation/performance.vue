<template>
    <div class='fundPerformance'>
        <h4 class='title'>
            {{ $t('fundInfo.fundChart1') }}
        </h4>
        <div class='chartModule'>
            <div id='marketPriceJZ_DOM' ref='marketPriceJZ_DOM'></div>
        </div>
        <h4 class='title spaceLine'>
            {{ $t('fundInfo.fundChart2') }}
        </h4>
        <div class='chartModule'>
            <div id='marketAppearance_DOM' ref='marketAppearance_DOM'></div>
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
const marketAppearance_DOM = ref('')
const { getMarketPerformanceData, getMarketPerformanceQuoteChange, newChart } = usePerformance()
onMounted(async () => {
    await nextTick()

    // 市场价格 vs 基金净值
    getMarketPerformanceData().then(res => {
        const [data1, data2] = res
        newChart(marketPriceJZ_DOM.value, [data1, data2], {
            width: marketPriceJZ_DOM.value.clientWidth,
            height: 260
        })
    })

    // 市场表现
    getMarketPerformanceQuoteChange().then(res => {
        const [data1, data2] = res
        newChart(marketAppearance_DOM.value, [data1, data2], {
            width: marketAppearance_DOM.value.clientWidth,
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
</style>

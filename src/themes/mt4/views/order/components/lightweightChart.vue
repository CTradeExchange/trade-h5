<template>
    <div id="lightweightChart" ref="chartEl"></div>
</template>

<script>
import { createChart } from 'lightweight-charts'
import { ref, onMounted, watch, computed } from 'vue'
import { useStore } from 'vuex'
export default {
    props: ['product'],
    setup({ product }) {
        const chartEl = ref(null)
        const store = useStore()
        const style = computed(()=>store.state.style);
        const initChart = () => {
            const el = chartEl.value
            const chart = createChart(chartEl.value, {
                width: el.clientWidth,
                height: 300,
                timeScale: {
                    visible: false
                },
                grid: {
                    vertLines: false,
                    horzLines: {
                        color: 'rgba(197, 203, 206, 0.7)'
                    }
                }
            })
            const buyLineSeries = chart.addLineSeries({
                lineWidth: 1,
                color:style.value.buyColor,
                priceFormat: {
                    precision: product.symbolDigits
                }
            })
            const sellLineSeries = chart.addLineSeries({
                lineWidth: 1,
                color:style.value.sellColor,
                priceFormat: {
                    precision: product.symbolDigits
                }
            })
            console.log(buyLineSeries)
            if (product.tick_time) {
                buyLineSeries.setData([{ time: parseInt(product.tick_time / 1000), value: Number(product.buy_price) }])
                sellLineSeries.setData([{ time: parseInt(product.tick_time / 1000), value: Number(product.sell_price) }])
            }
            watch(
                () => product.price,
                newval => {
                    // console.log(product.tick_time * 1, product.buy_price * 1)
                    buyLineSeries.update({ time: parseInt(product.tick_time / 1000), value: Number(product.buy_price) })
                    sellLineSeries.update({ time: parseInt(product.tick_time / 1000), value: Number(product.sell_price) })
                }
            )
        }
        onMounted(() => {
            initChart()
        })
        return {
            chartEl
        }
    }
}
</script>

<style lang="scss" scoped></style>

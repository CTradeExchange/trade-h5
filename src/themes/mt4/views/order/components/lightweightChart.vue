<template>
    <div id='lightweightChart' ref='chartEl'></div>
</template>

<script>
import { createChart } from 'lightweight-charts'
import { ref, onMounted, watch, computed } from 'vue'
import { useStore } from 'vuex'
export default {
    props: ['product'],
    setup ({ product }) {
        const chartEl = ref(null)
        const store = useStore()
        const style = computed(() => store.state.style)
        const buyPriceArrs = []
        const sellPriceArrs = []
        let stopLossLine, takeProfitLine
        const initChart = () => {
            const el = chartEl.value
            const chart = createChart(chartEl.value, {
                width: el.clientWidth,
                height: 300,
                handleScroll: { // 禁用图表上下滑动，让网页可以上下滑动
                    vertTouchDrag: false,
                },
                handleScale: { // 禁用图表上下缩放，让网页可以上下滑动
                    axisPressedMouseMove: false,
                },
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
            // 买价线
            const buyLineSeries = chart.addLineSeries({
                lineWidth: 1,
                color: style.value.buyColor,
                priceScale: {
                    autoScale: false,

                },
                priceFormat: {
                    type: 'price',
                    precision: product.price_digits,
                    minMove: Math.pow(0.1, product.price_digits).toFixed(product.price_digits) * 1,
                }
            })
            // 卖价线
            const sellLineSeries = chart.addLineSeries({
                lineWidth: 1,
                color: style.value.sellColor,
                priceFormat: {
                    type: 'price',
                    precision: product.price_digits,
                    minMove: Math.pow(0.1, product.price_digits).toFixed(product.price_digits) * 1,
                }
            })

            // 创建价格线
            const createPriceLine = ({ price, title, color }) => {
                return buyLineSeries.createPriceLine({
                    price,
                    title,
                    color,
                    lineWidth: '1px',
                    axisLabelVisible: true,
                })
            }
            // 止损线
            stopLossLine = createPriceLine({
                price: -999,
                title: 'SL',
                color: style.value.fallColor
            })
            // 止盈线
            takeProfitLine = createPriceLine({
                price: -999,
                title: 'TP',
                color: style.value.riseColor
            })

            const setNewPrice = () => {
                const curBuyPrice = { time: parseInt(product.tick_time / 1000), value: Number(product.buy_price) }
                const curSellPrice = { time: parseInt(product.tick_time / 1000), value: Number(product.sell_price) }
                buyPriceArrs.push(curBuyPrice)
                sellPriceArrs.push(curSellPrice)
                buyLineSeries.setData([...buyPriceArrs])
                sellLineSeries.setData([...sellPriceArrs])
            }

            console.log(buyLineSeries)
            if (product.tick_time) {
                setNewPrice()
            }
            watch(
                () => product.price,
                newval => {
                    setNewPrice()
                    // console.log(product.tick_time * 1, product.buy_price * 1)
                    // buyLineSeries.update({ time: parseInt(product.tick_time / 1000), value: Number(product.buy_price) })
                    // sellLineSeries.update({ time: parseInt(product.tick_time / 1000), value: Number(product.sell_price) })
                }
            )
        }

        // 更新止损线
        const stopLossLineUpdate = opts => {
            stopLossLine.applyOptions(opts)
        }
        // 更新止盈线
        const takeProfitLineUpdate = opts => {
            takeProfitLine.applyOptions(opts)
        }
        onMounted(() => {
            initChart()
        })
        return {
            chartEl,
            stopLossLineUpdate,
            takeProfitLineUpdate,
        }
    }
}
</script>

<style lang="scss" scoped></style>

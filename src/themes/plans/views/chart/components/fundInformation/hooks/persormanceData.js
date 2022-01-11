import { marketPerformance, marketPerformanceQuoteChange } from '@/api/trade'
import { localGet } from '@/utils/util'
import { createChart } from 'lightweight-charts'
import { computed } from 'vue'
import { useStore } from 'vuex'

// 基金表现
export const usePerformance = () => {
    const store = useStore()
    const product = computed(() => store.getters.productActived)

    // 市场价格 vs 基金净值的图表数据
    function mockData () {
        let size = 100
        let today = window.dayjs()
        const list = []
        while (size > 0) {
            const time = today.format('YYYY-MM-DD')
            list.unshift({
                time: time,
                value: randomNum(0, 200)
            })
            today = today.subtract(1, 'day')
            size--
        }
        return list
    }

    // 市场表现走势图
    const getMarketPerformanceData = () => {
        const { symbolId } = product.value
        return marketPerformance({ symbolId, days: 60 }).then(res => {
            if (res.check()) {
                const [data1, data2] = Object.entries(res.data)
                return [data1[1], data2[1]]
            }
            return []
        })
    }

    // 市场表现走势图
    const getMarketPerformanceQuoteChange = () => {
        const { symbolId } = product.value
        return marketPerformanceQuoteChange({ symbolId, days: 60 }).then(res => {
            if (res.check()) {
                const [data1, data2] = Object.entries(res.data)
                return [data1[1], data2[1]]
            }
            return []
        })
    }

    // 创建市场价格 vs 基金净值的图表
    const newChart = (dom, [data1, data2], options) => {
        // console.log(dom, data, options)
        if (!dom || !data1?.length) return false
        const digits = product.value.price_digits || product.value.symbolDigits

        const invertColor = localGet('invertColor')
        const chart = createChart(dom, {
            ...options,
            priceLineVisible: false,
            layout: {
                backgroundColor: invertColor === 'light' ? '#fff' : '#000',
                textColor: invertColor === 'light' ? '#444' : 'rgba(255, 255, 255, 0.9)',
            },
            rightPriceScale: {
                visible: false,
            },
            leftPriceScale: {
                visible: true,
            },
            handleScroll: { // 禁用图表上下滑动，让网页可以上下滑动
                vertTouchDrag: false, // 禁止垂直上下滑动
                pressedMouseMove: false,
                mouseWheel: false,
                // horzTouchDrag: false, // 禁止横向滑动
            },
            handleScale: { // 禁用图表上下缩放，让网页可以上下滑动
                axisPressedMouseMove: false,
            },
            timeScale: {
                tickMarkFormatter: (time) => { // 底部时间格式化
                    const date = new Date(time.year, time.month, time.day)
                    return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()
                },
                shiftVisibleRangeOnNewBar: false,
                fixLeftEdge: true,
                fixRightEdge: true,
            },
            grid: {
                vertLines: false,
            },

        })
        const seriesOptions = {
            lineWidth: 1,
            priceLineVisible: false, // 不显示最新价的线
            lastValueVisible: false, // 不显示最新价的值
            // color: style.value.buyColor,
            priceScale: {
                autoScale: false,
            },
            priceFormat: {
                type: 'price',
                precision: digits,
                minMove: Math.pow(0.1, digits).toFixed(digits) * 1,
            }
        }
        const lineSeries1 = chart.addLineSeries({
            ...seriesOptions,
            color: '#F1A21A'
        })
        lineSeries1.setData(data1)

        const lineSeries2 = chart.addLineSeries({
            ...seriesOptions,
            color: '#2B70AE'
        })
        lineSeries2.setData(data2)

        return chart
    }
    return {
        getMarketPerformanceData,
        getMarketPerformanceQuoteChange,
        newChart
    }
}

// 随机数
function randomNum (minNum, maxNum) {
    switch (arguments.length) {
    case 1:
        return parseInt(Math.random() * minNum + 1, 10)
        break
    case 2:
        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
        break
    default:
        return 0
        break
    }
}

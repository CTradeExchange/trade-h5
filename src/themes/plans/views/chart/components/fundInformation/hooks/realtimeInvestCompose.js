import * as echarts from 'echarts/core'
import { TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
import { PieChart, BarChart } from 'echarts/charts'
import { LabelLayout } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { assetPerformance, investCombination } from '@/api/trade'
import { localGet } from '@/utils/util'
import { useStore } from 'vuex'
import { computed } from 'vue'

echarts.use([
    TooltipComponent,
    LegendComponent,
    PieChart,
    CanvasRenderer,
    LabelLayout,
    GridComponent,
    BarChart,
])

export const useInvestCompose = (params) => {
    const store = useStore()
    const product = computed(() => store.getters.productActived)
    const getInvestCombination = () => {
        const { symbolId } = product.value
        return investCombination({ symbolId, statisticType: 1 }).then(res => {
            if (res.check()) {
                return res.data
            }
            return []
        })
    }

    // 获取单资产表现柱状图数据
    const getAssetPerformance = () => {
        const { symbolId } = product.value
        return assetPerformance({ symbolId }).then(res => {
            if (res.check()) {
                return res.data
            }
            return []
        })
    }

    // 绘制环形图
    const newPieDoughnutChart = (chartDom, chartData) => {
        const myChart = echarts.init(chartDom)
        const invertColor = localGet('invertColor')
        const option = {
            // backgroundColor: invertColor === 'light' ? '#fff' : '#000',
            color: ['#B72122', '#E9393A', '#FF762C', '#FF9E2C', '#FFC62C', '#F1DE3F', '#D2C02A', '#B6A622', '#9E9123', '#648319', '#198351', '#2AA46B', '#41CE8D', '#6BF1B3', '#56F5DD', '#82ECFF', '#82D7FF', '#7BBCF6', '#589EDC', '#2B70AE'],
            legend: {
                top: '5%',
                left: 'center',
                textStyle: {
                    color: '#888',
                }
            },
            series: [
                {
                    name: 'Access From',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    top: '10%',
                    // right: '40%',
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: false,
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: chartData
                }
            ]
        }

        option && myChart.setOption(option)
        return myChart
    }

    // 绘制柱状图
    const newBarChart = (chartDom, [xData, yData]) => {
        const myChart = echarts.init(chartDom)

        const option = {
            // backgroundColor: '#000',
            xAxis: {
                type: 'category',
                data: xData, // ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value'
            },
            grid: {
                show: false,
                top: '20',
                bottom: '20',
            },
            series: [
                {
                    itemStyle: {
                        color: '#2b70ae'
                    },
                    data: yData,
                    type: 'bar'
                }
            ]
        }

        option && myChart.setOption(option)
        return myChart
    }

    return {
        getInvestCombination,
        getAssetPerformance,
        newPieDoughnutChart,
        newBarChart,
    }
}

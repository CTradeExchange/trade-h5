import * as echarts from 'echarts/core'
import { TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
import { PieChart, BarChart } from 'echarts/charts'
import { LabelLayout } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
    TooltipComponent,
    LegendComponent,
    PieChart,
    CanvasRenderer,
    LabelLayout,
    GridComponent,
    BarChart,
])

// 绘制环形图
export const useChart_pieDoughnut = (chartDom) => {
    const myChart = echarts.init(chartDom)

    const option = {
        // backgroundColor: '#000',
        legend: {
            top: 'center',
            left: '60%',
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
                right: '40%',
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
                data: [
                    { value: 1048, name: 'Search Engine' },
                    { value: 735, name: 'Direct' },
                    { value: 580, name: 'Email' },
                    { value: 484, name: 'Union Ads' },
                    { value: 300, name: 'Video Ads' }
                ]
            }
        ]
    }

    option && myChart.setOption(option)
    return myChart
}

// 绘制柱状图
export const useChart_bar = (chartDom) => {
    const myChart = echarts.init(chartDom)

    const option = {
        // backgroundColor: '#000',
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
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
                data: [
                    {
                        value: -20,
                        itemStyle: {
                            color: '#a90000'
                        }
                    },
                    {
                        value: 200
                    },
                    150,
                    80,
                    70,
                    110,
                    130
                ],
                type: 'bar'
            }
        ]
    }

    option && myChart.setOption(option)
    return myChart
}

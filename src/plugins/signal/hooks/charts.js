import * as echarts from 'echarts/core'
import { TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
import { BarChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

echarts.use([TooltipComponent, LegendComponent, GridComponent, BarChart, CanvasRenderer])

export const indicatorActivity = () => {
    // 指标活跃度
    const store = useStore()
    const { t } = useI18n({ useScope: 'global' })
    const style = computed(() => store.state.style)

    let myChart

    const initChart = (chartDom, [xData, yData], extraProps = {}) => {
        if (!chartDom) return false
        if (!myChart) {
            myChart = echarts.init(chartDom)
            myChart.on('click', function (params) {
                extraProps.handleItem && extraProps.handleItem(params.name)
            })
        }
        const option = {
            // 柱状图颜色
            color: [style.value.primary],
            xAxis: {
                type: 'category',
                data: xData,
                axisTick: {
                    alignWithLabel: true
                },
                axisLabel: {
                    textStyle: {
                        // x轴文案
                        color: style.value.minorColor,
                        fontSize: 12,
                    }
                },
                splitLine: {
                    lineStyle: {
                        // x分割线颜色
                        color: [style.value.lineColor]
                    }
                },
                axisLine: {
                    lineStyle: {
                        // x坐标轴颜色
                        color: [style.value.lineColor]
                    }
                },
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    fontSize: 12,
                    textStyle: {
                        color: style.value.minorColor,
                    },
                    formatter: (value) => {
                        return value
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: [style.value.lineColor]
                    }
                },
            },
            grid: {
                x: 40,
                y: 20,
                x2: 0,
                y2: 55,
            },
            legend: {
                selectedMode: false,
                verticalAlign: 'bottom',
                bottom: 0,
                // 图例高度
                itemHeight: 12,
                // 图例样式
                textStyle: {
                    color: style.value.minorColor,
                    fontSize: 12,
                },
            },
            series: [
                {
                    data: yData,
                    type: 'bar',
                    barWidth: '50%',
                    name: t('signal.signalTime'),
                    label: {
                        show: true,
                        position: 'top',
                        color: style.value.color,
                        fontSize: 14,
                        formatter: (item) => {
                            return item.value
                        }
                    }
                }
            ]
        }
        myChart.setOption(option)
        return myChart
    }
    return {
        initChart
    }
}

<template>
    <div class='chart-card'>
        <div id='chart' class='chart-box'></div>
    </div>
</template>

<script>
import { isEmpty, fixedNumber } from '@/utils/util'
import * as echarts from 'echarts'
import { reactive, watch, toRefs, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
export default {
    props: {
        list: {
            type: Array,
            default: () => {
                return []
            }
        }

    },
    setup (props) {
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            isEmpty,
            myChart: null
        })
        onMounted(() => {
            state.myChart = echarts.init(document.getElementById('chart'))
        })
        const initEcharts = ({ XData, YData, unitData }) => {
            // 配置图表
            const option = {
                title: {},
                tooltip: {},
                legend: {
                    bottom: 20,
                },
                xAxis: [
                    {
                        axisLabel: {
                            interval: 0,
                            textStyle: {
                                fontSize: 12
                            }
                        },
                        data: XData.reverse()
                    }
                ],
                yAxis: {
                    axisLabel: {
                        interval: 0,
                        textStyle: {
                            fontSize: 12
                        },
                        formatter: (val, index) => {
                            let Scale = ''; let Unit = ''
                            if (index + 1 > unitData.length) {
                                Scale = unitData[unitData.length - 1]?.Scale
                                Unit = unitData[unitData.length - 1]?.Unit
                            } else {
                                Scale = unitData[index]?.Scale
                                Unit = unitData[index]?.Unit
                            }
                            return fixedNumber(val, Scale, Unit, '0')
                        }
                    }
                },
                series: [
                    {
                        name: t('news.actual'),
                        type: 'bar',
                        data: YData.reverse(),
                        barWidth: '20%',
                        itemStyle: {}
                    }
                ]
            }
            state.myChart.setOption(option)
        }
        watch(
            () => [props.list, state.myChart],
            (newVal) => {
                const [newList, newChart] = newVal
                if (!newChart || isEmpty(newList)) return
                const XData = newList.map((item, i) => {
                    const { PublishTime } = item || {}
                    const obj = dayjs(PublishTime * 1000).format('DD MMM')
                    return obj
                })
                const YData = newList.map((item, i) => {
                    const { Description } = item || {}
                    const descObj = Description && JSON.parse(Description)
                    const { Actual } = descObj || {}
                    return Actual?.replace('%', '')
                })
                const unitData = newList.map((item, i) => {
                    const { Description } = item || {}
                    const descObj = Description && JSON.parse(Description)
                    const { Scale, Unit, Actual } = descObj || {}
                    if (Actual?.indexOf('%') > -1) {
                        return { Scale, Unit: '%' }
                    }
                    return { Scale, Unit }
                })
                initEcharts({ XData, YData, unitData })
            },
            {
                immediate: true
            })

        onBeforeUnmount(() => {
            state.myChart && state.myChart.dispose()
        })

        return {
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
.chart-card {
    position: relative;

    .chart-box {
        width: 100%;
        min-height: 340px;
    }
}
</style>

<template>
    <div class='tv'>
        <slot :resolutionList='resolutionList' :setResolution='setResolution' :setSymbol='setSymbol'></slot>
        <div id='tv_chart_container' ref='container'></div>
    </div>
</template>

<script>
import { UDFCompatibleDatafeed } from './datafeeds/udf/lib/udf-compatible-datafeed'
import { WidgetConfig } from './widget.config'
import { resolutionToKlineType, resolutionToText } from '@/components/tradingview/datafeeds/udf/lib/constant.js'

export default {
    props: {
        initialValue: {
            type: Object,
            default: null
        }
    },
    data () {
        return {
            containerHeight: 0,
            studies: [
                ['MACD', false, false, [14, 30, 'close', 9]],
                ['Moving Average Exponential', false, false, [26]]
            ]
        }
    },
    mounted () {
        console.log('tv mounted')
        this.containerHeight = this.$refs.container.offsetHeight
        console.log(this.containerHeight)
        this.init()
    },

    setup () {
        // 周期列表
        const resolutionList = Object.keys(resolutionToKlineType).map(value => ({
            text: resolutionToText[value],
            value
        }))
        return {
            resolutionList
        }
    },
    methods: {
        init () {
            if (!this.containerHeight || !this.initialValue) {
                return
            }

            this.datafeed = new UDFCompatibleDatafeed('', {
                isControl: true,
                symbolInfo: {
                    ...this.initialValue
                }
            })

            // eslint-disable-next-line new-cap
            this.widget = window.tvWidget = new window.TradingView.widget({
                ...WidgetConfig(),
                datafeed: this.datafeed,
                container_id: 'tv_chart_container',
                symbol: this.initialValue.value,
                interval: '1',
                library_path: '/charting_library/',
                locale: 'zh',
            })

            this.widget.onChartReady(() => {
                this.createStudies()
                console.log(`%c初始产品: ${JSON.stringify(this.initialValue)}`, 'color:green')
            })
        },

        // 切换产品
        setSymbol (info) {
            const symbolId = info.value
            // 修改产品属性
            this.datafeed.setSymbolInfo(info)
            // 修改图表产品
            this.widget.activeChart()
                .setSymbol(symbolId + '', () => {
                    console.log(`%c切换产品: ${JSON.stringify(info)}`, 'color:green')
                    this.$emit('symbolChanged', symbolId)
                })
            // 修改现有指标价格价格精度
            this.setPrecisionForStudies(info.price_digits)
        },
        // 切换周期
        setResolution (val) {
            console.log('setResolution:', val)
            this.widget.activeChart()
                .setResolution(val, () => {
                    console.log(`%c切换周期: ${val}`, 'color:green')
                })
        },
        // 修改现有指标价格精度
        setPrecisionForStudies (precision) {
            const chart = this.widget.activeChart()
            chart.getAllStudies().forEach(e => {
                chart.getStudyById(e.id)
                    .applyOverrides({
                        precision
                    })
            })
        },
        // 批量创建指标
        createStudies () {
            this.studies.forEach(e => {
                this.widget.activeChart().createStudy(...e)
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.tv {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    #tv_chart_container {
        flex: 1;
    }
}
</style>

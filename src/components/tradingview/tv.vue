<template>
    <div class='tv'>
        <slot :resolutionList='resolutionList' :setResolution='setResolution' :setSymbol='setSymbol'></slot>
        {{ product.buy_price }}-{{ product.sell_price }}
        <div id='tv_chart_container' ref='container'></div>
    </div>
</template>

<script>
import { UDFCompatibleDatafeed } from './datafeeds/udf/lib/udf-compatible-datafeed'
import { WidgetConfig } from './widget.config'
import { resolutionToKlineType, resolutionToText } from '@/components/tradingview/datafeeds/udf/lib/constant.js'
import { localSet, localGet, isEmpty } from '@/utils/util'
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
            ],
            symbolId: '',
            linesMap: {}, // 存放是否已绘制买卖价线
            buyPriceLinEntity: {},
            sellPriceLinEntity: {}
        }
    },
    computed: {
        product () {
            return this.$store.state._quote.productMap[this.symbolId || this.initialValue.value]
        }
    },
    watch: {
        product: {
            handler (newVal, oldVal) {
                this.updateLineData(newVal)
            },
            deep: true

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
                // debug: true,
                library_path: '/charting_library/',
                locale: 'zh'

            })

            this.widget.onChartReady(() => {
                this.linesMap[this.initialValue.value] = {}
                this.createStudies()
                // 根据用户设置的类型显示图表
                this.setChartType()
                console.log(`%c初始产品: ${JSON.stringify(this.initialValue)}datafeed:${JSON.stringify(this.datafeed)}`, 'color:green')
            })
        },

        // 切换产品
        setSymbol (info) {
            this.symbolId = info.value

            if (isEmpty(this.linesMap[this.symbolId])) this.linesMap[this.symbolId] = {}
            // 修改产品属性
            this.datafeed.setSymbolInfo(info)
            // 修改图表产品
            this.widget.activeChart()
                .setSymbol(this.symbolId + '', () => {
                    console.log(`%c切换产品: ${JSON.stringify(info)}`, 'color:green')
                    this.$emit('symbolChanged', this.symbolId)
                })
            // 修改现有指标价格价格精度
            this.setPrecisionForStudies(info.price_digits)
            this.setChartType()
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
        },
        updateLineData (val) {
            console.log('更新价格线')

            if (!isEmpty(this.buyPriceLinEntity)) {
                this.buyPriceLinEntity.setPrice(val.buy_price)
            }
            if (!isEmpty(this.sellPriceLinEntity)) {
                this.sellPriceLinEntity.setPrice(val.sell_price)
            }
        },
        setChartType () {
            const chartConfig = JSON.parse(localGet('chartConfig'))
            const symbolId = this.product.symbolId
            if (!isEmpty(chartConfig)) {
                // 0:Bar 1:Candle 2:Line 3:Area ,8:Heikin-Ashi ,9: Hollow Candle 10: Baseline 12 10Hi-Lo
                this.widget.activeChart().setChartType(chartConfig.chartType)
                if (chartConfig.buyPriceLine && !this.linesMap[symbolId].buyPriceLine) {
                    this.buyPriceLinEntity = this.widget.activeChart().createOrderLine()
                        .setPrice(this.product.buy_price)
                        .setText('')
                        .setLineStyle(0)
                        .setLineColor('#e3525c')
                        .setQuantity(false)
                    this.linesMap[symbolId].buyPriceLine = true
                }

                if (chartConfig.sellPriceLine && !this.linesMap[symbolId].sellPriceLine) {
                    this.sellPriceLinEntity = this.widget.activeChart().createOrderLine()
                        .setPrice(this.product.sell_price)
                        .setText('')
                        .setLineStyle(0)
                        .setLineColor('#10b873')
                        .setQuantity(false)
                    this.linesMap[symbolId].sellPriceLine = true
                }
            }
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

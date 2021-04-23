<template>
    <div class='tv'>
        <slot :filterProductList='filterProductList' :resolutionList='resolutionList' :setResolution='setResolution' :setSymbol='setSymbol'></slot>
        <div id='tv_chart_container' ref='container'></div>
    </div>
</template>

<script>
import { UDFCompatibleDatafeed } from './datafeeds/udf/lib/udf-compatible-datafeed'
import { WidgetConfig } from './widget.config'
import { resolutionToKlineType, resolutionToText } from '@/components/tradingview/datafeeds/udf/lib/constant.js'
import { mapState } from 'vuex'

export default {
    data () {
        return {
            containerHeight: 0,
            symbolId: localStorage.getItem('symbolIdForChart')
        }
    },
    computed: {
        ...mapState({
            productList: state => state._quote.productList
        }),
        // 周期列表
        resolutionList () {
            return Object.keys(resolutionToKlineType).map(value => ({
                text: resolutionToText[value],
                value
            }))
        },
        // 产品列表
        filterProductList () {
            return this.productList
                // .filter(e => e.symbolName)
                .slice(0, 10)
                .map(e => ({
                    text: e.symbolName || e.symbolId,
                    value: e.symbolId
                }))
        }
    },
    mounted () {
        console.log('tv mounted')
        this.containerHeight = this.$refs.container.offsetHeight
        console.log(this.containerHeight)
        this.init()
    },
    methods: {
        init () {
            if (!this.containerHeight) {
                return
            }

            this.datafeed = new UDFCompatibleDatafeed('', {
                isControl: true
            })
            console.log(this.datafeed)

            // eslint-disable-next-line new-cap
            this.widget = window.tvWidget = new window.TradingView.widget({
                ...WidgetConfig(),
                datafeed: this.datafeed,
                container_id: 'tv_chart_container',
                symbol: this.symbolId || this.filterProductList[0].value,
                interval: '1',
                library_path: '/charting_library/',
                locale: 'zh',
            })

            this.widget.onChartReady(() => {
                this.widget.activeChart().createStudy('MACD', false, false, [14, 30, 'close', 9])
                this.widget.activeChart().createStudy('Moving Average Exponential', false, false, [26])
            })
        },
        // 切换产品
        setSymbol (symbolId) {
            localStorage.setItem('symbolIdForChart', symbolId)
            this.widget.activeChart()
                .setSymbol(symbolId + '', () => {
                    console.log(`%c切换产品: ${symbolId}`, 'color:green')
                })
        },
        // 切换周期
        setResolution (val) {
            console.log('setResolution:', val)
            this.widget.activeChart()
                .setResolution(val, () => {
                    console.log(`%c切换周期: ${val}`, 'color:green')
                })
        },
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

<template>
    <div id='tv_chart_container'>
    </div>
</template>

<script>
import { UDFCompatibleDatafeed } from './datafeeds/udf/lib/udf-compatible-datafeed'
import { WidgetConfig } from './widget.config'
export default {
    props: {
        height: {
            type: Number,
            default: 0
        },
        width: {
            type: Number,
            default: 0
        },
    },
    mounted () {
        console.log('tv mounted')
        this.init()
    },
    methods: {
        init () {
            const symbolId = 2
            if (!this.height || !symbolId) return

            this.widget = window.tvWidget = new window.TradingView.widget({
                ...WidgetConfig(),
                datafeed: new UDFCompatibleDatafeed('', {
                    isControl: true
                }),
                container_id: 'tv_chart_container',
                height: this.height,
                width: this.width,
                symbol: symbolId,
                interval: '1',
                library_path: '/charting_library/',
                locale: 'zh',
            })
        }
    }
}
</script>

<style lang="scss" scoped>

</style>

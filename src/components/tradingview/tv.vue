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
            if (!this.height) return
            this.widget = window.tvWidget = new window.TradingView.widget({
                ...WidgetConfig(),
                // debug: true, // uncomment this line to see Library errors and warnings in the console
                height: this.height,
                width: this.width,
                symbol: 'AAPL',
                interval: '1D',
                container_id: 'tv_chart_container',

                //	BEWARE: no trailing slash is expected in feed URL
                datafeed: new UDFCompatibleDatafeed('https://demo-feed-data.tradingview.com'),
                library_path: 'charting_library/',
                locale: 'zh',

                // disabled_features: ['use_localstorage_for_settings'],
                // enabled_features: ['study_templates'],
                charts_storage_url: 'https://saveload.tradingview.com',
                charts_storage_api_version: '1.1',
                client_id: 'tradingview.com',
                user_id: 'public_user_id'
            })
        }
    }
}
</script>

<style lang="scss" scoped>

</style>

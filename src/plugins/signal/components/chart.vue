<template>
    <div class='chart'>
        <p id='chart-title' class='title'>
            <span>{{ product.symbolName || '' }} {{ period }}</span>
            <setting v-if='isPC' :show-more='false' />
        </p>
        <div class='block'>
            <template v-if='symbolBaseLoaded'>
                <tv
                    v-if='initialValue'
                    ref='chartRef'
                    :initial-value='initialValue'
                    :options='initConfig'
                    @indicatorRemoved='indicatorRemoved'
                    @onChartReady='onChartReady'
                />
                <p v-else class='none-tip'>
                    {{ $t('signal.detail.noOfferTip') }}
                </p>
            </template>
        </div>
    </div>
</template>

<script>
import { ref, unref, reactive, toRefs, computed, watch, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { localGet, getCookie } from '@/utils/util'
import { MAINSTUDIES, SUBSTUDIES, VolumeStudy } from '@/components/tradingview/datafeeds/userConfig/config'
import { chartLocaleJSON } from '@/locale.js'
import tv from '@/components/tradingview/tv'
import setting from '@planspc/components/setting'

export default {
    components: {
        tv,
        setting
    },
    props: {
        // 产品信息
        product: {
            type: Object,
            default: () => {}
        },
        // 信号信息
        signal: {
            type: Object,
            default: () => {}
        }
    },
    setup (props) {
        const store = useStore()
        const route = useRoute()
        const { t } = useI18n()
        // ref
        const chartRef = ref(null)
        // computed
        const period = computed(() => {
            return store.getters['_signal/getPeriodName'](props.signal.pe)
        })
        // state
        const state = reactive({
            // 产品列表是否加载完成
            symbolBaseLoaded: false,
            // 图表配置
            initConfig: {},
            // 图表是否创建完成
            chartReadyFlag: false,
            // 时间周期
            candleKTypeList: [
                // {
                //     title: t('chart.1min'),
                //     value: '1m',
                //     ktype: '1',
                //     time: 60
                // },
                {
                    title: t('chart.5min'),
                    value: '5m',
                    ktype: '5',
                    time: 5 * 60
                },
                {
                    title: t('chart.15min'),
                    value: '15m',
                    ktype: '15',
                    time: 15 * 60
                },
                {
                    title: t('chart.30min'),
                    value: '30m',
                    ktype: '30',
                    time: 30 * 60
                },
                {
                    title: t('chart.1hour'),
                    value: '1h',
                    ktype: '60',
                    time: 60 * 60
                },
                {
                    title: t('chart.4hour'),
                    value: '4h',
                    ktype: '240',
                    time: 60 * 60 * 4
                },
                {
                    title: t('chart.day'),
                    value: '1d',
                    ktype: '1D',
                    time: 24 * 60 * 60
                },
                {
                    title: t('chart.week'),
                    value: '1W',
                    ktype: '1W',
                    time: 24 * 60 * 60 * 7
                }, {
                    title: t('chart.month'),
                    value: '1M',
                    ktype: '1M',
                    time: 24 * 60 * 60 * 30
                }
            ]
        })
        // 当前主题
        const theme = computed(() => store.state.theme)
        // 样式
        const style = computed(() => store.state.style)
        // 当前选择的周期类型
        const candleKTypeItem = computed(() => {
            const result = state.candleKTypeList.find(el => el.value === props.signal.pe)
            return result
        })
        // 文案
        const actionName = computed(() => store.getters['_signal/getActionName'](props.signal.a))
        // 图表初始值
        const initialValue = computed(() => {
            const resolution = JSON.parse(localGet('CHART_CONFIG'))?.resolution || 1
            const product = props.product
            if (product.symbolName) {
                return {
                    text: product.symbolName, // 用于vant组件显示
                    description: product.symbolCode, // 显示在图表左上角
                    symbolId: product.symbolId, // 产品id
                    digits: product.symbolDigits, // 小数点
                    dealMode: product.dealMode, // 成交模式
                    tradeType: product.tradeType, // 玩法
                    interval: resolution, // 周期
                    marks: getMarks()
                }
            } else {
                return null
            }
        })

        // 初始化图表配置
        const initChartData = () => {
            const themeValue = theme.value
            const lang = route.query.lang || getCookie('lang')
            const locale = chartLocaleJSON[lang] || chartLocaleJSON['en-US']

            state.initConfig = ref({
                property: {
                    showLastPrice: true, // 现价线
                    showPositionPrice: false, // 持仓线
                    showBuyPrice: false, // 买价线
                    showSellPrice: false, // 卖价线
                    showSeriesOHLC: true, // 高开低收
                    showBarChange: true, // 涨跌幅
                    chartType: 2, // 图表类型
                    showSeriesTitle: false // K线标题
                },
                indicators: createStudy(),
                extension: {
                    theme: themeValue === 'light' ? 'Light' : 'Dark', // 主题 "Light" | "Dark"
                    fullScreen: false, // 全屏功能（右上角缩放按钮、横屏监听等）,
                    orientation: 'portrait',
                    locale
                }
            })
        }

        // 创建指标
        const createStudy = () => {
            const list = JSON.parse(JSON.stringify([...MAINSTUDIES, ...SUBSTUDIES]))
            const target = list.find(item => item.label === props.signal.i && item.label !== 'MA')
            return target ? [target] : []
        }

        // 获取marks数据
        const getMarks = () => {
            const label = props.signal.a === 'buy' ? t('trade.buyShort') : t('trade.sellShort')
            const color = props.signal.a === 'buy' ? style.value.riseColor : style.value.fallColor
            // 获取上一个周期时间，返回秒数
            const timeGap = candleKTypeItem.value.time
            const a = window.dayjs(props.signal.t).unix()
            const formatTime = (Math.floor(a / timeGap) * timeGap)
            const lastTime = formatTime - timeGap
            // 设置marks数据
            return [{
                text: `
                    <p style="margin-bottom: 10px;font-size:14px;font-weight:600">
                        <span>${t('signal.detail.detail')}</span>
                    </p>
                    <p style="margin-bottom: 6px;">
                        <span>${t('signal.detail.indicatorName')}:</span>
                        <span>${props.signal.i}</span>
                    </p>
                    <p style="margin-bottom: 6px;">
                        <span>${t('signal.timePeriod')}:</span>
                        <span>${period.value}</span>
                    </p>
                    <p style="margin-bottom: 6px;">
                        <span>${t('signal.detail.product')}:</span>
                        <span>${props.product.symbolName}</span>
                    </p>
                    <p>
                        <span>${t('signal.tradeRecommend')}:</span>
                        <span style="color:${color}">${actionName.value}</span>
                    </p>
                `,
                id: props.product.symbolId,
                time: lastTime,
                color: {
                    background: color,
                    border: color
                },
                label,
                labelFontColor: '#ffffff',
                minSize: 20
            }]
        }

        // 图表创建完成回调
        const onChartReady = () => {
            state.chartReadyFlag = true
            if (candleKTypeItem.value) {
                chartRef.value.setResolution(candleKTypeItem.value.ktype)
            }
        }

        // 指示移除回调
        const indicatorRemoved = () => {

        }

        // 监听主题修改回调
        const changeTheme = (val) => {
            const theme = val.detail === 'light' ? 'Light' : 'Dark'
            chartRef.value.changeTheme(theme)
        }

        // 监听图表颜色修改
        const changeChartColor = () => {
            chartRef.value && chartRef.value.reset({
                initialValue: initialValue.value,
                options: state.initConfig
            })
        }

        // 监听信息信息
        watch(() => props.signal, () => {
            // 初始化图表配置
            initChartData()
        })

        // 实时更新买卖价线
        watch(() => [props.product?.cur_price, props.product?.tick_time], () => {
            state.chartReadyFlag && unref(chartRef).setTick(props.product.cur_price, props.product.tick_time, props.product.volume, props.product.symbolId)
        })

        onMounted(() => {
            setTimeout(() => {
                state.symbolBaseLoaded = true
            }, 1000)
            // 监听主题修改
            document.body.addEventListener('Launch_theme', changeTheme, false)
            // 监听设置图表颜色
            document.body.addEventListener('Launch_chartColor', changeChartColor, false)
        })

        onUnmounted(() => {
            // 移除监听事件
            document.body.removeEventListener('Launch_theme', changeTheme, false)
            document.body.removeEventListener('Launch_chartColor', changeChartColor, false)
        })

        return {
            ...toRefs(state),
            isPC: window.isPC,
            period,
            chartRef,
            initialValue,
            onChartReady,
            indicatorRemoved
        }
    }
}
</script>

<style lang="scss" scoped>
.chart {
    display: flex;
    flex-direction: column;
    height: 100%;
    .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: rem(80px);
        padding: 0 rem(24px);
        font-size: rem(32px);
        color: var(--color);
    }
    .block {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        .none-tip {
            font-size: rem(32px);
            color: var(--color);
        }
    }
}
</style>

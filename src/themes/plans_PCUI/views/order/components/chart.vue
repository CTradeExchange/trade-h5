<template>
    <div class='content'>
        <div class='symbol-info'>
            <div class='item symbol-name'>
                <p class='name'>
                    {{ product.symbolName }}
                </p>
                <p class='code'>
                    {{ product.symbolCode }}
                </p>
            </div>

            <div class='item range'>
                <p :class='product.cur_color'>
                    {{ parseFloat(product.cur_price).toFixed(product.price_digits) }}
                </p>
                <p>
                    <span> {{ product.upDownAmount }}   </span>
                    <span :class='product.upDownColor'>
                        {{ product.upDownWidth }}
                    </span>
                </p>
            </div>
            <div class='item'>
                <p>开 23162.5</p>
                <p>收 23162.5</p>
            </div>

            <div class='item'>
                <p>高 23162.5</p>
                <p>低 23162.5</p>
            </div>

            <div class='item collect'>
                <i class='icon_zixuan1'></i>
            </div>
        </div>
        <div class='tv-head'>
            <div class='tabs-wrap'>
                <van-tabs
                    v-model:active='activeTab'
                    :before-change='onBeforeChange'
                    class='tabs'
                    :color='$style.primary'
                    line-height='2'
                    line-width='20'
                    title-active-color='$style.primary'
                >
                    <van-tab
                        v-for='(item) in candleKTypeList'
                        :key='item.ktype'
                        :name='item.ktype'
                        :title='item.title'
                    />
                </van-tabs>

                <div class='flex-right'>
                    <van-dropdown-menu class='kIcon-wrap'>
                        <van-dropdown-item ref='klineTypeDropdown' v-model='klineType'>
                            <template #title>
                                <KIcon class='kIcon' :value='klineTypeIndex' />
                            </template>
                            <van-cell
                                v-for='(item, i) in klineTypeList'
                                :key='item.name'
                                :class="{ 'mainColor':klineType === item.value }"
                                is-link
                                @click='setChartType(item.value)'
                            >
                                <template #title>
                                    <span class='custom-title'>
                                        <KIcon class='kIcon' :value='i+1' />
                                        {{ item['title_zh'] }}
                                    </span>
                                </template>
                                <template #right-icon>
                                    <van-icon v-if='klineType===item.value' class='klineTypeRightIcon' name='success' />
                                </template>
                            </van-cell>
                        </van-dropdown-item>
                    </van-dropdown-menu>
                    <div class='setting' @click='settingStatus = !settingStatus'>
                        <van-icon class='icon' name='setting-o' />

                        <div v-show='settingStatus' class='content van-hairline--surround' @click.stop=''>
                            <van-checkbox-group ref='checkboxGroup' v-model='settingList' @change='handleLineChange'>
                                <van-checkbox
                                    v-for='item in computedLineList'
                                    :key='item.value'

                                    class='item'
                                    icon-size='16px'
                                    :name='item.value'
                                >
                                    {{ item.title }}
                                </van-checkbox>
                            </van-checkbox-group>
                        </div>
                        <div
                            v-show='settingStatus'
                            class='mask'
                            @click.stop='settingStatus = false'
                            @touchmove.stop='settingStatus = false'
                        >
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-show='studyVis' ref='mainStudyArea' class='study-area'>
            <div class='main-study'>
                <div class='content'>
                    <div
                        v-for='(item, i) in mainStudyList'
                        :key='i'
                        class='item'
                        :class='{ active: mainStudy === item.name }'
                        :color='$style.primary'
                    >
                        <span
                            class='inner-label'
                            @click='onClickStudy("main", item.name)'
                        >
                            {{ item.label }}
                        </span>
                    </div>
                    <span class='item more' @click='showStudyDialog = true'>
                        <span class='inner-label'>
                            {{ $t('chart.more') }}
                        </span>
                    </span>
                </div>
            </div>
        </div>
        <div class='chart-content'>
            <tv
                v-if='initialValue'
                ref='chartRef'
                :initial-value='initialValue'
                :options='initConfig'
                @indicatorRemoved='indicatorRemoved'
                @onChartReady='onChartReady'
                @orientationChanged='orientationChanged'
            />
        </div>
        <div v-show='studyVis' ref='mainStudyArea' class='study-area'>
            <div class='main-study'>
                <div class='content'>
                    <div
                        v-for='(item, i) in sideStudyList'
                        :key='i'
                        class='item'
                        :class='{ active: subStudy === item.name }'
                    >
                        <span
                            class='inner-label'
                            @click='onClickStudy("sub", item.name)'
                        >
                            {{ item.label }}
                        </span>
                    </div>
                    <span class='item more' @click='showStudyDialog = true'>
                        <span class='inner-label'>
                            {{ $t('chart.more') }}
                        </span>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { reactive, toRefs, computed, unref, ref, watch, onMounted, onUnmounted } from 'vue'
import tv from '@/components/tradingview/tv'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { QuoteSocket } from '@/plugins/socket/socket'
import { isEmpty, localSet, localGet } from '@/utils/util'
import { MAINSTUDIES, SUBSTUDIES } from '@/components/tradingview/datafeeds/userConfig/config'
export default {
    components: { tv },
    setup () {
        const route = useRoute()
        const { t } = useI18n({ useScope: 'global' })
        const store = useStore()
        const { tradeType, symbolId } = route.query
        const candleKTypeList = [
            // {
            //     title: t('chart.timeSharing'),
            //     value: '1min',
            //     ktype: 'timeSharing',
            // },
            {
                title: t('chart.1min'),
                value: '1min',
                ktype: '1',
            },
            {
                title: t('chart.5min'),
                value: '5min',
                ktype: '5',
            }, {
                title: t('chart.15min'),
                value: '15min',
                ktype: '15',
            }, {
                title: t('chart.30min'),
                value: '30min',
                ktype: '30',
            }, {
                title: t('chart.1hour'),
                value: '1hour',
                ktype: '60',
            },
            {
                title: t('chart.2hour'),
                value: '2hour',
                ktype: '120',
            }, {
                title: t('chart.4hour'),
                value: '4hour',
                ktype: '240',
            },
            {
                title: t('chart.day'),
                value: 'day',
                ktype: '1D',
            },
            {
                title: t('chart.week'),
                value: 'week',
                ktype: '1W',
            }, {
                title: t('chart.month'),
                value: 'month',
                ktype: '1M',
            }
        ]

        const klineTypeList = [{
            name: 'kIcon1',
            title_zh: t('chart.bars'),
            title_en: 'Bars',
            value: 0,
        }, {
            name: 'kIcon2',
            title_zh: t('chart.candles'),
            title_en: 'Candles',
            value: 1,
        }, {
            name: 'kIcon3',
            title_zh: t('chart.hollowCandles'),
            title_en: 'Hollow Candles',
            value: 9,
        }, {
            name: 'kIcon4',
            title_zh: t('chart.heikinAshi'),
            title_en: 'Heikin Ashi',
            value: 8,
        }, {
            name: 'kIcon5',
            title_zh: t('chart.line'),
            title_en: 'Line',
            value: 2,
        }, {
            name: 'kIcon6',
            title_zh: t('chart.area'),
            title_en: 'Area',
            value: 3,
        }, {
            name: 'kIcon7',
            title_zh: t('chart.baseLine'),
            title_en: 'Baseline',
            value: 10,
        }]

        // 图表组件引用
        const chartRef = ref(null)
        const klineTypeDropdown = ref(null)

        const state = reactive({
            activeName: 'first',
            studyVis: true,
            mainStudyList: MAINSTUDIES.slice(0, 5), // 主图
            sideStudyList: SUBSTUDIES.slice(0, 5), // 副图
            mainStudy: 'Moving Average mock',
            subStudy: 'Custom MACD',
            activeTab: 0,
            settingStatus: false,
            settingList: [],
            initConfig: {},
            onChartReadyFlag: false,

        })

        // 图表类型
        const klineTypeIndex = computed(() => {
            const curIndex = klineTypeList.findIndex(el => el.value === state.klineType)
            return curIndex + 1
        })

        // 图表初始值
        const initialValue = computed(() => {
            if (product.value.symbolName) {
                return {
                    text: product.value.symbolName, // 用于vant组件显示
                    description: product.value.symbolCode, // 显示在图表左上角
                    symbolId: product.value.symbolId, // 产品id
                    digits: product.value.symbolDigits, // 小数点
                    dealMode: product.value.dealMode, // 成交模式
                    tradeType: tradeType, // 玩法
                    interval: locChartConfig?.resolution // 周期
                }
            }
            return null
        })

        // 实时更新买卖价线
        watch(() => [product.value.buy_price, product.value.sell_price, product.value.cur_price, product.value.tick_time], (newValues) => {
            if (Number(product.value.tradeType) !== 5 && Number(product.value.tradeType) !== 9) {
                state.onChartReadyFlag && unref(chartRef).setTick(product.value.cur_price, product.value.tick_time)

                state.onChartReadyFlag && unref(chartRef).updateLineData({
                    buyPrice: product.value.buy_price,
                    sellPrice: product.value.sell_price
                })
            }
        })

        const orientationChanged = () => {

        }

        // 颜色值
        const style = computed(() => store.state.style)

        // 产品信息
        const product = computed(() => {
            const product = store.getters.productActived
            if (product?.cur_price) {
                // 有产品数据就渲染图表
                renderChart(product, state.initConfig.property)
            }
            renderChart(product, state.initConfig.property)
            return product
        })

        const handleClick = () => {

        }

        // 选择指标
        const onClickStudy = (type, name) => {
            const obj = {
                main: 'mainStudy',
                sub: 'subStudy'
            }
            const oldStudyName = state[obj[type]]

            if (oldStudyName === name) {
                removeStudy(type)
            } else {
                removeStudy(type)
                createStudy(type, name)
            }
        }

        // 增加指标
        const createStudy = (type, name) => {
            const target = JSON.parse(JSON.stringify([...MAINSTUDIES, ...SUBSTUDIES].find(item => item.name === name) || null))
            switch (type) {
                case 'main': {
                    state.mainStudy = target?.name
                    localSetChartConfig('mainStudy', JSON.stringify({
                        name: target?.name,
                        params: target?.params
                    }))
                    break
                }
                case 'sub': {
                    state.subStudy = target?.name
                    localSetChartConfig('subStudy', JSON.stringify({
                        name: target?.name,
                        params: target?.params
                    }))
                    break
                }
            }

            const property = [
                JSON.parse(JSON.parse(localGet('chartConfig')).mainStudy),
                JSON.parse(JSON.parse(localGet('chartConfig')).subStudy)
            ]

            state.onChartReadyFlag && unref(chartRef).updateIndicator(property)
        }

        // 删除指标
        const removeStudy = (type) => {
            switch (type) {
                case 'main': {
                    state.mainStudy = ''
                    localSetChartConfig('mainStudy', null)
                    break
                }
                case 'sub': {
                    state.subStudy = ''
                    localSetChartConfig('subStudy', null)
                    break
                }
            }

            const property = [
                JSON.parse(JSON.parse(localGet('chartConfig')).mainStudy),
                JSON.parse(JSON.parse(localGet('chartConfig')).subStudy)
            ]
            state.onChartReadyFlag && unref(chartRef).updateIndicator(property)
        }

        // 缓存图表设置
        const localSetChartConfig = (key, value) => {
            const chartConfig = JSON.parse(localGet('chartConfig'))
            if (!isEmpty(chartConfig)) {
                chartConfig[key] = value
                localSet('chartConfig', JSON.stringify(chartConfig))
            } else {
                localSet('chartConfig', JSON.stringify({
                    [key]: value
                }))
            }
        }

        // 设置图表周期
        const onBeforeChange = (name, title) => {
            if (name === 'timeSharing') {
                state.studyVis = false
            } else {
                state.studyVis = true
            }
            state.onChartReadyFlag && unref(chartRef).setResolution(name)
            localSetChartConfig('resolution', name)
            return true
        }

        // 重新渲染图表
        const renderChart = (product, property) => {
            state.onChartReadyFlag && unref(chartRef).updateProperty(property)
            state.onChartReadyFlag && unref(chartRef).updateLineData({
                buyPrice: 444.14, // product.buy_price,
                sellPrice: 445.11 // product.sell_price
            })

            state.onChartReadyFlag && unref(chartRef).setChartType(Number(property.chartType))
            // setPositionLine()
        }

        // 指标移除回调
        const indicatorRemoved = (name, val) => {
            if (name === state.subStudy) {
                removeStudy('sub')
            }
            if (name === state.mainStudy) {
                removeStudy('main')
            }
        }

        // 设置图表设置缓存
        const locChartConfig = JSON.parse(localGet('chartConfig'))
        const initChartData = () => {
            const invertColor = localGet('invertColor')
            if (isEmpty(locChartConfig)) {
                localSetChartConfig('showLastPrice', false)
                localSetChartConfig('mainStudy', JSON.stringify(MAINSTUDIES[0]))
                localSetChartConfig('subStudy', JSON.stringify(SUBSTUDIES[0]))
                localSetChartConfig('resolution', 1)
                localSetChartConfig('lineSetList', [])
                localSetChartConfig('chartType', 1)
                localSetChartConfig('chartColorType', 1)
                localSetChartConfig('upColor', style.value.riseColor)
                localSetChartConfig('downColor', style.value.fallColor)
                // 默认选中现价线
                state.settingList = ['showLastPrice', 'stalls', 'deal']

                // 图表配置
                state.initConfig = ref({
                    property: {
                        showLastPrice: true, // 现价线
                        showPositionPrice: false, // 持仓线
                        showBuyPrice: false, // 买价线
                        showSellPrice: false, // 卖价线
                        showSeriesOHLC: true, // 高开低收
                        showBarChange: true, // 涨跌幅
                        chartType: '1', // 图表类型
                        showSeriesTitle: false // K线标题
                    },
                    indicators: [
                        {
                            name: 'Bollinger Bands',
                            params: [true, false, [26, 2]]
                        },
                        {
                            name: 'Custom MACD',
                            params: [false, false, [12, 26, 'close', 9]]
                        }

                    ],
                    extension: {
                        theme: invertColor === 'light' ? 'Light' : 'Dark', // 主题 "Light" | "Dark"
                        fullScreen: false // 全屏功能（右上角缩放按钮、横屏监听等）
                    }
                })
            } else {
                state.mainStudy = JSON.parse(locChartConfig.mainStudy)?.name
                state.subStudy = JSON.parse(locChartConfig.subStudy)?.name

                state.klineType = locChartConfig.chartType
                state.settingList = locChartConfig.lineSetList

                state.activeTab = candleKTypeList.find(item => String(item.ktype) === String(locChartConfig.resolution)).ktype

                state.initConfig = ref({
                    property: {
                        showLastPrice: locChartConfig.showLastPrice, // 现价线
                        showPositionPrice: locChartConfig.showPositionPrice, // 持仓线
                        showBuyPrice: locChartConfig.showBuyPrice, // 买价线
                        showSellPrice: locChartConfig.showSellPrice, // 卖价线
                        showSeriesOHLC: true, // 高开低收
                        showBarChange: true, // 涨跌幅
                        chartType: locChartConfig.chartType, // 图表类型
                        showSeriesTitle: false, // K线标题
                        upColor: style.value.riseColor,
                        downColor: style.value.fallColor

                    },
                    indicators: [
                        JSON.parse(locChartConfig.mainStudy),
                        JSON.parse(locChartConfig.subStudy)

                    ],
                    extension: {
                        theme: invertColor === 'light' ? 'Light' : 'Dark', // 主题 "Light" | "Dark"
                        fullScreen: false // 全屏功能（右上角缩放按钮、横屏监听等）
                    }
                })
            }
        }

        // 设置图表类型
        const setChartType = (klineType) => {
            var property = {}
            state.klineType = klineType

            state.onChartReadyFlag && unref(chartRef).setChartType(Number(klineType))
            localSetChartConfig('chartType', klineType)

            property.chartType = klineType
            state.onChartReadyFlag && unref(chartRef).updateProperty(property)
            klineTypeDropdown.value.toggle()
        }

        // 更新图表数据
        const updateChart = data => {
            try {
                if (!isEmpty(data.detail)) {
                    const res = data.detail.match(/\((.+)\)/)[1].split(',')
                    if (Number(tradeType.value) === 5 || Number(tradeType.value) === 9) {
                        state.onChartReadyFlag && unref(chartRef).setTick(res[4], res[3])

                        state.onChartReadyFlag && unref(chartRef).updateLineData({
                            buyPrice: product.value.buy_price,
                            sellPrice: product.value.sell_price
                        })
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }

        // 订阅产品
        const subscribeToProduct = () => {
            QuoteSocket.send_subscribe([symbolId + '_' + tradeType])
        }

        // 初始化图表配置
        initChartData()

        // 监听当玩法为5和9的时候。并且有pt报价的时候才更新图表
        document.body.addEventListener('GotMsg_updateChart', updateChart, false)

        // 图表创建完成回调
        const onChartReady = () => {
            state.onChartReadyFlag = true
        }

        // 获取产品详情
        store.dispatch('_quote/querySymbolInfo', { symbolId, tradeType })

        onMounted(() => {
            subscribeToProduct()
        })
        onUnmounted(() => {
            document.body.removeEventListener('GotMsg_updateChart', updateChart, false)
        })

        return {
            ...toRefs(state),
            handleClick,
            onClickStudy,
            onBeforeChange,
            klineTypeList,
            candleKTypeList,
            klineTypeIndex,
            indicatorRemoved,
            chartRef,
            onChartReady,
            initialValue,
            orientationChanged,
            setChartType,
            product

        }
    }
}
</script>

<style lang="scss" scoped>
@import "@/sass/mixin.scss";
.content{
    .symbol-info{

        padding: 18px 16px;
        display: flex;
        align-items: center;
        >div{

            flex: 1;
            &.item{
                .name{
                    font-size: 16px;
                    font-weight: bold;
                }
                .code{
                    color: var(--minorColor);
                }
                &:last-child{
                    text-align: right;
                    flex: 0;
                }
                &.collect{
                    cursor: pointer;
                }
            }
        }
    }
    .study-area {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
        height: 30px;
        line-height: 30px;
        background: var(--contentColor);
        .main-study,
        .side-study {
            display: flex;
            flex: 1;
            flex-direction: row;
            flex-wrap: nowrap;
            align-items: flex-end;
            justify-content: flex-start;

            .content {
                display: flex;
                flex: 1;
                flex-direction: row;
                flex-wrap: nowrap;
                justify-content: space-around;
                white-space: nowrap;
                .item {
                    display: flex;
                    flex: 1;
                    flex-direction: row;
                    align-items: flex-end;
                    justify-content: center;
                    padding: 0 rem(10px);
                    color: #646566;
                    text-align: center;
                    &.active {
                        color: var(--primary);
                        .inner-label {
                            color: var(--primary);
                        }
                    }
                    &.disabled {
                        color: var(--minorColor);
                    }
                    .inner-label {
                        flex: 1;
                        height: 25px;
                        color: var(--normalColor);
                        line-height: 25px;
                    }
                }
            }
        }
        .more {
            display: flex;
            flex-direction: row;
            align-items: flex-end;
            justify-content: center;
            margin: 0 10px;
            .inner-label {
                flex: 1;
                height: 25px;
                line-height:25;
            }
        }
    }
    .chart-content{
        height: 326px;
    }

}

</style>

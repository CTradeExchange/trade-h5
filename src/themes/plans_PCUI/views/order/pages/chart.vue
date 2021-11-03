<template>
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
                {{ product.cur_price ? parseFloat(product.cur_price).toFixed(product.price_digits) : '--' }}
            </p>
            <p>
                <span :class='product.upDownColor'>
                    {{ product.upDownAmount ? product.upDownAmount : '--' }}
                </span>&nbsp;
                <span :class='product.upDownColor'>
                    {{ product.upDownWidth ? product.upDownWidth : '--' }}
                </span>
            </p>
        </div>
        <div class='item ohlc'>
            <p>{{ $t('chart.open') }} {{ product.open_price }}</p>
            <p>{{ $t('chart.close') }} {{ product.yesterday_close_price }}</p>
        </div>

        <div class='item ohlc'>
            <p>{{ $t('chart.high') }} {{ product.high_price }}</p>
            <p>{{ $t('chart.low') }} {{ product.high_price }}</p>
        </div>

        <div class='item collect'>
            <i
                v-preventReClick
                class='icon icon_zixuan1'
                :class="[!isSelfSymbol?'icon_zixuan1':'icon_zixuan2']"
                @click='addOptional'
            ></i>
            <i v-if='[1, 2].includes(product.tradeType)' class='icon icon_guanyu' @click='$router.push(contractRoute)'></i>
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
            <div class='tv-right'>
                <div class='dropdown'>
                    <el-dropdown trigger='click'>
                        <KIcon class='kIcon' :value='klineTypeIndex' />
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item
                                    v-for='(item, i) in klineTypeList'
                                    :key='item.name'
                                    :class="{ 'mainColor':klineType === item.value }"
                                    @click='setChartType(item.value)'
                                >
                                    <KIcon class='kIcon' :value='i+1' />
                                    {{ item['title_zh'] }}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>

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
    <div class='chart'>
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

    <StudyList
        :prop-main-study='mainStudy'
        :prop-sub-study='subStudy'
        :show='showStudyDialog'
        @update:show='updateShow'
        @updateStudy='updateStudy'
    />
    <Loading :show='loading' />
</template>

<script>
import { reactive, toRefs, computed, unref, ref, watch, onMounted, onUnmounted } from 'vue'
import { Dialog, Toast } from 'vant'
import tv from '@/components/tradingview/tv'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { QuoteSocket } from '@/plugins/socket/socket'
import { isEmpty, localSet, localGet } from '@/utils/util'
import KIcon from './components/icons/kIcon.vue'
import StudyList from './studyList.vue'
import { addCustomerOptional, removeCustomerOptional } from '@/api/trade'
import { MAINSTUDIES, SUBSTUDIES } from '@/components/tradingview/datafeeds/userConfig/config'
import Loading from '@/components/loading.vue'
export default {
    components: { tv, KIcon, StudyList },
    setup () {
        const route = useRoute()
        const router = useRouter()
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
            lineList: [
                {
                    title: t('chart.lastValueLine'),
                    value: 'showLastPrice'
                },
                // {
                //     title: t('chart.positionLine'),
                //     value: 'showPositionPrice',
                // },
                {
                    title: t('chart.buyLine'),
                    value: 'showBuyPrice',
                },
                {
                    title: t('chart.sellLine'),
                    value: 'showSellPrice',
                },
                {
                    title: t('trade.buySellFive'),
                    value: 'stalls',
                },
                {
                    title: t('trade.dealData'),
                    value: 'deal',
                }
            ],
            showStudyDialog: false,
            loading: false

        })

        // 是否是自选
        const isSelfSymbol = computed(() => store.state._user.selfSymbolList[tradeType]?.find(el => el.symbolId === parseInt(symbolId))
        )

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
        const computedLineList = computed(() => {
            if (product.value.tradeType === 9) {
                return state.lineList
            }
            return state.lineList.filter(e => !['stalls', 'deal'].includes(e.value))
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

        const customerInfo = computed(() => store.state._user.customerInfo)

        // 重新渲染图表
        const renderChart = (product, property) => {
            state.onChartReadyFlag && unref(chartRef).updateProperty(property)
            state.onChartReadyFlag && unref(chartRef).updateLineData({
                buyPrice: product.buy_price,
                sellPrice: product.sell_price
            })

            state.onChartReadyFlag && unref(chartRef).setChartType(Number(property.chartType))
            // setPositionLine()
        }
        // 合约属性路由
        const contractRoute = computed(() => (`${route.path}/contract?symbolId=${product.value?.symbolId}&tradeType=${product.value?.tradeType}`))

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

        const handleClick = () => {

        }

        // 添加自选
        const addOptional = () => {
            if (isEmpty(customerInfo.value)) {
                Toast(t('common.noLogin'))
                return router.push('/login')
            }
            state.loading = true
            if (isSelfSymbol.value) {
                removeCustomerOptional({ symbolList: [symbolId], tradeType }).then(res => {
                    if (res.check()) {
                        state.loading = false
                        store.dispatch('_user/queryCustomerOptionalList')
                        Toast(t('trade.removeOptionalOk'))
                        // collect.value.classList.remove('icon_zixuan2')
                    }
                }).catch(err => {
                    state.loading = false
                })
            } else {
                addCustomerOptional({ symbolList: [symbolId], tradeType }).then(res => {
                    if (res.check()) {
                        state.loading = false
                        // 手动修改optional值
                        store.commit('_user/Update_optional', 1)
                        store.dispatch('_user/queryCustomerOptionalList')
                        // collect.value.classList.add('icon_zixuan2')

                        Toast(t('trade.addOptionalOk'))
                    }
                }).catch(err => {
                    state.loading = false
                })
            }
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

        // 更新指标
        const updateStudy = list => {
            const studyList = []
            if (list.length > 0) {
                list.forEach(el => {
                    const target = JSON.parse(JSON.stringify([...MAINSTUDIES, ...SUBSTUDIES].find(item => item.name === el) || null))
                    if (target) {
                        studyList.push(target)
                        state[target?.type] = target?.name
                        localSetChartConfig(target.type, JSON.stringify({
                            name: target?.name,
                            params: target?.params
                        }))
                    } else {
                        localSetChartConfig('mainStudy', null)
                        localSetChartConfig('subStudy', null)
                    }
                })
            }

            state.onChartReadyFlag && unref(chartRef).updateIndicator(studyList)
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

        // 指标移除回调
        const indicatorRemoved = (name, val) => {
            if (name === state.subStudy) {
                removeStudy('sub')
            }
            if (name === state.mainStudy) {
                removeStudy('main')
            }
        }

        const updateShow = (val) => {
            state.showStudyDialog = val
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
                        fullScreen: false, // 全屏功能（右上角缩放按钮、横屏监听等）,
                        orientation: 'portrait'
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
                        fullScreen: true, // 全屏功能（右上角缩放按钮、横屏监听等）
                        orientation: 'landscape'
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
        }

        // 设置图表线
        const handleLineChange = (val, v) => {
            var property = {}
            if (val.indexOf('showBuyPrice') > -1) {
                property.showBuyPrice = true
            } else {
                property.showBuyPrice = false
            }

            if (val.indexOf('showPositionPrice') > -1) {
                property.showPositionPrice = true
            } else {
                property.showPositionPrice = false
            }

            if (val.indexOf('showSellPrice') > -1) {
                property.showSellPrice = true
            } else {
                property.showSellPrice = false
            }

            if (val.indexOf('showLastPrice') > -1) {
                property.showLastPrice = true
            } else {
                property.showLastPrice = false
            }
            renderChart(product.value, property)
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
        store.dispatch('_quote/querySymbolInfo', { 'symbolId': 139, 'tradeType': 2 })

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
            product,
            computedLineList,
            handleLineChange,
            updateShow,
            updateStudy,
            addOptional,
            isSelfSymbol,
            contractRoute

        }
    }
}
</script>

<style lang="scss" scoped>
@import "@/sass/mixin.scss";
.symbol-info{
    padding: 11px 16px;
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
            &.ohlc{
                color: var(--normalColor);
            }

            &.collect{
                color: var(--normalColor);
                cursor: pointer;
                text-align: right;
                flex: 1;
                .icon{
                    font-size: 20px;
                    margin-left: 16px;
                    &.icon_zixuan2{
                        color: #fc822f;
                        animation: heartBeat 1.3s ease-in-out forwards;
                    }
                }
            }
        }
    }
}
.tv-head {
    box-sizing: border-box;
    // 若高度调整，需同时处理vant-tab组件内的高度和行高等
    width: 100%;
    background-color: var(--contentColor);
}
.tabs-wrap {
    display: flex;
    padding-top: 3px;
    border-top: solid 1px var(--lineColor);
    border-bottom: solid 1px var(--lineColor);
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: nowrap;
    height: 100%;
        padding-right: 10px;
    .van-popup {
        @include scroll();
    }
    .tabs {
        //flex: 1;
        width: 530px;
        :deep(.van-tab) {
            flex: 1;
            padding-bottom: 5px;
            flex-basis: auto !important;
            padding: 0;
            font-size: 14px;
            white-space: nowrap;
        }
        :deep(.van-tabs__wrap) {
            height: 30px;
            .van-tabs__nav--line {
                padding-bottom: 0;
            }
            .van-tabs__line {
                bottom: 0;
                width: 27px!important;
                height: 3px!important;
            }

        }
    }
    .other-time-tab {
        min-width: rem(61px);
        white-space: nowrap;
        text-align: center;
    }
    .more-time {
        position: relative;
        height: 100%;
        padding: 0 4px 0 0;
        color: #646566;
        font-size: rem(24px);
        line-height: rem(60px);
        background-color: var(--contentColor);
        &::after {
            position: absolute;
            top: 50%;
            right: 1px;
            margin-top: -5px;
            border: 3px solid;
            border-color: transparent transparent var(--normalColor) var(--normalColor);
            -webkit-transform: rotate(-45deg);
            transform: rotate(-45deg);
            opacity: 0.8;
            content: '';
        }
        &.opened {
            &::after {
                margin-top: -1px;
                // border-color: transparent transparent currentColor currentColor;
                transform: rotate(135deg);
            }
        }
        .options {
            position: absolute;
            top: rem(71px);
            left: rem(-100px);
            z-index: 10;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin-top: rem(1px);
            background: var(--contentColor);
            //box-shadow: 0 0 2px 0 #EBEDF0;
            .option {
                padding: rem(20px) rem(50px) rem(10px);
                color: var(--normalColor);
                line-height: rem(30px);
                white-space: nowrap;
                &.active {
                    color: var(--primary);
                }
            }
        }
        .mask {
            position: fixed;
            top: 0;
            left: 0;
            z-index: 9;
            width: 100%;
            height: 100%;
            opacity: 0;
        }
    }
    .loadingIcon {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        width: rem(80px);
        text-align: center;
        background: #FFF;
    }
    .tv-right{
        display: flex;
        align-items: center;
        .dropdown,.setting{
            margin: 0 10px;
        }
        .setting {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--contentColor);
            .icon {
                color: var(--normalColor);
                font-size: rem(32px);
            }
            .content {
                position: absolute;
                top: rem(72px);
                right: 0;
                z-index: 10;
                display: flex;
                flex-direction: column;
                align-items: center;
                align-items: flex-start;
                justify-content: center;
                background: var(--contentColor);
                box-shadow: 0 0 2px 0 var(--contentColor);
                .item {
                    padding: rem(20px) rem(50px) rem(10px);
                    line-height: rem(30px);
                    white-space: nowrap;
                    cursor: pointer;
                    &.active {
                        :deep(&.van-checkbox__icon--disabled) {
                            .van-icon {
                                background-color: #EBEDF0;
                                border-color: #C8C9CC;
                            }
                        }
                        .van-icon {
                            background-color: red;
                            border-color: red;
                        }
                        .van-checkbox__label {
                            color: red;
                            &.van-checkbox__label--disabled {
                                color: #C8C9CC;
                            }
                        }
                    }
                    :deep(.van-checkbox__label) {
                        color: var(--color);
                    }
                }
            }
            .mask {
                position: fixed;
                top: 0;
                left: 0;
                z-index: 9;
                width: 100%;
                height: 100%;
                opacity: 0;
            }
        }
    }

    .study-wrap,

    .chartPositinLine {
        font-size: rem(40px);
    }
    .study-wrap {
        width: rem(120px);
        :deep(.van-dropdown-menu__bar) {
            .van-dropdown-menu__bar {
                box-sizing: border-box;
                width: 100%;
                height: 100%;
                padding-right: 13px;
            }
        }
    }

    .kIcon {
        display: inline-block;
        color: var(--normalColor);
        vertical-align: middle;
    }

}
.study-area {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
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
            width: 460px;
            display: flex;
            flex: 1;
            flex-direction: row;
            flex-wrap: nowrap;
            justify-content: space-around;
            white-space: nowrap;
            .item {
                display: flex;
                flex: 1;
                    cursor: pointer;
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
.more-time {
        position: relative;
        height: 100%;
        padding: 0 4px 0 0;
        color: #646566;
        font-size: rem(24px);
        line-height: rem(60px);
        background-color: var(--contentColor);
        &::after {
            position: absolute;
            top: 50%;
            right: 1px;
            margin-top: -5px;
            border: 3px solid;
            border-color: transparent transparent var(--normalColor) var(--normalColor);
            -webkit-transform: rotate(-45deg);
            transform: rotate(-45deg);
            opacity: 0.8;
            content: '';
        }
        &.opened {
            &::after {
                margin-top: -1px;
                // border-color: transparent transparent currentColor currentColor;
                transform: rotate(135deg);
            }
        }
        .options {
            position: absolute;
            top: rem(71px);
            left: rem(-100px);
            z-index: 10;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin-top: rem(1px);
            background: var(--contentColor);
            //box-shadow: 0 0 2px 0 #EBEDF0;
            .option {
                padding: rem(20px) rem(50px) rem(10px);
                color: var(--normalColor);
                line-height: rem(30px);
                white-space: nowrap;
                &.active {
                    color: var(--primary);
                }
            }
        }
        .mask {
            position: fixed;
            top: 0;
            left: 0;
            z-index: 9;
            width: 100%;
            height: 100%;
            opacity: 0;
        }
    }
    .loadingIcon {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        width: rem(80px);
        text-align: center;
        background: #FFF;
    }
    .flex-right {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
    }
    .study-wrap,
    .kIcon-wrap {
        height: auto;
        :deep(.van-dropdown-menu__title) {
            color: #646566;
            font-size: rem(24px);
        }
        :deep(.van-dropdown-menu__bar) {
            width: 100%;
            height: 100%;
            box-shadow: none;
        }
        .mainColor {
            color: var(--primary);
        }
    }

    .study-wrap {
        width: rem(120px);
        :deep(.van-dropdown-menu__bar) {
            .van-dropdown-menu__bar {
                box-sizing: border-box;
                width: 100%;
                height: 100%;
                padding-right: 13px;
            }
        }
    }
    .kIcon-wrap {
        width: rem(80px);
        padding-right: 0;
        :deep(.van-dropdown-menu__item) {
            background-color: var(--contentColor);
            .van-dropdown-menu__title::after {
                display: none;
            }
        }
    }
    .kIcon {
        display: inline-block;
        color: var(--normalColor);
        vertical-align: middle;
    }
    .klineTypeRightIcon {
        padding-top: rem(10px);
        font-size: rem(36px);
    }
    .setting {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--contentColor);
        .icon {
            color: var(--normalColor);
            font-size: rem(32px);
        }
        .content {
            position: absolute;
            top: rem(72px);
            right: 0;
            z-index: 10;
            display: flex;
            flex-direction: column;
            align-items: center;
            align-items: flex-start;
            justify-content: center;
            background: var(--contentColor);
            box-shadow: 0 0 2px 0 var(--contentColor);
            .item {
                padding: rem(20px) rem(50px) rem(10px);
                line-height: rem(30px);
                white-space: nowrap;
                &.active {
                    :deep(&.van-checkbox__icon--disabled) {
                        .van-icon {
                            background-color: #EBEDF0;
                            border-color: #C8C9CC;
                        }
                    }
                    .van-icon {
                        background-color: red;
                        border-color: red;
                    }
                    .van-checkbox__label {
                        color: red;
                        &.van-checkbox__label--disabled {
                            color: #C8C9CC;
                        }
                    }
                }
                :deep(.van-checkbox__label) {
                    color: var(--color);
                }
            }
        }
        .mask {
            position: fixed;
            top: 0;
            left: 0;
            z-index: 9;
            width: 100%;
            height: 100%;
            opacity: 0;
        }
    }
.chart{
    height: 275px;
}

</style>

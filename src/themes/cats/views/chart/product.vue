<template>
    <div class='page-wrap'>
        <LayoutTop :back='true' :menu='false'>
            <p>{{ product.symbolName }}</p>
            <p class='infomation'>
                {{ product.symbolName }} {{ $t('trade.update') }}: {{ nowTime }}
            </p>

            <template #right>
                <div class='right-wrap'>
                    <div class='collectIcon' @click='addOptional'>
                        <i
                            ref='collect'
                            class='icon_zixuan1'
                            :class="{ 'icon_zixuan2':isSelfSymbol }"
                        ></i>
                    </div>
                    <div class='ft'>
                        <span
                            @click='toContractInfo'
                        >
                            <i class='icon_guanyu'></i>
                        </span>
                    </div>
                </div>
            </template>
        </LayoutTop>
        <section class='container'>
            <div class='productInfo'>
                <div class='hd'>
                    <div class='hd-left'>
                        <p class='cur_price fallColor '>
                            {{ product.cur_price }}
                        </p><!---->
                    </div><div class='others'>
                        <span class='fallColor'>
                            {{ product.upDownAmount }}({{ product.upDownAmount_pip }} {{ $t('trade.dot') }})
                        </span><div class='others-bottom'>
                            <span class='upDownAmount fallColor'>
                                {{ product.upDownWidth }}
                            </span><!---->
                        </div>
                    </div><!---->
                </div><div class='bd'>
                    <div class='item'>
                        <p class='priceBottom'>
                            <span>
                                {{ $t('trade.todayOpen') }}
                            </span>
                            <span>
                                {{ product.open_price }}
                            </span>
                        </p><p>
                            <span>
                                {{ $t('trade.yesterdayClosed') }}
                            </span>
                            <span>
                                {{ product.yesterday_close_price }}
                            </span>
                        </p>
                    </div><div class='item'>
                        <p class='priceBottom'>
                            {{ $t('trade.high') }}
                            <span>
                                {{ product.high_price }}
                            </span>
                        </p>
                        <p>
                            {{ $t('trade.low') }}
                            <span>
                                {{ product.low_price }}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </section>
        <div class='placeholder'></div>
        <div class='tv-head'>
            <div class='tabs-wrap'>
                <van-tabs
                    v-model:active='activeTab'
                    :before-change='onBeforeChange'
                    class='tabs'
                    color='#007AFF'
                    line-height='2'
                    line-width='20'
                    title-active-color='#007AFF'
                >
                    <van-tab
                        v-for='(item) in candleKTypeList.slice(0,6)'
                        :key='item.ktype'
                        :name='item.ktype'
                        :title='item.title'
                    />
                    <van-tab name='moreKTypes'>
                        <template #title class='other-time-tab'>
                            {{ moreKType.title }}
                        </template>
                    </van-tab>
                </van-tabs>

                <div class='more-time' :class='{ opened: moreTimeIsOpened }'>
                    <div v-show='moreTimeIsOpened' class='options van-hairline--surround'>
                        <div
                            v-for='(item,i) in candleKTypeList.slice(6)'
                            :key='i'
                            class='option'
                            :class='{ active: moreKType.title === item.title }'
                            @click='onClickMoreTime(item)'
                        >
                            {{ item.title }}
                        </div>
                    </div>
                    <div
                        v-show='moreTimeIsOpened'
                        class='mask'
                        @click.stop='moreTimeIsOpened = false'
                        @touchmove.stop='moreTimeIsOpened = false'
                    ></div>
                </div>

                <div class='flex-right'>
                    <van-dropdown-menu class='kIcon-wrap'>
                        <van-dropdown-item ref='klineTypeDropdown' v-model='klineType' :title="$t('indicator')">
                            <template #title>
                                <KIcon class='kIcon' :value='klineTypeIndex' />
                            </template>
                            <van-cell
                                v-for='(item, i) in klineTypeList'
                                :key='item.name'
                                :class="{ 'mainColor':klineType === item.value }"
                                is-link
                                @click='setChartType(item)'
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
                    <!-- <van-loading v-if='loading' class='loadingIcon' color='#1989fa' size='18px' /> -->
                    <div class='setting' @click='settingStatus = !settingStatus'>
                        <van-icon class='icon' name='setting-o' />

                        <div v-show='settingStatus' class='content van-hairline--surround' @click.stop=''>
                            <van-checkbox-group ref='checkboxGroup' v-model='settingList' @change='handleLineChange'>
                                <van-checkbox
                                    v-for='item in lineList'
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
        <div class='chart-wrap'>
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

        <StallsAndDeal />

        <div class='footerBtnBox'>
            <div class='trade-btn-wrap'>
                <div class='sell fallColorBg' @click="toOrder('sell')">
                    <p>
                        {{ $t('trade.sell') }}
                    </p>
                    <p class='price ' :class="product.sell_color+'Arrow'">
                        {{ product.sell_price }}
                    </p>
                </div>
                <div class='buy riseColorBg' @click="toOrder('buy')">
                    <p>
                        {{ $t('trade.buy') }}
                    </p>
                    <p class='price' :class="product.buy_color+'Arrow'">
                        {{ product.buy_price }}
                    </p>
                </div>
                <span class='spread_text'>
                    {{ product.spread_text }}
                </span>
            </div>
        </div>
    </div>

    <StudyList
        :prop-main-study='mainStudy'
        :prop-sub-study='subStudy'
        :show='showStudyDialog'
        @createStudy='createStudy'
        @removeStudy='removeStudy'
        @update:show='updateShow'
    />
</template>

<script>
import { useRouter, useRoute } from 'vue-router'
import StudyList from './components/studyList.vue'
import { useI18n } from 'vue-i18n'
import { computed, reactive, toRefs, onBeforeUnmount, ref, onMounted, unref, watchEffect, watch, onUpdated } from 'vue'
import KIcon from './icons/kIcon.vue'
import { MAINSTUDIES, SUBSTUDIES } from '@/components/tradingview/datafeeds/userConfig/config'
import dayjs from 'dayjs'
import { useStore } from 'vuex'
import { Dialog, Toast } from 'vant'
import { isEmpty, localSet, localGet } from '@/utils/util'
import tv from '@/components/tradingview/tv'
import { QuoteSocket } from '@/plugins/socket/socket'
import StallsAndDeal from './components/StallsAndDeal'
import { addCustomerOptional, removeCustomerOptional } from '@/api/trade'
let updateCurrentPriceLine
export default {
    components: { KIcon, StudyList, tv, StallsAndDeal },
    setup (props) {
        const route = useRoute()
        const router = useRouter()
        const symbolId = route.query.symbolId
        const { t } = useI18n({ useScope: 'global' })
        const klineTypeDropdown = ref(null)
        const store = useStore()
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
            }, {
                title: t('chart.day'),
                value: 'day',
                ktype: '1D',
            }, {
                title: t('chart.week'),
                value: 'week',
                ktype: '1W',
            }, {
                title: t('chart.5min'),
                value: '5min',
                ktype: '5',
            }, {
                title: t('chart.2hour'),
                value: '2hour',
                ktype: '120',
            }, {
                title: t('chart.4hour'),
                value: '4hour',
                ktype: '240',
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

        const state = reactive({
            activeTab: 0,
            moreKType: {
                title: t('chart.more'),
                ktype: null
            },
            moreTimeIsOpened: false,
            settingStatus: false,
            mainStudyList: MAINSTUDIES.slice(0, 5), // 主图
            sideStudyList: SUBSTUDIES.slice(0, 5), // 副图
            studyVis: true,
            mainStudy: 'Moving Average mock',
            subStudy: 'Custom MACD',
            showStudyDialog: false,
            lineList: [
                {
                    title: t('chart.lastValueLine'),
                    value: 'showLastPrice'
                },
                {
                    title: t('chart.positionLine'),
                    value: 'showPositionPrice',
                },
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
            linesData: {
                showLastPrice: {
                    status: true
                },
                showPositionPrice: {
                    status: false
                },
                showBuyPrice: {
                    status: false
                },
                showSellPrice: {
                    status: false
                },
                stalls: {
                    status: false
                },
                deal: {
                    status: false
                }
            },
            nowTime: dayjs().format('HH:mm:ss'),
            timeId: '',
            settingList: [],
            klineType: 0,
            initConfig: {},
            symbolId: symbolId,
            onChartReadyFlag: false

        })

        // 图表组件引用
        const chartRef = ref(null)

        const klineTypeIndex = computed(() => {
            const curIndex = klineTypeList.findIndex(el => el.value === state.klineType)
            return curIndex + 1
        })
        const product = computed(() => store.state._quote.productMap[symbolId])
        const productList = computed(() => store.state._quote.productList)
        const positionList = computed(() => store.state._trade.positionList)
        const selfSymbolList = computed(() => store.state._user.selfSymbolList)

        // 订阅产品
        const subscribList = productList.value.map(({ symbolId }) => symbolId)
        store.dispatch('_quote/querySymbolBaseInfoList', subscribList)
        QuoteSocket.send_subscribe(subscribList)

        // 图表初始值
        const initialValue = computed(() => {
            if (symbolId) {
                return {
                    text: product.value.symbolName, // 用于vant组件显示
                    description: product.value.symbolCode, // 显示在图表左上角
                    symbolId: product.value.symbolId, // 产品id
                    digits: product.value.symbolDigits, // 小数点
                }
            }
        })

        const isSelfSymbol = computed(() => !isEmpty(selfSymbolList.value.find(el => el.symbolId === parseInt(symbolId))))

        state.timeId = setInterval(() => {
            state.nowTime = dayjs().format('HH:mm:ss')
        }, 1000)

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

        // 设置图表周期
        const onBeforeChange = (name, title) => {
            if (name === 'moreKTypes') {
                state.moreTimeIsOpened = !state.moreTimeIsOpened
                return
            }
            console.log(name)
            if (name === 'timeSharing') {
                state.studyVis = false
            } else {
                state.studyVis = true
            }

            state.onChartReadyFlag && unref(chartRef).setResolution(name)

            localSetChartConfig('resolution', name)

            return true
        }

        // 设置图表类型
        const setChartType = (item) => {
            state.klineType = item.value

            state.onChartReadyFlag && unref(chartRef).setChartType(Number(item.value))
            localSetChartConfig('chartType', item.value)
            klineTypeDropdown.value.toggle()
        }

        // 设置图表线
        const handleLineChange = (val, v) => {
            const property = {}
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

            state.onChartReadyFlag && unref(chartRef).updateProperty(property)
            setPositionLine()
        }

        const setPositionLine = (property) => {
            const positionProducts = positionList.value.filter(item => item.symbolId === Number(symbolId))
            if (positionProducts.length > 0) {
                const temp = []
                positionProducts.forEach(item => {
                    temp.push({
                        text: (Number(item.direction) === 1 ? t('trade.buy') : t('trade.sell')) + item.volume + t('trade.volumeUnit'),
                        quantity: item.openNum,
                        price: item.openPrice,
                        color: item.profit < 0 ? 'green' : 'red'
                    })
                })
                state.onChartReadyFlag && unref(chartRef).updatePosition(temp)
            }
        }

        // 增加指标
        const createStudy = (type, name) => {
            const target = JSON.parse(JSON.stringify([...MAINSTUDIES, ...SUBSTUDIES].find(item => item.name === name) || null))
            switch (type) {
                case 'main': {
                    state.mainStudy = target.name
                    localSetChartConfig('mainStudy', JSON.stringify({
                        name: target.name,
                        params: target.params
                    }))
                    break
                }
                case 'sub': {
                    state.subStudy = target.name
                    localSetChartConfig('subStudy', JSON.stringify({
                        name: target.name,
                        params: target.params
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

        // 删除指标
        const removeStudy = (type) => {
            switch (type) {
                case 'main': {
                    state.mainStudy = ''
                    break
                }
                case 'sub': {
                    state.subStudy = ''
                    break
                }
            }
        }

        const updateShow = (val) => {
            state.showStudyDialog = val
        }

        const showTips = () => {
            Dialog.alert({
                title: t('trade.descTitle'),
                message: t('trade.nonStocksAndnonBullPointDesc'),
                confirmButtonColor: '#477fd3'
            }).then(() => {})
        }

        // 更多周期
        const onClickMoreTime = ({ title, ktype }) => {
            state.activeTab = 'moreKTypes'
            initOtherTime(title, ktype)
            state.moreTimeIsOpened = false
        }

        const initOtherTime = (title = this.$t('chart.more'), ktype = null) => {
            localSetChartConfig('resolution', ktype)
            state.moreKType = { title, ktype }
        }

        const toContractInfo = () => {
            router.push({ path: '/contract', query: { symbolId: symbolId } })
        }

        const orientationChanged = () => {

        }

        // 指标移除回调
        const indicatorRemoved = name => {
            console.log(name)
        }

        // 图表创建完成回调
        const onChartReady = () => {
            state.onChartReadyFlag = true
        }

        // 实时更新买卖价线
        watch(() => [product.value.buy_price, product.value.sell_price], (newValues) => {
            const [buyPrice, sellPrice] = newValues

            state.onChartReadyFlag && unref(chartRef).updateLineData({ buyPrice, sellPrice })
        })

        // 实时更新Tick
        watch(() => positionList.value, (val) => {
            val = val.filter(e => e.symbolId === symbolId.value)
            if (val.length) {
                state.onChartReadyFlag && unref(chartRef).updatePosition(val)
            }
        }, {
            immediate: true,
            deep: true
        })

        watchEffect(() => {
            if (state.settingList && state.settingList.length > 0) {
                if (state.settingList.indexOf('showBuyPrice') > -1) {
                    localSetChartConfig('showBuyPrice', true)
                } else {
                    localSetChartConfig('showBuyPrice', false)
                }

                if (state.settingList.indexOf('showPositionPrice') > -1) {
                    localSetChartConfig('showPositionPrice', true)
                } else {
                    localSetChartConfig('showPositionPrice', false)
                }

                if (state.settingList.indexOf('showSellPrice') > -1) {
                    localSetChartConfig('showSellPrice', true)
                } else {
                    localSetChartConfig('showSellPrice', false)
                }

                if (state.settingList.indexOf('showLastPrice') > -1) {
                    localSetChartConfig('showLastPrice', true)
                    // 实时更新现价线
                    updateCurrentPriceLine =
                        store.subscribe((mutation) => {
                            const { type, payload } = mutation
                            const { tick_time, cur_price, symbolId } = payload[0] || {}

                            if (!(type === '_quote/Update_productTick' && String(state.symbolId) === String(symbolId))) {
                                return
                            }

                            state.onChartReadyFlag && unref(chartRef).setTick(cur_price, tick_time)
                        })
                } else {
                    localSetChartConfig('showLastPrice', false)
                    updateCurrentPriceLine && updateCurrentPriceLine()
                }
                localSetChartConfig('lineSetList', state.settingList)
            }
        })

        const initChartData = () => {
            // 设置图表设置缓存
            const locChartConfig = JSON.parse(localGet('chartConfig'))

            if (isEmpty(locChartConfig)) {
                localSetChartConfig('showLastPrice', true)
                localSetChartConfig('mainStudy', JSON.stringify({
                    name: 'Bollinger Bands',
                    params: [true, false, [26, 2]]
                }))
                localSetChartConfig('subStudy', JSON.stringify({
                    name: 'Custom MACD',
                    params: [false, false, [12, 26, 'close', 9]]
                }))
                localSetChartConfig('resolution', 1)
                localSetChartConfig('chartType', 0)

                // 图表配置
                state.initConfig = ref({
                    property: {
                        showLastPrice: true, // 现价线
                        showPositionPrice: true, // 持仓线
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

                    ]
                })
            } else {
                state.mainStudy = JSON.parse(locChartConfig.mainStudy).name
                state.subStudy = JSON.parse(locChartConfig.subStudy).name
                state.activeTab = candleKTypeList.find(item => Number(item.ktype) === Number(locChartConfig.resolution)).ktype

                state.klineType = locChartConfig.chartType
                state.settingList = locChartConfig.lineSetList

                state.initConfig = ref({
                    property: {
                        showLastPrice: locChartConfig.showLastPrice, // 现价线
                        showPositionPrice: locChartConfig.showPositionPrice, // 持仓线
                        showBuyPrice: locChartConfig.showBuyPrice, // 买价线
                        showSellPrice: locChartConfig.showSellPrice, // 卖价线
                        showSeriesOHLC: true, // 高开低收
                        showBarChange: true, // 涨跌幅
                        chartType: locChartConfig.chartType, // 图表类型
                        showSeriesTitle: false // K线标题
                    },
                    indicators: [
                        JSON.parse(locChartConfig.mainStudy),
                        JSON.parse(locChartConfig.subStudy)

                    ]
                })
            // state.settingList = chartConfig.lineSet
            }
        }

        // 添加自选
        const addOptional = () => {
            if (isSelfSymbol.value) {
                removeCustomerOptional({ symbolList: [symbolId] }).then(res => {
                    if (res.code === '0') {
                        store.dispatch('_user/queryCustomerOptionalList')
                        Toast(t('trade.removeOptionalOk'))
                    }
                })
            } else {
                addCustomerOptional({ symbolList: [symbolId] }).then(res => {
                    if (res.code === '0') {
                        store.dispatch('_user/queryCustomerOptionalList')
                        Toast(t('trade.addOptionalOk'))
                    }
                })
            }
        }

        const toOrder = (direction) => {
            router.push({
                path: '/order',
                query: {
                    symbolId, direction
                }
            })
        }

        initChartData()

        onUpdated(() => {
            setPositionLine()
        })

        onBeforeUnmount(() => {
            state.timeId = null
        })

        return {
            ...toRefs(state),
            candleKTypeList,
            klineTypeList,
            onBeforeChange,
            onClickStudy,
            createStudy,
            removeStudy,
            showTips,
            updateShow,
            onClickMoreTime,
            setChartType,
            klineTypeDropdown,
            klineTypeIndex,
            toContractInfo,
            isSelfSymbol,
            product,
            initialValue,
            indicatorRemoved,
            chartRef,
            handleLineChange,
            orientationChanged,
            positionList,
            onChartReady,
            addOptional,
            toOrder
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
@import '~@/sass/animations.scss';
.page-wrap {
    width: 100%;
    height: 100%;
    margin-top: rem(90px);
    margin-bottom: rem(100px);
    overflow: auto;
    background: var(--bgColor2);
    .infomation {
        padding-top: rem(5px);
        font-size: rem(20px);
        line-height: rem(24px);
    }
    .right-wrap {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: center;
        height: 100%;
        .ft {
            margin-left: rem(30px);
            a {
                display: inline-block;
            }
            .icon_guanyu {
                color: rgb(153, 153, 153);
            }
        }
        .collectIcon {
            width: rem(40px);
            height: 100%;
            color: #777;
            vertical-align: top;
            .icon_zixuan1 {
                font-weight: normal !important;
            }
            .icon_zixuan2 {
                position: absolute;
                top: 0;
                color: #FC822F;
                animation: heartBeat 1.3s ease-in-out forwards;
            }
            .loading {
                position: relative;
                &::before {
                    position: absolute;
                    animation: loading 0.6s linear infinite;
                }
            }
            .zoomIn {
                position: relative;
                &::before {
                    position: absolute;
                    animation: zoomIn 0.6s linear forwards;
                }
            }
        }
    }
    .productInfo {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        padding: rem(10px) rem(20px) rem(10px) rem(20px);
        background: #FFF;
        transform: translateZ(1px);
        // margin-bottom: rem(10px);
        .hd {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            align-items: center;
            justify-content: flex-start;
            width: 100%;
            min-width: rem(265px);
            font-size: rem(24px);
            line-height: 1;
            .others {
                flex: 1;
                margin-left: rem(10px);
                > span {
                    display: block;
                    margin: rem(5px) 0;
                }
                .others-bottom {
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                }
            }
            .expire-date {
                display: flex;
                flex: 1;
                flex-direction: row;
                flex-wrap: nowrap;
                align-self: flex-end;
                justify-content: flex-end;
                color: #646566;
                font-size: rem(24px);
                white-space: nowrap;
                .value {
                    min-width: rem(153px);
                    text-align: right;
                }
            }
            .account-info {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: rem(14px) rem(17px) rem(10px);
                color: #FF8400;
                font-weight: 500;
                font-size: rem(21px);
                border: 2px solid #FF8400;
                border-radius: rem(10px);
                .text {
                    display: block;
                    margin-bottom: rem(5px);
                    font-size: rem(22px);
                    line-height: rem(24px);
                }
                .balance {
                    font-weight: 400;
                    font-size: rem(30px);
                    line-height: rem(32px);
                }
            }
            .hd-left {
                &.flex-auto {
                    flex: 1;
                }
                .hd-left-others {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: nowrap;
                    .others-bottom {
                        margin-left: rem(20px);
                    }
                }
            }
        }
        .bd {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            justify-content: flex-start;
            width: 100%;
            padding-top: rem(20px);
            color: #646566;
            font-size: rem(24px);
            .item {
                display: flex;
                flex: 1;
                flex-direction: column;
                margin-left: rem(50px);
                &:first-child {
                    margin-left: 0;
                }
                &:first-child {
                    margin-right: rem(5px);
                }
                > p {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: nowrap;
                    justify-content: space-between;
                    white-space: nowrap;
                    &.priceBottom {
                        margin-bottom: rem(10px);
                    }
                }
            }
            .point-value {
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
                align-items: center;
                justify-content: flex-start;
                .van-icon {
                    padding: 0 rem(5px);
                }
            }
        }
        .priceTime {
            position: absolute;
            top: rem(35px);
            right: rem(20px);
            color: #777;
        }
        .cur_price {
            font-size: rem(60px);
            // padding-bottom: rem(13px);
        }
        .upDownAmount {
            // padding-left: rem(20px);
        }
        .icon_icon_prompt {
            @include active();
            font-size: rem(40px);
            vertical-align: middle;
        }
    }
    .placeholder {
        height: rem(10px);
    }
    .tv-head {
        box-sizing: border-box;
        // 若高度调整，需同时处理vant-tab组件内的高度和行高等
        width: 100%;
        height: rem(60px);
    }
    .tabs-wrap {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        height: 100%;
        .van-popup {
            @include scroll();
        }
        .tabs {
            flex: 1;
            :deep(.van-tab) {
                flex: 1;
                flex-basis: auto !important;
                padding: 0;
                font-size: rem(24px);
                line-height: rem(60px);
                white-space: nowrap;
                .van-tab__text {
                    white-space: nowrap;
                }
            }
            :deep(.van-tabs__wrap) {
                height: rem(60px);
                .van-tabs__nav--line {
                    padding-bottom: 0;
                }
                .van-tabs__line {
                    bottom: 0;
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
            background: #FFF;
            &::after {
                position: absolute;
                top: 50%;
                right: 1px;
                margin-top: -5px;
                border: 3px solid;
                border-color: transparent transparent #DCDEE0 #DCDEE0;
                -webkit-transform: rotate(-45deg);
                transform: rotate(-45deg);
                opacity: 0.8;
                content: '';
            }
            &.opened {
                &::after {
                    margin-top: -1px;
                    border-color: transparent transparent currentColor currentColor;
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
                background: #FFF;
                box-shadow: 0 0 2px 0 #EBEDF0;
                .option {
                    padding: rem(20px) rem(50px) rem(10px);
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
        .kIcon-wrap {
            width: rem(80px);
            padding-right: 0;
            :deep(.van-dropdown-menu__title::after) {
                display: none;
            }
        }
        .kIcon {
            display: inline-block;
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
            width: rem(80px);
            background: #FFF;
            .icon {
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
                background: #FFF;
                box-shadow: 0 0 2px 0 #EBEDF0;
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
    .study-area {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
        height: rem(60px);
        line-height: rem(60px);
        background: #FFF;
        .main-study,
        .side-study {
            display: flex;
            flex: 1;
            flex-direction: row;
            flex-wrap: nowrap;
            align-items: flex-end;
            justify-content: flex-start;
            height: 100%;
            overflow-x: auto;
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
                    font-size: rem(24px);
                    text-align: center;
                    &.active {
                        color: var(--primary);
                    }
                    &.disabled {
                        color: var(--assistColor);
                    }
                    .inner-label {
                        flex: 1;
                        height: rem(50px);
                        line-height: rem(45px);
                    }
                }
            }
        }
        .more {
            display: flex;
            flex-direction: row;
            align-items: flex-end;
            justify-content: center;
            margin: 0 rem(10px);
            .inner-label {
                flex: 1;
                height: rem(50px);
                line-height: rem(45px);
            }
        }
    }

    // 底部按钮
    .footerBtnBox {
        position: absolute;
        bottom: rem(20px);
        left: 0;
        z-index: 2;
        display: flex;
        width: 100%;
        height: rem(100px);
        text-align: center;
        background: #FFF;
        .watch {
            @include active();
            width: rem(110px);
            padding-top: rem(20px);
            line-height: 1;
            background-color: #FFF;
            .icon {
                font-size: rem(40px);
            }
            .text {
                padding-top: rem(8px);
                font-size: rem(20px);
            }
        }
        .trade-btn-wrap {
            position: relative;
            display: flex;
            flex: 1;
            flex-direction: row;
            flex-wrap: nowrap;
            padding: 0 rem(20px);
            white-space: nowrap;
            .buy {
                margin-left: rem(20px);
            }
        }
        .sell,
        .buy {
            @include active();
            position: relative;
            flex: 1;
            padding-top: rem(18px);
            color: #FFF;
            font-size: rem(24px);
            line-height: 1;
            background-color: #858C9A;
            border-radius: 3px;
            &.fallColorBg {
                background-color: var(--sellColor);
            }
            &.riseColorBg {
                background-color: var(--success);
            }
        }
        .sell::after {
            position: absolute;
            top: 0;
            right: 0;
            width: 1px;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.15);
            content: '';
        }
        .text {
            font-size: rem(28px);
            vertical-align: middle;
        }
        .price {
            padding-top: rem(12px);
            font-size: rem(32px);
            vertical-align: middle;
            &.fallColorArrow::after {
                position: relative;
                left: rem(5px);
                font-weight: normal;
                font-size: rem(17px);
                font-family: 'iconfont' !important;
                vertical-align: middle;
                content: '\e674';
            }
            &.riseColorArrow::after {
                position: relative;
                left: rem(5px);
                font-weight: normal;
                font-size: rem(17px);
                font-family: 'iconfont' !important;
                vertical-align: middle;
                content: '\e675';
            }
        }
        .spread_text {
            position: absolute;
            top: 50%;
            left: 50%;
            height: rem(44px);
            padding: 0 rem(14px);
            color: #666;
            font-size: rem(28px);
            line-height: rem(46px);
            background: #FFF;
            border-radius: 3px;
            transform: translate(-50%, -50%);
        }
        .scrollToPosition {
            display: flex;
            flex: 0 0 rem(140px);
            flex-direction: row;
            align-content: center;
            justify-content: center;
            margin-right: rem(20px);
            color: #333;
            font-weight: 500;
            font-size: rem(28px);
            line-height: rem(100px);
            background: #EEE;
            border-radius: 3px;
        }
    }
    .chart-wrap {
        height: rem(660px);
    }
}

</style>

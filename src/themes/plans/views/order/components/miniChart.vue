<template>
    <div>
        <div class='tv-head van-hairline--bottom'>
            <div class='tabs-wrap'>
                <van-tabs
                    v-model:active='activeTab'
                    :before-change='onBeforeChange'
                    class='tabs'
                    line-height='2'
                    line-width='20'
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
                    <i class='icon_icon_arrow'></i>
                </div>

                <div class='flex-right'>
                    <img
                        src='@/themeCommon/image/expand-icon.png'
                        @click="$router.push({ name: 'Product', query: { symbolId: product.symbolId, tradeType: product.tradeType,miniChart:1 } })"
                    />
                </div>
            </div>
        </div>
        <div v-if='firstDetail' class='mini-chart'>
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
    </div>
</template>

<script>
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { computed, reactive, toRefs, ref, unref, watch, onMounted, nextTick, onBeforeUnmount } from 'vue'
import { MAINSTUDIES, SUBSTUDIES, VolumeStudy } from '@/components/tradingview/datafeeds/userConfig/config'
import { useStore } from 'vuex'
import { Dialog, Toast } from 'vant'
import { isEmpty, localSet, localGet, getCookie, setCookie, parseJSON } from '@/utils/util'
import { formatAmount } from '@/utils/calculation'
import tv from '@/components/tradingview/tv'
import { QuoteSocket } from '@/plugins/socket/socket'
import Base from '@/store/modules/base'
import { toolHooks } from '@plans/hooks/handicap'
import i18n, { loadLocaleMessages } from '@plans/i18n/i18n.js'
import { setRootVariable } from '@plans/colorVariables'
import { GetTrade, GetTradeByID } from '@/api/newApi'
export default {
    components: { tv },
    setup (props) {
        const route = useRoute()
        const router = useRouter()
        const symbolId = ref(route.query.symbolId)
        const tradeType = ref(route.query.tradeType)
        const getSymbolId = () => unref(symbolId)
        const getTradeType = () => unref(tradeType)
        const { dealModeShowMap } = toolHooks()

        // uniapp传参
        const { theme, isUniapp } = route.query
        const lang = route.query.lang || getCookie('lang')

        const chartLocaleJSON = {
            'zh-CN': 'zh',
            'en-US': 'en',
            'zh-HK': 'zh-TW',
            'th-TH': 'th',

        }
        const chartLocale = chartLocaleJSON[lang] || chartLocaleJSON['en-US']

        const { t, locale } = useI18n({ useScope: 'global' })
        const klineTypeDropdown = ref(null)
        const collect = ref(null)
        const firstDetail = ref(false)
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
            mainStudy: null,
            subStudy: null,
            showStudyDialog: false,
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
            settingList: [],
            klineType: 0,
            initConfig: {},
            symbolId: getSymbolId(),
            tradeType: getTradeType(),
            onChartReadyFlag: false,
            loading: false,
            isSelfSymbol: false,
            showPopup: false,
            showTrade: true,
            tradeItemCount: 0,
            tradeItemList: [],
            tradeCurPage: 1,
            tradeItemObj: {},
            fundInfo: computed(() => store.state._user.fundInfoStatic)
        })

        if (symbolId.value && tradeType) store.commit('_quote/Update_productActivedID', `${symbolId.value}_${tradeType.value}`)

        const computedLineList = computed(() => {
            if (product.value?.tradeType === 9) {
                return state.lineList
            }
            return state.lineList.filter(e => !['stalls', 'deal'].includes(e.value))
        })

        const customerInfo = computed(() => store.state._user.customerInfo)
        const primaryColor = computed(() => Base.state.wpCompanyInfo.themeColor)
        // 图表组件引用
        const chartRef = ref(null)
        const klineTypeIndex = computed(() => {
            const curIndex = klineTypeList.findIndex(el => el.value === state.klineType)
            return curIndex + 1
        })
        const product = computed(() => store.getters.productActived)
        const positionList = computed(() => store.state._trade.positionList[getTradeType()] || [])
        const selfSymbolList = computed(() => store.state._user.selfSymbolList)
        const plansLen = computed(() => {
            const userProductCategory = store.getters.userProductCategory
            let arr = Object.keys(userProductCategory)
            arr = arr.filter(el => {
                return userProductCategory[el]?.find(o => o.listByUser?.length)
            })
            return arr.length
        })

        // 颜色值
        const style = computed(() => store.state.style)

        // 订阅产品
        const subscribeToProduct = () => {
            QuoteSocket.send_subscribe([`${getSymbolId()}_${getTradeType()}`])
            QuoteSocket.send_subscribe24H([`${getSymbolId()}_${getTradeType()}`])
        }

        const checkIsSelfSymbol = () => {
            if (isEmpty(customerInfo.value)) {
                const newId = getSymbolId() + '_' + getTradeType()
                if (localGet('selfSymbolListStorage')) {
                    if (JSON.parse(localGet('selfSymbolListStorage')).find(el => el === newId)) {
                        state.isSelfSymbol = true
                    } else {
                        state.isSelfSymbol = false
                    }
                } else {
                    state.isSelfSymbol = false
                }
            } else {
                state.isSelfSymbol = !isEmpty(selfSymbolList.value[getTradeType()]?.find(el => el.symbolId === parseInt(getSymbolId())))
            }
        }

        const dealLastPrice = computed(() => store.state._quote.dealLastPrice)

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
            if (name === 'timeSharing') {
                state.studyVis = false
            } else {
                state.studyVis = true
            }
            state.onChartReadyFlag && unref(chartRef).setResolution(name)
            localSetChartConfig('resolution', name)
            localSetChartConfig('moreKTypes', false)
            state.moreKType = { title: t('chart.more'), ktype: null }
            return true
        }

        // 设置图表类型
        const setChartType = (klineType) => {
            var property = {}
            state.klineType = klineType

            state.onChartReadyFlag && unref(chartRef).setChartType(Number(klineType))
            localSetChartConfig('chartType', klineType)

            property.chartType = klineType
            // state.onChartReadyFlag && unref(chartRef).updateProperty(property)
            klineTypeDropdown.value.toggle()
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

        // 重新渲染图表
        const renderChart = (product, property) => {
            state.onChartReadyFlag && unref(chartRef).updateProperty(property)
            state.onChartReadyFlag && unref(chartRef).updateLineData({
                buyPrice: product?.buy_price,
                sellPrice: product?.sell_price
            })

            state.onChartReadyFlag && unref(chartRef).setChartType(Number(property.chartType))
            setPositionLine()
        }

        const setPositionLine = () => {
            const positionProducts = positionList.value.filter(item => item.symbolId === Number(getSymbolId()))
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
                JSON.parse(JSON.parse(localGet('CHART_CONFIG')).mainStudy),
                JSON.parse(JSON.parse(localGet('CHART_CONFIG')).subStudy)
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
                JSON.parse(JSON.parse(localGet('CHART_CONFIG')).mainStudy),
                JSON.parse(JSON.parse(localGet('CHART_CONFIG')).subStudy)
            ]
            state.onChartReadyFlag && unref(chartRef).updateIndicator(property)
        }

        // 缓存图表设置
        const localSetChartConfig = (key, value) => {
            const chartConfig = JSON.parse(localGet('CHART_CONFIG'))
            if (!isEmpty(chartConfig)) {
                chartConfig[key] = value
                localSet('CHART_CONFIG', JSON.stringify(chartConfig))
            } else {
                localSet('CHART_CONFIG', JSON.stringify({
                    [key]: value
                }))
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
            state.onChartReadyFlag && unref(chartRef).setResolution(ktype)
            localSetChartConfig('resolution', ktype)
            localSetChartConfig('moreKTypes', true)
            state.moreTimeIsOpened = false
        }

        const initOtherTime = (title = this.$t('chart.more'), ktype = null) => {
            localSetChartConfig('resolution', ktype)
            state.moreKType = { title, ktype }
        }

        const orientationChanged = () => {

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

        // 图表创建完成回调
        const onChartReady = (tv) => {
            state.onChartReadyFlag = true
        }

        // 实时更新买卖价线
        watch(() => [dealLastPrice.value?.price], (newValues) => {
            if (newValues) {
                state.onChartReadyFlag && unref(chartRef).setTick(dealLastPrice.value.price, dealLastPrice.value.dealTime, dealLastPrice.value.volume, product.value.symbolId)
            }

            state.onChartReadyFlag && unref(chartRef).updateLineData({
                buyPrice: product.value?.buy_price,
                sellPrice: product.value?.sell_price
            })
        })

        watch(() => [state.settingList], (newValues) => {
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
            } else {
                localSetChartConfig('showLastPrice', false)
            }

            localSetChartConfig('lineSetList', state.settingList)
        })

        // 设置图表设置缓存
        const locChartConfig = JSON.parse(localGet('CHART_CONFIG'))
        const initChartData = () => {
            let invertColor

            if (isUniapp) {
                loadLocaleMessages(i18n, lang).then(() => {
                    locale.value = lang
                    setCookie('lang', lang, 'y10')
                    store.commit('del_cacheViews', 'Product')
                })
                invertColor = theme === 'light' ? 'Light' : 'Dark'
                setRootVariable(theme)
            } else {
                invertColor = localGet('invertColor') === 'light' ? 'Light' : 'Dark'
            }

            // chartColorType 1 绿涨红跌 2 红涨绿跌
            let upColor, downColor
            if (isEmpty(locChartConfig) || Number(locChartConfig?.chartColorType) === 1) {
                upColor = '#349A71'
                downColor = '#F25B51'
            } else {
                upColor = '#F25B51'
                downColor = '#349A71'
            }

            // 当前产品是否可以显示成交量，外汇、商品、指数类产品不显示成交量
            const canUseVolume = !product.value?.isFX && !product.value?.isCommodites && !product.value?.isIndex
            // 如果当前可以展示成交量，则显示在副图指标第一位，否则不显示成交量指标
            if (canUseVolume && SUBSTUDIES[0].name !== 'Volume') {
                SUBSTUDIES.unshift(VolumeStudy)
            } else if (!canUseVolume) {
                const volumeIndex = SUBSTUDIES.findIndex(el => el.name === 'Volume')
                if (volumeIndex > -1) SUBSTUDIES.splice(volumeIndex, 1)
            }
            state.sideStudyList = SUBSTUDIES.slice(0, 5)
            if (isEmpty(locChartConfig) || !locChartConfig.chartType) {
                localSetChartConfig('showLastPrice', false)
                localSetChartConfig('mainStudy', null)
                localSetChartConfig('subStudy', null)
                localSetChartConfig('resolution', 1)
                localSetChartConfig('lineSetList', [])
                localSetChartConfig('chartType', 1)
                if (isEmpty(locChartConfig?.chartColorType)) {
                    localSetChartConfig('chartColorType', '1')
                }

                localSetChartConfig('upColor', upColor)
                localSetChartConfig('downColor', downColor)
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
                        showSeriesTitle: false, // K线标题
                        upColor: upColor,
                        downColor: downColor,

                    },
                    extension: {
                        theme: invertColor, // 主题 "Light" | "Dark"
                        fullScreen: false, // 全屏功能（右上角缩放按钮、横屏监听等）
                        orientation: 'portrait',
                        locale: chartLocale
                    },
                    disabled_features: [
                        'timeframes_toolbar'
                    ]
                })
            } else {
                state.mainStudy = JSON.parse(locChartConfig.mainStudy)?.name
                state.subStudy = JSON.parse(locChartConfig.subStudy)?.name
                if (state.subStudy === 'Volume' && !canUseVolume) {
                    state.subStudy = SUBSTUDIES[0].name
                    localSetChartConfig('subStudy', JSON.stringify(SUBSTUDIES[0]))
                    locChartConfig.subStudy = JSON.stringify(SUBSTUDIES[0])
                }

                state.klineType = locChartConfig.chartType
                state.settingList = locChartConfig.lineSetList

                const resolutionText = candleKTypeList.find(el => String(el.ktype) === String(locChartConfig?.resolution)).title || t('chart.1min')
                state.moreKType.title = resolutionText
                if (locChartConfig.moreKTypes) {
                    state.activeTab = 'moreKTypes'
                } else {
                    state.activeTab = candleKTypeList.find(item => String(item.ktype) === String(locChartConfig.resolution)).ktype
                    state.moreKType = { title: t('chart.more'), ktype: null }
                }
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
                        upColor: upColor,
                        downColor: downColor,
                    },
                    indicators: [
                        JSON.parse(locChartConfig.mainStudy),
                        // JSON.parse(locChartConfig.subStudy)//副图配置初始化
                    ],
                    extension: {
                        theme: invertColor, // 主题 "Light" | "Dark"
                        fullScreen: false, // 全屏功能（右上角缩放按钮、横屏监听等）
                        orientation: 'portrait',
                        locale: chartLocale
                    },
                    studies_overrides: {
                        'volume.show study arguments': false
                    },
                    disabled_features: [
                        'timeframes_toolbar'
                    ]
                })
            }
            firstDetail.value = true
            checkIsSelfSymbol()
        }

        // 图表初始值
        const initialValue = computed(() => {
            if (product.value?.symbolName) {
                return {
                    text: product.value.symbolName, // 用于vant组件显示
                    description: product.value.symbolCode, // 显示在图表左上角
                    symbolId: product.value.symbolId, // 产品id
                    digits: product.value.symbolDigits, // 小数点
                    dealMode: product.value.dealMode, // 成交模式
                    tradeType: getTradeType(), // 玩法
                    interval: locChartConfig?.resolution // 周期
                }
            }
            return null
        })

        // 获取产品详情
        store.dispatch('_quote/querySymbolInfo', { symbolId: getSymbolId(), tradeType: getTradeType() }).then(() => {
            // 初始化图表配置
            initChartData()
        })

        const showSidebar = ref(false)

        const toContractInfo = () => {
            router.push({ path: '/contract', query: { symbolId: getSymbolId(), tradeType: getTradeType() } })
        }

        // 侧边栏-切换产品
        const onSelect = (product, close) => {
            router.replace({
                query: {
                  ...route.query,
                  symbolId: product.symbolId,
                  tradeType: product.tradeType,
                }
            }).then(() => {
                close()
            })
        }

        // 点击etf图标的提示
        const etfTip = () => {
            Dialog.alert({
                message: t('trade.productEtfTip'),
            })
        }

        // 切换产品时重新初始化数据
        watch(
            () => route.query.symbolId,
            async () => {
                state.onChartReadyFlag = false
                await nextTick()
                const query = route.query
                if (query.symbolId) {
                    symbolId.value = parseInt(query.symbolId)
                    tradeType.value = parseInt(query.tradeType)
                    store.dispatch('_quote/querySymbolInfo', { symbolId: getSymbolId(), tradeType: getTradeType() })
                    store.commit('_quote/Update_productActivedID', `${query.symbolId}_${query.tradeType}`)
                    await nextTick()
                    const product = store.getters.productActived
                    subscribeToProduct()
                    initChartData()
                    renderChart(product, state.initConfig.property)
                    chartRef.value.reset()
                }
            }
        )

        const handleGetTrade = async (Offset = 1) => {
            const { symbolId } = route.query || {}
            let tradeId = state.tradeId
            if (!tradeId && symbolId) {
                await GetTrade({
                    body: {
                        Conditions: {
                            SymbolId: symbolId
                        },
                        Language: lang
                    }
                }).then(res => {
                    const [{ ID } = {}] = res.List || []
                    tradeId = ID
                })
            }
            if (!tradeId) return
            await GetTradeByID({
                body: {
                    ID: tradeId,
                    Language: lang,
                    Limit: 5,
                    Offset
                }
            }).then(res => {
                if (state.tradeItemCount !== res.TotalCount) {
                    state.tradeItemCount = res.TotalCount
                }
                state.tradeCurPage = res.CurPage || 1
                state.tradeItemList = (res.Trade?.Items || []).map(i => ({
                  ...i,
                  ...(parseJSON(i.Description) || {})
                }))
                if (!state.tradeItemObj.ID) {
                    state.tradeItemObj = res.Trade?.Items ? res.Trade?.Items[0] || {} : {}
                }
            })
        }

        const handleTradePage = (num) => {
            const Offset = state.tradeCurPage + num
            if (num > 0 && state.tradeCurPage * 5 >= state.tradeItemCount) {
                Toast(t('common.noMore'))
                return
            } else if (num < 0 && Offset <= 0) {
                Toast(t('common.noMore'))
                return
            }
            handleGetTrade(Offset)
        }

        const handleSkip = (item) => {
            const { ID, Type } = item || {}
            state.showPopup = false
            // if (ID === 22356) {
            //     router.push(`/infoDetail2?id=${ID}`)
            // } else
            if (Type === 1) {
                router.push(`/infoDetail?id=${ID}`)
            } else {
                router.push(`/economicCalendar?id=${ID}`)
            }
        }

        const handleAssets = () => {
            if (state.fundInfo === 'unUser') {
                router.push('/login')
            } else {
                store.dispatch('_user/saveFundInfoStatic', { FI: state.fundInfo })
            }
        }

        onMounted(() => {
            subscribeToProduct()
            checkIsSelfSymbol()
            !isUniapp && handleGetTrade()
        })

        watch(() => state.showPopup, (newVal) => {
            if (newVal && !isUniapp) handleGetTrade()
        })

        onBeforeUnmount(() => {
            QuoteSocket.cancel_subscribe(3)
        })

        return {
          ...toRefs(state),
          candleKTypeList,
          klineTypeList,
          onBeforeChange,
          onClickStudy,
          showTips,
          checkIsSelfSymbol,
          updateShow,
          onClickMoreTime,
          setChartType,
          klineTypeDropdown,
          klineTypeIndex,
          product,
          initialValue,
          indicatorRemoved,
          chartRef,
          handleLineChange,
          orientationChanged,
          positionList,
          onChartReady,
          collect,
          showSidebar,
          toContractInfo,
          onSelect,
          computedLineList,
          style,
          primaryColor,
          dealModeShowMap,
          updateStudy,
          etfTip,
          formatAmount,
          plansLen,
          isUniapp,
          firstDetail,
          dealLastPrice,
          lang,
          handleTradePage,
          handleSkip,
          handleAssets,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
@import '~@/sass/animations.scss';
.mini-chart {
      height: 250px;
      margin-top: -1px;
  }
  .tv-head {
        box-sizing: border-box;
        // 若高度调整，需同时处理vant-tab组件内的高度和行高等
        width: 100%;
        height: rem(60px);
        background-color: var(--contentColor);
        position: relative;
        z-index: 1;
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
            }
            :deep(.van-tabs__wrap) {
                height: rem(60px);
                .van-tabs__nav--line {
                    padding-right: 0;
                    padding-bottom: 0;
                }
                .van-tabs__line {
                    bottom: 0;
                    width: auto;
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
            .icon_icon_arrow {
                color: var(--minorColor);
                font-size: rem(20px);
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
            width: 80px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding-right: 20px;
            &>img{
              width: 18px;
              height: 18px;
            }
        }
        .study-wrap,
        .kIcon-wrap {
            height: auto;
            :deep(.van-dropdown-menu__title) {
                padding-right: 0;
                padding-left: rem(28px);
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
            :deep(.van-dropdown-menu__item) {
                background-color: var(--contentColor);
                .van-dropdown-menu__title::after {
                    display: none;
                }
            }
        }
        .kIcon {
            display: inline-block;
            width: rem(60px);
            color: var(--normalColor);
            text-align: center;
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
            background: var(--contentColor);
            .icon {
                color: var(--normalColor);
                font-size: rem(28px);
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
    }
    .flex-right {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
        }
</style>

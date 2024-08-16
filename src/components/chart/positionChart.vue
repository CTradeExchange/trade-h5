<template>
    <div id='chartContent' class='chart-content rounded-sm w-full'>
        <div class='flex px-4 border-bottom'>
            <div class='mr-4 border-right pr-4 flex flex-1 items-center'>
                <Resolution :resolution='resolution' :set-resolution='setResolution' />
                <Study :main-study='mainStudy' :product='product' :sub-study='subStudy' @updateStudy='updateStudy' />
            </div>
            <ChartType :chart-type='chartType' class='mr-2' :set-chart-type='setChartType' />
            <LineSetting :setting-list='settingList' @change='handleLineChange' />
        </div>

        <div class='flex-1'>
            <Tradingview
                v-if='initialValue'
                ref='chartRef'
                :container-id='containerId'
                :initial-value='initialValue'
                :options='initConfig'
                @onChartReady='onChartReady'
            />
        </div>
    </div>

    <Loading :show='loading' />
</template>

<script>
import { map } from 'lodash'
import { computed, onMounted, onUnmounted, reactive, ref, toRefs, unref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

import { MAINSTUDIES, SUBSTUDIES } from '@/components/tradingview/datafeeds/userConfig/config'
import Tradingview from '@/components/tradingview/tv'
import { chartLocaleJSON } from '@/locale.js'
import { QuoteSocket } from '@/plugins/socket/socket'
import { formatAmount, } from '@/utils/calculation'
import { getCookie, isEmpty, sessionSetJSON, sessionGetJSON } from '@/utils/util'

import Resolution from './resolution'
import ChartType from './chartType'
import Study from './study'
import LineSetting from './lineSetting'
import useChartConfig from './useChartConfig'
import useSignal from './useSignal'
import usePositionLIne from './usePositionLIne'

export default {
    components: {
        Tradingview,
        ChartType,
        Resolution,
        Study,
        LineSetting,
    },
    props: {
        disabledFeatures: {
            type: Array,
        },
        containerId: {
            type: String,
        },
        positionId: {
            type: Number,
        },
        propsProduct: {
            type: Object,
        },
    },
    setup (props) {
        const route = useRoute()
        const store = useStore()

        const { resolutionConfig } = useChartConfig()

        // 图表组件引用
        const chartRef = ref(null)
        const chartInstance = ref(null)

        const state = reactive({
            mainStudyList: MAINSTUDIES, // 主图
            sideStudyList: SUBSTUDIES, // 副图
            mainStudy: null,
            subStudy: null,
            resolution: '5', // 默认一小时
            settingList: [],
            initConfig: {},
            chartReady: false,
            showStudyDialog: false,
            loading: false,
            chartType: 1,
            scrollDirection: 'left', // 图表上方信息滚动方向
        })
        const resolution = computed(() => state.resolution)

        // 当前主题
        const theme = computed(() => store.state.invertColor)
        // 产品信息
        const product = computed(() => props.propsProduct || store.getters.productActived)

        const dealLastPrice = computed(() => store.state._quote.dealLastPrice)
        // 绘制持仓线等
        usePositionLIne({ product, chartInstance, positionId: props.positionId })
        // 获取买入卖出信号
        useSignal({ product, resolution, chartInstance })

        watch(
            () => [state.settingList],
            () => {
                if (!state.settingList) return
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
            },
        )

        // 图表初始值
        const initialValue = computed(() => {
            const resolution = sessionGetJSON(props.positionId)?.resolution || '5'
            if (product.value.symbolName) {
                return {
                    text: product.value.symbolName, // 用于vant组件显示
                    description: product.value.symbolCode, // 显示在图表左上角
                    symbolId: product.value.symbolId, // 产品id
                    digits: product.value.symbolDigits, // 小数点
                    dealMode: product.value.dealMode, // 成交模式
                    tradeType: product.value.tradeType, // 玩法
                    interval: resolution, // 周期
                }
            }
            return null
        })

        // 颜色值
        const style = computed(() => store.state.style)

        // 重新渲染图表
        const renderChart = (product, property) => {
            unref(chartRef).updateProperty(property)

            unref(chartRef).updateLineData({
                buyPrice: product.buy_price,
                sellPrice: product.sell_price,
            })

            unref(chartRef).setChartType(Number(property.chartType))
        }

        // 实时更新买卖价线
        watch(
            () => [product.value?.buy_price, product.value?.sell_price, product.value?.cur_price, product.value?.tick_time],
            () => {
                unref(chartRef)?.setTick(
                    product.value.cur_price,
                    product.value.tick_time,
                    dealLastPrice.value.volume,
                    product.value.symbolId,
                )

                unref(chartRef)?.updateLineData({
                    buyPrice: product.value.buy_price,
                    sellPrice: product.value.sell_price,
                })
            },
        )

        // 更新指标
        const updateStudy = (list) => {
            const studyList = []
            if (list.length > 0) {
                list.forEach((el) => {
                    const target = JSON.parse(JSON.stringify([...MAINSTUDIES, ...SUBSTUDIES].find((item) => item.name === el) || null))
                    if (target) {
                        studyList.push(target)
                        state[target?.type] = target?.name
                        localSetChartConfig(
                            target.type,
                            JSON.stringify({
                                name: target?.name,
                                params: target?.params,
                            }),
                        )
                    }
                })
            }
            if (!studyList.find((el) => el.type === 'mainStudy')) {
                localSetChartConfig('mainStudy', null)
            }
            if (!studyList.find((el) => el.type === 'subStudy')) {
                localSetChartConfig('subStudy', null)
            }
            initChartData()
            unref(chartRef).updateIndicator(studyList.filter(Boolean))
        }

        // 缓存图表设置
        const localSetChartConfig = (key, value) => {
            const chartConfig = sessionGetJSON(props.positionId)
            if (!isEmpty(chartConfig)) {
                chartConfig[key] = value
                sessionSetJSON(props.positionId, chartConfig)
            } else {
                sessionSetJSON(
                    props.positionId,
                    {
                        [key]: value,
                    }
                )
            }
        }

        // 设置图表周期
        const setResolution = (resolution) => {
            state.resolution = resolution
            unref(chartRef).setResolution(resolution)
            localSetChartConfig('resolution', resolution)
            return true
        }

        // 设置图表设置缓存
        const initChartData = () => {
            const locChartConfig = sessionGetJSON(props.positionId)
            const themeValue = theme.value
            const lang = route.query.lang || getCookie('lang')
            const locale = chartLocaleJSON[lang] || chartLocaleJSON['en-US']

            if (isEmpty(locChartConfig)) {
                localSetChartConfig('showLastPrice', false)
                localSetChartConfig('mainStudy', null)
                localSetChartConfig('subStudy', null)
                localSetChartConfig('resolution', '5')
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
                        showSeriesTitle: false, // K线标题
                        upColor: style.value.riseColor,
                        downColor: style.value.fallColor,
                    },
                    indicators: [null, null],
                    extension: {
                        theme: themeValue === 'light' ? 'Light' : 'Dark', // 主题 "Light" | "Dark"
                        fullScreen: false, // 全屏功能（右上角缩放按钮、横屏监听等）,
                        orientation: 'portrait',
                        locale,
                    },
                    disabled_features: props.disabledFeatures,
                })
            } else {
                state.mainStudy = JSON.parse(locChartConfig.mainStudy)?.name
                state.subStudy = JSON.parse(locChartConfig.subStudy)?.name
                if (state.subStudy === 'Volume' && !product.value.isCryptocurrency) {
                    state.subStudy = null
                    localSetChartConfig('subStudy', null)
                    locChartConfig.subStudy = null
                }

                state.chartType = locChartConfig.chartType
                state.settingList = locChartConfig.lineSetList

                state.resolution = locChartConfig.resolution || '5'

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
                        downColor: style.value.fallColor,
                    },
                    indicators: [JSON.parse(locChartConfig.mainStudy), JSON.parse(locChartConfig.subStudy)],
                    extension: {
                        theme: themeValue === 'light' ? 'Light' : 'Dark', // 主题 "Light" | "Dark"
                        fullScreen: true, // 全屏功能（右上角缩放按钮、横屏监听等）
                        orientation: 'landscape',
                        locale,
                    },
                    disabled_features: props.disabledFeatures,
                })
            }
        }

        // 设置图表类型
        const setChartType = (type) => {
            var property = {}
            state.chartType = type
            unref(chartRef).setChartType(Number(type))
            localSetChartConfig('chartType', type)
            property.chartType = type
            unref(chartRef).updateProperty(property)
        }

        // 设置图表线
        const handleLineChange = (value) => {
            state.settingList = value
            var property = {}
            if (value.indexOf('showBuyPrice') > -1) {
                property.showBuyPrice = true
            } else {
                property.showBuyPrice = false
            }

            if (value.indexOf('showPositionPrice') > -1) {
                property.showPositionPrice = true
            } else {
                property.showPositionPrice = false
            }

            if (value.indexOf('showSellPrice') > -1) {
                property.showSellPrice = true
            } else {
                property.showSellPrice = false
            }

            if (value.indexOf('showLastPrice') > -1) {
                property.showLastPrice = true
            } else {
                property.showLastPrice = false
            }
            renderChart(product.value, property)
        }

        // 监听主题修改回调
        const changeTheme = (val) => {
            const theme = val.detail === 'light' ? 'Light' : 'Dark'
            chartRef.value.changeTheme(theme)
        }

        // 监听图表颜色修改
        const changeChartColor = () => {
            initChartData()
            renderChart(product, state.initConfig.property)
            chartRef.value.reset({
                initialValue: initialValue.value,
                options: unref(state.initConfig),
            })
        }

        // 图表创建完成回调
        const onChartReady = (instance) => {
            state.chartReady = Boolean(instance)
            chartInstance.value = instance
        }

        watch(
            () => product.value.symbolId,
            (value, newValue) => {
                QuoteSocket.add_subscribe({
                    moduleId: 'order_productActivited',
                    symbolKeys: [`${product.value.symbolId}_${product.value.tradeType}`],
                })

                QuoteSocket.add_subscribe24H({
                    moduleId: 'order_productActivited',
                    symbolKeys: [`${product.value.symbolId}_${product.value.tradeType}`],
                })

                if (window.isPC) {
                    // 获取产品详情
                    store.dispatch('_quote/querySymbolInfo', {
                        symbolId: product.value.symbolId,
                        tradeType: product.value.tradeType,
                    })
                }

                initChartData()
                if (value && newValue && newValue !== value) {
                    store.dispatch('_quote/querySymbolBaseInfoList').then((res) => {
                        chartRef.value?.reset({
                            initialValue: initialValue.value,
                            options: unref(state.initConfig),
                        })
                    })
                }
            },
            {
                immediate: true,
            },
        )

        onMounted(() => {
            // 监听主题修改
            document.body.addEventListener('Launch_theme', changeTheme, false)
            // 监听设置图表颜色
            document.body.addEventListener('Launch_chartColor', changeChartColor, false)
        })

        onUnmounted(() => {
            document.body.removeEventListener('Launch_theme', changeTheme, false)
            document.body.removeEventListener('Launch_chartColor', changeChartColor, false)
        })

        return {
          ...toRefs(state),
          setResolution,
          resolutionConfig,
          chartRef,
          onChartReady,
          initialValue,
          setChartType,
          product,
          handleLineChange,
          updateStudy,
          formatAmount,
          dealLastPrice,
          map,
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.chart-content {
  background: var(--contentColor);
  height: 100%;
  display: flex;
  flex-direction: column;
  :deep {
      .menu:hover {
          background: var(--primaryAssistColor);
          border-radius: 4px;
      }
      .van-dropdown-menu__bar {
          height: 40px;
          box-shadow: none;
          color: var(--minorColor);
      }
      .van-dropdown-menu__title {
          padding: 0;
      }
      .van-dropdown-menu__title:after {
          display: none;
      }
  }
}
</style>

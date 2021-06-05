<template>
    <div class='chartWrap' :class='{ landscape: isLandscape }'>
        <tv
            v-if='initialValue'
            ref='chartRef'
            :initial-value='initialValue'
            :options='chartConfig'
            @changeOrientation='changeOrientation'
            @indicatorRemoved='indicatorRemoved'
            @symbolChanged='symbolChanged'
        >
            <template v-if='!isLandscape' #top='{ setSymbol,resolutionList, setResolution }'>
                <Top>
                    <template #right>
                        <div class='btn-wrap'>
                            <div class='btn'>
                                <van-popover
                                    v-model:show='showProductPopover'
                                    :actions='computedProductList'
                                    class='tv-product-popover'
                                    overlay
                                    theme='dark'
                                    @select='setSymbol'
                                >
                                    <template #reference>
                                        <van-button class='btn' type='primary'>
                                            <van-icon name='points' size='25' />
                                        </van-button>
                                    </template>
                                </van-popover>
                            </div>

                            <div class='btn'>
                                <van-popover
                                    v-model:show='showResolutionPopover'
                                    :actions='resolutionList'
                                    class='tv-resolution-popover'
                                    overlay
                                    theme='dark'
                                    @select='e => setResolution(e.value)'
                                >
                                    <template #reference>
                                        <van-button class='btn' type='primary'>
                                            <van-icon name='clock-o' size='25' />
                                        </van-button>
                                    </template>
                                </van-popover>
                            </div>
                            <div class='btn'>
                                <van-button class='btn' type='primary' @click='() => showIndicator = true'>
                                    <i class='icon icon_f'></i>
                                </van-button>
                            </div>
                            <div class='btn' @click='onShowSetting'>
                                <i class='icon icon_shezhi'></i>
                            </div>
                            <div class='btn' @click='gotoOrder'>
                                <i class='icon icon_xindingdan'></i>
                            </div>
                        </div>
                    </template>
                </Top>
            </template>
            <template v-if='isLandscape' #sideMenu>
                <!-- 横屏菜单 -->
                <SideMenu
                    :ref='sideMenuRef'
                    :chart='chartRef.chart'
                    class='side-menu-Component'
                    :class='{ landscape:isLandscape }'
                    @togglePriceBox='togglePriceBox'
                />
            </template>
        </tv>
    </div>

    <!-- 指标弹出层 -->
    <van-popup v-model:show='showIndicator' position='right' :style="{ height: '100%', width: '100%' }">
        <Indicator v-if='showIndicator' @back='onBack' />
    </van-popup>

    <!-- 设置弹出层 -->
    <van-popup v-model:show='showSetting' position='right' :style="{ height: '100%', width: '100%' }">
        <ChartSetting @back-event='onBackEvent' />
    </van-popup>
</template>

<script>
import Top from '@m/layout/top'
import tv from '@/components/tradingview/tv'
import { Popover } from 'vant'
import { computed, watch, ref, unref } from 'vue'
import { useStore } from 'vuex'
import { QuoteSocket } from '@/plugins/socket/socket'
import { useRouter, useRoute } from 'vue-router'
import ChartSetting from '@/themeCommon/user/chartSetting.vue'
import { localGet, localSet } from '@/utils/util'
import SideMenu from './components/sideMenu'
import Indicator from './components/indicator'

export default {
    components: {
        tv,
        Top,
        [Popover.name]: Popover,
        ChartSetting,
        SideMenu,
        Indicator,
    },
    setup () {
        const router = useRouter()
        const route = useRoute()
        const store = useStore()
        const productList = computed(() => store.state._quote.productList)

        // 图表配置
        const chartConfig = ref({})
        // 图表组件引用
        const chartRef = ref(null)
        // 是否横屏
        const isLandscape = ref([90, -90].includes(window.orientation))

        // 横屏菜单ref
        const sideMenuRef = ref(null)

        const showProductPopover = ref(false)
        const showResolutionPopover = ref(false)

        // 是否显示指标弹出层
        const showIndicator = ref(false)
        // 指标弹出层事件：关闭
        const onBack = () => {
            showIndicator.value = false
        }

        watch(showIndicator, (bool) => {
            if (!bool) {
                chartConfig.value = JSON.parse(localGet('chartConfig')) || {}
                // 更新指标
                unref(chartRef).chart.updateIndicator(unref(chartConfig).indicators)
            }
        })

        // 设置弹出层逻辑
        const showSetting = ref(false)
        // 显示设置弹出层
        const onShowSetting = () => {
            showSetting.value = true
        }
        // 设置弹出层左上角返回
        const onBackEvent = () => {
            showSetting.value = false
        }

        watch(showSetting, (bool) => {
            if (!bool) {
                chartConfig.value = JSON.parse(localGet('chartConfig')) || {}
                // 更新图表
                unref(chartRef).chart.setChartType(unref(chartConfig).chartType)
                unref(chartRef).chart.updateProperty(unref(chartConfig))
            }
        })

        // 订阅产品
        const subscribList = productList.value.map(({ symbolId }) => symbolId)
        store.dispatch('_quote/querySymbolBaseInfoList', subscribList)
        QuoteSocket.send_subscribe(subscribList)

        // 产品下拉列表
        const computedProductList = computed(
            () => productList.value
                .filter(e => e.symbolName)
                .map(e => ({
                    text: e.symbolName, // 用于vant组件显示
                    description: e.symbolCode, // 显示在图表左上角
                    symbolId: e.symbolId, // 产品id
                    digits: e.symbolDigits, // 小数点
                }))
        )

        // 图表初始值
        const initialValue = computed(() => {
            if (!computedProductList.value.length) {
                return null
            }
            const symbolId = localGet('symbolIdForChart')
            if (symbolId) {
                const target = computedProductList.value.find(e => e.symbolId + '' === symbolId)
                if (target) {
                    return target
                }
            }
            return computedProductList.value[0]
        })

        // /更新图表产品缓存
        watch(initialValue, (val) => {
            val && localSet('symbolIdForChart', val.symbolId)
        })

        // 前往下单页
        const gotoOrder = () => {
            router.push({
                name: 'Order',
                query: {
                    ...route.query,
                    symbolId: localGet('symbolIdForChart') || this.initialValue.value
                },
            })
        }

        try {
            chartConfig.value = JSON.parse(localGet('chartConfig')) || {}
        } catch (error) {
            console.error('图表缓存出错，进行清空')
            localSet('chartConfig', '{}')
        }
        // 价格栏显隐
        const togglePriceBox = () => {
            unref(chartConfig).showPriceBox = !chartConfig.value.showPriceBox
            unref(chartRef).chart.togglePriceBox(unref(chartConfig).showPriceBox)
            localSet('chartConfig', JSON.stringify(unref(chartConfig)))
        }
        // 产品id变化
        const symbolChanged = id => {
            localSet('symbolIdForChart', id)
        }

        // 监听是否横屏
        const changeOrientation = (bool) => {
            isLandscape.value = bool
            console.log('changeOrientation: ', bool)
        }

        // 移除指标特殊情况：图表内直接移除指标
        const indicatorRemoved = name => {
            chartConfig.value = JSON.parse(localGet('chartConfig')) || {}
            unref(chartConfig).indicators = unref(chartConfig).indicators.filter(e => e.name !== name)
            localSet('chartConfig', JSON.stringify(unref(chartConfig)))
        }

        return {
            computedProductList,
            initialValue,
            gotoOrder,
            onShowSetting,
            showSetting,
            onBackEvent,
            chartConfig,
            symbolChanged,
            isLandscape,
            changeOrientation,
            sideMenuRef,
            togglePriceBox,
            indicatorRemoved,
            showProductPopover,
            showResolutionPopover,
            onBack,
            showIndicator,
            chartRef
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.chartWrap {
    flex: 1;
    margin-bottom: rem(100px);
    &.landscape {
        position: relative;
        z-index: 2;
        margin-bottom: 0;
        background: #FFF;
    }
}
</style>

<style lang="scss">
.tv-product-popover {
    .van-popover__action {
        width: auto;
    }
}
.tv-resolution-popover {
    .van-popover__action {
        width: auto;
    }
}
.tv-product-popover,
.tv-resolution-popover {
    height: 70%;
    overflow-y: auto;
}
.btn-wrap {
    display: flex;
    flex-direction: row;
    align-content: center;
    justify-content: center;
    .btn {
        display: flex;
        flex-direction: row;
        align-content: center;
        justify-content: center;
        padding: 0 10px;
        background: var(--primary);
        border: 0;
        .van-button {
            padding: 0;
        }
        i {
            align-self: center;
            font-size: 22px;
        }
    }
}
.side-menu-Component {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: 100%;
    &.landscape {
        top: -100vw;
        width: 100vh;
        height: 100vw;
        transform: rotate(90deg);
        transform-origin: bottom left;
    }
}

@media screen and (orientation: landscape) {
    .side-menu-Component {
        top: 0 !important;
        left: 0 !important;
        transform: none !important;
    }
}

</style>

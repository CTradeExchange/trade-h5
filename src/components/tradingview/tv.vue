<template>
    <div class='tv'>
        <!-- slot头部渲染 -->
        <slot
            v-if='chart'
            name='top'
            :resolutionList='resolutionList'
            :setSymbol='setSymbol'
        ></slot>
        <!-- 图表承载节点 -->
        <div id='tv-chart-container' :class='{ landscape: isLandscape }'></div>

        <!-- slot横屏菜单渲染 -->
        <slot
            v-if='chart'
            :chart='chart'
            name='sideMenu'
        ></slot>
    </div>
</template>

<script>
import { computed, onMounted, onUnmounted, ref, watch, unref } from 'vue'
import { useStore } from 'vuex'
import { Popup } from 'vant'
import { resolutionToKlineType, resolutionToText } from './datafeeds/userConfig/config.js'
import { createChart } from './chart'

export default {
    components: {
        [Popup.name]: Popup,
    },
    props: {
        // 产品初始值
        initialValue: {
            type: Object,
            default: null
        },
        options: {
            type: Object,
            default: () => ({})
        }
    },
    setup (props, context) {
        const store = useStore()
        const symbolId = ref(props.initialValue.symbolId)
        const product = computed(() => store.state._quote.productMap[symbolId.value])
        // 是否横屏
        const isLandscape = ref([90, -90].includes(window.orientation))

        /** 图表相关-start */
        // 周期列表
        const resolutionList = Object.keys(resolutionToKlineType).map(value => ({
            text: resolutionToText[value],
            value
        }))

        // 图表实例
        const chart = ref(null)
        onMounted(() => {
            const { options } = props
            chart.value = createChart({
                // 容器id
                containerId: '#tv-chart-container',
                // 产品初始值
                initial: {
                    ...props.initialValue,
                    buyPrice: product.value.buy_price,
                    sellPrice: product.value.sell_price,
                },
                // 图表属性
                property: {
                    showBuyPrice: options.showBuyPrice, // 买价线
                    showSellPrice: options.showSellPrice, // 卖价线
                    showSeriesOHLC: options.showSeriesOHLC, // 高开低收
                    showBarChange: options.showBarChange, // 涨跌幅
                    chartType: options.chartType, // 图表类型
                    showPriceBox: options.showPriceBox // 价格框
                },
                // 指标
                indicators: options.indicators || []
            }, () => {
                // 监听是否横屏
                unref(chart).subscribe('isLandscape', (bool) => {
                    isLandscape.value = bool
                    context.emit('changeOrientation', bool)
                })

                // 监听指标从图表内直接移除
                unref(chart).nativeSubscribe('study_event', (name, event) => {
                    if (event === 'remove' && name) {
                        context.emit('indicatorRemoved', name)
                    }
                })

                // 实时更新买卖价线
                watch(() => [product.value.buy_price, product.value.sell_price], (newValues) => {
                    const [buyPrice, sellPrice] = newValues
                    unref(chart).updateLineData({ buyPrice, sellPrice })
                })

                // 实时更新tick
                store.subscribe((mutation) => {
                    const { type, payload: { tick_time, cur_price } } = mutation
                    if (!(type === '_quote/Update_productTick' && String(unref(chart).symbolId) === String(mutation.payload.symbolId))) {
                        return
                    }
                    unref(chart).setTick(cur_price, tick_time)
                })
            })
        })
        onUnmounted(() => {
            unref(chart).destroyed()
        })

        // 切换产品后增加自定义逻辑
        const setSymbol = (info) => {
            unref(chart).setSymbol(info)
                .then(id => {
                    symbolId.value = id
                    context.emit('symbolChanged', id)
                })
        }
        /** 图表相关-end */

        return {
            resolutionList,
            chart,
            setSymbol,
            isLandscape,
        }
    }
}
</script>

<style lang="scss" scoped>
.tv {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    #tv-chart-container {
        flex: 1;
        &.landscape {
            position: fixed;
            top: 0;
            left: 0;
            z-index: 99;
            width: 100%;
            height: 100%;
            overflow: hidden;
            background: #FFF;
            transform: rotate(90deg);
        }
    }
    @media screen and (orientation: landscape) {
        #tv-chart-container {
            top: 0 !important;
            left: 0 !important;
            transform: none !important;
        }
    }
}
</style>

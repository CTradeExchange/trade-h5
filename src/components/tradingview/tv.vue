<template>
    <div class='tv relative'>
        <!-- slot头部渲染 -->
        <slot v-if='chart' name='top' :resolutionList='resolutionList' :setSymbol='setSymbol'></slot>
        <!-- 图表承载节点 -->
        <div :id='containerId' class='tv-chart-container' :class='{ landscape: isLandscape }'>
        </div>
        <div v-if='!chartReady' class='chart-loading-container'>
            <div class='animation-container'>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
        <!-- slot横屏菜单渲染 -->
        <slot v-if='chart' :chart='chart' name='sideMenu'></slot>
    </div>
</template>

<script>
import { onMounted, onUnmounted, ref, unref, watch } from 'vue'
import { resolutionToKlineType, resolutionToText } from './datafeeds/userConfig/config.js'
import { createChart } from './chart'
import { localSetJSON } from '@/utils/util.js'
import { useIdle } from '@vueuse/core'

export default {
    props: {
        // 产品初始值
        initialValue: {
            type: Object,
            default: null,
        },
        containerId: {
            type: String,
            default: 'tv-chart-container'
        },
        options: {
            type: Object,
            default: () => ({}),
        },
    },
    setup (props, context) {
        // 是否横屏
        const isLandscape = ref([90, -90].includes(window.orientation))
        /** 图表相关-start */
        // 周期列表
        const resolutionList = Object.keys(resolutionToKlineType).map((value) => ({
            text: resolutionToText[value],
            value,
        }))

        // 图表实例
        const chart = ref(null)
        // 图表实例化状态
        const chartReady = ref(false)

        const initChart = (_props = props, cb = () => {}) => {
            chartReady.value = false
            const { options, initialValue } = _props

            chart.value = createChart(
                {
                    // 容器id
                    containerId: `#${props.containerId}`,
                    // 产品初始值
                    initial: {
                        ...initialValue,
                    },
                    // 图表属性
                    property: options.property,
                    // 指标
                    indicators: options.indicators,
                    // 扩展
                    extension: options.extension,
                    disabled_features: options.disabled_features,
                },
                () => {
                    chartReady.value = true

                    // 监听是否横屏
                    unref(chart).subscribe('isLandscape', (bool) => {
                        isLandscape.value = bool
                        context.emit('orientationChanged', bool)
                    })

                    // 监听指标从图表内直接移除
                    unref(chart).nativeSubscribe('study_event', (name, event) => {
                        setTimeout(() => {
                            if (event === 'remove' && name && chartReady.value) {
                                context.emit('indicatorRemoved', name)
                            }
                        },)
                    })

                    // 监听绘图时间
                    unref(chart).nativeSubscribe('drawing_event', (event) => {
                        unref(chart).widget.save(function (state) {
                            // 将状态保存本地存储中
                            // state 包含了图表状态，包括绘制的线条和图形
                            localSetJSON('__TRADEVIEW_STATE__', state)
                        })
                    })

                    cb()
                },
            )
        }

        watch(() => chartReady.value, (value) => {
            // 图表实例创建完成后回调
            context.emit('onChartReady', value ? chart.value : false)
        })

        // 对方法增加判断
        const withMethod = (fn) => {
            return (...args) => {
                if (unref(chartReady)) {
                    // console.log(fn.name, '图表未准备好')
                    return fn(...args)
                }
            }
        }

        const visibilitychange = () => {
            if (document.visibilityState !== 'hidden' && !window.isPC) {
                reset()
            }
        }

        onMounted(() => {
            initChart()
            document.addEventListener('visibilitychange', visibilitychange)
        })

        onUnmounted(() => {
            unref(chart).destroyed()
            document.removeEventListener('visibilitychange', visibilitychange)
        })

        // 设置图表类型
        const setChartType = (...args) => {
            if (!chartReady.value) return
            unref(chart).setChartType(...args)
        }
        // 切换产品, 执行symbolChanged回调
        const setSymbol = (info) => {
            unref(chart)
                .setSymbol(info)
                .then((id) => {
                    context.emit('symbolChanged', id)
                })
        }
        // 设置周期
        const setResolution = (...args) => {
            if (!chartReady.value) return
            unref(chart).setResolution(...args)
        }
        // 设置指标
        const updateIndicator = (...args) => {
            if (!chartReady.value) return
            unref(chart).updateIndicator(...args)
        }
        // 更新买卖价线（若左上角/买卖价框设置显示，则同步更新）
        const updateLineData = (...args) => {
            if (!chartReady.value) return
            unref(chart).updateLineData(...args)
        }
        // 更新持仓线
        const updatePosition = (...args) => {
            if (!chartReady.value) return
            unref(chart).updatePosition(...args)
        }
        // 覆盖图表配置
        const updateProperty = (...args) => {
            if (!chartReady.value) return
            unref(chart).updateProperty(...args)
        }
        // 实时更新tick
        const setTick = (price, time, volume, symbolId) => {
            if (!chartReady.value) return
            if (price) {
                unref(chart).setTick(price, time, volume, symbolId)
            }
        }
        // 重新初始化图表
        const reset = (newProps, cb) => {
            unref(chart) && unref(chart).destroyed()
            initChart(newProps, cb)
        }

        // 更改图表主题
        const changeTheme = (name) => {
            if (!chartReady.value) return
            unref(chart) && unref(chart).changeTheme(name)
        }

        /** 图表相关-end */

        return {
            chartReady,
            resolutionList,
            isLandscape,
            chart,
            setSymbol: withMethod(setSymbol),
            setResolution: withMethod(setResolution),
            updateIndicator: withMethod(updateIndicator),
            updatePosition: withMethod(updatePosition),
            setChartType: withMethod(setChartType),
            updateLineData: withMethod(updateLineData),
            updateProperty: withMethod(updateProperty),
            setTick: withMethod(setTick),
            changeTheme: withMethod(changeTheme),
            reset,
        }
    },
}
</script>

<style lang="scss" scoped>
.tv {
    .chart-loading-container {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: var(--contentColor);
        border-radius: 0;
        z-index: 1;
        .animation-container {
            display: flex;
            align-items: center;
            justify-content: center;
            span:first-child {
                animation-delay: 0.15s;
            }
            span:nth-child(2) {
                animation-delay: 0.3s;
            }
            span:nth-child(3) {
                animation-delay: 0.45s;
            }
            span:nth-child(4) {
                animation-delay: 0.6s;
            }
            span:nth-child(5) {
                animation-delay: 0.75s;
            }
            span {
                background-color: var(--primary);
                box-shadow: 0 0 32px 2px rgba(149, 255, 190, 0.075);
                width: 4px;
                height: 16px;
                border-radius: 1px;
                transform-origin: bottom;
                opacity: 0;
                animation: dotPulse 1.6s infinite;
                margin-right: 4px;
            }
            @keyframes dotPulse {
                0% {
                    transform: scaleY(0);
                }

                35% {
                    transform: scaleY(1);
                }
                70% {
                    transform: scaleY(1);
                    opacity: 1;
                }
                90% {
                    opacity: 0;
                }
            }
        }
    }
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    .tv-chart-container {
        flex: 1;
        background: var(--contentColor);
        &.landscape {
            position: fixed;
            top: 0;
            left: 0;
            z-index: 99;
            width: 100%;
            height: 100%;
            overflow: hidden;
            background: #fff;
            transform: rotate(90deg);
        }
    }
    @media screen and (orientation: landscape) {
        .tv-chart-container {
            top: 0 !important;
            left: 0 !important;
            transform: none !important;
        }
    }
}
</style>

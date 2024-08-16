import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { useAssets } from '@/hooks/assets'
import { gt, minus, div, mul, toFixed, plus } from '@/utils/calculation'
import mitt from '@/utils/mitt'

export default function usePositionLine ({ product, chartInstance, positionId }) {
    const { t, locale } = useI18n({ useScope: 'global' })
    const store = useStore()
    const account = useAssets()

    // 存储图表持仓线实例
    const positionLineInstances = ref({})

    // 获取持仓列表数据
    const positionList = computed(() => store.state._trade.positionList[product.value?.tradeType]?.filter(item => positionId ? item.positionId === positionId : true) || [])

    // 获取不需要在图表展示的持仓线 ID
    const excludedPositionLineIds = computed(() => store.state._trade.closeChartPositionLineId)

    // 获取样式设置
    const style = computed(() => store.state.style)

    // 定义线条类型的 ID
    const LINE_TYPES = ['positionLine', 'liqLine', 'takeProfitLine', 'stopLossLine']

    /**
     * 监听图表实例、产品信息及持仓列表的变化，更新图表上的持仓线
     */
    watch(
        () => [chartInstance.value, product.value.symbolId, positionList.value],
        async () => {
            if (chartInstance.value) {
                // 移除现有的所有持仓线
                await removeAllPositionLines()

                // 为持仓列表中的每个项目添加持仓线
                await Promise.all(
                    positionList.value
                        .filter(item =>
                            item.symbolId === product.value.symbolId &&
                            !excludedPositionLineIds.value.includes(item.positionId)
                        )
                        .map(addPositionLine)
                )
            }
        },
        { immediate: true }
    )

    /**
     * 从图表中移除所有持仓线
     */
    const removeAllPositionLines = () => {
        const allShapes = chartInstance.value.widget.activeChart().getAllShapes()
        Object.values(positionLineInstances.value).forEach(item => {
            LINE_TYPES.forEach(lineType => {
                if (item[lineType]?._line) {
                    item[lineType]?.remove()
                } else if (typeof item[lineType] === 'string') {
                    const shape = allShapes.find(el => el.id === item[lineType])
                    if (shape) {
                        chartInstance.value.widget.activeChart().removeEntity(shape.id)
                    }
                }
            })
        })
    }

    /**
     * 移除特定持仓的线条
     * @param {Object} position - 持仓数据
     */
    const removePositionLine = (position) => {
        const lines = positionLineInstances.value?.[position.positionId] || {}
        LINE_TYPES.forEach(lineType => {
            if (lines[lineType]?._line) {
                lines[lineType]?.remove()
            } else if (typeof lines[lineType] === 'string') {
                chartInstance.value.widget.activeChart().removeEntity(lines[lineType])
            }
        })
        excludedPositionLineIds.value.push(position.positionId)
        store.commit('_trade/Update_closeChartPositionLineId', excludedPositionLineIds.value)
    }

    /**
     * 为指定持仓在图表上添加线条
     * @param {Object} position - 持仓数据
     */
    const addPositionLine = async (position) => {
        store.commit(
            '_trade/Update_closeChartPositionLineId',
            excludedPositionLineIds.value.filter(id => id !== position.positionId)
        )

        const currency = account.value?.currency
        const directionText = position.direction === 1
            ? locale.value === 'en-US'
                ? 'LONG'
                : t('headLineHome.long')
            : locale.value === 'en-US'
                ? 'SHORT'
                : t('headLineHome.short')

        const marginText = `${directionText} ${position.occupyTheMargin} ${currency}`

        // 创建持仓线
        const positionLine = createShape(
            { price: Number(position.openPrice) },
            {
                shape: 'horizontal_line',
                text: `${marginText}`,
                linecolor: '#879091',
                textcolor: '#9aacac'
            }
        )

        const methods = position.direction === 1 ? minus : plus
        const previewStopPrice = toFixed(methods(position.openPrice, div(mul(position.openPrice, 0.8), position.crossLevelNum)), product.price_digits)
        // 创建清算线（如果存在）
        const liqLine = previewStopPrice
            ? createShape(
                { price: Number(previewStopPrice) },
                {
                    shape: 'horizontal_line',
                    text: `${locale.value === 'en-US' ? 'Liq.' : t('headLineTrade.liqPrice')} ${marginText}`,
                    linecolor: 'rgb(110,165,255)',
                    textcolor: 'rgb(110,165,255)'
                }
            )
            : null

        // 创建止盈线（如果存在）
        const takeProfitLine = gt(position.takeProfitDecimal, 0)
            ? createOrderLine({
                text: `${locale.value === 'en-US' ? 'TP' : t('trade.stopProfitPrice')} ${directionText}`,
                quantity: ` ${position.occupyTheMargin} ${currency}`,
                price: Number(position.takeProfitDecimal),
                lineColor: style.value['riseColor']
            })
            : null

        // 创建止损线（如果存在）
        const stopLossLine = gt(position.stopLossDecimal, 0)
            ? createOrderLine({
                text: `${locale.value === 'en-US' ? 'SL' : t('trade.stopLossPrice')} ${directionText}`,
                quantity: ` ${position.occupyTheMargin} ${currency}`,
                price: Number(position.stopLossDecimal),
                lineColor: style.value['fallColor']
            })
            : null

        positionLineInstances.value[position.positionId] = {
            positionLine,
            liqLine,
            takeProfitLine,
            stopLossLine
        }
    }

    /**
     * 创建图表线条
     * @param {Object} position - 持仓数据
     * @param {Object} options - 配置选项
     * @returns {Object} - 创建的图表线条
     */
    const createShape = (position, { shape, text, linecolor, textcolor }) => {
        return chartInstance.value.widget.activeChart().createShape(position, {
            shape,
            text,
            lock: true,
            disableSelection: true,
            disableSave: true,
            disableUndo: true,
            filled: true,
            overrides: {
                showLabel: true,
                showPrice: false,
                linewidth: 1,
                linecolor,
                textcolor,
                horzLabelsAlign: 'right',
                font: 'Lato',
                fontsize: '9'
            }
        })
    }

    /**
     * 创建一个新的止盈止损线，并应用默认样式
     * @param {Object} options - 配置选项
     * @returns {Object} - 配置好的止盈止损线
     */
    const createOrderLine = ({ text, quantity, price, lineColor }) => {
        return chartInstance.value.widget.chart().createOrderLine({ disableUndo: true })
            .setText(text)
            .setQuantity(quantity)
            .setPrice(price)
            .setLineColor(lineColor)
            .setBodyTextColor(lineColor)
            .setQuantityTextColor(lineColor)
            .setLineWidth(1)
            .setLineLength(1)
            .setLineStyle(0)
            .setEditable(true)
            .setBodyBorderColor('rgba(255,255,255,0)')
            .setBodyBackgroundColor('rgba(255,255,255,0)')
            .setQuantityBorderColor('rgba(255,255,255,0)')
            .setQuantityBackgroundColor('rgba(255,255,255,0)')
            .setCancelButtonBorderColor('rgba(255,255,255,0)')
    }

    onMounted(() => {
        mitt.on('removePositionLine', removePositionLine)
        mitt.on('addPositionLine', addPositionLine)
    })

    onUnmounted(() => {
        mitt.off('removePositionLine', removePositionLine)
        mitt.off('addPositionLine', addPositionLine)
    })
}

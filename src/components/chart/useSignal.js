import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import SignalEvent from '@/plugins/signal/utils/signalEvent'
import { querySubscribeSignal } from '@/plugins/signal/api/index'
import { xor, isEmpty } from 'lodash'

/**
 * 用于管理和显示图表上的信号数据。
 */
export default function useSignal({ product, resolution, chartInstance }) {
  const store = useStore()
  const { t } = useI18n({ useScope: 'global' })

  // 获取用户信息
  const customerInfo = computed(() => store.state._user.customerInfo)
  // 获取当前样式
  const currentStyle = computed(() => store.state.style)
  // 用户订阅的信号列表
  const subscribedSignals = computed(() => store.state._signal.subscribeList)

  // 存储信号数据
  const signalData = ref([])
  // 存储图表绘制实例
  const drawInstances = ref({})
  const signalId = ref(null)

  /**
* 根据订阅条件查询信号数据，并更新信号列表。
* @param {Array} subscriptions - 订阅条件列表
*/
  const fetchSignalData = (subscriptions) => {
    querySubscribeSignal({ sub: subscriptions, limit: 200 })
      .then((response) => {
        const data = response.data.items
        signalData.value = data || []
      })
  }

  // 监听产品的 symbolId 变化
  watch(() => product.value.symbolId, (newSymbolId, oldSymbolId) => {
    if (newSymbolId !== oldSymbolId) {
      drawInstances.value = {}
    }
  })

  watch(() => chartInstance.value, () => {
    if (!chartInstance.value) {
      drawInstances.value = {}
    }
  })

  const resolutionConfig = {
    5: '5m',
    15: '15m',
    30: '30m',
    60: '1h',
    '1D': '1D',
    '1W': '1W',
    '1M': '1M',
  }


  const removeInstace = () => {
    Object.values(drawInstances.value).forEach(instance => instance?.remove())
    drawInstances.value = {}
  }
  // 监听产品的 symbolId、图表实例、客户信息和订阅列表的变化
  watch(
    () => [product.value.symbolId, chartInstance.value, customerInfo.value, subscribedSignals.value, resolution.value],
    () => {
      if (!chartInstance.value || !product.value.symbolId || !customerInfo.value || !resolution.value) return

      const symbolCode = product.value.symbolCode?.replace('/', '')
      // 过滤出已订阅的信号和当前时间周期的信号
      const filteredSubscriptions = subscribedSignals.value
        .filter((item) => item.sy === symbolCode && item.pe === resolutionConfig[resolution.value])
        .map((item) => ({ i: item.i, pe: item.pe, sy: item.sy }))

      if (!filteredSubscriptions.length) return

      // 获取信号数据
      fetchSignalData(filteredSubscriptions)
    },
    { immediate: true }
  )


  // 过滤出当前产品的信号，已订阅并且是当前时间指标的信号
  const filteredSignals = computed(() => {
    return signalData.value.filter(signal =>
      signal.sy === product.value.symbolCode.replace('/', '') &&
      subscribedSignals.value.find(sub => sub.i === signal.i && sub.pe === signal.pe && sub.sy === signal.sy) && signal.pe === resolutionConfig[resolution.value]
    )
  })

  function arraysAreEqual(arr1, arr2) {
    // 找出在 arr1 和 arr2 中的不同元素
    const difference = xor(arr1, arr2);
    // 如果 difference 数组为空，则两个数组内容完全相同
    return isEmpty(difference);
  }



  // 监听信号列表、图表实例和分辨率的变化
  watch(
    () => [filteredSignals.value, chartInstance.value],
    () => {
      if (!chartInstance.value) return

      // 获取唯一时间戳，仅显示最近两个时间点的信号
      const timestamps = [...new Set(filteredSignals.value.map(signal => new Date(signal.t).valueOf() / 1000))].slice(0, 2)


      const groupedSignals = { buy: {}, sell: {} }

      filteredSignals.value.forEach(signal => {
        const time = new Date(signal.t).valueOf() / 1000
        if (timestamps.includes(time)) {
          const category = signal.a
          if (!groupedSignals[category][time]) {
            groupedSignals[category][time] = [signal]
          } else {
            groupedSignals[category][time].push(signal)
          }
        }
      })

      // 创建和绘制图形
      const createAndDrawShapes = (signals) => {
        signals.forEach((signal, index) => {
          if (!drawInstances.value[signal.id]) {
            const isLast = index === signals.length - 1
            const directionLabel = signal.a === 'buy' ? t('headLineHome.long') : t('headLineHome.short')

            const shapeInstance = chartInstance.value.widget
              ?.activeChart()
              .createExecutionShape()
              .setText(`${signal.i} ${directionLabel}`)
              // .setText(`${signal.sy} ${signal.i} ${signal.pe} ${directionLabel}`)
              .setTooltip(`${signal.i} ${directionLabel}`)
              .setTextColor(currentStyle.value[signal.a === 'buy' ? 'riseColor' : 'fallColor'])
              .setDirection(signal.a)
              .setTime(new Date(signal.t).valueOf() / 1000)
              .setArrowHeight(isLast ? (window.isPC ? 20 : 10) : 0)
              .setArrowSpacing(isLast ? 0 : -18)
              .setArrowColor(isLast ? currentStyle.value[signal.a === 'buy' ? 'riseColor' : 'fallColor'] : 'transparent')

            drawInstances.value[signal.id] = shapeInstance
          }
        })
      }

      const allSignals = [...Object.values(groupedSignals.sell).flat(), ...Object.values(groupedSignals.buy).flat()].map(item => item.id)

      // 如果有变化，则移除绘制实例
      if (!arraysAreEqual(Object.keys(drawInstances.value), allSignals)) {
        removeInstace()
      }



      // 合并相近时间的买入信号
      // groupedSignals.buy = mergeNearbySignals(groupedSignals.buy, resolution.value);

      // 合并相近时间的卖出信号
      // groupedSignals.sell = mergeNearbySignals(groupedSignals.sell, resolution.value);
      console.log("🚀 ~ useSignal ~ groupedSignals:", groupedSignals)

      Object.values(groupedSignals.buy).forEach(signals => createAndDrawShapes(signals))
      Object.values(groupedSignals.sell).forEach(signals => createAndDrawShapes(signals))
    },
    { immediate: true }
  )

  onMounted(() => {
    // 设置信号事件监听器
    signalId.value = SignalEvent.onSignal(
      {},
      (events) => {
        events.forEach(item => {
          if (!signalData.value.find(el => el.id === item.id)) {
            signalData.value.unshift(item)
          }
        })
      }
    )
    store.dispatch('_signal/queryAllQuotaIndicatorSub')
  })

  onUnmounted(() => {
    signalId.value && SignalEvent.offSignal(signalId.value)
    signalId.value = null
  })
}


// 合并时间戳相近的信号
function mergeNearbySignals(signals, resolution) {
  const keys = Object.keys(signals); // 获取所有时间戳键
  const mergedSignals = {}; // 存储合并后的信号

  // 遍历所有时间戳
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    // 如果当前时间戳键尚未在 mergedSignals 中，初始化其值
    if (!mergedSignals[key]) {
      mergedSignals[key] = signals[key];
    }

    // 比较当前时间戳键与后续时间戳键
    for (let j = i + 1; j < keys.length; j++) {
      const nextKey = keys[j];

      // 如果两个时间戳在指定分辨率下相同，则合并信号
      if (isSameTime(resolution, key * 1000, nextKey * 1000)) {
        mergedSignals[key] = [...mergedSignals[key], ...signals[nextKey]];
        delete signals[nextKey]; // 删除已合并的时间戳键
      }
    }
  }

  return mergedSignals; // 返回合并后的信号
}


// 校验两个时间是否属于同一根K线
function isSameTime(resolution, latestTime, tickTime) {
  latestTime = latestTime * 1
  tickTime = tickTime * 1
  if (latestTime > tickTime) return true

  let oldTime = window.dayjs(latestTime)
  let newTime = window.dayjs(tickTime)
  if (/^[0-9]+$/.test(resolution)) {
    return window.dayjs(tickTime).diff(latestTime, 'minute') < resolution
  } else {
    switch (resolution) {
      case '1D': {
        return oldTime.startOf('day').valueOf() === newTime.startOf('day').valueOf()
      }
      case '1W': {
        return oldTime.startOf('week').valueOf() === newTime.startOf('week').valueOf()
      }
      case '1M': {
        return oldTime.startOf('month').valueOf() === newTime.startOf('month').valueOf()
      }
    }
  }
}

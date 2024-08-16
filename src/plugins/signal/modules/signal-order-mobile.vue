<template>
    <div ref='target' class='bg-contentColor signal-order-mobile'>
        <div class='flex items-center justify-space-between px-4 py-2'>
            <!-- 标题和全选复选框 -->
            <div class='flex items-center'>
                <div class='text-base font-bold'>
                    {{ $t('signal.signal') }}
                </div>
                <van-checkbox v-if='customerInfo' v-model='showAllSignals' class='px-4 flex items-center h-8 van-hairline--bottom' icon-size='16px'>
                    <span class='text-sm text-color'>
                        {{ $t('c.all') }}
                    </span>
                </van-checkbox>
            </div>
            <!-- 订阅按钮和展开/收起按钮 -->
            <div class='flex items-center'>
                <img
                    class='w-8 h-8 cursor-pointer p-2 bg-assistColor rounded-xs mr-4'
                    src='/images/signal/add-signal.svg'
                    @click='openSubscribeModal'
                />
                <div class='w-8 h-8 cursor-pointer p-2 bg-assistColor rounded-xs flex items-center' @click='toggleExpand'>
                    <van-icon class='font-bold text-base' :name="isExpanded ? 'arrow-up' : 'arrow-down'" />
                </div>
            </div>
        </div>
        <div class='max-h-50 overflow-y-auto'>
            <!-- 加载状态 -->
            <template v-if='loading'>
                <van-skeleton v-for='item in showAllSignals ? 4 : 1' :key='item' class='mb-2' title title-width='100%' />
            </template>
            <!-- 信号列表 -->
            <template v-else>
                <template v-for='signal in computedSignals' :key='signal.id'>
                    <div class='flex items-center mb-2 h-8 justify-space-between px-4' @click='navigateToProduct(signal.sy)'>
                        <div class='flex-1'>
                            <span>{{ formatRelativeTime(signal.t) }}</span>
                        </div>
                        <div class='flex-1'>
                            <span>{{ signal.sy }}</span>
                        </div>
                        <div class='flex-1'>
                            <span>{{ $store.getters['_signal/getIndicatorName'](signal) }}</span>
                        </div>
                        <div>
                            <signalDirection :direction='signal.a' />
                        </div>
                    </div>
                </template>
            </template>
        </div>
        <SubscribeSwipeModal v-if='symbolCode' ref='subscribeModalRef' :payload='{ sy: symbolCode }' />
    </div>
</template>

<script setup>
import SubscribeSwipeModal from '@/plugins/signal/modules/subscribe/subscribe-swipe-modal.vue'
import signalDirection from '@/plugins/signal/components/signal-direction.vue'
import SignalEvent from '@/plugins/signal/utils/signalEvent'
import { getRelativeTime } from '@/plugins/signal/utils/getRelativeTime'
import { querySubscribeSignal } from '@/plugins/signal/api/index'

import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { flatMap } from 'lodash'
import { onClickOutside } from '@vueuse/core'

const store = useStore()
const router = useRouter()

const showAllSignals = ref(false) // 是否显示所有信号
const isExpanded = ref(false) // 是否展开信号列表
const subscribeModalRef = ref() // 订阅弹窗的引用
const loading = ref(false) // 加载状态
const signals = ref([]) // 当前显示的信号数据
const allSignals = ref([]) // 所有信号数据
const target = ref(null)

onClickOutside(target, (event) => {
    // 下滑或者点击空白处，关闭订阅信号弹框
    if (isExpanded.value) {
        isExpanded.value = false
    }
})

// 获取当前激活的产品
const product = computed(() => store.getters.productActived)
const symbolCode = computed(() => product.value.symbolCode?.replace('/', ''))
const customerInfo = computed(() => store.state._user.customerInfo)
const subscribeList = computed(() => store.state._signal.subscribeList)

const computedSignals = computed(() => {
    const signalsList = showAllSignals.value ? allSignals.value : signals.value
    // 点击signals右侧下拉按钮，展开最新4条信号
    return isExpanded.value ? signalsList.slice(0, 4) : signalsList.slice(0, 1)
})

// 计算所有信号产品订阅参数
const allSubscribeList = computed(() => {
    const config = store.state._signal.config
    const symbols = flatMap(config.product, 'children').map((item) => item.value)
    const indicators = config.indicator.map((item) => item.value)
    const periods = config.period.map((item) => item.value)
    return indicators.flatMap((indicator) =>
        symbols.flatMap((symbol) =>
            periods.map((period) => ({
                i: indicator,
                pe: period,
                sy: symbol,
            })),
        ),
    )
})

function transformData (data) {
    const indicators = new Set()
    const periods = new Set()
    const symbols = new Set()

    data.forEach(item => {
        indicators.add(item.i)
        periods.add(item.pe)
        symbols.add(item.sy)
    })

    return [{
        i: Array.from(indicators).join(','),
        pe: Array.from(periods).join(','),
        sy: Array.from(symbols).join(',')
    }]
}

/**
 * 获取用户可查看的信号
 */
const getVisibleSignals = () => {
    if (!symbolCode.value) return []
    // 未登录只显示5m的信号
    if (!customerInfo.value) return transformData(allSubscribeList.value.filter(item => item.sy === symbolCode.value))
    // 默认展示当前持仓用户可查看的信号
    // 点击all 显示用户可查看的所有品种的所有指标（公司免费提供+自己订阅）
    return showAllSignals.value ? transformData(allSubscribeList.value) : subscribeList.value.filter(item => item.sy === symbolCode.value).map((item) => ({ i: item.i, pe: item.pe, sy: item.sy }))
}

/**
 * 切换到指定产品
 */
const navigateToProduct = (symbol) => {
    const symbolKey = store.getters['_signal/getSignalSymbolKey'](symbol)
    const product = store.state._quote.productMap[symbolKey]
    router.push({
        path: '/order',
        query: {
            symbolId: product.symbol_id,
            tradeType: product.tradeType,
        },
    })
}

/**
 * 打开订阅信号的弹窗
 */
const openSubscribeModal = () => {
    if (!customerInfo.value) {
        router.push({
            path: '/login',
        })
    } else {
        subscribeModalRef.value.open()
    }
}

/**
 * 切换展开状态
 */
const toggleExpand = () => {
    isExpanded.value = !isExpanded.value
}

/**
 * 格式化相对时间
 */
const formatRelativeTime = (timestamp) => {
    return getRelativeTime(timestamp)
}

/**
 * 更新信号列表
 */
const updateSignals = async (values, newValues) => {
    // 如果有变化，重置信号列表并显示加载状态
    if (values[0] != newValues?.[0]) {
        loading.value = true
        signals.value = []
    }
    if (!allSignals.value.length) {
        loading.value = true
    }

    try {
        const subscribe = getVisibleSignals()

        if (subscribe.length) {
            const res = await querySubscribeSignal({
                sub: subscribe,
                limit: 50,
            })
            if (!showAllSignals.value) {
                signals.value = res.data.items || []
            } else {
                allSignals.value = res.data.items || []
            }
        } else {
            if (!showAllSignals.value) {
                signals.value = []
            } else {
                allSignals.value = []
            }
        }
    } finally {
        loading.value = false
    }
}

// 监听产品的 symbolId、客户信息、显示所有信号标志以及订阅列表的变化
watch(() => [product.value.symbolId, customerInfo.value, showAllSignals.value, subscribeList.value], updateSignals, { immediate: true })

const onScroll = () => {
    // 下滑或者点击空白处，关闭订阅信号弹框
    if (isExpanded.value) {
        isExpanded.value = false
    }
}

onMounted(() => {
    // 设置信号事件监听器
    SignalEvent.onSignal({}, (events) => {
        const symbols = flatMap(store.state._signal.config.product, 'children').map((item) => item.value)
        // 获取当前订阅产品的信号，或者获取当前产品的信号
        const filteredEvents = events.filter((item) =>
            showAllSignals.value ? symbols.includes(item.sy) : item.sy === symbolCode.value,
        )
        filteredEvents.forEach(item => {
            if (!signals.value.value.find(el => el.id !== item.id)) {
                signals.value.value.push(item)
            }
        })
    })
    window.addEventListener('scroll', onScroll)
})

onUnmounted(() => {
    window.addEventListener('scroll', onScroll)
})
</script>

<style scoped lang="scss">
.signal-order-mobile {
    --van-skeleton-row-height: 32px;
    :deep {
        .van-checkbox:after {
            display: none;
        }
    }
}
</style>

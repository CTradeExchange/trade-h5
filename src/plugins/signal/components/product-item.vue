<template>
    <div class='product-block'>
        <div class='product-item'>
            <div class='col name-col'>
                <productIcon :symbol-code='symbolCode' />
            </div>
            <div class='col price-col'>
                <span class='price' :class='product.cur_color'>
                    {{ product.cur_price || '--' }}
                </span>
                <span :class='product.upDownColor'>
                    {{ (product.upDownAmount && product.upDownAmount !== 'NaN') ? product.upDownAmount : '--' }}
                </span>
                <span :class='product.upDownColor'>
                    {{ (product.upDownWidth && product.upDownWidth !== 'NaN') ? product.upDownWidth : '--' }}
                </span>
            </div>
        </div>
        <!-- 信号引导页占位栏 -->
        <div
            v-if='list.length && index === 0'
            v-show='driverInstance && driverInstance.open'
            id='four-element-driver'
            class='signal-item-blank'
            :class='!isPC ? "signal-item-blank-m10": ""'
        >
            <signal-item
                :item-type='2'
                :signal='list[0]'
            />
        </div>
        <signalList
            :item-type='2'
            :limit='limit'
            :list='list'
            :show-exipre-style='showExipreStyle'
            :skeleton-show='skeletonShow'
        />
    </div>
</template>

<script>
import { computed, reactive, toRefs, watch, onMounted, onUnmounted, inject } from 'vue'
import { useStore } from 'vuex'
import signalList from '@/plugins/signal/components/signal-list'
import SignalEvent from '@/plugins/signal/utils/signalEvent'
import { mergeSignalList } from '@/plugins/signal/utils/util'
import { queryQuotapIndicatorBySymbol } from '@/plugins/signal/api/index'
import { QuoteSocket } from '@/plugins/socket/socket'
import productIcon from '@/plugins/signal/components/product-icon.vue'
import signalItem from '@/plugins/signal/components/signal-item.vue'

export default {
    components: {
        signalList,
        productIcon,
        signalItem
    },
    props: {
        // 信号长度
        limit: {
            type: Number,
            default: 10
        },
        symbolCode: String,
        params: {
            type: Object,
            default: () => {}
        },
        isRealTime: Boolean, // 是否实时数据
        showExipreStyle: Boolean, // 过期信号是否置灰
        index: Number // 索引
    },
    setup (props) {
        const store = useStore()
        const moduleId = 'subscribeSignalProduct_' + Date.now()
        let unSubscribe = () => {}

        const state = reactive({
            list: [],
            skeletonShow: true,
            signalId: null,
        })
        const symbolKey = computed(() => {
            return store.getters['_signal/getSignalSymbolKey'](props.symbolCode)
        })
        const product = computed(() => {
            return store.state._quote.productMap[symbolKey.value] || {}
        })

        // 订阅行情
        watch(() => symbolKey.value, (newValue) => {
            unSubscribe = QuoteSocket.add_subscribe({
                moduleId,
                symbolKeys: [newValue]
            })
        }, { immediate: true })

        const newParams = computed(() => {
            return {
                ...props.params,
                sy: props.symbolCode,
                limit: props.limit,
            }
        })

        const requestApi = (params) => {
            return props.isRealTime ? queryQuotapIndicatorBySymbol(params) : store.dispatch('_signal/queryQuotapIndicatorByCondition', params)
        }

        const loadData = () => {
            state.skeletonShow = true
            state.list = []
            return requestApi(newParams.value).then((res) => {
                if (res.check()) {
                    // 去重合并列表
                    state.list = mergeSignalList(state.list, res?.data?.items, props.limit)
                }
                state.skeletonShow = false
            }).catch((err) => {
                state.skeletonShow = false
            })
        }

        const uninstallSignal = () => {
            if (state.signalId) {
                SignalEvent.offSignal(state.signalId)
                state.signalId = null
                SignalEvent.handleUnload(loadData)
            }
        }

        const initSignal = () => {
            if (!state.signalId) {
                state.list = []
                state.signalId = SignalEvent.onSignal(newParams.value, (evt) => {
                    evt.forEach((item) => {
                        state.list.unshift(item)
                        state.list.splice(props.limit, state.list.length - props.limit)
                    })
                })
                SignalEvent.handleInit(loadData)
            }
        }

        watch(() => newParams.value, () => {
            uninstallSignal()
            initSignal()
        }, { immediate: true })

        // 判断是否需要预设
        const driverInstance = inject('driverInstance', null)

        onMounted(() => {
            initSignal()
        })
        onUnmounted(() => {
            uninstallSignal()
            unSubscribe() // 注销行情订阅
        })

        return {
            ...toRefs(state),
            symbolKey,
            product,
            newParams,
            driverInstance,
            isPC: window.isPC
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/plugins/signal/style/signal.scss';
.product-block {
    position: relative;
}
</style>

<template>
    <classify-list
        v-model='classifyValue'
        class='home-classify'
        :is-multiple='false'
        :list='classifylist'
        :size='isPC ? "lg": ""'
        :style-type='1'
    />
    <signalList
        :item-type='isPC ? 11 : 0'
        :limit='limit'
        :list='list'
        :skeleton-show='skeletonShow'
    />
    <tips />
    <!-- 查看更多 -->
    <view-more @click='handleMore' />
</template>

<script>
import { computed, toRefs, reactive, onMounted, onUnmounted, watch } from 'vue'
import { useStore } from 'vuex'
import classifyList from '@/plugins/signal/components/classify-list'
import SignalEvent from '@/plugins/signal/utils/signalEvent'
import signalList from '@/plugins/signal/components/signal-list.vue'
import { mergeSignalList } from '@/plugins/signal/utils/util'
import {
    queryQuotapIndicatorByIndicator, queryQuotapIndicatorBySignal,
    queryQuotapIndicatorByPeriod,
    queryQuotapIndicatorByAction
} from '@/plugins/signal/api/index'
import signalHook from '@/plugins/signal/hooks/signal'
import viewMore from '@/plugins/signal/components/view-more.vue'
import tips from '@/plugins/signal/modules/home/home-tip.vue'

export default {
    components: {
        classifyList,
        signalList,
        viewMore,
        tips
    },
    props: {
        // 信号类型
        signalType: String,
        // 数据长度
        limit: {
            type: Number,
            default: 8
        }
    },
    setup (props) {
        const store = useStore()
        const { jumpSignalTab } = signalHook()
        const state = reactive({
            classifylist: [],
            classifyValue: '', // 筛选值
            fieldName: '', // 字段名
            // 请求参数
            params: {
                limit: props.limit, // 页码
            },
            loadStatus: 'loading',
            list: [], // 数据列表
            signalId: null, // 订阅id,
            skeletonShow: true, // 骨架
        })

        const config = computed(() => {
            return store.state._signal.config
        })

        const tabParams = computed(() => {
            return store.state._signal.homeTabSignalParams[props.signalType] || {}
        })

        // 请求接口地址
        let RequestAPI = null

        const initParams = () => {
            switch (props.signalType) {
                case 'indicator':
                    // 按指标看
                    state.fieldName = 'i'
                    state.classifylist = config.value.indicator || []
                    RequestAPI = queryQuotapIndicatorByIndicator
                    break
                case 'diretcion':
                    // 按买卖建议
                    state.fieldName = 'a'
                    state.classifylist = config.value.action || []
                    RequestAPI = queryQuotapIndicatorByAction
                    break
                case 'period':
                    // 按周期
                    state.fieldName = 'pe'
                    state.classifylist = config.value.period || []
                    RequestAPI = queryQuotapIndicatorByPeriod
                    break
                case 'signal':
                    // 按信号看
                    state.fieldName = 'si'
                    state.classifylist = config.value.signal || []
                    RequestAPI = queryQuotapIndicatorBySignal
                    break
            }
            // 初始化参数
            if (tabParams.value.hasOwnProperty(state.fieldName)) {
                state.classifyValue = tabParams.value[state.fieldName]
            } else {
                state.classifyValue = state.classifylist?.[0]?.value || ''
            }
            state.params = {
                ...state.params,
                ...tabParams.value,
                [state.fieldName]: state.classifyValue
            }
        }

        const initSignal = () => {
            state.list = []
            state.signalId = SignalEvent.onSignal(state.params, (evt) => {
                evt.forEach((item) => {
                    state.list.unshift(item)
                    state.list.splice(props.limit, state.list.length - props.limit)
                })
            })
            // 初始化加载信息
            SignalEvent.handleInit(loadData)
        }

        const uninstallSignal = () => {
            state.signalId && SignalEvent.offSignal(state.signalId)
            state.signalId = null
            SignalEvent.handleUnload(loadData)
        }

        const loadData = () => {
            state.skeletonShow = true
            const params = {
                ...state.params
            }
            return RequestAPI && RequestAPI(params).then((res) => {
                if (res.check() && params[state.fieldName] === state.params[state.fieldName]) {
                    const items = res.data?.items || []
                    state.list = mergeSignalList(state.list, items, props.limit)
                    state.skeletonShow = false
                }
            })
        }

        // 监听条件变化，重新订阅当前条件
        watch(() => state.classifyValue, (newVal) => {
            state.params[state.fieldName] = newVal
            store.commit('_signal/Update_homeSignalValue', {
                type: props.signalType,
                params: state.params
            })
            uninstallSignal()
            initSignal()
        })

        onMounted(() => {
            initParams()
            initSignal()
        })
        onUnmounted(() => {
            uninstallSignal()
        })

        // 更多
        const handleMore = () => {
            jumpSignalTab(props.signalType, {
                [state.fieldName]: state.params[state.fieldName]
            })
        }

        return {
            ...toRefs(state),
            handleMore,
            isPC: window.isPC
        }
    }
}

</script>

<style lang="scss" scoped>
@import '@/plugins/signal/style/signal.scss';
.home-classify {
    margin: 10px 0;
}
</style>

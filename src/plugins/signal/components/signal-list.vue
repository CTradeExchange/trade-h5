<template>
    <skeleton
        v-if='skeletonShow'
        class='px-3'
        :item-type='itemType'
        :limit='limit'
    />
    <slot v-else-if='!skeletonShow && list.length > 0'>
        <div class='signal-list'>
            <!-- pc需要显示标题 -->
            <signal-item-th :item-type='itemType' />
            <signal-item
                v-for='item in list'
                :key='listId + item.id'
                :item-type='itemType'
                :show-exipre-style='showExipreStyle'
                :show-subscribe='showSubscribe'
                :signal='item'
            />
        </div>
    </slot>
    <template v-else>
        <slot name='noData'>
        </slot>
        <div v-if='noDataText' class='none-data px-2'>
            <van-empty :description='noDataText' image='/images/empty.png' />
        </div>
    </template>
</template>

<script>
import { onUnmounted, reactive, toRefs, watch, computed, inject } from 'vue'
import { randomId } from '@/utils/util.js'
import skeleton from './skeleton.vue'
import signalItem from '../components/signal-item'
import { QuoteSocket } from '@/plugins/socket/socket'
import { useStore } from 'vuex'
import signalItemTh from './signal-item-th.vue'

export default {
    components: {
        signalItem,
        signalItemTh,
        skeleton,
    },
    props: {
        // 是否显示骨架
        skeletonShow: {
            type: Boolean,
            default: false
        },
        // 列表数据
        list: {
            type: Array,
            default: () => []
        },
        // 数据长度
        limit: {
            type: Number,
            default: 10
        },
        // 列表展示类型
        itemType: {
            type: Number,
            default: 0,
        },
        // 是否展示过期背景
        showExipreStyle: {
            type: Boolean,
            default: false
        },
        // thead展示
        showThead: {
            type: Boolean,
            default: false
        },
        // 是否显示订阅图标
        showSubscribe: {
            type: Boolean,
            default: true
        },
        // 置空说明
        noDataText: String,
    },
    emits: ['on-refresh'],
    setup (props, { emit }) {
        const store = useStore()
        const moduleId = 'subscribeSignal_' + Date.now()
        let unSubscribe = () => {}

        const state = reactive({
            // 定时器
            timer: null,
            // 唯一id
            listId: randomId(),
        })

        const showDriverFirstItem = inject('showDriverFirstItem', false)

        const clearList = () => {
            state.timer && clearInterval(state.timer)
        }

        const reloadList = () => {
            clearList()
            state.timer = setInterval(() => {
                state.listId = randomId()
                // 刷新回调事件，自定义slot组件需要使用刷新回调
                emit('on-refresh', state.listId)
            }, 1000 * 60)
        }

        // 颜色背景 透明度30%
        const style = computed(() => {
            return {
                risebg: store.state.style.riseColor + '26',
                fallbg: store.state.style.fallColor + '26'
            }
        })

        watch(() => props.list, () => {
            reloadList()
        }, { deep: true })

        // 订阅行情
        watch([() => props.list, () => store.state._quote.symbolCodeMap, () => props.itemType], (newValue) => {
            // 等行情加载完了再订阅
            if (Object.keys(newValue[1]).length === 0 || [3, 11].includes(newValue[2]) === false) return
            const symbolKeyAll = []
            newValue[0].forEach((item) => {
                const symbolKey = store.getters['_signal/getSignalSymbolKey'](item.sy)
                if (symbolKey && !symbolKeyAll.includes(symbolKey)) {
                    symbolKeyAll.push(symbolKey)
                }
            })
            unSubscribe = QuoteSocket.add_subscribe({
                moduleId,
                symbolKeys: symbolKeyAll
            })
        }, { immediate: true, deep: true })

        onUnmounted(() => {
            unSubscribe()
            clearList()
        })

        return {
            ...toRefs(state),
            style,
            showDriverFirstItem
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/plugins/signal/style/signal.scss';
.signal-list {
    :deep {
        .signal-item {
            --risebg: v-bind(style.risebg);
            --fallbg: v-bind(style.fallbg);
        }
    }
}
</style>

<template>
    <div class='newest-signal'>
        <div v-if='showTitle' class='signal-header'>
            <div class='name'>
                {{ $t('signal.newestSignal') }}
            </div>
            <div class='more' @click='handleMore'>
                <van-icon class='arrow' name='arrow' :size='14' />
            </div>
        </div>
        <!-- 标题 -->
        <slot name='header'></slot>
        <signalList
            :item-type='itemType'
            :limit='limit'
            :list='list'
            :show-subscribe='showSubscribe'
            :show-thead='showThead'
            :skeleton-show='skeletonShow'
        />
        <!-- 查看更多 -->
        <slot name='footer'></slot>
    </div>
</template>

<script>
import { reactive, toRefs, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import SignalEvent from '@/plugins/signal/utils/signalEvent'
import signalList from '@/plugins/signal/components/signal-list'
import { queryQuotapIndicatorByTime } from '@/plugins/signal/api/index'
import { mergeSignalList } from '@/plugins/signal/utils/util'

export default {
    components: {
        signalList,
    },
    props: {
        // 是否显示标题
        showTitle: {
            type: Boolean,
            default: true
        },
        // 展示数据长度
        limit: {
            type: Number,
            default: 3,
        },
        // 展示类型
        itemType: {
            type: Number,
            default: 0,
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
        }
    },
    emits: ['load-data-complete'],
    setup (props, { emit }) {
        const router = useRouter()

        const state = reactive({
            signalId: null, // 订阅id
            list: [],
            skeletonShow: true, // 骨架
        })

        // 加载数据
        const loadData = () => {
            return queryQuotapIndicatorByTime({ limit: props.limit }).then((res) => {
                if (res.check()) {
                    state.list = mergeSignalList(state.list, res?.data?.items, props.limit)
                    emit('load-data-complete') // 加载数据完成
                }
                state.skeletonShow = false
            }).catch(() => {
                state.skeletonShow = false
            })
        }

        const initSignal = () => {
            if (!state.signalId) {
                state.list = []
                state.signalId = SignalEvent.onSignal({}, (evt) => {
                    evt.forEach((item) => {
                        state.list.unshift(item)
                        state.list.splice(props.limit, state.list.length - props.limit)
                    })
                })
                // 初始化加载信息
                SignalEvent.handleInit(loadData)
            }
        }

        const uninstallSignal = () => {
            if (state.signalId) {
                SignalEvent.offSignal(state.signalId)
                state.signalId = null
                state.skeletonShow = true
                SignalEvent.handleUnload(loadData)
            }
        }

        const handleMore = () => {
            router.push('signalFeatured')
        }

        onMounted(() => {
            // 订阅行情
            initSignal()
        })

        onUnmounted(() => {
            // 取消订阅
            uninstallSignal()
        })

        return {
            ...toRefs(state),
            handleMore
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/plugins/signal/style/signal.scss';
.signal-header {
    color: var(--minorColor);
    border-bottom-color: var(--lineColor);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: rem(24px);
    margin-bottom: rem(16px);
    font-size: rem(26px);
    border-bottom-width: 1px;
    border-bottom-style: solid;
    .more {
        display: inline-flex;
        align-items: center;
        cursor: pointer;
        .arrow {
            color: var(--minorColor);
            font-size: rem(32px);
        }
    }
}
</style>

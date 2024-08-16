<template>
    <div class='module-case'>
        <title-section
            :desc='$t("signal.activity.newestSignalDesc")'
            :title='$t("signal.newestSignal")'
            @handle-more='handleMore'
        />
        <signalList
            :item-type='isPC ? 11 : 0'
            :limit='limit'
            :list='list'
            :skeleton-show='skeletonShow'
        />
    </div>
</template>

<script>
import { useRouter } from 'vue-router'
import SignalEvent from '@/plugins/signal/utils/signalEvent'
import signalList from '@/plugins/signal/components/signal-list'
import { queryQuotapIndicatorByTime } from '@/plugins/signal/api/index'
import { mergeSignalList } from '@/plugins/signal/utils/util'
import titleSection from '@/plugins/signal/components/title-section.vue'
import { onMounted, onUnmounted, reactive, toRefs } from 'vue'

export default {
    components: {
        signalList,
        titleSection,
    },
    props: {
        // 是否显示标题
        showTitle: {
            type: Boolean,
            default: true
        },
        limit: {
            type: Number,
            default: 5,
        }
    },
    setup (props) {
        const router = useRouter()
        const state = reactive({
            signalId: null, // 订阅id
            list: [],
            skeletonShow: true, // 骨架
        })
        const loadData = () => {
            return queryQuotapIndicatorByTime({ limit: props.limit }).then((res) => {
                if (res.check()) {
                    state.list = mergeSignalList(state.list, res?.data?.items, props.limit)
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
            router.push('/signalFeatured?type=new')
        }

        onMounted(() => {
            initSignal()
        })
        onUnmounted(() => {
            uninstallSignal()
        })
        return {
            ...toRefs(state),
            handleMore,
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/plugins/signal/style/signal.scss';
.module-case {
    position: relative;
}
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
        .arrow {
            color: var(--minorColor);
            margin-right: rem(-8px) !important;
            font-size: rem(36px) !important;
        }
    }
}
</style>

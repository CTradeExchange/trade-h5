<template>
    <div class='mine'>
        <div class='mine-sticky'>
            <!-- 标题 -->
            <signal-item-th :item-type='11' />
            <!-- 更新条数 -->
            <div v-if='cacheList.length' class='signal-more' @click='mergeData'>
                {{ $t('signal.showSignalLen', [cacheList.length]) }}
            </div>
        </div>

        <signal-list
            :item-type='11'
            :limit='params.limit'
            :list='list'
            :no-data-text='$t("signal.subscribe.mineSignalEmpty")'
            :skeleton-show='skeletonShow'
            @on-refresh='handleRefresh'
        >
            <virtual-list
                :key='listId'
                ref='listRef'
                class='signal-overflow-y'
                :data-component='itemComponent'
                :data-key="'id'"
                :data-sources='list'
                :estimate-size='30'
                :extra-props='{
                    itemType: 11,
                    isVirtualItem: true,
                    hasShowMap,
                    showSubscribe: false,
                    showTrade: true,
                    gaTrade: "signal_signalMySignalList_tradeBtn_cl",
                    gaTg: "signal_signalMySignalList_tgBtn_cl",
                    from: "mineSignal",
                    showTg: true
                }'
                :item-class="'list-item'"
                :page-mode='true'
                @scroll='scroll'
            >
                <template v-if='loadStatus !== "finished"' #footer>
                    <van-button
                        class='signal-view-more'
                        :loading="loadStatus === 'loading'"
                        :loading-text="$t('signal.common.viewMore')"
                        @click='scrolltolower'
                    >
                        {{ $t('signal.common.viewMore') }}
                    </van-button>
                </template>
            </virtual-list>
        </signal-list>
    </div>
</template>

<script>
import { reactive, ref, onMounted, onUnmounted, toRefs, computed, provide, } from 'vue'
import virtualList from '@/components/virtual-list'
import Item from '@/plugins/signal/components/signal-virtual-item.vue'
import SignalEvent from '@/plugins/signal/utils/signalEvent'
import signalList from '@/plugins/signal/components/signal-list.vue'
import { querySubscribeSignal } from '@/plugins/signal/api/index'
import signalItemTh from '@/plugins/signal/components/signal-item-th.vue'
import { randomId } from '@/utils/util.js'
import { useStore } from 'vuex'

export default {
    components: {
        virtualList,
        signalList,
        signalItemTh
    },
    setup () {
        const listRef = ref(null)
        const store = useStore()
        // state
        const state = reactive({
            signalId: null,
            list: [],
            cacheList: [], // 待插入的缓存列表
            skeletonShow: true, // 骨架
            lastestScrollTop: 0, // 当前滚动位置
            loadStatus: '',
            listId: randomId(), // 列表刷新id
            hasShowMap: {}, // 已经展示过的列表
            params: {
                limit: 20,
                offset: 0,
            }
        })
        // 请求参数
        const queryQarams = computed(() => {
            const subscribeList = store.state._signal.subscribeList
            const subscribe = subscribeList.map((item) => {
                return {
                    i: item.i,
                    pe: item.pe,
                    sy: item.sy
                }
            })
            const res = {
                sub: subscribe,
                limit: state.params.limit,
            }
            if (state.params.offset) res.offset = state.params.offset
            return res
        })

        const hasShowMapfn = (id) => {
            state.hasShowMap[id] = true
        }

        // 已经订阅的列表
        const subscribeMap = computed(() => {
            return store.getters['_signal/getSubscribeList']
        })

        const initSignal = () => {
            state.signalId = SignalEvent.onSignal({}, (evt) => {
                evt.forEach((item) => {
                    if (!subscribeMap.value[item.sy + item.i + item.pe]) {
                        // 排除非订阅的信号
                        return
                    }
                    const newItem = {
                        ...item,
                        isNewest: true,
                    }
                    if (state.lastestScrollTop === 0 && state.cacheList.length === 0) {
                        state.list.unshift(newItem)
                    } else {
                        // 往下滚动了则插入到缓存里面
                        state.cacheList.unshift(newItem)
                    }
                })
            })
            // 初始化加载信息
            SignalEvent.handleInit(loadData)
            // 判断子列表是否已更新
            SignalEvent.on('show_signal', hasShowMapfn)
        }

        const resetParams = () => {
            handleTop()
            state.cacheList = []
            state.params.offset = 0
            state.hasShowMap = {}
            state.loadStatus = '' // 清除请求条件
        }

        const uninstallSignal = () => {
            resetParams()
            state.signalId && SignalEvent.offSignal(state.signalId)
            state.signalId = null
            SignalEvent.handleUnload(loadData)
            SignalEvent.off('show_signal', hasShowMapfn)
        }

        const loadData = () => {
            if (state.loadStatus === 'finished') return
            state.loadStatus = 'loading'
            // 是否第一页
            const isFirstPage = state.params.offset === 0
            return querySubscribeSignal(queryQarams.value).then((res) => {
                if (res.check()) {
                    const items = (res.data?.items || [])
                    if (isFirstPage) {
                        state.list = items
                    } else {
                        state.list = [
                            ...state.list,
                            ...items,
                        ]
                    }
                    if (res.data?.offset) {
                        state.params.offset = res.data?.offset
                    }
                    if (items.length < state.params.limit) {
                        state.loadStatus = 'finished'
                    } else {
                        state.loadStatus = ''
                    }
                }
                state.skeletonShow = false
            }).catch(() => {
                state.loadStatus = ''
            })
        }

        const handleTop = () => {
            // 置顶
            listRef.value && listRef.value.scrollToOffset(0)
        }

        const mergeData = () => {
            state.list.unshift(...state.cacheList)
            state.cacheList = []
            handleTop()
        }

        const scroll = () => {
            state.lastestScrollTop = document.documentElement.scrollTop || document.body.scrollTop
            if (state.lastestScrollTop <= 220 && state.cacheList.length > 0) {
                mergeData()
            }
        }

        const scrolltolower = () => {
            SignalEvent.handleInit(loadData)
        }

        // 重新监听和初始化
        const listenSubscribeList = () => {
            uninstallSignal()
            initSignal()
        }

        // 注入点击信号列表方法
        provide('handleSignalItemClick', (item) => {
        })

        onMounted(() => {
            initSignal()
            SignalEvent.on('SubscribeSignal_REFRESH', listenSubscribeList)
        })

        onUnmounted(() => {
            uninstallSignal()
            SignalEvent.off('SubscribeSignal_REFRESH', listenSubscribeList)
        })

        // 刷新页面
        const handleRefresh = (id) => {
            state.listId = id
        }

        // 颜色背景 透明度30%
        const style = computed(() => {
            return {
                risebg: store.state.style.riseColor + '26',
                fallbg: store.state.style.fallColor + '26'
            }
        })

        return {
            itemComponent: Item,
            scroll,
            scrolltolower,
            mergeData,
            listRef,
            handleRefresh,
            style,
            ...toRefs(state),
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/plugins/signal/style/signal.scss';
.mine {
    padding: 20px 0;
    .mine-sticky {
        position: sticky;
        top: 64px;
        background: var(--contentColor);
        z-index: 1;
        :deep {
            .signal-item-th {
                margin: 0;
            }
        }
    }
    :deep {
        .signal-item {
            --risebg: v-bind(style.risebg);
            --fallbg: v-bind(style.fallbg);
        }
        .col.col-option {
            min-width: 270px;
            .van-button {
                // flex: 1;
                &.van-button--block {
                    background-color: transparent;
                    color: var(--primary);
                    height: 30px;
                    line-height: normal;
                }
            }
        }
    }
}
.signal-bg {
    background: var(--contentColor);
    margin-top: 6px;
    :deep {
        .signal {
            padding: 0 12px;
        }
    }
}

</style>

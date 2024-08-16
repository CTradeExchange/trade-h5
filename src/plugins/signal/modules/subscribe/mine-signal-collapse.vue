<template>
    <div v-if='cacheList.length' class='signal-more signal-more-sticky mb-1' @click='mergeData'>
        {{ $t('signal.showSignalLen', [cacheList.length]) }}
    </div>
    <div class='signal-list-y signal-overflow-y'>
        <div v-if='skeletonShow' class='signal-skeleton'>
            <skeleton class='px-3' :limit='20' />
        </div>
        <van-collapse v-else v-model='activeNames' :border='false'>
            <van-collapse-item
                v-for='el in productList'
                :key='el.symbolCode'
                :name="el.symbolCode.replace('/', '')"
                :title="`${el.symbolName} ${$t('signal.signal')}`"
            >
                <empty
                    v-if="list.filter((item) => item.sy === el.symbolCode?.replace('/', '')).length === 0"
                    :description="$t('signal.subscribe.mineSignalEmpty')"
                />
                <signal-item-th v-else :item-type='4' />
                <signal-item
                    v-for="(item, index) in list.filter((item) => item.sy === el.symbolCode?.replace('/', ''))?.slice(0, 6) || []"
                    :key='index'
                    :item-type='4'
                    :show-exipre-style='false'
                    :show-subscribe='false'
                    :signal='item'
                />
            </van-collapse-item>
        </van-collapse>
    </div>
    <el-popover
        v-if='isPC'
        :offset='8'
        placement='left'
        popper-class='MineSignalPopper'
        :popper-style="{ width: '330px' }"
        :virtual-ref='currentReference'
        virtual-triggering
        :visible='currentSignalVisible'
    >
        <signal-item-popover :item='currentSignal' @mouseenter='handleMouse({ target: currentReference })' @mouseleave='handleMouseLeave' />
    </el-popover>
</template>

<script>
import { reactive, ref, onMounted, onUnmounted, toRefs, computed, provide, nextTick, watch } from 'vue'
import Item from '@/plugins/signal/components/signal-virtual-item.vue'
import SignalEvent from '@/plugins/signal/utils/signalEvent'
import { querySubscribeSignal } from '@/plugins/signal/api/index'
import { randomId, isUniapp } from '@/utils/util.js'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { Toast } from 'vant'
import { useI18n } from 'vue-i18n'
import signalItemPopover from '@/plugins/signal/components/signal-item-popover.vue'
import signalItemTh from '@/plugins/signal/components/signal-item-th.vue'
import skeleton from '@/plugins/signal/components/skeleton'
import signalItem from '@/plugins/signal/components/signal-item.vue'
import empty from '@/plugins/signal/components/none-data.vue'

export default {
    components: {
        signalItemPopover,
        signalItemTh,
        skeleton,
        signalItem,
        empty,
    },
    props: {
        scenes: String, // productDetail 代表信号详情页面
    },
    setup (props) {
        const route = useRoute()
        const router = useRouter()
        const store = useStore()
        const { t } = useI18n()
        // 当前虚拟列表
        const listRef = ref(null)
        const activeNames = ref([])
        const state = reactive({
            signalId: null,
            list: [],
            cacheList: [], // 待插入的缓存列表
            isLoading: false, // 数据是否加载中
            loadStatus: 'loading',
            skeletonShow: true, // 骨架
            lastestScrollTop: 0, // 当前滚动位置
            offsetsMap: {}, // offsets对象
            listId: randomId(), // 列表刷新id
            hasShowMap: {}, // 已经展示过的列表
            params: {
                limit: 200,
                offset: 0,
            },
            currentSignalVisible: false,
            currentSignal: {}, // 当前选中的信号
            detailTimer: null, // 弹窗展示时间
            isGaSend: false, // 是否发送ga事件
            diffOffsetHeight: 0, // stickytab到顶部高度
        })

        const currentReference = ref(null)
        const product = computed(() => store.getters.productActived)
        const productList = computed(() => {
            return store.state._quote.productList
                .filter(
                    (item) =>
                        item.tradeType === product.value.tradeType &&
                        store.state._signal.subscribeList.find((el) => el.sy === item.symbolCode?.replace('/', '')),
                )
                .reverse()
        })

        watch(
            () => state.list,
            (value) => {
                if (!activeNames.value.length) {
                    activeNames.value = [...new Set(value.map((item) => item.sy))]
                }
            },
        )

        // 请求参数
        const queryQarams = computed(() => {
            const subscribeList = store.state._signal.subscribeList
            const subscribe = subscribeList.map((item) => {
                return {
                    i: item.i,
                    pe: item.pe,
                    sy: item.sy,
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
                    if (state.lastestScrollTop <= state.diffOffsetHeight && state.cacheList.length === 0) {
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
            state.loadStatus = ''
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
            state.isLoading = true
            // 是否第一页
            const isFirstPage = state.params.offset === 0
            return querySubscribeSignal(queryQarams.value)
                .then((res) => {
                    if (res.check()) {
                        const items = res.data?.items || []
                        if (isFirstPage) {
                            state.list = items
                        } else {
                            state.list = [...state.list, ...items]
                        }
                        if (res.data?.offset) {
                            state.params.offset = res.data?.offset
                        }
                        if (items.length < queryQarams.value.limit) {
                            state.loadStatus = 'finished'
                        }
                    }
                    state.skeletonShow = false
                    state.isLoading = false
                })
                .catch(() => {
                    state.loadStatus = ''
                    state.isLoading = false
                })
        }

        const handleTop = () => {
            // 置顶
            if (props.scenes === 'productDetail') {
                listRef.value && listRef.value.scrollToOffset(0)
            } else {
                const scrollTop = Math.min(state.lastestScrollTop, state.diffOffsetHeight)
                scrollTop && window.scrollTo(0, scrollTop)
            }
        }

        const mergeData = () => {
            state.list.unshift(...state.cacheList)
            state.cacheList = []
            handleTop()
        }

        const scroll = ({ target }) => {
            state.lastestScrollTop = target.scrollTop || document.documentElement.scrollTop || document.body.scrollTop
            // 对比高度
            const diff = state.diffOffsetHeight || 30
            if (state.lastestScrollTop <= diff && state.cacheList.length > 0) {
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

        // 计算列表sticky到顶部距离
        const updateOffsetHeight = () => {
            nextTick(() => {
                if (!window.isPC && props.scenes !== 'productDetail') {
                    state.diffOffsetHeight = document.querySelector('#signalTop')?.offsetHeight || 0
                }
            })
        }

        onMounted(() => {
            initSignal()
            SignalEvent.on('SubscribeSignal_REFRESH', listenSubscribeList)
            updateOffsetHeight()
            SignalEvent.on('hideSignalWelcome', updateOffsetHeight)
        })

        onUnmounted(() => {
            uninstallSignal()
            SignalEvent.off('SubscribeSignal_REFRESH', listenSubscribeList)
            SignalEvent.off('hideSignalWelcome', updateOffsetHeight)
        })

        // 刷新页面
        const handleRefresh = (id) => {
            state.listId = id
        }

        // 颜色背景 透明度30%
        const style = computed(() => {
            return {
                risebg: store.state.style.riseColor + '26',
                fallbg: store.state.style.fallColor + '26',
            }
        })

        // 注入点击信号列表方法
        provide('handleSignalItemClick', (item) => {
            // pc行情详情页面显示弹窗
            // 切换当前产品
            const product = store.getters['_signal/getSignalProduct'](item.sy)
            if (product) {
                if (product.symbolKey !== `${route.query.symbolId + '_' + route.query.tradeType}`) {
                    // app切换产品
                    if (isUniapp && window.uni) {
                        window.uni.postMessage({
                            data: {
                                action: 'message',
                                type: 'Product',
                                params: {
                                    tradeType: product.tradeType,
                                    symbolId: product.symbolId,
                                    symbolName: product.symbolName,
                                    priceDigits: product.priceDigits,
                                    symbolCode: product.symbolCode,
                                },
                            },
                        })
                        return false
                    }
                    // 替换最新产品
                    store.commit('_quote/Update_productActivedID', `${product.symbolId}_${product.tradeType}`)
                    Toast({
                        message: t('signal.subscribe.swtichSymbolSucc', [product.symbolName]),
                    })
                    router.replace({
                        query: {
                            ...route.query,
                            name: product.symbolName.replace(/ /g, '_'),
                            symbolId: product.symbolId,
                            tradeType: product.tradeType,
                        },
                    })
                }
            } else {
                Toast({
                    message: t('signal.noTradeProduct'),
                })
            }
            return false
        })

        const handleMouse = ({ target }, item) => {
            if (!target) {
                return handleMouseLeave()
            }
            if (state.detailTimer) {
                clearTimeout(state.detailTimer)
            }
            if (target && document.contains(target) && item) {
                state.detailTimer = setTimeout(() => {
                    state.currentSignal = item
                    currentReference.value = target
                    nextTick(() => {
                        state.currentSignalVisible = true
                    })
                }, 350)
            }
        }

        const handleMouseLeave = () => {
            if (state.detailTimer) {
                clearTimeout(state.detailTimer)
            }
            state.detailTimer = setTimeout(() => {
                state.currentSignalVisible = false
            }, 100)
        }

        // 注入mouseenter
        provide('handleSignalItemMouse', (event, item) => {
            handleMouse(event, item)
        })

        // 埋点我的信号页面有订阅记录的人
        watch(
            [() => store.state._signal.isLoadSubscribe, () => store.state._signal.subscribeList, () => state.isGaSend],
            (newVal) => {
                if (newVal[0] && newVal[1].length > 0 && newVal[2] === false) {
                    state.isGaSend = true
                }
            },
            { immediate: true },
        )

        return {
            itemComponent: Item,
            scroll,
            scrolltolower,
            mergeData,
            listRef,
            handleRefresh,
            currentReference,
            style,
            ...toRefs(state),
            isPC: window.isPC,
            handleMouse,
            handleMouseLeave,
            activeNames,
            productList,
        }
    },
}
</script>

<style lang="scss">
.MineSignalPopper.el-popover.el-popper {
    background: var(--contentColor);
    border-radius: 8px;
    padding: 12px;
    margin: 0 auto;
    .el-popper__arrow::before {
        border-color: var(--contentColor);
        background: var(--contentColor);
    }
}
</style>

<style lang="scss" scoped>
@import '@/plugins/signal/style/signal.scss';
.signal-more {
    margin-top: 0;
    position: sticky;
    top: calc(var(--nav-height) + rem(80px));
    z-index: 1;
}
.signal-list-y {
    :deep {
        .van-cell:after,
        .van-collapse-item--border:after {
            left: 0;
            right: 0;
        }
        .van-collapse-item__title {
          padding: 12px;
        }

        .van-collapse-item {
            .signal-item {
                color: var(--color);
            }
            .signal-item-th {
                padding: 0 12px;
                margin-bottom: 4px;
                color: var(--minorColor);
            }
            .van-collapse-item__content {
                padding: 0;
            }
        }
        .van-cell__title {
            font-weight: bold;
            color: var(--color);
        }

        .signal-item {
            --risebg: v-bind(style.risebg);
            --fallbg: v-bind(style.fallbg);
        }
        .none-data {
            background-color: var(--contentColor);
            margin-top: 6px;
            flex: 1;
        }
    }
}
</style>

<template>
    <div class='signal-tab'>
        <div class='signal-tab-warp'>
            <div class='tab-list'>
                <classify-list
                    v-model='classifyValue'
                    :list='classifylist'
                    :show-all='true'
                    show-arrow
                    :style-type='1'
                    @input='handleClassifyValue'
                />
            </div>
            <popover
                :offset='[18, 8]'
                placement='top-end'
                :text='$t("signal.filter")'
                :touch-disabled='true'
            >
                <template #reference>
                    <div @click='handleOpen'>
                        <van-icon class='leading-5 ml-1' name='filter-o' size='18' />
                    </div>
                </template>
            </popover>
        </div>
        <div v-if='scenes === "productDetail" && productName' class='signal-tab-link'>
            <div class='signal-tab-symbol'>
                {{ productName + ' ' + $t('signal.signal') }}
            </div>
        </div>
        <div v-if='cacheList.length' class='signal-more' @click='mergeData'>
            {{ $t('signal.showSignalLen', [cacheList.length]) }}
        </div>
        <signal-item-th :item-type='formatItemType' />
    </div>
    <div class='signal-list-y signal-overflow-y' :class="{ 'h-100':!isPC }">
        <signal-list
            :item-type='formatItemType'
            :limit='params.limit'
            :list='list'
            :skeleton-show='skeletonShow'
            @on-refresh='handleRefresh'
        >
            <template #noData>
                <van-empty :description="$t('signal.subscribeNowTips')" image-size='100'>
                    <van-button class='w-50' size='small' type='primary' @click='handleSubscribe'>
                        {{ $t('signal.subscribeNow') }}
                    </van-button>
                </van-empty>
            </template>
            <!-- 信号引导页占位栏 -->
            <div
                v-if='list.length'
                v-show='driverInstance && driverInstance.open'
                id='four-element-driver'
                class='signal-item-blank signal-item-blank-h5'
            >
                <signal-item
                    :item-type='formatItemType'
                    :signal='list[0]'
                />
            </div>

            <virtual-list
                :key='listId'
                ref='listRef'
                class='signal-overflow-y signal-warp signal-search-list'
                :class='formatItemType === 3 ? "" : "signal-warp-bg"'
                :data-component='itemComponent'
                :data-key="'id'"
                :data-sources='list'
                :estimate-size='30'
                :extra-props='{
                    isVirtualItem: true,
                    itemType: formatItemType,
                    hasShowMap,
                    showSubscribe: false,
                }'
                :item-class="`list-item ${formatItemType === 3 ? 'list-item-block': ''}`"
                :keeps='2000'
                :page-mode='true'
                root='.signal-search-list'
                @mouseleave='handleMouseLeave'
                @scroll='scroll'
                @tobottom='scrolltolower'
            >
                <template #footer>
                    <loading-more :status='loadStatus' />
                </template>
            </virtual-list>
        </signal-list>
    </div>
    <filter-drawer
        ref='filterDrawerRef'
        @confirm='handleFilter'
    />

    <ElPopover
        v-if='isPC'
        :offset='8'
        placement='left'
        popper-class='MineSignalPopper'
        :popper-style='{ width: "330px" }'
        :virtual-ref='currentReference'
        virtual-triggering
        :visible='currentSignalVisible'
    >
        <signal-item-popover
            :item='currentSignal'
            @mouseenter='handleMouse({ target: currentReference })'
            @mouseleave='handleMouseLeave'
        />
    </ElPopover>
</template>

<script>
// 通用信号筛选组件
import { computed, ref, toRefs, reactive, onMounted, onUnmounted, watch, provide, nextTick, inject } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import classifyList from '@/plugins/signal/components/classify-list'
import SignalEvent from '@/plugins/signal/utils/signalEvent'
import signalList from '@/plugins/signal/components/signal-list.vue'
import virtualList from '@/components/virtual-list'
import Item from '@/plugins/signal/components/signal-virtual-item.vue'
import loadingMore from '@/plugins/signal/components/loading-more.vue'
import signalHook from '@/plugins/signal/hooks/signal'
import filterDrawer from '@/plugins/signal/components/filter-drawer.vue'
import signalItemTh from '@/plugins/signal/components/signal-item-th.vue'
import signalItemPopover from '@/plugins/signal/components/signal-item-popover.vue'
import signalItem from '@/plugins/signal/components/signal-item.vue'
import mitt from '@/utils/mitt'

import { randomId, isUniapp } from '@/utils/util.js'
import popover from '@/components/popover'
import { ElPopover } from 'element-plus'

export default {
    components: {
        classifyList,
        signalList,
        virtualList,
        loadingMore,
        filterDrawer,
        signalItemTh,
        popover,
        signalItemPopover,
        signalItem,
        ElPopover
    },
    props: {
        signalType: String, // 默认筛选条件
        itemType: Number, // 列表展示方式
        // 额外的请求参数
        extraProps: {
            type: Object,
            default: () => {},
        },
        // 是否展示标题
        showThead: {
            type: Boolean,
            default: false,
        },
        // 场景
        scenes: {
            type: String,
            default: '' // productDetail 代表信号详情页面
        }
    },
    emits: ['subscribeSignal'],
    setup (props, { emit }) {
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const listRef = ref(null) // 虚拟列表
        const filterDrawerRef = ref(null) // 筛选列表

        const state = reactive({
            classifylist: [],
            classifyValue: '', // 筛选值
            fieldName: '', // 字段名
            // 请求参数
            params: {
                offset: 0,
                limit: 30, // 页码
            },
            isLoading: false, // 数据是否加载中
            loadStatus: 'loading',
            list: [], // 数据列表
            cacheList: [], // 待插入的缓存列表
            signalId: null, // 订阅id,
            lastestScrollTop: 0, // 当前滚动位置
            skeletonShow: true, // 骨架
            listId: randomId(),
            currentSignalVisible: false,
            currentSignal: {}, // 当前选中的信号
            hasShowMap: {},
            showPopover: false,
            isPC: window.isPC,
            detailTimer: null, // 弹窗展示时间
            diffOffsetHeight: 0, // stickytab到顶部高度
        })

        const currentReference = ref(null)

        const { saveSignalParams, saveDetailParams, getAcademyIndicatorUrl } = signalHook()

        const formatItemType = computed(() => {
            // 如果有传参数则不切换
            if (props.itemType) {
                return props.itemType
            }
            return (store.state._signal.listStyle === 0) ? 3 : 0
        })
        // 用户信息
        const customerInfo = computed(() => store.state._user.customerInfo)

        // 是否真实账户
        const isRealAccount = computed(() => {
            return customerInfo.value?.companyType && customerInfo.value.companyType === 'real'
        })

        const handleTop = () => {
            // 置顶
            if (props.scenes === 'productDetail') {
                listRef.value && listRef.value.scrollToOffset(0)
            } else {
                // 默认当前滚动条，但如果有无限加载列表的话需要置顶
                const scrollTop = Math.min(state.lastestScrollTop, state.diffOffsetHeight)
                scrollTop && window.scrollTo(0, scrollTop)
            }
        }

        // 展示类型变化需置顶
        watch(() => formatItemType.value, (newVal) => {
            handleTop()
        })

        // 监听其他参数变化
        watch(() => props.extraProps, (newVal) => {
            uninstallSignal()
            initSignal()
        }, { deep: true })

        const tabParams = computed(() => {
            // 详情页筛选条件
            let res = {}
            if (props.scenes === 'productDetail') {
                res = store.state._signal.detailTabSignalParams
            } else {
                res = store.state._signal.quoteTabSignalParams[props.signalType]
            }
            return res || {}
        })

        const config = computed(() => {
            return store.state._signal.config
        })

        const initParams = () => {
            switch (props.signalType) {
                case 'indicator':
                    // 按指标看
                    state.fieldName = 'i'
                    state.classifylist = config.value.indicator || []
                    break
                case 'diretcion':
                    // 按买卖建议
                    state.fieldName = 'a'
                    state.classifylist = config.value.action || []
                    break
                case 'period':
                    // 按周期
                    state.fieldName = 'pe'
                    state.classifylist = config.value.period || []
                    break
                case 'signal':
                    // 按信号看
                    state.fieldName = 'si'
                    state.classifylist = config.value.signal || []
                    break
            }
            // 初始化参数
            if (tabParams.value.hasOwnProperty(state.fieldName)) {
                state.classifyValue = tabParams.value[state.fieldName]
            } else if (route.query.value) {
                state.classifyValue = route.query.value
            }
            state.params = {
                ...state.params,
                ...tabParams.value,
                [state.fieldName]: state.classifyValue
            }
        }

        const resetParams = () => {
            handleTop()
            state.cacheList = []
            state.params.offset = 0
            state.loadStatus = 'loading'
        }

        // 快捷筛选
        const handleClassifyValue = (data) => {
            handleFilter({
                [state.fieldName]: data
            })
        }

        // 打开过滤器
        const handleOpen = () => {
            filterDrawerRef.value && filterDrawerRef.value.open(props.signalType, state.params)
        }

        const hasShowMapfn = (id) => {
            state.hasShowMap[id] = true
        }

        // 过滤
        const handleFilter = (data) => {
            state.params = {
                ...state.params,
                ...data,
            }
            // 更新当前条件
            if (props.scenes === 'productDetail') {
                saveDetailParams(state.params)
            } else {
                saveSignalParams(props.signalType, state.params)
            }
            uninstallSignal()
            initSignal()
        }

        const initSignal = () => {
            initParams()
            state.signalId = SignalEvent.onSignal({
                ...state.params,
                ...props.extraProps,
            }, (evt) => {
                evt.forEach((item) => {
                    const newItem = {
                        ...item,
                        isNewest: true
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
            SignalEvent.on('show_signal', hasShowMapfn)
        }

        const uninstallSignal = () => {
            resetParams()
            state.signalId && SignalEvent.offSignal(state.signalId)
            state.signalId = null
            SignalEvent.handleUnload(loadData)
            SignalEvent.off('show_signal', hasShowMapfn)
        }

        const mergeData = () => {
            state.list.unshift(...state.cacheList)
            state.cacheList = []
            handleTop()
        }

        const loadData = () => {
            if (state.loadStatus === 'finished' || state.isLoading || !props.extraProps?.sy) return
            state.isLoading = true
            const { offset, ...rest } = state.params
            const isFirstPage = offset === 0
            if (isFirstPage) {
                state.skeletonShow = true
            }
            const params = isFirstPage ? rest : state.params
            return store.dispatch('_signal/queryQuotapIndicatorByCondition', {
                ...params,
                ...props.extraProps,
            }).then((res) => {
                // 校验当前条件是否一致
                if (res.check() && params[state.fieldName] === state.params[state.fieldName]) {
                    const items = res.data?.items || []
                    if (isFirstPage) {
                        state.list = items
                    } else {
                        state.list = [
                            ...state.list,
                            ...items,
                        ]
                    }
                    state.params.offset = res.data.offset
                    if (isFirstPage && items.length === 0) {
                        state.loadStatus = ''
                    } else if (items.length < state.params.limit) {
                        state.loadStatus = 'finished'
                    }
                }
            }).finally(() => {
                state.skeletonShow = false
                state.isLoading = false
            })
        }

        const scroll = ({ target }) => {
            state.lastestScrollTop = target.scrollTop || document.documentElement.scrollTop || document.body.scrollTop
            // 对比高度
            const diff = state.diffOffsetHeight || 30
            // 滚动过程中关闭详情弹窗
            state.currentSignalVisible = false
            if (state.lastestScrollTop <= diff && state.cacheList.length > 0) {
                mergeData()
            }
        }

        const scrolltolower = () => {
            SignalEvent.handleInit(loadData)
        }

        // 指标教学
        const teachURL = computed(() => getAcademyIndicatorUrl() + `${isUniapp ? '?isUniapp=true' : ''}`)
        const productName = computed(() => {
            return store.getters['_signal/getSignalProduct'](props.extraProps.sy)?.symbolName
        })

        // 刷新页面
        const handleRefresh = (id) => {
            state.listId = id
        }

        // 颜色背景 透明度25%
        const style = computed(() => {
            return {
                risebg: store.state.style.riseColor + '26',
                fallbg: store.state.style.fallColor + '26'
            }
        })

        // 注入点击信号列表方法
        provide('handleSignalItemClick', (item) => {
            // pc行情详情页面显示弹窗
            if (formatItemType.value === 4 && window.isPC) {
                return false
            }
        })

        // 点击列表订阅事件
        provide('handleSignalSubscribeClick', (item) => {})

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

        // 判断是否需要预设
        const driverInstance = inject('driverInstance', null)
        // 刷新引导页位置
        watch(() => state.cacheList, (v) => {
            if (driverInstance?.value?.driver) {
                setTimeout(() => {
                    driverInstance.value.driver.onResize()
                })
            }
        }, { deep: true })

        // 计算列表sticky到顶部距离
        const updateOffsetHeight = () => {
            nextTick(() => {
                if (!window.isPC && props.scenes !== 'productDetail') {
                    state.diffOffsetHeight = document.querySelector('#signalTop')?.offsetHeight || 0
                }
            })
        }

        // 订阅
        const handleSubscribe = () => {
            // 订阅
            if (isUniapp && window.uni) {
                window.uni.postMessage({
                    data: {
                        action: 'message',
                        type: 'handleSubscribe',
                    },
                })
                return
            }
            if (!customerInfo.value) {
                router.push({
                    name: 'Login',
                    query: {
                        back: route.fullPath,
                    },
                })
            } else if (isRealAccount.value) {
                emit('subscribeSignal', state.classifyValue)
            } else {
                mitt.emit('SwitchAccount', 'real')
            }
        }

        onMounted(() => {
            initSignal()
            updateOffsetHeight()
            SignalEvent.on('hideSignalWelcome', updateOffsetHeight)
        })
        onUnmounted(() => {
            uninstallSignal()
            SignalEvent.off('hideSignalWelcome', updateOffsetHeight)
        })

        return {
            itemComponent: Item,
            scroll,
            scrolltolower,
            mergeData,
            listRef,
            formatItemType,
            handleClassifyValue,
            filterDrawerRef,
            handleOpen,
            handleFilter,
            teachURL,
            handleRefresh,
            style,
            productName,
            currentReference,
            handleMouse,
            handleMouseLeave,
            driverInstance,
            ...toRefs(state),
            isPC: window.isPC,
            handleSubscribe,
        }
    }
}

</script>

<style  lang="scss">
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
.signal-tab {
    position: sticky;
    top: calc(var(--nav-height) + rem(160px));
    z-index: 1;
    :deep {
      .signal-item-th {
        padding: 0;
      }
    }
}
.signal-bg {
    background: var(--contentColor);
    margin-top: 6px;
    flex: 1;
    overflow: hidden;
    :deep {
        .signal {
            padding: 0 12px;
        }
    }
}
.signal-list-y {
    :deep {
        .van-empty {
            .van-empty__description {
                padding: 0;
            }
        }
    }
}
.signal-warp {
    :deep {
        .list-item-block {
            margin-bottom: 10px;
            padding: 0 12px;
            .signal-item {
                padding: 0;
            }
        }
        .signal-item {
            --risebg: v-bind(style.risebg);
            --fallbg: v-bind(style.fallbg);
        }
    }
    @media (min-width: 768px) {
        padding: 0;
        margin: 0 12px;
    }
}
</style>

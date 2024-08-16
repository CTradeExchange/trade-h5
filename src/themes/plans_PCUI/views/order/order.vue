<template>
    <div v-if='!$store.state._user.switchAccounting' class='page-wrap'>
        <router-view />
        <div class='page-content'>
            <productSearchPopup />
            <div class='content'>
                <Splitpanes
                    ref='splitpanes'
                    class='default-theme'
                    :class="{ 'hide-splitpanes__splitter': moduleSize === 0 }"
                    :dbl-click-splitter='false'
                    :push-other-panes='false'
                    @resize='moduleSizeResize'
                >
                    <Pane class='pane-page' :max-size='100 - moduleMiniSize' :size='100 - moduleSize'>
                        <Splitpanes
                            ref='tradePanes'
                            :class="{
                                'hide-splitpanes__splitter': quickTransactionSize === 0,
                            }"
                            :dbl-click-splitter='false'
                            :push-other-panes='false'
                            @mousedown='splitpanesMouseDown'
                            @mouseup='splitpanesMouseUp'
                            @resize='quickTransactionSizeResize'
                        >
                            <Pane class='pane-page' :max-size='100 - quickTransactionMiniSize' :size='100 - quickTransactionSize'>
                                <div class='w-full'>
                                    <Splitpanes
                                        :dbl-click-splitter='false'
                                        horizontal
                                        @mousedown='splitpanesMouseDown'
                                        @mouseup='splitpanesMouseUp'
                                        @resized='useRecordPanesResize'
                                    >
                                        <Pane class='pane-page chart-pane flex-col' :size='100 - useRecordSize'>
                                            <productInfo />
                                            <!-- 图表 -->
                                            <chart />
                                        </Pane>
                                        <Pane v-if='useRecordSize' class='pane-page orders-record-pane' :size='useRecordSize'>
                                            <!-- 委托/记录/资产 -->
                                            <div class='orders-wrap overflow-hidden'>
                                                <userRecord />
                                            </div>
                                        </Pane>
                                    </Splitpanes>
                                </div>
                            </Pane>

                            <Pane
                                class='pane-page pane-page-quickTransaction'
                                :max-size='50'
                                :min-size='quickTransactionMiniSize'
                                :size='quickTransactionSize'
                            >
                                <div class='w-full bg-contentColor'>
                                    <QuickTransaction :show-close='false' @onclose="pane.panel = ''" />
                                </div>
                            </Pane>
                        </Splitpanes>
                    </Pane>
                    <!-- 深度交易历史列表，收藏，钱包等组件列表 -->
                    <Pane class='pane-page pane-page-module' :max-size='50' :min-size='moduleMiniSize' :size='moduleSize'>
                        <paneList v-model:module='pane.module' />
                    </Pane>
                </Splitpanes>
            </div>
            <toolbar v-model:pane='pane' />
        </div>
    </div>
</template>

<script>
import { onMounted, reactive, toRefs, watch, computed, onBeforeUnmount, ref } from 'vue'
import chart from '@/components/chart/index.vue'
import { useRouter, useRoute } from 'vue-router'
import { isEmpty, localGetJSON } from '@/utils/util'
import { useStore } from 'vuex'
import { toolHooks } from '@planspc/hooks/handicap'
import userRecord from './pages/userRecord'
import { MsgSocket, QuoteSocket } from '@/plugins/socket/socket'
import { Splitpanes, Pane } from 'splitpanes'
import QuickTransaction from '@/themeCommon/components/quickTransaction/quickTransaction.vue'
import toolbar from './pages/toolbar.vue'
import paneList from './pages/paneList.vue'
import productInfo from './pages/productInfo.vue'
import productSearchPopup from '@/themeCommon/components/productSearch/productSearchPopup.vue'
import { useWindowSize } from '@vueuse/core'
import useGetTradeExchangeRate from '@/hooks/trade/useGetTradeExchangeRate'
import { pow, } from '@/utils/calculation'

export default {
    components: {
        Splitpanes,
        Pane,
        chart,
        userRecord,
        QuickTransaction,
        toolbar,
        paneList,
        productSearchPopup,
        productInfo
    },
    setup () {
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const { dealModeShowMap } = toolHooks()
        useGetTradeExchangeRate()

        const { tradeType, symbolId } = route.query
        const customerInfo = computed(() => store.state._user.customerInfo)
        const product = computed(() => store.getters.productActived)
        /** 最外层面板容器 */
        const splitpanes = ref(null)
        /** 左侧交易切换面板 */
        const tradePanes = ref(null)

        /** 交易面板默认大小 */
        const getQuickTransactionSize = (module) => parseInt((350 / (document.body.offsetWidth - (module ? 340 : 0) - 16)) * 100)

        /** 自选面板默认大小 */
        const getModuleSize = () => parseInt((350 / (document.body.offsetWidth - 16)) * 100)

        const state = reactive({
            // 底部交易账户层级
            bottomLevel: 197,
            useRecordSize: 30, // 面板初始高度
            pane: {
                panel: '', // 交易面板
                module: '', // 模块
            },
            /** 交易面板pane宽度 */
            quickTransactionSize: getQuickTransactionSize(),
            quickTransactionMiniSize: getQuickTransactionSize(),
            /** 右侧自选模块pane宽度 */
            moduleSize: 0,
            moduleMiniSize: getModuleSize(),
        })

        if (isEmpty(product.value) && !tradeType && !symbolId) {
            router.push('/')
        }

        /** 处理拖动的时候，鼠标划入图表页面，导致拖动异常 */
        const splitpanesMouseDown = () => {
            const chartContent = document.querySelector('.tv-chart-container')
            if (chartContent) {
                chartContent.style['pointer-events'] = 'none'
            }
        }

        /** 处理拖动的时候，鼠标划入图表页面，导致拖动异常 */
        const splitpanesMouseUp = () => {
            const chartContent = document.querySelector('.tv-chart-container')
            if (chartContent) {
                chartContent.style['pointer-events'] = 'initial'
            }
        }

        /** 持仓列表size变化 */
        const useRecordPanesResize = (value) => {
            const size = value[1]?.size
            size && localStorage.setItem('__USERECORD_SIZE__', size)
        }

        /** 快捷交易面板拖动 */
        const quickTransactionSizeResize = (value) => {
            state.quickTransactionSize = value[1]?.size
        }

        /** 自选面板拖动 */
        const moduleSizeResize = (value) => {
            state.moduleSize = value[1]?.size
        }

        /** 交易面板默认大小 */
        watch(
            () => state.pane.panel,
            (value) => {
                if (value !== 'trade') {
                    // 关闭交易面板
                    state.quickTransactionSize = 0
                } else {
                    state.quickTransactionSize = getQuickTransactionSize(state.pane.module)
                }
            },
            { immediate: true },
        )

        /** 自选面板默认大小 */
        watch(
            () => state.pane.module,
            (value) => {
                if (!value) {
                    // 关闭自选模块面板
                    state.moduleSize = 0
                } else {
                    state.moduleSize = state.moduleSize || getModuleSize()
                }
                if (state.pane.panel) {
                    state.quickTransactionSize = getQuickTransactionSize(state.pane.module)
                }
            },
        )

        const { width, height } = useWindowSize()
        /** 窗口大小改变恢复默认设置 */
        watch(
            () => width.value,
            () => {
                if (state.pane.panel === 'trade') {
                    const size = getQuickTransactionSize(state.pane.module)
                    state.quickTransactionSize = size
                    state.quickTransactionMiniSize = size
                }
                if (state.pane.module) {
                    const size = getModuleSize()
                    state.moduleSize = size
                    state.moduleMiniSize = size
                }
            },
        )

        onMounted(() => {
            state.moduleMiniSize = getModuleSize()
            state.quickTransactionMiniSize = getQuickTransactionSize(state.pane.module)
        })

        watch(
            () => product.value?.tradeType,
            (newval, oldval) => {
                if (!isEmpty(customerInfo.value) && parseInt(newval) !== parseInt(oldval)) {
                    if ([3, 5, 9].includes(parseInt(newval))) {
                        store.dispatch('_user/queryCustomerAssetsInfo', {
                            tradeType: parseInt(newval),
                        })
                    }
                }
            },
            { immediate: true },
        )

        watch(
            () => product.value,
            () => {
                const curDigits = pow(0.1, product.value?.symbolDigits)
                QuoteSocket.deal_subscribe(symbolId, 1, curDigits, product.value.tradeType, 5)
            },
            { immediate: true },
        )

        watch(
            () => [product.value?.enableDepthTrade, state.pane.module],
            (value) => {
                if (value[0] === undefined) return
                // 如果产品不展示盘口，则直接展示自选列表
                if (state.pane.module === 'offer' && value[0] !== 2) {
                    state.pane.module = 'signal'
                }
            },
            { immediate: true }
        )

        watch(
            [() => route.query?.symbolId, () => route.query?.tradeType],
            (newVal) => {
                if (!newVal[0] || !newVal[1]) return
                /** 找不到产品，没有权限 */
                if (!store.state._quote.productMap[newVal.join('_')]) {
                    router.replace('/')
                }
                // 缓存每次切换的产品
                store.commit('_quote/Update_lastProductActivedID', newVal.join('_'))
                store.commit('_quote/Update_productActivedID', newVal.join('_'))
            },
            { immediate: true },
        )

        const originTitle = document.title
        // 价格跳动修改页面title
        const unWatchPrice = watch(
            () => product.value?.cur_price,
            (newval, oldval) => {
                if (newval && newval !== 'NaN') {
                    document.title = `${newval} | ${product.value.symbolCode} | ${originTitle}`
                }
            },
            { immediate: true },
        )

        onMounted(() => {
            // 初始化订单面板高度
            const content = document.querySelector('.content')
            const defaultSize = localStorage.getItem('__USERECORD_SIZE__')

            if (content?.offsetHeight) {
                const offsetHeight = content.offsetHeight
                if (defaultSize) {
                    // 有缓存，使用用户缓存
                    state.useRecordSize = defaultSize
                } else {
                    // 图表的高度等于屏幕高度减去只显示一条的高度
                    const size = (500 / offsetHeight) * 100
                    state.useRecordSize = 100 - size
                }
            }

            // 初始化面板
            const defaultToolBarPanel = localGetJSON('ToolBarPanelStorage', {})
            // 没有缓存，使用默认面板
            state.pane.panel = defaultToolBarPanel?.panel === undefined ? 'trade' : defaultToolBarPanel.panel
            state.pane.module = defaultToolBarPanel?.module === undefined ? 'signal' : defaultToolBarPanel.module
            if (state.pane.module === 'funds' && !customerInfo.value) {
                state.pane.module = 'signal'
            }

            // 第一次进入页面禁止切换面板宽度变化动画
            setTimeout(() => {
                const panes = document.querySelectorAll('.splitpanes__pane')
                if (panes) {
                    panes.forEach((item) => {
                        item.style.transition = 'width .2s ease-out'
                    })
                }
            })
        })

        onBeforeUnmount(() => {
            unWatchPrice()
            document.title = originTitle
            // 取消订阅
            QuoteSocket.cancel_subscribe()
            MsgSocket.cancelSubscribeAsset()
        })

        return {
            product,
            tradeType,
            dealModeShowMap,
            ...toRefs(state),
            customerInfo,
            splitpanes,
            tradePanes,
            useRecordPanesResize,
            splitpanesMouseDown,
            splitpanesMouseUp,
            quickTransactionSizeResize,
            moduleSizeResize,
            height,
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    position: relative;
    padding: 8px 0 5px 5px;
    font-size: 14px;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 68px);
    .page-content {
        display: flex;
    }
    .chart-pane {
        min-height: 420px;
    }
    .orders-record-pane {
        min-height: 100px;
    }
    .content {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: stretch;
        margin-right: 8px;
        width: calc(100% - 78px);
        height: calc(100vh - 77px);
        > div {
            margin-right: 5px;
            &:last-child {
                margin-right: 0;
            }
        }
    }
    .orders-wrap {
        background: var(--contentColor);
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
    }

    .pane-page {
        display: flex;
        position: relative;
        border-radius: 8px;
        background-color: transparent;
    }
    :deep {
        .handicap,
        .deal {
            background: var(--contentColor);
        }
        .splitpanes--horizontal > .splitpanes__splitter {
            background-color: var(--bgColor);
            border: none;
            height: 8px;
        }
        .splitpanes--vertical > .splitpanes__splitter {
            background-color: var(--bgColor);
            border: none;
            width: 8px;
        }
        .splitpanes__pane {
            transition: none;
        }
        .hide-splitpanes__splitter > .splitpanes__splitter {
            display: none;
            border: none;
        }
        .van-popover {
            z-index: 60 !important;
        }
    }
}
@media screen and (max-height: 720px) {
    .page-wrap {
        height: auto;
        .orders-record-pane {
            min-height: 75vh;
        }
        .content {
            height: auto;
            max-height: calc(75vh + 470px);
            min-height: calc(75vh + 420px);
        }
    }
}
</style>

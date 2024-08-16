<template>
    <div class='product-detail-signal'>
        <template v-if='!pageType'>
            <Splitpanes ref='splitpanesRef' class='default-theme' :dbl-click-splitter='false' horizontal :push-other-panes='false'>
                <Pane class='pane-page pane-page-module' :size='topPaneSize'>
                    <div class='h-full flex flex-col overflow-hidden bg-contentColor real-time-rignal'>
                        <div class='header'>
                            {{ $t('signal.subscribe.realTimeSignal') }}
                        </div>
                        <div class='signal-list flex-1'>
                            <signaSearchlList
                                :extra-props='params'
                                :item-type='4'
                                :show-thead='true'
                                signal-type='indicator'
                                @subscribe-signal='subscribeSignal'
                            />
                        </div>
                    </div>
                </Pane>

                <Pane class='pane-page pane-page-module' :size='100 - topPaneSize'>
                    <div class='flex-1 flex flex-col overflow-hidden bg-contentColor latest-signal h-full'>
                        <div class='header flex justify-space-between items-center'>
                            <span>{{ $t('signal.latestSignals') }}</span>
                            <div v-if='customerInfo' class='flex items-center'>
                                <img
                                    class='w-8 h-8 cursor-pointer p-2 bg-primaryLight rounded-xs mr-4'
                                    src='/images/signal/add-signal.svg'
                                    @click='subscribeSignal'
                                />
                                <img
                                    class='w-8 h-8 cursor-pointer p-2 bg-primaryLight rounded-xs'
                                    src='/images/signal/manage-signal.svg'
                                    @click="pageType = 'manageMySignals'"
                                />
                            </div>
                        </div>
                        <div class='signal-list'>
                            <signal-mine
                                scenes='productDetail'
                                @manageMySignals="pageType = 'manageMySignals'"
                                @subscribe-signal='subscribeSignal'
                            />
                        </div>
                    </div>
                </Pane>
            </Splitpanes>
        </template>
        <operation-subscribe v-else-if="pageType === 'subscribe'" :payload='{ ...params,i }' type='add' @close='pageType = false' />
        <manageMySignals v-else @close='pageType = false' />
    </div>
</template>

<script>
import { computed, reactive, watch, toRefs, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { formatScFromCats } from '@/plugins/signal/utils/util'
import useSubscribe from '@/plugins/signal/hooks/subscribe'
import signaSearchlList from '@/plugins/signal/components/signal-search-list.vue'
import signalMine from '@/plugins/signal/modules/signal-mine.vue'
import operationSubscribe from '@/plugins/signal/modules/subscribe/operation-subscribe.vue'
import { localGet, localSet } from '@/utils/util'
import useSignal from '@/plugins/signal/hooks/signal'
import manageMySignals from './subscribe/manage-my-signals.vue'
import { Splitpanes, Pane } from 'splitpanes'

const Token = 'ProductDetailSignalTabValue'

export default {
    components: {
        signaSearchlList,
        signalMine,
        operationSubscribe,
        manageMySignals,
        Splitpanes,
        Pane,
    },
    props: {
        symbolCode: String,
        symbolName: String,
    },
    setup (props) {
        const store = useStore()
        const state = reactive({
            // 当前选择的分类
            tabValue: localGet(Token) || 'real',
            params: {
                sc: '',
                sy: '',
            },
            // 当前选择的指标分类
            i: '',
            pageType: false,
        })

        const DEFAULT_HEIGHT = 500
        const topPaneSize = ref(50)
        const splitpanesRef = ref()

        const setLeftPaneSize = () => {
            const height = splitpanesRef.value.$el.clientHeight
            topPaneSize.value = (DEFAULT_HEIGHT / height) * 100
        }

        onMounted(() => {
            setLeftPaneSize()
        })

        const { unread, initSignal, uninstallSignal } = useSubscribe()
        // 初始化上一次订阅的弹窗
        const { initSubscribeConfirm } = useSignal()
        const customerInfo = computed(() => store.state._user.customerInfo)

        initSubscribeConfirm()

        watch(
            () => props.symbolCode,
            (newVal) => {
                if (newVal) {
                    state.params.sy = formatScFromCats(newVal)
                }
            },
            { immediate: true },
        )

        // 更新红点
        watch(
            () => state.tabValue,
            (newVal) => {
                // 切换到其他页面时监听订阅信号
                uninstallSignal()
                if (state.tabValue !== 'mine') {
                    initSignal()
                }
                // 缓存tab值
                localSet(Token, newVal)
            },
            { immediate: true },
        )

        const classifylist = computed(() => {
            return store.state._signal.config.indicator || []
        })

        const subscribeSignal = (i) => {
            state.pageType = 'subscribe'
            if (typeof i === 'string') {
                const iList = i.split(',')
                state.i = iList[iList.length - 1]
            }
        }

        return {
            ...toRefs(state),
            classifylist,
            unread,
            subscribeSignal,
            customerInfo,
            topPaneSize,
            splitpanesRef,
        }
    },
}
</script>

<style lang="scss" scoped>
.product-detail-signal {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background-color: var(--contentColor);

    .real-time-rignal {
        border-radius: 8px;
    }
    .latest-signal {
        border-radius: 8px;
    }
    .header {
        padding: 20px 12px 0px 12px;
        height: 62px;
        font-size: 16px;
        font-weight: 700;
        background: url('../../../../public/images/signal/signal-tab-bg.png') no-repeat;
    }

    .real-signal-list {
        :deep {
            .signal-item-th {
                padding: 0 !important;
            }
        }
    }

    .signal-list {
        display: flex;
        flex-direction: column;
        :deep {
            .signal-tab {
                position: sticky;
                top: 0;
                z-index: 99;
                padding: 0 12px;
            }
            .signal-mine {
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
            .signal-list-y {
                padding-bottom: 10px;
                .signal {
                    padding: 0 12px;
                }
                .signal-warp.signal-warp-bg {
                    margin: 0;
                }
            }
            .signal-item-th {
                height: auto;
                min-height: auto;
                display: none;
                .col {
                    text-align: center;
                    margin-right: 0;
                }
            }
            .filter-drawer {
                .deawer-block-product {
                    display: none;
                }
                .drawer-handle {
                    margin-top: 30px;
                }
            }
            .signal-item {
                cursor: pointer;
                .tg-subscribe-link {
                    display: none;
                }
                &.signal-item-th {
                    .icon-question {
                        font-size: 14px;
                    }
                }
                .col-indicator {
                    flex: 1;
                }
                .col-symbol-name {
                    flex: 1;
                    justify-content: flex-end;
                    .symbol-name .icon {
                        display: none;
                    }
                }
                .arrow {
                    display: none;
                }
            }
            .signal-more-sticky {
                position: sticky;
                top: 0;
                padding: 5px 12px;
                z-index: 99;
            }
            .signal-mine.signal-mine-blank {
                margin: 6px 0 0;
            }
            .signal-mine-info {
                width: auto;
                padding: 0 15px;
            }
            .signal-mine-head {
                padding: 16px 12px;
                .btn-subscribe {
                    font-size: 12px;
                }
                .btn-subscribe-link {
                    margin-left: 14px;
                    font-size: 12px;
                    display: inline-flex;
                    align-items: center;
                    @media screen and (max-width: 1460px) {
                        .van-icon-orders-o {
                            display: none;
                        }
                    }
                }
            }
        }
    }
    @media (min-width: 768px) {
        .signal-list {
            overflow: hidden;
            :deep {
                .signal-tab {
                    .signal-tab-warp {
                        align-items: flex-start;
                    }
                }
                .signal-list-y {
                    .signal-warp.signal-warp-bg {
                        padding-left: 0;
                        padding-right: 0;
                    }
                }
                .filter-drawer {
                    max-width: 320px;
                }
                .signal-tab-link {
                    padding-bottom: 0;
                    margin-bottom: 10px;
                }
                .signal-item-popover {
                    position: absolute;
                    left: -100%;
                    top: 0;
                }

                .signal-item {
                    font-size: 12px;
                    &.signal-item-th {
                        margin-top: 16px;
                        margin-bottom: 8px;
                        display: flex;
                        span {
                            white-space: pre-wrap;
                        }
                    }
                    .col-symbol-name {
                        justify-content: flex-start;
                    }
                }
                .classify-list {
                    .item {
                        font-size: 12px;
                    }
                }
            }
        }
    }
}
body.pc {
    .product-detail-signal {
        .signal-list {
            :deep {
                .signal-item .arrow {
                    display: none;
                }
            }
        }
    }
}
</style>

<template>
    <div>
        <div class='signal-page-wrap'>
            <!-- 内容区域 -->
            <div class='content'>
                <breadcrumb
                    :list='navList'
                />

                <div class='title'>
                    <h3 v-if='isPC'>
                        {{ $t('signal.valuable.profitDetail') }}
                    </h3>
                    <div v-if='signal' class='desc'>
                        <div class='desc-warp'>
                            <div class='desc-quote'>
                                <p>
                                    {{ signal.i + '-' + getPeriodName(signal.pe) }}
                                </p>
                                <p>
                                    <product-icon
                                        :show-symbol-name='true'
                                        :symbol-code='signal.sy'
                                    />
                                </p>
                            </div>
                            <!-- <van-button
                                class='btn-subscribe'
                                data-ga='signal_ProStatisticsTop_freeSubBtn_cl'
                                type='primary'
                                @click='handleSubscribe'
                            >
                                {{ $t('signal.subscribe.freeSubscribeThisSignal') + ' >' }}
                            </van-button> -->
                        </div>
                    </div>
                </div>
                <div class='total'>
                    <div class='num '>
                        <div class='num_li'>
                            <p>{{ $t('signal.valuable.periodTotal') }}：</p>
                            <b>
                                {{ getSignalDays(signal.days) }}
                            </b>
                        </div>
                        <div class='num_li'>
                            <p>{{ $t('signal.valuable.rankingProfitTotal') }}：</p>
                            <Profit unit='USD' :value='route.query.tpnl' />
                        </div>
                    </div>
                    <span v-if='currentTime' class='time'>
                        {{ `${$t("signal.common.updateTime")}：${formatTime(currentTime, 'MM/DD HH:mm')} (${getUtcOffset()})` }}
                    </span>
                </div>

                <ElTable
                    ref='tableRef'
                    class='table-data'
                    :data='tableData'
                    :style='{ width: "100%" }'
                >
                    <ElTableColumn fixed :label='$t("signal.valuable.triggerTime")' min-width='120'>
                        <template #default='scope'>
                            {{ formatTime(scope.row.otime, 'MM/DD HH:mm') }}
                        </template>
                    </ElTableColumn>
                    <ElTableColumn :label='$t("signal.valuable.buysell")' min-width='100'>
                        <template #default='scope'>
                            <signal-direction :direction='scope.row.oaction' />
                        </template>
                    </ElTableColumn>
                    <ElTableColumn :label="$t('signal.valuable.triggerPrice')" min-width='120'>
                        <template #default='scope'>
                            {{ getTriggerPrice(scope.row.oprice) }}
                        </template>
                    </ElTableColumn>
                    <ElTableColumn :label='$t("signal.valuable.closeTime")' min-width='120'>
                        <template #default='scope'>
                            {{ formatTime(scope.row.ctime, 'MM/DD HH:mm') }}
                        </template>
                    </ElTableColumn>
                    <ElTableColumn :label="$t('signal.valuable.closePrice')" min-width='120'>
                        <template #default='scope'>
                            {{ getTriggerPrice(scope.row.cprice) }}
                        </template>
                    </ElTableColumn>
                    <ElTableColumn min-width='140'>
                        <template #header>
                            <span class='flex items-center icon-profit'>
                                <span>
                                    {{ $t("signal.valuable.rankingProfit") + '(USD)' }}
                                </span>
                                <popover
                                    :offset='[16, 8]'
                                    placement='top-end'
                                    :text="$t('signal.valuable.rankingProfitPopover')"
                                />
                            </span>
                        </template>
                        <template #default='scope'>
                            <Profit :value='scope.row.pnl' />
                        </template>
                    </ElTableColumn>
                    <template #empty>
                        <signalListSkeleton
                            :limit='10'
                            :list='[]'
                        />
                    </template>
                </ElTable>

                <div
                    v-show='page.index < pageTotal'
                    class='more'
                >
                    <van-button
                        class='btn-more'
                        data-ga='signal_ProStatistics_moreBtn_cl'
                        :loading='loading'
                        :loading-text="$t('signal.common.viewMore')"
                        @click='handleMore'
                    >
                        {{ $t('signal.common.viewMore') }}
                    </van-button>
                </div>
            </div>
        </div>
        <div v-if='evaluateTableData.length' class='signal-page-wrap'>
            <div class='content'>
                <div class='report report-no-padding'>
                    <div class='head'>
                        <h5>{{ $t("signal.valuable.profitableSignal") }}：</h5>
                    </div>
                    <evaluate-table
                        :data='evaluateTableData'
                        data-ga-detail='signal_ProfitDetailOther_detailBtn_cl'
                        data-ga-list='signal_ProStatisticsOther_listData_cl'
                        data-ga-sub='signal_ProStatisticsOther_SubBtn_cl'
                        :is-replace='true'
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { computed, toRefs, reactive, watch, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import useSignalAuth from '@/hooks/useSignalAuth'
import useSignal from '@/plugins/signal/hooks/signal'
import signalDirection from '@/plugins/signal/components/signal-direction.vue'
import breadcrumb from '@/plugins/signal/components/breadcrumb.vue'
import axios from 'axios'
import { toFixed } from '@/utils/calculation'
import evaluateTable from '@/plugins/signal/modules/ranking/table.vue'
import { ElTable, ElTableColumn } from 'element-plus'
import productIcon from '@/plugins/signal/components/product-icon'
import { getTimestamp, getUtcOffset } from '@/plugins/signal/utils/getRelativeTime'
import Profit from '@/plugins/signal/modules/signal-valuable-profit.vue'
import signalListSkeleton from '@/plugins/signal/components/signal-list-skeleton.vue'

export default {
    components: {
        ElTable,
        ElTableColumn,
        productIcon,
        signalDirection,
        breadcrumb,
        evaluateTable,
        Profit,
        signalListSkeleton
    },
    setup () {
        useSignalAuth()
        const store = useStore()
        const route = useRoute()
        const { subscribeSignal, initSubscribeConfirm } = useSignal()
        const { t } = useI18n()

        const list = ref([]) // 列表

        const state = reactive({
            loading: false, // 加载loading
            params: {
                id: route.query.id,
                rtime: route.query.rtime,
                limit: 100,
            },
            // 导航列表
            navList: [
                { name: t('signal.signal'), value: '/signal' },
                { name: t('signal.valuable.ranking'), value: '/signal/ranking' },
                { name: t('signal.valuable.profitDetail') },
            ],
            cancelToken: null,
            cancelDetailToken: null,
            signal: {}, // 信号信息
            evaluateTableData: [], // 最新5个数据
            currentTime: null, // 最近更新时间
            isScrollInit: false, // 初始化滚动
            page: {
                index: 1, // 当前页码
                size: 10, // 页码
            },
        })

        // 周期名称
        const getPeriodName = (pe) => {
            return store.getters['_signal/getPeriodName'](pe)
        }

        // 加载列表
        const loadData = () => {
            if (state.cancelToken) {
                state.cancelToken()
            }
            return store.dispatch('_signal/queryPnl', {
                params: {
                    limit: 5,
                    sc: '',
                    pe: '',
                    i: '',
                    days: state.signal.days
                },
                cancelToken: new axios.CancelToken((c) => {
                    state.cancelToken = c
                })
            }).then(res => {
                state.evaluateTableData = res.data.items
            })
        }

        const loadDetailData = () => {
            if (state.cancelDetailToken) {
                state.cancelDetailToken()
            }
            return store.dispatch('_signal/queryPnl', {
                params: state.params,
                cancelToken: new axios.CancelToken((c) => {
                    state.cancelDetailToken = c
                })
            }).then(res => {
                list.value = res.data?.items || []
                state.currentTime = getTimestamp()
            })
        }

        // 信号配置
        const config = computed(() => {
            return store.state._signal.config
        })

        // 触发价格式化
        const getTriggerPrice = (price) => {
            // 触发价
            const product = store.getters['_signal/getSignalProduct'](state.signal?.sy)
            return product?.symbolDigits ? toFixed(price, product?.symbolDigits) : price
        }
        // 获取盈亏周期
        const getSignalDays = (days) => {
            return store.getters['_signal/getSignalDays'](days)
        }

        // 订阅
        const handleSubscribe = () => {
            subscribeSignal({
                payload: {
                    ...state.signal,
                    id: 'signal', // 必传
                },
                type: 'quick',
            })
        }

        // 分页
        // 表格展示数据
        const tableData = computed(() => {
            return list.value.slice(0, state.page.size * state.page.index)
        })

        // 页数
        const pageTotal = computed(() => {
            return Math.ceil(list.value.length / state.page.size)
        })

        // 加载更多
        const handleMore = () => {
            // 页数
            if (state.page.index < pageTotal.value) {
                state.loading = true
                setTimeout(() => {
                    state.loading = false
                    state.page.index += 1
                }, 300)
            }
        }

        // 解析id
        watch(() => route.query, ({ id, rtime }) => {
            if (id) {
                // TradeingView_GOLD_RSI_5m_7
                const arr = id.split('_')
                if (arr.length === 5) {
                    state.signal.sy = arr[1]
                    state.signal.i = arr[2]
                    state.signal.pe = arr[3]
                    state.signal.days = arr[4]
                }
                state.params.id = id
                state.params.rtime = rtime

                // 加载详情
                loadDetailData()
                // 加载推荐数据
                loadData()
            }
        }, { immediate: true })

        const tableRef = ref(null)
        // 初始化滚动条
        watch([() => state.isScrollInit, () => tableData.value], (newVal) => {
            if (newVal[0] === false && newVal[1].length) {
                tableRef.value?.setScrollLeft(1)
                state.isScrollInit = true
            }
        })

        onMounted(() => {
            initSubscribeConfirm()
        })

        return {
            ...toRefs(state),
            getPeriodName,
            config,
            toFixed,
            handleSubscribe,
            isPC: window.isPC,
            route,
            getSignalDays,
            getUtcOffset,
            getTriggerPrice,
            tableData,
            pageTotal,
            handleMore,
            tableRef
        }
    }
}

</script>

<style lang="scss" scoped>
@import '@/plugins/signal/style/signal.scss';
.signal-page-wrap {
    @media screen and (max-width: 768px) {
        &:nth-child(2) {
            margin-top: 6px;
        }
    }
    .content {
        padding: 30px;
        @media screen and (max-width: 768px) {
            padding: 0 0 15px;
        }
        .title {
            padding-top: 30px;
            text-align: center;
            h3 {
                font-size: 24px;
                display: inline-flex;
                align-items: center;
            }
            @media screen and (max-width: 768px) {
                padding-top: 0;
                h3 {
                    font-size: 19px;
                }
            }
            .desc {
                padding: 30px 0;
                @media screen and (max-width: 768px) {
                    padding: 20px 0;
                }
                .desc-warp {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    .desc-quote {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-bottom: 15px;
                        @media screen and (max-width: 768px) {
                            margin-bottom: 0;
                        }
                        p {
                            margin-right: 12px;
                            font-size: 22px;
                        }
                        :deep {
                            .symbol-name .icon img {
                                width: 0.6rem;
                                height: 0.6rem;
                            }
                        }
                    }
                    .btn-subscribe {
                        min-width: 250px;
                        height: 40px;
                    }
                }
            }
        }
        .total {
            padding: 20px 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .num {
                display: flex;
                align-items: center;
                .num_li {
                    display: flex;
                    align-items: center;
                    margin-right: 15px;
                    font-size: 16px;
                }
            }
            .time {
                color: var(--minorColor);
                font-size: 15px;
            }
            @media screen and (max-width: 768px) {
                padding: 30px 0 15px;
                flex-direction: column;
                align-items: flex-start;
                .num {
                    flex-direction: column;
                    align-items: flex-start;
                    .num_li {
                        margin-right: 0;
                        margin-bottom: 10px;
                        font-size: 14px;
                    }
                }
                .time {
                    align-self: flex-end;
                    font-size: 13px;
                }
            }
        }
        .report {
            padding: 40px 0;
            &.report-no-padding {
                padding: 0;
            }
            @media screen and (max-width: 768px) {
                padding: 20px 0 !important;
            }
            .head {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px 0;
                h5 {
                    font-size: 20px;
                    @media screen and (max-width: 768px) {
                        font-size: 16px;
                    }
                }
                .time {
                    color: var(--normalColor);
                }
            }
        }
        .btn-more {
            min-width: 240px;
            height: 50px;
            align-items: center;
            justify-content: center;
            display: flex;
            color: var(--primary);
            background-color: var(--contentColor);
            font-size: 16px;
            text-align: center;
            border-radius: 12px;
            border: 2px solid var(--lineColor);
            margin: 40px auto;
            cursor: pointer;
            &:hover {
                border-color: var(--primary);
            }
        }
    }
    :deep {
        table {
            .symbol-name {
                display: inline-flex;
            }
            .cell {
                word-break: break-word;
            }
            .popover-warp {
                align-items: center;
            }
            th.el-table__cell,
            .el-table-fixed-column--left {
                background: var(--contentColor);
            }
        }
    }
}

</style>

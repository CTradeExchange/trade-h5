<template>
    <div class='signal-page-wrap'>
        <!-- 内容区域 -->
        <div class='content'>
            <breadcrumb
                :list='navList'
            />
            <quote :symbol-code='params.sy' />
            <div class='category'>
                <classify-list
                    v-model='params.pe'
                    :is-multiple='false'
                    :list='config.period'
                    :size='isPC ? "lg" : ""'
                    :style-type='1'
                />
            </div>
            <div v-if='loading === false && tableData.length === 0' class='empty'>
                <span>{{ $t('signal.valuable.noTriggerSignal') }}</span>
            </div>
            <div v-if='tableData[0]' class='report report-max'>
                <div class='head'>
                    <h5>{{ $t("signal.valuable.evaluateSummary") }}：</h5>
                    <span class='time'>
                        {{ `${$t("signal.common.updateTime")}：${formatTime(currentTime, 'MM/DD HH:mm')} (${getUtcOffset()})` }}
                    </span>
                </div>
                <div class='thead'>
                    <div class='text summary'>
                        <span>{{ $t('signal.common.summary') }}：</span>
                        <signal-direction
                            v-if='tableData[0]?.summary'
                            :check-neutral='true'
                            :direction='tableData[0]?.summary'
                            :is-summary='true'
                        />
                    </div>
                    <van-button
                        class='btn-trade'
                        plain
                        @click='handleTrade'
                    >
                        {{ $t('signal.common.trade') }}
                    </van-button>
                </div>
                <ElTable
                    :data='tableData'
                    :style='{ width: "100%" }'
                >
                    <ElTableColumn align='center' :label='$t("signal.valuable.sellIndicator")' min-width='80'>
                        <template #default='scope'>
                            {{ scope.row.sell_sum || 0 }}
                        </template>
                    </ElTableColumn>
                    <ElTableColumn align='center' :label='$t("signal.valuable.sellBratio")' min-width='90'>
                        <template #default='scope'>
                            <span :class='{ primaryColor: scope.row.bratio < scope.row.sratio }'>
                                {{ toFixed((scope.row.sratio || 0) * 100) + '%' }}
                            </span>
                        </template>
                    </ElTableColumn>
                    <ElTableColumn
                        align='center'
                        :label='$t("signal.valuable.buyIndicator")'
                        min-width='80'
                    >
                        <template #default='scope'>
                            {{ scope.row.buy_sum || 0 }}
                        </template>
                    </ElTableColumn>
                    <ElTableColumn align='center' :label='$t("signal.valuable.buyBratio")' min-width='90'>
                        <template #default='scope'>
                            <span :class='{ primaryColor: scope.row.bratio > scope.row.sratio }'>
                                {{ toFixed((scope.row.bratio || 0) * 100) + '%' }}
                            </span>
                        </template>
                    </ElTableColumn>
                    <ElTableColumn v-if='tableData[0]?.neutral_sum' align='center' :label='$t("signal.common.noTradeAdvice")' min-width='120'>
                        <template #default='scope'>
                            {{ scope.row.neutral_sum || 0 }}
                        </template>
                    </ElTableColumn>
                    <ElTableColumn v-if='tableData[0]?.nratio' align='center' :label='$t("signal.valuable.noTradeAdviceBratio")' min-width='130'>
                        <template #default='scope'>
                            {{ toFixed((scope.row.nratio || 0) * 100) + '%' }}
                        </template>
                    </ElTableColumn>
                </ElTable>
                <div class='report'>
                    <div class='head'>
                        <h5>{{ $t('signal.valuable.evaluateDetail') }}：</h5>
                    </div>
                    <ElTable
                        class='table-detail'
                        :data='tableData2'
                        :style='{ width: "100%" }'
                    >
                        <ElTableColumn align='center' :label='$t("signal.detail.indicator")' min-width='100'>
                            <template #default='scope'>
                                {{ scope.row.i + (isPC ? '' : '-' + getPeriodName(scope.row.pe)) }}
                            </template>
                        </ElTableColumn>
                        <ElTableColumn align='center' :label='$t("signal.tradeRecommend")' min-width='80'>
                            <template #default='scope'>
                                <signal-direction
                                    :check-neutral='true'
                                    :direction='scope.row?.a'
                                />
                            </template>
                        </ElTableColumn>
                        <ElTableColumn v-if='isPC' align='center' :label='$t("signal.common.period")'>
                            <template #default='scope'>
                                {{ getPeriodName(scope.row.pe) }}
                            </template>
                        </ElTableColumn>
                        <!-- <ElTableColumn align='center' label='' :min-width='isPC ? 140 : 50'>
                            <template #default='scope'>
                                <van-button
                                    v-if='isPC'
                                    class='plain-button'
                                    plain
                                    type='primary'
                                    @click.stop='handleSubscribe(scope.row)'
                                >
                                    {{ $t('signal.subscribe.freeSubscribe') + ' >' }}
                                </van-button>
                                <div
                                    v-else
                                    class='signal-item-more'
                                    @click.stop='handleSubscribe(scope.row)'
                                >
                                    <i class='icon icon_subscribed'></i>
                                </div>
                            </template>
                        </ElTableColumn> -->
                    </ElTable>
                    <div class='tfooter'>
                        <div class='tfooter-detail'>
                            <div class='text'>
                                <span>
                                    {{ $t("signal.common.buy") }}：{{ tableData[0]?.buy_sum || 0 }}
                                </span>
                            </div>
                            <div class='text'>
                                <span>{{ $t("signal.common.sell") }}：{{ tableData[0]?.sell_sum || 0 }}</span>
                            </div>
                            <div v-if='tableData[0]?.neutral_sum' class='text'>
                                <span>{{ $t('signal.common.none') }}：{{ tableData[0]?.neutral_sum || 0 }}</span>
                            </div>
                        </div>
                        <div class='summary'>
                            <span>{{ $t('signal.common.summary') }}：</span>
                            <signal-direction
                                v-if='tableData[0]?.summary'
                                :check-neutral='true'
                                :direction='tableData[0]?.summary'
                                :is-summary='true'
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 快捷交易面板 -->
        <QuickTransaction
            ref='quickTransactionRef'
        />
    </div>
    <div v-if='evaluateTableData.length' class='signal-page-wrap'>
        <div class='content'>
            <div class='report'>
                <div class='head'>
                    <h5>{{ $t('signal.valuable.otherSee') }}：</h5>
                </div>
                <evaluate-table
                    :data='evaluateTableData'
                    data-ga-list='signal_IndicatorEvDetOther_list_cl'
                    data-ga-trade='signal_IndicatorEvDetOther_trade_cl'
                    :is-replace='true'
                />
            </div>
        </div>
    </div>
</template>

<script>
import { computed, toRefs, reactive, watch, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import classifyList from '@/plugins/signal/components/classify-list'
import useSignalAuth from '@/hooks/useSignalAuth'
import useSignal from '@/plugins/signal/hooks/signal'
import signalDirection from '@/plugins/signal/components/signal-direction.vue'
import breadcrumb from '@/plugins/signal/components/breadcrumb.vue'
import axios from 'axios'
import { toFixed } from '@/utils/calculation'
import evaluateTable from '@/plugins/signal/modules/evaluate/table.vue'
import quote from './quote'
import { ElTable, ElTableColumn } from 'element-plus'
import { getUtcOffset, getTimestamp } from '@/plugins/signal/utils/getRelativeTime'
import { useI18n } from 'vue-i18n'
import QuickTransaction from '@plans/components/quickTransaction'

export default {
    components: {
        ElTable,
        ElTableColumn,
        classifyList,
        signalDirection,
        breadcrumb,
        evaluateTable,
        quote,
        QuickTransaction,
    },
    setup () {
        useSignalAuth()
        const store = useStore()
        const route = useRoute()
        const { jumpTrade, subscribeSignal, initSubscribeConfirm, getEvaluateParams, checkSymbolCodeValid } = useSignal()
        const { t } = useI18n()
        const quickTransactionRef = ref(null)
        const isPC = window.isPC

        const state = reactive({
            loading: false, // 加载loading
            params: {
                sy: route.query.sy,
                pe: '',
            },
            detail: null, // 详情
            // 导航列表
            navList: [
                { name: t('signal.signal'), value: '/signal' },
                { name: t('signal.valuable.evaluate'), value: '/signal/evaluate' },
                { name: t('signal.valuable.evaluateDetailTitle') },
            ],
            cancelToken: null,
            cancelDetailToken: null,
            evaluateTableData: [], // 最新5个数据
            currentTime: null,
        })

        // 周期名称
        const getPeriodName = (pe) => {
            return store.getters['_signal/getPeriodName'](pe)
        }

        // 加载列表
        const loadData = (params) => {
            if (state.cancelToken) {
                state.cancelToken()
            }
            return store.dispatch('_signal/queryAssess', {
                params: {
                    limit: 5,
                    sc: '',
                    pe: state.params.pe
                },
                cancelToken: new axios.CancelToken((c) => {
                    state.cancelToken = c
                })
            }).then(res => {
                if (params.pe === state.params.pe && res.data?.items) {
                    state.evaluateTableData = res.data.items
                }
            })
        }

        const loadDetailData = (params) => {
            if (state.cancelDetailToken) {
                state.cancelDetailToken()
            }
            state.loading = true
            return store.dispatch('_signal/queryAssess', {
                params,
                cancelToken: new axios.CancelToken((c) => {
                    state.cancelDetailToken = c
                })
            }).then(res => {
                if (params.pe === state.params.pe) {
                    state.detail = res.data.items[0] || null
                    state.currentTime = getTimestamp()
                }
            }).finally(() => {
                state.loading = false
            })
        }

        // 信号配置
        const config = computed(() => {
            return store.state._signal.config
        })

        // 初始化周期
        watch(() => config.value, newVal => {
            if (newVal && newVal.period && !state.pe) {
                state.params.pe = getEvaluateParams()?.pe || newVal.period[0].value
            }
        }, { immediate: true })

        // 监听参数变化
        watch(() => route.query.sy, (val) => {
            state.params.sy = val
        })

        // 监听条件变化
        watch(() => state.params, (params) => {
            if (params.pe && params.sy) {
                // 加载详情
                loadDetailData(params)
                // 加载推荐数据
                loadData(params)
            }
        }, { immediate: true, deep: true })

        // 总结表格数据
        const tableData = computed(() => {
            const res = []
            if (state.detail && config.value?.indicator.length) {
                const obj = {}
                config.value.indicator.forEach((item, index) => {
                    const direction = state.detail[item.value.toLowerCase()] + '_sum'
                    if (state.detail[item.value.toLowerCase()]) {
                        if (!obj[direction]) obj[direction] = 0
                        obj[direction] += 1
                    }
                })
                res.push({ ...state.detail, ...obj })
            }
            return res
        })

        // 总结表格2
        const tableData2 = computed(() => {
            const res = []
            if (state.detail && config.value?.indicator.length) {
                config.value.indicator.forEach((item) => {
                    res.push({
                        i: item.value,
                        pe: state.detail.pe,
                        sy: state.params.sy,
                        a: state.detail[item.value.toLowerCase()]
                    })
                })
            }
            return res
        })

        // 周期配置
        const formatPeriod = computed(() => {
            return store.getters['_signal/getValuablePeriod']
        })

        // 去交易
        const handleTrade = () => {
            if (isPC) {
                jumpTrade(state.params.sy)
            } else {
                checkSymbolCodeValid({
                    sy: state.params.sy,
                    callback: (product) => {
                        store.dispatch('_quote/querySymbolInfo', product).then(result => {
                            quickTransactionRef.value.open(product)
                        })
                    }
                })
            }
        }

        // 订阅
        const handleSubscribe = (item) => {
            subscribeSignal({
                payload: {
                    ...item,
                    id: 'signal', // 必传
                },
                type: 'quick',
                needConfirm: !isPC
            })
        }

        onMounted(() => {
            initSubscribeConfirm()
        })

        return {
            ...toRefs(state),
            getPeriodName,
            config,
            quickTransactionRef,
            handleTrade,
            tableData,
            toFixed,
            tableData2,
            handleSubscribe,
            isPC,
            getUtcOffset,
            formatPeriod
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
            padding: 12px 0 30px;
        }
        .category {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 15px 0;
            .classify-tabs {
                width: auto;
                @media screen and (max-width: 768px) {
                    width: 100%;
                }
            }
        }
        .report {
            padding-top: 20px;
            &.report-max {
                width: 900px;
                margin: 0 auto;
                @media screen and (max-width: 768px) {
                    width: 100%;
                }
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
                    color: var(--minorColor);
                    font-size: 14px;
                    @media screen and (max-width: 768px) {
                        font-size: 13px;
                    }
                }
            }
            .thead,
            .tfooter {
                border: 1px solid var(--lineColor);
                border-left-width: 0;
                border-right-width: 0;
                padding: 8px 0;
                padding-left: 20px;
                @media screen and (max-width: 768px) {
                    padding: 14px;
                    font-size: 14px;
                }
                .btn-trade {
                    margin-left: 20px;
                    height: 30px;
                    background-color: var(--contentColor);
                    border-color: var(--primary);
                    color: var(--primary);
                    &:hover {
                        opacity: 0.8;
                    }
                }
                .summary {
                    font-size: 18px;
                }
            }
            .thead {
                display: flex;
                align-items: center;
            }
            .tfooter {
                border-bottom-width: 1px;
                border-top-width: 0;
                .tfooter-detail {
                    display: flex;
                    align-items: center;
                    margin-bottom: 5px;
                }
                .text {
                    margin-right: 15px;
                }
            }
            .table-detail {
                :deep {
                    .plain-button {
                        height: 30px;
                        font-size: 14px;
                        @media screen and (max-width: 768px) {
                            font-size: 13px;
                            height: 25px;
                        }
                    }
                }
            }
        }
        .empty {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 250px;
            text-align: center;
            span {
                font-size: 18px;
            }
        }
    }
    :deep {
        table {
            th.el-table__cell,
            .el-table-fixed-column--left {
                background: var(--contentColor);
            }
            .primaryColor {
                color: var(--primary);
            }
        }
    }
}

</style>

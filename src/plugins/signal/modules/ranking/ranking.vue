<template>
    <div class='signal-page-wrap'>
        <!-- 内容区域 -->
        <div class='content'>
            <breadcrumb
                :list='navList'
            />
            <signal-introduce
                :desc='$t("signal.valuable.rankingDesc")'
                :title='$t("signal.valuable.ranking")'
                @handle-tips='handleTips'
            />
            <div v-if='currentTime' class='updatetime'>
                {{ `${$t("signal.common.updateTime")}：${formatTime(currentTime, 'MM/DD HH:mm')} (${getUtcOffset()})` }}
            </div>
            <div class='signal-category'>
                <div class='filter'>
                    <span class='filter-text' @click='handleOpen'>
                        {{ $t('signal.filter') }}
                    </span>
                    <icon-filter @click='handleOpen' />
                </div>
                <div class='tab-list'>
                    <classify-list
                        v-if='isPC'
                        v-model='params.pe'
                        :list='formatPeriod'
                        :show-all='true'
                        :size='isPC ? "lg" : ""'
                        :style-type='1'
                    />
                    <classify-list
                        v-model='params.days'
                        :is-multiple='false'
                        :list='config.days'
                        :size='isPC ? "lg" : ""'
                        :style-type='1'
                    />
                </div>
            </div>
            <signal-layout
                ref='filterDrawerRef'
                class='singal-layout'
                type='valuable'
                @confirm='handleFilter'
            >
                <div class='signal-content'>
                    <ranking-table
                        :data='tableData.slice(0, page.size * page.index)'
                        data-ga-detail='signal_RankingPageList_detailBtn_cl'
                        data-ga-list='signal_RankingPage_listData_cl'
                        data-ga-sub='signal_RankingPageList_freeSubBtn_cl'
                        :show-top3='true'
                        :skeleton-show='skeletonShow'
                    />
                    <div
                        v-show='page.index < pageTotal'
                        class='more'
                    >
                        <van-button
                            class='btn-more'
                            data-ga='signal_RankingPage_moreRankingBtn_cl'
                            :loading='loading'
                            :loading-text="$t('signal.common.viewMore')"
                            @click='handleMore'
                        >
                            {{ $t('signal.common.viewMore') }}
                        </van-button>
                    </div>
                </div>
            </signal-layout>

            <div ref='signalInfoRef' class='signal-info'>
                <h4>{{ $t('signal.valuable.rankInfo.what') }}</h4>
                <p>{{ $t('signal.valuable.rankInfo.whatDesc') }}</p>
                <h4>{{ $t('signal.valuable.operationMode') }}</h4>
                <p>{{ $t('signal.valuable.rankInfo.operationDesc') }}</p>
                <p class='tips'>
                    {{ $t('signal.valuable.rankInfo.tips') }}
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import { computed, toRefs, reactive, watch, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import classifyList from '@/plugins/signal/components/classify-list'
import useSignal from '@/plugins/signal/hooks/signal'
import useSignalAuth from '@/hooks/useSignalAuth'
import breadcrumb from '@/plugins/signal/components/breadcrumb.vue'
import signalIntroduce from '@/plugins/signal/components/signal-introduce.vue'
import axios from 'axios'
import rankingTable from '@/plugins/signal/modules/ranking/table.vue'
import iconFilter from '@/plugins/signal/components/icon-filter.vue'
import signalLayout from '@/plugins/signal/components/signal-layout.vue'
import { getTimestamp, getUtcOffset } from '@/plugins/signal/utils/getRelativeTime'
import { useI18n } from 'vue-i18n'

export default {
    components: {
        breadcrumb,
        classifyList,
        rankingTable,
        signalIntroduce,
        iconFilter,
        signalLayout
    },
    setup () {
        useSignalAuth()
        const store = useStore()
        const { t } = useI18n()
        const filterDrawerRef = ref(null)

        const { initSubscribeConfirm, getRankingParams } = useSignal()

        const state = reactive({
            currentTime: null, // 更新时间
            page: {
                index: 1, // 当前页码
                size: 10, // 页码
            },
            skeletonShow: false, // 骨架图
            loading: false, // 加载loading
            params: {
                limit: 100,
                i: '', // 指标
                sc: '', // 产品分类
                pe: '', // 周期
                days: '' // 最近7日或者最近30日
            },
            cancelToken: null,
            navList: [
                { name: t('signal.signal'), value: '/signal' },
                { name: t('signal.valuable.ranking') }
            ]
        })

        const signalInfoRef = ref(null)

        // 打开过滤器
        const handleOpen = () => {
            filterDrawerRef.value && filterDrawerRef.value.toggle('ranking', state.params)
        }

        // 表格展示数据
        const tableData = ref([])

        // 页数
        const pageTotal = computed(() => {
            return Math.ceil(tableData.value.length / state.page.size)
        })

        // 信号配置
        const config = computed(() => {
            return store.state._signal.config
        })

        // 周期配置
        const formatPeriod = computed(() => {
            return store.getters['_signal/getValuablePeriod']
        })

        // 初始化周期
        watch(() => config.value, newVal => {
            if (newVal && newVal.days && !state.params.days) {
                const defaultParams = getRankingParams()
                state.params = {
                    ...state.params,
                    ...defaultParams,
                    days: defaultParams.days || newVal.days[0].value,
                    limit: 100,
                }
            }
        }, { immediate: true })

        // 加载数据
        const loadData = (params) => {
            getRankingParams(params)
            if (state.cancelToken) {
                state.cancelToken()
            }
            state.skeletonShow = true
            return store.dispatch('_signal/queryPnl', {
                params,
                cancelToken: new axios.CancelToken((c) => {
                    state.cancelToken = c
                })
            }).then(res => {
                if (params.sc === state.params.sc && state.params.pe === params.pe) {
                    tableData.value = res.data?.items || []
                    state.page.index = 1
                    state.currentTime = getTimestamp()
                    state.skeletonShow = false
                }
            }).catch(e => {})
        }

        watch(() => state.params, (params) => {
            if (params.days) {
                loadData(params)
            }
        }, { immediate: true, deep: true })

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

        const handleFilter = (data) => {
            state.params.i = data.i
            state.params.pe = data.pe
            state.params.sc = data.sc
        }

        // 运作方式
        const handleTips = () => {
            window.scrollTo({
                top: signalInfoRef.value.offsetTop,
                left: 0,
                behavior: 'smooth',
            })
        }

        onMounted(() => {
            // 初始化订阅弹窗
            initSubscribeConfirm()
        })

        return {
            ...toRefs(state),
            config,
            handleMore,
            pageTotal,
            tableData,
            filterDrawerRef,
            isPC: window.isPC,
            handleOpen,
            handleFilter,
            getUtcOffset,
            handleTips,
            signalInfoRef,
            formatPeriod
        }
    }
}

</script>

<style lang="scss" scoped>
@import '@/plugins/signal/style/signal.scss';
.signal-page-wrap {
    .tab .tab-left {
        position: relative;
    }
    .content {
        padding: 30px;
        @media screen and (max-width: 768px) {
            padding: 15px 0;
        }
        .signal-category {
            display: flex;
            align-items: center;
            margin: 15px 0;
            .filter {
                display: flex;
                align-items: center;
            }
            .filter-text {
                display: none;
            }
            @media screen and (max-width: 768px) {
                margin: 0 0 10px;
                justify-content: space-between;
                flex-direction: row-reverse;
                .filter-text {
                    display: inline;
                    font-size: 14px;
                    margin-right: 4px;
                }
            }
            .tab-list {
                margin-left: 15px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                @media screen and (max-width: 768px) {
                    flex-direction: column;
                    margin: 0;
                    overflow: hidden;
                }
            }
            .classify-tabs {
                align-self: flex-end;
                border-left: 2px solid var(--lineColor);
                width: auto;
                padding-left: 30px;
                &:first-child {
                    padding-left: 0;
                    margin-right: 30px;
                    border-left: none;
                }
                @media screen and (max-width: 768px) {
                    width: 100%;
                    align-self: center;
                    padding-left: 0;
                    &:first-child {
                        margin-right: 0;
                    }
                }
            }
        }
        .updatetime {
            margin-top: 20px;
            font-size: 15px;
            text-align: right;
            color: var(--minorColor);
            @media screen and (max-width: 700px) {
                margin-top: 0;
                margin-bottom: 20px;
                font-size: 14px;
            }
        }
        .signal-content {
            @media screen and (max-width: 768px) {
                overflow: hidden;
            }
            .btn-more {
                min-width: 240px;
                height: 50px;
                align-items: center;
                justify-content: center;
                display: flex;
                background-color: var(--contentColor);
                color: var(--primary);
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
        .signal-info {
            margin-top: 40px;
            padding: 14px 0;
            @media screen and (max-width: 700px) {
                padding: 0;
                margin-top: 20px;
            }
            h4 {
                padding: 12px 0;
                font-size: 24px;
                line-height: 32px;
                @media screen and (max-width: 700px) {
                    font-size: 20px;
                    line-height: 24px;
                }
            }
            p {
                font-size: 16px;
                margin-bottom: 12px;
                @media screen and (max-width: 700px) {
                    font-size: 14px;
                }
                &.tips {
                    color: var(--minorColor);
                    margin-top: 30px;
                    font-size: 14px;
                }
            }
        }
        :deep {
            .layout-left.visible {
                top: 70px;
            }
            .layout-right {
                overflow: hidden;
            }
        }
    }
}

</style>

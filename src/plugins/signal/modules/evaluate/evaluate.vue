<template>
    <div class='signal-page-wrap'>
        <!-- 内容区域 -->
        <div class='content'>
            <breadcrumb
                :list='navList'
            />
            <signal-introduce
                :desc='$t("signal.valuable.evaluateDesc")'
                :title='$t("signal.valuable.evaluate")'
                @handle-tips='handleTips'
            />
            <div class='signal-category'>
                <classify-list
                    v-model='params.sc'
                    :is-multiple='false'
                    :list='config.product'
                    :show-all='true'
                    :size='isPC ? "lg" : ""'
                    :style-type='isPC ? 1 : 2'
                />
                <classify-list
                    v-model='params.pe'
                    :is-multiple='false'
                    :list='config.period'
                    :size='isPC ? "lg" : ""'
                    :style-type='1'
                />
            </div>
            <div class='signal-content'>
                <div v-if='currentTime' class='updatetime'>
                    {{ `${$t("signal.common.updateTime")}：${formatTime(currentTime, 'MM/DD HH:mm')} (${getUtcOffset()})` }}
                </div>
                <evaluatTable
                    :data='tableData'
                    data-ga-list='signal_IndicatorEv_listData_cl'
                    data-ga-trade='signal_IndicatorEv_tradeBtn_cl'
                    :skeleton-show='skeletonShow'
                />
                <div
                    v-show='page.index < pageTotal'
                    class='more'
                >
                    <van-button
                        class='btn-more'
                        data-ga='signal_IndicatorEv_moreBtn_cl'
                        :loading='loading'
                        :loading-text="$t('signal.common.viewMore')"
                        @click='handleMore'
                    >
                        {{ $t('signal.common.viewMore') }}
                    </van-button>
                </div>
            </div>
            <div ref='signalInfoRef' class='signal-info'>
                <h4>{{ $t('signal.valuable.evaluateInfo.what') }}</h4>
                <p>{{ $t('signal.valuable.evaluateInfo.whatDesc') }}</p>
                <h4>{{ $t('signal.valuable.operationMode') }}</h4>
                <p>{{ $t('signal.valuable.evaluateInfo.operationDesc') }}</p>
                <p>{{ $t('signal.valuable.evaluateInfo.operationDesc2') }}</p>
                <p class='tips'>
                    {{ $t('signal.valuable.evaluateInfo.tips') }}
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import { computed, toRefs, reactive, watch, ref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import classifyList from '@/plugins/signal/components/classify-list'
import useSignalAuth from '@/hooks/useSignalAuth'
import breadcrumb from '@/plugins/signal/components/breadcrumb.vue'
import signalIntroduce from '@/plugins/signal/components/signal-introduce.vue'
import axios from 'axios'
import evaluatTable from '@/plugins/signal/modules/evaluate/table.vue'
import { getTimestamp, getUtcOffset } from '@/plugins/signal/utils/getRelativeTime'
import useSignal from '@/plugins/signal/hooks/signal'

export default {
    components: {
        breadcrumb,
        classifyList,
        evaluatTable,
        signalIntroduce
    },
    setup () {
        useSignalAuth()
        const store = useStore()
        const { getEvaluateParams } = useSignal()
        const { t } = useI18n()
        const list = ref([])

        const state = reactive({
            page: {
                index: 1, // 当前页码
                size: 10, // 页码
            },
            loading: false, // 加载loading
            params: {
                sc: '',
                pe: '',
                limit: 100,
            },
            cancelToken: null,
            navList: [
                { name: t('signal.signal'), value: '/signal' },
                { name: t('signal.valuable.evaluate') }
            ], // 导航列表
            currentTime: null, // 最近更新时间
            skeletonShow: false, // 骨架
        })

        const signalInfoRef = ref(null)

        // 表格展示数据
        const tableData = computed(() => {
            return list.value.slice(0, state.page.size * state.page.index)
        })

        // 页数
        const pageTotal = computed(() => {
            return Math.ceil(list.value.length / state.page.size)
        })

        // 信号配置
        const config = computed(() => {
            return store.state._signal.config
        })

        // 周期配置
        const formatPeriod = computed(() => {
            return store.getters['_signal/getValuablePeriod']
        })

        // 初始化参数
        watch(() => config.value, newVal => {
            if (newVal && newVal.period && !state.params.pe) {
                const defaultEvaluate = getEvaluateParams()
                state.params = {
                    ...state.params,
                    ...defaultEvaluate,
                    pe: defaultEvaluate.pe || newVal.period[0].value
                }
            }
        }, { immediate: true })

        // 加载数据
        const loadData = (params) => {
            if (state.cancelToken) {
                state.cancelToken()
            }
            state.skeletonShow = true
            return store.dispatch('_signal/queryAssess', {
                params,
                cancelToken: new axios.CancelToken((c) => {
                    state.cancelToken = c
                })
            }).then(res => {
                if (params.sc === state.params.sc && state.params.pe === params.pe) {
                    list.value = res.data?.items || []
                    state.page.index = 1
                    state.currentTime = getTimestamp()
                    state.skeletonShow = false
                }
            }).catch(e => {})
        }

        watch(() => state.params, (params) => {
            if (params.pe) {
                // 保存条件
                getEvaluateParams(params)
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

        // 运作方式
        const handleTips = () => {
            window.scrollTo({
                top: signalInfoRef.value.offsetTop,
                left: 0,
                behavior: 'smooth',
            })
        }

        return {
            ...toRefs(state),
            config,
            handleMore,
            pageTotal,
            tableData,
            isPC: window.isPC,
            getUtcOffset,
            signalInfoRef,
            handleTips,
            formatPeriod
        }
    }
}

</script>

<style lang="scss" scoped>
@import '@/plugins/signal/style/signal.scss';
.signal-page-wrap {
    @media screen and (max-width: 1300px) {
        padding: 0;
    }
    @media screen and (max-width: 768px) {
        padding: 0 15px;
    }
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
            margin: 40px 0;
            @media screen and (max-width: 768px) {
                flex-direction: column;
                margin: 15px 0 0;
            }
            .classify-tabs {
                align-self: flex-end;
                border-left: 2px solid var(--lineColor);
                width: auto;
                @media screen and (max-width: 768px) {
                    width: 100%;
                    border-left: none;
                }
                padding-left: 30px;
                &:first-child {
                    padding-left: 0;
                    margin-right: 30px;
                    border-left: none;
                }
                .classify-list-2 .item {
                    font-size: 15px;
                }
                @media screen and (max-width: 768px) {
                    align-self: center;
                    margin-bottom: 20px;
                    padding-left: 0;
                    &:first-child {
                        margin-right: 0;
                    }
                }
            }
        }
        .signal-content {
            .updatetime {
                font-size: 15px;
                text-align: right;
                color: var(--minorColor);
                margin-bottom: 15px;
                @media screen and (max-width: 768px) {
                    font-size: 13px;
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
    }
}

</style>

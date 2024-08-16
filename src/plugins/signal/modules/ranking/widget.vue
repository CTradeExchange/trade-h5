<template>
    <div class='evaluate-widget'>
        <title-section
            v-if='isPC'
            :desc='$t("signal.valuable.rankingPopover")'
            :show-more='false'
            :title='$t("signal.valuable.ranking")'
            @handle-more='handleMore'
        >
            <template v-if='isPC' #more>
                <div class='evaluate-tab evaluate-tab-left'>
                    <classify-list
                        v-model='params.days'
                        :is-multiple='false'
                        :list='configDays'
                        :size='isPC ? "lg" : ""'
                        :style-type='1'
                        @input='handleSelect'
                    />
                </div>
            </template>
        </title-section>
        <div v-if='!isPC' class='evaluate-tab evaluate-tab-left'>
            <classify-list
                v-model='params.days'
                :is-multiple='false'
                :list='configDays'
                :style-type='1'
                @input='handleSelect'
            />
        </div>
        <Swiper
            :allow-touch-move='allowTouchMove'
            class='valuable-list'
            :initial-slide='defaultIndex'
            :threshold='20'
            @slideChange='handleSlideChange'
            @swiper='onSwiper'
        >
            <SwiperSlide
                v-for='(item, index) in configDays'
                :key='item.value'
            >
                <div class='signal-item signal-item-th'>
                    <div class='col col-index'>
                        #
                    </div>
                    <div class='col col-indicator'>
                        <span>{{ $t('signal.detail.indicator') }}</span>
                    </div>
                    <div class='col col-price'>
                        <span class='flex items-center'>
                            <div class='col-cumulative-profit'>
                                {{ $t('signal.valuable.cumulativeProfit') + "(USD)" }}
                            </div>
                            <popover
                                :text="$t('signal.valuable.rankingProfitPopover')"
                            />
                        </span>
                    </div>
                </div>
                <signal-list-skeleton
                    :limit='params.limit'
                    :list='list.items[index]'
                    :skeleton-show='list.skeletonShow[index]'
                >
                    <div
                        v-for='(sitem, sindex) in list.items[index]'
                        :key='sindex'
                        class='signal-item'
                        @click='hanleItem(sitem)'
                    >
                        <div class='col col-index'>
                            <span v-if='sindex+1 > 3' class='number'>
                                {{ sindex+1 }}
                            </span>
                            <div v-else class='number'>
                                <signal-ranking-icon :num='sindex+1' />
                            </div>
                        </div>
                        <div class='col col-indicator'>
                            <span class='signal-name'>
                                {{ sitem.i + '-' + getPeriodName(sitem.pe) }}
                            </span>
                            <product-icon
                                :symbol-code='sitem.sy'
                            />
                        </div>
                        <div class='col col-price'>
                            <Profit unit='' :value='sitem.tpnl' />
                            <div
                                v-show='!isPC'
                                class='signal-item-more'
                            >
                                <van-icon class='arrow' name='arrow' />
                            </div>
                            <van-button
                                v-if='isPC'
                                class='btn-option'
                                @click.stop='handleDetail(sitem)'
                            >
                                <span>
                                    {{ $t('signal.common.detail') }}
                                </span>
                                <van-icon class='icon-arrow' name='arrow' />
                            </van-button>
                            <!-- <div
                                v-show='!isPC'
                                class='signal-item-more'
                                @click.stop='handleSubscribe(sitem)'
                            >
                                <i class='icon icon_subscribed'></i>
                            </div>
                            <van-button
                                v-if='isPC'
                                class='btn-option'
                                @click.stop='handleSubscribe(sitem)'
                            >
                                {{ $t('signal.subscribe.subscribe') }}
                            </van-button> -->
                        </div>
                    </div>
                </signal-list-skeleton>
            </SwiperSlide>
        </Swiper>
        <div class='evaluate-tab'>
            <van-button
                class='plain-button'
                plain
                size='mini'
                type='primary'
                @click='handleMore'
            >
                <span>
                    {{ $t('signal.common.viewMore') }}
                </span>
            </van-button>
        </div>
    </div>
</template>

<script>
import { computed, ref, toRefs, reactive, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import classifyList from '@/plugins/signal/components/classify-list'
import productIcon from '@/plugins/signal/components/product-icon'
import signalListSkeleton from '@/plugins/signal/components/signal-list-skeleton'
import { toFixed } from '@/utils/calculation'
import titleSection from '@/plugins/signal/components/title-section'
import { Swiper } from 'swiper/vue/swiper'
import { SwiperSlide } from 'swiper/vue/swiper-slide'
import useSignal from '@/plugins/signal/hooks/signal'
import Profit from '@/plugins/signal/modules/signal-valuable-profit.vue'
import signalRankingIcon from '@/plugins/signal/components/signal-ranking-icon.vue'
import viewMore from '@/plugins/signal/components/view-more.vue'

export default {
    components: {
        Swiper,
        SwiperSlide,
        classifyList,
        productIcon,
        signalListSkeleton,
        titleSection,
        signalRankingIcon,
        Profit,
        viewMore
    },
    props: {
        // 允许手动滑动
        allowTouchMove: {
            type: Boolean,
            default: true
        }
    },
    setup (props) {
        // 信号配置
        const store = useStore()
        const router = useRouter()
        const isPC = window.isPC

        const { subscribeSignal, getRankingParams } = useSignal()

        const state = reactive({
            // 周期数据
            list: {
                items: [], // 列表
                skeletonShow: []
            },
            params: {
                limit: 3, // 最新3条
                i: '', // 指标
                sc: '', // 产品分类
                pe: '', // 周期
                days: '' // 最近7日或者最近30日
            },
            defaultIndex: 0, // 默认展示的swiper
        })
        const configDays = computed(() => {
            return store.state._signal.config.days
        })

        // 请求数据
        const loadData = (index) => {
            state.list.skeletonShow[index] = true
            return store.dispatch('_signal/queryPnl', {
                params: {
                    ...state.params,
                    days: configDays.value[index].value
                }
            }).then(res => {
                state.list.items[index] = res.data?.items || []
                state.list.skeletonShow[index] = false
            }).catch(e => {
                state.list.skeletonShow[index] = false
            })
        }

        // 初始化列表
        watch(() => configDays.value, (newVal) => {
            newVal.forEach((item, index) => {
                loadData(index)
            })
            // 初始化上次选中的值
            if (!state.params.days) {
                const params = getRankingParams()
                const index = newVal.findIndex((item) => item.value === params.days)
                const newIndex = index === -1 ? 0 : index
                state.defaultIndex = newIndex
                state.params.days = newVal[newIndex].value
            }
        }, { immediate: true })

        // 初始化swiper
        const mySwipe = ref(null)
        const onSwiper = (swiper) => {
            mySwipe.value = swiper
        }

        // 切换周期
        const handleSelect = (v) => {
            const index = configDays.value.findIndex(item => item.value === v)
            if (!mySwipe.value) return
            mySwipe.value.slideTo(index)
        }

        // 监听swiper变化
        const handleSlideChange = ({ realIndex }) => {
            state.params.days = configDays.value[realIndex].value
            // 缓存当前切换的周期
            getRankingParams({ sc: '', days: state.params.days })
        }

        // 周期名称
        const getPeriodName = (pe) => {
            return store.getters['_signal/getPeriodName'](pe)
        }

        // 点击更多
        const handleMore = () => {
            router.push({
                path: '/signal/ranking'
            })
        }

        // 点击列表
        const hanleItem = (item) => {
            router.push({
                path: '/signal/ranking/detail',
                query: {
                    id: item.id,
                    rtime: item.rtime,
                    tpnl: item.tpnl
                }
            })
        }

        const handleDetail = (item) => {
            router.push({
                path: '/signal/ranking/detail',
                query: {
                    id: item.id,
                    rtime: item.rtime,
                    tpnl: item.tpnl
                }
            })
        }

        // 订阅
        const handleSubscribe = (item) => {
            subscribeSignal({
                payload: {
                    ...item,
                    id: 'signal', // 必传
                },
                needConfirm: !isPC,
                type: 'quick',
            })
        }

        return {
            ...toRefs(state),
            configDays,
            toFixed,
            onSwiper,
            isPC,
            handleSelect,
            handleSlideChange,
            getPeriodName,
            handleMore,
            hanleItem,
            handleDetail,
            handleSubscribe
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/plugins/signal/style/signal.scss';
.evaluate-widget {
    min-height: 225px;
    @media screen and (max-width: 768px) {
        min-height: auto;
    }
    .signal-item {
        min-height: 60px;
        @media screen and (max-width: 768px) {
            min-height: 50px;
        }
        &.signal-item-th {
            min-height: 30px;
        }
        .col {
            &.col-index {
                flex: 0.4;
                @media screen and (max-width: 1199px) {
                    flex: 0.35;
                }
                .ranking-icon {
                    width: 18px;
                    display: flex;
                    img {
                        max-width: 100%;
                        display: block;
                    }
                }
            }
            &.col-indicator {
                flex: 0.6;
                flex-direction: column;
                justify-content: center;
                align-items: flex-start;
                .signal-name {
                    font-size: 16px;
                    margin-bottom: 2px;
                    font-weight: bold;
                    @media screen and (max-width: 1199px) {
                        font-size: 13px;
                    }
                }
                .symbol-name {
                    :deep {
                        .icon img {
                            width: 0.4rem;
                            height: 0.4rem;
                        }
                    }
                }
            }
            &.col-price {
                justify-content: space-between;
            }
            &.col-option {
                flex: none;
                min-width: 80px;
            }
            @media screen and (max-width: 1199px) {
                &.col-option {
                    display: none;
                }
            }
            @media screen and (max-width: 768px) {
                &.col-option {
                    display: flex;
                    min-width: 25px;
                }
                .col-cumulative-profit {
                    overflow: auto;
                    text-overflow: initial;
                    white-space: normal;
                }
            }
            .number {
                display: inline-flex;
                justify-content: center;
                :deep {
                    svg {
                        width: 32px;
                        height: 32px;
                    }
                }
            }
            .btn-option {
                background-color: var(--contentColor);
                border-color: var(--primary);
                color: var(--primary);
                font-size: 12px;
                height: 25px;
                margin-left: 15px;
                min-width: 110px;
                display: flex;
                align-items: center;
                justify-content: center;
                &:hover {
                    opacity: 0.8;
                }
            }
        }
        .signal-item-more {
            min-width: 40px;
        }
        :deep {
            .symbol-code {
                font-size: 12px;
                color: var(--normalColor);
            }
        }
    }
    .evaluate-tab {
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: 15px;
        .plain-button {
            min-width: 150px;
            padding: 8px 4px;
            font-size: 14px;
            height: auto;
            .icon-arrow {
                margin-left: 8px;
            }
            &:hover {
                opacity: 0.8;
            }
        }
        &.evaluate-tab-left {
            padding-top: 6px;
            padding-bottom: 12px;
            justify-content: flex-start;
        }
        :deep {
            .classify-tabs {
                width: auto;
            }
        }
    }
    :deep {
        .list-skeleton,
        .none-data-text {
            min-height: 135px;
        }
    }
}
</style>

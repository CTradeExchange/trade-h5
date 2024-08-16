<template>
    <div class='evaluate-widget'>
        <title-section
            v-if='isPC'
            :desc='$t("signal.valuable.evaluatePopover")'
            placement='top-start'
            :show-more='false'
            :title='$t("signal.valuable.evaluate")'
            @handle-more='handleMore'
        >
            <template v-if='isPC' #more>
                <div class='evaluate-tab evaluate-tab-left'>
                    <classify-list
                        v-model='params.pe'
                        :is-multiple='false'
                        :list='formatPeriod'
                        :size='isPC ? "lg" : ""'
                        :style-type='1'
                        @input='handleSelect'
                    />
                </div>
            </template>
        </title-section>
        <div v-if='!isPC' class='evaluate-tab evaluate-tab-left'>
            <classify-list
                v-model='params.pe'
                :is-multiple='false'
                :list='formatPeriod'
                :size='isPC ? "lg" : ""'
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
                v-for='(item, index) in formatPeriod'
                :key='item.value'
            >
                <div class='signal-item signal-item-th'>
                    <div class='col col-product-icon'>
                        <span> {{ $t('signal.detail.product') }}</span>
                    </div>
                    <div class='col col-ratio'>
                        <span> {{ $t('signal.common.proportion') }}</span>
                    </div>
                    <div class='col'>
                        <span> {{ $t('signal.common.summary') }}</span>
                    </div>
                </div>
                <signal-list-skeleton
                    :limit='params.limit'
                    :list='periods.list[index]'
                    :skeleton-show='periods.skeletonShow[index]'
                >
                    <div
                        v-for='(sitem, sindex) in periods.list[index]'
                        :key='sindex'
                        class='signal-item'
                        @click='hanleItem(sitem)'
                    >
                        <div class='col col-product-icon'>
                            <product-icon :symbol-code='sitem.sy' />
                        </div>
                        <div class='col col-ratio'>
                            <signal-progress :item='sitem' />
                        </div>
                        <div class='col'>
                            <signal-direction
                                :check-neutral='true'
                                :direction='sitem?.summary'
                                :is-summary='true'
                            />
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
import classifyList from '@/plugins/signal/components/classify-list'
import productIcon from '@/plugins/signal/components/product-icon'
import signalDirection from '@/plugins/signal/components/signal-direction.vue'
import signalListSkeleton from '@/plugins/signal/components/signal-list-skeleton'
import { toFixed } from '@/utils/calculation'
import titleSection from '@/plugins/signal/components/title-section'
import { Swiper } from 'swiper/vue/swiper'
import { SwiperSlide } from 'swiper/vue/swiper-slide'
import { useRouter } from 'vue-router'
import useSignal from '@/plugins/signal/hooks/signal'
import signalProgress from '@/plugins/signal/components/progress'

export default {
    components: {
        Swiper,
        SwiperSlide,
        classifyList,
        productIcon,
        signalDirection,
        signalListSkeleton,
        titleSection,
        signalProgress
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
        const { getEvaluateParams } = useSignal()
        const state = reactive({
            // 周期数据
            periods: {
                list: [],
                skeletonShow: []
            },
            params: {
                limit: 3, // 最新3条
                sc: '', // 所有分类
                pe: '', // 周期
            },
            defaultIndex: 0 // 默认展示的swiper
        })
        const config = computed(() => {
            return store.state._signal.config
        })

        // 过滤后的周期
        const formatPeriod = computed(() => {
            return config.value.period.filter(item => {
                return ['15m', '1h', '1d'].includes(item.value)
            })
        })

        // 通过周期请求数据
        const loadData = (index) => {
            state.periods.skeletonShow[index] = true
            return store.dispatch('_signal/queryAssess', {
                params: {
                    ...state.params,
                    pe: formatPeriod.value[index].value
                }
            }).then(res => {
                state.periods.list[index] = res.data?.items || []
                state.periods.skeletonShow[index] = false
            }).catch(e => {
                state.periods.skeletonShow[index] = false
            })
        }

        // 初始化列表
        watch(() => formatPeriod.value, (newVal) => {
            newVal.forEach((item, index) => {
                loadData(index)
                // 初始化第一个值
                if (index === 0) {
                    state.params.pe = item.value
                }
            })
            // 初始化上次选中的值
            if (!state.params.days) {
                const params = getEvaluateParams()
                const index = newVal.findIndex((item) => item.value === params.pe)
                const newIndex = index === -1 ? 0 : index
                state.defaultIndex = newIndex
                state.params.pe = newVal[newIndex].value
            }
        }, { immediate: true })

        // 初始化swiper
        const mySwipe = ref(null)
        const onSwiper = (swiper) => {
            mySwipe.value = swiper
        }

        // 切换周期
        const handleSelect = (v) => {
            const index = formatPeriod.value.findIndex(item => item.value === v)
            if (!mySwipe.value) return
            mySwipe.value.slideTo(index)
        }

        // 监听swiper变化
        const handleSlideChange = ({ realIndex }) => {
            state.params.pe = formatPeriod.value[realIndex].value
            // 缓存当前周期
            getEvaluateParams({ sc: '', pe: state.params.pe })
        }

        // 更多
        const handleMore = () => {
            router.push({
                path: '/signal/evaluate'
            })
        }

        // 点击列表
        const hanleItem = (item) => {
            router.push({
                path: '/signal/evaluate/detail',
                query: {
                    sy: item.sy
                }
            })
        }

        return {
            ...toRefs(state),
            config,
            formatPeriod,
            toFixed,
            onSwiper,
            isPC: window.isPC,
            handleSelect,
            handleSlideChange,
            handleMore,
            hanleItem
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
    .evaluate-content {
        display: flex;
        flex-direction: column;
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
            @media screen and (max-width: 1200px) {
                flex: none;
                min-width: 60px;
            }
            &.colPrimary {
                color: var(--primary);
            }
            &.col-product-icon {
                flex: 1.4;
                @media screen and (max-width: 768px) {
                    flex: 1;
                }
            }
            &.col-ratio {
                flex: 2;
                @media screen and (max-width: 768px) {
                    flex: 1.4;
                }
                .progress {
                    width: 100%;
                }
            }
            .num {
                margin-right: 12px;
            }
        }
    }
    .evaluate-tab {
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: 15px;
        &.evaluate-tab-left {
            padding-top: 6px;
            padding-bottom: 12px;
            justify-content: flex-start;
        }
        .classify-tabs {
            width: auto;
        }
        .plain-button {
            min-width: 150px;
            padding: 8px 4px;
            font-size: 14px;
            line-height: normal;
            height: auto;
            .icon-arrow {
                margin-left: 8px;
                line-height: normal;
            }
            &:hover {
                opacity: 0.8;
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

<template>
    <div class='signal-case'>
        <div class='title-warp'>
            <div class='signal-wifi'>
                <h2 class='title' data-aos='fade-up'>
                    {{ $t('homeJD.tradingSignalTitle') }}
                </h2>
                <div class='wifi'>
                    <banner-wifi />
                </div>
            </div>

            <p class='title-label' data-aos='fade-up' data-aos-delay='200'>
                {{ $t('homeJD.tradingSignalDesc') }}
            </p>
        </div>
        <div class='tab'>
            <van-tabs
                v-model:active='tabValue'
                class='tabs'
                @click-tab='onClickTab'
            >
                <van-tab
                    v-for='(item, index) in tabs'
                    :key='index'
                    :name='item.value'
                    :title='item.name'
                />
            </van-tabs>
        </div>
        <div class='content'>
            <van-popover
                v-if='tabValue === "newest"'
                class='homeTradeSignalPopover'
                :close-on-click-action='false'
                :close-on-click-outside='false'
                :close-on-click-overlay='false'
                :offset='[8, 0]'
                placement='top-end'
                :show='popoverVisible'
                theme='dark'
            >
                <div class='popover-content'>
                    <p class='popover_text'>
                        {{ $t('signal.subscribe.subscribeConfirmTips') }}
                    </p>
                    <van-icon name='cross' @click='handleCloseTips' />
                </div>
                <template #reference>
                    <newest-signal
                        class='newest-signal'
                        :item-type='isPC ? 11 : 0'
                        :limit='6'
                        :show-thead='true'
                        :show-title='false'
                        @load-data-complete='handleComplete'
                    >
                        <template #footer>
                            <tips />
                            <view-more @click='handleFeatured'>
                                <span data-ga-signal='signal_home_viewMoreSignalBtn_cl,home_viewMoreSignalBtn'>
                                    {{ $t('homeJD.viewMoreSignal') }}
                                </span>
                                <van-icon class='arrow' name='arrow' />
                            </view-more>
                        </template>
                    </newest-signal>
                </template>
            </van-popover>
            <home-product
                v-else-if='tabValue === "product"'
                :limit='4'
                :signal-type='tabValue'
            />
            <home-list
                v-else
                :key='tabValue'
                :limit='6'
                :signal-type='tabValue'
            />
        </div>
    </div>
</template>

<script>
// 首页响应式交易信号
import { computed, watch, reactive, toRefs, provide, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import newestSignal from '@/plugins/signal/modules/newest-signal.vue'
import homeList from '@/plugins/signal/modules/home/home-list.vue'
import homeProduct from '@/plugins/signal/modules/home/home-product.vue'
import viewMore from '@/plugins/signal/components/view-more.vue'
import { localGet, localSet } from '@/utils/util'
import useSignal from '@/plugins/signal/hooks/signal'
import bannerWifi from '@/themeCommon/components/signalWifi.vue'
import tips from '@/plugins/signal/modules/home/home-tip.vue'

export default {
    components: {
        newestSignal,
        homeList,
        homeProduct,
        viewMore,
        bannerWifi,
        tips
    },
    setup () {
        const router = useRouter()
        const store = useStore()
        const { t, locale } = useI18n({ useScope: 'global' })

        // 初始化上一次订阅的弹窗
        const { initSubscribeConfirm } = useSignal()

        // tabs分类
        const state = reactive({
            tabs: [
                {
                    name: t('signal.tab.newest'),
                    value: 'newest',
                    ga: 'signal_homeSignal_latestTab_cl'
                },
                {
                    name: t('signal.tab.quota'),
                    value: 'indicator',
                    ga: 'signal_homeSignal_byIndicatorsTab_cl'
                }, {
                    name: t('signal.tab.signal'),
                    value: 'signal',
                    ga: 'signal_homeSignal_bySignalsTab_cl'
                }, {
                    name: t('signal.tab.diretcion'),
                    value: 'diretcion',
                    ga: 'signal_homeSignal_byAdvicesTab_cl'
                }, {
                    name: t('signal.tab.product'),
                    value: 'product',
                    ga: 'signal_homeSignal_byProductsTab_cl'
                }, {
                    name: t('signal.tab.period'),
                    value: 'period',
                    ga: 'signal_homeSignal_byPeriodsTab_cl'
                }
            ],
            tabValue: ''
        })
        const isDemo = computed(() => store.state._user.customerInfo?.companyType === 'demo')
        const tabSignalValue = computed(() => {
            return store.state._signal.homeTabSignalValue
        })

        const newestRef = ref(null)
        const popoverVisible = ref(false)
        // 初始化信号弹窗
        const handleComplete = () => {
            const visible = localGet('homeTradeSignalPopover')
            if (visible !== 'false' && !window.isPC) {
                popoverVisible.value = true
            }
        }
        // 关闭信号弹窗
        const handleCloseTips = () => {
            popoverVisible.value = false
            localSet('homeTradeSignalPopover', 'false')
        }
        // 监听弹窗开关
        watch(() => tabSignalValue.value, newVal => {
            state.tabValue = newVal || state.tabs[0].value
        }, { immediate: true })

        // 初始化tab
        watch(() => tabSignalValue.value, newVal => {
            state.tabValue = newVal || state.tabs[0].value
        }, { immediate: true })

        // 更新tab值
        watch(() => state.tabValue, (type) => {
            store.commit('_signal/Update_homeSignalValue', {
                type
            })
        })

        // 更多
        const handleFeatured = () => {
            router.push('/signal')
        }

        // tab切换埋点
        const onClickTab = (value) => {
        }

        // 注入点击信号列表方法
        provide('handleSignalItemClick', (item) => {
        })

        // 点击列表订阅事件
        provide('handleSignalSubscribeClick', (item) => {
        })

        // 点击列表详情事件
        provide('handleSignalDetailClick', (item) => {
        })

        onMounted(() => {
            initSubscribeConfirm()
        })

        return {
            ...toRefs(state),
            isDemo,
            handleFeatured,
            isPC: window.isPC,
            newestRef,
            popoverVisible,
            handleComplete,
            handleCloseTips,
            locale,
            onClickTab
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/plugins/signal/style/signal.scss';
.tab {
    margin-top: 24px;
    display: flex;
    justify-content: center;
    border-bottom: 1px solid var(--lineColor);
    overflow: hidden;
    :deep {
        .van-tabs__line {
            height: 2px;
            background: var(--primary) !important;
        }
        .van-tabs {
            width: calc(100% + 24px);
        }
        .van-tab {
            color: var(--mainColor);
            font-weight: normal;
            font-size: rem(28px);
            line-height: rem(60px);
            &.van-tab--active,
            &:hover {
                color: var(--primary);
            }
            .van-tab__text {
                color: unset;
            }
        }
    }
    @media (min-width: 768px) {
        margin-top: 48px;
        :deep {
            .van-tabs {
                width: auto;
            }
            .van-tab {
                font-size: 20px;
                padding-bottom: 8px;
                font-weight: 600;
                margin: 0 15px 10px;
            }
        }
    }
}
.content {
    position: relative;
    :deep {
        .van-popover__wrapper {
            display: block;
        }
    }
    .newest-signal {
        padding: 4px 0;
        position: relative;
        &:deep {
            .arrow {
                line-height: normal;
                margin-left: 8px;
            }
        }
    }
}
.signal-case {
    .title-warp {
        .signal-wifi {
            display: flex;
            justify-content: center;
            .wifi {
                margin-top: -40px;
                margin-left: 10px;
                @media (max-width: 768px) {
                    margin-left: 4px;
                    margin-top: -30px;
                    :deep {
                        .wifi-symbol {
                            width: 30px;
                            height: 30px;
                        }
                    }
                }
            }
        }
        .title {
            color: var(--mainColor);
            line-height: 56px;
            text-align: center;
            font-size: 48px;
            font-weight: bold;
        }
        .title-label {
            text-align: center;
            color: var(--normalColor);
            font-size: 18px;
            max-width: 800px;
            line-height: 20px;
            margin: 32px auto 0;
        }
    }
    :deep {
        .signal-item {
            margin: 0 -12px;
        }
        .product-item {
            padding-left: 0;
            padding-right: 0;
            margin-bottom: 0;
        }
    }
}
:deep(.classify-tabs-pc) {
    justify-content: center;
    .classify-container {
        flex: none;
    }
}

@media (min-width: 768px) {
    .content {
        padding-top: 10px;
        .newest-signal {
            padding: 0;
        }
    }
}
</style>

<!-- h5样式 -->
<style lang="scss" scoped>
.h5 {
    .signal-case {
        .title-warp {
            .title {
                font-size: rem(48px);
                line-height: rem(72px);
            }
            .title-label {
                font-size: rem(28px);
                margin-top: rem(32px);
            }
        }
    }
    .content {
        &:deep {
            .viewMore {
                a {
                    font-size: 14px;
                    border: 1px solid var(--primary);
                    border-radius: 8px;
                }
            }
        }
    }
}
</style>

<style lang="scss">
.homeTradeSignalPopover {
    z-index: 1 !important;
    .popover-content {
        width: 312px;
        display: flex;
        background: #4C5260;
        color: #FFF;
        padding: 10px;
        font-size: 12px;
        line-height: 1.5;
        p {
            white-space: break-spaces;
        }
    }
    &[data-popper-placement=top-end] .van-popover__arrow {
        bottom: 1px;
        right: 2px;
        color: #4C5260;
    }
    .van-icon-cross {
        cursor: pointer;
        margin-left: 10px;

    }
}
</style>

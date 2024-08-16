<template>
    <div class='signal-mine' :class="['signal-mine-' + $route.name]">
        <template v-if='isRealAccount'>
            <!-- 提示 -->
            <template v-if="isShowListPage && scenes !== 'productDetail'">
                <mine-tg-notice />
            </template>

            <div v-if='!$isPC' class='signal-mine-head'>
                <van-button
                    block
                    class='flex-1 mr-3'
                    :data-ga-signal="
                        scenes === 'productDetail'
                            ? 'signal_bigQuoteMySiganlTop_subBtn_cl,bigQuoteMySiganlTop_subBtn'
                            : 'signal_signalsMySignalsTop_subBtn_cl,signalsMySignalsTop_subBtn'
                    "
                    size='small'
                    type='primary'
                    @click='handleSubscribe'
                >
                    {{
                        (isPC && scenes === 'productDetail') || !isPC
                            ? $t('signal.subscribe.subscribe')
                            : $t('signal.subscribe.freeSubscribeSignal')
                    }}
                </van-button>
                <van-button
                    class='flex-1'
                    :data-ga-signal="
                        scenes === 'productDetail' ? 'signal_bigQuoteMySignals_mySubBtn_cl' : 'signal_signalsMySignals_mySubBtn_cl'
                    "
                    plain
                    size='small'
                    type='primary'
                    @click='handleDrawerSubscribe'
                >
                    {{ $t('signal.subscribe.manageMySignals') }}
                </van-button>
            <!-- <tg-subscribe
                    v-if='scenes !== "productDetail"'
                    data-ga-signal='signal_signalsMySignals_tgBtn_cl'
                    :is-link='true'
                >
                    <i class='icon_telegram_outline iconfont'></i>
                    <span v-if='(scenes === "productDetail" && !isPC) || isPC'>
                        {{ $t('signal.subscribe.tgSignalSubscribe') }}
                    </span>
                    <van-icon class='arrow' name='arrow' />
                </tg-subscribe> -->
            </div>
        </template>
        <div v-if='!customerInfo' class='signal-mine-info'>
            <div class='content'>
                <p>{{ $t('signal.subscribe.welcomeLogin') }}</p>
            </div>
            <div class='option'>
                <van-button block type='primary' @click="handleLoginOrRegister('login')">
                    {{ `${$t('c.login')} / ${$t('c.register')}` }}
                </van-button>
            </div>
        </div>
        <div v-else-if='!isRealAccount' class='signal-mine-info'>
            <div class='content'>
                <p>
                    {{ $t('signal.subscribe.demoAccountTips') }}
                </p>
                <div class='option'>
                    <van-button class='btn-subscribe' type='primary' @click='handleSubscribe'>
                        {{ $t('signal.subscribe.toReal') }}
                    </van-button>
                </div>
            </div>
        </div>

        <div v-if='subscribeList.total === 0' class='signal-mine-info'>
            <div class='content'>
                <p>
                    {{ $t('signal.subscribe.welconeSubscribe') }}
                </p>
            </div>
            <div class='option'>
                <van-button
                    class='btn-subscribe'
                    :data-ga-signal="
                        scenes === 'productDetail'
                            ? 'signal_bigQuoteMySiganlCen_subBtn_cl,bigQuoteMySiganlCen_subBtn'
                            : 'signal_signalsMySignalsCent_subBtn_cl,signalsMySignalsCent_subBtn'
                    "
                    size='small'
                    type='primary'
                    @click='handleSubscribe'
                >
                    <span>{{ $t('signal.subscribe.freeSubscribeSignal') }}</span>
                    <van-icon class='arrow' name='arrow' />
                </van-button>
            </div>
        </div>
        <template v-if='isShowListPage'>
            <div class='bg-contentColor flex-1 flex flex-col overflow-hidden'>
                <van-tabs v-if='!$isPC' v-model:active='mySignalsType' class='mb-2'>
                    <van-tab name='lastest'>
                        <template #title>
                            {{ $t('signal.newestSignal') }}
                        </template>
                    </van-tab>
                    <van-tab name='product'>
                        <template #title>
                            {{ $t('signal.productSignals') }}
                        </template>
                    </van-tab>
                </van-tabs>
                <mineSignalCollapse v-if="mySignalsType === 'product'&& !isPC" />
                <template v-else>
                    <mine-signal v-if='isPC' scenes='productDetail' />
                    <div v-else class='mine-signal'>
                        <mine-signal scenes='productDetail' />
                    </div>
                </template>
            </div>
        </template>
    </div>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
// 订阅信息
import mineSignalCollapse from './subscribe/mine-signal-collapse.vue'
// 我的订阅
import mineTgNotice from './subscribe/mine-tg-notice.vue'
import mineSignal from './subscribe/mine-signal.vue'
import mitt from '@/utils/mitt'
import skeleton from '@/plugins/signal/components/skeleton'
import { isUniapp, localGet, localSet } from '@/utils/util'

const StorageKey = 'mineSignalTabValue'

export default {
    components: {
        skeleton,
        mineTgNotice,
        mineSignalCollapse,
        mineSignal,
    },
    props: {
        scenes: String, // productDetail 代表交易详情页面
    },
    emits: ['manageMySignals', 'subscribeSignal'],
    setup (props, { emit }) {
        const route = useRoute()
        const router = useRouter()
        const store = useStore()
        // 当前选择的分类
        const mySignalsType = ref(localGet(StorageKey) || 'lastest')
        // 用户信息
        const customerInfo = computed(() => store.state._user.customerInfo)

        // 是否真实账户
        const isRealAccount = computed(() => {
            return customerInfo.value?.companyType && customerInfo.value.companyType === 'real'
        })
        // 订阅列表和是否已加载
        const subscribeList = computed(() => {
            return {
                total: store.state._signal.subscribeList.length,
                isLoadSubscribe: store.state._signal.isLoadSubscribe,
            }
        })

        // 更新红点
        watch(
            () => mySignalsType.value,
            (newVal) => {
                localSet(StorageKey, newVal)
            },
            { immediate: true },
        )

        // 登录/注册
        const handleLoginOrRegister = (type) => {
            if (type === 'register') {
                router.push('/register')
                return
            }
            router.push({
                name: 'Login',
                query: {
                    back: route.fullPath,
                },
            })
        }
        // 我的订阅页面
        const handleDrawerSubscribe = () => {
            // 我的订阅
            if (isUniapp && window.uni) {
                window.uni.postMessage({
                    data: {
                        action: 'message',
                        type: 'handleDrawerSubscribe',
                    },
                })
            }
            emit('manageMySignals')
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
                emit('subscribeSignal')
            } else {
                mitt.emit('SwitchAccount', 'real')
            }
        }
        // 是否显示列表页
        const isShowListPage = computed(() => {
            return customerInfo.value && isRealAccount.value && subscribeList.value.isLoadSubscribe && subscribeList.value.total > 0
        })
        // 已绑定telegram信息
        const isBindTelegram = computed(
            () =>
                store.state._user.thirdAccountInfo?.thirdLoginSource &&
                store.state._user.thirdAccountInfo?.thirdLoginSource?.includes('telegram'),
        )

        onMounted(() => {
            !isBindTelegram.value && customerInfo.value && store.dispatch('_user/findThirdAccountInfo')
            store.dispatch('_signal/queryTGInfo')
            store.dispatch('_signal/queryAllQuotaIndicatorSub')
        })

        return {
            customerInfo,
            subscribeList,
            handleLoginOrRegister,
            handleDrawerSubscribe,
            handleSubscribe,
            isRealAccount,
            isShowListPage,
            isPC: window.isPC,
            mySignalsType,
        }
    },
}
</script>

<style lang="scss" scoped>
.signal-mine-head {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    background: var(--contentColor);
    padding-bottom: 0 !important;
    :deep {
        .tg-subscribe-link {
            cursor: pointer;
            margin-left: 24px;
            .arrow {
                display: none;
            }
            @media screen and (max-width: 768px) {
                margin-left: 14px;
            }
        }
    }
}

:deep {
    .van-button--mini.btn-subscribe {
        margin-right: 0;
    }
}
.btn-subscribe {
    padding: 0 20px;
    font-size: 14px;
    min-height: 30px;
    :deep(.van-button__content) {
        line-height: normal;
    }
    &:hover {
        opacity: 0.9;
    }
    .arrow {
        margin-left: 8px;
        line-height: normal;
    }
}
.btn-subscribe-link {
    cursor: pointer;
    margin-left: 24px;
    :deep {
        .orders {
            font-size: 18px;
            line-height: normal;
        }
        .arrow {
            display: none;
            line-height: normal;
            margin-left: 8px;
        }
    }
    @media screen and (max-width: 768px) {
        margin-left: 14px;
        :deep {
            .orders {
                font-size: 16px;
                line-height: normal;
            }
        }
    }
    &:hover {
        color: var(--primary);
    }
    .link-text {
        margin-left: 4px;
    }
}
.signal-mine-info {
    width: 350px;
    margin: 80px auto;
    .content {
        font-size: 14px;
        line-height: 24px;
        text-align: center;
    }
    .option {
        margin: 50px 0;
        button {
            width: 100%;
            cursor: pointer;
            height: 40px;
            padding: 0 10px;
            font-size: 14px;
            color: var(--primary);
            border-radius: 4px;
            background-color: transparent;
            border: 1px solid var(--primary);
            margin-bottom: 20px;
            &:last-child {
                color: #fff;
                background-color: var(--primary);
            }
        }
    }
}
:deep {
    .tg-subscribe-link {
        .icon_telegram_outline {
            font-size: 18px;
            margin-right: 4px;
        }
        .arrow {
            line-height: normal;
            margin-left: 8px;
        }
        &:hover {
            color: var(--primary);
        }
    }
}

@media screen and (max-width: 768px) {
    .signal-mine {
        display: flex;
        flex-direction: column;
        flex: 1;
        &.signal-mine-blank {
            flex: 1;
            display: flex;
            flex-direction: column;
            margin: 6px 8px 0;
            background: var(--contentColor);
            padding: 15px;
            border-radius: 4px;
            .signal-mine-head {
                padding-right: 0;
            }
        }
        // overflow: hidden;
    }
    .signal-mine-head {
        padding-bottom: 12px;
        :deep {
            .tg-subscribe-link {
                margin-left: 14px;
                i {
                    font-size: 18px;
                }
            }
        }
    }
    .signal-mine-info {
        width: auto;
        padding: 0 20px;
        .content {
            font-size: 14px;
            line-height: 22px;
        }
    }
}
.signal-mine-Signal {
    .signal-mine-head {
        :deep {
            .tg-subscribe-link {
                @media screen and (min-width: 800px) {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0 20px;
                    height: 30px;
                    color: var(--primary);
                    border: 1px solid var(--primary);
                    border-radius: 4px;
                    cursor: pointer;
                    &:hover {
                        opacity: 0.9;
                    }
                    .arrow {
                        display: inline-block;
                    }
                }
            }
        }
    }
    .btn-subscribe-link {
        @media screen and (min-width: 800px) {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0 20px;
            height: 30px;
            color: var(--primary);
            border: 1px solid var(--primary);
            border-radius: 4px;
            cursor: pointer;
            &:hover {
                opacity: 0.9;
            }
            :deep {
                .orders {
                    font-size: 18px;
                    line-height: normal;
                }
                .arrow {
                    display: inline-block;
                }
            }
        }
    }
}
.h5 {
    .mine-signal {
        height: 400px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }
}
</style>

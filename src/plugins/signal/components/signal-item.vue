<template>
    <div
        class='signal-item signal-item-bg van-hairline--bottom'
        :class="[isExpiredStyle ? 'signal-item-expired' : '', signalItemBg, itemType === 3 ? 'signal-item-block' : '']"
        @animationend='animationend'
        @click='goDetail()'
        @mouseenter='handleMouse($event)'
        @mouseleave='handleMouseleave($event)'
    >
        <template v-if='itemType === 2'>
            <!-- 产品列表 -->
            <div class='col'>
                <span>{{ getRelativeTime(signal.t) }}</span>
            </div>
            <template v-if='isPC'>
                <div class='col justify-center'>
                    <div>
                        <span class='text-bold'>
                            {{ indicatorName }}
                        </span>
                        <p class='text-desc'>
                            {{ signalName }}
                        </p>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class='col justify-center'>
                    <span>{{ indicatorName }}</span>
                </div>
                <div class='col'>
                    <span>
                        {{ signalName }}
                    </span>
                </div>
            </template>
            <div class='direction'>
                <signal-direction :direction='signal.a' />
            </div>
        </template>
        <template v-else-if='itemType === 3'>
            <!-- 块状 -->
            <div class='signal-block'>
                <div class='signal-block-warp'>
                    <div class='signal-block-head'>
                        <div class='signal-col'>
                            <div class='label'>
                                {{ signal.i }}
                            </div>
                            <div class='value'>
                                {{ signalName }}
                            </div>
                        </div>
                        <div class='signal-col signal-block-center'>
                            <div class='label time'>
                                {{ getRelativeTime(signal.t) }}
                            </div>
                            <div class='value'>
                                <signal-direction :direction='signal.a' />
                            </div>
                        </div>
                        <div class='signal-col signal-block-right'>
                            <div class='label'>
                                <product-icon class='signal-block-symbol' :symbol-code='signal.sy' />
                            </div>
                        </div>
                    </div>
                    <div class='signal-block-footer'>
                        <div class='signal-col'>
                            <div class='label'>
                                {{ $t('signal.timePeriod') }}
                            </div>
                            <div>
                                <span>{{ periodName }}</span>
                            </div>
                        </div>
                        <div class='signal-col signal-block-center'>
                            <div class='label'>
                                {{ $t('signal.detail.triggerPrice') }}
                            </div>
                            <div>
                                <span>{{ pr }}</span>
                            </div>
                        </div>
                        <div class='signal-col signal-block-right'>
                            <div class='label'>
                                {{ $t('signal.detail.newPrice') }}
                            </div>
                            <div :class='product.cur_color'>
                                <span>{{ product.cur_price || '--' }}</span>
                            </div>
                        </div>
                    </div>
                    <div class='signal-block-option py-2'>
                        <!-- <van-button
                            class='plain-button mr-3'
                            plain
                            size='small'
                            type='primary'
                            @click.stop='handleSubscribe()'
                        >
                            {{ $t('signal.subscribe.freeSubscribe') }}
                        </van-button> -->
                        <van-button class='plain-button' plain size='small' type='primary' @click.stop='handleDetail()'>
                            {{ $t('signal.detail.detail') }}
                        </van-button>
                    </div>
                </div>
            </div>
        </template>
        <template v-else-if='itemType === 4'>
            <div class='col'>
                <span>{{ getRelativeTime(signal.t) }}</span>
            </div>
            <div class='col justify-center'>
                <span>{{ indicatorName }}</span>
            </div>
            <div class='col'>
                <signal-direction :direction='signal.a' />
            </div>
        </template>
        <template v-else-if='itemType === 5'>
            <div class='col'>
                <span>{{ getRelativeTime(signal.t) }}</span>
            </div>
            <div class='col justify-center'>
                <span>
                    {{ product.symbolName || signal.sy }}
                </span>
            </div>
            <div class='col justify-center'>
                <span>{{ indicatorName }}</span>
            </div>
            <div class='col justify-end'>
                <signal-direction :direction='signal.a' />
            </div>
        </template>
        <template v-else-if='itemType === 11'>
            <div class='col'>
                <span>{{ getRelativeTime(signal.t) }}</span>
            </div>
            <div class='col justify-center'>
                <div>
                    <span class='text-bold'>
                        {{ indicatorName }}
                    </span>
                    <p class='text-desc'>
                        {{ signalName }}
                    </p>
                </div>
            </div>
            <div class='col justify-center'>
                <signal-direction :direction='signal.a' />
            </div>
            <div class='col justify-center'>
                <span>
                    {{ pr }}
                </span>
            </div>
            <div class='col col-symbol-name col-multiple'>
                <div class='flex items-center'>
                    <product-icon :show-symbol-name='false' :symbol-code='signal.sy' />
                    <div>
                        <span class='text-bold'>
                            {{ product.symbolName || signal.sy }}
                        </span>
                        <p class='text-desc' :class='product.cur_color'>
                            {{ product.cur_price || '--' }}
                        </p>
                    </div>
                </div>
            </div>
            <!-- <div class='col'>
                <span>
                    {{ signalDesc }}
                </span>
            </div>
            <div class='col'>
                <span>
                    {{ productCateName }}
                </span>
            </div> -->
        </template>
        <template v-else>
            <div class='col col-times'>
                <span>{{ getRelativeTime(signal.t) }}</span>
            </div>
            <div class='col justify-center'>
                <span>{{ indicatorName }}</span>
            </div>
            <div class='col justify-center'>
                <signal-direction :direction='signal.a' />
            </div>
            <div class='col justify-center'>
                <product-icon :symbol-code='signal.sy' />
            </div>
        </template>
        <!-- 订阅、箭头图标 [移动端不显示订阅] -->
        <template v-if='itemType === 11 || (isPC && itemType === 2)'>
            <div class='col col-option'>
                <tg-subscribe v-if='showTg === true' :data-ga-signal='gaTg' :data-ga-signal-item='signal'>
                    <span>{{ $t('signal.common.tgPush') }}</span>
                    <van-icon class='icon-arrow' name='arrow' />
                </tg-subscribe>
                <van-button v-if='showTrade === true' class='plain-button' plain size='mini' type='primary' @click.stop='goTrade'>
                    <span>
                        {{ $t('signal.common.trade') }}
                    </span>
                    <van-icon class='icon-arrow' name='arrow' />
                </van-button>
                <van-button
                    v-if='showSubscribe === true'
                    class='plain-button'
                    plain
                    size='mini'
                    type='primary'
                    @click.stop='handleDetail()'
                >
                    <span>
                        {{ $t('signal.common.detail') }}
                    </span>
                    <van-icon class='icon-arrow' name='arrow' />
                </van-button>
            </div>
        </template>
        <template v-else-if='itemType !== 3'>
            <van-button
                v-if='showSubscribe === true && isPC'
                class='plain-button'
                plain
                size='mini'
                type='primary'
                @click.stop='handleSubscribe()'
            >
                {{ $t('signal.subscribe.subscribe') }}
            </van-button>
            <template v-if='showTg'>
                <tg-subscribe v-if='showTg === true' :data-ga-signal='gaTg' :data-ga-signal-item='signal' :is-link='true'>
                    <div class='signal-item-more'>
                        <i class='icon_telegram_outline iconfont'></i>
                    </div>
                </tg-subscribe>
            </template>
            <template v-else>
                <van-icon class='arrow' name='arrow' />
            </template>
            <!-- <template v-else>
                <div
                    class='signal-item-more'
                    @click.stop='handleConfirmSubscribe'
                >
                    <i class='icon icon_subscribed'></i>
                </div>
            </template> -->
        </template>
    </div>
</template>

<script>
import { computed, inject } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { Dialog } from 'vant'
import { useI18n } from 'vue-i18n'
import { isExpiredTime, getRelativeTime } from '../utils/getRelativeTime'
import SignalEvent from '@/plugins/signal/utils/signalEvent'
import { toFixed } from '@/utils/calculation'
import signalDirection from './signal-direction.vue'
import productIcon from './product-icon.vue'
import useSignal from '@/plugins/signal/hooks/signal'
import tgSubscribe from '@/plugins/signal/modules/subscribe/tg-subscribe.vue'
import mitt from '@/utils/mitt'

export default {
    components: {
        signalDirection,
        productIcon,
        tgSubscribe,
    },
    props: {
        // 信号对象
        signal: {
            type: Object,
            default: () => {},
        },
        // 列表展示类型
        itemType: {
            type: Number,
            default: 1, // 1默认列表 2按产品 3块状展示 4产品详情 11 pc列表
        },
        // 是否展示过期效果
        showExipreStyle: {
            type: Boolean,
            default: true,
        },
        // 是否虚拟item
        isVirtualItem: {
            type: Boolean,
            default: false,
        },
        // 已读列表
        hasShowMap: {
            type: Object,
            default: () => {},
        },
        // 是否显示订阅图标
        showSubscribe: {
            type: Boolean,
            default: true,
        },
        // 是否显示交易按钮
        showTrade: {
            type: Boolean,
            default: false,
        },
        // 是否显示箭头
        showArrow: {
            type: Boolean,
            default: false,
        },
        // 展示tg
        showTg: {
            type: Boolean,
            default: false,
        },
        // ga 埋点
        gaTrade: String, // 交易埋点
        gaTg: String, // tg埋点
    },
    inject: {
        // 点击列表事件
        handleSignalItemClick: {
            default: () => {},
        },
        // 点击列表订阅事件
        handleSignalSubscribeClick: {
            default: () => {},
        },
    },
    setup (props) {
        const store = useStore()
        const router = useRouter()
        const { t } = useI18n({ useScope: 'global' })
        const { subscribeSignal } = useSignal()
        // 是否展示过期样式
        const isExpiredStyle = computed(() => props.showExipreStyle && isExpiredTime(props.signal.t))
        // 获取指标名称
        const indicatorName = computed(() => store.getters['_signal/getIndicatorName'](props.signal))
        // 信号名称
        const signalName = computed(() => store.getters['_signal/getSignalName'](props.signal.si))
        // 周期名
        const periodName = computed(() => store.getters['_signal/getPeriodName'](props.signal.pe))
        // 产品类型
        const productCateName = computed(() => store.getters['_signal/getProductCateName'](props.signal.sc))
        // symbolKey
        const symbolKey = computed(() => store.getters['_signal/getSignalSymbolKey'](props.signal.sy))
        // 产品信息
        const product = computed(() => store.state._quote.productMap[symbolKey.value] || {})
        // 触发价
        const pr = computed(() => {
            const { symbolDigits } = product.value
            return props.signal.pr && symbolDigits ? toFixed(props.signal.pr, symbolDigits) : props.signal.pr
        })
        // 描述
        const signalDesc = computed(() => {
            return store.getters['_signal/getSignalDesc'](props.signal)
        })

        // 信号背景
        const signalItemBg = computed(() => {
            let classBg = ''
            if ((props.signal.a === 'buy' || props.signal.a === 'sell') && props.itemType !== 3) {
                if (props.isVirtualItem === false || (props.signal.isNewest && props.hasShowMap[props.signal.id] !== true)) {
                    classBg = props.signal.a === 'buy' ? 'signal-item-rise' : 'signal-item-fall'
                }
            }
            return classBg
        })

        // 订阅
        const injectSignalSubscribe = inject('handleSignalSubscribeClick', null)

        const handleSubscribe = (needConfirm = false) => {
            if (injectSignalSubscribe) {
                // 点击事件返回false则中断操作
                if (injectSignalSubscribe(props.signal) === false) {
                    return false
                }
            }
            subscribeSignal({ type: 'quick', payload: props.signal, needConfirm })
        }

        // 是否存在点击的方法
        const handleClick = inject('handleSignalItemClick', null)
        // 跳转到详情页面
        const goDetail = () => {
            // 切换图表时间周期
            mitt.emit('SET_CHART_RESOLUTION', {
                '5m': 5,
                '15m': 15,
                '30m': 30,
                '1h': 60,
                '1D': '1D',
                '1W': '1W',
                '1M': '1M',
            }[props.signal.pe])

            // 部分列表不需要点击整行跳转
            if (handleClick) {
                // 点击事件返回false则中断操作
                if (handleClick(props.signal) === false) {
                    return false
                }
            }
            router.push({
                path: '/order',
                query: {
                    symbolId: product.value.symbol_id,
                    tradeType: product.value.tradeType,
                },
            })
        }

        // 点击详情按钮事件
        const handleDetailClick = inject('handleSignalDetailClick', null)
        const handleDetail = () => {
            // 部分列表不需要点击整行跳转
            if (handleDetailClick) {
                // 点击事件返回false则中断操作
                if (handleDetailClick(props.signal) === false) {
                    return false
                }
            }
            router.push({
                path: '/order',
                query: {
                    symbolId: product.value.symbol_id,
                    tradeType: product.value.tradeType,
                },
            })
        }

        // 跳转到交易页面
        const goTrade = () => {
            if (product.value?.symbolId) {
                router.push({
                    path: '/order',
                    query: {
                        tradeType: product.value.tradeType,
                        symbolId: product.value.symbolId,
                        name: product.value.symbolName,
                    },
                })
            } else {
                Dialog.alert({
                    message: t('signal.noTradeProduct'),
                })
            }
        }

        // 靠近
        const injectMouse = inject('handleSignalItemMouse', null)

        const handleMouse = (event) => {
            if (injectMouse) {
                injectMouse(event, props.signal)
            }
        }

        const handleMouseleave = () => {
            injectMouse && injectMouse({}, props.signal)
        }

        const animationend = () => {
            SignalEvent.emit('show_signal', props.signal.id)
        }

        const isPC = window.isPC

        // 订阅确认框
        const handleConfirmSubscribe = (needConfirm) => {
            handleSubscribe(needConfirm)
        }

        return {
            getRelativeTime,
            isExpiredStyle,
            indicatorName,
            signalName,
            periodName,
            productCateName,
            symbolKey,
            product,
            pr,
            signalDesc,
            handleSubscribe,
            goDetail,
            goTrade,
            isPC,
            animationend,
            signalItemBg,
            handleMouse,
            handleMouseleave,
            handleConfirmSubscribe,
            handleDetail,
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/plugins/signal/style/signal.scss';
.signal-item {
    position: relative;
    border: none;
}
.direction {
    flex: 0.7;
}
</style>

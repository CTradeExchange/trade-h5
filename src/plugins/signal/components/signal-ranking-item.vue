<template>
    <div :class="['signal-ranking-item', 'item-' + rankingNum]" @click='goDetail'>
        <div class='col'>
            <div class='ranking-num'>
                <span v-if='rankingNum > 3' class='number'>
                    {{ rankingNum }}
                </span>
                <signal-ranking-icon v-else :num='rankingNum' />
            </div>
        </div>
        <div class='col col-indicator'>
            <span class='signal-name'>
                {{ signal.i }}-{{ getPeriodName(signal.pe) }}
            </span>
            <product-icon :show-symbol-icon='true' :symbol-code='signal.sy' />
        </div>
        <div class='col'>
            <div class='ring'>
                <Profit :value='signal.tpnl' />
            </div>
            <div v-if='isPC' class='group'>
                <van-button
                    class='plain-button'
                    plain
                    size='mini'
                    type='primary'
                    @click.stop='handleDetail'
                >
                    <span>{{ $t('signal.common.detail') }}</span>
                    <van-icon class='arrow' name='arrow' />
                </van-button>
            </div>
            <div v-else class='subscribed-icon'>
                <van-icon class='arrow' name='arrow' />
            </div>
            <!-- <div v-else class='subscribed-icon' @click.stop='handleSubscribe'>
                <i class='icon icon_subscribed'></i>
            </div> -->
        </div>
    </div>
</template>

<script>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { toFixed } from '@/utils/calculation'
import useSignal from '@/plugins/signal/hooks/signal'
import productIcon from '@/plugins/signal/components/product-icon'
import signalRankingIcon from '@/plugins/signal/components/signal-ranking-icon.vue'
import Profit from '@/plugins/signal/modules/signal-valuable-profit.vue'
export default {
    components: {
        productIcon,
        signalRankingIcon,
        Profit
    },
    props: {
        // 信号数据
        signal: {
            type: Object,
            default: () => {}
        },
        // 当前排名
        rankingNum: {
            type: [Number, String],
            default: ''
        }
    },
    setup (props) {
        const router = useRouter()
        const store = useStore()
        const { subscribeSignal } = useSignal()

        // 跳转到信号详情页面
        const goDetail = (gAEvent = true) => {
            router.push({
                path: '/signal/ranking/detail',
                query: {
                    id: props.signal.id,
                    rtime: props.signal.rtime,
                    tpnl: props.signal.tpnl
                }
            })
        }

        const handleDetail = () => {
            goDetail(false)
        }

        // 点击订阅
        const handleSubscribe = () => {
            subscribeSignal({ type: 'quick', payload: props.signal, needConfirm: !window.isPC })
        }

        // 周期名称
        const getPeriodName = (pe) => {
            return store.getters['_signal/getPeriodName'](pe)
        }

        return {
            isPC: window.isPC,
            toFixed,
            goDetail,
            handleSubscribe,
            handleDetail,
            getPeriodName
        }
    }
}
</script>

<style lang="scss" scoped>
.signal-ranking-item {
    display: flex;
    height: 60px;
    padding: 0 16px;
    cursor: pointer;
    &:hover {
        background-color: var(--primaryAssistColor);
    }
    // &.item-1 {
    //     background: linear-gradient(to right, rgba(243, 206, 101, 0.5), rgba(243, 206, 101, 0.2));
    // }
    // &.item-2 {
    //     background: linear-gradient(to right, rgba(233, 236, 247, 0.5), rgba(233, 236, 247, 0.2));
    // }
    // &.item-3 {
    //     background: linear-gradient(to right, rgba(249, 231, 206, 1), rgba(249, 231, 206, 0.2));
    // }
    .col {
        flex: 1;
        display: inline-flex;
        align-items: center;
        font-size: 16px;
        &:first-of-type {
            flex: 0.4;
        }
        &:last-of-type {
            justify-content: space-between;
        }
        &.col-indicator {
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            flex: 0.6;
            .signal-name {
                margin-bottom: 2px;
                font-weight: bold;
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
        .ring {
            display: inline-flex;
            align-items: center;
            .coin-icon {
                height: 20px;
                margin-right: 6px;
            }
        }
        .ranking-num {
            display: inline-flex;
            justify-content: center;
            width: 32px;
            font-weight: bold;
        }
        .ranking-icon {
            width: 100%;
        }
        .total {
            margin-right: 12px;
        }
        .group {
            display: inline-flex;
            align-items: center;
            .plain-button {
                min-width: 100px;
                :deep {
                    .arrow {
                        margin-left: 8px;
                        color: var(--primary);
                    }
                }
            }
        }
        .subscribed-icon {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            .icon {
                font-size: 16px;
                color: var(--primary);
            }
        }
        &:deep {
            .arrow {
                line-height: normal;
                color: var(--normalColor);
            }
            .symbol-code {
                font-size: 12px;
                color: var(--normalColor);
            }
            svg {
                width: 32px;
                height: 32px;
            }
            .van-button {
                padding: 4px;
                font-size: 14px;
                line-height: normal;
                height: auto;
            }
        }
    }
}
// 黑夜模式
// body.night {
//     .signal-ranking-item {
//         &.item-1 {
//             background: linear-gradient(to right, rgba(233, 209, 140, 0.5), rgba(233, 209, 140, 0.3));
//         }
//         &.item-2 {
//             background: linear-gradient(to right, rgba(222, 225, 239, 0.5), rgba(222, 225, 239, 0.3));
//         }
//         &.item-3 {
//             background: linear-gradient(to right, rgba(234, 215, 190, 0.5), rgba(234, 215, 190, 0.3));
//         }
//     }
// }
</style>

<!-- h5样式 -->
<style lang="scss" scoped>
.h5 {
    .signal-ranking-item {
        padding: 0;
        .col {
            &:nth-of-type(2) {
                flex: 0.8;
            }
            &:last-of-type {
                // flex: 1.2;
            }
            .number {
                min-width: 30px;
                display: inline-block;
                text-align: center;
                vertical-align: middle;
            }
        }
    }
}
</style>

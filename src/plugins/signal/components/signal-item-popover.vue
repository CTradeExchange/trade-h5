<template>
    <div class='signal-item-popover'>
        <template v-if='type ===1'>
            <van-cell
                :title="$t('signal.detail.indicatorName')"
                :value='item.i'
            />
            <van-cell
                :title="$t('signal.timePeriod')"
                :value='pe'
            />
            <van-cell
                :title="$t('signal.subscribe.expiredTime')"
                :value='formatTime(item.et * 1000, "YYYY-MM-DD HH:mm")'
            />
            <van-cell
                :title="$t('signal.subscribe.createTime')"
                :value='formatTime(item.ct * 1000, "YYYY-MM-DD HH:mm")'
            />
        </template>
        <template v-else>
            <van-cell
                :title='$t("signal.detail.time")'
                :value='formatTime(item.t, "YYYY-MM-DD HH:mm:ss")'
            />
            <van-cell
                class='van-cell-primary'
                :title="$t('signal.detail.indicatorName')"
                :value='item.i'
            />
            <van-cell
                :title="$t('signal.timePeriod')"
                :value='pe'
            />
            <van-cell
                class='van-cell-primary'
                :title="$t('signal.detail.signal')"
                :value='signalName'
            />
            <van-cell
                class='van-cell-desc'
                :title="$t('signal.detail.desc')"
                :value='signalDesc'
            />
            <van-cell :title="$t('signal.tradeRecommend')">
                <template #value>
                    <signal-direction :direction='item.a' />
                </template>
            </van-cell>
            <van-cell
                :title="$t('signal.detail.triggerPrice')"
                :value='item.pr'
            />
        </template>
    </div>
</template>

<script>
// 获取标题
import { computed } from 'vue'
import { useStore } from 'vuex'
import signalDirection from '@/plugins/signal/components/signal-direction.vue'

export default {
    components: {
        signalDirection
    },
    props: {
        type: {
            type: Number,
            default: 0, // 0 信号 1 订阅
        },
        // 信号列表
        item: {
            type: Object,
            default: () => {},
        }
    },
    setup (props) {
        const store = useStore()

        const pe = computed(() => {
            return store.getters['_signal/getPeriodName'](props.item.pe)
        })

        const signalName = computed(() => {
            return store.getters['_signal/getSignalName'](props.item.si)
        })

        const signalDesc = computed(() => {
            return store.getters['_signal/getSignalDesc'](props.item)
        })

        return {
            pe,
            signalName,
            signalDesc
        }
    }
}
</script>

<style lang="scss" scoped>
.signal-item-popover {
    width: 280px;
    margin: 0 auto;
    max-width: 100%;
    background: none;
    .van-cell {
        padding: 6px 0;
        font-size: 13px;
        &.van-cell-primary {
            &:deep {
                .van-cell__value {
                    color: var(--primary);
                }
            }
        }
        &::after {
            left: 0;
            right: 0;
        }
        :deep {
            .van-cell__title {
                flex: none;
                max-width: 40%;
                word-break: break-word;
            }
            .van-cell__value {
                font-size: 14px;
            }
        }
    }
}
</style>

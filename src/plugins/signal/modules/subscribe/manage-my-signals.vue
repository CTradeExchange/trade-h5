<template>
    <div v-if='!isModify' class='manage-my-signals'>
        <div class='subscribe-title'>
            <van-icon class='mr-4 cursor-pointer' name='down' style='transform: rotate(90deg)' @click='close' />
            <span>
                {{ $t('signal.subscribe.manageMySignals') }}
            </span>
        </div>

        <div class='content'>
            <div v-for='(item, index) in subscribeList' :key='index' class='item-warp van-hairline--bottom'>
                <popover class='popover-item' :offset='[0, 12]' placement='left' popover-class='DrawerSubpopoverClass'>
                    <template #reference>
                        <div class='item' @click='selectProduct(item.sy)'>
                            <div class='item-left'>
                                <div class='item-head'>
                                    <product-icon :symbol-code='item.sy' />
                                </div>
                                <span class='text-sm'>
                                    {{ getIndicatorName(item) }}
                                </span>
                                <div class='item-time text-xs'>
                                    {{ $t('signal.subscribe.expired', [formatTime(item.et * 1000, 'YYYY/MM/DD')]) }}
                                </div>
                            </div>
                            <div class='item-right'>
                                <template v-if='isPC'>
                                    <div class='item-right-pc'>
                                        <popover :text="$t('common.change')">
                                            <template #reference>
                                                <van-icon name='edit' size='20' @click.stop='handleSubscribe(index)' />
                                            </template>
                                        </popover>
                                        <popover :offset='[16, 10]' placement='top-end' :text="$t('common.remove')">
                                            <template #reference>
                                                <van-icon name='delete-o' size='20' @click.stop='handleDel(index)' />
                                            </template>
                                        </popover>
                                    </div>
                                </template>
                                <template v-else>
                                    <van-popover
                                        v-model:show='showPopover[item.sy + item.i + item.pe]'
                                        :actions='actions'
                                        class='Draw-subscribe-popover'
                                        placement='bottom-end'
                                        @click.stop
                                        @open='currentOpenIndex = index'
                                        @select='handleSelect'
                                    >
                                        <template #reference>
                                            <van-icon name='ellipsis' size='20' />
                                        </template>
                                    </van-popover>
                                </template>
                            </div>
                        </div>
                    </template>
                    <signal-item-popover class='detail' :item='item' :type='1' />
                </popover>
            </div>
            <empty v-if='subscribeList.length === 0' :description="$t('signal.subscribe.empty')" />
        </div>
    </div>
    <operation-subscribe v-else :payload='payload' type='edit' @close='isModify = false' />
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import productIcon from '@/plugins/signal/components/product-icon.vue'
import empty from '@/plugins/signal/components/none-data.vue'
import { Dialog, Toast } from 'vant'
import { useI18n } from 'vue-i18n'
import SignalEvent from '../../utils/signalEvent'
import popover from '@/components/popover'
import signalItemPopover from '@/plugins/signal/components/signal-item-popover.vue'
import { useRouter } from 'vue-router'
import operationSubscribe from './operation-subscribe.vue'

export default {
    components: {
        productIcon,
        empty,
        popover,
        signalItemPopover,
        operationSubscribe,
    },
    emits: ['close'],
    setup (props, { emit }) {
        const store = useStore()
        const router = useRouter()
        const { t } = useI18n({ useScope: 'global' })

        const subscribeList = computed(() => {
            return store.state._signal.subscribeList
        })

        const state = reactive({
            showPopover: {},
            currentOpenIndex: -1, // 当前打开的列表索引
            // 更多列表
            actions: [
                { text: t('common.change'), icon: 'edit', type: 'edit' },
                { text: t('common.remove'), icon: 'delete-o', type: 'delete' },
            ],
            payload: null,
            isModify: false,
        })

        const handleSubscribe = (index) => {
            const item = subscribeList.value[index]
            state.payload = item
            state.isModify = true
        }

        const handleDel = (index) => {
            Dialog.confirm({
                title: t('common.tip'),
                message: t('signal.subscribe.delConfirm'),
                beforeClose: (action) =>
                    new Promise((resolve) => {
                        setTimeout(() => {
                            if (action === 'confirm') {
                                store
                                    .dispatch('_signal/deleteQuotapIndicatorSub', index)
                                    .then(() => {
                                        Toast(t('signal.subscribe.delSucc'))
                                        // 更新列表
                                        store.dispatch('_signal/queryAllQuotaIndicatorSub').then(() => {
                                            // 通知需要监听信号的地方
                                            SignalEvent.emit('SubscribeSignal_REFRESH')
                                            resolve(true)
                                        })
                                    })
                                    .catch(() => {
                                        resolve(false)
                                    })
                            } else {
                                resolve(true)
                            }
                        })
                    }),
            })
        }

        const handleSelect = (item) => {
            if (item.type === 'edit') {
                handleSubscribe(state.currentOpenIndex)
            } else {
                handleDel(state.currentOpenIndex)
            }
        }

        const selectProduct = (symbolCode) => {
            const product = store.getters['_signal/getSignalProduct'](symbolCode)
            const { symbolId, tradeType } = product || {}
            router.push(`/order?symbolId=${symbolId}&tradeType=${tradeType}`)
        }

        const getIndicatorName = (item) => {
            return store.getters['_signal/getIndicatorName'](item)
        }

        const close = () => {
            emit('close')
        }

        return {
            ...toRefs(state),
            subscribeList,
            open,
            handleSubscribe,
            handleDel,
            handleSelect,
            isPC: window.isPC,
            getIndicatorName,
            selectProduct,
            close,
        }
    },
}
</script>

<style lang="scss">
.DrawerSubpopoverClass.van-popover {
    .van-popover__content {
        background: var(--contentColor);
        padding: 0 12px;
    }
    .van-popover__arrow {
        color: var(--contentColor);
    }
    .tips {
        padding: 10px 12px;
    }
}
.Draw-subscribe-popover {
    &.van-popover[data-popper-placement='bottom-end'] .van-popover__arrow {
        right: 0;
        color: #4c5260;
    }
    .van-popover__content {
        background: none;
    }
    .van-popover__action {
        background: #4c5260;
        color: #fff;
        height: 40px;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid var(--lineColor);
        .van-popover__action-text {
            flex: none;
            &::after {
                content: none;
            }
        }
    }
}
</style>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.manage-my-signals {
    height: 100%;
    display: flex;
    flex-direction: column;
    .subscribe-title {
        font-size: 20px;
        font-weight: 700;
        color: var(--color);
        padding: 16px 12px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid var(--lineColor);
    }
}
.popover-item {
    flex: 1;
}
.content {
    flex: 1;
    @include scroll-bar-vertical;
    overflow-y: auto;
    .item-warp {
        display: flex;
        :deep {
            .van-popover__wrapper {
                flex: 1;
            }
        }
    }
    .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 20px;
        flex: 1;
        &:hover {
            background: var(--bgColor);
            .item-right .item-right-pc {
                display: flex;
                align-items: center;
            }
        }
        .item-head {
            display: flex;
            align-items: center;
            .text {
                margin-right: 15px;
            }
        }
        .item-right {
            display: flex;
            align-items: center;
            .item-right-pc {
                display: none;
                :deep(.van-popover__wrapper) {
                    margin-left: 10px;
                }
            }
            .van-icon {
                cursor: pointer;
                &:hover {
                    opacity: 0.9;
                }
                &.van-icon-ellipsis {
                    margin-left: 0;
                }
            }
        }
        .item-time {
            color: var(--normalColor);
        }
    }
}
.option {
    padding: 10px;
    .btn-subscribe {
        line-height: normal;
        &:hover {
            opacity: 0.9;
        }
    }
}
</style>

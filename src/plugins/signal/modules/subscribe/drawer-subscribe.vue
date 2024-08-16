<template>
    <van-popup v-model:show='visible' class='drawer-subscribe' position='right' :style="{ width: '100%', height: '100%' }">
        <LayoutTop custom-back :menu='false' :title="$t('signal.subscribe.manageMySignals')" @back='visible = false' />
        <div class='content'>
            <div v-for='(item, index) in subscribeList' :key='index' class='item-warp van-hairline--bottom'>
                <popover class='popover-item' :offset='[0, 12]' placement='left' popover-class='DrawerSubpopoverClass'>
                    <template #reference>
                        <div class='item'>
                            <div class='item-left'>
                                <div class='item-head'>
                                    <span class='text'>
                                        {{ getIndicatorName(item) }}
                                    </span>
                                    <product-icon :symbol-code='item.sy' />
                                </div>
                                <div class='item-time'>
                                    {{ $t('signal.subscribe.expired', [formatTime(item.et * 1000, 'YYYY/MM/DD')]) }}
                                </div>
                            </div>
                            <div class='item-right' @click.stop>
                                <template v-if='isPC'>
                                    <div class='item-right-pc'>
                                        <popover :text="$t('common.change')">
                                            <template #reference>
                                                <van-icon name='edit' size='20' @click='handleSubscribe(index)' />
                                            </template>
                                        </popover>
                                        <popover :offset='[16, 10]' placement='top-end' :text="$t('common.remove')">
                                            <template #reference>
                                                <van-icon name='delete-o' size='20' @click='handleDel(index)' />
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
    </van-popup>
</template>

<script>
import { computed, onMounted, onUnmounted, reactive, ref, toRefs } from 'vue'
import { useStore } from 'vuex'
import productIcon from '@/plugins/signal/components/product-icon.vue'
import empty from '@/plugins/signal/components/none-data.vue'
import { Dialog, Toast } from 'vant'
import { useI18n } from 'vue-i18n'
import SignalEvent from '../../utils/signalEvent'
import useSignal from '@/plugins/signal/hooks/signal'
import popover from '@/components/popover'
import signalItemPopover from '@/plugins/signal/components/signal-item-popover.vue'

export default {
    components: {
        productIcon,
        empty,
        popover,
        signalItemPopover,
    },
    setup () {
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const drawerRef = ref(null)
        const { subscribeSignal } = useSignal()
        // 提供给外部使用
        const open = () => {
            state.visible = true
        }
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
            visible: false,
        })

        const handleSubscribe = (index) => {
            const item = subscribeList.value[index]
            if (item) {
                subscribeSignal({ payload: item, type: 'edit' })
            } else {
                subscribeSignal()
            }
        }

        const handleDel = (index) => {
            Dialog.confirm({
                title: t('common.tip'),
                message: t('signal.subscribe.delConfirm'),
                beforeClose: (action) =>
                    new Promise((resolve) => {
                        setTimeout(() => {
                            if (action === 'confirm') {
                                store.dispatch('_signal/deleteQuotapIndicatorSub', index).then(() => {
                                    Toast(t('signal.subscribe.delSucc'))
                                    // 更新列表
                                    store.dispatch('_signal/queryAllQuotaIndicatorSub').then(() => {
                                        // 通知需要监听信号的地方
                                        SignalEvent.emit('SubscribeSignal_REFRESH')
                                        resolve(true)
                                    })
                                }).catch(() => {
                                    resolve(false)
                                })
                            } else {
                                resolve(true)
                            }
                        })
                    })
            })
        }

        const handleSelect = (item) => {
            if (item.type === 'edit') {
                handleSubscribe(state.currentOpenIndex)
            } else {
                handleDel(state.currentOpenIndex)
            }
        }

        const getIndicatorName = (item) => {
            return store.getters['_signal/getIndicatorName'](item)
        }

        // 监听关闭事件
        const handleClose = () => {
            // drawerRef.value.close()
            state.visible = false
        }

        onMounted(() => {
            SignalEvent.on('DrawerMySubscribeClose', handleClose)
        })

        onUnmounted(() => {
            SignalEvent.off('DrawerMySubscribeClose', handleClose)
        })

        return {
            ...toRefs(state),
            subscribeList,
            drawerRef,
            open,
            handleSubscribe,
            handleDel,
            handleSelect,
            isPC: window.isPC,
            getIndicatorName,
        }
    },
}
</script>

<style lang="scss">
.drawer-subscribe {
  display: flex;
  flex-direction: column;
}
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
        .van-icon {
            line-height: normal;
        }
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

.popover-item {
    flex: 1;
}
.content {
    flex: 1;
    padding-bottom: 80px;
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
            margin-bottom: 6px;
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

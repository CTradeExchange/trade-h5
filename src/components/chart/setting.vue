<template>
    <div ref='settingContainer' class='setting'>
        <van-popover
            v-if='$isPC'
            v-model:show='showPopover'
            class='setting-popover'
            :close-on-click-action='false'
            :close-on-click-outside='false'
            :close-on-click-overlay='false'
            :offset='[15,8]'
            placement='bottom-end'
            :teleport='settingContainer'
            theme='dark'
        >
            <div class='popover-content'>
                <p class='text'>
                    {{ $t('trade.tradeFloatLayerPopover') }}
                </p>
                <i class='icon-close'>
                    <van-icon name='cross' @click='handleClosePopover' />
                </i>
            </div>
            <template #reference>
                <popover
                    class='icon-exchange'
                    :offset='[20, 8]'
                    placement='top-end'
                    :teleport='teleport'
                    :text="isTradeFloatLayer ? $t('trade.tradeFloatLayerClose') : $t('trade.tradeFloatLayerOpen')"
                >
                    <template #reference>
                        <van-icon :class='{ active: isTradeFloatLayer }' name='exchange' size='16' @click='changeTradeFloatLayer' />
                    </template>
                </popover>
            </template>
        </van-popover>
    </div>
</template>

<script>
import { ref, reactive, toRefs, onMounted, onUnmounted, } from 'vue'
import mitt from '@/utils/mitt'

export default {
    props: {
        // 传送
        teleport: {
            type: [String, Object],
            default: 'body'
        }
    },
    setup () {
        const settingContainer = ref(null)

        const state = reactive({
            // 是否显示弹框
            show: false,
            // 是否显示popover提示
            showPopover: false,
            // 是否开启下单浮层
            isTradeFloatLayer: false
        })

        // 设置下单浮层是否显示
        const changeTradeFloatLayer = () => {
            state.isTradeFloatLayer = !state.isTradeFloatLayer
            mitt.emit('setTradeFloatLayer', state.isTradeFloatLayer)
            if (state.isTradeFloatLayer) {
                state.showPopover = false
                // 用户没有主动关闭过
            } else if (!localStorage.getItem('__FLOATING_LAYER_POPOVER_HIDDEN__')) {
                state.showPopover = true
            }
        }

        // 关闭下单浮层
        const closeTradeFloatLayer = () => {
            state.isTradeFloatLayer = false
            state.showPopover = true
        }

        // 关闭popover提示
        const handleClosePopover = () => {
            state.showPopover = false
            localStorage.setItem('__FLOATING_LAYER_POPOVER_HIDDEN__', true)
        }

        onMounted(() => {
            state.isTradeFloatLayer = localStorage.getItem('__FLOATING_LAYER_VISIBILITY__')
            // 用户没有主动关闭过
            if (!localStorage.getItem('__FLOATING_LAYER_POPOVER_HIDDEN__')) {
                state.showPopover = !state.isTradeFloatLayer
            }
            mitt.on('closeTradeFloatLayer', closeTradeFloatLayer)
        })

        onUnmounted(() => {
            mitt.off('closeTradeFloatLayer')
        })

        return {
            ...toRefs(state),
            settingContainer,
            changeTradeFloatLayer,
            handleClosePopover
        }
    }
}
</script>

<style lang="scss" scoped>
.setting {
    height: 30px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--contentColor);
    cursor: pointer;
    .icon {
        color: var(--normalColor);
        font-size: rem(34px);
    }
    .icon-exchange {
        .van-icon-exchange {
            &.active {
                color: var(--primary);
            }
        }
    }
}

</style>

<style lang="scss">
.setting-popover {
    z-index: 100 !important;
    .van-popover__content {
        background: #4C5260;
        color: #FFF;
    }
    .van-popover__arrow {
        bottom: 1px;
        color: #4C5260;
    }
    .popover-content {
        display: flex;
        width: 200px;
    }
    .icon-close {
        display: flex;
        justify-content: flex-end;
        .van-icon {
            line-height: normal;
            cursor: pointer;
            padding-right: 10px;
            padding-top: 10px;
        }
    }
    .text {
        padding: 10px;
        font-size: 12px;
        flex: 1;
        white-space: normal;
    }
}
.setting-menu {
    .content {
        padding: 6px 0;
        background: var(--contentColor);
        border: 1px solid var(--lineColor);
        box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.3);
        border-radius: 4px;
        .item {
            display: flex;
            white-space: nowrap;
            background: var(--contentColor);
            padding: 6px 16px !important;
            cursor: pointer;
        }
        .van-checkbox__label {
            color: var(--color);
        }
    }
}
.showMorePopover.van-popover {
    .van-popover__arrow {
        right: 1px;
    }
}
</style>

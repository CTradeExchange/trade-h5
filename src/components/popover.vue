<template>
    <div class='popover-warp'>
        <van-popup v-model:show='show' class='p-5' position='bottom' round teleport='body'>
            <div :style="{ maxWidth: maxWidth + 'px' }">
                <template v-if='slots.default'>
                    <slot></slot>
                </template>
                <p v-for='(item, index) in content' v-else :key='index'>
                    {{ item }}
                </p>
            </div>
            <van-button class='mt-4 w-full rounded-xs' type='primary' @click='show = false'>
                {{ $t('common.know') }}
            </van-button>
        </van-popup>
        <van-popover
            :class="['SignalPopoverClass', popoverClass]"
            :close-on-click-action='false'
            :close-on-click-outside='false'
            :offset='offset'
            :placement='placement'
            :show='showPopoverTip'
            :teleport='teleport'
        >
            <div
                :class="['tips', 'tips-left']"
                :style="{ width: width, maxWidth: maxWidth + 'px' }"
                @mouseenter='handleMouseEnter'
                @mouseleave='handleMouseLeave'
            >
                <template v-if='slots.default'>
                    <slot></slot>
                </template>
                <p v-for='(item, index) in content' v-else :key='index'>
                    {{ item }}
                </p>
            </div>
            <template #reference>
                <div class='popover' @click.stop.prevent='handleOpen' @mouseenter='handleMouseEnter' @mouseleave='handleMouseLeave'>
                    <slot name='reference'>
                        <van-icon class='icon-question' name='question-o' size='16' />
                    </slot>
                </div>
            </template>
        </van-popover>
    </div>
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
export default {
    props: {
        // 默认是否显示提示
        defaultShow: {
            type: Boolean,
            default: true,
        },
        // 宽度
        width: {
            type: String,
            default: 'auto',
        },
        // 最大宽度
        maxWidth: {
            type: Number,
            default: 400,
        },
        // 提示文案
        text: [Array, String],
        // 文本水平方向
        textAlign: {
            type: String,
            default: 'center',
        },
        // 偏移
        offset: {
            type: Array,
            default: () => [0, 8],
        },
        // pc 位置
        placement: {
            type: String,
            default: 'top',
            // top           # 顶部中间位置
            // top-start     # 顶部左侧位置
            // top-end       # 顶部右侧位置
            // left          # 左侧中间位置
            // left-start    # 左侧上方位置
            // left-end      # 左侧下方位置
            // right         # 右侧中间位置
            // right-start   # 右侧上方位置
            // right-end     # 右侧下方位置
            // bottom        # 底部中间位置
            // bottom-start  # 底部左侧位置
            // bottom-end    # 底部右侧位置
        },
        // 弹窗样式
        popoverClass: {
            type: String,
            default: '',
        },
        // 移开是否删除
        destoryed: {
            type: Boolean,
            default: false,
        },
        // 移动版是否禁用
        touchDisabled: {
            type: Boolean,
            default: false,
        },
        // 传送
        teleport: {
            type: [String, Object],
            default: 'body',
        },
    },
    setup (props, { slots }) {
        const isPC = window.isPC
        const state = reactive({
            showTimer: null,
            show: false, // 移动弹窗
            showPopoverTip: false, // pc popover
        })

        const content = computed(() => {
            if (typeof props.text === 'string') {
                return [props.text]
            }
            return props.text
        })

        // 打开弹窗
        const handleOpen = () => {
            if (state.showTimer) clearTimeout(state.showTimer)
            if (isPC) {
                state.showPopoverTip = true
            } else if (!props.touchDisabled) {
                state.show = true
            }
        }

        // 关闭弹窗
        const handleClose = () => {
            if (state.showTimer) clearTimeout(state.showTimer)
            state.showTimer = setTimeout(() => {
                state.showPopoverTip = false
            }, 100)
        }

        // 靠近
        const handleMouseEnter = () => {
            if (isPC && props.defaultShow) {
                handleOpen()
            }
        }

        // 移开
        const handleMouseLeave = () => {
            if (isPC) {
                handleClose()
            }
        }

        return {
            ...toRefs(state),
            content,
            isPC,
            handleOpen,
            handleClose,
            handleMouseEnter,
            handleMouseLeave,
            slots,
        }
    },
}
</script>

<style lang="scss">
.SignalPopoverClass.van-popover {
    width: max-content;
    .van-popover__content {
        background: #4c5260;
        color: #fff;
    }
    .van-popover__arrow {
        bottom: 1px;
        color: #4c5260;
    }
}
</style>

<style lang="scss" scoped>
.popover-warp {
    display: inline-flex;
}
.popover {
    display: flex;
    position: relative;
    cursor: pointer;
    .icon-question {
        margin-left: rem(10px);
        position: relative;
        font-size: rem(39px);
        color: var(--normalColor);
    }
}
.tips {
    padding: 7px 14px;
    text-align: center;
    &.tips-left {
        text-align: left;
    }
    p {
        font-size: 14px;
        line-height: 18px;
        margin-bottom: 8px;
        &:last-child {
            margin-bottom: 0;
        }
    }
}
</style>

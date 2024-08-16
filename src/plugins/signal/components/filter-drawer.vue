<template>
    <van-popup
        v-model:show='visible'
        class='filter-drawer'
        position='right'
        :style="{ width: '100%', height: '100%' }"
    >
        <filter-drawer-content
            ref='filterDrawerRef'
            :type='type'
            @close='close'
            @confirm='onConfirm'
        />
    </van-popup>
</template>

<script>
import { ref, nextTick } from 'vue'
import filterDrawerContent from './filter-deawer-content.vue'

export default {
    components: {
        filterDrawerContent
    },
    props: {
        type: String // 过滤类型
    },
    setup (props, { emit }) {
        const filterDrawerRef = ref(null)
        const visible = ref(false)

        // 打开并初始化过滤弹窗
        const open = (signalType, data) => {
            visible.value = true
            nextTick(() => {
                filterDrawerRef.value.open(signalType, data)
            })
        }

        // 关闭弹窗
        const close = () => {
            visible.value = false
        }

        // 确定
        const onConfirm = (params) => {
            emit('confirm', params)
            visible.value = false
        }

        return {
            visible,
            filterDrawerRef,
            open,
            close,
            onConfirm
        }
    }
}
</script>

<style lang="scss" scoped>
.drawer-title {
    text-align: center;
    padding: rem(32px) 0 rem(20px) 0;
    font-size: rem(34px);
    color: var(--color);
    position: relative;
    .van-icon-cross {
        position: absolute;
        right: rem(30px);
    }
}
.drawer-container {
    display: flex;
    flex-direction: column;
    flex: 1;
}
.drawer-content {
    flex: 1;
}
.drawer-block {
    padding: 0 rem(30px);
    margin-top: rem(24px);
    .drawer-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: rem(80px);
        .name {
            font-size: rem(26px);
        }
        .arrow {
            color: var(--minorColor);
            margin-right: rem(-6px);
            font-size: rem(34px);
            transition: all cubic-bezier(0.215, 0.61, 0.355, 1) 0.2s;
        }
    }
    .drawer-classify {
        overflow: hidden;
    }
    &.drawer-block-show {
        .drawer-classify {
            transition: all 0.25s;
            max-height: rem(600px);
        }
    }
    &.drawer-block-hide {
        .drawer-classify {
            transition: all 0.1s;
            max-height: 0;
        }
        &::v-deep {
            .arrow {
                transform: rotate(180deg);
            }
        }
    }
}
.drawer-handle {
    display: flex;
    justify-content: space-between;
    padding: 0 rem(30px);
    margin: rem(24px) 0 rem(48px);
    button {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: calc(50% - rem(15px));
        height: rem(80px);
        border-radius: rem(8px);
        &.reset {
            border-color: var(--lineColor);
            background: var(--primaryAssistColor);
            color: var(--normalColor);
            border-width: 1px;
            border-style: solid;
        }
        &.confirm {
            background: var(--primary);
            color: #FFF;
        }
    }
}
</style>

<template>
    <van-popup
        v-model:show='visible'
        :position='position'
        :style="[{ display: 'flex', flexDirection: 'column', borderRadius: '8px' }, style]"
        :teleport='teleport'
    >
        <div class='drawer'>
            <LayoutTop v-if='title' custom-back :menu='false' :title='title' @back='close' />
        </div>
        <div class='drawer-container'>
            <slot></slot>
        </div>
    </van-popup>
</template>

<script>
import { ref } from 'vue'

export default {
    props: {
        position: {
            type: String,
            default: 'right',
        },
        title: {
            type: String,
            default: '',
        },
        style: {
            type: Object,
            default: () => {},
        },
        teleport: {
            type: String,
            default: 'body',
        },
    },
    emits: ['open', 'close'],
    setup (props, { emit }) {
        const visible = ref(false)

        // 打开并初始化过滤弹窗
        const open = () => {
            visible.value = true
            emit('open')
        }

        // 关闭弹窗
        const close = () => {
            visible.value = false
            emit('close')
        }

        return {
            visible,
            open,
            close,
        }
    },
}
</script>

<style lang="scss" scoped>
.drawer {
    position: sticky;
    top: 0;
    background: var(--contentColor);
}

.drawer-container {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
}
</style>

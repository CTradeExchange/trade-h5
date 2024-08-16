<template>
    <div
        class='filter-drawer'
        :style="{ width: '100%' }"
    >
        <filter-drawer-content
            ref='filterDrawerRef'
            :type='type'
            @close='close'
            @confirm='onConfirm'
        />
    </div>
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
    emits: ['close', 'confirm'],
    setup (props, { emit }) {
        const filterDrawerRef = ref(null)

        // 打开并初始化过滤弹窗
        const open = (signalType, data) => {
            nextTick(() => {
                filterDrawerRef.value.open(signalType, data)
            })
        }

        // 关闭弹窗
        const close = () => {
            emit('close')
        }

        // 确定
        const onConfirm = (params) => {
            emit('confirm', params)
        }

        return {
            filterDrawerRef,
            open,
            close,
            onConfirm
        }
    }
}
</script>

<style lang="scss" scoped></style>

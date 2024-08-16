<template>
    <el-dialog
        v-model='dialogVisible'
        :before-close='beforeClose'
        :class='customClass'
        :close-on-click-modal='false'
        :lock-scroll='lockScroll'
        :width='520'
    >
        <slot></slot>
    </el-dialog>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
export default {
    props: {
        modelValue: {
            type: Boolean,
            default: true
        },
        width: {
            type: Number,
            default: 520
        },
        lockScroll: {
            type: Boolean,
            default: false
        }
    },
    emits: ['update:modelValue'],
    setup (props, { emit, attrs }) {
        const router = useRouter()
        const customClass = 'centerViewDialog ' + attrs.class
        const dialogVisible = computed({
            get: () => props.modelValue,
            set: val => emit('update:modelValue', val)
        })

        // 关闭弹窗
        const beforeClose = (done) => {
            router.back()
        }
        return {
            customClass,
            dialogVisible,
            beforeClose,
        }
    }
}
</script>

<style lang="scss">
@import '@/sass/mixin.scss';
.el-overlay{
    z-index: 1000 !important;
}
.el-overlay-dialog {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}
.centerViewDialog {
    margin: auto;
    overflow: hidden;
    .el-dialog__header {
        display: none;
    }
    .el-dialog__body {
        display: flex;
        flex-flow: column;
        padding: 0;
        height:620px;
        // min-height: 620px;
        max-height: 80%;
        background: var(--contentColor);
    }
    .pageWrap {
        @include scroll-pc();
        flex: 1;
        padding-bottom: 1rem;
        overflow-y: auto;
    }
    &.withdraw-coin-wrap {
        background: #3894FF;
        .el-dialog__body{
            height: 637px;
        }
    }
}
</style>

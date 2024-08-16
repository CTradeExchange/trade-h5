<template>
    <div
        v-if='isPC'
        class='layout'
    >
        <div
            class='layout-left'
            :class='visible ? "visible": ""'
        >
            <slot name='left'>
                <filter-drawer-pc
                    ref='filterDrawerRef'
                    :type='type'
                    @close='close'
                    @confirm='handleConfirm'
                />
            </slot>
        </div>
        <div
            class='layout-right'
            :class='visible ? "layout-right-small": ""'
        >
            <slot>
            </slot>
        </div>
    </div>
    <div v-else class='layout'>
        <slot>
        </slot>
        <filter-drawer
            ref='filterDrawerRef'
            :type='type'
            @close='close'
            @confirm='handleConfirm'
        />
    </div>
</template>

<script>
import { nextTick, ref } from 'vue'
import filterDrawerPc from '@/plugins/signal/components/filter-drawer-pc.vue'
import filterDrawer from '@/plugins/signal/components/filter-drawer.vue'

export default {
    components: {
        filterDrawerPc,
        filterDrawer,
    },
    props: {
        type: String // 过滤类型
    },
    setup (props, { emit }) {
        const visible = ref(false)
        const filterDrawerRef = ref(null)
        const toggle = (a, b) => {
            visible.value = !visible.value
            nextTick(() => {
                filterDrawerRef.value.open(a, b)
            })
        }
        const close = () => {
            visible.value = false
        }
        const handleConfirm = (params) => {
            emit('confirm', params)
        }
        return {
            visible,
            close,
            toggle,
            handleConfirm,
            filterDrawerRef,
            isPC: window.isPC
        }
    },
}
</script>

<style lang="scss" scoped>
.layout {
    display: flex;
    padding: 15px 0;
    flex: 1;
}
.layout-left {
    flex: 0 0 auto;
    width: 0;
    height: 0;
    align-self: flex-start;
    white-space: nowrap;
    box-sizing: border-box;
    transition: width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms;
    overflow-x: hidden;
    &.visible {
        overflow: inherit;
        position: sticky;
        top: 145px;
        width: 320px;
        height: auto;
        padding-right: 8px;
        margin-right: 8px;
        border-right: 1px solid var(--lineColor);
    }
}
.layout-right {
    -webkit-box-flex: 1;
    flex-grow: 1;
}
</style>

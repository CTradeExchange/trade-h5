<template>
    <div class='tab-bar'>
        <div class='tab-item' :class='{ active: curIndex === 0 }' @click='handleChangeTab(0)'>
            CFD全仓
        </div>
        <div class='tab-item' :class='{ active: curIndex === 1 }' @click='handleChangeTab(1)'>
            CFD逐仓
        </div>
        <div class='tab-item' :class='{ active: curIndex === 2 }' @click='handleChangeTab(2)'>
            杠杆全仓
        </div>
    </div>
</template>

<script>
import { computed, reactive, toRefs, watch, onBeforeUnmount, watchEffect } from 'vue'
export default {
    emits: ['updateTab'],
    props: ['index'],
    setup (props, context) {
        const state = reactive({
            curIndex: 0,

        })

        watchEffect(() => {
            state.curIndex = props.index
        })

        const handleChangeTab = (index) => {
            context.emit('updateTab', index)
            state.curIndex = index
        }

        return {
            handleChangeTab,
             ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.tab-bar {
    margin-top: rem(10px);
    margin-bottom: rem(40px);
    .tab-item {
        display: inline-block;
        margin-right: rem(55px);
        color: var(--minorColor);
        font-weight: bold;
        font-size: rem(28px);
        &.active {
            color: var(--color);
            font-size: rem(38px);
        }
    }
}
</style>

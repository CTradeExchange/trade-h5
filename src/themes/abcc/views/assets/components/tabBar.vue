<template>
    <div class='tab-bar'>
        <div class='tab-item' :class='{ active: curIndex === 1 }' @click='handleChangeTab(1)'>
            CFD全仓
        </div>
        <div class='tab-item' :class='{ active: curIndex === 2 }' @click='handleChangeTab(2)'>
            CFD逐仓
        </div>
        <div class='tab-item' :class='{ active: curIndex === 3 }' @click='handleChangeTab(3)'>
            杠杆全仓
        </div>
    </div>
</template>

<script>
import { computed, reactive, toRefs, watch, onBeforeUnmount, watchEffect } from 'vue'
export default {
    setup (props) {
        const state = reactive({
            curIndex: 1
        })

        const handleChangeTab = (index) => {
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

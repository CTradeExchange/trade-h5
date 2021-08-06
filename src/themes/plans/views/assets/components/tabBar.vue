<template>
    <div class='tab-bar'>
        <div v-for='(item,key) in planMap' :key='key' class='tab-item' :class='{ active: Number(curIndex+1) === Number(key) }' @click='handleChangeTab(key)'>
            {{ item.name }}
        </div>
    </div>
</template>

<script>
import { computed, reactive, toRefs, watch, onBeforeUnmount, watchEffect } from 'vue'
import { useStore } from 'vuex'
export default {
    emits: ['updateTab'],
    props: ['index'],
    setup (props, context) {
        const store = useStore()
        const state = reactive({
            curIndex: 0,

        })

        const planMap = computed(() => store.state._quote.planMap)

        watchEffect(() => {
            state.curIndex = props.index
        })

        const handleChangeTab = (index) => {
            context.emit('updateTab', index)
            state.curIndex = index
        }

        return {
            handleChangeTab,
            planMap,
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

<template>
    <div v-if='plans.length > 1' class='tab-bar'>
        <div v-for='(item, i) in plans' :key='i' class='tab-item' :class='{ active: Number(curIndex+1) === Number(item.id) }' @click='handleChangeTab(i)'>
            {{ item.name }}
        </div>
    </div>
</template>

<script>
import { computed, reactive, toRefs, watch, onBeforeUnmount, onMounted, watchEffect } from 'vue'
import { useStore } from 'vuex'
export default {
    emits: ['updateTab'],
    props: ['index'],
    setup (props, context) {
        const store = useStore()
        const state = reactive({
            curIndex: 0,

        })

        const plans = computed(() => store.state._base.plans)

        watchEffect(() => {
            state.curIndex = props.index
        })

        const handleChangeTab = (index) => {
            context.emit('updateTab', index)
            state.curIndex = index
        }

        onMounted(() => {
            if (plans.value.length === 1) {
                store.commit('_quote/Update_tradeType', plans.value[0].id)
            }
        })

        return {
            handleChangeTab,
            plans,
             ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.tab-bar {
    height: rem(54px);
    margin-top: rem(10px);
    margin-bottom: rem(40px);
    .tab-item {
        display: inline-block;
        margin-right: rem(45px);
        color: var(--minorColor);
        font-weight: bold;
        font-size: rem(28px);
        transition: all 0.3s;
        &.active {
            color: var(--color);
            font-size: rem(38px);
        }
    }
}
</style>

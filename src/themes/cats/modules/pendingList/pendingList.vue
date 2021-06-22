<template>
    <div class='pending-wrap'>
        <van-empty v-if='orderList.length===0' :description='$t("trade.pendingEmpty")' />
        <template v-else>
            <pendingItem v-for='item in orderList' :key='item' :data='item' />
        </template>
    </div>
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import pendingItem from './pendingItem'
export default {
    components: {
        pendingItem,
    },
    emits: ['refresh'],
    setup (props, { emit }) {
        const store = useStore()
        const state = reactive({
            show: false,
            loading: false
        })

        const orderList = computed(() => store.state._trade.pendingList)
        return {
            ...toRefs(state),
            orderList,
        }
    },
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.pending-wrap {
    padding-top: rem(40px);
}
</style>

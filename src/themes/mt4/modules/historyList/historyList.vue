<template>
    <div>
        <div v-if='orderList && orderList.length===0 && $store.state._trade.historyLoading' class='loading'>
            <van-loading type='spinner' />
        </div>
        <van-empty v-else-if='orderList && orderList.length===0' description='无历史记录' />
        <template v-else-if='orderList'>
            <van-list
                v-model:loading='loading'
                :finished='finished'
                finished-text='没有更多了'
                :immediate-check='false'
                @load='onLoad'
            >
                <positionItem v-for='item in orderList' :key='item' :data='item' />
            </van-list>
            <!-- <positionItem v-for='item in orderList' :key='item' :data='item' /> -->
        </template>
    </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import positionItem from './historyItem'
export default {
    components: {
        positionItem,
    },
    props: {
        loading: Boolean,
        finished: Boolean,
    },
    setup (props, { emit }) {
        const store = useStore()
        const orderList = computed(() => store.state._trade.historyList)

        const onLoad = () => {
            emit('onLoad')
        }

        return {
            orderList,
            onLoad,
        }
    },
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.loading {
    padding-top: 30%;
    text-align: center;
}
</style>

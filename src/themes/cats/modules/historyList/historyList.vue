<template>
    <div>
        <van-empty v-if='!loadStatus && orderList && orderList.length===0' :description='$t("trade.closedEmpty")' />
        <template v-else-if='orderList'>
            <van-list
                v-model:loading='loadStatus'
                :finished='finished'
                :finished-text='$t("historyList.noMore")'
                :immediate-check='false'
                @load='onLoad'
            >
                <HistoryItem v-for='item in orderList' :key='item' :data='item' />
            </van-list>
            <!-- <positionItem v-for='item in orderList' :key='item' :data='item' /> -->
        </template>
    </div>
</template>

<script>
import { computed, reactive, toRefs, watchEffect } from 'vue'
import { useStore } from 'vuex'
import HistoryItem from './historyItem'
export default {
    components: {
        HistoryItem,
    },
    props: {
        loading: Boolean,
        finished: Boolean,
    },
    setup (props, { emit }) {
        const store = useStore()
        const orderList = computed(() => store.state._trade.historyList)
        const state = reactive({
            loadStatus: props.loading
        })
        const onLoad = () => {
            emit('onLoad')
        }
        watchEffect(() => {
            state.loadStatus = props.loading
        })

        return {
            ...toRefs(state),
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

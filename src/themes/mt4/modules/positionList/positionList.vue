<template>
    <div ref='positionWrap'>
        <div v-if='positionList.length===0 && $store.state._trade.positionLoading' class='loading'>
            <van-loading type='spinner' />
        </div>
        <van-empty v-else-if='positionList.length===0' description='无历史记录' />
        <template v-else>
            <positionItem v-for='item in positionList' :key='item' v-longpress:closePosition='item' :data='item' />
        </template>
    </div>
    <van-popup v-model:show='show'>
        <section class='popContainer'>
            <p class='title'>
                {{ cur.symbolName }},
                {{ cur.direction===1?'buy':'sell' }}
            </p>
            <div class='menulist'>
                <a class='item van-hairline--bottom' href='javascript:;' @click='openOrder'>
                    平仓
                </a>
                <a class='item van-hairline--bottom' href='javascript:;' @click='newOrder'>
                    新订单
                </a>
                <a class='item van-hairline--bottom' href='javascript:;' @click='modifyOrder'>
                    修改订单
                </a>
                <a class='item van-hairline--bottom' href='javascript:;' @click='toChart'>
                    图表
                </a>
            </div>
        </section>
    </van-popup>
    <Loading :show='loading' />
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import positionItem from './positionItem'
import { useRouter } from 'vue-router'
export default {
    components: {
        positionItem,
    },
    emits: ['refresh'],
    setup (props, { emit }) {
        const store = useStore()
        const router = useRouter()
        const state = reactive({
            show: false,
            loading: false,
            cur: {},
        })
        const positionList = computed(() => store.state._trade.positionList)

        // 长按持仓
        const closePosition = (item) => {
            store.commit('_quote/Update_productActivedID', item.symbolId)
            state.cur = item
            state.show = true
        }
        // 去图表
        const toChart = () => {
            router.push({ name: 'Chart', query: { symbolId: state.cur.symbolId } })
        }
        // 平仓
        const openOrder = () => {
            router.push(
                {
                    name: 'Order',
                    query: {
                        symbolId: state.cur.symbolId,
                        positionId: state.cur.positionId,
                        direction: state.cur.direction,
                        openVolume: state.cur.openVolume,
                        openNum: state.cur.openNum,
                        stopLossDecimal: state.cur.stopLossDecimal,
                        takeProfitDecimal: state.cur.takeProfitDecimal,
                        isClosePosition: true
                    }
                })
        }

        // 新订单
        const newOrder = () => {
            state.show = false
            router.push({ name: 'Order', query: { symbolId: state.cur.symbolId } })
        }
        // 修改订单
        const modifyOrder = () => {
            state.show = false
            router.push({ name: 'Order', query: { symbolId: state.cur.symbolId, positionId: state.cur.positionId, orderId: state.cur.orderId, takeProfit: state.cur.takeProfitDecimal, stopLoss: state.cur.stopLossDecimal, isModifyPosition: true } })
        }
        return {
            ...toRefs(state),
            positionList,
            closePosition,
            toChart,
            openOrder,
            newOrder,
            modifyOrder,
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
.popContainer {
    width: 80vw;
    background: var(--white);
    .title {
        padding: rem(35px) rem(30px);
        color: var(--primary);
        font-size: rem(40px);
        border-bottom: 2px solid var(--primary);
    }
    .menulist {
        .item {
            @include active()
        ;
            display: block;
            padding: 0 rem(30px);
            color: var(--color);
            line-height: rem(94px);
        }
    }
}
</style>

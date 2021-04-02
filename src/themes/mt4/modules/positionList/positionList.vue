<template>
    <div ref='positionWrap' >
        <div v-if='positionList.length===0 && $store.state._trade.positionLoading' class='loading'>
            <van-loading type='spinner' />
        </div>
        <van-empty v-else-if='positionList.length===0' description='无历史记录' />
        <template v-else>
            <positionItem v-for='item in positionList' :key='item' :data='item' v-longpress:closePosition="item" />
        </template>
    </div>
    <van-popup v-model:show='show'>
        <section class='popContainer'>
            <p class='title'>
                {{cur.symbolName}},
                {{cur.direction===1?'buy':'sell'}}
            </p>
            <div class='menulist'>
                <a class='item van-hairline--bottom' href='javascript:;' @click='openOrder'>
                    平仓
                </a>
                <a class='item van-hairline--bottom' href='javascript:;' @click="show=false;$router.push('/chart')">
                    新订单
                </a>
                <a class='item van-hairline--bottom' href='javascript:;' @click='toContract'>
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
import { addMarketOrder } from '@/api/trade'
import Loading from '@m/components/loading'
export default {
    components: {
        positionItem,
        Loading,
    },
    setup () {
        const store = useStore()
        const router = useRouter()
        const state = reactive({
            show: false,
            loading: false,
            cur: {},
        })
        const product = computed(() => store.getters.productActived)
        const positionList = computed(() => store.state._trade.positionList)
        const closePosition=(item)=>{
            store.commit('Update_productActivedID', item.symbolId)
            state.cur = item;
            state.show = true
        }
        const toChart = ()=>{
            router.push({name:'Chart',query:{ symbolId: state.cur.symbolId}});
        }
        // 平仓
        const openOrder = () => {
            state.show = false
            const direction = state.cur.direction
            const requestPrice = direction === 1 ? product.value.sell_price : product.value.buy_price
            const params = {
                bizType: 2, // 业务类型。0-默认初始值；1-市价开；2-市价平；3-止损平仓单；4-止盈平仓单；5-爆仓强平单；6-到期平仓单；7-销户平仓单；8-手动强平单；9-延时订单；10-限价预埋单；11-停损预埋单；
                direction: direction === 1 ? 2 : 1, // 订单买卖方向。1-买；2-卖；
                symbolId: Number(state.cur.symbolId),
                requestTime: Date.now(),
                requestNum: Number(state.cur.openNum),
                requestPrice: Number(requestPrice),
            }
            state.loading = true
            addMarketOrder(params).then(res => {
                state.loading = false
                if (res.invalid()) return false
                state.pendingVisible = true
            }).catch(err => {
                state.loading = false
            })
        }
        return {
            ...toRefs(state),
            positionList,
            closePosition,
            toChart,
            openOrder,
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

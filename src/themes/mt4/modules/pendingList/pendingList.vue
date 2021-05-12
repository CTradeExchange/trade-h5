<template>
    <div ref='positionWrap'>
        <div v-if='orderList.length===0 && $store.state._trade.positionLoading' class='loading'>
            <van-loading type='spinner' />
        </div>
        <van-empty v-else-if='orderList.length===0' description='无历史记录' />
        <template v-else>
            <pendingItem v-for='item in orderList' :key='item' v-longpress:closePosition='item' :data='item' />
        </template>
    </div>
    <van-popup v-model:show='show'>
        <section class='popContainer'>
            <p class='title'>
                {{ cur.symbolName }},
                {{ cur.direction===1?'buy':'sell' }}
            </p>
            <div class='menulist'>
                <a class='item van-hairline--bottom' href='javascript:;' @click='modifyOrder'>
                    修改订单
                </a>
                <a class='item van-hairline--bottom' href='javascript:;' @click='delOrder'>
                    删除订单
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
import pendingItem from './pendingItem'
import { useRouter } from 'vue-router'
import { addMarketOrder, closePboOrder } from '@/api/trade'
import Loading from '@m/components/loading'
import { Toast } from 'vant'
export default {
    components: {
        pendingItem,
        Loading,
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
        const product = computed(() => store.getters.productActived)
        const orderList = computed(() => store.state._trade.pendingList)
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
            state.show = false
            const direction = state.cur.direction
            const requestPrice = direction === 1 ? product.value.sell_price : product.value.buy_price
            const params = {
                bizType: 2, // 业务类型。0-默认初始值；1-市价开；2-市价平；3-止损平仓单；4-止盈平仓单；5-爆仓强平单；6-到期平仓单；7-销户平仓单；8-手动强平单；9-延时订单；10-限价预埋单；11-停损预埋单；
                direction: direction === 1 ? 2 : 1, // 订单买卖方向。1-买；2-卖；
                symbolId: state.cur.symbolId,
                positionId: state.cur.positionId,
                requestTime: Date.now(),
                requestNum: Number(state.cur.openNum),
                requestPrice: Number(requestPrice),
            }
            state.loading = true
            addMarketOrder(params).then(res => {
                state.loading = false
                if (res.invalid()) return false
                emit('refresh')
                state.pendingVisible = true
            }).catch(err => {
                state.loading = false
            })
        }

        // 删除订单
        const delOrder = () => {
            state.show = false
            // bizType 0-默认初始值；1-市价开；2-市价平；3-止损平仓单；4-止盈平仓单；5-爆仓强平单；6-到期平仓单；7-销户平仓单；8-手动强平单；9-延时订单；10-限价预埋单；11-停损预埋单；
            const params = {
                pboId: state.cur.id,
                bizType: state.cur.bizType
            }
            closePboOrder(params).then(res => {
                if (res.check()) {
                    Toast('删除成功')
                    store.dispatch('_trade/queryPBOOrderPage')
                }
            }).catch(err => {
                console.log(err)
            })

            // router.push({ name: 'Order', query: { symbolId: state.cur.symbolId } })
        }
        // 修改订单
        const modifyOrder = () => {
            state.show = false
            router.push({ name: 'Order', query: { symbolId: state.cur.symbolId, pendingId: state.cur.id } })
        }
        return {
            ...toRefs(state),
            orderList,
            closePosition,
            toChart,
            openOrder,
            delOrder,
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

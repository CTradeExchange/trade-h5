<template>
    <div class='homeWrap'>
        <van-tabs
            v-model:active='active'
            :background='$store.state.style.primary'
            color='#fff'
            sticky
            swipeable
            title-active-color='#fff'
            title-inactive-color='#fff'
        >
            <van-tab title='关注列表'>
                <StarBar class='of-1px-bottom' />
                <ProductList />
            </van-tab>
            <van-tab title='持仓'><PositionList /></van-tab>
            <van-tab title='订单'>订单</van-tab>
            <!-- <van-tab title='价格提醒'>价格提醒</van-tab> -->
            <van-tab title='历史'><HistoryList /></van-tab>
            <van-tab title='交易'><TradeList /></van-tab>
        </van-tabs>
        <a class='fastOrder' href='javascript:;' @click="$router.push('/order')">
            <i class='icon_xindingdan'></i>
        </a>
    </div>
</template>

<script>

import ProductList from '@ct/modules/productList/productList.vue'
import PositionList from '@ct/modules/positionList/positionList.vue'
import HistoryList from '@ct/modules/historyList/historyList.vue'
import TradeList from '@ct/modules/tradeList/tradeList.vue'
import StarBar from '@ct/modules/starBar.vue'
export default {
    components: {
        ProductList,
        PositionList,
        HistoryList,
        TradeList,
        StarBar,
    },
    data () {
        return {
            active: 0
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
:deep(.van-tab) {
    opacity: 0.7;
}
:deep(.van-tab--active) {
    opacity: 1;
}
:deep(.van-tab__pane) {
    min-height: 75vh;
}
.fastOrder {
    position: absolute;
    right: rem(30px);
    bottom: rem(160px);
    width: rem(120px);
    height: rem(120px);
    color: var(--white);
    font-size: rem(50px);
    line-height: rem(110px);
    text-align: center;
    background: var(--primary);
    border-radius: 100%;
}
</style>

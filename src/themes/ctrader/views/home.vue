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
            <van-tab title='价格提醒'>价格提醒</van-tab>
            <van-tab title='历史'>历史</van-tab>
            <van-tab title='交易'>交易</van-tab>
        </van-tabs>
        <a class='fastOrder' href='javascript:;'>
            <i class='icon_qingdan'></i>
        </a>
    </div>
</template>

<script>

import ProductList from '@ct/modules/productList/productList.vue'
import PositionList from '@ct/modules/positionList/positionList.vue'
import StarBar from '@ct/modules/starBar.vue'
export default {
    components: {
        ProductList,
        PositionList,
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
:deep(.van-tab){
    opacity: .7;
}
:deep(.van-tab--active){
    opacity: 1;
}
:deep(.van-tab__pane){
    min-height: 75vh;
}
.fastOrder{
    position: absolute;
    bottom: rem(160px);
    right: rem(30px);
    width: rem(120px);
    height: rem(120px);
    line-height: rem(110px);
    border-radius: 100%;
    background: var(--primary);
    color: var(--white);
    text-align: center;
    font-size: rem(50px);
}
</style>

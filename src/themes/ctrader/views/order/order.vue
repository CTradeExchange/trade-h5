<template>
    <div class='orderWrap'>
        <layoutTop
            ref='root'
            class='layoutTop'
            :title='$route.meta.title'
        >
            <span>创建订单</span>
        </layoutTop>
        <van-tabs
            v-model:active='active'
            :background='$store.state.style.primary'
            class='orderTab'
            color='#fff'
            swipeable
            title-active-color='#fff'
            title-inactive-color='#fff'
        >
            <van-tab title='市场'>
                <OrderSet :type='1' />
            </van-tab>
            <van-tab title='现价单'><OrderSet :type='2' /></van-tab>
            <van-tab title='止损单'><OrderSet :type='3' /></van-tab>
            <!-- <van-tab title='价格提醒'>价格提醒</van-tab> -->
            <van-tab title='限价'><OrderSet :type='4' /></van-tab>
        </van-tabs>
    </div>
</template>

<script>

import OrderSet from './component/orderSet'
import layoutTop from '@ct/layout/top'
export default {
    components: {
        OrderSet,
        layoutTop,
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
    height: calc(100vh - 44px - 45px);
    overflow: auto;
}
</style>

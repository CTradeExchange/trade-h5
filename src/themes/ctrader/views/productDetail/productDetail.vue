<template>
    <div class='productDetailWrap'>
        <div class='container'>
            <layoutTop
                class='layoutTop'
                :menu='false'
            >
                <p class='selectedProduct'>
                    <span class='proName' @click='productsSheetVisible = true'>AUDUSD</span>
                    <i class='icon_xiala' @click='productsSheetVisible = true'></i>
                </p>
            </layoutTop>
            <van-tabs
                v-model:active='active'
                :background='$store.state.style.primary'
                color='#fff'
                sticky
                swipeable
                title-active-color='#fff'
                title-inactive-color='#fff'
            >
                <van-tab title='总览'>
                    <productInfo />
                    <chart />
                </van-tab>
                <van-tab title='持仓'><PositionList /></van-tab>
                <van-tab title='订单'><TradeList /></van-tab>
                <van-tab title='历史'><HistoryList /></van-tab>
            </van-tabs>
        </div>
        <footerMenu id='footerMenu' class='footerMenu' />
        <a class='fastOrder' href='javascript:;'>
            <i class='icon_xindingdan'></i>
        </a>
    </div>
    <van-action-sheet v-model:show='productsSheetVisible' :actions='productsSheetData' @select='productsSheetDataSelected' />
</template>

<script>
import layoutTop from '@ct/layout/top'
import footerMenu from '@ct/layout/footerMenu'
import productInfo from '@ct/modules/productDetail/productInfo'
import chart from '@ct/modules/productDetail/chart'
import PositionList from '@ct/modules/positionList/positionList.vue'
import HistoryList from '@ct/modules/historyList/historyList.vue'
import TradeList from '@ct/modules/tradeList/tradeList.vue'
export default {
    components: {
        layoutTop,
        footerMenu,
        productInfo,
        chart,
        PositionList,
        HistoryList,
        TradeList
    },
    data () {
        return {
            active: 0,
            productsSheetVisible: false,
            productsSheetData: [
                { name: '选项一' },
                { name: '选项一' },
                { name: '选项一' },
                { name: '选项一' },
            ],
        }
    },
    methods: {
        productsSheetDataSelected (item) {
            this.productsSheetVisible = false
            console.log(item)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.productDetailWrap {
    display: flex;
    flex-flow: column;
    height: 100%;
    background: var(--bgColor);
    .container {
        flex: 1;
        overflow: auto;
    }
    :deep(.van-tab__pane) {
        min-height: 75vh;
    }
}
.selectedProduct {
    margin-left: rem(20px);
    font-size: rem(30px);
    .proName {
        padding-right: rem(20px);
    }
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

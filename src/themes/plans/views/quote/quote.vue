<template>
    <div id='homeContent' ref='homeContent' class='home' :class='{ hasNav: $hasNav }'>
        <PageComp :data='pageModules' />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const pageModules = ref([])
store.dispatch('_base/getPageConfig', 'TradeIndex').then(res => {
    console.log(res)
    pageModules.value = res
})
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.quoteWrap {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: flex-start;
    width: 100%;
    // margin-top: rem(90px);
    overflow: auto;
    background: var(--bgColor);
    &.hasNav{
        padding-bottom: rem(100px);
    }
    .productListWrap {
        flex: 1;
        overflow-y: auto;
    }
}
.tradeNav {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    //padding-bottom: rem(10px);
    background-color: var(--contentColor);
    //border-bottom: solid 4px var(--lineColor);
    .van-tab {
        background: yellow !important;
    }
    .tradeSortNav {
        padding-right: rem(64px) !important;
    }
    .iconSearch {
        position: absolute;
        top: rem(30px);
        right: rem(28px);
        font-size: rem(32px);
    }
}
.titleBar {
    display: flex;
    height: rem(60px);
    padding: 0 rem(30px);
    color: var(--minorColor);
    font-size: rem(20px);
    line-height: rem(60px);
    background-color: var(--contentColor);
    &::after {
        border-color: var(--bgColor);
    }
    .item {
        width: rem(210px);
        text-align: right;
        &:first-child {
            flex: 1;
            text-align: left;
        }
        &:nth-child(2) {
            width: rem(210px);
            text-align: left;
        }
    }
}
</style>

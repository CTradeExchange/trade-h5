<template>
    <div class='titleBar of-1px-bottom'>
        <div class='productName'>交易商品</div>
        <div class='position'>仓位</div>
        <div class='NetProfitLoss'>净盈亏</div>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.titleBar{
    padding: rem(30px) rem(40px);
    width: 100%;
    display: flex;
    align-items: center;
    font-size: rem(26px);
    color: var(--muted);
    .productName{
        position: relative;
        padding-left: rem(50px);
    }
    .position{
        flex: 1;
        text-align: center;
    }
    .NetProfitLoss{
        width: 25%;
    }
}
</style>

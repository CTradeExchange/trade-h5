<template>
    <div class='switchTradeType'>
        <div class='productInfo'>
            <span class='icon_chouti' @click="$emit('switchProduct')"></span>
            <span class='productName'>
                {{ product.displayName }}
            </span>
            <span class='upDownWidth' :class='product.upDownColor'>
                {{ product.upDownWidth }}
            </span>
            <span class='chartIcon icon_icon_chart' @click="$router.push({ name:'Product', query: { symbolId:product.symbolId, tradeType:product.tradeType } })"></span>
        </div>
    </div>
</template>

<script>
export default {
    props: ['product'],
    emits: ['switchProduct'],
    setup (props, { emit }) {
        return {}
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.switchTradeType {
    position: relative;
    background: var(--contentColor);
}
.switchWrapper {
    display: flex;
    height: rem(90px);
    padding: 0 rem(30px);
    color: var(--minorColor);
    font-size: rem(28px);
    line-height: rem(90px);
    border-bottom: 1px solid var(--assistColor);
    .item {
        margin-right: rem(35px);
        vertical-align: baseline;
    }
    .active {
        color: var(--color);
        font-weight: bold;
        font-size: rem(38px);
    }
}
.productInfo {
    display: flex;
    align-items: center;
    height: rem(104px);
    padding: 0 rem(30px);
    font-size: rem(34px);
    line-height: rem(104px);
    .icon_chouti {
        padding-right: rem(20px);
        font-size: rem(29px);
    }
    .productName {
        padding-right: rem(20px);
    }
    .upDownWidth {
        flex: 1;
    }
    .chartIcon {
        width: rem(62px);
        height: rem(58px);
        color: var(--primary);
        font-weight: 500;
        font-size: rem(34px);
        line-height: rem(58px);
        text-align: center;
        background: var(--primaryAssistColor);
        border-radius: 3px;
    }
}
</style>

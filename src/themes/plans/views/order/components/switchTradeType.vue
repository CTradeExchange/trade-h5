<template>
    <div class='switchTradeType'>
        <div v-if='product' class='productInfo'>
            <span class='icon_chouti1' @click="$emit('switchProduct')"></span>
            <span class='productName'>
                {{ product.symbolName }}
            </span>
            <ETF v-if='product.etf' />
            <span class='upDownWidth' :class='product.rolling_upDownColor'>
                {{ product.rolling_upDownWidth }}
                <!-- {{ parseFloat(product.upDownWidth) > 0 ? '+'+ product.upDownWidth : '-'+ Math.abs(parseFloat(product.upDownWidth)) }} -->
            </span>
            <span class='chartIcon icon_tubiao' @click="$router.push({ name:'Product', query: { symbolId:product.symbolId, tradeType:product.tradeType } })"></span>
        </div>
    </div>
</template>

<script>
import ETF from '@plans/components/etfIcon.vue'
export default {
    components: {
        ETF,
    },
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
    .icon_chouti1 {
        padding-right: rem(20px);
        font-size: rem(26px);
    }
    .productName {
        padding-right: rem(20px);
        font-weight: bold;
    }
    .upDownWidth {
        flex: 1;
    }
    .chartIcon {
        width: rem(62px);
        height: rem(58px);
        color: var(--normalColor);
        font-weight: 500;
        line-height: rem(58px);
        text-align: center;
        border-radius: 3px;
        font-size: rem(30px);
    }
}
</style>

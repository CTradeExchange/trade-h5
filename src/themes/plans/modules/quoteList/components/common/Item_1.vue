<template>
    <div v-if='props.showTitle' class='van-hairline--bottom row title'>
        <span class='th'>
            {{ $t('trade.nameCode') }}
        </span>
        <span class='th textRight'>
            {{ $t('trade.buyPrice') }}
        </span>
        <span class='th textRight'>
            {{ $t('trade.sellPrice') }}
        </span>
    </div>
    <productListComp v-if='props.productList.length' ref='productListEl' class='listBody' :product-list='props.productList'>
        <template #default='{ product,open }'>
            <div class='row product of-1px-bottom' @click='open'>
                <span
                    class='val'
                    :class='[
                        getLen(product.symbolName) > 10 && "small",
                        getLen(product.symbolName) > 15 && "mini"]'
                >
                    {{ product.symbolName }}
                </span>
                <span class='val textRight' :class='[product.buy_color, "digits"+product.price_digits]'>
                    {{ formatPrice(product.buy_price) }}
                </span>
                <span class='val textRight' :class='[product.sell_color, "digits"+product.price_digits]'>
                    {{ product.sell_price || 'a' }}
                    {{ formatPrice(product.sell_price) }}
                </span>
            </div>
        </template>
    </productListComp>
</template>

<script setup>
import productListComp from '@plans/modules/productList/productList.vue'
import { getLen } from '@/utils/util'

const props = defineProps({
    productList: {
        type: Object,
        default: null
    },
    showTitle: {
        type: Boolean,
        default: true
    }
})

const formatPrice = val => {
    return !isNaN(val * 1) ? val : '- -'
}

</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';

.row{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: nowrap;
    padding: 0 rem(30px);
    background-color: var(--contentColor);
    &.title{
        color: var(--minorColor);
        font-size: rem(20px);
        height: rem(60px);
        line-height: rem(60px);
    }
    &.product{
        height: rem(116px);
        line-height: rem(116px);
    }
    .th:nth-child(1), .val:nth-child(1){
        flex: 1;
    }
    .th:nth-child(2), .val:nth-child(2){
        flex: 0 0 rem(210px);
    }
    .th:nth-child(3), .val:nth-child(3){
        flex: 0 0 rem(210px);
    }

    .val:nth-child(1){
        @include ellipsis();
        color: var(--color);
        font-weight: 400;
        font-size: rem(30px);
        &.small {
            font-size: rem(26px);
        }
        &.mini {
            font-size: rem(22px);
        }
    }
    .val:nth-child(2), .val:nth-child(3){
        font-size: rem(30px);
    }
}

.digits11,
.digits12,
.digits13 {
    font-size: rem(26px);
}
.digits14,
.digits15,
.digits16 {
    font-size: rem(22px);
}

.textRight{
    text-align: right;
}

.listBody{
    flex: 1;
    overflow-y: auto;
}
</style>

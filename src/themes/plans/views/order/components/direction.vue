<template>
    <div v-if='product' class='directions' :class="{ 'tradeType9': [3,9].includes(product.tradeType) }">
        <div class='item sell' :class="{ 'active':modelValue==='sell' }" @click="setDirection('sell')">
            {{ $t('trade.sell') }}
            <span v-if='[1,2].includes(product.tradeType)' class='flRight price'>
                {{ product.sell_price }}
            </span>
        </div>
        <div class='item buy' :class="{ 'active':modelValue==='buy' }" @click="setDirection('buy')">
            <span v-if='[1,2].includes(product.tradeType)' class='price'>
                {{ product.buy_price }}
            </span>
            <span class='flRight'>
                {{ $t('trade.buy') }}
            </span>
        </div>
    </div>
</template>

<script>
export default {
    props: ['modelValue', 'product'],
    emits: ['update:modelValue'],
    setup (props, { emit }) {
        const setDirection = (data) => {
            emit('update:modelValue', data)
        }
        return {
            setDirection
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.directions {
    position: relative;
    display: flex;
    &.tradeType9 {
        text-align: center;
        .item {
            padding: 0 !important;
            line-height: rem(80px);
        }
        .flRight {
            float: none;
            text-align: center;
        }
    }
    .item {
        flex: 1;
        box-sizing: border-box;
        height: rem(80px);
        padding: rem(10px) rem(20px);
        color: var(--color);
        line-height: rem(60px);
        background: var(--assistColor);
        border-radius: rem(6px);
        &.sell {
            margin-right: 5px;
            padding-right: rem(45px);
            &.active {
                color: #FFF;
                background: var(--fallColor);
            }
        }
        &.buy {
            margin-left: 5px;
            padding-left: rem(45px);
            &.active {
                color: #FFF;
                background: var(--riseColor);
            }
        }
    }
    .price {
        font-size: rem(30px);
    }
    .flRight {
        float: right;
    }
}
</style>

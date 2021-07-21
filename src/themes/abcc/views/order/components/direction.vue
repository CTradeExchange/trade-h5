<template>
    <div v-if='product' class='directions'>
        <div class='item sell' :class="{ 'active':modelValue==='sell' }" @click="setDirection('sell')">
            {{ $t('trade.sell') }}
            <span class='flRight price'>
                {{ product.sell_price }}
            </span>
        </div>
        <div class='item buy' :class="{ 'active':modelValue==='buy' }" @click="setDirection('buy')">
            <span class='price'>
                {{ product.buy_price }}
            </span>
            <span class='flRight'>
                {{ $t('trade.buy') }}
            </span>
        </div>
        <span v-if='product.spread_text' class='spread_text'>
            {{ product.spread_text }}
        </span>
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
    .spread_text {
        position: absolute;
        top: 50%;
        left: 50%;
        display: inline-block;
        min-width: rem(20px);
        height: rem(40px);
        padding: 0 rem(10px);
        color: var(--color);
        font-size: rem(20px);
        line-height: rem(36px);
        text-align: center;
        background: var(--primaryAssistColor);
        border: 2px solid var(--contentColor);
        border-radius: rem(6px);
        transform: translate3d(-50%, -50%, 1px) scale(1);
    }
}
</style>

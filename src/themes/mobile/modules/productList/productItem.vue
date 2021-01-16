<template>
    <div class='productItem of-1px-bottom position' :class="[quoteMode===1?'mode1':'mode2']" @click="$emit('open')">
        <div class='hd'>
            <p class='productName'>EURCAD</p>
            <p class='time'>06:43:18</p>
            <p class='p'>点差：19</p>
        </div>
        <div class='col'>
            <p class='fallColor'>
                <Price :mode='quoteMode' />
            </p>
            <p class='muted limitPrice'>最低：1.55067</p>
        </div>
        <div class='col'>
            <p class='riseColor'>
                <Price :mode='quoteMode' />
            </p>
            <p class='muted limitPrice'>最高：1.55067</p>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import Price from '@m/components/price'
export default {
    components: {
        Price,
    },
    computed: {
        ...mapState(['quoteMode'])
    },
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.productItem{
    position: relative;
    display: flex;
    padding: rem(20px) rem(40px);
    overflow: hidden;
    @include active();
    &.position::before{
        position: absolute;
        content: '';
        left: 0;
        top: 0;
        width: rem(40px);
        height: rem(40px);
        background: var(--riseColor);
        transform: translate(-50%, -50%) rotate(45deg);
        transform-origin: center;
    }
    &.mode1{
        .hd{
            .time,.p{
                display: none;
            }
        }
        .limitPrice{
            display: none;
        }
    }
    .hd{
        font-size: rem(22px);
        color: var(--mutedColor);
        line-height: 1.3;
        flex: 1;
    }
    .productName{
        font-size: rem(36px);
        font-weight: normal;
        color: var(--color);
    }
    .col{
        text-align: right;
        font-size: rem(24px);
        margin-left: rem(46px);
        &:first-of-type{
            margin-left: 0;
        }
    }
}
</style>

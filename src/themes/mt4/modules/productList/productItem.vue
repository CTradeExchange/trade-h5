<template>
    <div class='productItem of-1px-bottom position' :class="[quoteMode===1?'mode1':'mode2']" @click="$emit('open')">
        <div class='hd'>
            <p class='productName'>
                {{ product.name }}
            </p>
            <p class='time'>
                {{ tickTime }}
            </p>
            <p class='p'>
                点差：19
            </p>
        </div>
        <div class='col'>
            <p class='fallColor'>
                <Price :data='product.sell_price' :mode='quoteMode' />
            </p>
            <p v-show='product.low_price' class='muted limitPrice'>
                最低：{{ product.low_price }}
            </p>
        </div>
        <div class='col'>
            <p class='riseColor'>
                <Price :data='product.buy_price' :mode='quoteMode' />
            </p>
            <p v-show='product.high_price' class='muted limitPrice'>
                最高：{{ product.high_price }}
            </p>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import Price from '@m/components/price'
import dayjs from 'dayjs'
export default {
    components: {
        Price,
    },
    props: {
        product: {
            type: Object,
            default: {}
        },
    },
    setup (props, context) {
        const store = useStore()
        const quoteMode = computed(() => {
            return store.state.quoteMode
        })
        const tickTime = computed(() => {
            const tick_time = props.product.tick_time ?? ''
            return tick_time ? dayjs(Number(tick_time)).format('HH:mm:ss') : ''
        })
        return {
            tickTime,
            quoteMode,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.productItem {
    @include active();
    position: relative;
    display: flex;
    padding: rem(20px) rem(40px);
    overflow: hidden;
    &.position::before {
        position: absolute;
        top: 0;
        left: 0;
        width: rem(40px);
        height: rem(40px);
        background: var(--riseColor);
        transform: translate(-50%, -50%) rotate(45deg);
        transform-origin: center;
        content: '';
    }
    &.mode1 {
        .hd {
            .time,
            .p {
                display: none;
            }
        }
        .limitPrice {
            display: none;
        }
    }
    .hd {
        flex: 1;
        color: var(--mutedColor);
        font-size: rem(22px);
        line-height: 1.3;
    }
    .productName {
        color: var(--color);
        font-weight: normal;
        font-size: rem(36px);
    }
    .col {
        margin-left: rem(46px);
        font-size: rem(24px);
        text-align: right;
        &:first-of-type {
            margin-left: 0;
        }
    }
}
</style>

<template>
    <div class='productItem of-1px-bottom' :class='className' @click="$emit('open')">
        <div class='hd'>
            <p class='productName' :class='{ longName }'>
                {{ product.symbolName }}
            </p>
            <p class='time'>
                {{ tickTime }}
            </p>
            <p class='p'>
                点差：{{ product.spread_text }}
            </p>
        </div>
        <div class='col'>
            <p class='fallColor'>
                <Price :digit='product.price_digits' :mode='quoteMode' :point-ratio='product.pointRatio' :price='product.sell_price' />
            </p>
            <p v-show='product.low_price' class='muted limitPrice'>
                最低：{{ product.low_price }}
            </p>
        </div>
        <div class='col'>
            <p class='riseColor'>
                <Price :digit='product.price_digits' :mode='quoteMode' :point-ratio='product.pointRatio' :price='product.buy_price' />
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
import { getLen } from '@/utils/util'
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
    setup ({ product }, context) {
        const store = useStore()
        const positionList = computed(() => store.state._trade.positionList)
        const quoteMode = computed(() => store.state.quoteMode)
        const longName = computed(() => getLen(product?.symbolName) > 15)
        const tickTime = computed(() => {
            const tick_time = product.tick_time ?? ''
            return tick_time ? dayjs(Number(tick_time)).format('HH:mm:ss') : ''
        })
        const inPosition = computed(() => positionList.value.find(el => el.symbolId === parseInt(product.symbolId)))
        const className = computed(() => ({
            mode1: quoteMode.value === 1,
            mode2: quoteMode.value === 2,
            position1: inPosition?.value?.direction === 1,
            position2: inPosition?.value?.direction === 2,
        }))
        return {
            tickTime,
            quoteMode,
            inPosition,
            longName,
            className,
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
    &.position1::before {
        position: absolute;
        top: 0;
        left: 0;
        width: rem(40px);
        height: rem(40px);
        background: var(--buyColor);
        transform: translate(-50%, -50%) rotate(45deg);
        transform-origin: center;
        content: '';
    }
    &.position2::before {
        position: absolute;
        top: 0;
        left: 0;
        width: rem(40px);
        height: rem(40px);
        background: var(--sellColor);
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
        max-width: rem(280px);
        overflow: hidden;
        color: var(--color);
        font-weight: normal;
        font-size: rem(36px);
        white-space: nowrap;
        text-overflow: ellipsis;
        &.longName {
            font-size: 12px;
        }
    }
    .col {
        width: rem(200px);
        margin-left: rem(10px);
        font-size: rem(24px);
        text-align: right;
        &:last-of-type {
            margin-left: rem(30px);
        }
    }
}
</style>

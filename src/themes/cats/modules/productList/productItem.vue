<template>
    <div class='productItem of-1px-bottom' :class='className' :data-symbolId='product.symbolId' @click="$emit('open')">
        <div class='hd'>
            <p class='productName' :class='{ longName }'>
                {{ product.symbolName }}
            </p>
            <p class='time'>
                {{ tickTime }}
            </p>
            <p class='p'>
                {{ $t('trade.spread') + product.spread_text }}
            </p>
        </div>
        <div class='col'>
            <p :class='[product.sell_color]'>
                <Price :digit='product.price_digits' :mode='quoteMode' :point-ratio='product.pointRatio' :price='product.sell_price' />
            </p>
            <p v-show='product.low_price' class='muted limitPrice'>
                {{ $t('trade.lowest') + product.low_price }}
            </p>
        </div>
        <div class='col'>
            <p :class='[product.buy_color]'>
                <Price :digit='product.price_digits' :mode='quoteMode' :point-ratio='product.pointRatio' :price='product.buy_price' />
            </p>
            <p v-show='product.high_price' class='muted limitPrice'>
                {{ $t('trade.highest') + product.high_price }}
            </p>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import Price from '@c/components/price'
import dayjs from 'dayjs'
import { getLen } from '@/utils/util'
import { minus } from '@/utils/calculation'
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
        const longName = computed(() => getLen(product?.symbolName) > 10)
        const tickTime = computed(() => {
            const tick_time = product.tick_time ?? ''
            return tick_time ? dayjs(Number(tick_time)).format('HH:mm:ss') : ''
        })

        // 找出当前产品持仓手数
        const inPosition = computed(() => {
            const result = {
                buyVolumes: 0,
                sellVolumes: 0,
            }
            positionList.value.forEach(el => {
                if (el.symbolId === parseInt(product.symbolId)) {
                    result[el.direction === 1 ? 'buyVolumes' : 'sellVolumes'] += parseFloat(minus(el.openVolume, el.closeVolume))
                }
            })
            return result
        })

        const className = computed(() => ({
            mode1: quoteMode.value === 1,
            mode2: quoteMode.value === 2,
            position_buy: inPosition.value.buyVolumes && inPosition.value.buyVolumes >= inPosition.value.sellVolumes,
            position_sell: inPosition.value.sellVolumes && inPosition.value.buyVolumes < inPosition.value.sellVolumes,
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
    padding: rem(20px);
    overflow: hidden;
    &.position_buy::before {
        position: absolute;
        top: 0;
        left: 0;
        width: rem(30px);
        height: rem(30px);
        background: var(--buyColor);
        transform: translate(-50%, -50%) rotate(45deg);
        transform-origin: center;
        content: '';
    }
    &.position_sell::before {
        position: absolute;
        top: 0;
        left: 0;
        width: rem(30px);
        height: rem(30px);
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
        width: rem(160px);
        overflow: hidden;
        color: var(--color);
        font-weight: normal;
        font-size: rem(30px);
        white-space: nowrap;
        text-overflow: ellipsis;
        &.longName {
            font-size: 12px;
        }
    }
    .col {
        width: rem(280px);
        margin-left: rem(10px);
        font-size: rem(24px);
        text-align: right;
    }
}
</style>

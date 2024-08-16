<template>
    <div
        class='productItem'
        :class='[bgClass]'
        :data-symbolId='product.symbolId'
        @click.stop="$emit('open')"
    >
        <div v-if='product.symbolName' class='cell'>
            <div
                class='th name'
                :class="[
                    getLen(product.simplified) > 10 && 'small',
                    getLen(product.simplified) > 15 && 'mini',
                ]"
            >
                {{ product.symbolName }}
            </div>

            <div class='tb'>
                <span
                    class='sell_price'
                    :class="[
                        product.rolling_upDownColor,
                        'digits' + product.symbolDigits,
                    ]"
                >
                    {{
                        !product.rolling_upDownWidth &&
                            product.rolling_upDownWidth != 0
                            ? "- -"
                            : product.rolling_upDownWidth
                    }}
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import { computed, reactive, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
import { getLen, localGet, getQueryString } from '@/utils/util'
import ETF from '@plans/components/etfIcon'
export default {
    components: {
        ETF
    },
    props: {
        item: {
            type: Object,
            default: () => ({})
        }
    },
    setup (props, context) {
        const store = useStore()

        const productMap = computed(() => store.state._quote.productMap)
        const quoteMode = computed(() => store.state.quoteMode)
        const longName = computed(() => getLen(state.product?.symbolName) > 10)
        const tickTime = computed(() => {
            const tick_time = state.product.tick_time ?? ''
            return tick_time
                ? window.dayjs(Number(tick_time)).format('HH:mm:ss')
                : ''
        })

        const chartColorType = computed(
            () =>
                getQueryString('chartColorType') ||
                Number(JSON.parse(localGet('CHART_CONFIG'))?.chartColorType) ||
                1
        )

        const state = reactive({
            bgClass: '',
            product: {}
        })
        let price = 0
        watch(
            () => state.product.sell_price,
            (val) => {
                if (price === 0) {
                    if (
                        (state.product.sell_color === 'riseColor' &&
                            chartColorType.value === 1) ||
                        (state.product.sell_color === 'fallColor' &&
                            chartColorType.value === 2)
                    ) {
                        state.bgClass = 'riseColorBgAni'
                    } else if (
                        (state.product.sell_color === 'fallColor' &&
                            chartColorType.value === 1) ||
                        (state.product.sell_color === 'riseColor' &&
                            chartColorType.value === 2)
                    ) {
                        state.bgClass = 'fallColorBgAni'
                    }
                    price = val
                } else {
                    if (val - price > 0) {
                        state.bgClass = 'riseColorBgAni'
                    } else if (val - price < 0) {
                        state.bgClass = 'fallColorBgAni'
                    }
                    price = val
                }
            }
        )

        watch(productMap, (n) => {
            state.product = n[`${props.item.symbolId}_${props.item.tradeType}`]
        }, {
            deep: true
        })

        return {
            ...toRefs(state),
            tickTime,
            quoteMode,
            getLen,
            longName
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@/sass/mixin.scss";
.productItem {
    @include active();
    position: relative;
    // background-color: var(--contentColor);
    padding: rem(5px);
    //margin:0 rem(-5px);
    .cell {
        display: flex;
        align-items: center;
        padding: rem(10px) rem(20px);
        color: var(--minorColor);
        font-size: rem(28px);
        background: var(--bgColor);
        border-radius: rem(5px);
        // line-height: 1.45;
        .th {
            color:var(--color74)
        }

        .ft {
        }
    }
    .price {
        font-size: rem(30px);
    }
    .hd {
        flex: 1;
        color: var(--minorColor);
        font-size: rem(22px);
        line-height: 1.3;
    }
    .name {
        @include ellipsis();
        color: var(--color);
        font-weight: 400;
        font-size: rem(28px);
        // line-height: 1.15;
        padding-bottom: 1px;
        &.small {
            font-size: rem(26px);
        }
        &.mini {
            font-size: rem(22px);
        }
    }
    .symbolCode {
        margin-top: 5px;
        color: var(--minorColor);
    }
    .sell_price,
    .buy_price {
        font-size: rem(28px);
        &.digits11,
        &.digits12,
        &.digits13 {
            font-size: rem(26px);
        }
        &.digits14,
        &.digits15,
        &.digits16 {
            font-size: rem(22px);
        }
    }
    .sell_price {
        // font-weight: bold;
    }
    .col {
        width: rem(280px);
        margin-left: rem(10px);
        font-size: rem(24px);
        text-align: right;
    }
    .upDownAmount {
        padding-right: rem(15px);
    }
}
</style>

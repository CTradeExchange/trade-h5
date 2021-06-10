<template>
    <div class='positionItem van-hairline--bottom' @click='toggleDetail'>
        <div class='mainWrap'>
            <div class='hd'>
                <p class='productName'>
                    {{ data.symbolName }},
                    <span class='volumn'>
                        <span :class="Number(data.direction) === 1 ? 'riseColor' : 'fallColor'">
                            {{ Number(data.direction) === 1 ?'buy':'sell' }}&nbsp;
                        </span>

                        {{ positionVolume }}
                    </span>
                </p>
                <p>
                    <span>{{ data.openPrice }}</span>
                    <span> → </span>
                    <span v-if='product'>
                        {{ Number(data.direction) === 1 ? product.sell_price : product.buy_price }}
                    </span>
                </p>
            </div>
            <div class='col'>
                <p class='price' :class="parseFloat(data.profitLoss) > 0 ? 'riseColor': 'fallColor'">
                    {{ data.profitLoss }}
                    <!-- {{ computePrice(data.profitLoss,data.openAccountDigits) || computePrice(data.profit,data.openAccountDigits) }} -->
                </p>
            </div>
        </div>
        <div v-if='detailVisible' class='detail muted'>
            <ul class='list'>
                <li class='flexWrap'>
                    <span class='title'>
                        S/L
                    </span>
                    <span class='value'>
                        {{ parseFloat(data.stopLossDecimal) ? data.stopLossDecimal : '--' }}
                    </span>
                </li>
                <li class='flexWrap'>
                    <span class='title'>
                        ID
                    </span>
                    <span class='value'>
                        {{ data.positionId }}
                    </span>
                </li>
                <li class='flexWrap'>
                    <span class='title'>
                        T/P
                    </span>
                    <span class='value'>
                        {{ parseFloat(data.takeProfitDecimal) ? data.takeProfitDecimal : '--' }}
                    </span>
                </li>
                <li class='flexWrap'>
                    <span class='title'>
                    </span>
                    <span class='value'>
                        {{ openTime }}
                    </span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { priceFormat, isEmpty } from '@/utils/util'
import dayjs from 'dayjs'
import { minus } from '@/utils/calculation'
export default {
    props: ['data'],
    setup ({ data }) {
        const store = useStore()
        const onceState = {
            executePrice: priceFormat(data.executePrice, data.openSymbolDigits),
            openTime: dayjs(data.openTime).format('YYYY.MM.DD HH:mm:ss'),
        }
        const state = reactive({
            detailVisible: false
        })
        const computePrice = (price, digits) => {
            if (!isEmpty(price)) {
                return priceFormat(price, digits)
            }
        }
        const product = computed(() => store.state._quote.productMap[data.symbolId])

        const positionVolume = computed(() => {
            return minus(data.openVolume, data.closeVolume)
        })
        const toggleDetail = () => {
            state.detailVisible = !state.detailVisible
            store.commit('_quote/Update_productActivedID', data.symbolId)
        }
        return {
            ...toRefs(state),
            ...onceState,
            product,
            toggleDetail,
            positionVolume,
            computePrice
        }
    },
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.positionItem {
    @include active();
    position: relative;
    padding: rem(20px) rem(40px);
    .mainWrap {
        position: relative;
        display: flex;
        align-items: center;
        overflow: hidden;
    }
    .hd {
        flex: 1;
        color: var(--mutedColor);
        font-size: rem(22px);
        line-height: 1.3;
    }
    .productName {
        color: var(--color);
        font-weight: bold;
        font-size: rem(30px);
        .volumn {
            font-weight: normal;
        }
    }
    .col {
        margin-left: rem(46px);
        font-size: rem(24px);
        text-align: right;
        &:first-of-type {
            margin-left: 0;
        }
    }
    .price {
        margin-bottom: rem(6px);
        font-weight: bold;
        font-size: rem(30px);
        .normal {
            vertical-align: text-bottom;
        }
        .big {
            font-size: rem(46px);
        }
        sup {
            font-size: inherit;
        }
    }
}
.detail {
    margin-top: rem(10px);
    font-size: rem(24px);
    .date {
        font-weight: normal;
    }
    .list {
        display: grid;
        grid-column-gap: rem(140px);
        grid-template-columns: repeat(2, 1fr);
        margin-top: rem(10px);
    }
    .flexWrap {
        display: flex;
        justify-content: space-between;
        padding: 3px 0;
    }
}
</style>

<template>
    <div class='positionItem van-hairline--bottom' @click='detailVisible=!detailVisible'>
        <div class='mainWrap'>
            <div class='hd'>
                <p class='productName'>
                    {{ data.symbolName }},
                    <span class='volumn'>
                        <span :class="Number(data.direction) === 1 ? 'riseColor' : 'fallColor'">
                            {{ Number(data.direction) === 1 ? 'buy' : 'sell' }}
                            {{ bizTypeMap[data.bizType] }}
                        </span>
                    </span>
                </p>
                <p>
                    <span>{{ positionVolume }}</span>
                    <span> at </span>
                    <span>{{ pendingPrice }}</span>
                </p>
            </div>
            <div class='col'>
                <p class='price muted'>
                    <span>{{ Number(data.direction) === 1 ? product.buy_price : product.sell_price }}</span>
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
                        {{ data.stopLoss ? computePrice(data.stopLoss, data.digits) : '--' }}
                    </span>
                </li>
                <li class='flexWrap'>
                    <span class='title'>
                        期限
                    </span>
                    <span class='value'>
                        {{ data.expireType===1 ? '当日有效' : '当周有效' }}
                    </span>
                </li>
                <li class='flexWrap'>
                    <span class='title'>
                        T/P
                    </span>
                    <span class='value'>
                        {{ data.takeProfit ? computePrice(data.takeProfit, data.digits) : '--' }}
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
export default {
    props: ['data'],
    setup ({ data }) {
        const store = useStore()
        const onceState = {
            executePrice: priceFormat(data.executePrice, data.openSymbolDigits),
            pendingPrice: priceFormat(data.requestPrice, data.digits),
            openTime: dayjs(data.openTime).format('YYYY.MM.DD HH:mm:ss'),
            bizTypeMap: {
                '10': 'limit',
                '11': 'stop'
            }
        }
        const state = reactive({
            detailVisible: false
        })
        const product = computed(() => store.state._quote.productMap[data.symbolId])

        const positionVolume = computed(() => data.requestNum / data.contractSize)

        const computePrice = (price, digits) => {
            if (!isEmpty(price)) {
                return priceFormat(price, digits)
            }
        }

        return {
            ...toRefs(state),
            ...onceState,
            product,
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
        grid-column-gap: rem(30px);
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

<template>
    <div class='positionItem van-hairline--bottom' @click='detailVisible=!detailVisible'>
        <div class='mainWrap'>
            <div class='hd'>
                <p class='productName'>
                    {{ data.symbolName }},
                    <span class='volumn'>
                        {{ Number(data.direction) === 1 ? 'buy' : 'sell' }}
                        {{ positionVolume }}
                    </span>
                </p>
                <p>
                    <span>{{ openPrice }}</span>
                    <span> → </span>
                    <span>{{ Number(data.direction) === 1 ? product.buy_price : product.sell_price }}</span>
                </p>
            </div>
            <div class='col'>
                <p class='price riseColor'>
                    -88.66
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
                        {{ data.stopLoss||'--' }}
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
                        {{ data.takeProfit||'--' }}
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
import { priceFormat } from '@/utils/util'
import dayjs from 'dayjs'
import { minus } from '@/utils/calculation'
export default {
    props: ['data'],
    setup ({ data }) {
        const store = useStore()
        const onceState = {
            executePrice: priceFormat(data.executePrice, data.openSymbolDigits),
            openPrice: priceFormat(data.requestPrice, data.digits),
            openTime: dayjs(data.openTime).format('YYYY.MM.DD HH:mm:ss'),
        }
        const state = reactive({
            detailVisible: false
        })
        const product = computed(() => store.state._quote.productMap[data.symbolId])
        console.log('***', product)

        const positionVolume = computed(() => data.requestNum / data.contractSize)
        return {
            ...toRefs(state),
            ...onceState,
            product,
            positionVolume,
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

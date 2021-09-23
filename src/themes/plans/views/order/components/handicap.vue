<template>
    <div class='orderHandicap'>
        <div class='titleBar'>
            <span class='hd'>
                {{ $t('trade.priceLabel') }}
            </span>
            <span class='ft'>
                {{ $t('trade.volumes') }}
            </span>
        </div>

        <div class='priceMultiGear buy'>
            <p v-for='(item, index) in ask_deep' :key='index' class='item'>
                <span class='hd'>
                    {{ item.price_ask }}
                </span>
                <span class='ft'>
                    {{ item.volume_ask }}
                </span>
                <span v-if='item.width' class='volunmePercent buy' :style="{ width:item.width+'%' }"></span>
            </p>
        </div>
        <div class='curPrice' :class='[product.cur_color]'>
            {{ lastPrice }}
        </div>
        <div class='priceMultiGear sell'>
            <p v-for='(item, index) in handicapResult.bid_deep.slice(0,5)' :key='index' class='item'>
                <span class='hd'>
                    {{ item.price_bid }}
                </span>
                <span class='ft'>
                    {{ item.volume_bid }}
                </span>
                <span v-if='item.width' class='volunmePercent' :style="{ width:item.width+'%' }"></span>
            </p>
        </div>
        <van-popover v-model:show='showPopover' :actions='digitLevelList' class='handicapDigitsOptions' @select='onSelect'>
            <template #reference>
                <button class='selectBtn'>
                    {{ handicapDigit }}
                    <i class='icon_arrow'></i>
                </button>
            </template>
        </van-popover>
    </div>
</template>

<script>
import { computed, reactive, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
import computeHandicap from '@plans/hooks/handicap'
import { lt, pow } from '@/utils/calculation'
import { QuoteSocket } from '@/plugins/socket/socket'
export default {
    props: ['product'],
    setup (props) {
        const store = useStore()
        const state = reactive({
            showPopover: false,
            handicapDigit: pow(0.1, props.product?.symbolDigits),
            lastPriceColor: '', // 最新成交价的颜色
        })
        // 获取盘口深度报价
        const handicapList = computed(() => store.state._quote.handicapList.find(({ symbol_id }) => parseInt(symbol_id) === props.product.symbolId))

        // 获取处理后的盘口数据
        const { handicapResult } = computeHandicap({
            showPending: false
        })

        const ask_deep = computed(() => {
            const list = handicapResult.value?.ask_deep?.slice(0)?.reverse()
            return list?.slice(0, 5) || []
        })
        // 最新成交价
        const lastPrice = computed(() => store.state._quote.dealList[0]?.price)
        // 计算报价小数位档数
        const digitLevelList = computed(() => {
            const digits = []
            var symbolDigits = props.product?.price_digits
            while (symbolDigits > -3) {
                digits.push({ text: pow(0.1, symbolDigits) })
                symbolDigits--
            }

            return digits.splice(0, 5)
        })

        // 最新成交价的颜色
        watch(
            () => lastPrice.value,
            (newval, oldval) => (state.lastPriceColor = lt(newval, oldval) ? 'fallColor' : 'riseColor')
        )

        // 切换深度报价小数位的长度
        const onSelect = (val) => {
            state.handicapDigit = val.text
            QuoteSocket.deal_subscribe(props.product.symbolId, 5, val.text, props.product.tradeType, 1)
        }

        return {
            ...toRefs(state),
            onSelect,
            handicapList,
            lastPrice,
            ask_deep,
            digitLevelList,
            handicapResult,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.orderHandicap {
    .titleBar {
        display: flex;
        justify-content: space-between;
        margin-top: rem(20px);
        color: var(--placeholdColor);
    }
    .priceMultiGear {
        height: rem(200px);
        margin-top: rem(20px);
        font-size: rem(24px);
        line-height: rem(40px);
        &.sell {
            color: var(--riseColor);
        }
        &.buy {
            color: var(--fallColor);
        }
        .item {
            position: relative;
            display: flex;
            justify-content: space-between;
            .volunmePercent {
                position: absolute;
                top: 0;
                right: 0;
                max-width: 99%;
                height: 100%;
                background: var(--riseColor);
                opacity: 0.05;
                transition: all 0.3s linear;
                content: '';
                &.buy {
                    background: var(--fallColor);
                }
            }
            .ft {
                color: var(--normalColor);
            }
        }
    }
    .curPrice {
        height: rem(34px);
        margin-top: rem(20px);
        font-size: rem(30px);
        line-height: rem(34px);
    }
    .selectBtn {
        position: relative;
        height: rem(40px);
        margin-top: rem(10px);
        padding: 0 rem(60px) 0 rem(15px);
        color: var(--minorColor);
        font-size: rem(22px);
        line-height: 1;
        background: var(--assistColor);
        border-radius: rem(4px);
    }
    .icon_arrow {
        position: absolute;
        top: 8px;
        right: 8px;
        display: inline-block;
        width: 0;
        height: 0;
        border: 5px solid var(--minorColor);
        border-color: var(--minorColor) transparent transparent transparent;
        border-width: 5px 5px 0;
        border-radius: 3px;
    }
}
</style>

<style lang="scss">
.handicapDigitsOptions {
    --van-popover-light-background-color: var(--assistColor);
}
</style>

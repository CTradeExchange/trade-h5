<template>
    <div class='title'>
        <p>{{ $t('trade.handicap') }}</p>
        <van-popover
            v-model:show='showPopover'
            :actions='digitLevelList'
            class='handicapDigitsOptions'
            @select='onSelect'
        >
            <template #reference>
                <button class='selectBtn'>
                    {{ curDigit }}
                    <i class='icon_arrow'></i>
                </button>
            </template>
        </van-popover>
    </div>
    <div class='titleBar'>
        <span class='hd'>
            {{ $t('trade.priceLabel') }}({{ product.profitCurrency }})
        </span>
        <span class='ft alignRight'>
            {{ $t('trade.volumes') }}({{ product.baseCurrency }})
        </span>
        <span class='my alignRight'>
            {{ $t('trade.my') }}
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
            <span class='my'>
                {{ item.unitNum === 0 ? '': item.unitNum }}
            </span>
            <span v-if='item.width' class='volunmePercent buy' :style="{ width:item.width+'%' }"></span>
        </p>
    </div>

    <div class='curPrice' :class='[product.cur_color]'>
        {{ lastPrice || '--' }}
    </div>
    <div class='priceMultiGear sell'>
        <p v-for='(item, index) in bid_deep' :key='index' class='item'>
            <span class='hd'>
                {{ item.price_bid }}
            </span>
            <span class='ft'>
                {{ item.volume_bid }}
            </span>
            <span class='my'>
                {{ item.unitNum === 0 ? '': item.unitNum }}
            </span>
            <span v-if='item.width' class='volunmePercent' :style="{ width:item.width+'%' }"></span>
        </p>
    </div>

    <van-empty :description='$t("common.noData")' image='/images/empty.png' />
</template>

<script>
import { computed, reactive, toRefs, watch, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import computeHandicap from '@planspc/hooks/handicap'
import { lt, pow } from '@/utils/calculation'
import { QuoteSocket } from '@/plugins/socket/socket'
import { isEmpty } from '@/utils/util'
export default {
    name: 'Handicap',
    setup (props) {
        const store = useStore()
        const route = useRoute()
        const state = reactive({
            showPopover: false,
            lastPriceColor: '', // 最新成交价的颜色
            curDigit: ''
        })

        const product = computed(() => store.getters.productActived)

        const handicapDigit = computed({
            get () {
                return pow(0.1, product.value?.symbolDigits)
            },
            set (val) {
                state.curDigit = val
            }
        })

        // 获取盘口深度报价
        const handicapList = computed(() => store.state._quote.handicapList.find(({ symbol_id }) => parseInt(symbol_id) === product.value.symbolId))

        // 获取处理后的盘口数据
        const { handicapResult } = computeHandicap({
            showPending: false
        })

        const ask_deep = computed(() => {
            const askResult = handicapResult.value?.ask_deep?.slice(0, 5) || []
            if (askResult.length < 5) {
                return fillPosition(askResult, 1)
            } else {
                return askResult
            }
        })

        const bid_deep = computed(() => {
            const bidREsult = handicapResult.value.bid_deep.slice(0, 5)
            if (bidREsult.length < 5) {
                return fillPosition(bidREsult, 2)
            } else {
                return bidREsult
            }
        })

        // 最新成交价的颜色
        watch(
            () => lastPrice && lastPrice.value,
            (newval, oldval) => (state.lastPriceColor = lt(newval, oldval) ? 'fallColor' : 'riseColor')
        )

        watch(() => state.curDigit, val => {
            if (!isEmpty(val)) {
                QuoteSocket.deal_subscribe(product.value?.symbolId, 5, state.curDigit, product.value?.tradeType, 20)
            }
        })

        watchEffect(() => {
            state.curDigit = handicapDigit.value
        })

        // 报价不够5档，补空位
        const fillPosition = (data, type) => {
            const keyLabel = {
                priceLabel: {
                    1: 'price_ask',
                    2: 'price_bid'
                },
                volume: {
                    1: 'volume_ask',
                    2: 'volume_bid'
                }
            }
            const result = data
            if (Array.isArray(result)) {
                let fillLength = 5 - data.length
                while (fillLength > 0) {
                    result.push({
                        [keyLabel.priceLabel[type]]: '--',
                        [keyLabel.volume[type]]: '--',
                        with: 0,
                        unitNum: 0
                    })
                    fillLength--
                }
            }

            return result
        }

        // 最新成交价
        const lastPrice = computed(() => store.state._quote.dealList[0]?.price)
        // 计算报价小数位档数
        const digitLevelList = computed(() => {
            const digits = []
            var symbolDigits = product.value?.price_digits
            while (symbolDigits > -3) {
                digits.push({ text: pow(0.1, symbolDigits) })
                symbolDigits--
            }

            return digits.splice(0, 5)
        })

        // 切换深度报价小数位的长度
        const onSelect = (val) => {
            handicapDigit.value = val.text
            QuoteSocket.deal_subscribe(product.value?.symbolId, 5, val.text, product.value?.tradeType, 20)
        }

        return {
            ...toRefs(state),
            onSelect,
            handicapList,
            lastPrice,
            ask_deep,
            bid_deep,
            digitLevelList,
            handicapResult,
            product,
            handicapDigit
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.title{
    padding-right: 10px;
    display: flex;
    justify-content: space-between;
}
.titleBar {
    display: flex;
    padding-right: 10px;
    justify-content: space-between;
    margin-top: 12px;
    margin-bottom: 5px;
    color: var(--placeholdColor);
    font-size: rem(20px);
    >span{
        flex: 1;
        &.my{
            flex: 0.8;
        }
    }
}
.priceMultiGear {
    margin-top: 15px;
    font-size: 14px;
    line-height: 20px;
    height: 114px;
    &.sell {
        color: var(--riseColor);
        margin-top: 0;
    }
    &.buy {
        display: flex;
        flex-flow: column-reverse;
        color: var(--fallColor);
    }
    .item {
        line-height: 26px;
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
            flex: 1;
            text-align: right;
        }
        .hd{
            flex: 1;
        }
        .my{
            flex: 0.8;
            text-align: right;
            padding-right: 10px;
        }

    }
}
.curPrice {
    line-height: 42px;
    font-size: 18px;
}
.selectBtn {
    border-radius: 4px;
    cursor: pointer;
    position: relative;
    height: 24px;
    padding: 0 24px 0 10px;
    color: var(--minorColor);
    line-height: 24px;
    background: var(--assistColor);
}
.icon_arrow {
    position: absolute;
    top: 10px;
    right: 8px;
    display: inline-block;
    width: 0;
    height: 0;
    border: 5px solid var(--minorColor);
    border-color: var(--minorColor) transparent transparent transparent;
    border-width: 5px 5px 0;
    border-radius: 3px;
}

</style>

<style lang="scss">
.handicapDigitsOptions {
    --van-popover-light-background-color: var(--assistColor);
    //width: 72px;
}
</style>

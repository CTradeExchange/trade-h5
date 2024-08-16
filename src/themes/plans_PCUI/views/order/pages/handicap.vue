<template>
    <div class='handicap'>
        <div class='title'>
            <p>{{ $t('trade.handicap') }}</p>
            <van-popover v-model:show='showPopover' :actions='digitLevelList' class='handicapDigitsOptions' @select='onSelect'>
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

            <template v-if='tradeType == 2'>
                <span v-if='isQuantity' class='ft alignRight'>
                    {{ $t('trade.volumes') }}({{ $t('trade.volumeUnit') }})
                </span>
                <span v-else class='ft alignRight'>
                    {{ $t('trade.amount') }}{{ assetsInfo?.currency ? `(${assetsInfo.currency})` : `(USDT)` }}
                </span>
            </template>
            <span v-else class='ft alignRight'>
                {{ $t('trade.volumes') }}({{ $t('trade.volumeUnit') }})
            </span>
        </div>

        <el-scrollbar class='quickTransaction-scroll'>
            <div class='handicap-content'>
                <div class='priceMultiGear buy'>
                    <p
                        v-for='(item, index) in ask_deep'
                        :key='index'
                        class='item cursor-pointer'
                        @click='chooseHandicapPrice(item.price_ask)'
                    >
                        <span class='hd'>
                            {{ item.price_ask }}
                        </span>
                        <span class='ft alignRight'>
                            {{ tradeExchangeRate ? formatVolume(item.volume_ask, item.price_ask) : item.volume_ask }}
                        </span>
                        <span v-if='item.width' class='volunmePercent buy' :style="{ width: item.width + '%' }"></span>
                    </p>
                </div>

                <div class='curPrice' :class='[product.cur_color]' :data-lastPrice='product?.cur_price'>
                    {{ product?.cur_price || '--' }}
                </div>

                <div class='priceMultiGear sell'>
                    <p
                        v-for='(item, index) in bid_deep'
                        :key='index'
                        class='item cursor-pointer'
                        @click='chooseHandicapPrice(item.price_bid)'
                    >
                        <span class='hd'>
                            {{ item.price_bid }}
                        </span>
                        <span class='ft alignRight'>
                            {{ tradeExchangeRate ? formatVolume(item.volume_bid, item.price_bid) : item.volume_bid }}
                        </span>
                        <span v-if='item.width' class='volunmePercent' :style="{ width: item.width + '%' }"></span>
                    </p>
                </div>
            </div>
        </el-scrollbar>
    </div>

    <!-- <van-empty :description='$t("common.noData")' image='/images/empty.png' /> -->
</template>

<script>
import { computed, reactive, toRefs, watch, onMounted, watchEffect } from 'vue'
import { useStore } from 'vuex'
import computeHandicap from '@planspc/hooks/handicap'
import { pow, formatAmount, plus } from '@/utils/calculation'
import { QuoteSocket } from '@/plugins/socket/socket'
import mitt from '@/utils/mitt'
import useFormatVolume from '@/hooks/trade/useFormatVolume'
import { useAssets } from '@/hooks/assets'

export default {
    name: 'Handicap',
    setup (props) {
        const store = useStore()
        const state = reactive({
            showPopover: false,
            curDigit: '',
        })
        const tradeExchangeRate = computed(() => store.state._trade.tradeExchangeRate)

        const product = computed(() => store.getters.productActived)
        const tradeType = product.value.tradeType

        const { formatVolume, isQuantity } = useFormatVolume()

        // 钱包资产信息
        const assetsInfo = useAssets()

        const handicapDigit = computed({
            get () {
                return pow(0.1, product.value?.symbolDigits)
            },
            set (val) {
                state.curDigit = val
            },
        })

        // 获取盘口深度报价
        const handicapList = computed(() =>
            store.state._quote.handicapList.find(({ symbol_id }) => parseInt(symbol_id) === product.value.symbolId),
        )
        // 最新成交价
        const lastPrice = computed(() => store.state._quote.dealList[0]?.price)

        // 获取处理后的盘口数据
        const { handicapResult } = computeHandicap({
            showPending: true,
        })

        // 报价不够5档，补空位
        const fillPosition = (data, type) => {
            const keyLabel = {
                priceLabel: {
                    1: 'price_ask',
                    2: 'price_bid',
                },
                volume: {
                    1: 'volume_ask',
                    2: 'volume_bid',
                },
            }
            const result = data
            if (Array.isArray(result)) {
                let fillLength = 5 - data.length
                while (fillLength > 0) {
                    result.push({
                        [keyLabel.priceLabel[type]]: '--',
                        [keyLabel.volume[type]]: '--',
                        with: 0,
                        unitNum: 0,
                    })
                    fillLength--
                }
            }

            return result
        }

        const ask_deep = computed(() => {
            const askResult = handicapResult.value?.ask_deep?.slice(0, 5).map(item => {
                // 全仓深度玩法加点差
                if (product.value?.enableDepthTrade === 2 && product.value.askSpread) {
                    item.price_ask = plus(item.price_ask, product.value.askSpread)
                }
                return item
            })
            if (askResult.length < 5) {
                return fillPosition(askResult, 1)
            } else {
                return askResult
            }
        })

        const bid_deep = computed(() => {
            const bidREsult = handicapResult.value.bid_deep.slice(0, 5).map(item => {
                // 全仓深度玩法加点差
                if (product.value?.enableDepthTrade === 2 && product.value.bidSpread) {
                    item.price_bid = plus(item.price_bid, product.value.bidSpread)
                }
                return item
            })
            if (bidREsult.length < 5) {
                return fillPosition(bidREsult, 2)
            } else {
                return bidREsult
            }
        })

        // 监听路由变化
        watch(
            () => [product.value, state.curDigit],
            (val, oval) => {
                state.curDigit = val[1]
                // 清除盘口数据
                store.commit('_quote/Delete_dealList')
            },
            {
                immediate: true,
            },
        )

        watchEffect(() => {
            // 根据产品深度订阅
            if (product.value.priceBreadth !== undefined) {
                QuoteSocket.deal_subscribe(
                    product.value?.symbolId,
                    product.value?.priceBreadth || 0,
                    state.curDigit,
                    product.value?.tradeType,
                    5,
                )
            }
        })

        watch(
            () => handicapDigit.value,
            (val) => {
                if (val) {
                    state.curDigit = val
                }
            },
            {
                immediate: true,
            },
        )

        // 计算报价小数位档数
        const digitLevelList = computed(() => {
            const digits = []
            // 部分产品price_digits可能不存在
            let symbolDigits = product.value?.price_digits || product.value?.symbolDigits || 0
            // 优先取昨收，如果没有则读开盘,开盘的价格也不存在，导致首页没有深度层级数据
            const price = product.value?.yesterday_close_price || product.value?.open_price
            while (symbolDigits > -3) {
                const v = pow(0.1, symbolDigits)
                // 当前档位不能大于报价缩进一位的值
                if (v <= price / 10) {
                    digits.push({ text: v })
                } else {
                    break
                }
                symbolDigits--
            }
            return digits.splice(0, 5)
        })

        // 切换深度报价小数位的长度
        const onSelect = (val) => {
            handicapDigit.value = val.text
            QuoteSocket.deal_subscribe(product.value?.symbolId, product.value?.priceBreadth || 0, val.text, product.value?.tradeType, 5)
        }

        // 切换到限价单的时候，点击价格才会填充到买入价或卖出价
        const chooseHandicapPrice = (price) => {
            if (price) {
                mitt.emit('chooseHandicapPrice', price)
            }
        }

        onMounted(() => {
            if (tradeType) {
                setTimeout(() => {
                    store.dispatch('_trade/queryPBOOrderPage', { tradeType })
                }, 1000)
            }
        })

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
            handicapDigit,
            isQuantity,
            assetsInfo,
            chooseHandicapPrice,
            formatAmount,
            formatVolume,
            tradeType,
            tradeExchangeRate,
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.handicap {
    display: flex;
    flex-direction: column;
    height: 100%;
    .handicap-content {
        flex: 1;
        overflow-y: auto;
    }
}
.title {
    font-weight: bold;
    padding-right: 10px;
    display: flex;
    justify-content: space-between;
    padding: 12px 12px 0 12px;
}
.titleBar {
    display: flex;
    padding-right: 10px;
    justify-content: space-between;
    margin-top: 12px;
    margin-bottom: 5px;
    color: var(--minorColor);
    font-size: 12px;
    padding: 0 12px;
    > span {
        flex: 1;
    }
}
.priceMultiGear {
    font-size: 12px;
    line-height: 20px;
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
            padding-right: 12px;
        }
        .hd {
            flex: 1;
            padding-left: 12px;
        }
        .my {
            flex: 1;
            text-align: right;
        }
    }
}
.curPrice {
    line-height: 42px;
    height: 42px;
    font-size: 18px;
    padding: 0 12px;
}
.selectBtn {
    border-radius: 4px;
    cursor: pointer;
    position: relative;
    height: 24px;
    padding: 0 24px 0 10px;
    font-size: 12px;
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
    --van-popover-action-font-size: 12px;
    //width: 72px;
}
</style>

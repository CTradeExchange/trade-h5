<template>
    <div class='active-depth'>
        <div class='depth-type'>
            <div class='depth-type-item'>
                <div class='depth-select'>
                    <van-popover v-model:show='showPopover' :actions='digitLevelList' class='depth-select-drownpper' @select='onSelect'>
                        <template #reference>
                            <button class='depth-select-btn'>
                                {{ curDigit }}
                                <i class='depth-select-icon'></i>
                            </button>
                        </template>
                    </van-popover>
                </div>
            </div>
        </div>

        <div class='depth-list'>
            <div class='depth-list-title'>
                <span v-if='isQuantity' class='ft alignRight'>
                    {{ $t('trade.volumes') }}({{ $t('trade.volumeUnit') }})
                </span>
                <span v-else class='ft alignRight'>
                    {{ $t('trade.amount') }}{{ assetsInfo?.currency ? `(${assetsInfo.currency})` : `(USDT)` }}
                </span>
                <span>
                    {{ $t('headLineHome.price') + `(${product?.profitCurrency ? product.profitCurrency : ''})` }}
                </span>
                <span v-if='isQuantity' class='ft alignRight'>
                    {{ $t('trade.volumes') }}({{ $t('trade.volumeUnit') }})
                </span>
                <span v-else class='ft alignRight'>
                    {{ $t('trade.amount') }}{{ assetsInfo?.currency ? `(${assetsInfo.currency})` : `(USDT)` }}
                </span>
            </div>
            <div class='depth-list-content'>
                <div v-for='(item) in formatDepth' :key='`${item.timestamp}`' class='depth-list-box'>
                    <div class='depth-list-box-left'>
                        <span class='box-up-num'>
                            <!-- {{ item.volume_bid }} -->
                            {{ item.volume_bid && item.price_bid ? formatVolume(item.volume_bid, item.price_bid) : '--' }}
                        </span>
                        <div class='box-up-price'>
                            <span>
                                {{ item.price_bid }}
                            </span>
                        </div>
                        <span v-if='item?.width_bid' class='volunmePercent' :style="{ width: item.width_bid + '%' }"></span>
                    </div>
                    <div class='depth-list-box-right'>
                        <div class='box-up-price'>
                            <span>
                                {{ item?.price_ask }}
                            </span>
                        </div>
                        <span class='box-up-num'>
                            {{
                                item?.volume_ask && item?.price_ask
                                    ? formatVolume(item.volume_ask, item.price_ask)
                                    : '--'
                            }}
                        </span>
                        <span
                            v-if='item?.width_ask'
                            :class="['volunmePercent', 'buy']"
                            :style="{ width: item?.width_ask + '%' }"
                        ></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { computed, reactive, toRefs, watch, onMounted, watchEffect, nextTick } from 'vue'
import { useStore } from 'vuex'
import computeHandicap from '@planspc/hooks/handicap'
import { pow, formatAmount } from '@/utils/calculation'
import { QuoteSocket } from '@/plugins/socket/socket'
import useFormatVolume from '@/hooks/trade/useFormatVolume'
import { useAssets } from '@/hooks/assets'
import { guid } from '@/utils/util'
export default {
    name: 'Handicap',
    setup (props) {
        const store = useStore()
        const state = reactive({
            showPopover: false,
            curDigit: '',
        })

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
                        timestamp: guid()
                    })
                    fillLength--
                }
            }

            return result
        }

        // 组成深度正确的渲染数据
        const formatDepth = computed(() => {
            const askResult = handicapResult.value?.ask_deep?.slice(0, 5)
            const bidREsult = handicapResult.value?.bid_deep?.slice(0, 5)
            const formatAsk = askResult.length < 5 ? fillPosition(askResult, 1) : askResult
            const formatBid = bidREsult.length < 5 ? fillPosition(bidREsult, 1) : bidREsult
            const format = []
            formatAsk.forEach((item, index) => {
                format.push({
                    timestamp: guid(),
                    price_ask: item.price_ask,
                    price_bid: formatBid[index].price_bid,
                    volume_ask: item.volume_ask,
                    volume_bid: formatBid[index].volume_bid,
                    width_ask: item.width,
                    width_bid: formatBid[index].width,
                    unitNum_ask: item.unitNum,
                    unitNum_bid: formatBid[index].unitNum
                })
            })
            return format
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
                // console.log('我准备发起订阅了', state.curDigit)
                nextTick(() => {
                    QuoteSocket.deal_subscribe(
                        product.value?.symbolId,
                        product.value?.priceBreadth || 0,
                        state.curDigit,
                        product.value?.tradeType,
                        5,
                    )
                })
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

        onMounted(() => {
            if (tradeType) {
                store.dispatch('_trade/queryPBOOrderPage', { tradeType })
            }
        })

        return {
            ...toRefs(state),
            onSelect,
            digitLevelList,
            handicapResult,
            product,
            handicapDigit,
            assetsInfo,
            formatAmount,
            formatVolume,
            tradeType,
            formatDepth,
            isQuantity
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.active-depth {
    height: 100%;
    display: flex;
    padding: 0 10px;
    flex-direction: column;
    .depth-type {
        display: flex;
        height: 24px;
        margin: 20px 0;
        .depth-type-item {
            flex: 1;
            height: 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            & > span {
                color: var(--minorColor);
                font-size: 12px;
                font-weight: 400;
            }
            .depth-select {
                height: 24px;
                min-width: 74px;
                .depth-select-btn {
                    border-radius: 4px;
                    min-width: 74px;
                    cursor: pointer;
                    position: relative;
                    height: 24px;
                    padding: 0 24px 0 10px;
                    font-size: 12px;
                    color: var(--minorColor);
                    line-height: 24px;
                    background: var(--assistColor);
                }
                .depth-select-icon {
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
            }
        }
    }

    .depth-list {
        height: calc(100% - 24px);
        display: flex;
        flex-direction: column;
        .depth-list-title {
            height: 14px;
            display: flex;
            justify-content: space-between;
            & > span {
                color: var(--minorColor);
                font-size: 12px;
                font-weight: 400;
            }
        }
        .depth-list-content {
            height: calc(100% - 30px);
            overflow: hidden;
            // @include scroll();
            padding-right: 6px;
            display: flex;
            flex-direction: column;
            margin-top: 6px;
            .depth-list-box {
                margin: 6px 0;
                height: 23px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                .depth-list-box-left {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    width: 49%;
                    position: relative;
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

                    .box-up-num {
                        color: #666666;
                        font-size: 12px;
                        font-weight: 400;
                    }
                    .box-up-price {
                        color: var(--riseColor);
                        font-size: 12px;
                        font-weight: 400;
                        border-radius: 2px;
                        // background: #f5faf8;
                        padding: 5px;
                    }
                }
                .depth-list-box-right {
                    display: flex;
                    width: 49%;
                    justify-content: space-between;
                    align-items: center;
                    position: relative;
                    .volunmePercent {
                        position: absolute;
                        top: 0;
                        left: 0;
                        height: 100%;
                        background: var(--riseColor);
                        opacity: 0.05;
                        transition: all 0.3s linear;
                        content: '';
                        &.buy {
                            background: var(--fallColor);
                        }
                    }
                    .box-up-num {
                        color: #666666;
                        font-size: 12px;
                        font-weight: 400;
                    }
                    .box-up-price {
                        color: var(--fallColor);
                        font-size: 12px;
                        font-weight: 400;
                        border-radius: 2px;
                        // background: #f5faf8;
                        padding: 5px;
                    }
                }
            }
        }
    }
}
</style>

<style lang="scss">
.handicapDigitsOptions {
    --van-popover-light-background-color: var(--assistColor);
    --van-popover-action-font-size: 12px;
    //width: 72px;
}
</style>

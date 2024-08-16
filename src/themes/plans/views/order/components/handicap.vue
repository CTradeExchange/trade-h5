<template>
    <div class='orderHandicap'>
        <van-popover v-model:show='showPopover' :actions='digitLevelList' class='handicapDigitsOptions' @select='onSelect'>
            <template #reference>
                <button class='selectBtn'>
                    {{ handicapDigit }}
                    <i class='icon_arrow'></i>
                </button>
            </template>
        </van-popover>
        <div class='titleBar'>
            <span class='hd'>
                {{ $t('trade.priceLabel') }}
            </span>
            <span class='ft'>
                <template v-if='Number(product.tradeType) === 2'>
                    <span v-if='isQuantity' class='ft alignRight'>
                        {{ $t('trade.volumes') }}({{ $t('trade.volumeUnit') }})
                    </span>
                    <span v-else class='ft alignRight'>
                        {{ $t('trade.amount') }}{{ assetsInfo?.currency ? `(${assetsInfo.currency})` : `(USDT)` }}
                    </span>
                </template>
                <span v-else>
                    {{ $t('trade.volumes') }}
                </span>
            </span>
        </div>

        <div class='price-safe-box'>
            <div class='priceMultiGear buy'>
                <div v-for='(item, index) in ask_deep' :key='index' class='item cursor-pointer' @click='chooseHandicapPrice(item.price_ask)'>
                    <span class='hd pr-1'>
                        {{ item.price_ask }}
                    </span>
                    <span class='ft'>
                        {{ tradeExchangeRate ? formatVolume(item.volume_ask, item.price_ask, 2) : item.volume_ask }}
                    </span>
                    <span v-if='item.width' class='volunmePercent buy' :style="{ width: item.width + '%' }"></span>
                </div>
            </div>
            <div class='curPrice' :class='[product.cur_color]' :data-lastPrice='product?.cur_price '>
                {{ product?.cur_price || '--' }}
            </div>
            <div class='priceMultiGear sell'>
                <div v-for='(item, index) in bid_deep' :key='index' class='item cursor-pointer' @click='chooseHandicapPrice(item.price_bid)'>
                    <span class='hd pr-1'>
                        {{ item.price_bid }}
                    </span>
                    <span class='ft'>
                        {{ tradeExchangeRate ? formatVolume(item.volume_bid, item.price_bid, 2) : item.volume_bid }}
                    </span>
                    <span v-if='item.width' class='volunmePercent' :style="{ width: item.width + '%' }"></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { computed, reactive, toRefs, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import computeHandicap from '@plans/hooks/handicap'
import { pow, formatAmount, plus, } from '@/utils/calculation'
import { QuoteSocket } from '@/plugins/socket/socket'
import mitt from '@/utils/mitt'
import useFormatVolume from '@/hooks/trade/useFormatVolume'
import { useAssets } from '@/hooks/assets'

export default {
    props: ['product'],
    setup (props) {
        const store = useStore()
        const { formatVolume, isQuantity } = useFormatVolume()
        const tradeType = computed(() => props.product.tradeType)
        const product = computed(() => store.getters.productActived)

        const state = reactive({
            showPopover: false,
            handicapDigit: pow(0.1, props.product?.symbolDigits),
        })
        // 获取盘口深度报价
        const handicapList = computed(() =>
            store.state._quote.handicapList.find(({ symbol_id }) => parseInt(symbol_id) === props.product.symbolId),
        )
        // 最新成交价
        const lastPrice = computed(() => store.state._quote.dealList[0]?.price)
        const tradeExchangeRate = computed(() => store.state._trade.tradeExchangeRate)

        // 获取处理后的盘口数据
        const { handicapResult } = computeHandicap({
            showPending: true,
        })
        const assetsInfo = useAssets()

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

        // 计算报价小数位档数
        const digitLevelList = computed(() => {
            const digits = []
            // 部分产品price_digits可能不存在
            let symbolDigits = props.product?.price_digits || props.product?.symbolDigits || 0
            // 优先取昨收，如果没有则读开盘
            const price = props.product?.yesterday_close_price || props.product?.open_price
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

        // 产品变化之后重置深度报价小数位的长度
        watch(
            () => props.product.symbolId,
            (newval) => {
                state.handicapDigit = pow(0.1, props.product.symbolDigits)
                // 清除盘口数据
                store.commit('_quote/Delete_dealList')
            },
        )

        // 切换深度报价小数位的长度
        const onSelect = (val) => {
            state.handicapDigit = val.text
            QuoteSocket.deal_subscribe(props.product.symbolId, props.product.priceBreadth || 0, val.text, props.product.tradeType, 5)
        }

        onMounted(() => {
            if (tradeType.value) {
                store.dispatch('_trade/queryPBOOrderPage', { tradeType: tradeType.value })
            }
        })

        // 切换到限价单的时候，点击价格才会填充到买入价或卖出价
        const chooseHandicapPrice = (price) => {
            if (price && price !== '--') {
                mitt.emit('chooseHandicapPrice', price)
            }
        }

        return {
          ...toRefs(state),
          onSelect,
          handicapList,
          formatAmount,
          lastPrice,
          ask_deep,
          bid_deep,
          digitLevelList,
          handicapResult,
          chooseHandicapPrice,
          formatVolume,
          isQuantity,
          assetsInfo,
          tradeExchangeRate,
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.orderHandicap {
  transform: translateZ(0);
  display: flex;
  flex-direction: column;
  .titleBar {
      display: flex;
      justify-content: space-between;
      margin: 8px 0;
      color: var(--placeholdColor);
      font-size: rem(20px);
  }
  .price-safe-box{
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .priceMultiGear {
      flex: 1;
      font-size: 12px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      &.sell {
          color: var(--riseColor);
      }
      &.buy {
          display: flex;
          flex-flow: column-reverse;
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
      text-align: center;
      height: 34px;
      margin: 16px 0;
      font-size: 20px;
      line-height: 34px;
  }
  .selectBtn {
      position: relative;
      height: rem(40px);
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

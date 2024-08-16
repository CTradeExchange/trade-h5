<template>
    <div v-if='product' class='handicap-header'>
        <div class='select-box'>
            <div class='depth'>
                <span class='depth-select'>
                    <van-popover v-model:show='showPopover' :actions='digitLevelList' placement='top' :theme='theme' @select='onSelect'>
                        <template #reference>
                            <span>{{ curDigits }}</span>
                            <span class='triangleDiv'></span>
                        </template>
                    </van-popover>
                </span>
            </div>
        </div>
        <div class='title-box'>
            <div class='alignLeft'>
                <template v-if='Number(product.tradeType) === 2'>
                    <span v-if='isQuantity' class='ft alignRight'>
                        {{ $t('trade.volumes') }}({{ $t('trade.volumeUnit') }})
                    </span>
                    <span v-else class='ft alignRight'>
                        {{ $t('trade.amount') }}{{ assetsInfo?.currency ? `(${assetsInfo.currency})` : `(USDT)` }}
                    </span>
                </template>
                <span v-else>
                    {{ $t('trade.volumes') }}({{ $t('trade.volumeUnit') }})
                </span>
            </div>
            <div class='text-right'>
                {{ $t('trade.priceLabel') }}{{ product?.profitCurrency ? `(${ product.profitCurrency})` : '' }}
            </div>

            <div class='alignRight'>
                <template v-if='Number(product.tradeType) === 2'>
                    <span v-if='isQuantity' class='ft alignRight'>
                        {{ $t('trade.volumes') }}({{ $t('trade.volumeUnit') }})
                    </span>
                    <span v-else class='ft alignRight'>
                        {{ $t('trade.amount') }}{{ assetsInfo?.currency ? `(${assetsInfo.currency})` : `(USDT)` }}
                    </span>
                </template>
                <span v-else>
                    {{ $t('trade.volumes') }}({{ $t('trade.volumeUnit') }})
                </span>
            </div>
        </div>
    </div>
    <van-empty v-if='!ask_deep' :description="$t('common.noData')" image='/images/empty.png' />
    <div class='stalls-wrap'>
        <div class='sell-wrap'>
            <div v-for='(item, index) in ask_deep' :key='index' class='item'>
                <span class='quantity alignLeft'>
                    {{ formatVolume(item.volume_ask, item.price_ask) }}
                </span>
                <span class='histogram sell-histogram' :style="'width:' + item?.width + '%'"></span>

                <span class='price price-right fallColor'>
                    {{ item.price_ask }}
                </span>
            </div>
        </div>
        <div class='buy-wrap'>
            <div v-for='(item, index) in bid_deep' :key='index' class='item'>
                <span class='price riseColor'>
                    {{ item.price_bid }}
                </span>
                <span class='quantity alignRight'>
                    {{ formatVolume(item.volume_bid, item.price_bid) }}
                </span>
                <span class='histogram buy-histogram' :style="'width:' + item?.width + '%'"></span>
            </div>
        </div>
    </div>
</template>

<script>
import { computed, reactive, toRefs, watch, onBeforeUnmount, watchEffect, onMounted } from 'vue'
import { useStore } from 'vuex'
import { QuoteSocket } from '@/plugins/socket/socket'
import { pow, formatAmount } from '@/utils/calculation'
import { localGet } from '@/utils/util'
import computeHandicap from '@plans/hooks/handicap'
import useFormatVolume from '@/hooks/trade/useFormatVolume'
import { useAssets } from '@/hooks/assets'

export default {
    components: {},
    props: ['symbolId', 'showPending'],
    setup (props) {
        const store = useStore()
        const { formatVolume, isQuantity } = useFormatVolume()
        const state = reactive({
            curDigits: 0,
            showPopover: false,
            theme: localGet('invertColor') === 'light' ? 'light' : 'dark',
        })

        // 获取用户类型
        const userAccountType = computed(() => store.getters['_user/userAccountType'])
        const assetsInfo = useAssets()

        // 获取盘口深度报价
        const handicapList = computed(() => store.state._quote.handicapList.find((item) => item.symbol_id === props.symbolId))

        const { handicapResult } = computeHandicap({
            showPending: true,
        })

        const ask_deep = computed(() => handicapResult?.value?.ask_deep?.slice(0))
        const bid_deep = computed(() => handicapResult?.value?.bid_deep?.slice(0))
        // 获取当前产品
        const product = computed(() => store.getters.productActived)
        const tradeType = computed(() => product.value.tradeType)
        const accountList = computed(() =>
            store.state._user?.customerInfo?.accountList?.filter((el) => el.tradeType === Number(tradeType.value)),
        )

        // 是否显示'我的'列
        const showField = computed(() => {
            if (userAccountType.value !== 'G' && props.showPending) {
                return true
            } else {
                return false
            }
        })

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

        // 产品切换重新订阅
        watch(
            () => [product.value.symbolId],
            (newVal) => {
                state.curDigits = digitLevelList.value[0]?.text
            },
        )

        watchEffect(() => {
            state.curDigits = state.curDigits || digitLevelList.value[0]?.text
            store.commit('_quote/Update_deepthDigits', state.curDigits)
            if (state.curDigits) {
                QuoteSocket.deal_subscribe(product.value.symbolId, product.value.priceBreadth, state.curDigits, tradeType.value, 5)
            }
        })

        // 修改报价深度
        const onSelect = (val) => {
            state.curDigits = val.text
        }

        const queryPBOOrderPage = () => {
            const accountIds = []
            if (accountList.value && accountList.value.length > 0) {
                accountList.value.forEach((element) => {
                    accountIds.push(element.accountId)
                })
                store.dispatch('_trade/queryPBOOrderPage', {
                    tradeType: tradeType.value,
                    sortFieldName: 'orderTime',
                    sortType: 'desc',
                    accountIds: accountIds + '',
                })
            }
        }

        onMounted(() => {
            queryPBOOrderPage()
        })

        onBeforeUnmount(() => {
            // 组件销毁取消订阅
            QuoteSocket.cancel_subscribe(2)
            store.commit('_quote/Delete_dealList')
        })

        return {
            handicapList,
            userAccountType,
            product,
            onSelect,
            ask_deep,
            bid_deep,
            digitLevelList,
            ...toRefs(state),
            showField,
            formatAmount,
            handicapResult,
            isQuantity,
            formatVolume,
            assetsInfo
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.handicap-header {
    display: flex;
    flex-direction: column;
    padding: 0 12px;

    .select-box{
        display: flex;
      .depth {
            width: 150px;
             height: 40px;
            .depth-select {
                width: fit-content;
                display: block;
                height: 24px;
                line-height: 24px;
                font-size: 12px;
                padding: 0 4px 0 8px;
                background-color: var(--assistColor);
                border-radius: 6px;
                span {
                    margin-left: rem(10px);
                    //vertical-align: middle;
                }
                :deep(.van-popover__wrapper) {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    .triangleDiv {
                        width: 0;
                        height: 0;
                        margin-left: rem(10px);
                        border-color: var(--minorColor) transparent transparent;
                        border-style: solid;
                        border-width: 5px 5px 0;
                    }
                }
            }
        }
    }
    .title-box{
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      font-size: 12px;
      color: var(--normalColor);
    }

}
.stalls-wrap {
    display: flex;
    flex-direction: row;
    width: 100%;
    &.padding {
        padding: 0 rem(50px);
    }
    .sell-wrap,
    .buy-wrap {
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: flex-start;
        color: var(--mutedColor);
        font-size: 12px;
        .item {
            position: relative;
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            align-items: center;
            justify-content: flex-start;
            box-sizing: border-box;
            height: rem(60px);
            margin-bottom: 4px;
            //width: 100%;
            overflow: hidden;
            //padding: 0 rem(10px);
            white-space: nowrap;
            .label,
            .price,
            .quantity {
                position: relative;
                z-index: 1;
                padding: 0 12px;
            }
            .label {
                //flex: 1;
                width: rem(100px);
            }
            .price {
                flex: 1;
                margin-right: rem(10px);
                padding-left: rem(10px);
                text-align: left;
                &.price-right {
                    text-align: right;
                }
            }
            .quantity {
                flex: 1;
                color: var(--normalColor);
            }
            .histogram {
                position: absolute;
                height: 100%;
                opacity: 0.2;
                &.sell-histogram {
                    right: 0;
                    background: var(--fallColor);
                    opacity: 0.05;
                }
                &.buy-histogram {
                    background: var(--riseColor);
                    opacity: 0.05;
                }
            }
        }
    }
    .scale-wrap {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        box-sizing: border-box;
        height: rem(50px);
        padding: 0 rem(10px);
        .left {
            display: block;
            flex: 0 0 50%;
            height: rem(10px);
            // background: linear-gradient(-60deg, transparent rem(5px), rgb(15, 52, 255) 0);
            transition: flex 0.28s ease-in-out;
        }
        .right {
            display: block;
            flex: 1;
            height: rem(10px);
            // background: linear-gradient(127deg, transparent rem(5px), rgb(247, 75, 33) 0);
        }
    }
}
</style>

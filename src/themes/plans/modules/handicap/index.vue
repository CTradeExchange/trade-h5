<template>
    <div class='handicap-header'>
        <div v-if='showField' class='my'>
            {{ $t('trade.my') }}
        </div>
        <div class='alignCenter'>
            {{ $t('trade.volumes') }}({{ product.baseCurrency }})
        </div>
        <div class='padding' :class="showField ? 'alignRight' : 'alignCenter'">
            {{ $t('trade.priceLabel') }}({{ product.profitCurrency }})
        </div>
        <div v-if='showField' class='depth alignLeft'>
            <span class='depth-select'>
                <van-popover
                    v-model:show='showPopover'
                    :actions='digitLevelList'
                    :theme='theme'
                    @select='onSelect'
                >
                    <template #reference>
                        <span>{{ curDigits }}</span>
                        <span class='triangleDiv'></span>
                    </template>
                </van-popover>
            </span>
        </div>
        <div v-else class='alignCenter'>
            {{ $t('trade.priceLabel') }}({{ product.profitCurrency }})
        </div>
        <div class='padding alignCenter'>
            {{ $t('trade.volumes') }}({{ product.baseCurrency }})
        </div>
        <div v-if='showField' class='my'>
            {{ $t('trade.my') }}
        </div>
    </div>
    <van-empty v-if='!handicapList' :description='$t("common.noData")' image='/images/empty.png' />
    <div class='stalls-wrap' :class='{ padding: !showField }'>
        <div class='sell-wrap'>
            <div v-for='(item,index) in handicapList?.ask_deep' :key='index' class='item'>
                <span v-if='showField' class='label fallColor '>
                    {{ item.unitNum === 0 ? '': item.unitNum }}
                </span>
                <span class='quantity'>
                    {{ item.volume_ask }}
                </span>
                <span
                    class='histogram buy-histogram'
                    :style='"width:"+ item?.width * 100 + "%"'
                ></span>

                <span class='price price-right fallColor'>
                    {{ item.price_ask }}
                </span>
            </div>
        </div>
        <div class='buy-wrap'>
            <div v-for='(item,index) in handicapList?.bid_deep' :key='index' class='item'>
                <span class='price riseColor '>
                    {{ item.price_bid }}
                </span>
                <span class='quantity alignRight'>
                    {{ item.volume_bid }}
                </span>
                <span v-if='showField' class='label label-right riseColor'>
                    {{ item.unitNum === 0 ? '': item.unitNum }}
                </span>
                <span
                    class='histogram sell-histogram'
                    :style='"width:"+ item?.width * 100 + "%"'
                ></span>
            </div>
        </div>
    </div>
</template>

<script>
import { computed, reactive, toRefs, watch, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { QuoteSocket } from '@/plugins/socket/socket'
import { pow, shiftedBy, plus } from '@/utils/calculation'
import { localGet } from '@/utils/util'
export default {
    components: { },
    props: ['symbolId', 'showPending'],
    setup (props) {
        const store = useStore()
        const route = useRoute()
        const state = reactive({
            curDigits: 0,
            showPopover: false,
            theme: localGet('invertColor') === 'light' ? 'light' : 'dark'
        })

        // 获取用户类型
        const userAccountType = computed(() => store.getters['_user/userAccountType'])

        // 获取盘口深度报价
        const handicapList = computed(() => store.state._quote.handicapList.find(item => item.symbol_id === props.symbolId))

        // 当前产品id 的挂单列表
        const pendingList = computed(() => {
            return store.state._trade.pendingList[route.query.tradeType]
        })

        // 获取当前产品
        const product = computed(() => store.state._quote.productMap[props.symbolId + '_' + route.query.tradeType])

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

        // 深度变化重新发起订阅
        watch(() => digitLevelList.value.length, newVal => {
            if (newVal > 0) {
                state.curDigits = digitLevelList.value[0]?.text
                // 订阅盘口深度报价
                QuoteSocket.deal_subscribe([props.symbolId], 10, state.curDigits, route.query.tradeType)
            }
        }, {
            immediate: true
        })

        // 计算长度
        watch(() => [handicapList.value], (newValues) => {
            const result = handicapList.value
            const tempArr = [] // 总量
            if (result?.ask_deep.length > 0) {
                result.ask_deep.forEach(ask => {
                    tempArr.push(ask.volume_ask)
                })
            }

            if (result?.bid_deep.length > 0) {
                result.bid_deep.forEach(bid => {
                    tempArr.push(bid.volume_bid)
                })
            }

            const maxValue = Math.max(...tempArr)
            const minValue = Math.min(...tempArr)

            const diff = maxValue - minValue
            // 计算卖出报价长度
            if (result?.ask_deep.length > 0) {
                const sellPendingList = pendingList.value && pendingList.value.filter(item => Number(item.direction === 1))
                result.ask_deep.forEach(ask => {
                    ask.width = diff === 0 ? 0 : (parseFloat(ask.volume_ask) - parseFloat(minValue)) / diff
                    ask.unitNum = 0
                    // 计算合并挂单数量
                    if (sellPendingList?.length > 0 && props.showPending) {
                        sellPendingList.forEach(sl => {
                            const requestPrice = shiftedBy(sl.requestPrice, -1 * product.value.price_digits)
                            if (parseFloat(requestPrice) === parseFloat(ask.price_ask)) {
                                ask.unitNum = plus(sl.requestNum, ask.unitNum)
                            }
                        })
                    }
                })
            }

            // 计算买入报价长度
            if (result?.bid_deep.length > 0) {
                const buyPendingList = pendingList.value && pendingList.value.filter(item => Number(item.direction === 2))
                result.bid_deep.forEach(bid => {
                    bid.width = diff === 0 ? 0 : (parseFloat(bid.volume_bid) - parseFloat(minValue)) / diff
                    bid.unitNum = 0
                    // 计算合并挂单数量
                    if (buyPendingList?.length > 0 && props.showPending) {
                        buyPendingList.forEach(bl => {
                            const requestPrice = shiftedBy(bl.requestPrice, -1 * product.value.price_digits)
                            if (parseFloat(requestPrice) === parseFloat(bid.price_bid)) {
                                bid.unitNum = plus(bl.requestNum, bid.unitNum)
                            }
                        })
                    }
                })
            }
        }, {
            deep: true
        })

        // 修改报价深度
        const onSelect = (val) => {
            state.curDigits = val.text
            QuoteSocket.deal_subscribe([props.symbolId], 10, state.curDigits, route.query.tradeType)
        }

        store.dispatch('_trade/queryPBOOrderPage', {
            tradeType: route.query.tradeType
        })

        onBeforeUnmount(() => {
            // 组件销毁取消订阅
            QuoteSocket.cancel_subscribe(2)
        })

        return {
            handicapList,
            userAccountType,
            product,
            onSelect,
            digitLevelList,
             ...toRefs(state),
            showField
        }
    }
}

</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.handicap-header {
    display: flex;
    align-items: center;
    height: rem(80px);
    line-height: rem(80px);
    >div {
        display: inline-block;
        flex: 1;
        color: var(--minorColor);
        font-size: rem(20px);
        &.my {
            flex: 0 0 rem(90px);
            text-align: center;
        }
        &.padding {
            // padding: 0 rem(20px);
        }
        &.depth {
            padding-left: rem(10px);
            .depth-select {
                display: inline-block;
                width: rem(110px);
                height: rem(40px);
                line-height: rem(40px);
                background-color: var(--primaryAssistColor);
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
}
.stalls-wrap {
    display: flex;
    flex-direction: row;
    width: 100%;
    padding: 0 rem(5px);
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
        font-size: rem(22px);
        .item {
            position: relative;
            // flex: 1;
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            align-items: center;
            justify-content: flex-start;
            box-sizing: border-box;
            width: 100%;
            height: rem(60px);
            //padding: 0 rem(10px);
            white-space: nowrap;
            .label,
            .price,
            .quantity {
                position: relative;
                z-index: 1;
            }
            .label {
                flex: 1;
                text-align: center;
                &.label-right {
                    text-align: right;
                }
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
                //text-align: center;
            }
            .histogram {
                position: absolute;
                top: 0;
                width: 0;
                max-width: 100%;
                height: 100%;
                opacity: 0.2;
                transition: width 0.28s ease-in-out;
                &.sell-histogram {
                    background: var(--riseColor);
                    opacity: 0.05;
                }
                &.buy-histogram {
                    right: 0;
                    background: var(--fallColor);
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

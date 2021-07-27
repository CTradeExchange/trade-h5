<template>
    <div v-if='showTabs' class='stallsAndDeal'>
        <van-tabs
            ref='tabs'
            class='tabs'
            color='#477fd3'
            line-height='2'
            line-width='33.3%'
            title-active-color='#477fd3'
        >
            <van-tab v-if='statusList.indexOf("stalls") > -1' name='stalls' :title='$t("trade.handicap")'>
                <!-- <van-empty v-if='product.tickResult.length === 0' image='/images/empty.png'>
                    {{ $t('trade.noStallsData') }}
                </van-empty> -->

                <div class='handicap-header'>
                    <span v-if="userAccountType !=='G'">
                        {{ $t('trade.my') }}
                    </span>
                    <span>{{ $t('trade.volumes') }}({{ product.baseCurrency }})</span>
                    <span>{{ $t('trade.priceLabel') }}({{ product.profitCurrency }})</span>
                    <span class='depth'>
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
                    <span>{{ $t('trade.volumes') }}({{ product.baseCurrency }})</span>
                    <span v-if="userAccountType !=='G'">
                        {{ $t('trade.my') }}
                    </span>
                </div>
                <div v-for='(item,index) in product.tickResult' :key='index' class='stalls-wrap'>
                    <div class='buy-wrap'>
                        <div class='item quantity'>
                            <span v-if="userAccountType !=='G'" class='label'>
                            </span>
                            <span class='quantity'>
                                {{ item.volume_ask }}
                            </span>
                            <span
                                class='histogram buy-histogram'
                                :style='"width:"+ item?.width?.buy * 100 + "%"'
                            ></span>

                            <span class='price price-right fallColor'>
                                {{ parseFloat(item.price_ask).toFixed(product.price_digits) }}
                            </span>
                        </div>
                    </div>
                    <div class='sell-wrap'>
                        <div class='item quantity'>
                            <span class='price riseColor '>
                                {{ parseFloat(item.price_bid).toFixed(product.price_digits) }}
                            </span>
                            <span class='quantity'>
                                {{ item.volume_bid }}
                            </span>
                            <span v-if="userAccountType !=='G'" class='label label-right'>
                            </span>

                            <span
                                class='histogram sell-histogram'
                                :style='"width:"+ item?.width?.sell *100 + "%"'
                            ></span>
                        </div>
                    </div>
                </div>
            </van-tab>
            <van-tab v-if='statusList.indexOf("deal") > -1' name='deal' :title='$t("trade.deal")'>
                <!-- 成交记录 -->
                <div class='deal-wrap'>
                    <van-empty v-if='dealList.length === 0' image='/images/empty.png'>
                        {{ $t('trade.noDealData') }}
                    </van-empty>
                    <!-- {{ dealList }} -->
                    <div v-else class='list-wrap'>
                        <div class='col time-col'>
                            {{ $t('trade.dealTime') }}
                        </div>

                        <div class='col'>
                            {{ $t('trade.direction') }}
                        </div>

                        <div class='col price-col'>
                            {{ $t('trade.priceLabel') }}
                        </div>

                        <div class='col volume-col'>
                            {{ $t('trade.volumes') }}
                        </div>
                    </div>
                    <div class='deal-content'>
                        <div v-for='item in dealList' :key='item.symbolId' class='deal-item'>
                            <span>{{ formatTime(item.dealTime) }}</span>
                            <span :class="[item.trade_direction===1?'riseColor':'fallColor']">
                                {{ Number(item.trade_direction) === 1 ? $t('trade.buy') : $t('trade.sell') }}
                            </span>
                            <span>
                                {{ item.price }}
                            </span>
                            <span>{{ item.volume }}</span>
                        </div>
                    </div>
                </div>
            </van-tab>
            <van-tab :title='$t("trade.trust")'>
                <div v-if='pendingList.length === 0'>
                    <van-empty :description='$t("common.noData")' image='/images/empty.png' />
                </div>
                <div v-else class='trust-wrap'>
                    <trustItem v-for='(item, index) in pendingList' :key='index' @click.stop="$router.push('/trustDetail')" />
                    <a class='to-all' href='javascript:;' @click="$router.push('/trustList')">
                        {{ $t('trade.allTrust') }} >
                    </a>
                </div>
            </van-tab>
        </van-tabs>
    </div>
</template>

<script>
import trustItem from '@abcc/modules/trust/trust.vue'
import { computed, reactive, toRefs, watch, onBeforeUnmount, watchEffect } from 'vue'
import { useStore } from 'vuex'
import dayjs from 'dayjs'
import { pow } from '@/utils/calculation'
import { localGet } from '@/utils/util'
import { QuoteSocket } from '@/plugins/socket/socket'
export default {
    components: { trustItem },
    props: ['symbolId', 'settingList', 'curPrice'],
    setup (props) {
        const store = useStore()
        const state = reactive({
            dealData: [],
            statusList: props.settingList,
            isDealDelaying: false,
            timer: 0,
            curDigits: 0,
            showPopover: false,
            theme: localGet('invertColor') === 'light' ? 'light' : 'dark'
        })

        // 获取当前产品
        const product = computed(() => store.state._quote.productMap[props.symbolId])
        // 获取玩法id
        const tradeType = computed(() => store.state._base.tradeType)

        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)

        // 获取用户类型
        const userAccountType = computed(() => store.getters['_user/userAccountType'])

        // 获取挂单列表
        const pendingList = computed(() => store.state._trade.pendingList)

        // 是否显示底部 tabs
        const showTabs = computed(() => {
            if (props.settingList.indexOf('stalls') === -1 && props.settingList.indexOf('deal') === -1) {
                return false
            }
            return true
        })

        // 计算报价小数位档数
        const digitLevelList = computed(() => {
            const digits = []
            var symbolDigits = product.value.symbolDigits
            while (symbolDigits > -3) {
                digits.push({ text: pow(0.1, symbolDigits) })
                symbolDigits--
            }
            return digits.splice(0, 5)
        })

        watchEffect(() => {
            if (digitLevelList.value.length > 0) {
                state.curDigits = digitLevelList.value[0]?.text
            }
        })

        // 获取成交数据
        const dealList = computed(() => store.state._quote.dealList)

        watch(() => [product.value.tickResult], (newValues) => {
            const result = product.value.tickResult
            const tempArr = []
            if (result.length > 0) {
                result.forEach(item => {
                    tempArr.push(item.volume_ask)
                    tempArr.push(item.volume_bid)
                })
            }
            const maxValue = Math.max(...tempArr)
            const minValue = Math.min(...tempArr)
            const diff = maxValue - minValue
            // 计算深度
            result.forEach(item => {
                item.width = {
                    buy: diff === 0 ? 0 : (parseFloat(item.volume_ask) - parseFloat(minValue)) / diff,
                    sell: diff === 0 ? 0 : (parseFloat(item.volume_bid) - parseFloat(minValue)) / diff,
                }
            })
        })

        watch(
            () => props.settingList,
            (val) => {
                console.log(props.settingList)
                if (props.settingList.indexOf('stalls') === -1 && props.settingList.indexOf('deal') === -1) {
                    state.showTabs = false
                } else {
                    state.showTabs = true
                }
                state.statusList = props.settingList
                // state.activeObj = props.status
            })

        // 格式化时间
        const formatTime = (val) => {
            return dayjs(val).format('HH:mm:ss')
        }

        const onSelect = (val) => {
            state.curDigits = val.text
            QuoteSocket.deal_subscribe([props.symbolId], 10, state.curDigits)
        }

        // 获取委托列表
        store.dispatch('_trade/queryPBOOrderPage', {
            tradeType: tradeType.value,
            customerNo: customInfo.value.customerNo,
            accountId: customInfo.value.accountId,
            sortFieldName: 'orderTime',
            sortType: 'desc'
        })
        // 订阅盘口深度报价
        QuoteSocket.deal_subscribe([props.symbolId], 10, digitLevelList?.value[0]?.text)

        onBeforeUnmount(() => {
            // 组件销毁取消订阅
            QuoteSocket.cancel_subscribe(2)
        })

        return {
            product,
            formatTime,
            showTabs,
            onSelect,
            dealList,
            digitLevelList,
            userAccountType,
            tradeType,
            customInfo,
            pendingList,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.stallsAndDeal {
    min-width: rem(200px);
    height: rem(890px);
    margin-top: rem(10px);
    margin-bottom: rem(30px);
    background: var(--contentColor);
    .tabs {
        display: flex;
        flex-direction: column;
        height: 100%;
        :deep() {
            .van-tab {
                font-size: rem(24px);
                line-height: rem(50px);
                background-color: var(--contentColor);
            }
            .van-tabs__wrap {
                height: rem(80px);
                border-bottom: solid 1px var(--lineColor);
                .van-tab__text {
                    font-weight: bold;
                    font-size: rem(28px);
                }
            }
            .van-tabs__content {
                flex: 1;
                box-sizing: border-box;
                padding-top: rem(10px);
                padding-bottom: rem(20px);
                background: var(--contentColor);
                .van-tab__pane {
                    height: 100%;
                }
            }
        }
    }
    .trust-wrap {
        margin: 0 auto;
        text-align: center;
        .to-all {
            color: var(--primary);
            line-height: rem(75px);
        }
    }
    .handicap-header {
        display: flex;
        align-items: center;
        height: rem(80px);
        padding: 0 0 0 rem(15px);
        line-height: rem(80px);
        >span {
            display: inline-block;
            //flex: 1;
            color: var(--minorColor);
            //width: 20%;
            font-size: rem(20px);
            text-align: center;
            &:first-child {
                width: rem(60px);
            }
            &:nth-child(2) {
                width: rem(150px);
            }
            &:nth-child(3) {
                width: rem(160px);
                text-align: right;
            }
            &:nth-child(5) {
                width: rem(170px);
                margin-right: rem(8px);
                text-align: right;
            }
            &:nth-child(6) {
                width: rem(50px);
                text-align: right;
            }
            &.depth {
                width: rem(110px);
                height: rem(40px);
                margin-left: rem(15px);
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
    .stalls-wrap {
        display: flex;
        flex-direction: row;
        width: 100%;
        padding: 0 rem(20px);
        .sell-wrap,
        .buy-wrap {
            display: flex;
            flex: 1;
            flex-direction: column;
            justify-content: flex-start;
            color: var(--mutedColor);
            font-size: rem(22px);
            .item {
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
                    width: rem(80px);
                    text-align: left;
                    &.label-right {
                        text-align: right;
                    }
                }
                .price {
                    flex: 1;
                    margin-right: rem(10px);
                    text-align: left;
                    &.price-right {
                        text-align: right;
                    }
                }
                .quantity {
                    color: var(--normalColor);
                    text-align: right;
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
        .quantity {
            position: relative;
            z-index: 0;
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
    .deal-wrap {
        position: relative;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        color: var(--mutedColor);
        font-size: rem(22px);
        line-height: rem(24px);
        .list-wrap {
            display: flex;
            //flex: rem(300px); // 仅用于不撑开外层
            flex-direction: row;
            flex-wrap: nowrap;
            width: 95%;
            margin: 0 auto;
            overflow: hidden;
            .col {
                position: relative;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                color: var(--minorColor);
                line-height: rem(50px);
                white-space: nowrap;
                text-align: left;
                &:last-child {
                    margin-right: 0;
                }
                &.time-col {
                    width: 25%;
                }
                .vals {
                    position: absolute;
                    top: rem(50px);
                    z-index: 0;
                    min-height: 100%;
                    color: var(--normalColor);
                    .val {
                        display: block;
                        margin: rem(15px) 0;
                    }
                }
                .forWide {
                    height: 0;
                    margin: 0 rem(2px);
                    overflow: hidden;
                    color: #FFF;
                    opacity: 0;
                }
            }
            .price-col {
                flex: 1;
                align-items: flex-end;
                text-align: right;
            }
            .volume-col {
                flex: 1;
                align-items: flex-end;
                margin-left: rem(6px);
                text-align: right;
            }
        }
        .deal-content {
            height: rem(300px);
            padding: 0 rem(20px);
            overflow: 100%;
            .deal-item {
                line-height: rem(50px);
                >span {
                    display: inline-block;
                    &:first-child {
                        width: 25%;
                    }
                    &:nth-child(2) {
                        width: 8%;
                    }
                    &:nth-child(3) {
                        width: 33%;
                        text-align: right;
                    }
                    &:last-child {
                        width: 34%;
                        text-align: right;
                    }
                }
            }
        }
    }
}
</style>

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
                    <span>我的</span>
                    <span>数量({{ product.baseCurrency }})</span>
                    <span>价格({{ product.profitCurrency }})</span>
                    <span class='depth'>
                        <van-popover v-model:show='showPopover' :actions='depthActions' @select='onSelect'>
                            <template #reference>
                                <span>{{ curDigits }}</span>
                                <span class='triangleDiv'></span>
                            </template>
                        </van-popover>
                    </span>
                    <span>数量({{ product.baseCurrency }})</span>
                    <span>我的</span>
                </div>
                <div v-for='(item,index) in product.tickResult' :key='index' class='stalls-wrap'>
                    <div class='buy-wrap'>
                        <div class='item quantity'>
                            <span class='label'>
                                0.02
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
                            <span class='label label-right'>
                                0.05
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
                    <van-empty v-if='dealData.length === 0' image='/images/empty.png'>
                        {{ $t('trade.noDealData') }}
                    </van-empty>
                    <div v-else class='list-wrap'>
                        <div class='col time-col'>
                            <span class='label'>
                                {{ $t('trade.dealTime') }}
                            </span>
                            <span v-if='dealData.length' class='val forWide'>
                                {{ formatTime(dealData[0][1]) }}
                            </span>
                            <div class='vals'>
                                <span class='val'>
                                    <span v-for='(item, i) in dealData' :key='i' class='val' :class='item.colorCls'>
                                        {{ formatTime(item[1]) }}
                                    </span>
                                </span>
                            </div>
                        </div>
                        <div class='col'>
                            <span class='label'>
                                {{ $t('trade.direction') }}
                            </span>
                            <div class='vals'>
                                <span class='val fallColor'>
                                    买入
                                </span>
                            </div>
                        </div>
                        <div class='col price-col'>
                            <span class='label'>
                                {{ $t('trade.priceLabel') }}
                            </span>
                            <span v-if='dealData.length' class='val forWide'>
                                {{ dealData[0][2] }}
                            </span>
                            <div class='vals'>
                                <span v-for='(item, i) in dealData' :key='i' class='val' :class='item.colorCls'>
                                    {{ item[2] }}
                                </span>
                            </div>
                        </div><div class='col volume-col'>
                            <span class='label'>
                                {{ $t('trade.volumes') }}
                            </span>
                            <span v-if='dealData.length' class='val forWide'>
                                {{ dealData[0][3] }}
                            </span>
                            <div class='vals'>
                                <span v-for='(item, i) in dealData' :key='i' class='val' :class='item.colorCls'>
                                    {{ item[3] }}
                                <!-- {{ item[4] === 1 ? 'B' : 'S' }} -->
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </van-tab>
            <van-tab :title='$t("trade.trust")'>
                <div class='trust-wrap'>
                    <trustItem v-for='(item, index) in 2' :key='index' @click.stop="$router.push('/trustDetail')" />
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
import { computed, reactive, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
import dayjs from 'dayjs'
export default {
    components: { trustItem },
    props: ['symbolId', 'settingList', 'curPrice'],
    setup (props) {
        const store = useStore()
        const state = reactive({
            dealData: [],
            tempDealData: [],
            statusList: props.settingList,
            isDealDelaying: false,
            timer: 0,
            curDigits: 0.01
        })
        const depthActions = [
            { text: '0.01' },
            { text: '0.1' },
            { text: '1' },
        ]
        const product = computed(() => store.state._quote.productMap[props.symbolId])
        const showTabs = computed(() => {
            if (props.settingList.indexOf('stalls') === -1 && props.settingList.indexOf('deal') === -1) {
                return false
            }
            return true
        })
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

        watch(() => props.curPrice, (newVal, oldVal) => {
            const newList = []
            const len = genRandomLen()
            while (newList.length < len) {
                const time = Date.now()
                const volume = genRandomVolume()
                newList.unshift([793065, time, newVal, volume, 2, 1])
            }
            if (newList.length && newVal && oldVal) {
                if (newVal * 1 !== oldVal * 1) {
                    if (newVal * 1 > oldVal * 1) {
                        newList[newList.length - 1].colorCls = 'riseColor'
                    } else {
                        newList[newList.length - 1].colorCls = 'fallColor'
                    }
                }
            }

            state.tempDealData.unshift(...newList)
        })

        watch(() => state.tempDealData, (val, old) => {
            if (!val.length) {
                state.isDealDelaying = false
            }

            if (val.length && !state.isDealDelaying) {
                state.isDealDelaying = true
                delayMounted()
                // console.log(val.length, 'delayMounted')
            }
        }, {
            deep: true,
            immediate: true,
        })

        const delayMounted = (time = 100) => {
            requestAnimationFrame(() => {
                if (!state.tempDealData.length) {
                    return
                }
                // if (this.tempDealData.length > 100) {
                //     this.tempDealData.splice(0, this.tempDealData.length - 60)
                // }
                state.tempDealData.splice(20)
                if (state.dealData.length > 20) {
                    state.dealData.pop()
                }
                state.dealData.unshift(state.tempDealData.splice(state.tempDealData.length - 1, 1)[0])

                state.timer = setTimeout(() => {
                    delayMounted(100 / state.tempDealData.length)
                }, time)
            })
        }

        // 生成随机长度，大于0
        const genRandomLen = () => {
            // 笔数=【1，5】随机
            const random = Math.random()
            let range = []
            if (random < 0.7) {
                // 3条概率
                range = [0, 3]
            } else {
                // 5条概率
                range = [3, 2]
            }

            let len = range[0] + Math.random() * range[1]
            while (!len) {
                len = range[0] + Math.random() * range[1]
            }

            return len
        }

        // 生成随机成交量，大于0
        const genRandomVolume = () => {
            const random = Math.random()
            let range = []
            if (random < 0.7) {
                range = [0, 3]
            } else {
                range = [3, 10]
            }
            // BTC产品 数量=【0，30】随机，保留3位小数
            // ETH产品 数量=【0，100】随机，保留3位小数
            let volume = range[0] + Math.random() * range[1]
            while (!volume) {
                volume = range[0] + Math.random() * range[1]
            }
            volume = volume.toFixed(3)

            return volume
        }

        // 格式化时间
        const formatTime = (val) => {
            return dayjs(val).format('HH:mm:ss')
        }

        const onSelect = (val) => {
            state.curDigits = val.text
        }

        return {
            product,
            formatTime,
            showTabs,
            depthActions,
            onSelect,
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
        //display: flex;
        height: rem(80px);
        padding: 0 rem(15px);
        line-height: rem(80px);
        >span {
            display: inline-block;
            color: var(--minorColor);
            //flex: 1;\
            //width: 20%;
            font-size: rem(20px);
            text-align: center;
            &:first-child {
                width: rem(60px);
            }
            &:nth-child(2) {
                width: rem(130px);
            }
            &:nth-child(3) {
                width: rem(160px);
                text-align: right;
            }
            &:nth-child(5) {
                width: rem(170px);
                text-align: right;
            }
            &:nth-child(6) {
                width: rem(60px);
                text-align: right;
            }
            &.depth {
                position: relative;
                width: rem(100px);
                height: rem(40px);
                margin-top: rem(20px);
                margin-right: rem(15px);
                margin-left: rem(15px);
                line-height: rem(40px);
                text-align: left;
                background-color: var(--bgColor);
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
                        margin-left: rem(5px);
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
        overflow: hidden;
        color: var(--mutedColor);
        font-size: rem(22px);
        line-height: rem(24px);
        .list-wrap {
            display: flex;
            flex: rem(300px); // 仅用于不撑开外层
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
                white-space: nowrap;
                text-align: left;
                &:last-child {
                    margin-right: 0;
                }
                &.time-col {
                    width: 25%;
                }
                .label {
                    position: relative;
                    z-index: 1;
                    width: 100%;
                    margin-bottom: rem(10px);
                    padding: rem(5px) 0;
                    color: var(--minorColor);
                    line-height: rem(50px);
                    background: var(--contentColor);
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
            .time-col{
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
    }
}
</style>

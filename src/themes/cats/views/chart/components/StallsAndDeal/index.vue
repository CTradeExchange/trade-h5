<template>
    <div class='stallsAndDeal'>
        <van-tabs
            ref='tabs'
            v-model:active='tabActive'
            class='tabs'
            color='#477fd3'
            line-height='2'
            line-width='20'
            title-active-color='#477fd3'
        >
            <van-tab v-if='activeObj[0]' name='stalls' title='五档'>
                <div v-for='(item,index) in product.tickResult' :key='index' class='stalls-wrap'>
                    <div class='sell-wrap'>
                        <div class='item quantity'>
                            <span class='label'>
                                {{ $t('trade.sellShort') }}{{ index+1 }}
                            </span>
                            <span class='price riseColor '>
                                {{ item.price_bid }}
                            </span>
                            <span class='quantity'>
                                {{ item.volume_bid }}
                            </span>
                            <span
                                class='histogram sell-histogram'
                                :style='"width:"+(item.volume_bid / product.bidTotal)*100 + "%"'
                            ></span>
                        </div>
                    </div>
                    <div class='scale-wrap'>
                        <span class='left'></span>
                        <span class='right'></span>
                    </div>
                    <div class='buy-wrap'>
                        <div class='item quantity'>
                            <span class='label'>
                                {{ $t('trade.buyShort') }}{{ index+1 }}
                            </span>
                            <span class='price fallColor'>
                                {{ item.price_ask }}
                            </span>
                            <span class='quantity'>
                                {{ item.volume_ask }}
                            </span>
                            <span
                                class='histogram buy-histogram'

                                :style='"width:"+(item.volume_ask / product.askTotal)*100 + "%"'
                            ></span>
                        </div>
                    </div>
                </div>
            </van-tab>
            <van-tab v-if='activeObj[1]' name='deal' title='成交'>
                <!-- 成交记录 -->
                <div class='deal-wrap'>
                    <div class='list-wrap'>
                        <div class='col time-col'>
                            <span class='label'>
                                时间
                            </span>
                            <span class='val forWide'>
                                09:47:05
                            </span>
                            <div class='vals'>
                                <span class='val'>
                                    09:47:01
                                </span>
                                <span class='val'>
                                    09:47:01
                                </span>
                                <span class='val fallColor'>
                                    09:47:01
                                </span>
                                <span class='val'>
                                    09:46:58
                                </span>
                                <span class='val riseColor'>
                                    09:46:58
                                </span>
                                <span class='val'>
                                    09:46:58
                                </span>
                                <span class='val'>
                                    09:46:58
                                </span>
                                <span class='val riseColor'>
                                    09:46:58
                                </span>
                                <span class='val riseColor'>
                                    09:46:58
                                </span>
                            </div>
                        </div>
                        <div class='col price-col'>
                            <span class='label'>
                                成交价
                            </span><span class='val forWide'>
                                31596.3
                            </span>
                            <div class='vals'>
                                <span class='val'>
                                    31596.3
                                </span>
                                <span class='val fallColor'>
                                    31596.3
                                </span>
                                <span class='val fallColor'>
                                    31596.7
                                </span>
                                <span class='val'>
                                    31598.7
                                </span>
                                <span class='val'>
                                    31598.7
                                </span>
                                <span class='val riseColor'>
                                    31598.7
                                </span>
                                <span class='val fallColor'>
                                    31597.1
                                </span>
                                <span class='val'>
                                    31598.4
                                </span>
                                <span class='val'>
                                    31598.4
                                </span>
                            </div>
                        </div><div class='col volume-col'>
                            <span class='label'>
                                成交量
                            </span><span class='val forWide'>
                                6.245
                            </span>
                            <div class='vals'>
                                <span class='val'>
                                    6.245
                                </span>
                                <span class='val fallColor'>
                                    3.417
                                </span>
                                <span class='val fallColor'>
                                    2.082
                                </span>
                                <span class='val'>
                                    1.715
                                </span>
                                <span class='val'>
                                    1.962
                                </span>
                                <span class='val riseColor'>
                                    4.418
                                </span>
                                <span class='val fallColor'>
                                    2.082
                                </span>
                                <span class='val'>
                                    1.715
                                </span>
                                <span class='val'>
                                    1.962
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </van-tab>
        </van-tabs>
    </div>
</template>

<script>

import { computed, reactive, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
export default {
    components: {

    },
    props: ['symbolId', 'status'],
    setup (props) {
        const store = useStore()
        const state = reactive({
            tabActive: 1,
            dealData: [],
            tempDealData: []
        })
        const product = computed(() => store.state._quote.productMap[props.symbolId])
        const activeObj = computed(() => props.status)

        watch(() => [product.value.tickResult], (newValues) => {
            let totalAskVolume = 0; let totalBidVolume = 0
            if (product.value.tickResult.length > 0) {
                product.value.tickResult.forEach(item => {
                    totalAskVolume += parseFloat(item.volume_ask)
                    totalBidVolume += parseFloat(item.volume_bid)
                })
                product.value.askTotal = totalAskVolume
                product.value.bidTotal = totalBidVolume
            }
        })

        // watch(
        //     () => props.status,
        //     (val) => {
        //         console.log(props.status)
        //         state.activeObj = props.status
        //     })

        return {
            product,
            activeObj,
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
    background: var(--white);
    border-top: 1px solid #ECEDF2;
    border-right: 1px solid #ECEDF2;
    .tabs {
        display: flex;
        flex-direction: column;
        height: 100%;
        :deep() {
            .van-tab {
                font-size: rem(24px);
                line-height: rem(50px);
            }
            .van-tabs__wrap {
                height: rem(50px);
            }
            .van-tabs__content {
                flex: 1;
                box-sizing: border-box;
                padding-top: rem(10px);
                padding-bottom: rem(20px);
                background: #FFF;
                .van-tab__pane {
                    height: 100%;
                }
            }
        }
    }
    .stalls-wrap {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 100%;
        .sell-wrap,
        .buy-wrap {
            display: flex;
            flex: 1;
            flex-direction: column;
            // justify-content: space-around;
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
                height: rem(50px);
                padding: 0 rem(10px);
                white-space: nowrap;
                .label,
                .price,
                .quantity {
                    position: relative;
                    z-index: 1;
                }
                .label {
                    width: rem(50px);
                }
                .price {
                    flex: 1;
                    margin-right: rem(10px);
                    text-align: left;
                }
                .quantity {
                    // flex: 1;
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
                right: 0;
                width: 0;
                max-width: 55%;
                height: 100%;
                opacity: 0.2;
                transition: width 0.28s ease-in-out;
                &.sell-histogram {
                    background: rgb(227, 82, 92);
                }
                &.buy-histogram {
                    background: rgb(16, 184, 115);
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
            width: 85%;
            margin: 0 auto;
            padding: 0 rem(10px);
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
                .label {
                    position: relative;
                    z-index: 1;
                    width: 100%;
                    padding: rem(5px) 0;
                    background: #FFF;
                }
                .vals {
                    position: absolute;
                    top: rem(26px);
                    z-index: 0;
                    min-height: 100%;
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

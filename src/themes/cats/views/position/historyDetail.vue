<template>
    <div class='page-wrap'>
        <LayoutTop :back='true' :menu='false' />
        <div class='main'>
            <div class='m-orderInfo'>
                <div class='layout layout-1'>
                    <div class='item item-1'>
                        <div class='left'>
                            <div class='name'>
                                欧元美元
                            </div>
                            <div class='code'>
                                欧元美元
                            </div>
                        </div>
                    </div>
                    <div class='item item-2'>
                        <!-- <div class='col'>
                            <div class='sub'>
                                {{ $t('trade.netProfit') }} (USD)
                            </div><div class='name riseColor'>
                            </div>
                        </div> -->
                        <div class='col'>
                            <div class='sub'>
                                {{ $t('trade.profit') }}({{ customerInfo.currency }})
                            </div>
                            <div class='name'>
                                --
                            </div>
                        </div><div class='col'>
                            <div class='sub'>
                                {{ $t('trade.swap_2') }}({{ customerInfo.currency }})
                            </div>
                            <div class='name'>
                                --
                            </div>
                        </div><div class='col'>
                            <div class='sub'>
                                {{ $t('trade.fee') }}({{ customerInfo.currency }})
                            </div>
                            <div class='name'>
                                --
                            </div>
                        </div>
                    </div>
                </div><div class='layout layout-1'>
                    <div class='item item-2 van-hairline--bottom'>
                        <div class='col'>
                            <div class='sub'>
                                {{ $t('trade.buy') }}
                            </div><div class='name'>
                                0.01 {{ $t('trade.volumeUnit') }}
                            </div>
                        </div>
                        <div class='col'>
                            <div class='sub'>
                                {{ $t('trade.positionPrice') }}
                            </div>
                            <div class='name'>
                                --
                            </div>
                        </div>
                        <div class='col'>
                            <div class='sub'>
                                {{ $t('trade.currentPrice') }}
                            </div><div class='name riseColor'>
                                --
                            </div>
                        </div>
                    </div><div class='item item-2 van-hairline--bottom'>
                        <div class='col'>
                            <div class='sub'>
                                {{ $t('trade.stopLossPrice') }}
                            </div><div class='name'>
                                <span class='number'>
                                    --
                                </span>
                            </div>
                        </div><div class='col'>
                            <div class='sub'>
                                {{ $t('trade.stopProfitPrice') }}
                            </div><div class='name'>
                                <span class='number'>
                                    --
                                </span>
                            </div>
                        </div>
                    </div>
                </div><div class='layout layout-3'>
                    <div class='item van-hairline--bottom'>
                        <div class='left'>
                            <div class='title'>
                                {{ $t('trade.openTime') }}
                            </div>
                        </div><div class='right'>
                            --
                        </div>
                    </div><div class='item'>
                        <div class='left'>
                            <div class='title'>
                                {{ $t('trade.positionId') }}
                            </div>
                        </div><div class='right'>
                            ID : {{ positionId }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- :positionData='activeOrder' -->
    <DialogSLTP
        :direction='1'
        :is-position='true'
        :show='showSetProfit'
        @submit='setProfitSuccess'
        @update:show='updateShow'
    />
</template>

<script>
import DialogSLTP from '@c/components/dialogSLTP'
import { reactive, toRefs, computed } from 'vue'
import { useRoute } from 'vue-router'
import { isEmpty } from '@/utils/util'
import { useStore } from 'vuex'
import dayjs from 'dayjs'
import { QuoteSocket } from '@/plugins/socket/socket'
export default {
    components: { DialogSLTP },

    setup (props) {
        const store = useStore()
        const route = useRoute()
        const state = reactive({
            showSetProfit: false
        })

        const orderId = route.query.orderId
        const positionId = route.query.positionId
        const symbolId = route.query.symbolId
        const customerInfo = computed(() => store.state._user.customerInfo)
        // 持仓产品
        const positionData = computed(() => store.state._trade.positionMap[positionId])
        const product = computed(() => store.state._quote.productMap[symbolId])

        QuoteSocket.send_subscribe([symbolId])

        const setProfitSuccess = () => {

        }
        const updateShow = (val) => {
            state.showSetProfit = val
        }

        const formatTime = (val) => {
            return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
        }
        return {
            ...toRefs(state),
            setProfitSuccess,
            updateShow,
            product,
            positionData,
            orderId,
            formatTime,
            customerInfo,
            positionId
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    position: relative;
    height: 100%;
    padding-top: 1.2rem;
    font-size: 0.37333rem;
    background: var(--bgColor2);
    .m-orderInfo {
        padding: rem(20px) rem(20px) rem(7px) rem(20px);
        .layout {
            margin-bottom: rem(20px);
            background-color: #FFF;
            border-radius: 10px;
            .item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: rem(32px) rem(30px);
                &.item-1 {
                    padding-bottom: 0;
                }
            }
        }
        ::v-deep {
            .van-button {
                border-radius: rem(6px);
                &__text {
                    color: #477FD3;
                }
                &--mini {
                    width: rem(124px);
                    height: rem(48px);
                    font-size: rem(24px);
                    line-height: rem(48px);
                }
            }
        }
        .layout-1 {
            .item-2 {
                .col {
                    .name {
                        margin-bottom: rem(4px);
                        &.riseColor {
                            color: var(--fallColor);
                        }
                        &.fallColor {
                            color: var(--success);
                        }
                        .number {
                            color: var(--btnText2);
                        }
                    }
                    &:last-child {
                        text-align: right;
                    }
                }
            }
            .name {
                color: #333;
                font-size: rem(28px);
            }
            .code {
                color: #999;
                font-size: rem(20px);
            }
            .sub {
                color: #999;
                font-size: rem(24px);
                &.riseColor {
                    color: var(--fallColor);
                }
                &.fallColor {
                    color: var(--success);
                }
            }
            .active {
                color: #333;
                font-size: rem(28px);
            }
        }
        .layout-3 {
            font-size: rem(28px);
            .left {
                color: #999;
                .title {
                    display: inline-block;
                    margin-right: rem(20px);
                }
                i {
                    position: relative;
                    top: rem(6px);
                    font-size: rem(30px);
                }
            }
            .right {
                text-align: right;
            }
        }
    }
    .submitBox {
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 2;
        display: flex;
        width: 100%;
        .van-button {
            flex: 1;
            height: rem(90px);
            font-size: rem(30px);
            border: none;
            border-radius: 0;
        }
    }
}

</style>

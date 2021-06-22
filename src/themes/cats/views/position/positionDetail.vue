<template>
    <div class='page-wrap'>
        <LayoutTop :back='true' :menu='false' title='持仓明细' />
        <div class='main'>
            <div class='m-orderInfo'>
                <div class='layout layout-1'>
                    <div class='item item-1'>
                        <div class='left'>
                            <div class='name'>
                                BTC/USDT_100倍
                            </div>
                            <div class='code'>
                                BTCUSDT x100
                            </div>
                        </div>
                    </div>
                    <div class='item item-2'>
                        <div class='col'>
                            <div class='sub'>
                                净盈亏(USD)
                            </div><div class='name riseColor'>
                                +12.00
                            </div>
                        </div><div class='col'>
                            <div class='sub'>
                                盈亏(USD)
                            </div><div class='name riseColor'>
                                +17.91
                            </div>
                        </div><div class='col'>
                            <div class='sub'>
                                利息(USD)
                            </div><div class='name'>
                                -5.91
                            </div>
                        </div><div class='col'>
                            <div class='sub'>
                                手续费(USD)
                            </div><div class='name'>
                                0.00
                            </div>
                        </div>
                    </div>
                </div><div class='layout layout-1'>
                    <div class='item item-2 van-hairline--bottom'>
                        <div class='col'>
                            <div class='sub fallColor'>
                                卖出
                            </div><div class='name'>
                                0.01手
                            </div>
                        </div><div class='col'>
                            <div class='sub'>
                                开仓价
                            </div><div class='name'>
                                37308.8
                            </div>
                        </div><div class='col'>
                            <div class='sub'>
                                当前价
                            </div><div class='name riseColor'>
                                35518.2
                            </div>
                        </div>
                    </div><div class='item item-2 van-hairline--bottom'>
                        <div class='col'>
                            <div class='sub'>
                                止损价
                            </div><div class='name'>
                                <span class='number'>
                                    未设置
                                </span>
                            </div>
                        </div><div class='col'>
                            <div class='sub'>
                                止盈价
                            </div><div class='name'>
                                <span class='number'>
                                    未设置
                                </span>
                            </div>
                        </div>
                    </div>
                </div><div class='layout layout-3'>
                    <div class='item van-hairline--bottom'>
                        <div class='left'>
                            <div class='title'>
                                开仓时间
                            </div>
                        </div><div class='right'>
                            2021/06/03 10:56:21
                        </div>
                    </div><div class='item'>
                        <div class='left'>
                            <div class='title'>
                                持仓号
                            </div>
                        </div><div class='right'>
                            ID : 6393504
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class='submitBox'>
            <van-button plain size='normal' type='default' @click='showSetProfit = true'>
                止盈止损
            </van-button>
            <van-button size='normal' type='primary'>
                平仓
            </van-button>
        </div>
    </div>
    <!-- :product='activeOrder' -->
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
import { reactive, toRefs } from 'vue'
export default {
    components: { DialogSLTP },

    setup (props) {
        const state = reactive({
            showSetProfit: false
        })

        const setProfitSuccess = () => {

        }
        const updateShow = (val) => {
            state.showSetProfit = val
        }
        return {
            ...toRefs(state),
            setProfitSuccess,
            updateShow
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

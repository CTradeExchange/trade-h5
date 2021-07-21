<template>
    <div class='page-wrap'>
        <LayoutTop :back='true' :menu='false' :title='$t("trade.trustDetail")' />
        <div class='trust-detail'>
            <div class='layout layout-1'>
                <div class='item item-1'>
                    <div class='left'>
                        <div class='name'>
                            VET/USDT
                        </div>
                        <div class='code'>
                            VETUSDT
                        </div>
                    </div>
                </div><div class='item item-2'>
                    <div class='col'>
                        <div class='sub riseColor'>
                            {{ $t('trade.buy') }}
                        </div>
                        <div class='name'>
                            0.01 BTC
                        </div>
                    </div><div class='col'>
                        <div class='sub'>
                            {{ $t('trade.pendingPrice') }}
                        </div>
                        <div class='name'>
                            0.066810
                        </div>
                    </div><div class='col'>
                        <div class='sub'>
                            {{ $t('trade.currentPrice') }}
                        </div>
                        <div class='name fallColor'>
                            0.066940
                        </div>
                    </div>
                </div><div class='item item-2 van-hairline--bottom'>
                    <div class='col'>
                        <div class='sub'>
                            {{ $t('trade.loan') }}
                        </div>
                        <div class='name'>
                            <span class='number'>
                                10000.00 USDT
                            </span>
                        </div>
                    </div><div class='col'>
                        <div class='sub' @click='showInfo'>
                            <van-icon name='question-o' />
                            <span>{{ $t('trade.swap_2') }} </span>
                        </div>
                        <div class='name'>
                            <span class='number'>
                                10.000 USDT
                            </span>
                        </div>
                    </div>
                </div>
            </div><div class='layout layout-3'>
                <div class='item van-hairline--bottom'>
                    <div class='left'>
                        <div class='title'>
                            {{ $t('trade.expireTime') }}
                        </div>
                    </div>
                    <div class='right'>
                        48小时有效
                    </div>
                </div>
                <div class='item van-hairline--bottom'>
                    <div class='left'>
                        <div class='title'>
                            {{ $t('trade.pendingTime') }}
                        </div>
                    </div>
                    <div class='right'>
                        2021/07/19 15:21:19
                    </div>
                </div><div class='item'>
                    <div class='left'>
                        <div class='title'>
                            {{ $t('trade.positionId') }}
                        </div>
                    </div>
                    <div class='right'>
                        ID : 654543456
                    </div>
                </div>
            </div>
        </div>
        <div class='submitBox'>
            <van-button size='normal' type='primary' @click='showCancelOrderTip = true'>
                {{ $t('trade.cancelOrder') }}
            </van-button>
        </div>
    </div>
</template>

<script>
import { Toast, Dialog } from 'vant'
export default {
    setup (props) {
        const showInfo = () => {
            Dialog.alert({
                title: '说明',
                message: '利息=借款金额*（日利息/24）*借款小时数不满1小时按1小时计算',
            }).then(() => {
                // on close
            })
        }

        return {
            showInfo
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    padding-top: rem(100px);
    .trust-detail {
        padding: rem(20px) rem(20px) rem(7px) rem(20px);
        .layout {
            margin-bottom: rem(20px);
            background-color: var(--contentColor);
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
        :deep(.van-button) {
            border-radius: rem(6px);
        }
        :deep(.van-button__text) {
            color: var(--primary);
        }
        :deep(.van-button__mini) {
            width: rem(124px);
            height: rem(48px);
            font-size: rem(24px);
            line-height: rem(48px);
        }
        .layout-1 {
            .item-2 {
                .col {
                    .name {
                        margin-bottom: rem(4px);
                        font-weight: bold;
                        &.riseColor {
                            color: var(--fallColor);
                        }
                        &.fallColor {
                            color: var(--riseColor);
                        }
                        .number {
                            color: var(--color);
                            font-weight: bold;
                        }
                    }
                    &:last-child {
                        text-align: right;
                    }
                }
            }
            .name {
                color: var(--color);
                font-size: rem(28px);
            }
            .code {
                color: var(--minorColor);
                font-size: rem(20px);
            }
            .sub {
                color: var(--minorColor);
                span {
                    vertical-align: middle;
                }
                .van-icon {
                    margin-right: rem(6px);
                    vertical-align: middle;
                }
                &.riseColor {
                    color: var(--fallColor);
                }
                &.fallColor {
                    color: var(--riseColor);
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
                color: var(--color);
                text-align: right;
                font-weight: bold;
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
            &.van-button--default {
                color: var(--primary);
                background: var(--contentColor);
            }
        }
    }
}

</style>

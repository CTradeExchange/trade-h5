<template>
    <div class='trust-item'>
        <div class='t-header'>
            <span class='product-name'>
                BTC/USDT
            </span>
            <span class='direction'>
                买入 1 BTC
            </span>
        </div>
        <div class='t-body'>
            <div class='t-left'>
                <p class='tl-item'>
                    <label for=''>
                        挂单价
                    </label>
                    <span>32863.00</span>
                </p>
                <p class='tl-item'>
                    <label for=''>
                        当前价
                    </label>
                    <span>32863.00</span>
                </p>
                <p class='tl-item'>
                    <label for=''>
                        借款
                    </label>
                    <span>328458.000000USDT</span>
                </p>
                <p class='tl-item'>
                    <label for=''>
                        利息
                    </label>
                    <span>12.55488USDT</span>
                </p>
            </div>
            <div class='t-right'>
                <van-button>撤单</van-button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.trust-item {
    padding: rem(30px);
    background-color: var(--contentColor);
    border-bottom: solid 1px var(--lineColor);
    border-radius: rem(8px);
    .t-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: rem(30px);
        .product-name {
            color: var(--color);
            font-size: rem(30px);
        }
        .direction {
            font-size: rem(24px);
        }
    }
    .t-body {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .t-left {
            .tl-item {
                margin-bottom: rem(10px);
                color: var(--normalColor);
                font-size: rem(24px);
                text-align: left;
                label {
                    display: inline-block;
                    width: rem(80px);
                }
                span {
                    text-align: left;
                }
            }
        }
        .t-right {
            .van-button {
                width: rem(124px);
                height: rem(48px);
                color: var(--primary);
                font-size: rem(24px);
                line-height: rem(48px);
                background: var(--primaryAssistColor);
                border-color: var(--primaryAssistColor);
                border-radius: rem(6px);
            }
        }
    }
}
</style>

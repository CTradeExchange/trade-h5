<template>
    <div class='pending'>
        <top />
        <div class='pending-wrap'>
            <p>
                <span v-if='data.orderId'>
                    #{{ data.orderId }}&nbsp;
                </span>
                <template v-if='data.bizType===2'>
                    <!-- 平仓 -->
                    <span :class="data.openDirection === 1 ? 'fallColor' : 'riseColor'">
                        <!-- {{ data.openDirection === 1 ? 'sell' : 'buy' }} -->

                        {{ data.tradeVolume }}
                    </span>
                    平仓
                </template>
                <template v-else>
                    <!-- 开仓、挂单 -->
                    <span :class="data.direction === 1 ? 'riseColor' : 'fallColor'">
                        {{ data.direction === 1 ? 'buy' : 'sell' }}

                        {{ data.tradeVolume }}
                    </span>
                </template>
            </p>
            <p>
                {{ data.symbolName }} at
                <span v-if='Number(data.bizType) === 10 || Number(data.bizType) === 11' class='price'>
                    {{ formatPrice(data.requestPrice, data.digits ) }}
                </span>
                <span v-else class='price'>
                    {{ formatPrice(data.executePrice, data.digits) }}
                </span>
            </p>
            <p>
                s/l: {{ data.stopLoss ? formatPrice(data.stopLoss, data.digits) : '--' }}&nbsp;&nbsp;&nbsp;t/p: {{ data.takeProfit ? formatPrice(data.takeProfit, data.digits) : '--' }}
            </p>
            <p>
                成功
            </p>
        </div>
        <div class='footerBtn of-1px-top'>
            <button class='btn' @click='$router.back()'>
                完成
            </button>
        </div>
    </div>
</template>

<script>
import top from '@m/layout/top'
import { priceFormat } from '@/utils/util'
export default {
    components: {
        top,
    },
    props: ['data'],
    setup (props) {
        const formatPrice = (price, digits) => {
            return priceFormat(price, digits)
        }

        return {
            formatPrice
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.pending {
    position: relative;
    height: 100%;
    .pending-wrap {
        padding-top: rem(100px);
        color: #4B4B52;
        font-weight: bold;
        font-size: rem(48px);
        letter-spacing: -1px;
        text-align: center;
        p {
            margin-bottom: rem(20px);
        }
        .direction {
            color: #007AFF;
        }
        .price {
            color: #000;
        }
    }
}
.iconMain {
    padding-top: rem(50px);
}
.icon_chenggong {
    display: block;
    width: rem(200px);
    margin: 0 auto;
    color: var(--success);
    font-size: rem(200px);
    opacity: 0.8;
}
.title {
    padding-top: rem(30px);
    font-size: rem(50px);
    text-align: center;
}
.desc {
    padding-top: rem(30px);
    color: var(--mutedColor);
    font-size: rem(30px);
    line-height: 1.5;
    text-align: center;
}
.footerBtn {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    .btn {
        @include active();
        width: 100%;
        height: rem(100px);
        color: var(--color);
        font-size: rem(28px);
        text-align: center;
        background: var(--bgColor);
    }
}
</style>

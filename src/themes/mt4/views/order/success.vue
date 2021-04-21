<template>
    <div class='pending'>
        <top />
        <div class='pending-wrap'>
            <p>
                #{{ data.orderId }}
                <span class='direction'>
                    {{ data.direction === 1 ? 'BUY' : 'SELL' }}
                    {{ data.tradeVolume }}
                </span>
            </p>
            <p>
                at <span class='price'>
                    {{ data.executePrice }}
                </span>
            </p>
            <p>
                成功
            </p>
        </div>
        <div class='footerBtn of-1px-top'>
            <button class='btn' @click='$router.replace("/quote")'>
                完成
            </button>
        </div>
    </div>
</template>

<script>
import top from '@m/layout/top'
export default {
    components: {
        top,
    },
    props: ['data']
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.pending {
    position: relative;
    height: 100%;
    .pending-wrap {
        padding-top: rem(50px);
        color: #4B4B52;
        font-weight: bold;
        font-size: rem(48px);
        text-align: center;
        p {
            margin-bottom: rem(10px);
        }
        .direction {
            color: #007AFF;
        }
        .price {
            color: var(--color);
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

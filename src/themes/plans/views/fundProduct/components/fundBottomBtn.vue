<template>
    <div class='footerBtnBox'>
        <div v-if='fund' class='trade-btn-wrap'>
            <div class='buy fallColorBg' :class='{ disabled:fund.canPurchase!==1 }' @click="toOrder('buy')">
                <span class='text'>
                    {{ $t('fundInfo.buy') }}
                </span>
            </div>
            <div class='sell riseColorBg' :class='{ disabled:fund.canRedemption!==1 }' @click="toOrder('sell')">
                <span class='text'>
                    {{ $t('fundInfo.sell') }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()
const { fundId } = route.query
const props = defineProps({
    fund: Object
})

const toOrder = direction => {
    if (direction === 'buy' && props.fund.canPurchase !== 1) {
        return false
    } else if (direction === 'sell' && props.fund.canRedemption !== 1) {
        return false
    }
    router.push({
        name: direction === 'buy' ? 'FundApply' : 'FundRedeem',
        query: { direction, fundId }
    })
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
// 底部按钮
.footerBtnBox {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 1000;
    display: flex;
    width: 100%;
    //height: rem(100px);
    text-align: center;
    background: var(--contentColor);
    .trade-btn-wrap {
        position: relative;
        display: flex;
        flex: 1;
        flex-direction: row;
        flex-wrap: nowrap;
        padding: rem(20px);
        white-space: nowrap;
        font-weight: bold;
        .buy {
            margin-right: rem(20px);
        }
    }
    .sell,
    .buy {
        @include active();
        position: relative;
        flex: 1;
        color: #fff;
        line-height: rem(100px);
        background-color: #858c9a;
        border-radius: 3px;
        &.fallColorBg {
            background-color: var(--riseColor);
        }
        &.riseColorBg {
            background-color: var(--fallColor);
        }
        &.disabled{
            opacity: .5;
        }
        .text {
            font-size: rem(34px);
            vertical-align: middle;
        }
    }
    .sell::after {
        position: absolute;
        top: 0;
        right: 0;
        width: 1px;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.15);
        content: '';
    }
    .text {
        font-size: rem(28px);
        vertical-align: middle;
    }
}
</style>

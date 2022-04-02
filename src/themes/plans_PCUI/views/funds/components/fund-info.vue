<template>
    <div class='fund-info'>
        <div class='info-header'>
            <currency-icon :currency='fund.shareTokenCode' size='72px' />
            <div class='text'>
                <span class='tag'>
                    {{ fund.fundType }}
                </span>
                <span class='name'>
                    {{ fund.shareTokenCode }}
                </span>
            </div>
        </div>
        <h3 class='info-slogan'>
            Invest in the top 10 cryptocurrencies
        </h3>
        <p class='info-introduction'>
            {{ fund.introduction }}
        </p>
        <div class='info-block'>
            <div class='info-row'>
                <div class='col'>
                    <span>{{ $t('fundInfo.realtimeJZ') }}</span>
                    <strong>{{ fund.netValue }}</strong>
                </div>
                <div class='col'>
                    <span>{{ $t('trade.offer') }}</span>
                    <strong>{{ fund.marketPrice }}</strong>
                </div>
            </div>
            <div class='info-row'>
                <div class='col'>
                    <span>{{ $t('funds.fundShare') }}</span>
                    <strong>{{ fund.newShare }}</strong>
                </div>
                <div class='col'>
                    <span>{{ $t('fundInfo.fundCreateTime') }}</span>
                    <strong>{{ fund.upDate }}</strong>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'
import currencyIcon from '@/components/currencyIcon.vue'

defineProps({
    // 当前基金
    fund: {
        type: Object,
        default: () => {}
    }
})
</script>

<style lang='scss' scoped>
.fund-info {
    .info-header {
        display: flex;
        align-items: center;
        padding: 10px 0;
        .text {
            display: inline-flex;
            flex-direction: column;
            padding-left: 20px;
            .tag {
                font-size: 14px;
                font-weight: 300;
                color: #676767;
            }
            .name {
                letter-spacing: .15px;
                font-size: 24px;
                font-weight: 700;
                color: #000;
            }
        }
    }
    .info-slogan {
        margin: 16px 0;
        line-height: 48px;
        font-size: 40px;
        font-weight: 700;
        color: #000;
    }
    .info-introduction {
        line-height: 28px;
        font-size: 20px;
        font-weight: 400;
        color: #676767;
    }
    .info-block {
        margin-top: 32px;
    }
    .info-row {
        display: flex;
        justify-content: space-between;
        .col {
            display: inline-flex;
            flex-direction: column;
            margin-right: 16px;
            margin-bottom: 16px;
            span {
                letter-spacing: 1px;
                font-size: 14px;
                font-weight: 300;
                color: #676767;
            }
            strong {
                font-size: 28px;
                font-weight: 700;
                color: #000;
            }
            &:last-of-type {
                text-align: right;
            }
        }
    }
}
</style>

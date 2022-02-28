<template>
    <div class='fund-info width-limit'>
        <div class='header'>
            <CurrencyIcon :currency='fund.shareTokenCode' size='100' />
            <span class='name'>
                {{ fund.fundName }}
            </span>
            <span class='type'>
                {{ fund.operationMode === 1 ? $t('fundInfo.operationModeValue1') : $t('fundInfo.operationModeValue2') }}
            </span>
            <span v-if='fund.fundType' class='title'>
                {{ fund.fundType }}
            </span>
        </div>
        <p class='desc'>
            {{ fund.introduction }}
        </p>
        <ul class='valueList'>
            <li class='item'>
                <p class='muted'>
                    {{ $t('fundInfo.realtimeJZ') }}({{ fund.currency }})
                </p>
                <p>
                    <span>{{ fund.netValue }}</span>
                </p>
                <p>
                    <span>
                        {{ fund.netValueChangeQuote }}
                    </span>
                    <i class='hours24' :class="[parseFloat(fund.netValueChangeQuote) < 0 ? 'down' : 'up']">
                        24H
                    </i>
                </p>
            </li>
            <li class='item'>
                <p class='muted'>
                    {{ $t('fundInfo.marketPrice') }}({{ fund.currency }})
                </p>
                <p>
                    <span>{{ fund.marketPrice }}</span>
                </p>
                <p>
                    <span>
                        {{ fund.marketPriceChangeQuote }}
                    </span>
                    <i class='hours24' :class="[parseFloat(fund.marketPriceChangeQuote) < 0 ? 'down':'up']">
                        24H
                    </i>
                </p>
            </li>
            <li class='item'>
                <p class='muted'>
                    {{ $t('fundInfo.totalMarketValue') }}({{ fund.currency }})
                </p>
                <p>
                    <span>{{ fund.totalBalance }}</span>
                </p>
            </li>
            <li class='item'>
                <p class='muted'>
                    {{ $t('fundInfo.latestPart') }}
                </p>
                <p>
                    <span>{{ fund.latestShare }}</span>
                </p>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'
import CurrencyIcon from '@/components/currencyIcon.vue'

defineProps({
    fund: {
        type: Object,
        default: () => {}
    }
})
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.fund-info {
    .header {
        display: flex;
        align-items: center;
        .name {
            margin-left: 25px;
            margin-right: 20px;
            font-size: 45px;
        }
        .type, .title {
            font-size: 18px;
            color: var(--normalColor);
        }
        .type {
            margin-right: 10px;
        }
    }
    .desc {
        margin-top: 20px;
        line-height: 26px;
        font-size: 18px;
        color: var(--normalColor);
        word-wrap: break-word;
    }
    .valueList{
        display: flex;
        margin-top: 30px;
        .item {
            position: relative;
            border-radius: rem(10px);
            flex: 1;
            line-height: 1.6;
            font-size: 16px;
            .hours24 {
                position: relative;
                margin-left: 5px;
                background: var(--placeholdColor);
                font-size: 14px;
                padding:0 rem(26px) 0 rem(6px);
                border-radius: rem(6px);
                color: var(--color);
                vertical-align: middle;
                &::after{
                    content: '';
                    position: absolute;
                    right: 0px;
                    top: 5px;
                    width: 0;
                    height: 0;
                    border: 8px solid var(--normalColor);
                    border-radius: 2px;
                    border-width: 5px 5px 0 5px;
                    border-color: var(--normalColor) transparent transparent transparent;
                }
                &.up{
                    color: var(--riseColor);
                    background: var(--quoteFallBg);
                }
                &.up::after{
                    border-width: 0 5px 5px 5px;
                    border-color: transparent transparent var(--riseColor)  transparent;
                }
                &.down{
                    color: var(--fallColor);
                    background: var(--quoteRiseBg);
                }
                &.down::after{
                    border-width: 5px 5px 0 5px;
                    border-color: var(--fallColor) transparent transparent transparent;
                }
            }
        }
        .mleft5{
            margin-left: 5px;
        }
    }
}
</style>

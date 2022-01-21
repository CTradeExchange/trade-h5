<template>
    <section class='fundCard'>
        <figure class='figureImg'>
            <CurrencyIcon class='currencyImg' :currency='fund.shareTokenCode' size='50' />
            <h2 class='fundCurrency'>
                {{ fund.fundName }}
            </h2>
        </figure>
        <div class='fundType'>
            <span class='title'>
                {{ fund.fundType }}
            </span>
            <span class='operation'>
                {{ fund.operationMode ? $t('fundInfo.operationModeValue1') : $t('fundInfo.operationModeValue2') }}
            </span>
        </div>
        <div class='desc'>
            {{ fund.introduction }}
        </div>
        <ul class='valueList'>
            <li class='item'>
                <p class='muted'>
                    {{ $t('fundInfo.realtimeJZ') }}({{ fund.currency }})
                </p>
                <p>
                    <span>{{ fund.netValue }}</span>
                    <span class='mleft5'>
                        {{ fund.netValueChangeQuote }}
                    </span>
                </p>
            </li>
            <li class='item'>
                <p class='muted'>
                    {{ $t('fundInfo.marketPrice') }}({{ fund.currency }})
                </p>
                <p>
                    <span>{{ fund.marketPrice }}</span>
                    <span class='mleft5'>
                        {{ fund.marketPriceChangeQuote }}
                    </span>
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
    </section>
</template>

<script setup>
import { defineProps } from 'vue'
import CurrencyIcon from '@/components/currencyIcon.vue'
defineProps({
    fund: Object
})
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.fundCard{
    background: var(--contentColor);
    padding: rem(30px);
    margin: rem(80px) rem(30px) rem(30px) rem(30px);
    border-radius: rem(15px);
    position: relative;
}
.figureImg{
    position: relative;
    padding-top: 10px;
    .currencyImg{
        position: absolute;
        top: -40px;
        left: 50%;
        margin-left: -25px;
    }
    .fundCurrency{
        margin-top: rem(20px);
        text-align: center;
        font-size: rem(40px);
    }
}
.fundType{
    margin-top: rem(78px);
    .title{
        font-size: rem(32px);
        font-weight: bold;
    }
    .operation{
        display: inline-block;
        margin-left: rem(20px);
        border-left: 1px solid var(--minorColor);
        color: var(--minorColor);
        padding-left: rem(20px);
        line-height: 1;
    }
}
.desc{
    margin-top: 5px;
    line-height: 1.4;
    font-size: rem(28px);
}
.valueList{
    background: var(--contentColor);
    margin-top: rem(30px);
    border-top: 1px solid var(--assistColor);
    padding-top: rem(30px);
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-row-gap: rem(20px);
    grid-column-gap: rem(20px);
    .item{
        background: var(--bgColor);
        border-radius: rem(10px);
        padding: rem(15px) rem(20px);
        line-height: 1.5;
    }
    .mleft5{
        margin-left: 5px;
    }
}
</style>

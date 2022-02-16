<template>
    <div class='fundApplyRecordItem' @click='full=true'>
        <p class='title'>
            {{ $t('fundInfo.buy') }}  {{ data.fundName }}
        </p>
        <ul class='infos' :class='{ "full": full || index===0 }'>
            <li class='item'>
                <span class='label'>
                    {{ $t('fundInfo.applyAmount') }}({{ data.currencyPay }})
                </span>
                <span>{{ data.amountPay }}</span>
            </li>
            <li class='item'>
                <span class='label'>
                    {{ $t('fundInfo.realtimeJZ') }}({{ data.currencyNet }})
                </span>
                <span>{{ data.sharesNet }}</span>
            </li>
            <li class='item'>
                <span class='label'>
                    {{ $t('fundInfo.applyFees') }}({{ data.currencyPay }})
                </span>
                <span>{{ data.fees }}</span>
            </li>
            <li class='item'>
                <span class='label'>
                    {{ $t('fundInfo.applyShares') }}({{ data.currencyShares }})
                </span>
                <span>{{ data.shares }}</span>
            </li>
            <li class='item'>
                <span class='label'>
                    {{ $t('fundInfo.shareCurrency') }}
                </span>
                <span>{{ data.currencyShares }}</span>
            </li>
            <li class='item'>
                <span class='label'>
                    {{ $t('fundInfo.sureSharesStatus') }}
                </span>
                <span>{{ data.sharesStatus===1?$t("fundInfo.confirmed"):$t("fundInfo.willConfirmed") }}</span>
            </li>
            <li class='item'>
                <span class='label'>
                    {{ formatTime(data.createTime) }}
                </span>
            </li>
            <li class='item'>
                <span class='label'>
                    {{ data.proposalNo }}
                </span>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { defineProps, ref } from 'vue'

defineProps({
    data: Object,
    index: Number,
})
const full = ref(false)

</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.fundApplyRecordItem{
    padding: rem(10px) rem(30px);
    margin-bottom: rem(20px);
    background: var(--contentColor);
    .title{
        font-size: rem(28px);
        line-height: 2;
    }
    .infos{
        position: relative;
        line-height: rem(42px);
        display: grid;
        grid-column-gap: rem(20px);
        grid-template-columns: 1fr;
        font-size: rem(24px);
        height: 7em;
        overflow: hidden;
        &::before{
            content: "";
            position: absolute;
            bottom: 0;
            left: 47%;
            width: 0;
            height: 0;
            border: 5px solid var(--placeholdColor);
            border-color: var(--placeholdColor) transparent transparent transparent;
            border-bottom: 0;
        }
        &.full{
            height: auto;
            &::before{
                display: none;
            }
        }
        .item{
            display: flex;
            justify-content: space-between;
        }
        .label{
            color: var(--minorColor);
        }
    }
}
</style>

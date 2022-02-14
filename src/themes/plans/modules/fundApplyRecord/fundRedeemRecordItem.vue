<template>
    <div class='fundApplyRecordItem'>
        <p class='title'>
            {{ $t('fundInfo.sell') }}  {{ data.fundName }}
        </p>
        <ul class='infos'>
            <li class='item'>
                <span class='label'>
                    {{ $t('fundInfo.redeemShares') }}({{ data.currencyShares }})
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
                <span>{{ data.sharesStatus===1 ? $t("fundInfo.confirmed") : $t("fundInfo.willConfirmed") }}</span>
            </li>
            <li class='item'>
                <span class='label'></span>
                <span></span>
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
import { defineProps } from 'vue'

defineProps({
    data: Object
})
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.fundApplyRecordItem{
    padding: rem(10px) 0;
    .title{
        font-size: rem(28px);
        line-height: 2;
    }
    .infos{
        line-height: rem(42px);
        display: grid;
        grid-column-gap: rem(20px);
        grid-template-columns: 1fr 1fr;
        font-size: rem(24px);
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

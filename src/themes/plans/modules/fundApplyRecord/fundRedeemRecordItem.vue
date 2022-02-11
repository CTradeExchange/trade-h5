<template>
    <div class='fundApplyRecordItem'>
        <p class='title'>
            赎回  {{ data.fundName }}
        </p>
        <ul class='infos'>
            <li class='item'>
                <span class='label'>
                    赎回份额({{ data.currencyShares }})
                </span>
                <span>{{ data.amountRedeem }}</span>
            </li>
            <li class='item'>
                <span class='label'>
                    份额代币
                </span>
                <span>{{ data.currencyShares }}</span>
            </li>
            <li class='item'>
                <span class='label'>
                    份额确认状态
                </span>
                <span>{{ data.sharesStatus===1?'已确认':'待确认' }}</span>
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

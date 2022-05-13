<template>
    <div class='fundApplyRecordItem' @click='full=true'>
        <p class='title'>
            {{ $t('fundInfo.sell') }}  {{ data.fundName }}
        </p>
        <ul class='infos' :class='{ "full": full || index===0 }'>
            <li class='item'>
                <span class='label'>
                    {{ $t('fundInfo.redeemShares') }}({{ data.currencyShares }})
                </span>
                <span>{{ data.shares }}</span>
            </li>
            <li class='item'>
                <span class='label'>
                    {{ $t('fundInfo.realtimeJZ') }}({{ data.currencyNet }})
                </span>
                <span>{{ data.sharesNet }}</span>
            </li>
            <li class='item'>
                <span class='label'>
                    {{ $t('fundInfo.redeemFees') }}({{ data.currencyRedeem }})
                </span>
                <span v-if="data.currencyRedeem === 'self'" class='href' @click='showDetail(data.proposalNo)'>
                    {{ $t('common.look') }}
                </span>
                <span v-else>
                    {{ data.fees }}
                </span>
            </li>
            <li class='item'>
                <span class='label'>
                    {{ $t('fundInfo.redeemAmount') }}({{ data.currencyRedeem }})
                </span>
                <span v-if="data.currencyRedeem === 'self'" class='href' @click='showDetail(data)'>
                    {{ $t('common.look') }}
                </span>
                <span v-else>
                    {{ data.amountRedeem }}
                </span>
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
                <span class='label'>
                    {{ $t('fundInfo.confirmTime') }}
                </span>
                <span>{{ formatTime(data.updateTime) }}</span>
            </li>
            <li class='item'>
                <span class='label'>
                    {{ $t('trade.pendingNo') }}
                </span>
                <span>{{ data.proposalNo }}</span>
            </li>
        </ul>
    </div>
    <van-dialog v-model:show='show' title='申购金额'>
        <div class='info-wrap'>
            <p class='info-item header'>
                <span>赎回资产</span>
                <span>手续费</span>
            </p>
            <p v-for='item in showInfo' :key='item.currency' class='info-item'>
                <span>{{ item.amount }} {{ item.currency }}</span>
                <span>{{ item.fees }} {{ item.currency }}</span>
            </p>
        </div>
    </van-dialog>
</template>

<script setup>
import { defineProps, ref, defineEmits } from 'vue'

defineProps({
    data: Object,
    index: Number,
    showInfo: Array
})
const emit = defineEmits(['showDetail'])
const show = ref(false)
const showDetail = (item) => {
    emit('showDetail')
    show.value = true
}
const full = ref(false)
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.fundApplyRecordItem {
    margin-bottom: rem(20px);
    padding: rem(10px) rem(30px);
    background: var(--contentColor);
    .title {
        font-size: rem(28px);
        line-height: 2;
    }
    .infos {
        position: relative;
        display: grid;
        grid-column-gap: rem(20px);
        grid-template-columns: 1fr;
        height: 7em;
        overflow: hidden;
        font-size: rem(24px);
        line-height: rem(42px);
        &::before {
            position: absolute;
            bottom: 0;
            left: 47%;
            width: 0;
            height: 0;
            border: 5px solid var(--placeholdColor);
            border-color: var(--placeholdColor) transparent transparent transparent;
            border-bottom: 0;
            content: '';
        }
        &.full {
            height: auto;
            &::before {
                display: none;
            }
        }
        .item {
            display: flex;
            justify-content: space-between;
        }
        .label {
            color: var(--minorColor);
        }
        .href {
            color: var(--primary);
        }
    }
}
.info-wrap {
    padding: rem(30px) rem(60px);
    .info-item {
        display: flex;
        justify-content: space-between;
        margin-top: rem(20px);
        span {
            color: var(--normalColor);
            font-size: rem(24px);
        }
        &.header {
            span {
                color: var(--minorColor);
                font-weight: bold;
            }
        }
    }
}
</style>

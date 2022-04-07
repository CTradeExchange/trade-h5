<template>
    <div class='fund-deal'>
        <!-- 选项卡 -->
        <div class='deal-tabs'>
            <div class='group'>
                <div :class="['item', { 'active': activeName === 'apply' }]" @click="switchTab('apply')">
                    <img src='../../../images/deal-icon1.png' />
                    <span>{{ $t('fundInfo.buy') }}</span>
                </div>
                <div :class="['item', { 'active': activeName === 'redeem' }]" @click="switchTab('redeem')">
                    <img src='../../../images/deal-icon2.png' />
                    <span>{{ $t('fundInfo.sell') }}</span>
                </div>
            </div>
            <div class='group'>
                <div :class="['item', { 'active': activeName === 'trade' }]" @click="switchTab('trade')">
                    <img src='../../../images/deal-icon3.png' />
                    <span>{{ $t('funds.cashDeal') }}</span>
                </div>
            </div>
        </div>
        <div class='deal-case'>
            <fundApply v-if="activeName === 'apply'" :fund='fund' />
            <fundRedeem v-if="activeName === 'redeem'" :fund='fund' />
            <spot-trade v-if="activeName === 'trade'" />
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, inject } from 'vue'
import fundApply from './fund-apply.vue'
import fundRedeem from './fund-redeem.vue'
import spotTrade from './spot-trade.vue'

defineProps({
    fund: {
        type: Object,
        default: () => {}
    }
})
const dealAcitve = inject('dealAcitve')

// 当前选择选项卡 apply:申购 redeem:赎回 trade:现货买卖
const activeName = ref(dealAcitve.value || 'apply')

// 切换选项卡
const switchTab = value => {
    if (activeName.value !== value) {
        activeName.value = value
    }
}
</script>

<style lang='scss' scoped>
.deal-tabs {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    .item {
        display: inline-flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 72px;
        height: 72px;
        line-height: 1;
        margin-right: 16px;
        color: var(--mainColor);
        background: var(--contentColor);
        border-radius: 15px;
        box-shadow: 3px 3px 20px rgb(0 0 0 / 9%);
        transition: all .2s ease-in-out;
        cursor: pointer;
        &.active {
            border: 1px solid var(--primary);
        }
        &:hover {
            transform: scale(1.05);
            border: 1px solid var(--primary);
        }
        img {
            width: 42px;
            height: 42px;
        }
        span {
            font-size: 14px;
            font-weight: 400;
        }
    }
    .group {
        .item:last-of-type {
            margin-right: 0;
        }
    }
}
.deal-case {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 400px;
    padding: 32px;
    background-color: var(--contentColor);
    border-radius: 12px;
    box-shadow: 3px 3px 20px rgb(0 0 0 / 9%);
}
</style>

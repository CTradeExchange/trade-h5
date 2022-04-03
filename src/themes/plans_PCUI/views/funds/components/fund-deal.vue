<template>
    <div class='fund-deal'>
        <!-- 选项卡 -->
        <div class='deal-tabs'>
            <div class='group'>
                <div :class="['item', { 'active': activeName === 'apply' }]" @click="switchTab('apply')">
                    <van-icon name='plus' />
                    <span>{{ $t('fundInfo.buy') }}</span>
                </div>
                <div :class="['item', { 'active': activeName === 'redeem' }]" @click="switchTab('redeem')">
                    <van-icon name='minus' />
                    <span>{{ $t('fundInfo.sell') }}</span>
                </div>
            </div>
            <div class='group'>
                <div :class="['item', { 'active': activeName === 'trade' }]" @click="switchTab('trade')">
                    <van-icon name='exchange' />
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
            color: var(--primary);
            border: 1px solid var(--primary);
        }
        &:hover {
            transform: scale(1.05);
            color: var(--primary);
            border: 1px solid var(--primary);
        }
        i {
            font-size: 48px;
        }
        span {
            margin-top: 8px;
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
    width: 100%;
    padding: 32px;
    background-color: var(--contentColor);
    border-radius: 12px;
    box-shadow: 3px 3px 20px rgb(0 0 0 / 9%);
}
</style>

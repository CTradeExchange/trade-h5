<template>
    <div class='fund-module'>
        <h2 class='title'>
            {{ $t('funds.title') }}
        </h2>
        <p class='subTitle'>
            {{ $t('funds.subTitle') }}
        </p>
        <div class='fund-tabs'>
            <i :class="['switch icon_XX_015', { 'active': fundModel === 'card' }]" @click="fundModel = 'card'"></i>
            <i :class="['switch icon_31liebiao', { 'active': fundModel === 'list' }]" @click="fundModel = 'list'"></i>
        </div>
        <!-- 卡片模式 -->
        <div v-if="fundModel === 'card'" class='card-case'>
            <fund-card
                v-for='(item, index) in fundProductList'
                :key='index'
                :fund='item'
            />
        </div>
        <!-- 列表模式 -->
        <fund-list v-if="fundModel === 'list'" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useFund } from '../hooks.js'
import fundCard from './fund-card.vue'
import fundList from './fund-list.vue'

// 基金产品列表
const { fundProductList } = useFund()
// 基金展示模式 card:卡片 list:表格
const fundModel = ref('card')
</script>

<style lang='scss' scoped>
.fund-module {
    .title {
        text-align: center;
        padding-top: 80px;
        margin-bottom: 4px;
        font-size: 40px;
        font-weight: 700;
        letter-spacing: .15px;
        color: #000;
    }
    .subTitle {
        text-align: center;
        margin: 16px 0;
        font-size: 16px;
        font-weight: 400;
        color: #000;
    }
}
.fund-tabs {
    display: flex;
    justify-content: center;
    .switch {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 72px;
        height: 75px;
        line-height: 1;
        margin: 16px 8px;
        font-size: 40px;
        color: #000;
        border-radius: 15px;
        transition: all .2s ease-in-out;
        cursor: pointer;
        &.active {
            background: var(--contentColor);
        }
        &:hover {
            background: var(--contentColor);
            transform: scale(1.05);
        }
    }
}
.card-case {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
}
</style>

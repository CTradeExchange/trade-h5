<template>
    <div v-if='fund.fundId' class='fund-detail'>
        <div class='fund-switch'>
            <a :class="['item', { 'disable': fundIndex === 0 }]" href='javascript:;' @click='switchPrev'>
                {{ $t('compLang.lastBox') }}
            </a>
            <a :class="['item', { 'disable': fundIndex === fundProductList.length - 1 }]" href='javascript:;' @click='switchNext'>
                {{ $t('compLang.nextBox') }}
            </a>
        </div>
        <div class='fund-block'>
            <div class='fund-left'>
                <!-- 基金信息 -->
                <fund-info :fund='fund' />
            </div>
            <div class='fund-right'>
                <fund-deal :fund='fund' />
            </div>
        </div>
        <!-- 市场表现 -->
        <div class='fund-chart'>
            <performance />
        </div>
        <!-- 投资组件 -->
        <div class='fund-chart'>
            <realtimeInvestCompose :rotate='0' :show-switch='false' />
        </div>
        <!-- 基金pdf -->
        <div class='fund-pdf'>
            <div class='fund-row'>
                <div class='col'>
                    <span>{{ $t('fundInfo.fundName') }}</span>
                    <strong>{{ fund.fundName }}</strong>
                </div>
                <div class='col'>
                    <span>{{ $t('fundInfo.fundType') }}</span>
                    <strong>{{ fund.fundType }}</strong>
                </div>
                <div class='col'>
                    <span>{{ $t('fundInfo.followIndex') }}</span>
                    <strong>{{ fund.trackProduct ? fund.trackProduct.symbolName : fund.trackIndexOut }}</strong>
                </div>
            </div>
            <div class='btnBox'>
                <button class='btn' @click="openPDF('https://www.vitatoken.io/site/v10-whitepaper.pdf')">
                    {{ $t('home.fundDesc.text3') }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watchEffect, defineProps, provide, inject } from 'vue'
import { useFund } from '../hooks.js'
import fundInfo from './fund-info.vue'
import fundDeal from './fund-deal.vue'
import performance from '@planspc/components/fundInformation/performance.vue'
import realtimeInvestCompose from '@planspc/components/fundInformation/realtimeInvestCompose.vue'

const props = defineProps({
    // 基金id
    fundId: {
        type: [String, Number],
        default: ''
    }
})
provide('fundId', props.fundId)

// 选择基金产品
const selectFund = inject('selectFund')
// 基金产品列表
const { fundProductList } = useFund()
// 当前基金
const fund = ref({})
// 当前基金产品索引
const fundIndex = ref('')

// 监听基金id
watchEffect(() => {
    const result = fundProductList.value.find(el => el.fundId === props.fundId)
    const index = fundProductList.value.findIndex(el => el.fundId === props.fundId)
    fund.value = result || {}
    fundIndex.value = index
})

// 切换上一个
const switchPrev = () => {
    if (fundIndex.value === 0) return
    const index = fundIndex.value - 1
    const fundId = fundProductList.value[index].fundId
    selectFund(fundId)
}

// 切换下一个
const switchNext = () => {
    if (fundIndex.value === fundProductList.value.length - 1) return
    const index = fundIndex.value + 1
    const fundId = fundProductList.value[index].fundId
    selectFund(fundId)
}

// 打开pdf
const openPDF = url => {
    window.open(url)
}
</script>

<style lang='scss' scoped>
.fund-detail {
    max-width: 800px;
    margin: 0 auto;
    padding: 32px 0 64px;
}
.fund-switch {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .item {
        font-size: 13px;
        color: var(--primary);
        &.disable {
            color: var(--minorColor);
            cursor: default;
        }
    }
}
.fund-block {
    display: flex;
    justify-content: center;
    margin-top: 30px;
}
.fund-left {
    width: 360px;
    margin-right: 32px;
}
.fund-right {
    width: 392px;
}
.fund-chart {
    &:deep {
        .block {
            margin-top: 30px;
            padding: 30px;
            background: var(--contentColor);
            box-shadow: 3px 3px 20px rgb(0 0 0 / 9%);
        }
        .title {
            margin-top: 0;
            padding-top: 0;
            font-size: 28px;
        }
    }
}
.fund-pdf {
    margin-top: 30px;
    padding: 30px;
    background: var(--contentColor);
    box-shadow: 3px 3px 20px rgb(0 0 0 / 9%);
    .fund-row {
        display: flex;
        justify-content: center;
        .col {
            display: inline-flex;
            flex-direction: column;
            margin: 0 60px;
            span {
                font-size: 12px;
                color: var(--normalColor);
            }
            strong {
                font-size: 16px;
                color: var(--mainColor);
            }
        }
    }
    .btnBox{
        display: flex;
        justify-content: center;
        margin-top: 20px;
        .btn{
            width: 200px;
            height: 40px;
            padding: 0 15px;
            font-size: 14px;
            color: #fff;
            background-color: var(--primary);
            border-radius: 4px;
            cursor: pointer;
            @include hover();
        }
    }
}
</style>

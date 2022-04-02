<template>
    <div v-if='fund.fundId' class='fund-detail'>
        <div class='fund-block'>
            <div class='fund-left'>
                <!-- 基金信息 -->
                <fund-info :fund='fund' />
                <!-- 市场表现 -->
                <div class='fund-chart'>
                    <performance />
                </div>
                <!-- 投资组件 -->
                <div class='fund-chart'>
                    <realtimeInvestCompose />
                </div>
            </div>
            <div class='fund-right'>
                <fund-deal :fund='fund' />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watchEffect, defineProps, provide } from 'vue'
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

// 基金产品列表
const { fundProductList } = useFund()
// 当前基金
const fund = ref({})

// 监听基金id
watchEffect(() => {
    const result = fundProductList.value.find(el => el.fundId === props.fundId)
    fund.value = result || {}
})
</script>

<style lang='scss' scoped>
.fund-detail {
    display: flex;
    justify-content: center;
    padding: 32px 0 64px;
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
    margin-top: 30px;
    &:deep {
        .title {
            font-size: 28px;
        }
    }
}
</style>

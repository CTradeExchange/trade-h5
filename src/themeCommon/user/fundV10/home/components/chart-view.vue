<template>
    <div class='chart-view'>
        <div class='chart-block'>
            <van-tabs v-model:active='activeName' :swipe-threshold='2'>
                <van-tab name='fundNav' title='Market Price vs Fund NAV'>
                    <FundNav :fund-id='fundId' />
                </van-tab>
                <van-tab name='fundIndex' title='Fund vs Index'>
                    内容 2
                </van-tab>
                <van-tab name='fundComposition' title='Fund Composition'>
                    内容 3
                </van-tab>
                <van-tab name='fundPerformance' title='Asset Performance'>
                    内容 4
                </van-tab>
            </van-tabs>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps } from 'vue'
import FundNav from '../components/fund-nav.vue'

defineProps({
    // 基金id
    fundId: {
        fundId: String,
        default: ''
    }
})

// 当前选中模块
const activeName = ref('fundNav')
</script>

<style scoped lang="scss">
.chart-view {
    background: #fff;
    border-radius:20px;
    box-shadow:0px 10px 30px rgba(0, 0, 0, 0.04);
    overflow: hidden;
    .chart-block {
        max-width: 800px;
        margin: 0 auto;
    }
    :deep {
        .van-tabs__nav {
            padding-left: 0;
            padding-right: 0;
        }
        .van-tab__text {
            font-weight: 700;
        }
        .van-tabs__line {
            background: var(--primary);
        }
    }
}
</style>

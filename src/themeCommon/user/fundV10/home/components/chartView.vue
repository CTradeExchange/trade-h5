<template>
    <div :class="['chart-view', isPC ? 'pc-chart-view' : 'h5-chart-view']">
        <div class='chart-block'>
            <van-tabs v-model:active='activeName' :line-width='80' :swipe-threshold='2'>
                <van-tab name='fundNet' title='Market Price vs Fund NAV'>
                    <div class='chart-box'>
                        <FundNet :fund-id='fundId' />
                    </div>
                </van-tab>
                <van-tab name='fundIndex' title='Fund vs Index'>
                    <div class='chart-box'>
                        <FundIndex :fund-id='fundId' />
                    </div>
                </van-tab>
                <van-tab name='fundComposition' title='Fund Composition'>
                    <div class='chart-box'>
                        <FundComposition :fund-id='fundId' />
                    </div>
                </van-tab>
                <van-tab name='fundPerformance' title='Asset Performance'>
                    <div class='chart-box'>
                        <FundPerformance :fund-id='fundId' :rotate='isPC ? 0 : 90' />
                    </div>
                </van-tab>
            </van-tabs>
        </div>
    </div>
</template>

<script setup>
import FundNet from './fundNet.vue'
import FundIndex from './fundIndex.vue'
import FundComposition from './fundComposition.vue'
import FundPerformance from './fundPerformance.vue'
import { ref, defineProps } from 'vue'

defineProps({
    // 基金id
    fundId: {
        fundId: String,
        default: ''
    },
    // 当前平台是否为PC
    isPC: {
        type: Boolean,
        default: false
    }
})

// 当前选中模块
const activeName = ref('fundNet')
</script>

<style scoped lang="scss">
.chart-view {
    background: #fff;
    border-radius:20px;
    box-shadow:0px 10px 30px rgba(0, 0, 0, 0.04);
    overflow: hidden;
    .chart-block {
        max-width: 940px;
        margin: 0 auto;
    }
    :deep {
        .van-tabs__wrap {
            border-bottom: 1px solid #eaeaea;;
        }
        .van-tabs__nav {
            padding-left: 0;
            padding-right: 0;
        }
        .van-tab {
            flex: none;
            padding: 0;
        }
        .van-tab__text {
            font-weight: 700;
        }
        .van-tabs__line {
            background: var(--primary);
        }
    }
}
.pc-chart-view {
    min-height: 490px;
    margin-top: 60px;
    padding: 20px 0 0;
    .chart-box {
        margin-top: 60px;
    }
    :deep {
        .van-tab {
            margin-right: 40px;
            &:last-of-type {
                margin-right: 0;
            }
        }
        .chartDom {
            height: 300px;
        }
    }
}
.h5-chart-view {
    min-height: 350px;
    margin-top: 40px;
    padding: 20px 20px 0;
    .chart-box {
        margin-top: 20px;
    }
    :deep {
        .van-tab {
            margin-right: 20px;
            &:last-of-type {
                margin-right: 0;
            }
        }
       .chartDom {
            height: 240px;
        }
    }
}
</style>

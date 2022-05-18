<template>
    <div class='wrap'>
        <!-- 轮播图 -->
        <Swiper :is-p-c='isPC' />
        <!-- 内容模块 -->
        <div :class="['module-content', isPC ? 'pc-content' : 'h5-content']">
            <div class='video-block max-limit'>
                <video controls preload>
                    <source src='https://www.vitatoken.io/site/about-us.mp4' type='video/mp4' />
                </video>
            </div>
            <!-- 基金信息 -->
            <div class='fund-info max-limit'>
                <ul>
                    <li>
                        <span class='name'>
                            Net Value:
                        </span>
                        <span class='value'>
                            {{ fund.netValue }}
                        </span>
                    </li>
                    <li>
                        <span class='name'>
                            Fund Size (USDT):
                        </span>
                        <span class='value'>
                            {{ fund.totalBalance }}
                        </span>
                    </li>
                    <li>
                        <span class='name'>
                            Issuing institution:
                        </span>
                        <span class='value'>
                            Metaverse Era Capital
                        </span>
                    </li>
                    <li>
                        <span class='name'>
                            Date of Establishment:
                        </span>
                        <span class='value'>
                            {{ fund.upDate }}
                        </span>
                    </li>
                    <li>
                        <span class='name'>
                            Establishment Revenue:
                        </span>
                        <span class='value'>
                            {{ fund.marketPrice }}
                        </span>
                    </li>
                    <li>
                        <span class='name'>
                            For more information:
                        </span>
                        <span class='value'>
                            V10 White Paper
                        </span>
                    </li>
                </ul>
            </div>
            <!-- 图表视图 -->
            <div class='max-limit'>
                <ChartView :fund-id='fundId' />
            </div>
        </div>
    </div>
</template>

<script setup>
import Swiper from './components/swiper.vue'
import ChartView from './components/chart-view.vue'
import { onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
const store = useStore()
const route = useRoute()

// 当前平台是否为PC
const { isPC } = route.meta
// 当前基金id
const fundId = 18
// 基金信息
const fund = computed(() => store.state._quote.fundInfo || {})

// 获取基金详情
const queryFundInfo = () => {
    store.dispatch('_quote/queryFundInfo', fundId)
}

// 获取基金净值等数据
const queryFundNetValue = () => {
    store.dispatch('_quote/fundNetValue', { fundId })
}

onMounted(() => {
    // 获取基金详情
    queryFundInfo()
    // 获取基金净值等数据
    queryFundNetValue()
})
</script>

<style lang="scss" scoped>
.module-content {
    background-color: #f4f4f4;
    .video-block {
        background-color: #000;
        border-radius: 20px;
        overflow: hidden;
        video {
            display: block;
            width: 100%;
            height: 100%;
        }
    }
    .fund-info {
        font-size: 20px;
        font-weight: 700;
        color: #333;
        ul {
            li {
                margin-top: 28px;
                line-height: 28px;
            }
        }
    }
}
.pc-content {
    padding: 60px 0 150px;
    .video-block {
        height: 660px;
    }
    .fund-info {
        margin-top: 60px;
        ul {
            display: flex;
            flex-wrap: wrap;
            margin-top: -28px;
            li {
                width: calc(100% / 3);
            }
        }
    }
    :deep {
        .chart-view {
            height: 490px;
            margin-top: 60px;
            padding: 20px 0 0;
        }
    }
}
.h5-content {
    padding: 40px 20px 88px;
    .video-block {
        height: 400px;
    }
    .fund-info {
        margin-top: 40px;
    }
    :deep {
        .chart-view {
            height: 350px;
            margin-top: 40px;
            padding: 20px 20px 0;
        }
    }
}
.max-limit {
    max-width: 1200px;
    margin: 0 auto;
}
</style>

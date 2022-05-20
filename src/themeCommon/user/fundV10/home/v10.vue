<template>
    <div class='wrap'>
        <!-- 轮播图 -->
        <Swiper :is-p-c='isPC' />
        <!-- 内容模块 -->
        <div :class="['module-content', isPC ? 'pc-content' : 'h5-content']">
            <!-- PC背景 -->
            <div v-if='isPC' class='pc-bg'>
                <img class='blue1-bg' :src="require('@public/images/V10/pc/blue1_bg.png')" />
                <img class='blue2-bg' :src="require('@public/images/V10/pc/blue2_bg.png')" />
            </div>
            <!-- H5背景 -->
            <div v-else class='h5-bg'>
                <img class='blue1-bg' :src="require('@public/images/V10/h5/blue1_bg.png')" />
                <img class='blue2-bg' :src="require('@public/images/V10/h5/blue2_bg.png')" />
            </div>

            <div class='tier-body'>
                <div class='video-block max-limit'>
                    <video controls preload>
                        <source src='https://www.vitatoken.io/site/about-us.mp4' type='video/mp4' />
                    </video>
                </div>

                <!-- 基金信息 -->
                <div class='fund-info max-limit'>
                    <img class='ellipse-bg' :src="require('@public/images/V10/ellipse_bg.png')" />
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
                        <li class='href' @click='goExamine'>
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
                    <ChartView :fund-id='fundId' :is-p-c='isPC' />
                </div>

                <div class='module-case max-limit'>
                    <img class='ellipse-bg' :src="require('@public/images/V10/ellipse_bg.png')" />
                    <div class='trend-chart'>
                        <h3 class='title'>
                            Reflecting the trend of cryptocurrency in general
                        </h3>
                        <div class='block trend-block'>
                            <div class='above'>
                                <img class='pic' :src="isPC ? require('@public/images/V10/pc/trend_chart.png') : require('@public/images/V10/h5/trend_chart.png')" />
                            </div>
                            <div class='below'>
                                <p class='text'>
                                    V10 contains the top 10 cryptocurrency according to market capitalization. It is relatively stable and reflects the overall trend in cryptocurrency. By holding V10, you do not need to worry about choosing which cryptocurrency to invest in and it becomes more accessible by lowering the entry barrier.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class='fund-assets'>
                        <h3 class='title'>
                            Fully Transparent
                        </h3>
                        <div class='block assets-block'>
                            <div class='above'>
                                <div class='assets-info'>
                                    <div class='header'>
                                        <span>Currency</span>
                                        <span>Percentage</span>
                                    </div>
                                    <ul class='list'>
                                        <li v-for='(item, index) in fund.fundCurrencyList' :key='index'>
                                            <div class='row'>
                                                <CurrencyIcon class='icon' :currency='item.currencyCode' :size='24' />
                                                <span class='currency'>
                                                    {{ item.currencyCode }}
                                                </span>
                                            </div>
                                            <span>{{ item.weight }}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class='below'>
                                <p class='text'>
                                    The key features of V10 are that it is fully transparent, and it is able to provide the location of assets, as well as provide safe and reliable trading. With V10, you won’t miss out on investing in the fast-growing cryptocurrency market.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class='how-case max-limit'>
                    <img class='ellipse-bg' :src="require('@public/images/V10/ellipse_bg.png')" />
                    <div class='how-buy'>
                        <h3 class='title'>
                            How to buy V10
                        </h3>
                        <div class='method'>
                            <p class='name cell-1'>
                                <strong>Method</strong>
                            </p>
                            <div class='handle'>
                                <button class='cell-2' @click='onFund'>
                                    Buy via Vitatoken
                                </button>
                                <button class='cell-3' @click='onTrade'>
                                    Buy via Issuing institution
                                </button>
                            </div>
                        </div>
                        <ul class='info'>
                            <li>
                                <strong class='cell-1'>
                                    Minimum Buy In Amount
                                </strong>
                                <div class='col'>
                                    <span class='cell-2'>
                                        10U起
                                    </span>
                                    <span class='cell-3'>
                                        5000U起
                                    </span>
                                </div>
                            </li>
                            <li>
                                <strong class='cell-1'>
                                    Rate
                                </strong>
                                <div class='col'>
                                    <span class='cell-2'>
                                        0.15%
                                    </span>
                                    <span class='cell-3'>
                                        0.2%
                                    </span>
                                </div>
                            </li>
                            <li>
                                <strong class='cell-1'>
                                    Arrival Time
                                </strong>
                                <div class='col'>
                                    <span class='cell-2'>
                                        Immediate Transaction
                                    </span>
                                    <span class='cell-3'>
                                        T+1
                                    </span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Swiper from './components/swiper.vue'
import ChartView from './components/chartView.vue'
import CurrencyIcon from '@/components/currencyIcon'
import { onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
const store = useStore()
const route = useRoute()
const router = useRouter()

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

// 跳转到查验页面
const goExamine = () => {
    router.push({
        path: '/fundV10/examine'
    })
}

// 点击购买基金
const onFund = () => {

}

// 点击交易

onMounted(() => {
    // 获取基金详情
    queryFundInfo()
    // 获取基金净值等数据
    queryFundNetValue()
})
</script>

<style lang="scss" scoped>
.pc-bg {
    .blue1-bg {
        width: 100%;
        position: absolute;
        left: 0;
        top: 436px;
    }
    .blue2-bg {
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 0;
    }
}
.h5-bg {
    .blue1-bg {
        width: 100%;
        position: absolute;
        left: 0;
        top: 135px;
    }
    .blue2-bg {
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 643px;
    }
}
.tier-body {
    position: relative;
    z-index: 100;
}
.module-content {
    position: relative;
    background-color: #f4f4f4;
    overflow: hidden;
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
        position: relative;
        ul {
            li {
                margin-top: 28px;
                line-height: 28px;
                &.href {
                    cursor: pointer;
                    &:hover {
                        color: var(--primary);
                    }
                }
            }
        }
    }
    .module-case {
        position: relative;
        z-index: 100;
        .title {
            font-weight: bold;
            color: #333;
        }
        .assets-info {
            .header {
                display: flex;
                justify-content: space-between;
                font-size: 14px;
                color: #999;
            }
            .list {
                margin-top: 20px;
                li {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 12px;
                    .row {
                        display: inline-flex;
                        align-items: center;
                        .currency {
                            margin-left: 12px;
                            font-size: 14px;
                            font-weight: 700;
                            color: #333;
                        }
                    }
                }
            }
        }
    }
    .how-case {
        position: relative;
    }
    .how-buy {
        position: relative;
        background-color:#ffffff;
        border-radius:20px;
        box-shadow:0px 10px 30px rgba(0, 0, 0, 0.04);
        .title {
            text-align: center;
            font-weight: 700;
            color: #333;
            border-bottom: 1px solid #c2c2c2;
        }
        .method {
            color: var(--primary);
            font-weight: 700;
            .handle {
                button {
                    background: none;
                    border: 1px solid var(--primary);
                    border-radius: 10px;
                    cursor: pointer;
                    &:hover {
                        background: var(--primary);
                        color: #fff;
                    }
                }
            }
        }
        .info {
            padding-bottom: 40px;
            li {
                display: flex;
                font-size: 14px;
                color: #333;
                line-height: 20px;
                strong {
                    font-weight: 700;
                }
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
        .ellipse-bg {
            position: absolute;
            top: -30px;
            right: -50px;
        }
        ul {
            display: flex;
            flex-wrap: wrap;
            margin-top: -28px;
            li {
                width: calc(100% / 3);
            }
        }
    }
    .module-case {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-top: 60px;
        .ellipse-bg {
            position: absolute;
            top: -30px;
            left: 25px;
        }
        .title {
            font-size: 30px;
        }
        .trend-chart {
            width: 768px;
        }
        .fund-assets {
            width: 412px;
        }
        .block {
            margin-top: 32px;
            padding: 0 30px;
            background-color:#ffffff;
            border-radius:20px;
            box-shadow:0px 10px 30px rgba(0, 0, 0, 0.04);
            position: relative;
            .above {
                height: 465px;
                border-bottom: 1px solid #c2c2c2;
            }
            .below {
                height: 155px;
                padding-top: 20px;
                .text {
                    line-height: 20px;
                    font-size: 14px;
                    color: #999;
                }
            }
        }
        .trend-block {
            .above {
                padding-top: 95px;
            }
            .pic {
                display: block;
                width: 100%;
            }
        }
        .assets-block {
            .above {
                padding-top: 40px;
            }
        }
    }
    .how-case {
        .ellipse-bg {
            position: absolute;
            top: 53px;
            right: -70px;
        }
    }
    .how-buy {
        margin-top: 60px;
        padding: 0 130px;
        .title {
            padding: 32px 0;
            font-size: 30px;
        }
        .method {
            display: flex;
            align-items: center;
            padding: 32px 0 20px;
            .name {
                font-size: 16px;
            }
            .handle {
                display: inline-flex;
                justify-content: space-between;
                flex: 1;
                font-size: 14px;
                button {
                    display: inline-flex;
                    justify-content: center;
                    align-items: center;
                    height: 40px;
                }
            }
        }
        .info {
            li {
                margin-bottom: 20px;
                &:last-of-type {
                    margin-bottom: 0;
                }
                .col {
                    display: inline-flex;
                    justify-content: space-between;
                    flex: 1;
                }
            }
        }
        .cell-1 {
            width: 372px;
        }
        .cell-2 {
            width: 190px;
            text-align: center;
        }
        .cell-3 {
            width: 245px;
            text-align: center;
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
        .ellipse-bg {
            position: absolute;
            top: 65px;
            right: -20px;
        }
    }
    .module-case {
        .ellipse-bg {
            position: absolute;
            top: -30px;
            left: -60px;
        }
        .title {
            line-height: 32px;
            font-size: 24px;
        }
        > div {
            margin-top: 40px;
        }
        .block {
            margin-top: 32px;
            padding: 40px 20px;
            background-color:#ffffff;
            border-radius:20px;
            box-shadow:0px 10px 30px rgba(0, 0, 0, 0.04);
            .above {
                padding-bottom: 20px;
                border-bottom: 1px solid #c2c2c2;
            }
            .below {
                padding-top: 20px;
                .text {
                    line-height: 16px;
                    font-size: 12px;
                    color: #999;
                }
            }
        }
        .trend-block {
            .pic {
                display: block;
                width: 100%;
            }
        }
    }
    .how-case {
        .ellipse-bg {
            position: absolute;
            top: -80px;
            right: -20px;
        }
    }
    .how-buy {
        margin-top: 30px;
        padding: 0 20px;
        .title {
            padding: 40px 0 20px;
            font-size: 24px;
        }
        .method {
            display: flex;
            justify-content: space-between;
            padding: 20px 0;
            .name {
                flex: 1;
                line-height: 40px;
                font-size: 14px;
            }
            .handle {
                display: inline-flex;
                flex-direction: column;
                align-content: flex-end;
                font-size: 12px;
                button {
                    display: inline-flex;
                    justify-content: center;
                    align-items: center;
                    height: 36px;
                    margin-bottom: 10px;
                    &:last-of-type {
                        margin-bottom: 0;
                    }
                }
            }
        }
        .info {
            li {
                padding: 20px 0;
                border-top: 1px solid #c2c2c2;
                span {
                    margin-right: 30px;
                    &:last-of-type {
                        margin-right: 0;
                    }
                }
            }
        }
        .cell-1 {
            width: 80px;
        }
        .cell-2 {
            width: 140px;
        }
        .cell-3 {
            width: 190px;
        }
    }
}
.max-limit {
    max-width: 1200px;
    margin: 0 auto;
}
</style>

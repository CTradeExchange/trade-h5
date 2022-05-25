<template>
    <div class='wrap'>
        <!-- 轮播图 -->
        <Swiper :is-p-c='isPC' />
        <!-- 内容模块 -->
        <div :class="['module-content', isPC ? 'pc-content' : 'h5-content']">
            <!-- PC背景 -->
            <div v-if='isPC' class='pc-bg'>
                <img class='blue1-bg animation-spin' :src="require('@public/images/V10/pc/blue1_bg.png')" />
                <img class='blue2-bg animation-spin' :src="require('@public/images/V10/pc/blue2_bg.png')" />
            </div>
            <!-- H5背景 -->
            <div v-else class='h5-bg'>
                <img class='blue1-bg animation-spin' :src="require('@public/images/V10/h5/blue1_bg.png')" />
                <img class='blue2-bg animation-spin' :src="require('@public/images/V10/h5/blue2_bg.png')" />
            </div>

            <div class='tier-body'>
                <div class='video-block max-limit'>
                    <video
                        id='V10_video'
                        controls
                        playsinline
                        :poster="isPC ? require('@public/images/V10/pc/video_bg.jpg') : require('@public/images/V10/h5/video_bg.jpg')"
                        preload
                    >
                        <source src='https://vitatoken.io/site/V10.mp4' type='video/mp4' />
                    </video>dddd
                    <div v-if='showPlay' class='mask' @click='onPlay'>
                        <div class='control'>
                            <p class='title'>
                                What is V10
                            </p>
                            <svg class='play' height='48' viewBox='0 0 48 48' width='48' xmlns='http://www.w3.org/2000/svg'>
                                <path id='路径_88' d='M126.243,82.711a24.065,24.065,0,1,0,1.888,9.344A23.933,23.933,0,0,0,126.243,82.711Zm-22.112,30.842a21.5,21.5,0,1,1,21.5-21.5A21.524,21.524,0,0,1,104.131,113.553Zm7.189-21.7-10.152-7.137a.693.693,0,0,0-1.092.574V99.562a.693.693,0,0,0,1.092.574L111.325,93A.7.7,0,0,0,111.32,91.85Z' data-name='路径 88' fill='#fff' transform='translate(-80.131 -68.055)' />
                            </svg>
                        </div>
                    </div>
                </div>

                <!-- 基金信息 -->
                <div class='fund-info max-limit'>
                    <img class='ellipse-bg animation-spin' :src="require('@public/images/V10/ellipse_bg.png')" />
                    <ul>
                        <li>
                            <span class='name'>
                                {{ $t('fundInfo.realtimeJZ') }}({{ fund.currency }}):
                            </span>
                            <span class='value'>
                                {{ fund.netValue }}
                            </span>
                        </li>
                        <li>
                            <span class='name'>
                                {{ $t('fundInfo.totalMarketValue') }}({{ fund.currency }}):
                            </span>
                            <span class='value'>
                                {{ formatAmount(fund.totalBalance) }}
                            </span>
                        </li>
                        <li class='href' @click='goExamine'>
                            <span class='name'>
                                Issuing institution:
                            </span>
                            <span class='value'>
                                Metaverse Era Capital
                                <img class='badge' :src="require('@public/images/V10/badge.png')" />
                            </span>
                        </li>
                        <li>
                            <span class='name'>
                                {{ $t('trade.priceLabel') }}({{ fund.currency }}):
                            </span>
                            <span class='value'>
                                {{ fund.marketPrice }}
                            </span>
                        </li>
                        <li>
                            <span class='name'>
                                {{ $t('fundInfo.fundCreateTime') }}:
                            </span>
                            <span class='value'>
                                {{ fund.upDate ? fund.upDate.substring(0, fund.upDate.length - 3) : '' }}
                            </span>
                        </li>
                        <li class='href' @click="openPDF('https://vitatoken.io/site/V10_Index_Fund_WhitePaper.pdf')">
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
                    <img class='ellipse-bg animation-spin' :src="require('@public/images/V10/ellipse_bg.png')" />
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
                                        <span>Main Chain</span>
                                    </div>
                                    <ul class='list'>
                                        <li v-for='(item, index) in rangList' :key='index'>
                                            <div class='row'>
                                                <CurrencyIcon class='icon' :currency='item.asset' :size='24' />
                                                <span class='currency'>
                                                    {{ item.asset }}
                                                </span>
                                            </div>
                                            <span>{{ item.weightRealValue }}</span>
                                            <span>
                                                <a v-if='getAddress(item.asset)' :href='getAddress(item.asset)?.url' target='open'>
                                                    {{ getAddress(item.asset)?.chain }}
                                                </a>
                                                <em v-else>
                                                    --
                                                </em>
                                            </span>
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
                    <img class='ellipse-bg animation-spin' :src="require('@public/images/V10/ellipse_bg.png')" />
                    <div class='how-buy'>
                        <h3 class='title'>
                            How to buy V10
                        </h3>
                        <div class='method'>
                            <p class='name cell-1'>
                                <strong>Method</strong>
                            </p>
                            <div class='handle'>
                                <button class='cell-2' @click='onTrade'>
                                    Via Vitatoken
                                </button>
                                <button class='cell-3' @click='onFund'>
                                    Via Issuing Institution
                                </button>
                            </div>
                        </div>
                        <ul class='info'>
                            <li>
                                <strong class='cell-1'>
                                    Minimum Purchase
                                </strong>
                                <div class='col'>
                                    <span class='cell-2'>
                                        1 V10
                                    </span>
                                    <span class='cell-3'>
                                        1000 V10
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
                                        T+2
                                    </span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <!-- 基金交易弹窗 -->
        <FundTradeDialog v-if='isPC' v-model='showFundDialog' :fund='fund' />
        <!-- 基金记录弹窗 -->
        <FundRecordDialog v-if='isPC' v-model='showRecordDialog' />
    </div>
</template>

<script setup>
import Swiper from './components/swiper.vue'
import ChartView from './components/chartView.vue'
import FundTradeDialog from './components/fundTradeDialog.vue'
import FundRecordDialog from './components/fundRecordDialog.vue'
import CurrencyIcon from '@/components/currencyIcon.vue'
import { ref, onMounted, onUnmounted, computed, provide } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Toast } from 'vant'
import { formatAmount } from '@/utils/calculation.js'
import { investCombination } from '@/api/trade'
const store = useStore()
const route = useRoute()
const router = useRouter()
const { t } = useI18n({ useScope: 'global' })
// 基金信息
const fund = computed(() => store.state._quote.fundInfo || {})
// 用户信息
const customerInfo = computed(() => store.state._user.customerInfo)

// 当前平台是否为PC
const isPC = process.env.VUE_APP_theme === 'plans_PCUI'
// 视频元素
let V10_video = null
// 是否显示播放控制
const showPlay = ref(true)
// 当前基金id
const fundId = window['V10'] || 368
// 资产排名列表数据
const rangList = ref([])
// 是否显示基金弹窗
const showFundDialog = ref(false)
// 是否显示基金记录弹窗
const showRecordDialog = ref(false)
// 当前显示的基金记录模块
const fundRecordAcitve = ref('')
// 地址列表数据
const addressList = ref([
    { currency: 'BNB', chain: '0x53eB4bD7a57B7CeA9aAA554dA6865fCaDF8010e9', url: 'https://bscscan.com/address/0x53eB4bD7a57B7CeA9aAA554dA6865fCaDF8010e9' },
    { currency: 'BTC', chain: 'bc1qfsnn2uzcqeq93w2qvadejajydvd2g760gp7pmf', url: 'https://blockchair.com/bitcoin/address/bc1qfsnn2uzcqeq93w2qvadejajydvd2g760gp7pmf' },
    { currency: 'ETH', chain: '0x53eB4bD7a57B7CeA9aAA554dA6865fCaDF8010e9', url: 'https://etherscan.io/address/0x53eB4bD7a57B7CeA9aAA554dA6865fCaDF8010e9' },
    { currency: 'ADA', chain: 'addr1q8hj69af9xahpttcw9qk5jydtn088yutsadkcqtnajzf6jk965yzd5llf238cxcz3d3m7haplcdre3h48ghvlfhhvyjsteyysw', url: 'https://blockchair.com/zh/cardano/address/addr1q8hj69af9xahpttcw9qk5jydtn088yutsadkcqtnajzf6jk965yzd5llf238cxcz3d3m7haplcdre3h48ghvlfhhvyjsteyysw' },
    { currency: 'AVAX', chain: 'X-avax1xcp3tjp7yq9z0jxtq8q4nl5nspv4zrf86v4kg0', url: 'https://explorer-xp.avax.network/address/X-avax1xcp3tjp7yq9z0jxtq8q4nl5nspv4zrf86v4kg0' },
    { currency: 'DOT', chain: '15Qx2UbhktiNED9bmudpv9W1cDfAybwWP2G18a6eNQKJDGKr', url: 'https://blockchair.com/zh/polkadot/address/15Qx2UbhktiNED9bmudpv9W1cDfAybwWP2G18a6eNQKJDGKr' },
    { currency: 'LUNA', chain: 'terra10pnx4gkygn5rprxg5twvc0fypwsm43d8k7yn6u', url: 'https://finder.terra.money/mainnet/address/terra10pnx4gkygn5rprxg5twvc0fypwsm43d8k7yn6u' },
    { currency: 'SHIB', chain: '0x53eB4bD7a57B7CeA9aAA554dA6865fCaDF8010e9', url: 'https://bscscan.com/token/0x2859e4544c4bb03966803b044a93563bd2d0dd4d?a=0x53eB4bD7a57B7CeA9aAA554dA6865fCaDF8010e9' },
    { currency: 'SOL', chain: 'EzWS7qR4s9W2BPeZ4vZeX3FQhD5m8HdMWwXkwTHcPodH', url: 'https://explorer.solana.com/address/EzWS7qR4s9W2BPeZ4vZeX3FQhD5m8HdMWwXkwTHcPodH' },
    { currency: 'XRP', chain: 'rHLQjqbJWEjcwxtepJX9WFQqWjToaFqkZn', url: 'https://xrpscan.com/account/rHLQjqbJWEjcwxtepJX9WFQqWjToaFqkZn' }
])

// 获取基金详情
const queryFundInfo = () => {
    store.dispatch('_quote/queryFundInfo', fundId)
}

// 获取基金净值等数据
const queryFundNetValue = () => {
    store.dispatch('_quote/fundNetValue', { fundId })
}

// 实时投资组合排名
const getInvestCombination = () => {
    investCombination({ fundId, statisticType: 1 }).then(res => {
        if (res.check()) {
            const list = res.data
            rangList.value = list
        }
    })
}

// 点击播放视频
const onPlay = () => {
    V10_video.play()
}

// 打开pdf
const openPDF = url => {
    window.open(url)
}

// 获取地址
const getAddress = (currency) => {
    const item = addressList.value.find(el => el.currency === currency)
    return item || ''
}

// 跳转到查验页面
const goExamine = () => {
    router.push({
        path: '/fundV10/examine'
    })
}

// 点击购买基金
const onFund = () => {
    if (isPC) {
        showFundDialog.value = true
    } else {
        router.push({
            path: '/fundApply',
            query: {
                direction: 'buy',
                fundId
            }
        })
    }
}

// 点击交易
const onTrade = () => {
    const productList = store.state._quote.productList
    let product = productList.find(el => el.baseCurrency === fund.value.shareTokenCode && el.profitCurrency === 'USDT' && el.tradeType === 5)
    if (!product) {
        product = productList.find(el => el.baseCurrency === fund.value.shareTokenCode && el.tradeType === 5)
    }
    if (!product || product.baseCurrency === product.profitCurrency) {
        return Toast(t('fundInfo.noTradeMarket'))
    }

    router.push(`/order?symbolId=${product.symbolId}&tradeType=${product.tradeType}`)
}

// 更新基金净值
provide('updateSharesNet', () => {})
// 改变显示的模块
provide('changeShowModel', (model, active) => {
    showFundDialog.value = false
    showRecordDialog.value = true
    fundRecordAcitve.value = active
})
// 当前显示基金记录的模块
provide('fundRecordAcitve', fundRecordAcitve)
// 更新资产排名列表数据
provide('updateRangList', list => {
    rangList.value = list
})

onMounted(() => {
    // 获取基金详情
    queryFundInfo()
    // 获取基金净值等数据
    queryFundNetValue()
    // 实时投资组合排名
    getInvestCombination()
    // 获取视频元素
    V10_video = document.getElementById('V10_video')
    V10_video.addEventListener('play', () => {
        showPlay.value = false
    })
    // body添加类名
    document.body.classList.add('V10')
})

onUnmounted(() => {
    // body移除类名
    document.body.classList.remove('V10')
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
        position: relative;
        video {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .mask {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,.4);
            position: absolute;
            top: 0;
            left: 0;
            cursor: pointer;
        }
        .control {
            text-align: center;
            .title {
                font-weight: 700;
                color: #fff;
            }
        }
    }
    .fund-info {
        font-size: 20px;
        font-weight: 700;
        color: #333;
        position: relative;
        ul {
            position: relative;
            z-index: 100;
            li {
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                margin-top: 25px;
                line-height: 28px;
                .name {
                    display: inline-flex;
                    align-items: center;
                    margin-right: 3px;
                }
                .value {
                    display: inline-flex;
                    align-items: center;
                }
                &.href {
                    cursor: pointer;
                    &:hover {
                        color: var(--primary);
                    }
                }
                .badge {
                    width: 30px;
                    height: 30px;
                    margin-left: 2px;
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
                font-size: 14px;
                color: #999;
                span {
                    flex: 1;
                }
            }
            .list {
                margin-top: 20px;
                li {
                    display: flex;
                    align-items: center;
                    margin-bottom: 15px;
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
                    div, span {
                        @include single-line-clamp;
                        flex: 1;
                    }
                    a {
                        color: var(--primary);
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
        .control {
            .title {
                margin-bottom: 20px;
                font-size: 30px;
            }
        }
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
        margin-top: 45px;
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
                height: 510px;
                border-bottom: 1px solid #c2c2c2;
            }
            .below {
                height: 150px;
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
        height: 210px;
        .control {
            .title {
                margin-bottom: 10px;
                font-size: 24px;
            }
        }
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
                font-size: 12px;
                button {
                    display: inline-flex;
                    justify-content: center;
                    align-items: center;
                    height: 36px;
                    padding: 0 5px;
                    &:first-of-type {
                        margin-right: 5px;
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
                .cell-1 {
                    width: 80px;
                }
            }
        }
    }
}
.max-limit {
    max-width: 1200px;
    margin: 0 auto;
}

.animation-spin {
    animation: spin 10s linear infinite;
}
@keyframes spin {
    0% {
        transform: translate(-0%, -0%) scale(1);
    }
    25% {
        transform: translate(-1%, -1%) scale(1.1);
    }
    50% {
        transform: translate(-0%, -2%) scale(1.0);
    }
    75% {
        transform: translate(1%, -1%) scale(1.1);
    }
    100% {
        transform: translate(-0%, -0%) scale(1.0);
    }
}
</style>

<template>
    <router-view />
    <div class='detail-module'>
        <div class='info-case'>
            <div class='info-case-1'>
                <el-skeleton animated :loading='loading' :rows='4'>
                    <template #default>
                        <div class='chain-info'>
                            <div class='left'>
                                <img class='icon' :src='product.image' />
                                <span class='name'>
                                    {{ product.symbol }}
                                </span>
                            </div>
                            <div class='right'>
                                <img
                                    :src='"/images/markets/"+ linkType.toLowerCase() +".svg"'
                                />
                                <span>{{ linkType }} Market</span>
                            </div>
                        </div>
                        <ul class='chain-row'>
                            <li>
                                <span class='label'>
                                    Platform
                                </span>
                                <div class='box' @click='toPlatform'>
                                    <img class='icon' src='@/assets/fundDex_icon/index-logo-black.png' />
                                    <span class='value'>
                                        Index
                                    </span>
                                </div>
                            </li>
                            <li>
                                <span class='label'>
                                    NAV
                                </span>
                                <span class='value'>
                                    ${{ nav }}
                                </span>
                            </li>
                            <li>
                                <span class='label'>
                                    Market cap
                                </span>
                                <span class='value'>
                                    ${{ marketCap }}
                                </span>
                            </li>
                            <li>
                                <span class='label'>
                                    Volume
                                </span>
                                <span class='value'>
                                    ${{ volume }}
                                </span>
                            </li>
                        </ul>
                        <ul class='chain-row'>
                            <li>
                                <span class='label'>
                                    Current supply
                                </span>
                                <span class='value'>
                                    {{ currentSupply }}
                                </span>
                            </li>
                            <li>
                                <span class='label'>
                                    Streaming fee
                                </span>
                                <span class='value'>
                                    {{ product.fees?.streamingFee || 'n/a' }}
                                </span>
                            </li>
                            <li>
                                <span class='label'>
                                    Mint fee
                                </span>
                                <span class='value'>
                                    {{ product.fees?.mintRedeemFee || 'n/a' }}
                                </span>
                            </li>
                            <li>
                                <span class='label'>
                                    Redeem fee
                                </span>
                                <span class='value'>
                                    {{ product.fees?.mintRedeemFee || 'n/a' }}
                                </span>
                            </li>
                        </ul>
                    </template>
                </el-skeleton>
            </div>
            <div class='info-case-2'>
                <el-skeleton animated :loading='loading' :rows='4'>
                    <h3 class='title'>
                        Your info
                    </h3>
                    <!-- 已连接钱包 -->
                    <div v-if='userAddress' class='have-wallet'>
                        <div v-if='Number(assetBalance) <= 0 && !assetBalanceLoading' class='warn'>
                            Your Ethereum wallet is empty. Purchase or transfer assets
                        </div>
                        <div class='assets'>
                            <div class='label'>
                                <span>Wallet balance</span>
                            </div>
                            <div class='count'>
                                <van-loading v-if='assetBalanceLoading' :color='style.normalColor' :size='16' />
                                <b v-else>
                                    {{ formatAmount(assetBalance, 5) }}
                                </b>
                                <span>{{ product.symbol }}</span>
                            </div>
                        </div>
                        <p class='usd-count'>
                            <span>$ {{ toFixed(usdCount) }}</span>
                        </p>
                        <div class='assets'>
                            <div class='label'>
                                <span>Available to purchase</span>
                                <van-popover v-model:show='showAmountPopover' placement='top'>
                                    <div class='popover-content'>
                                        <p>This is the total amount that you are able to purchase to in this reserve. You are able to purchase your wallet balance up until the purchase cap is reached.</p>
                                    </div>
                                    <template #reference>
                                        <van-icon class='info' :color='showAmountPopover ? style.primary : style.normalColor' name='info-o' />
                                    </template>
                                </van-popover>
                            </div>
                            <div class='count'>
                                <van-loading v-if='assetBalanceLoading' :color='style.normalColor' :size='16' />
                                <b v-else>
                                    {{ formatAmount(assetBalance, 5) }}
                                </b>
                                <span>{{ product.symbol }}</span>
                            </div>
                        </div>
                        <div class='handle'>
                            <el-tooltip
                                effect='dark'
                                placement='top'
                            >
                                <template #content>
                                    <p>Coming Soon</p>
                                </template>
                                <button class='disable'>
                                    Purchase
                                </button>
                            </el-tooltip>
                        </div>
                    </div>
                    <!-- 未连接钱包 -->
                    <div v-else class='not-wallet'>
                        <p class='warn'>
                            Please connect a wallet to view your personal information here.
                        </p>
                        <div class='connect-wallet'>
                            <button @click='startConnect'>
                                Connect wallet
                            </button>
                        </div>
                    </div>
                </el-skeleton>
            </div>
        </div>
        <div v-loading='loading' class='chart-case'>
            <div class='switch-tabs'>
                <button
                    v-for='(item, index) in chartTabs'
                    :key='index'
                    :class="{ 'active': item.name === currentChart }"
                    @click='switchTabs(item)'
                >
                    {{ item.name }}
                </button>
            </div>
            <div ref='chartDom' class='chart-box'></div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { useChart } from './hooks.js'
import { getMarketDetail_coingecko, getMarketChart_coingecko } from '@/api/fundDEX.js'
import { formatAmount, toFixed, mul } from '@/utils/calculation.js'
import { productTokensBySymbolList } from '../config/config-indexCoop.js'
import * as echarts from 'echarts'
import { web3Hooks } from '@/plugins/web3/index'
import { localGet } from '@/utils/util'

const {
    executeConnect,
    getUserBalance,
    getWalletBalance
} = web3Hooks()
const { newChart } = useChart()
const store = useStore()
const route = useRoute()
const style = computed(() => store.state.style)
const userAddress = computed(() => store.state._web3.userAddress)
// 当前申购数量转换成USD的数量
const usdCount = computed(() => {
    return assetBalance.value > 0 ? mul(assetBalance.value, fund.value.price) : 0
})
// 详情加载状态
const loading = ref(true)
// 基金id
const { linkType, id } = route.query
// 当前基金产品信息
const product = productTokensBySymbolList.find(el => el.coingeckoId === id)
// 图表元素
const chartDom = ref(null)
// 图表加载状态
const chartLoading = ref(true)
// 图表选项列表
const chartTabs = ref([
    { name: '1D', value: 1 },
    { name: '1W', value: 7 },
    { name: '1M', value: 30 }
])
// 当前图表选项
const currentChart = ref('1D')
// NAV
const nav = ref('')
// Market Cap
const marketCap = ref('')
// Volume
const volume = ref('')
// Current Supply
const currentSupply = ref('')
// 代币余额
const assetBalance = ref(0)
// 代币余额获取中
const assetBalanceLoading = ref(true)
// 钱包连接中
const connectLoading = ref(true)
// 是否使用ETH申购
const isPurchaseETH = ref(false)
// 是否显示金额说明
const showAmountPopover = ref(false)

// 获取基金详情
const queryFundDetail = () => {
    getMarketDetail_coingecko({
        id
    }).then(res => {
        loading.value = false
        const { market_data } = res
        marketCap.value = formatAmount(market_data.market_cap.usd)
        volume.value = formatAmount(market_data.total_volume.usd)
        currentSupply.value = toFixed(market_data.circulating_supply)
    })

    // 获取最新的价格,跟列表同步显示
    getMarketChart_coingecko({
        vs_currency: 'usd',
        id: id,
        days: 90,
        // interval: 'daily'
    }).then(res => {
        nav.value = toFixed(res['prices'][res['prices'].length - 1][1])
    })
}

// 获取基金行情图表走势图
const queryFundChart = () => {
    const { value } = chartTabs.value.find(el => el.name === currentChart.value)
    getMarketChart_coingecko({
        id,
        vs_currency: 'usd',
        days: value,
        interval: 'hourly'
    }).then(res => {
        const xData = []
        const pricesData = []

        res['prices'].map(el => {
            xData.push((window.dayjs(el[0]).format('YYYY-MM-DD HH:mm')))
            pricesData.push(toFixed(el[1]))
        })
        const series = [
            {
                name: 'NAV',
                type: 'line',
                showSymbol: false,
                data: pricesData,
                smooth: true,
                areaStyle: {
                    opacity: 0.5,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: 'rgb(129,213,220)'
                        },
                        {
                            offset: 1,
                            color: 'rgb(234,248,249)'
                        }
                    ])
                }
            }
        ]

        // 绘制图表
        newChart(chartDom.value, [xData, series], {
            'yAxis.ext': '$'
        })

        chartLoading.value = false
    }).catch(() => {
        chartLoading.value = false
    })
}

// 切换图表选项
const switchTabs = (item) => {
    if (currentChart.value === item.name) return
    currentChart.value = item.name
    queryFundChart()
}

// 获取代币余额
const getAssetBalance = () => {
    assetBalanceLoading.value = true
    setTimeout(() => {
        assetBalanceLoading.value = false
    }, 500)
}

// 连接钱包
const startConnect = () => {
    executeConnect().then(() => {
        connectLoading.value = false
        getAssetBalance()
    }).catch(() => {
        connectLoading.value = false
    })
}

// 跳转到平台
const toPlatform = () => {
    // window.open('https://indexcoop.com')
}

onMounted(() => {
    // 获取基金详情
    queryFundDetail()
    // 获取基金行情图表走势图
    queryFundChart()
    // 连接狐狸钱包
    if (localGet('walletProvider')) {
        startConnect()
    }
})
</script>

<style lang="scss" scoped>
@import '../detail.scss'
</style>

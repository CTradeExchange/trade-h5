<template>
    <router-view />
    <div class='detail-module'>
        <div class='info-case'>
            <div class='info-case-1'>
                <el-skeleton animated :loading='loading' :rows='4'>
                    <template #default>
                        <div class='chain-info'>
                            <div class='left'>
                                <img class='icon' :src='"/images/tokens/"+ fund.thirdCoinCode?.toLowerCase() +".svg"' />
                                <span class='name'>
                                    {{ fund.thirdCoinCode }}
                                </span>
                            </div>
                            <div class='right'>
                                <img
                                    :src='"/images/markets/"+ fund.marketName.toLowerCase() +".svg"'
                                />
                                <span>{{ fund.marketName + (fund.networkName ? (' ' + fund.networkName) : '') }} Market</span>
                            </div>
                        </div>
                        <ul class='chain-row'>
                            <li>
                                <span class='label'>
                                    Platform
                                </span>
                                <div class='box' @click='toPlatform'>
                                    <img class='icon' :src='"/images/tokens/"+ fund.platformName?.toLowerCase() +".svg"' />
                                    <span class='value'>
                                        {{ fund.platformName }}
                                    </span>
                                </div>
                            </li>
                            <li>
                                <span class='label'>
                                    APY
                                </span>
                                <span class='value'>
                                    <span v-if='parseFloat(fund.apy) > 0 && parseFloat(fund.apy) < 0.01'>
                                        &lt; 0.01 %
                                    </span>
                                    <span v-else-if='parseFloat(fund.apy) === 0'>
                                        0 %
                                    </span>
                                    <span v-else>
                                        {{ toFixed(fund.apy) + ' %' }}
                                    </span>
                                </span>
                            </li>
                            <li>
                                <span class='label'>
                                    Total supplied
                                </span>
                                <span class='value'>
                                    {{ formatAmount(fund.savingsScale) }}
                                </span>
                            </li>
                        </ul>
                        <ul class='chain-row'>
                            <li>
                                <span class='label'>
                                    Reserve size
                                </span>
                                <span class='value'>
                                    ${{ formatAmount(fund.reserveSize) }}
                                </span>
                            </li>
                            <li>
                                <span class='label'>
                                    Available liquidity
                                </span>
                                <span class='value'>
                                    ${{ formatAmount(fund.availableFlowUsd) }}
                                </span>
                            </li>
                            <li>
                                <span class='label'>
                                    Utilization rate
                                </span>
                                <span class='value'>
                                    {{ toFixed(fund.capitalUseRatio) }}%
                                </span>
                            </li>
                            <li>
                                <span class='label'>
                                    Oracle price
                                </span>
                                <span class='value'>
                                    ${{ fund.price !='' ? formatAmount(fund.price) : '--' }}
                                </span>
                            </li>
                        </ul>
                    </template>
                </el-skeleton>
            </div>
            <div class='info-case-2'>
                <el-skeleton animated :loading='connectLoading' :rows='4'>
                    <template #default>
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
                                        {{ formatAmount(walletBalance, 5) }}
                                    </b>
                                    <span>{{ fund.thirdCoinCode }}</span>
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
                                    <span>{{ fund.thirdCoinCode }}</span>
                                </div>
                            </div>
                            <div class='handle'>
                                <button class='default' @click='openPurchaseDialog'>
                                    Purchase
                                </button>
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
                    </template>
                </el-skeleton>
            </div>
        </div>
        <div v-if='chartShow' v-loading='chartLoading' class='chart-case'>
            <h3 class='chart-title'></h3>
            <div ref='chartDom' class='chart-box'></div>
        </div>
    </div>

    <!-- 存款弹窗组件 -->
    <aave-purchase-dialog ref='aavePurchaseDialogRef' @purchaseSuccess='queryfundDetail' />
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { useChart } from './hooks.js'
import { formatAmount, toFixed, mul } from '@/utils/calculation'
import { marketDetail_AVVE, ratesHistory_AVVE } from '@/api/fund'
import { web3Hooks } from '@/plugins/web3/index'
import * as echarts from 'echarts'
import { localGet } from '@/utils/util'
import aavePurchaseDialog from '../components/aave-purchase-dialog.vue'

const store = useStore()
const route = useRoute()
const style = computed(() => store.state.style)
const userAddress = computed(() => store.state._web3.userAddress)
const { platformCode, assetId, marketId, chainId, decimals, version } = route.query
const {
    executeConnect,
    getUserBalance,
    getWalletBalance
} = web3Hooks()
const { newChart } = useChart()

// 当前申购数量转换成USD的数量
const usdCount = computed(() => {
    return walletBalance.value > 0 ? mul(walletBalance.value, fund.value.price) : 0
})
// ref元素
const aavePurchaseDialogRef = ref(null)
// 详情数据加载状态
const loading = ref(true)
// 基金详情数据
const fund = ref({})
// 图表元素
const chartDom = ref(null)
// 图表加载状态
const chartLoading = ref(true)
// 钱包连接中
const connectLoading = ref(false)
// 是否使用ETH申购
const isPurchaseETH = ref(false)
// 代币余额
const assetBalance = ref(0)
// 代币余额获取中
const assetBalanceLoading = ref(true)
// 是否显示金额说明
const showAmountPopover = ref(false)
// 钱包余额
const walletBalance = ref(0)

// 图表数据
const chartData = ref(null)
const chartShow = ref(true)

// 获取基金详情
const queryfundDetail = () => {
    marketDetail_AVVE({
        platformCode,
        assetId,
        marketId,
        chainId,
        version
    }).then(res => {
        loading.value = false
        fund.value = res.data
        isPurchaseETH.value = ['WETH', 'ETH'].includes(fund.value.thirdCoinCode)
    })
}

// 获取基金历史行情
const queryRatesHistory = () => {
    ratesHistory_AVVE({
        platformCode,
        assetId,
        marketId,
        chainId,
        version
    }).then(res => {
        const xData = []
        const yData = []
        const len = res.data.length
        const num = 6 * (7 * 4) // 只取6周的数据，一天有4条数据，一周28条数据，共168条数据
        const max = len > num ? len - num : 0
        chartData.value = res
        chartShow.value = true
        for (let i = len - 1; i >= max; i--) {
            const item = res.data[i]
            xData.unshift(window.dayjs(item.time).format('YYYY-MM-DD HH:mm:ss'))
            yData.unshift(toFixed(item.liquidityRate * 100))
        }
        const series = [{
            name: 'APY',
            type: 'line',
            showSymbol: false,
            data: yData,
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
        }]

        // 绘制图表
        newChart(chartDom.value, [xData, series], {
            'yAxis.ext': '%'
        })

        chartLoading.value = false
    }).catch(error => {
        chartShow.value = false
        chartLoading.value = false
    })
}

// 获取代币余额
const getAssetBalance = () => {
    assetBalanceLoading.value = true
    if (isPurchaseETH.value) {
        getUserBalance().then(res => {
            console.log('获取代币余额成功', res)
            assetBalanceLoading.value = false
            walletBalance.value = res || 0
            if (Number(res)) {
                const result = Number(res) - 0.001
                assetBalance.value = result > 0 ? result : 0
            } else {
                assetBalance.value = 0
            }
        }).catch(err => {
            console.log('获取代币余额失败', err)
            assetBalanceLoading.value = false
            assetBalance.value = 0
            walletBalance.value = 0
        })
    } else {
        getWalletBalance(chainId, assetId, decimals).then(res => {
            console.log('获取代币余额成功', res)
            assetBalanceLoading.value = false
            assetBalance.value = res || 0
            walletBalance.value = res || 0
        }).catch(err => {
            console.log('获取代币余额失败', err)
            assetBalanceLoading.value = false
            assetBalance.value = 0
            walletBalance.value = 0
        })
    }
}

// 跳转到平台
const toPlatform = () => {
    // window.open(fund.value.platformUrl)
}

// 打开申购弹窗
const openPurchaseDialog = () => {
    aavePurchaseDialogRef.value.open(fund.value)
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

onMounted(() => {
    // 连接狐狸钱包
    if (localGet('walletProvider')) {
        startConnect()
    }
    // 获取基金详情
    queryfundDetail()
    // 获取基金历史行情
    queryRatesHistory()
})
</script>

<style lang="scss" scoped>
@import '../detail.scss'
</style>

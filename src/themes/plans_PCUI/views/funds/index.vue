<template>
    <div class='page-wrap'>
        <router-view />
        <div class='page-content'>
            <!-- 侧边栏 -->
            <div class='page-side'>
                <side-bar :fund-id='fundId' @select='selectFund' />
            </div>
            <!-- 主体内容 -->
            <div id='page-main' class='page-main'>
                <div class='page-module'>
                    <!-- 基金模块 -->
                    <fund-module v-if="showModel === 'fundModule'" />
                    <!-- 基金详情 -->
                    <fund-detail v-if="showModel === 'fundDetail'" :key='fundId' :fund-id='fundId' />
                    <!-- 基金记录 -->
                    <fund-record v-if="showModel === 'fundRecord'" />
                    <!-- 现货成交记录 -->
                    <trans-records v-if="showModel === 'transRecords'" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, provide } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { useFund } from './hooks.js'
import { marketPerformance } from '@/api/trade'
import { QuoteSocket } from '@/plugins/socket/socket'
import sideBar from './components/side-bar.vue'
import fundModule from './components/fund-module.vue'
import fundDetail from './components/fund-detail.vue'
import fundRecord from './components/fund-record.vue'
import transRecords from './components/transRecords.vue'
import { reject } from '@/components/tradingview/datafeeds/udf/dist/polyfills.js'

const store = useStore()
const route = useRoute()
// 用户信息
const customerInfo = computed(() => store.state._user.customerInfo)
// 产品列表
const productList = computed(() => store.state._quote.productList)
// 当前显示的模块 fundModule:基金模块 fundDetail:基金详情 fundRecod:基金记录 transRecords:现货成交记录
const showModel = ref('fundModule')
// 当前申购赎回记录选中
const fundRecordAcitve = ref('')
// 当前基金详情交易模块选中
const dealActive = ref('')
// 基金api
const { getFundList, fundProductList } = useFund()
// 当前选择的基金id
const fundId = ref(Number(route.query.fundId) || '')
// 当前选择的基金产品
const fund = computed(() => fundProductList.value.find(el => el.fundId === fundId.value))
// 当前选择的基金产品索引
const fundIndex = computed(() => fundProductList.value.findIndex(el => el.fundId === fundId.value))
// 当前基金列表对应的产品
const curProductList = computed(() => {
    const result = []
    fundProductList.value.map(fund => {
        const list = productList.value.filter(product => Number(product.tradeType) === 5 && product.baseCurrency === fund.shareTokenCode)
        let elem = list.find(product => product.profitCurrency === 'USDT')
        if (!elem) elem = list[0]
        if (elem) {
            result.push(elem)
        } else {
            result.push({})
        }
    })
    return result
})
// 当前选中基金对应产品
const curProduct = computed(() => {
    let result = {}
    if (fund.value) {
        const list = productList.value.filter(product => Number(product.tradeType) === 5 && product.baseCurrency === fund.value.shareTokenCode)
        let elem = list.find(product => product.profitCurrency === 'USDT')
        if (!elem) elem = list[0] || {}
        result = elem
    }
    return result
})
// 基金列表基金净值数据
const netValueArrs = ref([])
// 基金列表市场价格数据
const marketPriceArrs = ref([])

// 获取市场表现走势图
const getMarketPerformanceData = (param) => {
    return new Promise(resolve => {
        marketPerformance({
            fundId: param.fundId,
            days: 36,
            type: 1
        }).then(res => {
            if (res.check()) {
                const keysArr = Object.keys(res.data)
                const netValueKey = keysArr[0]
                const netValueList = []
                const marketPriceKey = keysArr[1]
                const marketPriceList = []
                // 净值数据
                if (netValueKey) {
                    res.data[netValueKey].map(elem => {
                        netValueList.push(Number(elem.value))
                    })
                }
                // 市场价格数据
                if (marketPriceKey) {
                    res.data[marketPriceKey].map(elem => {
                        marketPriceList.push(Number(elem.value))
                    })
                }
                resolve({
                    netValueList,
                    marketPriceList
                })
            }
        })
    })
}

// 获取基金产品列表数据
const getProductList = () => {
    getFundList({ name: '', isRealTime: true }).then(() => {
        console.log('curProductList', curProductList.value)
        console.log('curProduct', curProduct.value)
        const productKeys = []
        curProductList.value.map(product => {
            productKeys.push(`${product.symbolId}_${product.tradeType}`)
        })

        // 发起行情订阅
        QuoteSocket.send_subscribe(productKeys)

        // 获取市场表现走势图
        const arr1 = []
        const arr2 = []
        fundProductList.value.map(async (fund, index) => {
            const result = await getMarketPerformanceData(fund)
            arr1.push(result.netValueList)
            arr2.push(result.marketPriceList)
            if (fundProductList.value.length - 1 === index) {
                netValueArrs.value = arr1
                marketPriceArrs.value = arr2
            }
        })
    })
}

// 选择基金
const selectFund = (value, active) => {
    const model = value ? 'fundDetail' : 'fundModule'
    fundId.value = value
    changeShowModel(model, active)
}

// 改变当前显示的模块
const changeShowModel = (model, active) => {
    showModel.value = model
    if (model === 'fundDetail') {
        dealActive.value = active || ''
    }
    if (model === 'fundRecord') {
        fundRecordAcitve.value = active || ''
    }
    // 设置滚动条距离
    document.getElementById('page-main').scrollTop = 0
}

provide('fundId', fundId)
provide('fundIndex', fundIndex)
provide('netValueArrs', netValueArrs)
provide('marketPriceArrs', marketPriceArrs)
provide('curProductList', curProductList)
provide('curProduct', curProduct)
provide('dealAcitve', dealActive)
provide('fundRecordAcitve', fundRecordAcitve)
provide('selectFund', selectFund)
provide('changeShowModel', changeShowModel)

onMounted(() => {
    document.body.style.overflow = 'hidden'
    // 有基金id默认显示基金详情模块
    if (fundId.value) {
        showModel.value = 'fundDetail'
    }
    // 获取基金产品列表数据
    getProductList()
    // 获取用户资产数据
    if (customerInfo.value) {
        store.dispatch('_user/queryCustomerAssetsInfo', { tradeType: 5 })
    }
})
onUnmounted(() => {
    document.body.style.overflow = 'visible'
    // 取消行情订阅
    QuoteSocket.cancel_subscribe()
})
</script>

<style lang='scss' scoped>
.page-wrap {
    line-height: 1.5;
    background: var(--bgColor);
}
.page-content {
    display: flex;
    height: calc(100vh - 64px);
    overflow: hidden;
}
.page-side {
    width: 300px;
    background: var(--contentColor);
    box-shadow: 3px 3px 20px rgb(0 0 0 / 9%);
    overflow-y: auto;
}
.page-main {
    flex: 1;
    padding: 16px 32px;
    overflow-y: auto;
}
.page-module {
    max-width: 1024px;
    min-width: 800px;
    margin: 0 auto;
}
</style>

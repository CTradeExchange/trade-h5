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
import { ref, onMounted, computed, provide } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { useFund } from './hooks.js'
import sideBar from './components/side-bar.vue'
import fundModule from './components/fund-module.vue'
import fundDetail from './components/fund-detail.vue'
import fundRecord from './components/fund-record.vue'
import transRecords from './components/transRecords.vue'

const store = useStore()
const route = useRoute()
// 用户信息
const customerInfo = computed(() => store.state._user.customerInfo)
// 产品列表
const productList = computed(() => store.state._quote.productList)
// 当前显示的模块 fundModule:基金模块 fundDetail:基金详情 fundRecod:基金记录 transRecrods:现货成交记录
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
// 当前产品
const product = computed(() => {
    let result = {}
    if (fund.value) {
        productList.value.map(product => {
            if (product.baseCurrency === fund.value.shareTokenCode && product.profitCurrency === 'USDT') {
                result = product
            }
        })
    }
    return result
})

// 获取基金产品列表数据
const getProductList = () => {
    getFundList({ name: '', isRealTime: true })
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
provide('dealAcitve', dealActive)
provide('fundRecordAcitve', fundRecordAcitve)
provide('selectFund', selectFund)
provide('changeShowModel', changeShowModel)

onMounted(() => {
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
    padding: 16px;
    overflow-y: auto;
}
.page-module {
    max-width: 1024px;
    margin: 0 auto;
}
</style>

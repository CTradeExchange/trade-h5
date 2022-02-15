<template>
    <div class='page-wrap'>
        <router-view />
        <div class='page-content'>
            <!-- 左侧模块 -->
            <div class='left-module module'>
                <!-- 基金产品列表 -->
                <fundList ref='fundListRef' @setFundProduct='setFundProduct' />
            </div>
            <!-- 中间模块 -->
            <div class='middle-module module'>
                <!-- 基金内容 -->
                <fundContent v-if='fund?.fundId' :fund='fund' />
            </div>
            <!-- 右侧模块 -->
            <div class='right-module module'>
                <!-- 基金交易 -->
                <fundDeal v-if='fund?.fundId' :key='fundDealKey' :fund='fund' />
            </div>
        </div>
        <!-- 申购记录、赎回记录、资产 -->
        <div class='record-content'>
            <userRecord ref='userRecordRef' />
        </div>
        <!-- 资产 -->
        <van-sticky class='assetsSticky' :offset-bottom='0' position='bottom'>
            <assetsModule />
        </van-sticky>
    </div>
</template>

<script setup>
import { ref, provide, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import fundList from './components/fundList.vue'
import fundContent from './components/fundContent.vue'
import fundDeal from './components/fundDeal.vue'
import userRecord from './components/userRecord.vue'
import assetsModule from './components/assetsModule.vue'

const store = useStore()
// 用户信息
const customerInfo = computed(() => store.state._user.customerInfo)
// 组件ref
const fundListRef = ref(null)
const userRecordRef = ref(null)
// 当前基金产品
const fund = ref({})
// 基金交易组件key值
const fundDealKey = ref('')

// 设置当前基金产品
const setFundProduct = (data) => {
    fund.value = data
    fundDealKey.value = Date.now()
}

// 申购或赎回后更新列表数据
provide('updateRecord', (value) => {
    switch (value) {
        // 更新申购记录
        case 'apply':
            userRecordRef.value.getApplyRecord()
            break
        // 更新赎回记录
        case 'redeem':
            userRecordRef.value.getRedeemRecord()
            break
    }
})
// 更新基金产品净值数据
provide('updateFundValue', () => {
    fundListRef.value.updateFundValue()
})

onMounted(() => {
    // 获取账户资产
    if (customerInfo.value) {
        store.dispatch('_user/queryCustomerAssetsInfo', { tradeType: 5 })
    }
})
</script>

<style lang="scss" scoped>
@import "@/sass/mixin.scss";
.page-wrap {
    font-size: 14px;
    padding: 8px;
    background: var(--bgColor);
}
.page-content {
    display: flex;
    min-width: 1200px;
    height: 785px;
    .module {
        border-radius: 10px;
        background: var(--contentColor);
        overflow-y: auto;
    }
    .left-module {
        width: 360px;
        margin-right: 8px;
    }
    .middle-module {
        flex: 1;
        margin-right: 8px;
    }
    .right-module {
        width: 360px;
    }
}
.record-content {
    margin-top: 8px;
}
.assetsSticky {
    :deep(.van-sticky--fixed) {
        box-shadow: 0 0 10px rgba(0,0,0,.15);
        background-color: var(--bgColor);
    }
}
</style>

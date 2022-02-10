<template>
    <div class='page-wrap'>
        <router-view />
        <div class='page-content'>
            <!-- 左侧模块 -->
            <div class='left-module module'>
                <!-- 基金产品列表 -->
                <fundList @setFundProduct='setFundProduct' />
            </div>
            <!-- 中间模块 -->
            <div class='middle-module module'>
                <!-- 基金内容 -->
                <fundContent v-if='fund?.fundId' :fund='fund' />
            </div>
            <!-- 右侧模块 -->
            <div class='right-module module'>
                <!-- 基金交易 -->
                <fundDeal v-if='fund?.fundId' :fund='fund' />
            </div>
        </div>
        <!-- 资产 -->
        <van-sticky class='assetsSticky' :offset-bottom='0' position='bottom'>
            <assetsModule />
        </van-sticky>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import fundList from './components/fundList.vue'
import fundContent from './components/fundContent.vue'
import fundDeal from './components/fundDeal.vue'
import assetsModule from './components/assets.vue'

const store = useStore()
// 当前基金产品
const fund = ref({})
// 设置当前基金产品
const setFundProduct = (data) => {
    fund.value = data
}

// 获取账户资产
store.dispatch('_user/queryCustomerAssetsInfo', { tradeType: 5 })
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
}
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
.assetsSticky {
    :deep(.van-sticky--fixed) {
        box-shadow: 0 0 10px rgba(0,0,0,.15);
        background-color: var(--bgColor);
    }
}
</style>

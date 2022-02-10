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
    </div>
</template>

<script setup>
import { ref } from 'vue'
import fundList from './components/fundList.vue'
import fundContent from './components/fundContent.vue'
import fundDeal from './components/fundDeal.vue'

// 当前基金产品
const fund = ref({})
// 设置当前基金产品
const setFundProduct = (data) => {
    fund.value = data
}
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
</style>

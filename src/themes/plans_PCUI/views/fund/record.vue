<template>
    <router-view />
    <div class='history-record'>
        <div class='header'>
            <div class='left'>
                <span class='title'>
                    申购赎回记录
                </span>
                <el-tabs v-model='activeName'>
                    <el-tab-pane label='申购记录' name='apply' />
                    <el-tab-pane label='赎回记录' name='redeem' />
                </el-tabs>
            </div>
            <!-- 申购记录过滤组件 -->
            <applyFilter
                v-if="activeName === 'apply'"
                :fund-product-list='fundProductList'
                @filter='getApplyRecord'
            />
            <!-- 赎回记录过滤组件 -->
            <redeemFilter
                v-if="activeName === 'redeem'"
                :fund-product-list='fundProductList'
                @filter='getRedeemRecord'
            />
        </div>
        <div class='case'>
            <!-- 申购记录 -->
            <applyRecord v-if="activeName === 'apply'" ref='applyRecordRef' show-page />
            <!-- 赎回记录 -->
            <redeemRecord v-if="activeName === 'redeem'" ref='redeemRecordRef' show-page />
        </div>
    </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useFund } from './hooks.js'
import applyRecord from './components/applyRecord.vue'
import redeemRecord from './components/redeemRecord.vue'
import applyFilter from './components/apply-filter.vue'
import redeemFilter from './components/redeem-filter.vue'

const route = useRoute()
// 组件ref
const applyRecordRef = ref(null)
const redeemRecordRef = ref(null)
// 当前选项卡 apply:申购记录  redeem:赎回记录
const activeName = ref(route.query.activeName || 'apply')
// 获取基金产品列表
const { getFundList, fundProductList } = useFund()

// 监听activeName
watch(activeName, (newVal) => {
    nextTick(() => {
        switch (newVal) {
            // 获取申购记录
            case 'apply':
                getApplyRecord({ size: 10, current: 1 })
                break
            // 获取赎回记录
            case 'redeem':
                getRedeemRecord({ size: 10, current: 1 })
                break
        }
    })
}, { immediate: true })

// 获取申购记录
const getApplyRecord = (params) => {
    applyRecordRef.value.getData(params)
}
// 获取赎回记录
const getRedeemRecord = (params) => {
    redeemRecordRef.value.getData(params)
}

onMounted(() => {
    getFundList()
})
</script>

<style lang="scss" scoped>
.history-record {
    margin: 8px;
    background: var(--contentColor);
    border-radius: 10px;
    min-height: 800px;
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 60px;
        position: relative;
        &::after {
            content: "";
            position: absolute;
            left: 0;
            bottom: -1px;
            width: 100%;
            height: 3px;
            background-color: var(--assistColor);
            z-index: var(--el-index-normal);
        }
        .left {
            display: inline-flex;
            align-items: center;
            .title {
                font-size: 16px;
                font-weight: bold;
                color: var(--color);
                margin: 0 50px 0 20px;
            }
            &:deep {
                .el-tabs {
                    height: 60px;
                }
                .el-tabs__item {
                    height: 60px;
                    line-height: 60px;
                    --el-text-color-primary: var(--normalColor);
                    user-select: none;
                    font-weight: 400;
                    color: var(--normalColor);
                    &.is-active {
                        font-weight: bold;
                        color: var(--primary);
                    }
                }
                .el-tabs__active-bar {
                    background-color: var(--primary);
                }
                .el-tabs__nav-wrap::after {
                    display: none;
                }
            }
        }
    }
    .case {
        padding: 10px;
    }
}
</style>

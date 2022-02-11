<template>
    <div class='record-module'>
        <div class='header'>
            <el-tabs v-model='activeName'>
                <el-tab-pane label='申购记录' name='apply' />
                <el-tab-pane label='赎回记录' name='redeem' />
                <el-tab-pane label='资产' name='assets' />
            </el-tabs>
            <span v-if="activeName !== 'assets'" class='link'>
                所有记录
            </span>
        </div>
        <div class='case'>
            <!-- 申购记录 -->
            <applyRecord v-if="activeName === 'apply'" />
            <!-- 赎回记录 -->
            <redeemRecord v-if="activeName === 'redeem'" />
            <!-- 资产 -->
            <assetsList v-if="activeName === 'assets'" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import applyRecord from './applyRecord.vue'
import redeemRecord from './redeemRecord.vue'
import assetsList from './assetsList'

// 当前选项卡 apply:申购记录  redeem:赎回记录 assets:资产
const activeName = ref('apply')
</script>

<style lang="scss" scoped>
@import "@/sass/mixin.scss";

.record-module {
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 16px;
        background: var(--contentColor);
        &:deep {
            .el-tabs {
                height: 40px;
            }
            .el-tabs__item {
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
        .link {
            color: var(--primary);
            cursor: pointer;
            &:hover {
                text-decoration: underline;
            }
        }
    }
    .case {
        padding: 0 16px;
        background: var(--contentColor);
    }
}
</style>

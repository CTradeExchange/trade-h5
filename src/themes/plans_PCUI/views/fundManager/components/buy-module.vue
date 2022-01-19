<template>
    <div class='buy-module'>
        <div class='header-case'>
            <el-tabs v-model='activeName'>
                <el-tab-pane :label="$t('fundManager.buy.title1')" name='first' />
                <el-tab-pane :label="$t('fundManager.buy.title2')" name='second' />
            </el-tabs>
            <div class='filter'>
                <div class='item'>
                    <el-input placeholder='申购订单号' />
                </div>
                <div class='item'>
                    <el-input placeholder='白标名称' />
                </div>
                <div class='item'>
                    <el-input placeholder='客户编号' />
                </div>
                <div class='item'>
                    <el-select placeholder='申购支付资产' />
                </div>
                <div class='item'>
                    <el-date-picker
                        end-placeholder='结束时间'
                        range-separator='-'
                        start-placeholder='开始时间'
                        type='daterange'
                    />
                </div>
                <el-button>搜索</el-button>
            </div>
        </div>
        <div class='body-case'>
        </div>
    </div>
</template>

<script setup>
import { ElTabs, ElTabPane, ElInput, ElDatePicker, ElButton } from 'element-plus'
import { ref } from 'vue'
const activeName = ref('first')
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.buy-module {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
    .header-case {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 60px;
        padding: 0 25px;
        background: var(--contentColor);
        border-radius: 10px 10px 0 0;
        &:deep {
            .el-tabs {
                height: 100%;
            }
            .el-tabs__header {
                margin: 0;
            }
            .el-tabs__nav {
                height: 60px;
            }
            .el-tabs__nav-wrap::after {
                display: none;
            }
            .el-tabs__active-bar {
                height: 3px;
            }
            .el-tabs__item {
                font-size: 16px;
                color: var(--normalColor);
                height: 60px;
                line-height: 60px;
                &.is-active {
                    color: var(--primary);
                }
            }
            .el-tabs__active-bar {
                background-color: var(--primary);
            }
        }
        .filter {
            display: flex;
            align-items: center;
        }
    }
    .body-case {
        flex: 1;
        padding: 0 20px;
        margin-top: 3px;
        background: var(--contentColor);
        border-radius: 0 0 10px 10px;
    }
}
</style>

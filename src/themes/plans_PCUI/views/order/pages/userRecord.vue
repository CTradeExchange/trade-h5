<template>
    <div class='userRecord'>
        <div class='headbar'>
            <el-tabs v-model='activeName' class='tabs'>
                <el-tab-pane label='当前委托' name='0' />
                <el-tab-pane label='成交记录' name='1' />
                <el-tab-pane label='资产' name='2' />
            </el-tabs>
            <div v-if='activeName === "1"' class='link'>
                {{ $t('trade.allTransaction') }}
            </div>
        </div>
        <div class='content'>
            <!-- 当前委托 -->
            <CurrentCommission v-show='activeName ==="0"' :common-options='commonOptions' :trade-type='tradeType' />
            <!-- 成交记录 -->
            <Transaction v-show='activeName ==="1"' :common-options='commonOptions' :trade-type='tradeType' />
            <!-- 资产 -->
            <AssetsList v-show='activeName ==="2"' :common-options='commonOptions' :trade-type='tradeType' />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, unref } from 'vue'
import { useStore } from 'vuex'
import { ElTabs, ElTabPane } from 'element-plus'
import CurrentCommission from './components/currentCommission'
import Transaction from './components/transaction'
import AssetsList from './components/assetsList'

const store = useStore()
const product = computed(() => store.getters.productActived)
const tradeType = computed(() => unref(product).tradeType)
const activeName = ref('0')

const commonOptions = {
    maxHeight: 350,
}
</script>

<style lang="scss" scoped>
.userRecord{
    display: flex;
    flex-direction: column;
    width: 100%;
    .headbar{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding: 0 16px;
         .tabs{
            height: 40px;
            :deep{
                .el-tabs__item{
                    --el-text-color-primary: var(--normalColor);
                    user-select: none;
                }
                .el-tabs__nav-wrap::after{
                    display: none;
                }
            }
        }
    }
    .link{
        cursor: pointer;
        user-select: none;
    }

    :deep{
        .table{
            background-color: var(--bgColor);
            .el-table__cell{
                background-color: var(--bgColor);
                color: var(--color);
            }
            .el-table__body{
                .el-table__cell{
                    padding: 8px 0;
                }
            }
        }
        .el-button{
            padding-top: 0;
            padding-bottom: 0;
        }
        .link{
            padding: 0 5px;
            cursor: pointer;
        }
    }
}
</style>

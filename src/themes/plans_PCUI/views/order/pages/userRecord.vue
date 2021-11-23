<template>
    <div class='userRecord'>
        <div class='headbar'>
            <el-tabs v-model='activeName' class='tabs'>
                <el-tab-pane :label='[1,2].includes(Number(tradeType)) ? "当前挂单" : $t("trade.curTrust")' name='0' />
                <el-tab-pane :label='$t("trade.dealList")' name='1' />
                <el-tab-pane :label='[1,2].includes(Number(tradeType)) ? $t("trade.position") : $t("trade.asset") ' name='2' />
            </el-tabs>
            <router-link v-if='activeName === "1"' class='link' :to="{ name: 'TransRecords', query: { tradeType } }">
                {{ $t('trade.allTransaction') }}
            </router-link>
        </div>
        <div v-if='mounted' class='content'>
            <!-- 当前委托 -->
            <CurrentCommission v-if='activeName ==="0"' :common-options='commonOptions' :trade-type='tradeType' />
            <!-- 成交记录 -->
            <Transaction v-if='activeName ==="1"' :common-options='commonOptions' :trade-type='tradeType' />
            <!-- 资产 -->
            <AssetsList v-if='activeName ==="2"' :common-options='commonOptions' :trade-type='tradeType' />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, unref, watch, nextTick } from 'vue'
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

// 不同table数据混在一起了
const mounted = ref(true)
watch(() => tradeType.value, async () => {
    // await nextTick()
    mounted.value = false
    await nextTick()
    mounted.value = true
})
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
                background: var(--bgColor)!important;
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

<template>
    <el-table :cell-style="{ background:'none' }" :data='accountList'>
        <el-table-column :label="$t('trade.name')" prop='currency' />
        <el-table-column :label="$t('trade.totalAssets')" prop='balance' />
        <el-table-column :label="$t('trade.free')" prop='available' />
        <el-table-column :label="$t('trade.frozen')" prop='frozen' />
        <el-table-column :label="$t('trade.carry')" prop='withdrawAmount' />
        <template #empty>
            <span class='emptyText'>
                {{ $t('c.noData') }}
            </span>
        </template>
    </el-table>
</template>

<script setup>
import { computed, defineProps } from 'vue'
import { useStore } from 'vuex'

const props = defineProps({
    // 玩法类型
    tradeType: {
        type: [Number, String],
        default: 5
    }
})

const store = useStore()
// 用户信息
const customerInfo = computed(() => store.state._user.customerInfo)
// 资产列表
const accountList = computed(() => customerInfo.value?.accountList?.filter(el => Number(el.tradeType) === Number(props.tradeType)) || [])
</script>

<style lang="scss" scoped>
@import "../table.scss"
</style>

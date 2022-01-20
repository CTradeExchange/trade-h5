<template>
    <div class='header-case'>
        <div class='filter'>
            <div class='item'>
                <el-input v-model='searchParams.orderNo' clearable :placeholder="$t('fundManager.buy.orderNo')" />
            </div>
            <div class='item'>
                <el-input v-model='searchParams.woName' clearable :placeholder="$t('fundManager.buy.woName')" />
            </div>
            <div class='item'>
                <el-input v-model='searchParams.customerNo' clearable :placeholder="$t('fundManager.buy.customerNo')" />
            </div>
            <div class='item'>
                <el-select v-model='searchParams.payCurrency' clearable :placeholder="$t('fundManager.buy.payCurrency')">
                    <el-option label='USDT' value='USDT' />
                    <el-option label='USD' value='USD' />
                    <el-option label='CNY' value='CNY' />
                </el-select>
            </div>
            <div class='item-date'>
                <el-date-picker
                    v-model='timeRange'
                    :end-placeholder="$t('compLang.endTime')"
                    range-separator='-'
                    :start-placeholder="$t('compLang.startTime')"
                    type='daterange'
                />
            </div>
            <button class='btn' @click='onSearch'>
                {{ $t('compLang.search') }}
            </button>
        </div>
    </div>
    <div class='body-case'>
        <el-table ref='tableRef' :cell-style="{ background:'none' }" :data='tableData' :empty-text="$t('c.noData')" @selection-change='selectionChange'>
            <el-table-column type='selection' width='50' />
            <el-table-column :label="$t('fundManager.buy.orderNo')" :min-width='minWidth' prop='orderNo' />
            <el-table-column :label="$t('fundManager.buy.woName')" :min-width='minWidth' prop='woName' />
            <el-table-column :label="$t('fundManager.buy.customerNo')" :min-width='minWidth' prop='customerNo' />
            <el-table-column :label="$t('fundManager.buy.money')" :min-width='minWidth' prop='amount' />
            <el-table-column :label="$t('fundManager.buy.payCurrency')" :min-width='minWidth' prop='payCurrency' />
            <el-table-column :label="$t('fundManager.buy.netWorth')" :min-width='minWidth' prop='netWorth' />
            <el-table-column :label="$t('fundManager.buy.status')" :min-width='minWidth' prop='status' />
            <el-table-column :label="$t('fundManager.buy.applyTime')" :min-width='156' prop='createTime' />
            <template #empty>
                <span class='emptyText'>
                    {{ $t('c.noData') }}
                </span>
            </template>
        </el-table>
        <div v-if='tableData.length > 0' class='handle-action'>
            <button :class="['btn', { 'disable': disableBtn }]" @click='openBuyDialog'>
                {{ $t('fundManager.buy.batchOrder') }}
            </button>
            <el-pagination
                v-model:currentPage='searchParams.page'
                layout='prev, pager, next, sizes'
                :page-size='searchParams.size'
                :page-sizes='[10, 50, 100, 200]'
                :total='total'
                @current-change='changePage'
                @size-change='changeSize'
            />
        </div>
    </div>

    <!-- 申购执行下单弹窗 -->
    <buy-dialog ref='buyDialogRef' @confirm='onConfirm' />
</template>

<script setup>
import buyDialog from './buy-dialog.vue'
import { ElInput, ElDatePicker } from 'element-plus'
import { ref, reactive, watch } from 'vue'

// 表格元素
const tableRef = ref(null)
// 批量下单元素
const buyDialogRef = ref(null)
// 选择的区间
const timeRange = ref([])
// 搜索参数
const searchParams = reactive({
    // 订单号
    orderNo: '',
    // 白标名称
    woName: '',
    // 客户编号
    customerNo: '',
    // 申购支付资产
    payCurrency: '',
    // 开始时间
    startTime: '',
    // 结束时间
    endTime: '',
    // 当前分页页数
    page: 1,
    // 分页数量
    size: 10
})
// 列表数据
const tableData = ref([])
for (let i = 0; i < 10; i++) {
    tableData.value.push({
        orderNo: '4498556551',
        woName: '辉煌环球',
        customerNo: '984554',
        amount: 2000,
        payCurrency: 'USDT',
        netWorth: '10USDT',
        status: '已执行',
        createTime: '2022-01-19 10:00:00'
    })
}
// 列表最小宽度
const minWidth = ref(130)
// 列表总数据量
const total = ref(100)
// 选择的列表数据
const selectList = ref([])
// 是否禁用批量下单按钮
const disableBtn = ref(true)

// 监听选择的列表数据
watch(selectList, () => {
    disableBtn.value = selectList.value.length === 0
})

// 点击搜索
const onSearch = () => {

}
// 改变当前页数
const changePage = (e) => {
    console.log('当前页数', e)
}
// 改变分页数量
const changeSize = (e) => {
    console.log('分页数量', e)
}
// 选择列表
const selectionChange = (list) => {
    selectList.value = list
}
// 打开批量下单弹窗
const openBuyDialog = () => {
    if (disableBtn.value) return
    buyDialogRef.value.open()
}
// 确定批量下单
const onConfirm = () => {
    console.log('确定批量下单')
    selectList.value = []
    tableRef.value.clearSelection()
}
</script>

<style lang="scss" scoped>
@import '../index.scss';
</style>

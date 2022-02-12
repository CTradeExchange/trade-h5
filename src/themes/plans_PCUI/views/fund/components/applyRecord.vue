<template>
    <div>
        <el-table v-loading='loading' :cell-style="{ background:'none' }" :data='list' :max-height='maxHeight'>
            <el-table-column label='订单号' :min-width='160' prop='proposalNo' />
            <el-table-column label='基金名称' :min-width='140' prop='fundName' />
            <el-table-column label='份额代币' :min-width='minWidth' prop='currencyShares' />
            <el-table-column label='申购金额' :min-width='minWidth' prop='amountPay' />
            <el-table-column label='净值' :min-width='minWidth' prop='sharesNet' />
            <el-table-column label='申购手续费' :min-width='minWidth' prop='fees' />
            <el-table-column label='申购份额' :min-width='minWidth' prop='shares' />
            <el-table-column label='份额确认状态' :min-width='120' prop='sharesStatus' />
            <el-table-column label='申请时间' :min-width='160'>
                <template #default='scope'>
                    <span>{{ formatTime(scope.row.createTime) }}</span>
                </template>
            </el-table-column>
            <template #empty>
                <span class='emptyText'>
                    {{ $t('c.noData') }}
                </span>
            </template>
        </el-table>
        <div v-if='list.length > 0 && showPage' class='handle-action'>
            <el-pagination
                v-model:currentPage='params.page'
                layout='prev, pager, next, sizes'
                :page-size='params.size'
                :page-sizes='[10, 20, 50, 100, 200]'
                :total='total'
                @current-change='changePage'
                @size-change='changeSize'
            />
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, defineExpose } from 'vue'
import { fundApplyRecord } from '@/api/fund.js'

defineProps({
    // table最大高度
    maxHeight: {
        type: String,
        default: 'auto'
    },
    // 是否显示分页组件
    showPage: {
        type: Boolean,
        default: false
    }
})

// 列表数据
const list = ref([])
// 加载状态
const loading = ref(false)
// 列表最小宽度
const minWidth = ref(100)
// 列表总数据量
const total = ref(0)
// 请求参数
const params = ref({
    size: 10,
    current: 1,
    currencyShares: '',
    startTime: ''
})

// 改变当前页数
const changePage = (value) => {
    params.value.current = value
    getData()
}
// 改变分页数量
const changeSize = (value) => {
    params.value.size = value
    params.value.current = 1
    getData()
}
// 获取数据
const getData = (data = {}) => {
    params.value = Object.assign({}, params.value, data)
    const result = Object.assign({}, params.value)
    result.currencyShares = result.currencyShares || null
    result.startTime = result.startTime || null
    loading.value = true
    fundApplyRecord(result).then(res => {
        loading.value = false
        if (res.check()) {
            const { data } = res
            list.value = data.records
            total.value = data.total
        }
    })
}

// 暴露子组件属性或方法
defineExpose({
    getData
})
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
@import '../table.scss';
.handle-action {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 60px;
}
</style>

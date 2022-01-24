<template>
    <div class='header-case'>
        <div class='filter'>
            <div class='item'>
                <el-input v-model='searchParams.proposalNo' clearable :placeholder="$t('fundManager.buy.orderNo')" />
            </div>
            <div class='item'>
                <el-input v-model='searchParams.executeId' clearable :placeholder="$t('fundManager.buy.executeNo')" />
            </div>
            <div class='item'>
                <el-select
                    v-model='searchParams.customerCompanyId'
                    clearable
                    filterable
                    :placeholder="$t('fundManager.buy.woName')"
                >
                    <el-option v-for='item in companyList' :key='item.id' :label='item.name' :value='item.id' />
                </el-select>
            </div>
            <div class='item'>
                <el-input v-model='searchParams.customerSelfNo' clearable :placeholder="$t('fundManager.buy.customerNo')" />
            </div>
            <div class='item'>
                <el-select
                    v-model='searchParams.currencyPay'
                    clearable
                    filterable
                    :placeholder="$t('fundManager.buy.payCurrency')"
                >
                    <el-option v-for='item in assetsList' :key='item.code' :label='item.code' :value='item.code' />
                </el-select>
            </div>
            <div class='item-date'>
                <el-date-picker
                    v-model='timeRange'
                    :end-placeholder="$t('compLang.endTime')"
                    range-separator='-'
                    :start-placeholder="$t('compLang.startTime')"
                    type='daterange'
                    value-format='YYYY-MM-DD'
                    @change='selectTime'
                />
            </div>
            <button class='btn' @click='onSearch'>
                {{ $t('compLang.search') }}
            </button>
        </div>
    </div>
    <div v-loading='isLoading' class='body-case'>
        <el-table ref='tableRef' :cell-style="{ background:'none' }" :data='tableData' :empty-text="$t('c.noData')">
            <el-table-column :label="$t('fundManager.buy.orderNo')" :min-width='minWidth' prop='proposalNo' />
            <el-table-column :label="$t('fundManager.buy.executeNo')" :min-width='minWidth' prop='executeId'>
                <template #default='scope'>
                    <span>{{ scope.row.executeId || '--' }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('fundManager.buy.woName')" :min-width='minWidth' prop='companyName' />
            <el-table-column :label="$t('fundManager.buy.customerNo')" :min-width='minWidth' prop='customerNo' />
            <el-table-column :label="$t('fundManager.buy.money')" :min-width='minWidth' prop='amountPay' />
            <el-table-column :label="$t('fundManager.buy.payCurrency')" :min-width='minWidth' prop='currencyPay' />
            <el-table-column :label="$t('fundManager.buy.netWorth')" :min-width='minWidth' prop='sharesNet' />
            <el-table-column :label="$t('fundManager.buy.status')" :min-width='minWidth'>
                <template #default='scope'>
                    <span>{{ $t('fundManager.confirmStatus.' + scope.row.sharesStatus) }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('fundManager.buy.standard')" :min-width='minWidth' prop='standard'>
                <template #default='scope'>
                    <el-popover
                        :content='formatStandard(scope.row.executeList)'
                        placement='bottom-start'
                        :show-arrow='false'
                        trigger='hover'
                        :width='200'
                    >
                        <template #reference>
                            <span class='standard-btn'>
                                {{ formatStandard(scope.row.executeList) }}
                            </span>
                        </template>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column :label="$t('fundManager.buy.applyTime')" :min-width='156' prop='createTime'>
                <template #default='scope'>
                    <span>{{ formatTime(scope.row.createTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('fundManager.buy.lastTime')" :min-width='156' prop='updateTime'>
                <template #default='scope'>
                    <span>{{ formatTime(scope.row.updateTime) }}</span>
                </template>
            </el-table-column>
            <template #empty>
                <span class='emptyText'>
                    {{ $t('c.noData') }}
                </span>
            </template>
        </el-table>
        <div v-if='tableData.length > 0' class='handle-action'>
            <span></span>
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
</template>

<script setup>
import { getCompanyList, getCompanyAssets, getFundApplyList } from '@/api/fund'
import { ElInput, ElDatePicker } from 'element-plus'
import { useStore } from 'vuex'
import { onMounted, ref, unref, reactive, computed } from 'vue'

const store = useStore()
// 用户信息
const customerInfo = unref(computed(() => store.state._user.customerInfo))
// 加载状态
const isLoading = ref(false)
// 公司列表
const companyList = ref([])
// 资产列表
const assetsList = ref([])
// 选择的区间
const timeRange = ref(null)
// 搜索参数
const searchParams = reactive({
    // 类型
    type: 2,
    // 用户组id
    customerGroupId: customerInfo.customerGroupId,
    // 订单号
    proposalNo: '',
    // 申购执行id
    executeId: '',
    // 白标名称
    customerCompanyId: '',
    // 客户编号
    customerSelfNo: '',
    // 申购支付资产
    currencyPay: '',
    // 开始时间
    startTime: null,
    // 结束时间
    endTime: null,
    // 当前分页页数
    current: 1,
    // 分页数量
    size: 10
})
// 列表数据
const tableData = ref([])

// 列表最小宽度
const minWidth = ref(100)
// 列表总数据量
const total = ref(100)

// 获取公司列表
const queryCompanyList = () => {
    getCompanyList().then(res => {
        companyList.value = res.data
    })
}
// 获取公司资产列表
const queryAssetsList = () => {
    getCompanyAssets({
        companyId: customerInfo.companyId
    }).then(res => {
        assetsList.value = res.data
    })
}
// 获取基金申购列表
const queryApplyList = () => {
    const params = Object.assign({}, searchParams)
    params.proposalNo = params.proposalNo ? params.proposalNo.split(',') : []
    params.customerSelfNo = params.customerSelfNo ? params.customerSelfNo.split(',') : []
    params.executeId = params.executeId ? params.executeId.split(',') : []
    params.customerCompanyId = params.customerCompanyId || null
    isLoading.value = true
    getFundApplyList(params).then(res => {
        isLoading.value = false
        if (res.check()) {
            const { data } = res
            tableData.value = data.records
            total.value = data.total
        }
    }).catch(() => {
        isLoading.value = false
    })
}
// 格式化下单执行标准数据
const formatStandard = (list) => {
    if (!list) return '--'
    let result = ''
    list.map(elem => {
        result += `${elem.symbolName} ${elem.rate}%、`
    })
    return result.substring(0, result.length - 1)
}
// 选择时间
const selectTime = () => {
    const value = timeRange.value
    if (value) {
        searchParams.startTime = window.dayjs(value[0]).valueOf('day')
        searchParams.endTime = window.dayjs(value[1]).endOf('day').valueOf()
    } else {
        searchParams.startTime = null
        searchParams.endTime = null
    }
}
// 改变当前页数
const changePage = (value) => {
    searchParams.current = value
    queryApplyList()
}
// 改变分页数量
const changeSize = (value) => {
    searchParams.size = value
    searchParams.current = 1
    queryApplyList()
}
// 点击搜索
const onSearch = () => {
    searchParams.current = 1
    queryApplyList()
}

onMounted(() => {
    // 获取公司列表
    queryCompanyList()
    // 获取公司资产列表
    queryAssetsList()
    // 获取基金申购列表
    queryApplyList()
})
</script>

<style lang="scss" scoped>
@import '../index.scss';
.standard-btn {
    @include ellipsis;
    cursor: pointer;
}
</style>

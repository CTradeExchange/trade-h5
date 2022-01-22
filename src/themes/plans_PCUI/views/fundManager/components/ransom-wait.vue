<template>
    <div class='header-case'>
        <div class='filter'>
            <div class='item'>
                <el-input v-model='searchParams.proposalNoList' clearable :placeholder="$t('fundManager.ransom.orderNo')" />
            </div>
            <div class='item'>
                <el-select
                    v-model='searchParams.custumerCompanyId'
                    clearable
                    filterable
                    :placeholder="$t('fundManager.ransom.woName')"
                >
                    <el-option v-for='item in companyList' :key='item.id' :label='item.name' :value='item.id' />
                </el-select>
            </div>
            <div class='item'>
                <el-input v-model='searchParams.custumerNoList' clearable :placeholder="$t('fundManager.ransom.customerNo')" />
            </div>
            <div class='item'>
                <el-select
                    v-model='searchParams.currencyPay'
                    clearable
                    filterable
                    :placeholder="$t('fundManager.ransom.receiveCurrency')"
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
    <div class='body-case'>
        <el-table ref='tableRef' :cell-style="{ background:'none' }" :data='tableData' :empty-text="$t('c.noData')" @selection-change='selectionChange'>
            <el-table-column type='selection' width='50' />
            <el-table-column :label="$t('fundManager.ransom.orderNo')" :min-width='minWidth' prop='orderNo' />
            <el-table-column :label="$t('fundManager.ransom.woName')" :min-width='minWidth' prop='woName' />
            <el-table-column :label="$t('fundManager.ransom.customerNo')" :min-width='minWidth' prop='customerNo' />
            <el-table-column :label="$t('fundManager.ransom.lot')" :min-width='minWidth' prop='amount' />
            <el-table-column :label="$t('fundManager.ransom.receiveCurrency')" :min-width='minWidth' prop='payCurrency' />
            <el-table-column :label="$t('fundManager.ransom.status')" :min-width='minWidth' prop='status' />
            <el-table-column :label="$t('fundManager.ransom.applyTime')" :min-width='156' prop='createTime' />
            <template #empty>
                <span class='emptyText'>
                    {{ $t('c.noData') }}
                </span>
            </template>
        </el-table>
        <div v-if='tableData.length > 0' class='handle-action'>
            <div class='left'>
                <button :class="['btn', { 'disable': disableBtn }]" @click='openLotDialog'>
                    {{ $t('fundManager.ransom.confirmLot') }}
                </button>
                <template v-if='!disableBtn'>
                    <span>{{ $t('fundManager.ransom.totalMoney') }}: {{ totalLot }}{{ currency }}</span>
                    <span>{{ $t('assets.free') }}: {{ usable }}{{ currency }}</span>
                </template>
            </div>
            <el-pagination
                v-model:currentPage='searchParams.current'
                layout='prev, pager, next, sizes'
                :page-size='searchParams.size'
                :page-sizes='[10, 50, 100, 200]'
                :total='total'
                @current-change='changePage'
                @size-change='changeSize'
            />
        </div>
    </div>

    <!-- 确认份额弹窗 -->
    <lot-dialog ref='lotDialogRef' @confirm='onConfirm' />
</template>

<script setup>
import lotDialog from './lot-dialog.vue'
import { getCompanyList, getCompanyAssets, getFundRedeemList } from '@/api/fund'
import { ElInput, ElDatePicker } from 'element-plus'
import { Toast } from 'vant'
import { onMounted, ref, unref, reactive, watch, computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

const store = useStore()
const { t } = useI18n({ useScope: 'global' })
// 用户信息
const customerInfo = unref(computed(() => store.state._user.customerInfo))
// 可用
const usable = computed(() => {
    if (currency.value) {
        const accountList = customerInfo?.accountList.filter(el => Number(el.tradeType) === 5)
        const account = accountList.find(el => el.currency === currency.value)
        return account.available
    }
    return ''
})
// 公司列表
const companyList = ref([])
// 资产列表
const assetsList = ref([])
// 表格元素
const tableRef = ref(null)
// 批量下单元素
const lotDialogRef = ref(null)
// 选择的区间
const timeRange = ref(null)
// 搜索参数
const searchParams = reactive({
    // 当前登陆的客户编号
    custumerNo: customerInfo.customerNo,
    // 赎回状态
    sharesStatus: 0,
    // 订单号
    proposalNoList: '',
    // 白标名称
    custumerCompanyId: '',
    // 客户编号
    custumerNoList: '',
    // 申购支付资产
    currencyRedeem: '',
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
for (let i = 0; i < 10; i++) {
    tableData.value.push({
        orderNo: '4498556551',
        woName: '辉煌环球',
        customerNo: '984554',
        amount: '2000',
        payCurrency: 'USDT',
        netWorth: '10USDT',
        status: '待确认',
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
// 总赎回份额
const totalLot = ref(0)
// 当前货币
const currency = ref('')

// 监听选择的列表数据
watch(selectList, () => {
    disableBtn.value = selectList.value.length === 0
})

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
// 获取基金赎回列表
const queryFundRedeemList = () => {
    const params = Object.assign({}, searchParams)
    params.custumerCompanyId = params.custumerCompanyId || null
    params.proposalNoList = params.proposalNoList ? params.proposalNoList.split(',') : null
    params.custumerNoList = params.custumerNoList ? params.custumerNoList.split(',') : null
    getFundRedeemList(params).then(res => {

    })
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
    queryFundRedeemList()
}
// 改变分页数量
const changeSize = (value) => {
    searchParams.current = 1
    searchParams.size = value
    queryFundRedeemList()
    console.log(searchParams)
}
// 点击搜索
const onSearch = () => {
    searchParams.current = 1
    queryFundRedeemList()
}
// 选择列表
const selectionChange = (list) => {
    selectList.value = list
    if (list.length > 0) {
        let total = 0
        list.map(elem => {
            total += parseFloat(elem.amount)
        })
        totalLot.value = total
        currency.value = list[0].payCurrency
    } else {
        totalLot.value = 0
        currency.value = ''
    }
}
// 打开确认份额弹窗
const openLotDialog = () => {
    if (disableBtn.value) return
    if (totalLot.value > usable.value) {
        return Toast(t('fundManager.ransom.tip4'))
    }
    lotDialogRef.value.open()
}
// 确认份额
const onConfirm = () => {
    selectList.value = []
    tableRef.value.clearSelection()
    searchParams.current = 1
    queryFundRedeemList()
}

onMounted(() => {
    // 获取公司列表
    queryCompanyList()
    // 获取公司资产列表
    queryAssetsList()
    // 获取基金赎回列表
    queryFundRedeemList()
})
</script>

<style lang="scss" scoped>
@import '../index.scss';
</style>

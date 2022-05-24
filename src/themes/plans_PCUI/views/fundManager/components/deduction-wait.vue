<template>
    <div class='header-case'>
        <div class='filter'>
            <div class='item-date'>
                <el-date-picker
                    v-model='listQuery.deductDate'
                    :placeholder="$t('fundManager.deduction.date')"
                    type='date'
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
        <el-table
            v-if='tableData.length > 0'
            ref='tableRef'
            :cell-style="{ background:'none' }"
            :data='tableData'
            :empty-text="$t('c.noData')"
            @selection-change='selectionChange'
        >
            <el-table-column type='selection' width='50' />
            <el-table-column :label="$t('fundManager.deduction.column1')" :min-width='140' prop='proposalNo' />
            <el-table-column :label="$t('fundManager.deduction.column2')" :min-width='minWidth' prop='companyName' />
            <el-table-column :label="$t('fundManager.deduction.column3')" :min-width='minWidth' prop='customerNo' />
            <template #empty>
                <span class='emptyText'>
                    {{ $t('c.noData') }}
                </span>
            </template>
        </el-table>
        <van-empty
            v-if='tableData.length === 0'
            :description="$t('api.listnone')"
            image='/images/empty.png'
        />
        <div v-if='tableData.length > 0' class='handle-action'>
            <div class='left'>
                <button :class="['btn', { 'disable': disableBtn }]" @click='openLotDialog("preview")'>
                    {{ $t('fundManager.ransom.preview') }}
                </button>
                <button :class="['btn', { 'disable': disableBtn }]" @click='openLotDialog("confirm")'>
                    {{ $t('fundManager.ransom.confirmLot') }}
                </button>
                <!-- <template v-if='!disableBtn'>
                    <span>{{ $t('fundManager.ransom.totalLot') }}: {{ totalLot }} {{ currency }}</span>
                    <span>{{ $t('assets.free') }}: {{ usable }} {{ currency }}</span>
                </template> -->
            </div>
            <el-pagination
                v-model:currentPage='listQuery.current'
                layout='prev, pager, next, sizes'
                :page-size='listQuery.size'
                :page-sizes='[10, 50, 100, 200]'
                :total='listQuery.total'
                @current-change='changePage'
                @size-change='changeSize'
            />
        </div>
    </div>

    <!-- 确认份额弹窗 -->
    <lot-dialog ref='lotDialogRef' :type='lotDialogType' @confirm='onConfirm' />
</template>

<script>
import { computed, toRefs, reactive, onMounted, ref, nextTick, watch } from 'vue'
import lotDialog from './lot-dialog.vue'
import { getManagementFeesList, getFundRedeemMoney } from '@/api/fund'
import { Toast } from 'vant'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

export default {
    components: {
        lotDialog
    },

    setup () {
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        // 用户信息
        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)
        const companyId = computed(() => customInfo.value.companyId)
        // 可用
        const usable = computed(() => {
            if (currency && currency !== 'self') {
                const accountList = customInfo.value?.accountList.filter(el => Number(el.tradeType) === 5)
                const account = accountList.find(el => el.currency === currency)
                return Number(account.available)
            }
            return ''
        })

        const state = reactive({
            listQuery: {
                customerNo: customInfo.value.customerNo,
                companyId: customInfo.value.companyId,
                deductDate: null,
                deductStatus: 1,
                current: 1,
                size: 10
            },
            loading: false,
            isLoading: false,
            companyList: [],
            tableRef: null,
            tableData: [],
            assetsList: [],
            minWidth: 130,
            total: 0,
            selectList: [],
            disableBtn: true,
            totalLot: 0,
            lotDialogRef: null,
            lotDialogType: 'preview'
        })

        // 弹窗类型
        // const lotDialogType = ref('preview') // preview 预览  confirm 确认份额

        // 监听选择的列表数据
        watch(state.selectList, () => {
            state.disableBtn = state.selectList.length === 0
        })

        // 获取基金赎回列表
        const queryFundRedeemList = () => {
            const params = state.listQuery
            // params.deductDate = params.deductDate || null
            state.isLoading = true
            console.log(params)
            getManagementFeesList(params).then(res => {
                state.isLoading = false
                console.log(res)
                if (res.check()) {
                    const { data } = res
                    state.tableData = data.records
                    state.total = data.total
                }
            }).catch(() => {
                state.isLoading = false
            })
        }
        // 获取基金产品赎回总金额
        const queryFundRedeemMoney = () => {
            const ids = state.selectList.map(elem => elem.id)
            getFundRedeemMoney({
                fundIdList: ids
            }).then(res => {
                if (res.check()) {
                    const { data } = res
                    state.totalLot = Number(data.sharesTotal)
                }
            })
        }
        // 选择时间
        const selectTime = () => {
            const value = state.listQuery.deductDate
            if (value) {
                state.listQuery.deductDate = window.dayjs(value).valueOf()
            } else {
                state.listQuery.deductDate = null
            }
        }
        // 改变当前页数
        const changePage = (value) => {
            state.listQuery.current = value
            queryFundRedeemList()
        }
        // 改变分页数量
        const changeSize = (value) => {
            state.listQuery.current = 1
            state.listQuery.size = value
            queryFundRedeemList()
        }
        // 点击搜索
        const onSearch = () => {
            state.listQuery.current = 1
            queryFundRedeemList()
        }
        // 选择列表
        const selectionChange = (list) => {
            state.selectList = list
            if (list.length > 0) {
                // 获取基金产品赎回总金额
                queryFundRedeemMoney()
                state.listQuery.currency = list[0].currencyRedeem
            } else {
                state.totalLot = 0
                state.listQuery.currency = ''
            }
        }
        // 打开确认份额弹窗
        const openLotDialog = async (type = 'preview') => {
            if (state.disableBtn) return
            // if (Number(totalLot) > Number(usable)) {
            //     return Toast(t('fundManager.ransom.tip1'))
            // }
            const ids = state.selectList.map(elem => elem.id)
            state.lotDialogType = type
            await nextTick()
            state.lotDialogRef.open(ids)
        }
        // 确认份额
        const onConfirm = () => {
            state.selectList = []
            state.tableRef.clearSelection()
            state.searchParams.current = 1
            queryFundRedeemList()
            // 查询用户信息
            store.dispatch('_user/findCustomerInfo', false)
        }
        const purchaseCurrencySetting = ref([]) // 申购资产设置
        // 获取基金产品详情
        const getFundInfo = () => {
            getFundInfoByCustomerNo().then(res => {
                if (res.check()) {
                    purchaseCurrencySetting = res.data.purchaseCurrencySetting.map(el => {
                        return {
                    ...el,
                    currencyName: el.currencyCode === 'self' ? t('fundManager.buy.basketAssets') : el.currencyName
                        }
                    })
                }
            })
        }

        onMounted(() => {
            // 获取基金赎回列表
            queryFundRedeemList()
        })

        return {
            customInfo,
            usable,
            // queryCompanyList,
            // queryAssetsList,
            queryFundRedeemList,
            // queryFundRedeemMoney,
            selectTime,
            changePage,
            changeSize,
            onSearch,
            selectionChange,
            openLotDialog,
            onConfirm,
            purchaseCurrencySetting,
            getFundInfo,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../index.scss';
</style>

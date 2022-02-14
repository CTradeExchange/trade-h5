<template>
    <div class='dialog-layer'>
        <el-dialog
            v-model='show'
            :before-close='close'
            :close-on-click-modal='false'
            :title="$t('fundManager.ransom.confirmLot')"
            width='520px'
        >
            <el-table v-loading='isLoading' border :cell-style="{ background:'none' }" :data='tableData'>
                <el-table-column align='center' :label="$t('fundManager.ransom.totalLot')">
                    <template #default='scope'>
                        <span>{{ scope.row.sharesTotal }}{{ scope.row.currencyShares }}</span>
                    </template>
                </el-table-column>
                <el-table-column align='center' :label="$t('fundManager.ransom.totalMoney')">
                    <template #default='scope'>
                        <span>{{ scope.row.amountTotal }}{{ scope.row.currencyRedeem }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <template #footer v-if='!isLoading'>
                <button v-loading='isSubmit' class='confirm-btn' @click='onConfirm'>
                    {{ $t('confirm') }}
                </button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { getFundRedeemMoney, confirmFundRedeem } from '@/api/fund'
import { ref, unref, computed, defineEmits, defineExpose } from 'vue'
import { useStore } from 'vuex'
import { Toast } from 'vant'
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['confirm'])
const store = useStore()
const { t } = useI18n({ useScope: 'global' })

// 用户信息
const customerInfo = unref(computed(() => store.state._user.customerInfo))
// 是否显示弹窗
const show = ref(false)
// 是否加载中
const isLoading = ref(false)
// 是否提交中
const isSubmit = ref(false)
// 基金产品id集合
const ids = ref([])
// 列表数据
const tableData = ref([])

// 获取基金产品赎回总金额
const queryFundRedeemMoney = () => {
    isLoading.value = true
    getFundRedeemMoney({
        fundIdList: ids.value
    }).then(res => {
        isLoading.value = false
        if (res.check()) {
            isSubmit.value = false
            show.value = true
            const { data } = res
            tableData.value = [data]
        }
    })
}
// 打开弹窗
const open = (list = []) => {
    ids.value = list
    // 获取基金产品赎回总金额
    queryFundRedeemMoney()
}
// 关闭弹窗
const close = () => {
    show.value = false
}
// 点击确定
const onConfirm = () => {
    if (isSubmit.value) return
    isSubmit.value = true
    confirmFundRedeem({
        fundIdList: ids.value
    }).then(res => {
        if (res.check()) {
            show.value = false
            Toast(t('c.handleSuccess'))
            emit('confirm')
        } else {
            isSubmit.value = false
        }
    }).catch(() => {
        isSubmit.value = false
    })
}

defineExpose({
    open
})
</script>

<style lang="scss" scoped>
.dialog-layer {
    .confirm-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 320px;
        height: 48px;
        margin: 0 auto;
        font-size: 16px;
        color: #fff;
        background: var(--primary);
        border-radius: 24px;
        cursor: pointer;
        &:hover {
            opacity: .9;
        }
    }
}
</style>

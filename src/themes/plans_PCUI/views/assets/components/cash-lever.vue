<template>
    <div class='assets-module'>
        <div class='assets-header'>
            <p class='all'>
                <span class='label'>
                    {{ $t('trade.totalAssets') }}({{ assetsInfo?.currency }})
                </span>
                <span class='risk'>
                    {{ $t('trade.riskLevel') }} {{ assetsInfo?.closeProportion }}
                </span>
            </p>
            <p class='total-money'>
                {{ assetsInfo?.totalBalance || '--' }}
            </p>
            <ul class='assets-ul'>
                <li>
                    <span>{{ $t('trade.netAssets') }}</span>
                    <strong>{{ assetsInfo?.totalNetAssets }}</strong>
                </li>
                <li>
                    <span>{{ $t('trade.totalLoan') }}</span>
                    <strong>{{ assetsInfo?.totalLiabilitiesPrincipal }}</strong>
                </li>
                <li>
                    <span>{{ $t('trade.swap_2') }}</span>
                    <strong>{{ assetsInfo?.totalInterest }}</strong>
                </li>
            </ul>
            <div class='assets-handle'>
                <button class='btn'>
                    {{ $t('trade.loan') }}
                </button>
                <button class='btn'>
                    {{ $t('trade.repayment') }}
                </button>
                <button class='btn' @click='goTransfer'>
                    {{ $t('trade.transfer') }}
                </button>
                <div class='record-link' @click='goRecord'>
                    <i class='icon_zijinmingxi1'></i>
                    <span>{{ $t('trade.fundRecord') }}</span>
                </div>
            </div>
        </div>
        <div class='assets-body'>
            <el-table :cell-style="{ background: 'none' }" :data='accountList' :empty-text="$t('c.noData')">
                <el-table-column :label="$t('trade.name')" prop='currency' />
                <el-table-column :label="$t('trade.totalAssets')" prop='balance' />
                <el-table-column :label="$t('trade.free')" prop='available' />
                <el-table-column :label="$t('trade.frozen')" prop='frozen' />
                <el-table-column :label="$t('trade.loan')" prop='liabilitiesPrincipal' />
                <el-table-column :label="$t('trade.swap_2')" prop='interest' />
                <el-table-column :label="$t('trade.carry')" prop='withdrawAmount' />
                <el-table-column align='right' fixed='right' :label="$t('c.handle')" width='120'>
                    <template #default>
                        <div class='handle'>
                            <button>{{ $t('trade.loan') }}</button>
                            <button>{{ $t('trade.repayment') }}</button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
    props: {
        // 玩法类型
        tradeType: {
            type: [String, Number],
            default: ''
        }
    },
    setup (props) {
        const store = useStore()
        // 用户信息
        const customerInfo = computed(() => store.state._user.customerInfo)
        // 资产信息
        const assetsInfo = computed(() => store.state._user.assetsInfo[props.tradeType])
        // 资产列表
        const accountList = computed(() => customerInfo.value?.accountList.filter(el => Number(el.tradeType) === props.tradeType))

        // 跳转到划转页面
        const goTransfer = () => {
            console.log('跳转到划转页面')
        }

        // 跳转到资金记录页面
        const goRecord = () => {
            console.log('跳转到资金记录页面')
        }

        return {
            assetsInfo,
            accountList,
            goTransfer,
            goRecord
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../assets.scss';
</style>

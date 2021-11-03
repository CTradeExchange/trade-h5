<template>
    <div class='assets-module'>
        <div class='assets-header'>
            <p class='all'>
                <span class='label'>
                    {{ $t('assets.totalAssets') }}({{ assetsInfo?.currency }})
                </span>
            </p>
            <p class='total-money'>
                {{ assetsInfo?.totalBalance }}
            </p>
            <div class='assets-handle'>
                <button class='btn' @click='goRecharge'>
                    {{ $t('assets.recharge') }}
                </button>
                <button class='btn' @click='goWithdraw'>
                    {{ $t('assets.withdraw') }}
                </button>
                <button class='btn' @click='goTransfer'>
                    {{ $t('assets.transfer') }}
                </button>
                <div class='record-link' @click='goRecord'>
                    <i class='icon_zijinmingxi1'></i>
                    <span>{{ $t('assets.fundRecord') }}</span>
                </div>
            </div>
        </div>
        <div class='assets-body'>
            <el-table :cell-style="{ background:'none' }" :data='accountList' :empty-text="$t('c.noData')">
                <el-table-column :label="$t('assets.name')" prop='currency' />
                <el-table-column :label="$t('assets.totalAssets')" prop='balance' />
                <el-table-column :label="$t('assets.free')" prop='available' />
                <el-table-column :label="$t('assets.frozen')" prop='frozen' />
                <el-table-column :label="$t('assets.carry')" prop='withdrawAmount' />
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

        // 跳转到充值页面
        const goRecharge = () => {
            console.log('跳转到充值页面')
        }

        // 跳转到提现页面
        const goWithdraw = () => {
            console.log('跳转到提现页面')
        }

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
            goRecharge,
            goWithdraw,
            goTransfer,
            goRecord
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../assets.scss';
</style>

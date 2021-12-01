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
                <button class='btn' @click='goLoan'>
                    {{ $t('trade.loan') }}
                </button>
                <button class='btn' @click='goRepayment'>
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
            <el-table :cell-style="{ background: 'none' }" :data='accountList' :empty-text="$t('c.noData')" height='100%'>
                <el-table-column :label="$t('trade.name')" prop='currency' />
                <el-table-column :label="$t('trade.totalAssets')" prop='balance' />
                <el-table-column :label="$t('trade.free')" prop='available' />
                <el-table-column :label="$t('trade.frozen')" prop='frozen' />
                <el-table-column :label="$t('trade.loan')" prop='liabilitiesPrincipal' />
                <el-table-column :label="$t('trade.swap_2')" prop='interest' />
                <el-table-column :label="$t('trade.carry')" prop='withdrawAmount' />
                <el-table-column v-if='accountList.length > 0' align='right' fixed='right' :label="$t('c.handle')" width='120'>
                    <template #default='scope'>
                        <div class='handle'>
                            <button @click='goLoan(scope.row)'>
                                {{ $t('trade.loan') }}
                            </button>
                            <button @click='goRepayment(scope.row)'>
                                {{ $t('trade.repayment') }}
                            </button>
                        </div>
                    </template>
                </el-table-column>
                <template #empty>
                    <span class='emptyText'>
                        {{ $t('c.noData') }}
                    </span>
                </template>
            </el-table>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

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
        const router = useRouter()
        // 用户信息
        const customerInfo = computed(() => store.state._user.customerInfo)
        // 资产信息
        const assetsInfo = computed(() => store.state._user.assetsInfo[props.tradeType])
        // 资产列表
        const accountList = computed(() => customerInfo.value?.accountList.filter(el => Number(el.tradeType) === props.tradeType))

        // 跳转到借款页面
        const goLoan = (row) => {
            if (row.accountId) {
                router.push({
                    path: '/assets/loan',
                    query: {
                        currency: row.currency,
                        accountId: row.accountId,
                        tradeType: props.tradeType
                    }
                })
            } else {
                router.push({
                    path: '/assets/chooseAccount',
                    query: {
                        accountId: assetsInfo.value.accountId,
                        tradeType: props.tradeType,
                        type: 1
                    }
                })
            }
        }

        // 跳转到还款页面
        const goRepayment = (row) => {
            if (row.accountId) {
                router.push({
                    path: '/assets/returnMoney',
                    query: {
                        currency: row.currency,
                        accountId: row.accountId,
                        tradeType: props.tradeType
                    }
                })
            } else {
                router.push({
                    path: '/assets/chooseAccount',
                    query: {
                        accountId: assetsInfo.value.accountId,
                        tradeType: props.tradeType,
                        type: 3
                    }
                })
            }
        }

        // 跳转到划转页面
        const goTransfer = () => {
            router.push({
                path: '/assets/transfer',
                query: {
                    tradeType: props.tradeType
                }
            })
        }

        // 跳转到资金记录页面
        const goRecord = () => {
            router.push({
                path: '/assets/record',
                query: {
                    accountId: assetsInfo.value.accountId,
                    tradeType: props.tradeType
                }
            })
        }

        return {
            assetsInfo,
            accountList,
            goLoan,
            goRepayment,
            goTransfer,
            goRecord
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../assets.scss';
</style>

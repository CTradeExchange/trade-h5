<template>
    <router-view />
    <div class='IndexFunds'>
        <div class='fund-list'>
            <div class='headerTitle'>
                <div class='left'>
                    <div class='titleTxt'>
                        Earning
                    </div>
                    <div class='titleSubTxt'>
                        Earn interest by depositing your assets.
                    </div>
                </div>
                <div class='right'>
                    <el-select
                        v-if='marketTypeList'
                        v-model='linkType'
                        class='linkSelect'
                        default-first-option
                        placeholder='Select Market'
                    >
                        <template #prefix>
                            <span class='smallIco'>
                                <img v-if='linkType === "Ethereum"' alt='#' class='icon' src='/images/markets/ethereum.svg' />
                            </span>
                        </template>
                        <el-option
                            v-for='(item, key) in marketTypeList'
                            :key='item'
                            :label='item'
                            :value='item'
                        >
                            <img alt='#' class='dropicon' :src='"/images/markets/"+ item.toLowerCase() +".svg"' />
                            <span class='black'>
                                {{ item }}
                            </span>
                        </el-option>
                    </el-select>
                </div>
            </div>
            <el-skeleton v-if='loading' animated class='skeleton-wrap'>
                <template #template>
                    <div v-for='item in 5' :key='item' class='skeleton-fild'>
                        <el-skeleton-item class='filed1' style='' variant='circle' />
                        <el-skeleton-item class='filed2' variant='text' />
                        <el-skeleton-item class='filed3' variant='text' />
                        <el-skeleton-item class='filed4' variant='text' />
                        <el-skeleton-item class='filed5' variant='button' />
                        <el-skeleton-item class='filed5' variant='button' />
                    </div>
                </template>
            </el-skeleton>
            <el-table
                v-else
                class='fundsTable'
                :data='tableData'
                :default-sort="{ prop: 'apy', order: 'descending' }"
                @row-click='handleClick'
                @row-contextmenu='setSession'
            >
                <el-table-column
                    label='Fund name'
                    prop='Name'
                    sortable
                    width='200'
                >
                    <template #default='scope' class='pro-link'>
                        <div class='proCell alink' @click='handleClick(scope.row)'>
                            <img
                                alt=''
                                class='currencyIcon'
                                onerror="this.src='/images/tokens/default.png'"
                                :src='getCoinUrl(scope.row.thirdCoinCode)'
                            />
                            <img
                                alt=''
                                class='currencyIcon small'
                                src='/images/tokens/aave.svg'
                            />
                        </div>
                        <div class='pro-name alink' @click='handleClick(scope.row)'>
                            <b class='black'>
                                {{ scope.row.thirdCoinCode }}
                            </b>
                            <span class='smallTxt'>
                                {{ scope.row.marketName }}
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label='APY'
                    prop='apy'
                    :sort-method='(a,b)=>{return a.apy - b.apy}'
                    sortable
                    width='260'
                >
                    <template #header>
                        <el-tooltip
                            content='Annual Percentage Yield(APY) is the projected interest on your deposit after one year'
                            effect='dark'
                            placement='top'
                        >
                            <span>
                                APY
                                <i class='el-icon-info'></i>
                            </span>
                        </el-tooltip>
                    </template>
                    <template #default='scope' class='pro-balance'>
                        <p class='black'>
                            <span v-if='parseFloat(scope.row.apy) > 0 && parseFloat(scope.row.apy) < 0.01'>
                                &lt; 0.01%
                            </span>
                            <span v-else-if='parseFloat(scope.row.apy) === 0'>
                                0%
                            </span>
                            <span v-else>
                                {{ toFixed(scope.row.apy)+'%' }}
                            </span>
                        </p>
                    </template>
                </el-table-column>
                <el-table-column
                    label='Total supplied'
                    prop='savingsScale'
                    :sort-method='(a,b)=>{return a.savingsScale - b.savingsScale}'
                    sortable
                >
                    <template #default='scope' class='pro-balance'>
                        <p class='black'>
                            {{ formatAmount(toFixed(scope.row.savingsScale)) }}
                        </p>
                        <p class='bottomText'>
                            $ {{ formatAmount(toFixed(scope.row.savingsScaleUsd)) }}
                        </p>
                    </template>
                </el-table-column>
                <el-table-column label='' prop='operta' width='280'>
                    <template #default='scope'>
                        <div class='handle'>
                            <button class='default' @click.stop='openPurchaseDialog(scope.row)'>
                                Purchase
                            </button>
                            <button class='easy' @click='handleClick(scope.row)'>
                                Details
                            </button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>

    <!-- 存款弹窗组件 -->
    <aave-purchase-dialog ref='aavePurchaseDialogRef' />
</template>

<script>
import { ref, toRefs, reactive, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { toFixed, formatAmount, mul } from '@/utils/calculation'
import { localGet, sessionSet } from '@/utils/util'
import aavePurchaseDialog from '../components/aave-purchase-dialog.vue'
import { web3Hooks } from '@/plugins/web3/index'

export default {
    components: {
        aavePurchaseDialog
    },
    setup (props, context) {
        const store = useStore()
        const router = useRouter()
        const { executeConnect } = web3Hooks()
        // ref元素
        const aavePurchaseDialogRef = ref(null)
        const state = reactive({
            loading: true,
            linkType: 'Ethereum'
        })

        const testnetMode = computed(() => store.state._web3.testnetMode)
        const tableData = computed(() => {
            if (testnetMode.value) {
                return store.state._web3?.aaveProducts.filter(el => el.networkType === 2)
            } else {
                return store.state._web3?.aaveProducts.filter(el => el.networkType === 1)
            }
        })

        const marketTypeList = computed(() => {
            return [...new Set(tableData.value?.map(el => el.marketName))] || []
        })

        // state.linkType = marketTypeList.value[0]

        const handleClick = row => {
            router.push({
                path: '/earning/detail',
                query: {
                    platformCode: row.platformCode,
                    assetId: row.assetId,
                    marketId: row.marketId,
                    chainId: row.chainId,
                    decimals: row.decimals,
                    version: row.version
                }
            })
        }

        // 打开申购弹窗
        const openPurchaseDialog = (row) => {
            aavePurchaseDialogRef.value.open(row)
        }
        const getCoinUrl = (code) => {
            if (!code) return ''
            const coinName = code.split('.')
            if (coinName[0]) {
                return '/images/tokens/' + coinName[0].toLowerCase() + '.svg'
            } else {
                return '/images/tokens/' + coinName.toLowerCase() + '.svg'
            }
        }
        const setSession = row => {
            sessionSet('AAVE_productActived', JSON.stringify(row))
        }

        onMounted(async () => {
            // 获取列表数据
            await store.dispatch('_web3/getAAVEMarkets')
            state.loading = false
            // 连接狐狸钱包
            // if (localGet('walletProvider')) {
            //     executeConnect()
            // }
        })

        return {
            ...toRefs(state),
            router,
            toFixed,
            formatAmount,
            mul,
            aavePurchaseDialogRef,
            openPurchaseDialog,
            tableData,
            handleClick,
            getCoinUrl,
            marketTypeList,
            setSession
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../fundDEX.scss';

</style>

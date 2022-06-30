<template>
    <router-view />
    <div class='dashboard'>
        <div v-if='_web3.userAddress'>
            <el-tabs
                v-model='activeType'
                class='tabs'
                tab-position='top'
                @tab-click='handleChangeTab'
            >
                <el-tab-pane label='Earning' name='Earning' />
                <el-tab-pane label='IndexFunds' name='IndexFunds' />
            </el-tabs>

            <div v-if="activeType === 'Earning'" class='earning-warp'>
                <el-skeleton v-show='loading' animated class='skeleton-wrap'>
                    <template #template>
                        <div class='skeleton-item'>
                            <div v-for='item in 3' :key='item' class='skeleton-fild'>
                                <el-skeleton-item class='filed1' variant='circle' />
                                <el-skeleton-item class='filed2' variant='text' />
                                <el-skeleton-item class='filed3' variant='text' />
                                <el-skeleton-item class='filed4' variant='text' />
                                <el-skeleton-item class='filed5' variant='button' />
                                <el-skeleton-item class='filed5' variant='button' />
                            </div>
                        </div>
                    </template>
                </el-skeleton>
                <div v-if='fildterMarket.length > 0' class='dashboardTable'>
                    <p class='header-title'>
                        Your portfolio
                    </p>
                    <el-collapse v-model='activeNames'>
                        <el-collapse-item v-for='(data, key) in fildterMarket' :key='key' :name='data.networkType +"_"+ data.marketName'>
                            <template #title>
                                <div class='title'>
                                    <img alt='' class='currencyIcon symbolCurrencyIcon' :src='"/images/markets/"+ data.marketName.toLowerCase() +".svg"' />

                                    <span v-if='data.networkType === 2' class='testnet'>
                                        {{ data.networkName.substr(0,1) }}
                                    </span>
                                    {{ data.marketName }} Market
                                    <div class='collapseItem'>
                                        <span>Show <i class='el-icon-plus'></i></span>
                                        <em>Hide <i class='el-icon-minus'></i></em>
                                    </div>
                                </div>
                            </template>
                            <div class='fund-list'>
                                <!-- <el-checkbox>
                            Show assets with 0 balance
                        </el-checkbox> -->

                                <el-table
                                    v-if='filterData(data).length > 0'
                                    class='fundsTable'
                                    :data='filterData(data)'
                                    :default-sort="{ prop: 'apy', order: 'descending' }"
                                    @row-contextmenu='setSession'
                                >
                                    <el-table-column label='Assets' prop='Name' sortable width='160'>
                                        <template #default='scope' class='pro-link'>
                                            <div class='alink' @click='handleClick(scope.row)'>
                                                <img alt='' class='currencyIcon' :src='"/images/tokens/"+ scope.row.thirdCoinCode.toLowerCase() +".svg"' />
                                                <img
                                                    alt=''
                                                    class='mark'
                                                    src='/images/tokens/aave.svg'
                                                />
                                                <b class='black'>
                                                    {{ scope.row.thirdCoinCode }}
                                                </b>
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label='Balance' prop='balance' sortable width='280'>
                                        <template #default='scope' class='pro-balance'>
                                            <p class='black'>
                                                {{ toFixed(scope.row.balance,7) }}
                                            </p>
                                            <p v-if='scope.row.usd<0.01 && scope.row.usd>0' class='bottomText'>
                                                &lt; $ 0.01
                                            </p>
                                            <p v-else class='bottomText'>
                                                $ {{ toFixed(scope.row.usd,2) }}
                                            </p>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        label='APY'
                                        prop='apy'
                                        :sort-method='(a,b)=>{return a.apy - b.apy}'
                                        sortable
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
                                                    &lt; 0.01 %
                                                </span>
                                                <span v-else-if='parseFloat(scope.row.apy) === 0'>
                                                    0 %
                                                </span>
                                                <span v-else>
                                                    {{ toFixed(scope.row.apy) + ' %' }}
                                                </span>
                                            </p>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label='' prop='operta' width='280'>
                                        <template #default='scope'>
                                            <div class='btns handle'>
                                                <button class='default' @click.stop='openPurchaseDialog(scope.row)'>
                                                    Purchase
                                                </button>
                                                <button class='easy' @click.stop='openWithdrawDialog(scope.row)'>
                                                    Redeem
                                                </button>
                                            </div>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <div v-else class='no-data'>
                                    No holding yet
                                </div>
                            </div>
                        </el-collapse-item>
                    </el-collapse>
                </div>
                <div v-else class='all-no-data'>
                    <div class='empty-icon-wrap'>
                        <svg
                            fill='currentColor'
                            height='50px'
                            stroke='currentColor'
                            stroke-width='0'
                            viewBox='0 0 24 24'
                            width='50px'
                            xmlns='http://www.w3.org/2000/svg'
                        >
                            <g><path d='M0 0h24v24H0z' fill='none' /><path d='M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm2-1.645A3.502 3.502 0 0 0 12 6.5a3.501 3.501 0 0 0-3.433 2.813l1.962.393A1.5 1.5 0 1 1 12 11.5a1 1 0 0 0-1 1V14h2v-.645z' /></g>
                        </svg>
                    </div>

                    <h2 class='text'>
                        No holding yet
                    </h2>
                    <button class='button' @click='toMarkets'>
                        Purchase now
                    </button>
                </div>
            </div>

            <div v-else class='indexfund-wrap all-no-data'>
                <div class='empty-icon-wrap'>
                    <svg
                        class='icon'
                        height='50'
                        p-id='626'
                        t='1656557255035'
                        version='1.1'
                        viewBox='0 0 1024 1024'
                        width='50'
                        xmlns='http://www.w3.org/2000/svg'
                    >
                        <path d='M527.226285 47.307446c-247.27171 0-447.724091 200.453405-447.724091 447.724091 0 247.27171 200.453405 447.724091 447.724091 447.724091 247.270686 0 447.723068-200.453405 447.723068-447.724091C974.950376 247.76085 774.496971 47.307446 527.226285 47.307446zM527.226285 921.361365c-235.455593 0-426.329828-190.874235-426.329828-426.329828s190.874235-426.329828 426.329828-426.329828c235.455593 0 426.329828 190.874235 426.329828 426.329828S762.681878 921.361365 527.226285 921.361365z' p-id='627' /><path d='M519.333524 262.141372m-37.521568 0a36.667 36.667 0 1 0 75.043137 0 36.667 36.667 0 1 0-75.043137 0Z' p-id='628' /><path d='M698.396759 304.396755c-12.43624-11.958356-32.211633-11.5695-44.168965 0.86674-11.958356 12.435217-11.570523 32.212656 0.86674 44.169989l63.800072 61.346183c12.43624 11.958356 32.212656 11.5695 44.169989-0.865717 11.958356-12.43624 11.570523-32.212656-0.86674-44.169989L698.396759 304.396755z' p-id='629' /><path d='M385.729643 305.008692c-12.093433-12.577456-32.027437-13.032828-44.525076-1.016143l-64.11218 61.646012c-12.497639 12.015661-12.824073 31.953759-0.730641 44.532239 12.093433 12.576433 32.028461 13.031804 44.526099 1.016143l64.111157-61.646012C397.496641 337.523223 397.823076 317.585125 385.729643 305.008692z' p-id='630' /><path d='M659.275763 637.960807c30.05041-33.363875 48.346101-77.523631 48.346101-125.960807 0-103.989399-84.299965-188.288341-188.288341-188.288341-103.989399 0-188.288341 84.298941-188.288341 188.288341 0 49.172933 18.857487 93.936439 49.725518 127.47223l-37.676088 36.226063c-12.497639 12.015661-12.824073 31.954783-0.730641 44.532239s32.028461 13.031804 44.526099 1.016143l44.461631-42.750663c26.260084 13.905708 56.196906 21.792329 87.98182 21.792329 32.816406 0 63.668065-8.402367 90.531899-23.162536l45.889143 44.122917c12.43624 11.958356 32.212656 11.5695 44.169989-0.86674s11.570523-32.212656-0.86674-44.169989L659.275763 637.960807zM511.148098 547.815717c-0.425695 0-0.843204-0.033769-1.261737-0.064468-0.418532 0.029676-0.836041 0.064468-1.261737 0.064468-9.721409 0-17.602913-7.880481-17.602913-17.602913L491.021711 401.177985c0-9.721409 7.881504-17.602913 17.602913-17.602913 9.721409 0 17.602913 7.881504 17.602913 17.602913l0 111.431905 101.674681 0c9.722432 0 17.602913 7.881504 17.602913 17.602913 0 9.722432-7.880481 17.602913-17.602913 17.602913L511.148098 547.815717z' p-id='631' />
                    </svg>
                </div>

                <h2 class='text'>
                    Coming Soon
                </h2>
            </div>
        </div>
        <div v-else class='no-login-wrap'>
            <div class='empty-icon-wrap'>
                <svg
                    :fill='$style.color'
                    height='44px'
                    stroke='currentColor'
                    stroke-width='0'
                    viewBox='0 0 512 512'
                    width='44px'
                    xmlns='http://www.w3.org/2000/svg'
                >
                    <path d='M461.2 128H80c-8.84 0-16-7.16-16-16s7.16-16 16-16h384c8.84 0 16-7.16 16-16 0-26.51-21.49-48-48-48H64C28.65 32 0 60.65 0 96v320c0 35.35 28.65 64 64 64h397.2c28.02 0 50.8-21.53 50.8-48V176c0-26.47-22.78-48-50.8-48zM416 336c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32z' />
                </svg>
                <div class='close-wrap'>
                    <svg
                        class='close-icon'
                        fill='currentColor'
                        height='20px'
                        stroke='currentColor'
                        stroke-width='0'
                        viewBox='0 0 512 512'
                        width='20px'
                        xmlns='http://www.w3.org/2000/svg'
                    >
                        <path d='M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z' />
                    </svg>
                </div>
            </div>
            <h2 class='text1'>
                Wallet not connected
            </h2>
            <p class='text2'>
                Please connect your wallet to see your Portfolio
            </p>
            <button class='connect-btn' type='button' @click='handleConnect'>
                Connect wallet
            </button>
        </div>
    </div>

    <!-- 存款弹窗组件 -->
    <aave-purchase-dialog ref='aavePurchaseDialogRef' />
    <!-- 取款弹窗组件 -->
    <aave-withdraw-dialog ref='aaveWithdrawDialogRef' />
</template>

<script>
import { computed, onUnmounted, ref, unref, toRefs, reactive, watch, onMounted, getCurrentInstance, provide } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { marketList_AAVE } from '@/api/fund'
import { toFixed, mul, divide, pow } from '@/utils/calculation'
import Web3, { utils } from 'web3'
import networkConfigs from '@/plugins/web3/config/networkConfigs'
import { abi_token } from '@/plugins/web3/abi/index'
import { localGet, sessionSet } from '@/utils/util'
import SupplyDialog from '../components/supply-dialog.vue'
import TypeScroll from '../components/type-list-scroll.vue'
import aavePurchaseDialog from '../components/aave-purchase-dialog.vue'
import aaveWithdrawDialog from '../components/aave-withdraw-dialog.vue'
import { web3Hooks } from '@/plugins/web3/index'
import { getBaseUrl } from '@/plugins/web3/config/infuraConfig.js'

export default {
    components: {
        TypeScroll,
        aavePurchaseDialog,
        aaveWithdrawDialog
    },
    props: {},
    setup (props, context) {
        const { ctx: _this } = getCurrentInstance()
        const store = useStore()
        const router = useRouter()
        const {
            executeConnect,
        } = web3Hooks()

        const state = reactive({
            loading: true,
            activeType: 'Earning',
            marketList: [], // 过滤后的市场数据
            marketListData: [], // 行情原始数据
            activeMarket: 'all',
            active: 0

        })

        // web3连接信息
        const _web3 = computed(() => store.state._web3)
        const activeNames = computed(() => {
            return state.marketList.map(el => `${el.networkType}_${el.marketName}`)
        })

        const fildterMarket = computed(() => {
            let temp = []
            if (_web3.value.testnetMode) {
                if (state.activeMarket === 'all') {
                    temp = state.marketList.filter(el => el.networkType === 2)
                } else {
                    temp = state.marketList.filter(el => el.marketName === state.activeMarket.marketName && el.networkType === state.activeMarket.networkType && el.networkType === 2)
                }
            } else {
                if (state.activeMarket === 'all') {
                    temp = state.marketList.filter(el => el.networkType === 1)
                } else {
                    temp = state.marketList.filter(el => el.marketName === state.activeMarket.marketName && el.networkType === state.activeMarket.networkType && el.networkType === 1)
                }
            }

            return temp.filter(el => el.arr.length > 0 && el.arr.filter(ar => ar.balance > 0).length > 0)
        })

        // ref元素
        const aavePurchaseDialogRef = ref(null)
        const aaveWithdrawDialogRef = ref(null)

        const handleConnect = () => {
            executeConnect()
        }

        const handleGoList = () => {
            if (state.activeType === 'Earning') {
                router.push({
                    path: '/Staking',
                    query: {
                    }
                })
            }
            if (state.activeType === 'IndexFunds') {
                router.push({
                    path: '/IndexFunds',
                    query: {
                    }
                })
            }
        }

        // 打开申购弹窗
        const openPurchaseDialog = (row) => {
            aavePurchaseDialogRef.value.open(row)
        }

        // 打开提现弹窗
        const openWithdrawDialog = (row) => {
            console.log(row)
            aaveWithdrawDialogRef.value.open(row)
        }
        const handleChangeTab = (type) => {
            console.log('type====', type)
            state.active = type
        }

        const toMarkets = () => {
            router.push('/earning')
        }

        const getBalance = async () => {
            state.marketList = []
            await state.marketListData.forEach(async (el) => {
                el.usd = 0
                el.balance = 0

                // 组装市场数据
                const flag = state.marketList.find(item => el.marketName === item.marketName && el.networkType === item.networkType)

                if (flag) {
                    state.marketList.find(ml => ml.marketName === el.marketName && ml.networkType === el.networkType).arr.push(el)
                } else {
                    const mlObj = {
                        networkType: el.networkType,
                        marketName: el.marketName,
                        networkName: el.networkName,
                        arr: [el]
                    }
                    state.marketList.push(mlObj)
                }

                // 查询链上余额
                if (_web3.value.userAddress) {
                    const networkName = networkConfigs[el.chainId].infuraName
                    if (!networkName) return
                    // const baseUrl = `https://${networkName}.infura.io/v3/${infuraProjectId}`
                    const baseUrl = getBaseUrl(networkName)
                    const web3 = new Web3(new Web3.providers.HttpProvider(baseUrl))
                    var myContract = new web3.eth.Contract(abi_token, el.aTokenAddress)

                    try {
                        const balance = await myContract.methods
                            .balanceOf(_web3.value.userAddress)
                            .call()

                        const bal = divide(balance, pow(10, el.decimals))
                        el.usd = mul(bal, el.price)
                        el.balance = bal
                    } catch (error) {
                        console.log('error', error)
                    }
                }
            })
            state.loading = false
        }

        const filterData = data => {
            return data.arr.filter(el => el.balance > 0)
        }

        const switchMarket = obj => {
            state.activeMarket = obj
        }

        const aaveProducts = computed(() => store.state._web3.aaveProducts)

        watch(() => aaveProducts.value, val => {
            if (val.length > 0) {
                state.marketListData = []
                state.marketListData = val
                getBalance()
            }
        })

        watch(() => _web3.value.userAddress, val => {
            if (val) {
                store.dispatch('_web3/getAAVEMarkets')
            }
        })

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
        const setSession = row => {
            sessionSet('AAVE_productActived', JSON.stringify(row))
        }

        onMounted(async () => {
            if (localGet('walletProvider')) {
                // await executeConnect()
                store.dispatch('_web3/getAAVEMarkets')
            }
        })

        return {
            ...toRefs(state),
            handleGoList,
            toFixed,
            switchMarket,
            fildterMarket,
            filterData,
            activeNames,
            _web3,
            aavePurchaseDialogRef,
            aaveWithdrawDialogRef,
            openPurchaseDialog,
            openWithdrawDialog,
            handleConnect,
            handleChangeTab,
            handleClick,
            setSession,
            toMarkets
        }
    }
}

</script>

<style lang="scss" scoped>
@import '../fundDEX.scss';

</style>

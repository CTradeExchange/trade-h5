<template>
    <!--赎回-->
    <div class='purchase-dialog'>
        <van-popup v-model:show='show' @click-overlay='close'>
            <div class='popup-model'>
                <div class='model-header'>
                    <strong class='title'>
                        Withdraw {{ fund.thirdCoinCode }}
                    </strong>
                    <van-icon class='close' name='cross' @click='close' />
                </div>
                <div class='model-content'>
                    <div v-if='!isSuccess' class='withdrawBox'>
                        <div v-if='Number(fund.chainId) !== Number(networkId)' class='network-warn'>
                            <p>Please switch to {{ fund.marketName }} {{ fund.networkName }}.</p>
                            <p>
                                <button @click='switchNetworkFn(fund.chainId)'>
                                    Switch Network
                                </button>
                            </p>
                        </div>
                        <div class='block'>
                            <div class='title'>
                                <label>Amount</label>
                            </div>
                            <div class='box'>
                                <div class='row-1'>
                                    <input v-model='withdrawVal' placeholder='0.00' type='text' @input='onValueChange' />
                                    <div class='coin'>
                                        <!--<img src='https://app.aave.com/icons/tokens/busd.svg' />-->
                                        <img v-if='fund.thirdCoinCode' class='icon' :src='"/images/tokens/"+ fund.thirdCoinCode.toLowerCase() +".svg"' />
                                        <span>{{ fund.thirdCoinCode }}</span>
                                    </div>
                                </div>
                                <!--<div class='row-2'>
                                    <b>$ {{ withdrawVal>0 ? mul(fund.price,withdrawVal) :'0' }}</b>
                                    <strong>
                                        <span>
                                            Balance
                                            {{ fund.balance?fund.balance:'' }}
                                        </span>
                                        <button @click='setMax'>
                                            MAX
                                        </button>
                                    </strong>
                                </div>
                                -->

                                <div class='row-2'>
                                    <span v-if='parseFloat(mul(fund.price,withdrawVal)) > 0 && parseFloat(mul(fund.price,withdrawVal)) < 0.01'>
                                        &lt; $ 0.01
                                    </span>
                                    <span v-else-if='parseFloat(mul(fund.price,withdrawVal)) === 0'>
                                        $ 0
                                    </span>
                                    <span v-else>
                                        $ {{ toFixed(mul(fund.price,withdrawVal)) }}
                                    </span>

                                    <strong>
                                        <span>
                                            Balance {{ formatAmount(fund.balance, 5) }}
                                        </span>
                                        <button @click='setMax'>
                                            MAX
                                        </button>
                                    </strong>
                                </div>
                            </div>
                        </div>
                        <div class='block'>
                            <div class='title'>
                                <label>Transaction overview</label>
                            </div>
                            <div class='box'>
                                <div class='row-3'>
                                    <span class='name'>
                                        Remaining supply
                                    </span>
                                    <span class='value'>
                                        <span>{{ withdrawVal > 0 ? (lt(minus(fund.balance,withdrawVal),0)?'0':toFixed(minus(fund.balance,withdrawVal))):'0' }} {{ fund.thirdCoinCode }}</span>
                                    </span>
                                </div>
                                <!--<div v-if='false' class='row-3'>
                                    <span class='name'>
                                        Purchase APY
                                    </span>
                                    <span class='value'>
                                        <b>0.51</b>
                                        <em>%</em>
                                    </span>
                                </div>
                                <div v-if='false' class='row-3'>
                                    <span class='name'>
                                        Collateralization
                                    </span>
                                    <span class='state'>
                                        <van-icon class='tick' name='success' />
                                        <span>Enabled</span>
                                    </span>
                                </div>
                                -->
                            </div>
                        </div>
                        <div class='total'>
                            <svg class='svg-icon' fill='currentColor' viewBox='0 0 24 24'>
                                <path d='m19.77 7.23.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V9c0-.69-.28-1.32-.73-1.77zM12 10H6V5h6v5zm6 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z' />
                            </svg>
                            <span v-if='gasFee>0' class='amount'>
                                $ {{ gasFee }}
                            </span>
                            <span v-else>
                                --
                            </span>
                            <van-popover v-if='gasFee>0' v-model:show='showGasPopover' placement='top'>
                                <div class='popover-content'>
                                    <p>This gas calculation is only an estimation. Your wallet will set the price of the transaction. You can modify the gas settings directly from your wallet provider.</p>
                                </div>
                                <template #reference>
                                    <van-icon class='info' name='info-o' />
                                </template>
                            </van-popover>
                        </div>
                        <div v-if='error.message' class='cancel-warn'>
                            <svg
                                aria-hidden='true'
                                fill='none'
                                stroke='currentColor'
                                stroke-width='2'
                                viewBox='0 0 24 24'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <path d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' stroke-linecap='round' stroke-linejoin='round' />
                            </svg>
                            <span>{{ error.message }}</span>
                            <!--<button>copy the error</button>-->
                        </div>
                    </div>

                    <!--操作成功 提示-->
                    <div v-if='isSuccess' class='success'>
                        <i class='el-icon-check'></i>
                        <h5>All Done!</h5>
                        <p>You Withdrawed {{ withdrawVal }} {{ fund.thirdCoinCode }}</p>
                        <!--<span class='addToWallet' @click='addToken'>
                            +ADD AWETH TO THE WALLET
                        </span>-->
                    </div>

                    <div class='handle-action'>
                        <div v-if='isSuccess' class='review'>
                            <span @click='reviewDetail'>
                                Review tx details
                            </span>
                            <svg aria-hidden='true' class='svg-icon' focusable='false' viewBox='0 0 24 24'>
                                <svg
                                    aria-hidden='true'
                                    fill='none'
                                    stroke='currentColor'
                                    stroke-width='2'
                                    viewBox='0 0 24 24'
                                    xmlns='http://www.w3.org/2000/svg'
                                >
                                    <path d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14' stroke-linecap='round' stroke-linejoin='round' />
                                </svg>
                            </svg>
                        </div>

                        <van-popover v-if='isSuccess === false && isNotEnough' v-model:show='showPopover' placement='top'>
                            <div class='popover-content'>
                                <p>Before supplying, you need to approve its usage by the Aave protocol. You can learn more in ourFAQ</p>
                            </div>
                            <template #reference>
                                Why do I need to approve?<van-icon class='info' name='info-o' />
                            </template>
                        </van-popover>

                        <div v-if='!isSuccess && ApproveSuccessData.transactionHash !== undefined' class='approve-review'>
                            <div class='r-left'>
                                <i class='el-icon-check'></i>Approve confirmed
                            </div>
                            <div class='r-right'>
                                <span @click='reviewDetailApprove'>
                                    Review tx details
                                </span>
                                <svg aria-hidden='true' class='svg-icon' focusable='false' viewBox='0 0 24 24'>
                                    <svg
                                        aria-hidden='true'
                                        fill='none'
                                        stroke='currentColor'
                                        stroke-width='2'
                                        viewBox='0 0 24 24'
                                        xmlns='http://www.w3.org/2000/svg'
                                    >
                                        <path d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14' stroke-linecap='round' stroke-linejoin='round' />
                                    </svg>
                                </svg>
                            </div>
                        </div>

                        <van-button
                            v-if='isNotEnough'
                            class='default'
                            :disabled='!isNotEnough || loading_page'
                            :loading='loading_page'
                            loading-text='Approve to continue'
                            type='primary'
                            @click='withdrawAuthorize'
                        >
                            Approve to continue
                        </van-button>
                        <van-button
                            v-if='!isSuccess && !(Number(fund.chainId) !== Number(networkId))'
                            :class='[isEn?"default":"disable"]'
                            :disabled='!isEn || withdrawVal === 0 || withdrawVal === "" || loading_submit'
                            :loading='loading_submit'
                            :loading-text='submitTxt'
                            type='primary'
                            @click='withdrawSubmit'
                        >
                            {{ submitTxt }}
                        </van-button>
                        <button v-if='Number(fund.chainId) !== Number(networkId)' class='disable'>
                            Wrong Network
                        </button>
                        <button v-if='false' class='default'>
                            Supply ETH
                        </button>
                        <van-button v-if='isSuccess' class='default' @click='close'>
                            Ok, Close
                        </van-button>
                    </div>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script setup>
import { ref, computed, defineExpose, inject, onMounted, unref } from 'vue'
import { useStore } from 'vuex'
import { utils } from 'web3'
import { web3Hooks } from '@/plugins/web3/index'
import { Toast, Dialog } from 'vant'
import { retainDecimal, plus, divide, minus, mul, pow, limitNumber, formatAmount, toFixed, lt } from '@/utils/calculation'
import { isEmpty, debounce } from '@/utils/util'
import networkConfigs from '@/plugins/web3/config/networkConfigs'

const store = useStore()
const style = computed(() => store.state.style)

const userAddress = computed(() => store.state._web3.userAddress)
const chainId = computed(() => store.state._web3.chainId)
const networkId = computed(() => store.state._web3.networkId)
const assets = computed(() => store.state._web3.assets)

const {
    executeConnect,
    allowance,
    switchNetwork,
    getUserBalance,
    withdrawApprove,
    getAccountAssets,
    estimateFee,
    getWalletBalance,
    withdrawDAI,
    withdrawETHApprove,
    withdrawETH,
} = web3Hooks()

// 是否显示弹窗
const show = ref(false)
const loading_page = ref(false)
const loading_submit = ref(false)
// 申购基金
const fund = ref({})
const error = ref({})

const withdrawVal = ref('') // 输入的取款金额
const isNotEnough = ref(false) // 是否授权成功,可取款
const isEn = ref(false) // 是否可取款
const usableMax = ref(0) // 可用的最大值
const isSuccess = ref(false) // 是否提取成功
const submitTxt = ref('Enter an amount')
const loading_page_txt = ref('')
const gasFee = ref('--')
const isEth = ref(false)
const chainIdOk = ref(false)
const decimals = ref(null)
// 取款成功返回的数据
const successData = ref({})
const ApproveSuccessData = ref({})
// 代币余额
const assetBalance = ref(0)
// 代币余额获取中
const assetBalanceLoading = ref(true)
const showPopover = ref(false)
const showGasPopover = ref(false)
const autoGetAssetBalance = ref(null)
const remainVal = ref('')

const handleWalletConnect = async function () {
    await executeConnect()
}

// handleWalletConnect()

// 获取代币余额
const getAssetBalance = () => {
    assetBalanceLoading.value = true
    if (isEth.value) {
        getUserBalance().then(res => {
            console.log('获取代币余额成功-->getUserBalance', res)
            // assetBalanceLoading.value = false
            assetBalance.value = res ? res - 0.001 : 0
        }).catch(err => {
            console.log('获取代币余额失败-->getUserBalance', err)
            // assetBalanceLoading.value = false
            assetBalance.value = 0
        })
    } else {
        getWalletBalance(fund.value.chainId, fund.value.aTokenAddress, fund.value.decimals).then(res => {
            console.log('获取代币余额成功-->getWalletBalance', res)
            // assetBalanceLoading.value = false
            assetBalance.value = res || 0
        }).catch(err => {
            console.log('获取代币余额失败-->getWalletBalance', err)
            // assetBalanceLoading.value = false
            assetBalance.value = 0
        })
    }
}

// const isReLoadList = inject('isReLoadList')

// 调取接口获取gasfee数额
const estimateFeeFn = () => {
    const value = mul(withdrawVal.value, pow(10, decimals.value))
    estimateFee(fund.value.assetId, value, unref(isEth)).then(res => {
        gasFee.value = retainDecimal(res, 2)
    }).catch(res => {
        console.log('estimateFeeFn error:->' + res)
    })
}

// 查询授权余额
const allowanceHandler = (address) => {
    loading_page.value = true
    if (Number(fund.value.chainId) !== Number(networkId.value)) {
        Toast('Please switch to ' + fund.value.marketName + ' ' + fund.value.networkName)
        return
    }
    allowance(address).then(res => {
        // console.log('account:' + res)
        loading_page.value = false
        usableMax.value = res
        error.value = {}

        if (lt(divide(res, pow(10, decimals.value)), withdrawVal.value)) { // lt小于 判断授权余额是否小于所输入的值
            isNotEnough.value = true
            isEn.value = false
            submitTxt.value = 'Enter an amount'
        } else {
            isNotEnough.value = false
            isEn.value = true
            submitTxt.value = 'Withdraw ' + fund.value.thirdCoinCode
        }
        estimateFeeFn()
    })
}

// 代币取款授权
const withdrawApproveHandler = () => {
    if (loading_page.value) { return }
    if (Number(fund.value.chainId) !== Number(networkId.value)) {
        Toast('Please switch to ' + fund.value.marketName + ' ' + fund.value.networkName)
        return
    }
    loading_page.value = true
    withdrawApprove(fund.value.assetId, mul(withdrawVal.value, pow(10, decimals.value))).then(res => {
        console.log(res)
        loading_page.value = false
        ApproveSuccessData.value = res

        isNotEnough.value = false
        isEn.value = true
        submitTxt.value = 'Withdraw ' + fund.value.thirdCoinCode
    }).catch(res => {
        console.log(res)
        error.value = res
        loading_page.value = false
    })
}

// 代币取款
const withdrawDAIHandler = () => {
    if (loading_submit.value) { return }
    if (Number(fund.value.chainId) !== Number(networkId.value)) {
        Toast('Please switch to ' + fund.value.marketName + ' ' + fund.value.networkName)
        return
    }
    loading_submit.value = true
    submitTxt.value = 'Withdrawing ' + fund.value.thirdCoinCode
    withdrawDAI(fund.value.assetId, mul(withdrawVal.value, pow(10, decimals.value))).then(res => {
        loading_submit.value = false
        console.log(res)
        // if (res) {
        isSuccess.value = true
        successData.value = res

        isNotEnough.value = false
        isEn.value = true

        // }
    }).catch(res => {
        submitTxt.value = 'Withdraw ' + fund.value.thirdCoinCode
        loading_submit.value = false
        console.log(res)
        error.value = res
    })
}

// ETH代币取款授权
const withdrawETHApproveHandler = () => {
    if (loading_page.value) { return }
    if (Number(fund.value.chainId) !== Number(networkId.value)) {
        Toast('Please switch to ' + fund.value.marketName + ' ' + fund.value.networkName)
        return
    }
    loading_page.value = true
    submitTxt.value = 'Withdrawing ' + fund.value.thirdCoinCode
    withdrawETHApprove(fund.value.aTokenAddress, mul(withdrawVal.value, pow(10, decimals.value))).then(res => {
        loading_page.value = false
        // console.log(res)
        // if (res) {
        isNotEnough.value = false
        isEn.value = true
        submitTxt.value = 'Withdraw ' + fund.value.thirdCoinCode
        ApproveSuccessData.value = res
        // }
    }).catch(res => {
        submitTxt.value = 'Withdraw ' + fund.value.thirdCoinCode
        loading_page.value = false
        console.log(res)
        error.value = res
    })
}

// ETH取款
const withdrawETHHandler = () => {
    if (!withdrawVal.value) { return }
    if (loading_submit.value) { return }
    if (Number(fund.value.chainId) !== Number(networkId.value)) {
        Toast('Please switch to ' + fund.value.marketName + ' ' + fund.value.networkName)
        return
    }
    loading_submit.value = true
    withdrawETH(mul(withdrawVal.value, pow(10, decimals.value))).then(res => {
        loading_submit.value = false
        // console.log(res)
        // if (res) {
        isSuccess.value = true
        successData.value = res
        // }
    }).catch(res => {
        loading_submit.value = false
        console.log(res)
        error.value = res
    })
}

// 打开弹窗
const open = (data) => {
    // 初始化
    // isNotEnough.value = false
    // usableMax.value = 0
    // isEth.value = false
    // chainIdOk.value = false
    // submitTxt.value = 'Enter an amount'
    // gasFee.value = '--'
    // withdrawVal.value = ''
    // error.value = {}
    // fund.value = {}
    // successData.value = {}
    // ApproveSuccessData.value = {}
    // assetBalance.value = {}
    init()

    // 传值赋值
    fund.value = data
    show.value = true
    getAccountAssets()

    console.log(
        '\n AccountAddress: ' + userAddress.value,
        '\n Net lineId: ' + chainId.value,
        '\n Account balance: ' + assets.value,
        '\n Icon chainId: ' + data.chainId, // 货币链的所在网络id
        '\n Icon networkType: ' + data.networkType, // 货币所在的主网络所在id, 是否测试id V2或V3
    )
    if (!userAddress.value) {
        handleWalletConnect()
    }
    if (data.thirdCoinCode === 'WETH' || data.thirdCoinCode === 'ETH') { // 判断是否eth代币
        isEth.value = true
    }
    if (Number(data.chainId) === Number(networkId.value)) { // 判断代币的网络是否和当前网络相同
        chainIdOk.value = true
    } else {
        chainIdOk.value = false
    }
    decimals.value = fund.value.decimals
    getAssetBalance()
}

// 关闭弹窗
const close = () => {
    show.value = false
    withdrawVal.value = ''

    if (isSuccess.value) {
        isSuccess.value = false
        // isReLoadList(true)
        store.dispatch('_web3/getAAVEMarkets')
    }
    // init()
    if (autoGetAssetBalance.value !== null) {
        clearInterval(autoGetAssetBalance.value)
        autoGetAssetBalance.value = null
    }
}

// 取款输入值时候触发查询余额及提示
const onValueChange = (e) => {
    // 代币的网络和当前网络不相同则不执行查询
    if (Number(fund.value.chainId) !== Number(networkId.value)) {
        Toast('Please switch to ' + fund.value.marketName + ' ' + fund.value.networkName)
        return
    }

    let newval = limitNumber(e.target.value)
    if (Number(newval) > Number(fund.value.balance)) newval = fund.value.balance
    e.target.value = newval
    withdrawVal.value = newval

    const val = e.target.value
    // console.log(val)
    if (!(Number(val) > 0)) {
        withdrawVal.value = val
        error.value = {}
        gasFee.value = '--'
        isNotEnough.value = false
    } else {
        withdrawVal.value = val
        allowanceHandler(fund.value.assetId)
    }
}

// 代币授权
const withdrawAuthorize = () => {
    if (isEth.value) {
        withdrawETHApproveHandler()
    } else {
        withdrawApproveHandler()
    }
    if (autoGetAssetBalance.value !== null) {
        clearInterval(autoGetAssetBalance.value)
        autoGetAssetBalance.value = null
    }
}

// 代币提取
const withdrawSubmit = () => {
    if (loading_page.value) { return }
    if (loading_submit.value) { return }
    if (isEth.value) {
        withdrawETHHandler()
    } else {
        withdrawDAIHandler()
    }
    if (autoGetAssetBalance.value !== null) {
        clearInterval(autoGetAssetBalance.value)
        autoGetAssetBalance.value = null
    }
}

// 切换网络
const switchNetworkFn = (id) => {
    loading_page.value = true
    switchNetwork(id).then(res => {
        loading_page.value = false
        // console.log(res)
        chainIdOk.value = true
    }).catch(res => {
        loading_page.value = false
        console.log(res)
    })
}

const init = () => {
    loading_page.value = false
    loading_submit.value = false
    // 申购基金
    fund.value = {}
    error.value = {}

    withdrawVal.value = '' // 输入的取款金额
    isNotEnough.value = false // 是否授权成功,可取款
    isEn.value = false // 是否可取款
    usableMax.value = 0 // 可用的最大值
    isSuccess.value = false // 是否提取成功
    submitTxt.value = 'Enter an amount'
    loading_page_txt.value = ''
    gasFee.value = '--'
    isEth.value = false
    chainIdOk.value = false
    decimals.value = null
    // 取款成功返回的数据
    successData.value = {}
    ApproveSuccessData.value = {}
    // 代币余额
    assetBalance.value = 0
    // 代币余额获取中
    assetBalanceLoading.value = true
    showPopover.value = false
    autoGetAssetBalance.value = null
}

// 点击设置最大值max为取款额
const setMax = () => {
    // console.log(fund.value.balance)
    if (isEmpty(fund.value.balance)) { return }

    if (chainIdOk.value) {
        withdrawVal.value = fund.value.balance
        allowanceHandler(fund.value.assetId)
        // autoGetAssetBalance.value = setInterval(() => {
        //     getAssetBalance()
        //     withdrawVal.value = assetBalance.value
        // }, 5000)
    }
}

// 查看取款详情
const reviewDetail = () => {
    const explorerLink = networkConfigs[networkId.value]?.explorerLink + '/tx/' + successData.value.transactionHash
    window.open(explorerLink)
}

const reviewDetailApprove = () => {
    const explorerLink = networkConfigs[networkId.value]?.explorerLink + '/tx/' + ApproveSuccessData.value.transactionHash
    window.open(explorerLink)
}

// onMounted(() => {

// })

defineExpose({
    open
})
</script>

<style lang="scss" scoped>
.purchase-dialog {
    :deep(.van-popup) {
        background: transparent;
    }
}
.popup-model {
    position: relative;
    width: 420px;
    min-height: 450px;
    padding: 24px;
    overflow-y: auto;
    color: var(--normalColor);
    background-color: var(--contentColor);
    border-radius: 4px;
    box-shadow: rgb(0 0 0 / 5%) 0 2px 1px, rgb(0 0 0 / 25%) 0 0 1px;
    transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
}
.model-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    color: var(--color);
    .title {
        font-size: 20px;
    }
    .close {
        font-size: 24px;
        cursor: pointer;
    }
}
.model-content {
    .block {
        margin-bottom: 20px;
    }
    .title {
        display: flex;
        align-items: center;
        margin-bottom: 4px;
        .info {
            margin-top: -2px;
            margin-left: 4px;
            cursor: pointer;
        }
    }
    .box {
        margin-bottom: 4px;
        padding: 8px 12px;
        border: 1px solid var(--lineColor);
        border-radius: 6px;
    }
    .row-1 {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 28px;
        color: var(--color);
        input {
            flex: 1;
            height: 100%;
            margin-right: 16px;
            font-size: 18px;
        }
        .coin {
            display: inline-flex;
            align-items: center;
            height: 100%;
            img {
                width: 24px;
                height: 24px;
                margin-right: 8px;
            }
            span {
                font-weight: bold;
                font-size: 18px;
            }
        }
    }
    .row-2 {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        b {
            color: var(--minorColor);
            font-weight: normal;
        }
        strong {
            span {
                font-weight: normal;
            }
            button {
                margin-left: 6px;
                color: var(--color);
                background: none;
                cursor: pointer;
            }
        }
    }
    .row-3 {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
        color: var(--color);
        &:last-of-type {
            margin-bottom: 0;
        }
        .value {
            b {
                font-weight: normal;
            }
            em {
                color: var(--normalColor);
                font-style: normal;
            }
        }
        .state {
            display: inline-flex;
            align-items: center;
            color: rgb(76, 175, 80);
            .tick {
                margin-right: 2px;
                font-size: 16px;
            }
        }
    }
    .total {
        display: flex;
        align-items: center;
        margin-top: 24px;
        color: var(--normalColor);
        .svg-icon {
            width: 16px;
            height: 16px;
            margin-right: 6px;
        }
        .amount {
            margin-right: 2px;
            color: var(--color);
        }
        .info {
            margin-top: -2px;
            cursor: pointer;
        }
    }
    .handle-action {
        margin-top: 48px;
        button {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 44px;
            margin-bottom: 10px;
            font-size: 17px;
            border: none;
            border-radius: 4px;
            &.default {
                color: #FFF;
                background: var(--primary);
                cursor: pointer;
            }
            &[disabled] {
                color: var(--minorColor);
                background: var(--lineColor);
            }
        }
        .review {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            color: var(--color);
            font-size: 13px;
            cursor: pointer;
            .svg-icon {
                width: 14px;
                height: 14px;
                margin-top: 4px;
                margin-left: 2px;
            }
            &:hover {
                text-decoration: underline;
            }
        }
        .approve-review {
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: var(--color);
            font-size: 13px;
            cursor: pointer;
            .r-left {
                color: var(--success);
                font-size: 13px;
            }
            .svg-icon {
                width: 14px;
                height: 14px;
                margin-top: 4px;
                margin-left: 2px;
            }
            .r-right:hover {
                text-decoration: underline;
            }
        }
    }
    .withdrawBox {
        min-height: 250px;
    }
}
.popover-content {
    width: 280px;
    padding: 16px 24px;
    font-size: 12px;
    line-height: 16px;
}
.network-warn {
    align-items: flex-start;
    margin-bottom: 24px;
    padding: 10px 12px;
    color: rgb(79, 25, 25);
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.009375rem;
    background: rgb(249, 235, 235);
    border-radius: 4px;
    button {
        text-decoration: underline;
        background: none;
        cursor: pointer;
    }
}
.cancel-warn {
    display: flex;
    align-items: center;
    margin-top: 16px;
    padding: 10px 12px;
    color: rgb(79, 25, 25);
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    background: rgb(249, 235, 235);
    border-radius: 4px;
    svg {
        width: 24px;
        height: 24px;
        margin-right: 12px;
        color: rgba(188, 0, 0, 0.72);
    }
    button {
        margin-left: 4px;
        text-decoration: underline;
        cursor: pointer;
    }
}
.success {
    height: 230px;
    margin-top: 50px;
    padding: 20px;
    text-align: center;
    h5 {
        margin-bottom: 10px;
        color: var(--color);
        font-size: 20px;
    }
    i.el-icon-check {
        color: var(--success);
        font-size: 32px;
    }
    p {
        margin: 10px 0;
        font-size: 16px;
    }
    .addToWallet {
        display: inline-block;
        padding: 2px 10px;
        color: var(--normalColor);
        background-color: var(--assistColor);
        border: 1px solid var(--lineColor);
        cursor: pointer;
    }
}
</style>

<template>
    <div class='fullPageWrapper'>
        <LayoutTop :back='true' :custom-style='customStyle' :menu='false' :title="$t('route.transfer')" />
        <div class='line'></div>

        <div class='page-content'>
            <div class='card'>
                <div class='card-title'>
                    <b>{{ $t('common.from') }}</b>
                    <img v-if='fromTradeType.tradeType === 5' src='@/themeCommon/image/wallet_color.png' />
                    <img v-else src='@/themeCommon/image/favoritechart.png' />
                </div>
                <div class='card-box'>
                    <span>{{ fromTradeType.name }}</span>
                    <div class='inpBox'>
                        <input v-model='amount' placeholder='0.00' type='digit' />
                        <div class='iconBox' @click="fromAccountList.length>1&&setPickerShow('out')">
                            <CurrencyIcon :currency='curCurrencyValue' :size='24' />
                            <span>{{ curCurrencyValue || '--' }}</span>
                            <img v-if='fromAccountList?.length>1' class='iconImg' src='@/themes/plans/images/assets/arrow.png' />
                        </div>
                    </div>
                    <div class='exchange-rate'>
                        <span>{{ `$${fromAmount ? fromAmount : '0.00'}` }}</span>
                    </div>

                    <div class='max-aciton'>
                        <p>
                            {{ $t('assets.maxTransfer') }}
                            <span class='value'>
                                {{ gt(maxTransfer,0)?maxTransfer:'0.00' }}{{ curCurrencyValue || '' }}
                            </span>
                            <span v-if='gt(maxTransfer,0)' class='action' @click='handleAll'>
                                {{ $t('withdrawCoin.max') }}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
            <p class='switchType'>
                <svg fill='none' height='20' viewBox='0 0 20 20' width='20' xmlns='http://www.w3.org/2000/svg' @click='handleSwap'>
                    <rect fill='#F1F1F1' height='20' rx='6' width='20' />
                    <path
                        clip-rule='evenodd'
                        d='M13.4918 12.5277V5.01279C13.4918 4.74418 13.3851 4.48657 13.1952 4.29664C13.0052 4.1067 12.7476 4 12.479 4C12.2104 4 11.9528 4.1067 11.7629 4.29664C11.5729 4.48657 11.4662 4.74418 11.4662 5.01279V14.9872C11.4662 15.9602 12.6994 16.3631 13.2833 15.6008L16.2116 12.6725C16.4011 12.4825 16.5074 12.225 16.5072 11.9567C16.507 11.6883 16.4003 11.431 16.2106 11.2413C16.0208 11.0515 15.7635 10.9448 15.4951 10.9446C15.2268 10.9444 14.9693 11.0507 14.7793 11.2402L13.4918 12.5277ZM9.04102 14.9872V5.01279C9.04102 4.03979 7.80781 3.63687 7.22391 4.39925L4.29559 7.32749C4.10612 7.51752 3.9998 7.77498 4 8.04333C4.0002 8.31168 4.10689 8.56898 4.29664 8.75873C4.48639 8.94849 4.74369 9.05517 5.01204 9.05537C5.28039 9.05557 5.53785 8.94926 5.72788 8.75978L7.01539 7.47227V14.9872C7.01539 15.2558 7.12209 15.5134 7.31203 15.7034C7.50196 15.8933 7.75957 16 8.02818 16C8.29678 16 8.55439 15.8933 8.74432 15.7034C8.93426 15.5134 9.04102 15.2558 9.04102 14.9872Z'
                        fill='black'
                        fill-rule='evenodd'
                    />
                </svg>
            </p>

            <div class='card'>
                <div class='card-title'>
                    <b>{{ $t('common.to') }}</b>
                    <img v-if='toTradeType.tradeType === 2' src='@/themeCommon/image/favoritechart.png' />
                    <img v-else src='@/themeCommon/image/wallet_color.png' />
                </div>
                <div :class="['card-box', 'disabled']">
                    <span>{{ toTradeType.name }}</span>
                    <div class='inpBox'>
                        <input disabled placeholder='0.00' type='text' :value='curAmount' />
                        <div class='iconBox' @click="toAccountList?.length>1&&setPickerShow('in')">
                            <CurrencyIcon :currency='toCurrencyValue' :size='24' />
                            <span>{{ toCurrencyValue || '--' }}</span>
                            <img v-if='toAccountList?.length>1' class='iconImg' src='@/themes/plans/images/assets/arrow.png' />
                        </div>
                    </div>
                    <div class='exchange-rate'>
                        <span>{{ toAmount?toAmount:'0.00' }}</span>
                    </div>

                    <div class='max-aciton'>
                        <p>
                            {{ `${$t('common.balance')} :` }}
                            <span class='value'>
                                {{ toMaxBalance?toMaxBalance:'0.00' }} {{ curCurrencyValue || '' }}
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            <div class='estimate-rate'>
                <div class='estimate-rate-box'>
                    <span>
                        {{ 1 }}{{ curCurrencyValue }} {{ '≈' }} {{ mul(1,curRate) }}{{ toCurrencyValue }}
                    </span>
                </div>
            </div>
        </div>

        <div class='footerBtn'>
            <van-button
                block
                :class="['returnBtn', !amount || gt(amount, maxTransfer) ? 'disabled' : '']"
                :disabled='!amount || gt(amount, maxTransfer)'
                :loading='loading'
                type='primary'
                @click='handleTransfer'
            >
                {{
                    !amount
                        ? $t('headLineTrade.enter-an-amount')
                        : gt(amount, maxTransfer)
                            ? $t('headLineTrade.insufficient-balance')
                            : $t('trade.transfer')
                }}
            </van-button>
        </div>

        <!-- 资产列表 -->
        <assetsListSearch
            v-if='pickerShow'
            v-model:show='pickerShow'
            :account-list="assetPickerType === 'out' ? fromAccountList : toAccountList"
            :currency="assetPickerType === 'out' ? curCurrencyValue : toCurrencyValue"
            :is-transfer="assetPickerType === 'out'"
            @select='onCurrencyConfirm'
        />

        <!-- 加载中 -->
        <Loading :show='loading' />
        <van-popup v-model:show='transferResult' :duration='0.2' position='center' round :style="{ width: '93%' }" @close='onCancel'>
            <div class='transfer-result'>
                <div class='close-image'>
                    <img src='@/themes/plans/images/assets/close.svg' @click='onCancel' />
                </div>
                <div class='content'>
                    <div class='success-image'>
                        <img src='@/themes/plans/images/assets/success.svg' />
                        <span>{{ $t('withdrawCoin.tips.tips9') }}</span>
                    </div>
                    <div class='success-info'>
                        <div class='success-info-item'>
                            <span class='title'>
                                {{ $t('withdrawCoin.coin') }}
                            </span>
                            <span class='value'>
                                {{ `${curCurrencyValue} -> ${toCurrencyValue}` }}
                            </span>
                        </div>

                        <div class='success-info-item'>
                            <span class='title'>
                                {{ $t('withdrawCoin.transferFrom') }}
                            </span>
                            <span class='value'>
                                {{ fromTradeType.name }}
                            </span>
                        </div>

                        <div class='success-info-item'>
                            <span class='title'>
                                {{ $t('withdrawCoin.transferTo') }}
                            </span>
                            <span class='value'>
                                {{ toTradeType.name }}
                            </span>
                        </div>

                        <div class='success-info-item'>
                            <span class='title'>
                                {{ $t('wallet.amount') }}
                            </span>
                            <span class='value'>
                                {{ `${fixedFormat(amount)} ${curCurrencyValue}` }}
                            </span>
                        </div>

                        <div class='success-info-item'>
                            <span class='title'>
                                {{ $t('headLineTrade.transaction-fee') }}
                            </span>
                            <span class='value'>
                                {{ `$0` }}
                            </span>
                        </div>

                        <div class='success-info-item'>
                            <span class='title'>
                                {{ $t('competition.time') }}
                            </span>
                            <span class='value'>
                                {{ transferSuccessTime }}
                            </span>
                        </div>

                        <div class='success-info-item'>
                            <span class='title'>
                                {{ $t('common.status') }}
                            </span>
                            <span :class="['value','finish']">
                                {{ $t('headLineTrade.transfer-success') }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
import { computed, reactive, toRefs, watch, watchEffect, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Dialog, Toast } from 'vant'
// import useProduct from '@/hooks/product'
import { useWithdrawAmountSort } from '@/hooks/assets'
import { pow, div, toFixed, mul, gt, lt, getDecimalNum, fixedFormat } from '@/utils/calculation'
import { capitalTransferSupportDiffCurr, queryAccountById, queryDepositExchangeRate } from '@/api/user'
import { isEmpty } from '@/utils/util'
import assetsListSearch from '@/themeCommon/components/assetsList/assetsListSearch.vue'
import CurrencyIcon from '@/components/currencyIcon'
import mitt from '@/utils/mitt'

export default {
    components: {
        assetsListSearch,
        CurrencyIcon,
    },
    setup (props, { emit }) {
        const { t, tm } = useI18n({ useScope: 'global' })
        const store = useStore()
        const router = useRouter()

        // hooks
        const sortAssetsList = useWithdrawAmountSort()

        // state
        const state = reactive({
            // 加载中
            loading: false,
            // out 选择划出账户, in 选择划入账户
            assetPickerType: 'out',
            // 是否显示选择资产弹窗
            pickerShow: false,
            // 转出暂时写死钱包玩法
            fromTradeType: {
                id: 5,
                tradeType: 5,
                name: t('wallet.walletAccount'),
            },
            // 转出暂时写死逐仓
            toTradeType: {
                id: 2,
                tradeType: 2,
                name: t('wallet.tradingAccount'),
            },
            // 输入的划转数量
            amount: '',
            // 划出账户币种
            curCurrencyValue: '',
            // 划入账户币种
            toCurrencyValue: '',
            // 划出账户的余额
            maxTransfer: '',
            // 划入账户的余额
            toMaxBalance: '',
            // 划入账户的汇率，固定对USD
            toRateInfo: '',
            // 划出账户的汇率，固定对USD
            fromRateInfo: '',
            // 当前选择的汇率对信息，用户选择的汇率对
            curRateInfo: '',
            // 划转结果的弹窗提示
            transferResult: false,
            // 划转成功的时间
            transferSuccessTime: '',
        })

        // 用户信息
        const customerInfo = computed(() => store.state._user.customerInfo)
        // 获取玩法列表
        const plans = computed(() => store.state._base.plans.filter((el) => Number(el.id) !== 5))
        // 用户账户列表
        const customerAccountList = computed(() => customerInfo.value?.accountList || [])
        // 划出的资产列表数据
        const fromAccountList = computed(() => {
            const tradeTypeValue = Number(state.fromTradeType.id)
            const list = sortAssetsList.value.filter((el) => Number(el.tradeType) === tradeTypeValue)
            return list
        })
        // 划入的资产列表数据
        const toAccountList = computed(() => {
            const tradeTypeValue = Number(state.toTradeType.id)
            const list = sortAssetsList.value.filter((el) => Number(el.tradeType) === tradeTypeValue)
            return list
        })
        // 划出账户
        const curCurrency = computed(() => fromAccountList.value.find((el) => el.currency === state.curCurrencyValue) || {})
        // 划入账户
        const toCurrency = computed(() => toAccountList.value.find((el) => el.currency === state.toCurrencyValue) || {})

        // 用户选择的汇率对
        const curRate = computed(() => {
            const { formulaSymbol, exchangeRate } = state.curRateInfo
            let rate = exchangeRate
            // 汇率有乘（multiply）或者除(divide)
            if (formulaSymbol === 'divide') {
                rate = div(1, exchangeRate)
            }
            return toFixed(rate, toCurrency.value?.digits)
        })
        // 预计到账
        const curAmount = computed(() => {
            // const digits = toCurrency.value?.digits || 1
            // let result = t('withdraw.receipt') + ' ' + toFixed(0, digits)
            // let result = toFixed(0, digits)
            if (!state.amount) return ''
            const result = mul(state.amount, curRate.value)
            return result
            // return toFixed(result, digits)
        })

        // 划出的币种对USD的汇率
        const fromRate = computed(() => {
            const { formulaSymbol, exchangeRate } = state.fromRateInfo
            let rate = exchangeRate
            // 汇率有乘（multiply）或者除(divide)
            if (formulaSymbol === 'divide') {
                rate = div(1, exchangeRate)
            }
            return toFixed(rate, curCurrency.value?.digits)
        })

        // 划出数量对USD的汇率计算
        const fromAmount = computed(() => {
            const digits = curCurrency.value?.digits || 1
            let result = toFixed(0, digits)
            if (!state.amount) return toFixed(0, 2)
            result = mul(state.amount, fromRate.value)
            return toFixed(result, digits)
        })

        // 划入的币种对USD的汇率
        const toRate = computed(() => {
            const { formulaSymbol, exchangeRate } = state.toRateInfo
            let rate = exchangeRate
            // 汇率有乘（multiply）或者除(divide)
            if (formulaSymbol === 'divide') {
                rate = div(1, exchangeRate)
            }
            return toFixed(rate, toCurrency.value?.digits)
        })
        // 划入数量对USD的汇率计算
        const toAmount = computed(() => {
            const digits = toCurrency.value?.digits || 1
            let result = toFixed(0, digits)

            if (!gt(curAmount.value, 0)) return toFixed(0, 2)
            result = mul(curAmount.value, toRate.value)
            return toFixed(result, digits)
        })

        // 自定义头部样式
        const customStyle = {
            background: 'transparent',
            'z-index': 0,
        }

        // 显示划入/划出账户币种的Picker
        const setPickerShow = (type) => {
            state.pickerShow = true
            state.assetPickerType = type
        }

        const minTransfer = computed(() => {
            const digits = curCurrency.value.digits
            return pow(0.1, digits)
        })

        const onCancel = () => {
            state.amount = ''
            state.transferSuccessTime = ''
            state.transferResult = false
        }

        // 划出金额大于最大可提
        const amountWarn = computed(() => gt(state.amount, state.maxTransfer))

        // 输入划出金额
        const outAmountInput = (e) => {
            let newval = e.target.value.trim()
            if (/[^0-9.]/.test(newval)) {
                // 只能输入数字
                newval = newval.replace(/[^0-9.]/g, '')
                e.target.value = newval
            }
            const digits = curCurrency.value.digits
            const reg = new RegExp('^\\d*(\\.?\\d{0,' + digits + '})', 'g')
            if (getDecimalNum(newval) > digits) {
                newval = (newval.match(reg) && newval.match(reg)[0]) || ''
                if (digits === 0 && newval.endsWith('.')) newval = newval.replace(/\./g, '') // 浏览器不允许给number输入框输入'1.'字符串
                e.target.value = newval
            }
            state.amount = newval
        }

        // 获取当前选择的账户数据
        const queryAccount = (bool = true) => {
            const params = {
                accountId: bool ? curCurrency.value.accountId : toCurrency.value.accountId,
                tradeType: bool ? curCurrency.value.tradeType : toCurrency.value.tradeType,
            }
            queryAccountById(params)
                .then((res) => {
                    // console.log('查询余额----->', res)
                    if (res.check()) {
                        if (bool) {
                            state.maxTransfer = res.data.withdrawAmount
                        } else {
                            state.toMaxBalance = res.data.withdrawAmount
                        }
                        if ([1, 2].includes(params.tradeType)) {
                            store.commit('_user/Update_accountAssets', {
                                tradeType: params.tradeType,
                                data: res.data,
                            })
                        }
                    }
                })
                .catch((err) => {
                    state.loading = false
                })
        }
        // 获取汇率，固定USD汇率对，否则则是目标汇率对
        const getRate = (type) => {
            let params
            if (type == 'from') {
                params = {
                    tradeType: curCurrency.value.tradeType,
                    paymentCurrency: 'USD',
                    accountCurrency: state.curCurrencyValue,
                }
            }
            if (type == 'to') {
                params = {
                    tradeType: toCurrency.value.tradeType,
                    paymentCurrency: 'USD',
                    accountCurrency: state.toCurrencyValue,
                }
            }
            if (type == 'cur') {
                params = {
                    tradeType: curCurrency.value.tradeType,
                    paymentCurrency: state.toCurrencyValue,
                    accountCurrency: state.curCurrencyValue,
                }
            }
            // console.log('汇率请求参数----->', type, params)
            queryDepositExchangeRate(params).then((res) => {
                if (res.check()) {
                    // if (
                    //     params.tradeType === curCurrency.value.tradeType &&
                    //     params.paymentCurrency === state.toCurrencyValue &&
                    //     params.accountCurrency === state.curCurrencyValue
                    // ) {
                    //     state.curRateInfo = res.data
                    // }

                    if (type == 'from') {
                        // console.log('汇率接口from----->', res.data)
                        state.fromRateInfo = res.data
                    }
                    if (type == 'to') {
                        // console.log('汇率接口to----->', res.data)

                        state.toRateInfo = res.data
                    }
                    if (type == 'cur') {
                        // console.log('汇率接口cur----->', res.data)
                        state.curRateInfo = res.data
                    }
                }
            })
        }

        // 确认提交划转
        const handleTransfer = () => {
            if (isEmpty(state.amount)) {
                return Toast(t('assets.transferTip1'))
            }
            if (state.amount <= 0) {
                return Toast(t('assets.transferTip6'))
            }
            const toAccountId = customerAccountList.value.find(
                (el) => Number(el.tradeType) === Number(state.toTradeType.id) && el.currency === toCurrency.value.currency,
            )

            if (gt(state.amount, state.maxTransfer)) {
                return Toast({
                    className: 'toastTransferTip',
                    type: 'html',
                    message: t('assets.transferTip4', { amount: `${state.maxTransfer} ${curCurrency.value?.currency}` }),
                })
            }
            if (lt(state.amount, minTransfer.value)) {
                return Toast({
                    className: 'toastTransferTip',
                    type: 'html',
                    message: t('assets.transferTip5', { amount: `${minTransfer.value} ${curCurrency.value?.currency}` }),
                })
            }
            state.loading = true
            const customInfo = store.state._user.customerInfo
            const params = {
                customerNo: customInfo.customerNo,
                accountId: curCurrency.value.accountId,
                customerId: customInfo.id,
                tradeType: state.fromTradeType.id,
                currency: curCurrency.value.currency,
                accountDigit: curCurrency.value.digits,
                toTradeType: state.toTradeType.id,
                toCurrency: toAccountId.currency,
                toCustomerNo: customInfo.customerNo,
                toAccountDigit: toAccountId.digits,
                amount: state.amount,
            }

            capitalTransferSupportDiffCurr(params)
                .then((res) => {
                    state.loading = false
                    if (res.check() && res.data) {
                        // state.amount = ''
                        queryAccount(true)
                        queryAccount(false)
                        if ([3, 5, 8, 9].includes(Number(state.fromTradeType.id))) {
                            store.dispatch('_user/queryCustomerAssetsInfo', { tradeType: state.fromTradeType.id })
                        }
                    }
                    return showDialog(res)
                })
                .catch((err) => {
                    state.loading = false
                })
        }

        const handleAll = () => {
            state.amount = state.maxTransfer
        }

        // 成功失败弹窗
        const showDialog = (data) => {
            // console.log('🚀 返回来的结果', data)

            if (!data.check()) {
                return Dialog.alert({
                    message: data.msg,
                    confirmButtonText: t('common.close'),
                })
            }
            if (state.fromTradeType?.tradeType !== 5) {
                // 从合约到钱包仅提示划转成功
                return Dialog.alert({
                    message: t('assets.transferSuccess'),
                    confirmButtonText: t('common.close'),
                })
            }
        }

        const getCurrencyIcon = (currency) => {
            try {
                return require('@/assets/currency_icon/' + currency + '.png')
            } catch (error) {
                return require('@/assets/currency_icon/default.png')
            }
        }

        const toRecord = () => {
            router.push({
                path: '/record',
                query: {
                    tradeType: state.fromTradeType.id,
                    type: 3,
                },
            })
        }

        // 选取币种确定事件
        const onCurrencyConfirm = (val) => {
            state[state.assetPickerType === 'out' ? 'curCurrencyValue' : 'toCurrencyValue'] = val.currency
            state.pickerShow = false
        }

        const handleSwap = () => {
            ;[state.fromTradeType, state.toTradeType] = [state.toTradeType, state.fromTradeType]
            ;[state.curCurrencyValue, state.toCurrencyValue] = [state.toCurrencyValue, state.curCurrencyValue]
            ;[state.maxTransfer, state.toMaxBalance] = [state.toMaxBalance, state.maxTransfer]

            state.amount = ''
        }

        // 预计汇率的icon提示
        const rateDescInfo = () => {
            Dialog.alert({
                message: t('assets.rateDesc'),
            })
        }

        // watch(
        //     () => sortAssetsList.value,
        //     () => {
        //         if (sortAssetsList.value.length > 0 && isEmpty(state.curCurrency)) {
        //             const findCurrency = customerAccountList.value.find((item) => {
        //                 const { tradeType } = item
        //                 return tradeType === 5
        //             })
        //             if (findCurrency) {
        //                 state.curCurrency = findCurrency
        //             } else {
        //                 state.curCurrency = sortAssetsList.value[0]
        //             }
        //             state.toCurrency = customerAccountList.value.find(({ tradeType }) => tradeType === state.toTradeType.id)
        //         }
        //     },
        //     {
        //         immediate: true,
        //     },
        // )

        watch(
            () => sortAssetsList.value,
            (val) => {
                if (sortAssetsList.value.length > 0 && isEmpty(state.curCurrencyValue)) {
                    const toTradeTypeValue = Number(state.toTradeType.id)
                    const curAccount = sortAssetsList.value[0]
                    state.curCurrencyValue = curAccount.currency
                    const toAccount = customerAccountList.value.find(({ tradeType }) => Number(tradeType) === toTradeTypeValue)
                    state.toCurrencyValue = toAccount.currency
                }
            },
            {
                immediate: true,
            },
        )

        watch(
            () => state.curCurrencyValue,
            (val) => {
                if (val && state.toCurrencyValue) {
                    state.amount = ''
                    queryAccount(true)
                }
            },
            {
                immediate: true,
            },
        )

        watch(
            () => state.toCurrencyValue,
            (val) => {
                if (val && state.curCurrencyValue) {
                    state.amount = ''
                    queryAccount(false)
                }
            },
            {
                immediate: true,
            },
        )

        watchEffect(() => {
            if (!isEmpty(state.curCurrencyValue) && !isEmpty(state.toCurrencyValue)) {
                getRate('from')
                getRate('to')
                getRate('cur')
            }
        })

        onMounted(() => {
            // 获取钱包资产数据
            store.commit('_base/Update_plansNames', tm('tradeType'))
            store.dispatch('_user/queryCustomerAssetsInfo', { tradeType: 5 })

            // 监听收到websocket发送过来信息
            mitt.on('TRANSFER_SUCCESS_TIME', (timestamp) => {
                state.transferSuccessTime = window.dayjs(Number(timestamp)).format('YYYY-MM-DD HH:mm:ss')
                state.transferResult = true
            })
        })
        onUnmounted(() => {
            mitt.off('TRANSFER_SUCCESS_TIME')
        })

        return {
            plans,
            fromAccountList,
            toAccountList,
            setPickerShow,
            handleTransfer,
            handleSwap,
            onCurrencyConfirm,
            curAmount,
            fromAmount,
            toAmount,
            toRecord,
            outAmountInput,
            handleAll,
            minTransfer,
            customStyle,
            amountWarn,
            getCurrencyIcon,
            rateDescInfo,
            fixedFormat,
            gt,
            mul,
            onCancel,
            curCurrency,
            toCurrency,
            curRate,
            ...toRefs(state),
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';

.fullPageWrapper {
    display: flex;
    flex-direction: column;
    margin-top: 0;
    :deep {
        .main {
            text-align: left;
            margin: 0;
            margin-left: 50px;
            & > .title {
                color: var(--mainColor);
                font-family: 'Inter';
                font-size: 20px;
                font-weight: 700;
                // margin-left: -100px;
            }
        }
    }

    .line {
        width: 100%;
        height: 8px;
        background: #f8f8f8;
        // background-color:var(--bgColor);
    }
    .page-content {
        position: relative;
        z-index: 1;
        padding: 20px;
        flex: 1;
        .card {
            display: flex;
            flex-direction: column;

            .card-title {
                display: flex;
                align-items: center;
                margin-bottom: 8px;
                & > img {
                    margin-left: 4px;
                    max-width: 24px;
                    max-height: 24px;
                }
            }
            .card-box {
                padding: rem(32px);
                border-radius: rem(4px);
                border: 1px solid #ebe9e9;
                font-size: rem(28px);
                font-family: Inter;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
                color: var(--mainColor);
                &.disabled {
                    background-color: #faf9f9;
                }
                .inpBox {
                    margin-top: rem(20px);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    input {
                        width: 100%;
                        height: rem(40px);
                        font-size: rem(48px);
                        font-style: normal;
                        font-family: Inter;
                        font-weight: 600;
                        color: var(--mainColor);
                        &::placeholder {
                            font-size: rem(48px);
                        }
                    }
                    .inp {
                        font-size: rem(48px);
                        font-style: normal;
                        font-family: Inter;
                        font-weight: 600;
                        color: var(--mainColor);
                    }
                    .iconBox {
                        display: flex;
                        align-items: center;
                        margin-left: rem(20px);
                        font-size: rem(32px);
                        font-family: Inter;
                        font-weight: 600;
                        color: var(--mainColor);
                        span {
                            margin: 0 rem(8px);
                        }
                        .iconImg {
                            width: rem(48px);
                            height: rem(48px);
                        }
                    }
                }
                .exchange-rate {
                    padding: 16px 0;
                    min-height: 14px;
                    & > span {
                        color: #666;
                        font-family: 'Inter';
                        font-size: 12px;
                        font-style: normal;
                        font-weight: 400;
                        line-height: 14px;
                    }
                }

                .max-aciton {
                    width: 100%;
                    display: flex;
                    justify-content: flex-end;
                    & > p {
                        color: #999;
                        font-family: 'Inter';
                        font-size: 12px;
                        font-weight: 400;
                        & > .value {
                            color: var(--mainColor);
                        }

                        & > .action {
                            margin-left: 2px;
                            color: var(--allColor);
                        }
                    }
                }
            }
        }
        .switchType {
            margin: 30px 0;
            display: flex;
            align-items: center;
            justify-content: center;
            & > svg {
                width: 24px;
                height: 24px;
            }
        }
        .estimate-rate {
            margin-top: 24px;
            width: 100%;
            .estimate-rate-box {
                width: 100%;
                display: flex;
                min-height: 16px;
                padding: 14px 16px;
                background-color: #f8f9fc;
                border-radius: 8px;
            }
        }
    }

    .footerBtn {
        padding: rem(20px);
        .returnBtn {
            color: #fff;
            font-weight: bold;
            font-size: 14px;
            background: var(--primary);
            border: none;
            border-radius: rem(6px);
            &.disabled {
                background-color: #f7f7f7;
                color: #bdbdbd;
                font-family: 'Inter';
                font-size: 14px;
                font-weight: 600;
                opacity: 1;
            }
        }
    }
    .transfer-result {
        padding: rem(30px);
        .close-image {
            display: flex;
            justify-content: flex-end;
        }
        .content {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 24px;
            .success-image {
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                & > img {
                    margin-bottom: 16px;
                }
            }
            .success-info{
              margin-top:34px;
              width:100%;
              background-color:#faf9f9;
              display:flex;
              flex-direction:column;
              padding:16px;
              .success-info-item{
                  display:flex;
                  align-items:center;
                  justify-content:space-between;
                  margin-bottom:16px;
                  &:last-of-type{
                    margin-bottom:0
                  }
                  .title{
                    color: #999;
                    font-family: "Inter";
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: normal;
                  }
                  .value{
                    color: var(--mainColor);
                    font-family: "Inter";
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: normal;
                    &.finish{
                      color: var(--primary);

                    }
                  }
              }
            }
        }
    }

}
</style>

<style lang="scss">
.toastTransferTip {
    width: 100%;
    span {
        vertical-align: middle;
        color: var(--primary);
    }
}
</style>

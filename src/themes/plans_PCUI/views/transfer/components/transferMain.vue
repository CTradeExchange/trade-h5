<template>
    <div v-if='!transferSuccessTime' class='fullPageWrapper'>
        <LayoutTop :box-shadow-show='false' :right-back='true' :show-main='false'>
            <template #left>
                <span>
                    {{ $t('cRoute.transfer') }}
                </span>
            </template>
            <template #right>
                <i class='icon_icon_close_big'></i>
            </template>
        </LayoutTop>
        <div class='page-content'>
            <div class='transferItem'>
                <div class='bigLabel'>
                    <div class='from-wallet'>
                        <b>{{ $t('common.from') }}</b>
                        <img v-if='fromTradeType.tradeType === 5' src='../../../images/wallet_color.png' />
                        <img v-else src='../../../images/favoritechart.png' />
                    </div>
                </div>

                <inputCard
                    :amount='amount'
                    class='card-top'
                    :currency='curCurrencyValue'
                    :currency-list='fromAccountList'
                    :currency-rate='fromRate'
                    :more-zero='true'
                    :title='fromTradeType.name'
                    @onAmount='handleAmount'
                    @onCurrency='handleCurrency'
                >
                    <p class='tip' :class='{ warn: amountWarn }'>
                        {{ $t('assets.maxTransfer') }}
                        <span class='value'>
                            {{ gt(maxTransfer, 0) ? maxTransfer : '0' }}
                        </span>
                        {{ curCurrency?.currency }}
                        <button>
                            <span v-if='gt(maxTransfer, 0)' :class="['all']" @click='handleAll'>
                                {{ $t('withdrawCoin.max') }}
                            </span>
                        </button>
                    </p>
                </inputCard>
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

            <div class='transferItem'>
                <div class='bigLabel'>
                    <div class='from-wallet'>
                        <b>{{ $t('common.to') }}</b>
                        <img v-if='toTradeType.tradeType === 2' src='../../../images/favoritechart.png' />
                        <img v-else src='../../../images/wallet_color.png' />
                    </div>
                </div>

                <inputCard
                    :amount='curAmount'
                    class='card-bottom'
                    :currency='toCurrencyValue'
                    :currency-list='toAccountList'
                    :currency-rate='toRate'
                    disabled
                    :more-zero='true'
                    :title='toTradeType.name'
                    @onCurrency='handleToCurrency'
                >
                    <p class='tip'>
                        <span class='value'>
                            {{ `${$t('common.balance')} :` }}{{ fixedFormat(toMaxBalance) }} {{ toCurrencyValue }}
                        </span>
                    </p>
                </inputCard>

                <!-- <div class='inputBox'>
                    <input class='transferInput' disabled type='text' :value='toAmount' />
                    <select-box v-model:currency='toCurrencyValue' :is-relative='false' :list='toAccountList' title='' />
                </div>
                <p v-show='rateInfo' class='tip'>
                    {{ $t('assets.estimateRate') }}
                    <van-icon class='cursor-pointer' name='info' @click='rateDescInfo' />
                    :
                    <span class='value'>
                        1 {{ curCurrencyValue }} ≈ {{ toRate }} {{ toCurrencyValue }}
                    </span>
                </p> -->
            </div>
        </div>

        <div class='estimate-rate'>
            <div class='estimate-rate-box'>
                <span>{{ 1 }}{{ curCurrencyValue }} {{ '≈' }} {{ mul(1,curRate) }}{{ toCurrencyValue }}</span>
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
        <Loading :show='loading' />
    </div>

    <div v-else class='transfer-result'>
        <LayoutTop :right-back='true' :show-main='false'>
            <template #left>
                <div class='result-left'>
                    <svg fill='none' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg' @click='onCancel'>
                        <path
                            d='M10.07 5.74072L4 11.8107L10.07 17.8807M21 11.8107H4.17'
                            stroke='#333333'
                            stroke-linecap='round'
                            stroke-linejoin='round'
                            stroke-miterlimit='10'
                            stroke-width='1.5'
                        />
                    </svg>
                    <span>
                        {{ $t('headLineTrade.transfer-finish') }}
                    </span>
                </div>
            </template>
            <template #right>
                <i class='icon_icon_close_big'></i>
            </template>
        </LayoutTop>
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
                        {{ `${amount} ${curCurrencyValue}` }}
                    </span>
                </div>

                <div class='success-info-item'>
                    <span class='title'>
                        {{ $t('headLineTrade.transaction-fee') }}
                    </span>
                    <span class='value'>
                        {{ `$${'0'}` }}
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
                    <span :class="['value', 'finish']">
                        {{ $t('headLineTrade.transfer-success') }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { computed, ref, onMounted, reactive, toRefs, watch, watchEffect, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Dialog, Toast } from 'vant'
import { useWithdrawAmountSort } from '@/hooks/assets'
import { pow, gt, lt, mul, div, toFixed, getDecimalNum } from '@/utils/calculation'
import { capitalTransferSupportDiffCurr, queryAccountById, queryDepositExchangeRate } from '@/api/user'
import { isEmpty } from '@/utils/util'

import inputCard from '@planspc/components/inputCard.vue'
import { firebaseAnalytics } from '@/utils/firebase'
import mitt from '@/utils/mitt'

export default {
    components: {
        inputCard,
    },
    setup (props, { emit }) {
        const { t } = useI18n({ useScope: 'global' })
        const store = useStore()
        const router = useRouter()
        const route = useRoute()
        // console.log(router.getRoutes())
        // hooks
        const sortAssetsList = useWithdrawAmountSort()

        // ref
        const inputBox = ref(null)
        // state
        const state = reactive({
            loading: false,
            // 转出暂时写死钱包玩法
            fromTradeType: {
                id: 5,
                tradeType: 5,
                name: t('wallet.walletAccount'),
            },
            // 转出暂时写死全仓
            toTradeType: {
                id: 2,
                tradeType: 2,
                name: t('wallet.tradingAccount'),
            },
            // 划出金额
            amount: '',
            // 汇率
            withdrawRate: null,
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
            // popover弹窗
            forWalletPopover: true,
            // 只要传过来时间，就认为划转成功的通知
            transferSuccessTime: '',
        })

        // 玩法列表
        const plans = computed(() => store.state._base.plans.filter((el) => Number(el.id) !== 5))
        // 用户账户列表
        const customerAccountList = computed(() => store.state._user?.customerInfo?.accountList || [])
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
            const digits = toCurrency.value?.digits || 1
            // let result = t('withdraw.receipt') + ' ' + toFixed(0, digits)
            let result = toFixed(0, digits)
            if (!state.amount) return ''
            result = mul(state.amount, curRate.value)
            return toFixed(result, digits)
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

        // 最小划转
        const minTransfer = computed(() => {
            const digits = curCurrency.value?.digits || 1
            return pow(0.1, digits)
        })
        // 划出金额大于最大可提
        const amountWarn = computed(() => gt(state.amount, state.maxTransfer))
        const customerInfo = computed(() => store.state._user.customerInfo || {})

        // 判断非数字，然后转换2位小数
        const fixedFormat = (number, digit = 2) => {
            if (isNaN(Number(number))) {
                return 0
            } else {
                return toFixed(number, digit)
            }
        }
        // 输入划出金额
        const outAmountInput = (e) => {
            let newval = e.target.value.trim()
            // eslint-disable-next-line no-useless-escape
            if (/[^0-9\.]/.test(newval)) {
                // 只能输入数字
                // eslint-disable-next-line no-useless-escape
                newval = newval.replace(/[^0-9\.]/g, '')
                e.target.value = newval
            }
            const digits = curCurrency.value.digits || 1
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
            // console.log('我调用了-------？', JSON.stringify(params))
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

        watch(
            () => sortAssetsList.value,
            (val) => {
                if (sortAssetsList.value.length > 0 && isEmpty(state.curCurrencyValue)) {
                    const toTradeTypeValue = Number(state.toTradeType.id)
                    const curAccount = sortAssetsList.value[0]
                    const toAccount = customerAccountList.value.find(({ tradeType }) => Number(tradeType) === toTradeTypeValue)
                    state.toCurrencyValue = toAccount.currency
                    state.curCurrencyValue = curAccount.currency
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
                // console.log('watchEffect------------->')
                getRate('from')
                getRate('to')
                getRate('cur')
            }
        })

        const handleTransfer = () => {
            if (isEmpty(state.amount)) {
                return Toast(t('assets.transferTip1'))
            }
            if (state.amount <= 0) {
                return Toast(t('assets.transferTip6'))
            }
            const toAccountId = customerAccountList.value.find(
                (el) => Number(el.tradeType) === Number(state.toTradeType.id) && el.currency === toCurrency.value?.currency,
            )

            if (gt(state.amount, state.maxTransfer)) {
                return Toast({
                    className: 'toastTransferTip',
                    type: 'html',
                    message: t('assets.transferTip4', { amount: `${state.maxTransfer} ${state.curCurrencyValue}` }),
                })
            }
            if (lt(state.amount, minTransfer.value)) {
                return Toast({
                    className: 'toastTransferTip',
                    type: 'html',
                    message: t('assets.transferTip5', { amount: `${minTransfer.value} ${state.curCurrencyValue}` }),
                })
            }
            state.loading = true
            const customInfo = store.state._user.customerInfo
            const params = {
                customerNo: customInfo.customerNo,
                accountId: curCurrency.value.accountId,
                customerId: customInfo.id,
                tradeType: state.fromTradeType.id,
                currency: state.curCurrencyValue,
                accountDigit: curCurrency.value.digits,
                toTradeType: state.toTradeType.id,
                toCurrency: state.toCurrencyValue,
                toAccountId: toAccountId.accountId,
                toCustomerNo: customInfo.customerNo,
                toAccountDigit: toAccountId.digits,
                amount: state.amount,
            }

            capitalTransferSupportDiffCurr(params).then((res) => {
                state.loading = false
                // console.log('划出成功了')
                if (res.check() && res.data) {
                    queryAccount(true)
                    queryAccount(false)
                    store.dispatch('_user/findCustomerInfo', false)
                }
                // return showDialog(res)
            })
        }

        const handleAll = () => {
            if (gt(state.maxTransfer, 0)) {
                state.amount = state.maxTransfer
            }
        }

        const handleAmount = (value) => {
            state.amount = value
        }

        const handleCurrency = ({ value }) => {
            state.curCurrencyValue = value
            // console.log(value, fromAccountList, '币种???????????')
        }

        const handleToCurrency = ({ value }) => {
            state.toCurrencyValue = value
        }

        const toRecord = () => {
            const routeParent = route.matched[route.matched.length - 2]
            router.push(routeParent.path + `/record?tradeType=${state.fromTradeType.id}&type=3`)
        }

        const handleSwap = () => {
            ;[state.fromTradeType, state.toTradeType] = [state.toTradeType, state.fromTradeType]
            ;[state.curCurrencyValue, state.toCurrencyValue] = [state.toCurrencyValue, state.curCurrencyValue]
            ;[state.maxTransfer, state.toMaxBalance] = [state.toMaxBalance, state.maxTransfer]
            state.amount = ''
        }

        // 返回上一次划转结构
        const onCancel = () => {
            // console.log('返回上一层')
            state.amount = ''
            state.transferSuccessTime = ''
        }
        // 预计汇率的icon提示
        const rateDescInfo = () => {
            Dialog.alert({
                message: t('assets.rateDesc'),
            })
        }

        // 给钱包充值
        const handleWalletCharge = () => {
            state.forWalletPopover = false
            const toAccountId = customerAccountList.value.find(
                (el) => Number(el.tradeType) === Number(2) && el.currency === toCurrency.value?.currency,
            )

            window.dataLayer?.push({
                event: 'depositBtn',
                'gtm.elementClasses': 'depositButton',
                eventModel: {
                    account_Number: customerInfo.value?.customerNo,
                },
            })

            firebaseAnalytics('ck_deposit_entrance', {
                key: 'ck_deposit_entrance',
                value: JSON.stringify({
                    email: customerInfo.value?.emailAll || customerInfo.value?.email || '',
                    phone: customerInfo.value?.phoneAll || customerInfo.value?.phone || '',
                    userID: customerInfo.value?.customerNo,
                }),
            })

            router.push('/order/recharge')
        }

        // 成功失败弹窗
        const showDialog = (data) => {
            if (!data.check()) {
                return Dialog.alert({
                    message: data.msg,
                    confirmButtonText: t('common.close'),
                })
            }
            // const isOrderPage = route.path === '/order/transfer'

            // 从合约到钱包仅提示划转成功
            // if (state.fromTradeType?.tradeType !== 5) {
            //     return Dialog.alert({
            //         message: t('assets.transferSuccess'),
            //         confirmButtonText: t('common.close'),
            //     })
            // }
            // return Dialog.confirm({
            //     message: t('assets.transferSuccessTrade'),
            //     confirmButtonText: t('common.goTrade'),
            //     cancelButtonText: t('common.nextTime'),
            // }).then(() => {
            //     if (isOrderPage) {
            //         router.back()
            //         return
            //     }
            //     return toDefaultOrder()
            // })
        }

        onMounted(() => {
            const queryCurrency = route.query.currency
            if (queryCurrency) {
                state.curCurrencyValue = queryCurrency
            }
            // 获取钱包资产数据
            store.dispatch('_user/queryCustomerAssetsInfo', { tradeType: 5 })
            // 监听收到websocket发送过来信息
            mitt.on('TRANSFER_SUCCESS_TIME', (timestamp) => {
                state.transferSuccessTime = window.dayjs(Number(timestamp)).format('YYYY-MM-DD HH:mm:ss')
            })
        })
        onUnmounted(() => {
            mitt.off('TRANSFER_SUCCESS_TIME')
        })

        return {
            plans,
            handleTransfer,
            handleSwap,
            toRecord,
            handleAll,
            fromAccountList,
            curCurrency,
            toAccountList,
            outAmountInput,
            curAmount,
            fromRate,
            toRate,
            fixedFormat,
            amountWarn,
            minTransfer,
            rateDescInfo,
            // handleWalletCharge,
            ...toRefs(state),
            inputBox,
            handleAmount,
            onCancel,
            handleCurrency,
            gt,
            mul,
            curRate,
            handleToCurrency,
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.fullPageWrapper {
    .topNav {
        box-shadow: none;
    }
    margin-top: 0;
    .page-content {
        padding: 20px 20px 20px 20px;
        background: var(--contentColor);
        border-radius: 4px;
        .transfer {
            display: flex;
            align-items: center;
            background: var(--contentColor);
            .label {
                margin: 0 rem(30px) 0 rem(22px);
                color: var(--minorColor);
                font-weight: bold;
                font-size: rem(28px);
                line-height: rem(27px);
                text-align: center;
                word-wrap: break-word;
                .dots {
                    margin: rem(20px) 0;
                    text-align: center;
                    .dot {
                        display: block;
                        width: rem(6px);
                        height: rem(6px);
                        margin: 0 auto rem(10px) auto;
                        text-align: center;
                        background: var(--placeholdColor);
                        border-radius: 50%;
                    }
                }
            }
            .center {
                flex: 1;
                border-right: solid 1px var(--lineColor);
                .account {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    height: rem(100px);
                    padding-right: rem(30px);
                    font-size: rem(28px);
                    line-height: rem(100px);
                    &.from {
                        border-bottom: solid 1px var(--lineColor);
                    }
                    .van-icon-arrow {
                        position: absolute;
                        right: 20px;
                        pointer-events: none;
                    }
                }
            }
        }

        .tip {
            // margin-top: rem(23px);
            color: var(--minorColor);
            .value {
                color: var(--color);
            }
            .van-icon {
                vertical-align: -1px;
                font-size: 16px;
            }
            button {
                margin-left: rem(8px);
                background: none;
                .all {
                    text-decoration: underline;
                    // color: var(--primary);
                    color: #4069f2;
                    cursor: pointer;
                }
            }
            &.warn {
                color: var(--warn);
                .value {
                    color: var(--warn);
                }
            }
        }
    }
    .accountTradeTypeName {
        padding-left: 15px;
        color: var(--color);
    }
    .estimate-rate {
        padding: 0 20px 24px 20px;
        .estimate-rate-box {
            width: 100%;
            display: flex;
            align-items: center;
            padding: 14px 16px;
            background-color: var(--fafColor);
            border-radius: 8px;
        }
    }
    .footerBtn {
        position: absolute;
        bottom: 0;
        left: 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        width: 100%;
        padding: 20px;
        padding-bottom: 24px;
        .returnBtn {
            @include hover();
            color: #fff;
            font-size: 14px;
            background: var(--primary);
            border: none;
            border-radius: 4px;
            &.disabled {
                background: #f7f7f7;
                color: #bdbdbd;
                font-family: 'Inter';
                font-size: 14px;
                font-weight: 600;
            }
        }
    }
    .right-title {
        color: var(--primary);
        font-size: rem(24px);
    }
    .switchType {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 16px 0;
        // padding: 0 12px;
        color: var(--color);
        & > svg {
            width: 24px;
            height: 24px;
        }
    }
    .transferItem {
        .bigLabel {
            font-size: 24px;
            color: var(--color);
            display: flex;
            justify-content: space-between;
            align-items: center;
            .from-wallet {
                display: flex;
                align-items: center;
                & > b {
                    color: #000;
                    font-family: 'Inter';
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 700;
                    line-height: normal;
                }
                & > img {
                    max-width: 24px;
                    max-height: 24px;
                }
            }
            b {
                font-weight: normal;
                color: var(--primary);
                margin-right: 8px;
            }
            .forwallet {
                color: var(--primary);
                text-decoration: underline;
                text-underline-offset: 0.4em;
                font-size: 14px;
                cursor: pointer;
                &.forwalletScale {
                    animation: scaleAnimation 0.8s ease-in;
                }
                @keyframes scaleAnimation {
                    0% {
                        transform: scale(1);
                    }
                    25% {
                        transform: scale(1.1);
                    }
                    50% {
                        transform: scale(1);
                    }
                    75% {
                        transform: scale(1.1);
                    }
                    100% {
                        transform: scale(1);
                    }
                }
            }
        }
        .card-top {
            margin-top: 6px;
            height: 128px;
        }
        .card-bottom {
            margin-top: 6px;
            height: 128px;
            background-color: var(--fafColor);
        }
    }
    .inputBox {
        background: var(--contentColor);
        position: relative;
        display: flex;
        align-items: center;
        border: 1px solid var(--lineColor);
        margin-top: 8px;
        border-radius: 4px;
        &:hover {
            border-color: var(--primary);
        }
        .transferInput {
            flex: 1;
            height: 48px;
            text-indent: 1em;
            border-right: 1px solid var(--lineColor);
            &:disabled {
                background: var(--lineColor);
                color: var(--minorColor);
                cursor: not-allowed;
            }
        }
        .all {
            position: absolute;
            top: 14px;
            right: 160px;
            cursor: pointer;
            &:hover {
                color: var(--primary);
            }
        }
        :deep {
            .select-box {
                width: 150px;
                .block-box {
                    border: 0;
                }
            }
        }
    }
}
.transfer-result {
    .topNav {
        box-shadow: none;
    }
    .result-left {
        display: flex;
        align-items: center;
        & > span {
            margin-left: 24px;
        }
    }
    .close-image {
        min-height: 72px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .title-back {
            display: flex;
            align-items: center;
            & > svg {
                cursor: pointer;
            }
            & > span {
                margin-left: 24px;
                color: #000;
                font-family: 'Inter';
                font-size: 20px;
                font-style: normal;
                font-weight: 600;
                line-height: normal;
            }
        }
    }
    .content {
        padding: 20px;
        padding-top: 0;
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
            & > span {
                color: #000;
                font-family: 'Inter';
                font-size: 16px;
                font-style: normal;
                font-weight: 700;
                line-height: normal;
            }
        }
        .success-info {
            margin-top: 34px;
            width: 100%;
            background-color: #faf9f9;
            display: flex;
            flex-direction: column;
            padding: 16px;
            .success-info-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 16px;
                &:last-of-type {
                    margin-bottom: 0;
                }
                .title {
                    color: #999;
                    font-family: 'Inter';
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: normal;
                }
                .value {
                    color: var(--mainColor);
                    font-family: 'Inter';
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: normal;
                    &.finish {
                        color: var(--primary);
                    }
                }
            }
        }
    }
}
</style>

<style lang="scss">
.toastTransferTip {
    span {
        vertical-align: middle;
        color: var(--primary);
    }
}
</style>

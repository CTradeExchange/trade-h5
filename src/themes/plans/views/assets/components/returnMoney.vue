<template>
    <van-popup v-model:show='show' position='bottom' @closed='closed' @open='onOpen'>
        <div class='returnMoneyPop'>
            <p class='closeBar'>
                <a class='closeBtn' href='javascript:;' @click='closed'>
                    <i class='icon_icon_close_big'></i>
                </a>
            </p>

            <div class='container'>
                <div class='actionBar'>
                    <span class='muted' @click='selectPickerField("outCurrency")'>
                        {{ $t('trade.yi') }}
                    </span>
                    <span class='currencySpan' @click='selectPickerField("outCurrency")'>
                        {{ outCurrency }}
                    </span>
                    <span class='icon_icon_arrow' @click='selectPickerField("outCurrency")'></span>
                    <input v-model='outAmount' class='input' type='number' />
                    <a class='all' href='javascript:;' @click='handleAll'>
                        {{ $t('trade.allPosition') }}
                    </a>
                </div>

                <p class='mutedTip'>
                    {{ $t('trade.free') + outAccount.available + outCurrency }}
                </p>
                <div class='actionBar mtop20'>
                    <span class='muted' @click='selectPickerField("inCurrency")'>
                        {{ $t('trade.huan') }}
                    </span>
                    <span class='currencySpan' @click='selectPickerField("inCurrency")'>
                        {{ inCurrency }}
                    </span>

                    <span class='icon_icon_arrow' @click='selectPickerField("inCurrency")'></span>
                    <span v-if='sameCurrency'>
                        ≈
                    </span>

                    <input class='input' readonly type='number' :value='inAmount' />
                    <van-loading v-if='computLoading' size='18' />
                </div>
                <p class='mutedTip'>
                    {{ $t('trade.daihuan') + inAccount.liabilities + inCurrency }}
                </p>
            </div>
            <van-button block class='returnBtn' :loading='loading' type='primary' @click='returnMoney'>
                {{ $t('trade.huan') }} {{ inCurrency }}
            </van-button>
        </div>
    </van-popup>
    <van-popup v-model:show='pickerShow' class='assetsPicker' position='bottom'>
        <van-picker :columns='columns' :default-index='2' title='' @confirm='onPickerConfirm' />
    </van-popup>
</template>

<script>
import { computed, reactive, ref, toRefs, watch, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import BigNumber from 'bignumber.js'
import { useI18n } from 'vue-i18n'
import { manualRepayment, addRepaymentOrder, previewOrder } from '@/api/user'
import { Toast } from 'vant'
import { debounce, isEmpty } from '@/utils/util'
export default {
    props: ['modelValue', 'account'],
    emits: ['update:modelValue'],
    setup (props, { emit }) {
        const { t } = useI18n({ useScope: 'global' })
        const store = useStore()
        const route = useRoute()
        const state = reactive({
            show: false,
            pickerShow: false,
            pickerField: ' ', // 选择还币还是被还的币 outCurrency, inCurrency
            outCurrency: '', // 以xx币还
            inCurrency: '', // 还xx币
            outAmount: '', // 以xx币还的金额
            loading: false,
            computLoading: false,
            inAmount: '',
            sameCurrency: false
        })

        const customInfo = computed(() => store.state._user.customerInfo)
        const assetsInfo = computed(() => store.state._user.assetsInfo)
        const outAccount = computed(() => customInfo.value?.accountMap[state.outCurrency]) // 以xx币还的账户
        const inAccount = computed(() => customInfo.value?.accountMap[state.inCurrency]) // 还xx币的账户

        const productList = computed(() => store.state._quote.productList)

        // 当前币种
        const columns = computed(() => customInfo?.value?.accountList.filter(item => [3, 9].includes(item.tradeType)).map(el => el.currency))
        const tradeType = computed(() => customInfo?.value?.accountMap[route.query.currency].tradeType)

        watch(
            () => props.modelValue,
            newval => {
                if (state.show !== newval) state.show = newval
            },
            { immediate: true }
        )

        watchEffect(() => {
            // 金额变动重新计算汇率
            if (!isEmpty(state.outAmount)) {
                const rateProduct = productList.value.find(({ baseCurrency, profitCurrency }) => (baseCurrency === state.inCurrency && profitCurrency === state.outCurrency))
                if (state.outCurrency === state.inCurrency) {
                    state.inAmount = state.outAmount
                } else if (rateProduct) {
                    if (state.outCurrency === rateProduct.profitCurrency) {
                        state.inAmount = BigNumber(state.outAmount).div(rateProduct.buy_price).toFixed(inAccount.value.digits)
                    } else {
                        state.inAmount = BigNumber(state.outAmount).times(rateProduct.sell_price).toFixed(inAccount.value.digits)
                    }
                } else {
                    computeReturnMoney()
                }
            } else {
                state.inAmount = ''
            }
        })

        // 防抖处理还币输入框，
        const computeReturnMoney = debounce(() => {
            // state.searchKey = val
            state.computLoading = true
            const params = {
                tradeType: tradeType.value,
                sourceCurrency: state.outCurrency,
                targetCurrency: state.inCurrency,
                requestNum: state.outAmount,
                requestTime: Date.now(),
                remark: '',
                customerCurrency: assetsInfo.value.currency,
            }
            previewOrder(params)
                .then(res => {
                    state.computLoading = false
                    state.loading = false
                    if (res.check()) {
                        state.inAmount = res.data
                    } else {
                        state.inAmount = ''
                    }
                }).catch(err => {
                    state.computLoading = false
                })
        })

        const closed = () => {
            emit('update:modelValue', false)
        }
        const onOpen = () => {
            // 默认还币为当前子账户币种
            state.inCurrency = props.account.currency
            state.outCurrency = props.account.currency
            if (parseFloat(props.account.available) === 0) {
                const accountList = store.state._user.customerInfo?.accountList.filter(item => [3, 9].includes(item.tradeType)) || []
                const newAccountList = accountList.slice().sort((a, b) => parseFloat(b.available) - parseFloat(a.available))
                if (newAccountList.length && newAccountList[0].available > 0) {
                    // state.outCurrency = newAccountList[0].currency
                }
            }
        }
        // 显示选币弹窗
        const selectPickerField = val => {
            // state.pickerField = val
            // state.pickerShow = true
        }
        const onPickerConfirm = val => {
            console.log(val, state.pickerField)
            state[state.pickerField] = val
            state.pickerShow = false
            if (!isEmpty(state.outAmount) && state.outCurrency !== state.inCurrency) {
                computeReturnMoney()
                state.sameCurrency = true
            } else if (state.outCurrency === state.inCurrency) {
                state.sameCurrency = false
            }
        }

        const handleAll = () => {
            state.outAmount = outAccount.value.available
        }

        const returnSuccess = () => {
            Toast(t('trade.repaymentSuccess'))
            state.show = false
            store.dispatch('_user/queryAccountAssetsInfo', { tradeType: tradeType.value, accountId: parseInt(route.query.accountId) })
            state.inAmount = ''
            state.outAmount = ''
        }

        // 手动还币
        const returnMoney = () => {
            if (isEmpty(state.outAmount)) {
                return Toast(t('trade.enterReturnAmount'))
            }
            state.loading = true

            // 如果来源货币和目标货币相同，刚手动还款，否则通过下单还币
            if (state.outCurrency === state.inCurrency) {
                manualRepayment({
                    tradeType: tradeType.value,
                    customerNo: customInfo.value.customerNo,
                    accountId: props.account.accountId,
                    customerGroupId: customInfo.value.customerGroupId,
                    accountCurrency: assetsInfo.value.currency,
                    amount: state.outAmount,
                })
                    .then(res => {
                        state.loading = false
                        if (res.check() && res.data) {
                            returnSuccess()
                        }
                    }).catch(err => {
                        state.loading = false
                    })
            } else {
                addRepaymentOrder({
                    tradeType: tradeType.value,
                    sourceCurrency: state.outCurrency,
                    targetCurrency: state.inCurrency,
                    customerCurrency: assetsInfo.value.currency,
                    requestNum: state.outAmount,
                    requestTime: Date.now(),
                    remark: '',
                }).then(res => {
                    state.loading = false
                    if (res.check()) {
                        returnSuccess()
                    }
                }).catch(err => {
                    state.loading = false
                })
            }
        }

        // store.dispatch('_user/queryCustomerAssetsInfo', { tradeType: 3 })

        return {
            ...toRefs(state),
            onPickerConfirm,
            selectPickerField,
            outAccount,
            inAccount,
            columns,
            closed,
            onOpen,
            returnMoney,
            handleAll,
            assetsInfo
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.returnMoneyPop {
    padding: rem(80px) rem(30px) rem(140px);
    .closeBtn {
        position: absolute;
        top: rem(30px);
        right: rem(30px);
    }
    .icon_icon_close_big {
        color: var(--color);
    }
    .actionBar {
        position: relative;
        display: flex;
        align-items: center;
        height: rem(80px);
        padding: 0 rem(30px);
        color: var(--color);
        font-size: rem(28px);
        line-height: rem(80px);
        background: var(--assistColor);
        .icon_icon_arrow {
            margin-left: rem(10px);
            font-size: rem(24px);
        }
        .input {
            flex: 1;
            height: rem(40px);
            margin-left: rem(20px);
            padding-left: rem(20px);
            border-left: 1px solid var(--lineColor);
        }
        .all {
            position: absolute;
            top: 0;
            right: rem(20px);
            bottom: 0;
            margin: auto;
            color: var(--primary);
            font-size: rem(24px);
        }
        .currencySpan {
            margin-left: 3px;
        }
    }
    .mutedTip {
        margin-top: 5px;
        color: var(--minorColor);
        font-size: rem(20px);
    }
    .returnBtn {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
    }
}
.assetsPicker {
    --van-picker-background-color: var(--contentColor);
}
</style>

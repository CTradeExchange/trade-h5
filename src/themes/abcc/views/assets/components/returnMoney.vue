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
                    <input v-model='outAmount' class='input' type='text' />
                    <a class='all' href='javascript:;'>
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
                    ≈
                    <input class='input' type='text' :value='inAmount' />
                </div>
                <p class='mutedTip'>
                    {{ $t('trade.daihuan') + inAccount.liabilitiesPrincipal + inCurrency }}
                </p>
            </div>
            <van-button block class='returnBtn' type='primary'>
                {{ $t('trade.huan') }} {{ inCurrency }}
            </van-button>
        </div>
    </van-popup>
    <van-popup v-model:show='pickerShow' class='assetsPicker' position='bottom'>
        <van-picker :columns='columns' :default-index='2' title='' @confirm='onPickerConfirm' />
    </van-popup>
</template>

<script>
import { computed, reactive, ref, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
import BigNumber from 'bignumber.js'
export default {
    props: ['modelValue', 'account'],
    emits: ['update:modelValue'],
    setup (props, { emit }) {
        const store = useStore()
        const state = reactive({
            show: false,
            pickerShow: false,
            pickerField: 'outCurrency', // 选择还币还是被还的币 outCurrency, inCurrency
            outCurrency: '', // 以xx币还
            inCurrency: '', // 还xx币
            outAmount: '', // 以xx币还的金额
        })
        const accountMap = computed(() => store.state._user.customerInfo?.accountMap)
        const outAccount = computed(() => accountMap?.value[state.outCurrency]) // 以xx币还的账户
        const inAccount = computed(() => accountMap?.value[state.inCurrency]) // 还xx币的账户
        const accountList = computed(() => store.state._user.customerInfo?.accountList || [])
        const productList = computed(() => store.state._quote.productList)
        const inAmount = computed(() => { // 还xx币的金额
            const rateProduct = productList.value.find(({ baseCurrency, profitCurrency }) => (baseCurrency === state.inCurrency && profitCurrency === state.outCurrency))
            if (state.outCurrency === state.inCurrency) {
                return state.outAmount
            } else if (rateProduct) {
                if (state.outCurrency === rateProduct.profitCurrency) {
                    return BigNumber(state.outAmount).div(rateProduct.buy_price).toFixed(inAccount.value.digits)
                } else {
                    return BigNumber(state.outAmount).times(rateProduct.sell_price).toFixed(inAccount.value.digits)
                }
            } else {
                // 双边都是非USDT
            }
            return ''
        })
        const columns = computed(() => accountList.value.map(el => el.currency))
        watch(
            () => props.modelValue,
            newval => {
                if (state.show !== newval) state.show = newval
            },
            { immediate: true }
        )
        const closed = () => {
            emit('update:modelValue', false)
        }
        const onOpen = () => {
            // 默认还币为当前子账户币种
            state.inCurrency = props.account.currency
            state.outCurrency = props.account.currency
            if (parseFloat(props.account.available) === 0) {
                const accountList = store.state._user.customerInfo?.accountList || []
                const newAccountList = accountList.slice().sort((a, b) => parseFloat(b.available) - parseFloat(a.available))
                if (newAccountList.length && newAccountList[0].available > 0) {
                    state.outCurrency = newAccountList[0].currency
                }
            }
        }
        // 显示选币弹窗
        const selectPickerField = val => {
            state.pickerField = val
            state.pickerShow = true
        }
        const onPickerConfirm = val => {
            console.log(val, state.pickerField)
            state[state.pickerField] = val
            state.pickerShow = false
        }
        return {
            ...toRefs(state),
            onPickerConfirm,
            selectPickerField,
            outAccount,
            inAccount,
            inAmount,
            columns,
            closed,
            onOpen,
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

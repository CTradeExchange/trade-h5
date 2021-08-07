<template>
    <van-popup v-model:show='show' position='bottom' @closed='closed'>
        <div class='returnMoneyPop'>
            <p class='closeBar'>
                <a class='closeBtn' href='javascript:;' @click='closed'>
                    <i class='icon_icon_close_big'></i>
                </a>
            </p>
            <div class='container'>
                <div class='actionBar'>
                    <span class='muted' @click='selectcurCurrency("outCurrency")'>
                        {{ $t('trade.get') }}
                    </span>
                    <span class='currencySpan' @click='selectcurCurrency'>
                        {{ curCurrency }}
                    </span>
                    <span class='icon_icon_arrow' @click='selectcurCurrency("outCurrency")'></span>
                    <input v-model='amount' class='input' type='number' />
                    <a class='all' href='javascript:;' @click='handleAll'>
                        {{ $t('trade.allPosition') }}
                    </a>
                </div>
                <div class='info'>
                    <div class='info-item'>
                        <span class='fl'>
                            {{ $t('assets.maxLoan') }}<van-icon name='question-o' @click='showInfo(1)' />
                        </span>
                        <span class='fr'>
                            {{ maxLoan }}
                        </span>
                    </div>
                    <div class='info-item'>
                        <span class='fl'>
                            {{ $t('assets.dailyRate') }}<van-icon name='question-o' @click='showInfo(2)' />
                        </span>
                        <span class='fr'>
                            {{ curAccount.interestProportion }} %
                        </span>
                    </div>
                    <div class='info-item'>
                        <span class='fl'>
                            {{ $t('assets.alreadyLoan') }}
                        </span>
                        <span class='fr'>
                            {{ loaned }}
                        </span>
                    </div>
                </div>
            </div>

            <van-button block class='returnBtn' :loading='loading' type='primary' @click='handleLoan'>
                {{ $t('trade.get') }} {{ curCurrency }}
            </van-button>
        </div>
    </van-popup>

    <van-popup v-model:show='pickerShow' class='assetsPicker' position='bottom'>
        <van-picker :columns='columns' :columns-field-names='customFieldName' :default-index='2' title='' @confirm='onPickerConfirm' />
    </van-popup>
</template>

<script>
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { Dialog, Toast } from 'vant'
import { useI18n } from 'vue-i18n'
import { gt } from '@/utils/calculation'

import { manualLoan } from '@/api/user'
import { computed, reactive, onMounted, ref, toRefs, watch, watchEffect, nextTick } from 'vue'
import { isEmpty } from '@/utils/util'
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
            curCurrency: route.query.currency,
            amount: '',
            loading: false,
            loaned: '',
            maxLoan: ''
        })

        const customInfo = computed(() => store.state._user.customerInfo)
        // 当前币种
        const columns = computed(() => customInfo?.value?.accountList.filter(item => item.tradeType === 3).map(el => {
            return {
                currency: el.currency,
                accountId: el.accountId
            }
        }))

        // 选中的币种
        const curAccount = computed(() =>
            customInfo?.value?.accountMap[state.curCurrency]
        )

        // 自定义picker字段
        const customFieldName = {
            text: 'currency',
            children: 'cities',
        }

        // 显示选币弹窗
        const selectcurCurrency = val => {
            state.pickerShow = true
        }

        const onPickerConfirm = val => {
            console.log(val, state.curCurrency)
            state.pickerShow = false
            state.curCurrency = val.currency
            state.maxLoan = curAccount.value?.availableLoan || 0
            state.loaned = isEmpty(curAccount.value?.liabilitiesPrincipal) || 0
            // 获取最新的资产数据
            store.dispatch('_user/queryAccountAssetsInfo', {
                tradeType: curAccount.value?.tradeType,
                accountId: val.accountId
            })
        }

        const closed = () => {
            emit('update:modelValue', false)
        }

        const showInfo = (type) => {
            const params = type === 1 ? [props.account.availableLoan] : [state.curCurrency, curAccount.value?.interestProportion || '--']
            Dialog.alert({
                message: t(`assets.loanNotice[${type}]`, params),
            }).then(() => {
                // on close
            })
        }

        const handleAll = () => {
            state.amount = state.maxLoan
        }

        // 借款
        const handleLoan = () => {
            if (parseFloat(state.amount) < 0) {
                return Toast(t('assets.loanAmountNaN'))
            }
            if (isEmpty(state.amount)) {
                return Toast(t('assets.loanAmountNotice'))
            }

            if (gt(state.amount, state.maxLoan)) {
                return Toast(t('assets.loanAmountExcess'))
            }

            state.loading = true
            const params = {
                customerNo: customInfo.value.customerNo,
                accountId: props.account.accountId,
                customerGroupId: customInfo.value.customerGroupId,
                accountCurrency: state.curCurrency,
                amount: state.amount
            }
            manualLoan(params)
                .then(res => {
                    state.loading = false
                    state.show = false
                    if (res.check()) {
                        Toast(t('assets.loanSuccess'))
                        state.amount = ''
                        store.dispatch('_user/queryAccountAssetsInfo', {
                            tradeType: curAccount.value?.tradeType,
                            accountId: parseInt(route.query.accountId)
                        })
                    } else {
                        state.amount = ''
                    }
                }).catch(err => {
                    state.loading = false
                })
        }

        watch(
            () => props.modelValue,
            newval => {
                if (newval) {
                    state.maxLoan = props.account.availableLoan
                    state.loaned = props.account.liabilitiesPrincipal
                }
                if (state.show !== newval) state.show = newval
            },
            { immediate: true }
        )

        return {
            closed,
            columns,
            showInfo,
            handleLoan,
            onPickerConfirm,
            selectcurCurrency,
            handleAll,
            curAccount,
            customFieldName,
            ...toRefs(state)
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
            margin-right: rem(10px);
        }
        .muted {
            margin-right: rem(15px);
        }
    }
    .info {
        .info-item {
            display: flex;
            justify-content: space-between;
            margin-top: rem(10px);
            color: var(--minorColor);
            .van-icon {
                margin-left: rem(5px);
            }
        }
    }
    .returnBtn {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
    }
}

</style>

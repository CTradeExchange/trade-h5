<template>
    <div class='fullPageWrapper'>
        <LayoutTop :back='true' :menu='false'>
            <template #right>
                <a class='right-title' href='javascript:;' @click='toRecord'>
                    {{ $t('assets.transferRecord') }}
                </a>
            </template>
        </LayoutTop>
        <div class='page-content'>
            <div class='transfer'>
                <div class='label'>
                    {{ $t('common.from') }}
                    <div class='dots'>
                        <span v-for='i in 3' :key='i' class='dot'>
                        </span>
                    </div> {{ $t('common.to') }}
                </div>
                <div class='center'>
                    <div class='from account' @click='handleFrom'>
                        <span> {{ fromAccount.name }}</span>
                        <van-icon name='arrow' />
                    </div>
                    <div class='to account' @click='handleTo'>
                        <span> {{ toAccount.name }}</span>
                        <van-icon name='arrow' />
                    </div>
                </div>
                <div class='right' @click='handleSwap'>
                    <i class='icon_zhuanhuan'></i>
                </div>
            </div>
            <div class='action-bar' @click='pickerShow=true'>
                <span class='label'>
                    {{ curCurrency?.currency }}
                </span>
                <van-icon name='arrow' />
            </div>
            <div class='action-bar'>
                <input v-model='amount' :placeholder='$t("assets.minTransfer")+ minTransfer' type='number' />
                <span class='unit'>
                    {{ curCurrency?.currency }}
                </span>
                <span class='all' @click='handleAll'>
                    {{ $t('common.all') }}
                </span>
            </div>
            <p class='tip'>
                {{ $t('assets.maxTransfer') }} {{ maxTransfer }} {{ curCurrency?.currency }}
            </p>
        </div>

        <div class='footerBtn'>
            <van-button block class='returnBtn' :loading='loading' type='primary' @click='handleTransfer'>
                {{ $t('trade.transfer') }} {{ curCurrency?.currency }}
            </van-button>
        </div>
        <Loading :show='loading' />

        <van-popup v-model:show='pickerShow' class='assetsPicker' position='bottom'>
            <van-picker
                :columns='accountList'
                :columns-field-names='currencyField'
                @cancel='pickerShow = false'
                @confirm='onCurrencyConfirm'
            />
        </van-popup>
        <van-popup v-model:show='accountShow' class='assetsPicker' position='bottom'>
            <van-picker
                :columns='plans'
                :columns-field-names='customField'
                @cancel='accountShow = false'
                @confirm='onPickerConfirm'
            />
        </van-popup>
    </div>
</template>

<script>
import { computed, reactive, toRefs, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Toast } from 'vant'
import { pow, gt, lt } from '@/utils/calculation'
import { capitalTransfer } from '@/api/user'
import { isEmpty } from '@/utils/util'
export default {
    setup (props, { emit }) {
        const { t } = useI18n({ useScope: 'global' })
        const store = useStore()
        const router = useRouter()
        const route = useRoute()
        const { accountId, tradeType } = route.query
        const state = reactive({
            pickerShow: false,
            accountShow: false,
            loading: false,
            fromAccount: '',
            toAccount: '',
            assetsList: [],
            transferType: '',
            amount: '',
            curCurrency: ''
        })

        // 获取玩法列表
        const plans = computed(() => store.state._base.plans)
        // 获取账户信息
        const { value: customInfo } = computed(() => store.state._user.customerInfo)

        const toAccountId = computed(() => {
            return store.state._user?.customerInfo?.accountList.find(el => Number(el.tradeType) === Number(state.toAccount.id) && el.currency === state.curCurrency.currency)
        })

        const accountList = computed(() =>
            store.state._user?.customerInfo?.accountList?.filter(el => Number(el.tradeType) === Number(state.fromAccount.id))
        )

        state.fromAccount = plans.value[0]
        state.toAccount = plans.value.filter(el => el.name !== state.fromAccount.name)[0]
        // 最大可转
        const maxTransfer = computed(() => accountList.value.find(item => item.currency === state.curCurrency.currency)?.withdrawAmount)
        const minTransfer = computed(() => {
            const digits = state.curCurrency.digits
            return pow(0.1, digits)
        })

        watchEffect(() => {
            if (accountList.value.length > 0) {
                state.curCurrency = accountList.value[0]
            }
        })

        const handleTransfer = () => {
            // state.fromAccount = state.toAccount
            // state.toAccount = state.fromAccount
            if (isEmpty(state.amount)) {
                return Toast(t('assets.transferTip1'))
            }
            if (state.amount <= 0) {
                return Toast(t('assets.transferTip6'))
            }
            if (isEmpty(toAccountId.value)) {
                return Toast(state.toAccount.name + t('common.notFound') + state.curCurrency.currency + t('common.account'))
            }

            if (gt(state.amount, maxTransfer.value.balance)) {
                return Toast(t('assets.transferTip4'))
            }
            if (lt(state.amount, minTransfer.value)) {
                return Toast(t('assets.transferTip5'))
            }
            state.loading = true
            const params = {
                customerNo: customInfo.customerNo,
                accountId: state.curCurrency.accountId,
                customerId: customInfo.id,
                tradeType: state.fromAccount.id,
                accountDigit: state.curCurrency.digits,
                toTradeType: state.toAccount.id,
                toAccountId: toAccountId.value.accountId,
                toCustomerNo: customInfo.customerNo,
                toAccountDigit: state.curCurrency.digits,
                amount: state.amount
            }

            capitalTransfer(params).then(res => {
                state.loading = false
                if (res.check() && res.data) {
                    state.amount = ''
                    Toast(t('assets.transferSuccess'))
                    if ([3, 5, 9].includes(Number(state.fromAccount.id))) {
                        store.dispatch('_user/queryCustomerAssetsInfo', { tradeType: state.fromAccount.id })
                    }
                }
            }).catch(err => {
                state.loading = false
            })
        }

        const handleAll = () => {
            state.amount = state.curCurrency.balance
        }

        const onPickerConfirm = (val) => {
            state.accountShow = false

            if (state.transferType === 1) {
                state.fromAccount = val
            } else {
                state.toAccount = val
            }
            // abcc 现货杠杆 杠杆全仓重新拉账户资产
            if ([3, 5, 9].includes(Number(state.fromAccount.id))) {
                store.dispatch('_user/queryCustomerAssetsInfo', { tradeType: state.fromAccount.id })
            }
        }
        const toRecord = () => {
            router.push({
                path: '/record',
                query: {
                    accountId,
                    tradeType,
                    type: 3
                }
            })
        }
        const handleFrom = () => {
            state.transferType = 1
            state.accountShow = true
            state.assetsList = plans.value.filter(el => el.name !== state.toAccount.name)
            // state.assetsList = plans.value.filter(el => el.name !== state.toAccount)
        }

        // 选取币种确定事件
        const onCurrencyConfirm = (val) => {
            state.curCurrency = val
            // state.maxTransfer = accountList.value.find(item => item.currency === val.currency)

            state.pickerShow = false
        }

        const handleTo = () => {
            state.transferType = 2
            state.accountShow = true
            state.assetsList = plans.value.filter(el => el.name !== state.fromAccount.name)
        }
        const customField = {
            text: 'name',
        }

        const currencyField = {
            text: 'currency'
        }

        const handleSwap = () => {
            [state.fromAccount, state.toAccount] = [state.toAccount, state.fromAccount]
        }

        if ([3, 5, 9].includes(Number(route.query.tradeType))) {
            store.dispatch('_user/queryCustomerAssetsInfo', { tradeType: route.query.tradeType })
        }

        return {
            plans,
            handleTransfer,
            handleSwap,
            onCurrencyConfirm,
            onPickerConfirm,
            handleFrom,
            handleTo,
            customField,
            toRecord,
            handleAll,
            accountList,
            currencyField,
            maxTransfer,
            minTransfer,
            ...toRefs(state),

        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.fullPageWrapper {
    background-color: var(--contentColor);
    .page-content {
        padding: rem(30px);
        .transfer {
            display: flex;
            align-items: center;
            background: var(--bgColor);
            .label {
                //flex: 1;
                width: rem(22px);
                margin: 0 rem(30px) 0 rem(22px);
                color: var(--minorColor);
                font-weight: bold;
                font-size: rem(28px);
                line-height: rem(27px);
                letter-spacing: rem(20px);
                text-align: center;
                word-wrap: break-word;
                .dots {
                    margin: rem(20px) 0;
                    text-align: center;
                    .dot {
                        display: block;
                        width: rem(6px);
                        height: rem(6px);
                        margin: 0 auto  rem(10px) auto;
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
                }
            }
            .right {
                //flex: 1;
                .icon_zhuanhuan {
                    margin: 0 rem(32px);
                    color: var(--primary);
                    font-size: rem(44px);
                }
            }
        }
        .action-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: rem(80px);
            margin-top: rem(50px);
            padding: 0 rem(30px);
            color: var(--color);
            font-size: rem(28px);
            background: var(--bgColor);
            border-radius: rem(6px);
            input {
                flex: 1;
            }
            .unit {
                margin-right: rem(30px);
                padding-right: rem(30px);
                border-right: solid 1px var(--lineColor);
            }
            .all {
                color: var(--primary);
            }
        }
        .tip {
            margin-top: rem(23px);
            margin-left: rem(23px);
            color: var(--minorColor);
        }
    }
    .footerBtn {
        position: fixed;
        bottom: 0;
        left: 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        width: 100%;
        .returnBtn {
            margin: rem(20px);
            color: #FFF;
            font-size: rem(30px);
            background: var(--primary);
            border: none;
            border-radius: rem(6px);
        }
    }
    .right-title {
        color: var(--primary);
        font-size: rem(24px);
    }
}
</style>

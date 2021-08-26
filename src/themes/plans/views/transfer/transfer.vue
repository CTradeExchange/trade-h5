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
                <input v-model='amount' placeholder='最少划转 0.000001' type='number' />
                <span class='unit'>
                    USD
                </span>
                <span class='all' @click='handleAll'>
                    {{ $t('common.all') }}
                </span>
            </div>
            <p class='tip'>
                {{ $t('assets.maxTransfer') }} 0.05000000 BTC
            </p>
        </div>

        <div class='footerBtn'>
            <van-button block class='returnBtn' :loading='loading' type='primary' @click='handleTransfer'>
                {{ $t('trade.transfer') }} {{ curCurrency?.currency }}
            </van-button>
        </div>

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
                :columns='assetsList'
                :columns-field-names='customField'
                @cancel='accountShow = false'
                @confirm='onPickerConfirm'
            />
        </van-popup>
    </div>
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Toast } from 'vant'
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
            currency: 'USDT',
            curCurrency: '',
            pickerShow: false,
            currencyList: ['USDT', 'BTC'],
            accountShow: false,
            loading: false,
            fromAccount: '',
            toAccount: '',
            assetsList: [],
            transferType: '',
            amount: ''
        })

        // 获取玩法列表
        const plans = computed(() => store.state._base.plans)
        // 获取账户信息
        const { value: customInfo } = computed(() => store.state._user.customerInfo)

        state.fromAccount = plans.value[0]
        state.toAccount = plans.value.filter(el => el.name !== state.fromAccount)[0]

        const { value: accountList } = computed(() => store.state._user?.customerInfo?.accountList?.filter(el => Number(el.tradeType) === Number(state.fromAccount.id)))

        state.curCurrency = accountList[0]

        const handleTransfer = () => {
            // state.fromAccount = state.toAccount
            // state.toAccount = state.fromAccount
            if (isEmpty(state.amount)) {
                return Toast(t('assets.transferTip1'))
            }
            if (state.amount <= 0) {
                return Toast(t('assets.transferTip2'))
            }
            capitalTransfer({
                customerNo: customInfo.customerNo,
                accountId: '',
                customerId: customInfo.id,
                tradeType: state.fromAccount.id,
                accountDigit: state.curCurrency.digits,
                toTradeType: state.toAccount.id,
                toAccountId: '',
                toCustomerNo: customInfo.customerNo,
                toAccountDigit: state.curCurrency.digits,
                amount: ''
            }).then(res => {

            }).catch(err => {
                state.loadingMore = false
                state.loading = false
            })
        }

        const handleAll = () => {

        }

        const onPickerConfirm = (val) => {
            state.accountShow = false

            if (state.transferType === 1) {
                state.fromAccount = val
            } else {
                state.toAccount = val
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
            state.assetsList = plans.value
            // state.assetsList = plans.value.filter(el => el.name !== state.toAccount)
        }

        // 选取币种确定事件
        const onCurrencyConfirm = (val) => {
            state.curCurrency = val
            state.pickerShow = false
        }

        const handleTo = () => {
            state.transferType = 2
            state.accountShow = true
            state.assetsList = plans.value.filter(el => el.name !== state.fromAccount)
        }
        const customField = {
            text: 'name',
        }

        const currencyField = {
            text: 'currency'
        }

        const handleSwap = () => {

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
        padding: 0 rem(30px);
        .transfer {
            display: flex;
            align-items: center;
            background: var(--assistColor);
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
            background: var(--assistColor);
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
        }
    }
    .right-title {
        color: var(--primary);
        font-size: rem(24px);
    }
}
</style>

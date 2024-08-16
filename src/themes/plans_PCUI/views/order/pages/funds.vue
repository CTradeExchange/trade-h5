<template>
    <div id='funds' class='funds'>
        <div class='header'>
            <div class='title'>
                <span>
                    {{ $t('trade.funds') }}
                </span>
            </div>
        </div>
        <el-scrollbar>
            <section v-if='islogin' class='assetsModule'>
                <div class='wallet-info'>
                    <div class='wallet-info-top' @click='showAmoutChange'>
                        <span>{{ $t('wallet.totalAssetValuation') }}{{ `(USD)` }}</span>
                        <van-icon v-if='showAmout' class='icon' name='eye-o' />
                        <van-icon v-else class='icon' name='closed-eye' />
                    </div>

                    <div class='wallet-info-bottom' @click="routerPushFund('fundFlow', '2')">
                        <span v-if='showAmout'>
                            {{ `$${addThousandthSign(userAccount.netWorth || 0, digits)}` }}
                        </span>
                        <span v-else class='not-show-amout'>
                            {{ '*******' }}
                        </span>
                        <el-icon><ArrowRight /></el-icon>
                    </div>
                </div>

                <div class='action-info'>
                    <div class='action-info-item' @click.stop='confirmOpenBlockAtm'>
                        <img alt='' src='@/themeCommon/image/Deposit.png' />
                        <span class='mt-1'>
                            {{ $t('wallet.desposit') }}
                        </span>
                    </div>

                    <div class='action-info-item' @click="routerPush('withdraw', 'ck_without_entrance')">
                        <img alt='' src='@/themeCommon/image/Withdraw.png' />
                        <span class='mt-1'>
                            {{ $t('wallet.withdraw') }}
                        </span>
                    </div>

                    <div class='action-info-item' @click="routerPushFund('fundRecords', '2')">
                        <img alt='' src='@/themeCommon/image/Records.png' />
                        <span class='mt-1'>
                            {{ $t('headLineTrade.records') }}
                        </span>
                    </div>

                    <div class='action-info-item' @click="routerPushFund('fundFlow', '2')">
                        <img alt='' src='@/themeCommon/image/Flows.png' />
                        <span class='mt-1'>
                            {{ $t('fund.flow') }}
                        </span>
                    </div>
                </div>
                <div class='flex items-center justify-space-between mt-8 mb-6'>
                    <div class='flex items-center'>
                        <CurrencyIcon :currency="userAccount?.currency ? userAccount.currency : 'USDT'" :size='32' />
                        <div class='ml-2'>
                            <div class='font-bold text-sm'>
                                {{ currency || 'USDT' }}
                            </div>
                            <div class='text-minorColor text-xs'>
                                {{ rate ? `$${addThousandthSign(rate, 2)}` : '' }}
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class='font-bold text-sm'>
                            {{ !showAmout ? '*******' : addThousandthSign(userAccount.netWorth || 0, digits) }}
                        </div>
                        <div class='text-minorColor text-xs'>
                            {{ !showAmout ? '*******' : `$${addThousandthSign(mul(userAccount.netWorth, rate), digits)}` }}
                        </div>
                    </div>
                </div>
                <div class='p-3 bg-assistColor'>
                    <div class='flex justify-space-between items-center'>
                        <div>
                            <popover placement='left' :text="$t('trade.jingzhi') + $t('fund.equityTips')" @click.stop>
                                <template #reference>
                                    <span class='tooltip-cursor text-minorColor mr-1 text-xs'>
                                        {{ $t('trade.jingzhi') }}
                                    </span>
                                </template>
                            </popover>
                        </div>
                        <div class='font-bold text-sm'>
                            {{ !showAmout ? '*******' : `${addThousandthSign(totalInitialMargin, digits)} ${currency}` }}
                        </div>
                    </div>
                    <div class='flex justify-space-between items-center mt-3'>
                        <div>
                            <span class='text-minorColor mr-1 text-xs'>
                                {{ $t('assets.positionProfit') }}
                            </span>
                        </div>
                        <div
                            class='font-bold text-sm'
                            :class='{ riseColor: userAccount?.profitLoss > 0, fallColor: userAccount?.profitLoss < 0 }'
                        >
                            {{
                                !showAmout
                                    ? '*******'
                                    : `${gt(userAccount?.profitLoss, 0) ? '+' : ''}${addThousandthSign(
                                        userAccount.profitLoss || 0,
                                        digits,
                                    )} ${currency}`
                            }}
                        </div>
                    </div>
                    <div class='flex justify-space-between items-center mt-3'>
                        <div>
                            <popover placement='left' :text="$t('trade.free') + $t('fund.availableTips')" @click.stop>
                                <template #reference>
                                    <span class='tooltip-cursor text-minorColor mr-1 text-xs'>
                                        {{ $t('trade.free') }}
                                    </span>
                                </template>
                            </popover>
                        </div>
                        <div class='font-bold text-sm'>
                            {{ !showAmout ? '*******' : `${addThousandthSign(userAccount.availableMargin || 0, digits)} ${currency}` }}
                        </div>
                    </div>
                    <div class='flex justify-space-between items-center mt-3'>
                        <div>
                            <popover placement='left' :text="$t('trade.originalMargin') + $t('fund.marginUsedTips')" @click.stop>
                                <template #reference>
                                    <span class='tooltip-cursor text-minorColor mr-1 text-xs'>
                                        {{ $t('trade.originalMargin') }}
                                    </span>
                                </template>
                            </popover>
                        </div>
                        <div class='font-bold text-sm'>
                            {{ !showAmout ? '*******' : `${addThousandthSign(userAccount.occupyMargin || 0, digits)} ${currency}` }}
                        </div>
                    </div>
                    <div v-if='product?.tradeType === 1' class='flex justify-space-between items-center mt-3'>
                        <div>
                            <span class='text-minorColor mr-1 text-xs tooltip-cursor cursor-pointer' @click='showExplain(4)'>
                                {{ $t('trade.marginLevel') }}
                            </span>
                        </div>
                        <div v-if='showAmout' class='text-sm font-bold flex items-center'>
                            <span class='tradeing-assets-value'>
                                {{ userAccount?.marginRadio ? `${userAccount.marginRadio}%` : '--' }}
                            </span>
                            <span v-if='userAccount?.riskStatus' :class="['riskLevel', 'riskLevel' + userAccount?.riskStatus]">
                                {{ riskLevelMap[userAccount?.riskStatus] }}
                            </span>
                        </div>
                        <div v-else class='text-sm font-bold flex items-center'>
                            *******
                        </div>
                    </div>
                </div>
                <div class='flex items-center justify-space-between mt-5'>
                    <van-button block class='mr-5 h-10 rounded-xs' type='primary' @click='confirmOpenBlockAtm'>
                        {{ $t('wallet.desposit') }}
                    </van-button>
                    <van-button
                        block
                        class='h-10 rounded-xs plain-button'
                        plain
                        type='primary'
                        @click="routerPush('withdraw', 'ck_without_entrance')"
                    >
                        {{ $t('wallet.withdraw') }}
                    </van-button>
                </div>
            </section>
        </el-scrollbar>
        <!-- 说明弹窗 -->
        <explain-popup v-model='isExplain' :explain-type='explainType' :user-account='userAccount' />
        <blockAtmDialog ref='blockAtmDialogRef' />
    </div>
</template>

<script>
import { computed, onMounted, reactive, toRefs, ref } from 'vue'
import { addThousandthSign } from '@/utils/util'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { firebaseAnalytics } from '@/utils/firebase'
import CurrencyIcon from '@/components/currencyIcon'
import { MsgSocket } from '@/plugins/socket/socket'
import blockAtmDialog from '@/components/blockAtmDialog'
import explainPopup from './components/explain-popup.vue'
import { mul, gt, plus } from '@/utils/calculation'
import { useAssets } from '@/hooks/assets'

export default {
    components: {
        CurrencyIcon,
        blockAtmDialog,
        explainPopup,
    },
    props: {},
    setup (props) {
        const route = useRoute()
        const store = useStore()
        const router = useRouter()
        const { t } = useI18n({ useScope: 'global' })
        const showCollapse = ref([''])
        const blockAtmDialogRef = ref(null)
        const state = reactive({
            showAmout: true,
            type: 1,
            showPopover: true,
            // 是否显示说明弹窗
            isExplain: false,
            // 说明类型
            explainType: 0,
        })

        const riskLevelMap = {
            1: t('riskLevel.safety'),
            2: t('riskLevel.warn'),
            3: t('riskLevel.danger'),
        }

        const product = computed(() => store.getters.productActived)
        const tradeType = computed(() => store.state._base.tradeType)

        const islogin = computed(() => {
            return !!store.state._user.customerInfo
        })

        const customerInfo = computed(() => store.state._user.customerInfo || {})
        const userAccount = useAssets()
        const rate = computed(
            () => store.state._base.rateConfigList?.find?.((item) => item.sourceCurrency === userAccount.value.currency)?.rate,
        )
        const currency = computed(() => userAccount.value.currency)
        const digits = computed(() => userAccount.value.digits)

        const totalInitialMargin = computed(() => {
            const { availableMargin, profitLoss, occupyMargin, netWorth } = userAccount.value || {}
            // 全仓直接返回接口返回的净值
            if (product.value?.tradeType === 1) return netWorth || 0
            // 总初始保证金+盈亏+可用保证金余额兑换成美金的价值
            return plus(plus(profitLoss, availableMargin), occupyMargin)
        })

        // 显示说明弹窗
        const showExplain = (type) => {
            state.explainType = type
            state.isExplain = true
        }

        // 展开或者收起显示资产数字
        const showAmoutChange = () => {
            const result = !state.showAmout
            state.showAmout = result
            localStorage.setItem('SHOW_AMOUT', result)
        }

        onMounted(() => {
            const defaultShowAmout = localStorage.getItem('SHOW_AMOUT')
            if (defaultShowAmout) {
                state.showAmout = JSON.parse(defaultShowAmout)
            }
            if (islogin.value) {
                // 订阅钱包的数据
                MsgSocket.subscribeAsset(tradeType.value)
            }
        })

        const routerPush = (path, type) => {
            firebaseAnalytics(type, {
                key: type,
                value: JSON.stringify({
                    email: customerInfo.value?.emailAll || customerInfo.value?.email || '',
                    phone: customerInfo.value?.phoneAll || customerInfo.value?.phone || '',
                }),
            })
            const url = route.path + '/' + path
            const search = `?accountIds=${userAccount.value.accountId}&currencys=${userAccount.value.currency}&tradeTypes=${product.value.tradeType}`
            router.push(url + search)
        }

        const routerPushFund = (path, type) => {
            const url = route.path + '/' + path
            const search = `?tradeType=${type}`
            router.push(url + search)
        }

        // 充值处理。
        const confirmOpenBlockAtm = () => {
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
            const url = route.path + '/' + 'recharge'
            router.push(url)
        }

        return {
            rate,
            routerPush,
            routerPushFund,
            userAccount,
            addThousandthSign,
            showCollapse,
            ...toRefs(state),
            islogin,
            showAmoutChange,
            blockAtmDialogRef,
            confirmOpenBlockAtm,
            riskLevelMap,
            showExplain,
            mul,
            currency,
            digits,
            gt,
            totalInitialMargin,
            product
        }
    },
}
</script>

<style lang="scss" scoped>
.funds {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: var(--contentColor);

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        padding: 0 12px;
        border-bottom: 1px solid var(--lineColor);
        background-image: url('../../../images/funds-bg.png');
        background-size: cover;
        background-position: center;
        .title {
            min-height: 56px;
            color: var(--color);
            font-size: 20px;
            font-weight: bold;
            display: flex;
            align-items: center;
        }
    }
}
.assetsModule {
    padding: 20px 10px;
    .wallet-info {
        min-width: 275px;
        width: 100%;
        min-height: 104px;
        border-radius: 6px;
        background-image: url('../../../images/funds-wallet.png');
        background-size: cover;
        background-position: center;
        padding: 15px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .wallet-info-top {
            display: flex;
            align-items: center;
            & > span {
                color: var(--fffColor);
                font-family: 'Roboto';
                font-size: 16px;
                font-weight: 400;
                margin-right: 8px;
            }
            & > i {
                color: var(--fffColor);
                font-size: 18px;
                margin-top: -5px;
                cursor: pointer;
            }
        }
        .wallet-info-bottom {
            display: flex;
            align-items: center;
            cursor: pointer;
            & > span {
                color: var(--fffColor);
                font-family: 'Roboto';
                font-size: 24px;
                margin-right: 8px;
                &.not-show-amout {
                    margin-top: 10px;
                }
            }
            & > i {
                color: var(--fffColor);
                font-size: 22px;
                font-weight: 700;
            }
        }
    }
    .action-info {
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
        .action-info-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            position: relative;
            & > img {
                width: 36px;
                height: 36px;
            }
            & > span {
                color: #0c0c0c;
                font-family: 'Roboto';
                font-size: 12px;
                font-weight: 400;
            }
        }
    }
}
</style>

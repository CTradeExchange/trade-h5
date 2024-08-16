<template>
    <div class='btnList'>
        <div v-if='isRealTran' class='btn-box'>
            <van-button @click='confirmOpenBlockAtm'>
                {{ $t('wallet.desposit') }}
            </van-button>
            <!-- <div class='limit-text'>
                <span>{{ $t('headLineTrade.min-10-usdt') }}</span>
                <div class='arrow-icon'></div>
            </div> -->
        </div>
        <div v-if='isRealTran'>
            <van-button @click="toWirhdraw('USDT')">
                {{ $t('wallet.withdraw') }}
            </van-button>
        </div>
    </div>
    <blockAtmDialog ref='blockAtmDialogRef' />
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { withdrawCurrencyList } from '@/api/user'
import { isDemoAccount } from '@/utils/util'
import { firebaseAnalytics } from '@/utils/firebase'
import { Toast } from 'vant'
import blockAtmDialog from '@/components/blockAtmDialog'

export default {
    components: {
        blockAtmDialog,
    },
    setup () {
        const store = useStore()
        const router = useRouter()
        const { t } = useI18n({ useScope: 'global' })
        const blockAtmDialogRef = ref(null)

        const accountList = computed(() =>
            store.state._user.customerInfo.accountList.filter((el) => Number(el.tradeType) === Number(tradeType.value)),
        )

        const tradeType = computed(() => store.state._base.tradeType)
        const { value: customInfo } = computed(() => store.state._user.customerInfo)
        const customerInfo = computed(() => store.state._user.customerInfo || {})

        const assetsInfo = computed(() => store.state._user.assetsInfo[tradeType.value] || {})

        // 判断是否模拟交易
        const isRealTran = computed(() => !isDemoAccount())

        // 验证是否有资产
        const checkAssets = () => {
            if (assetsInfo.value) {
                return true
            } else {
                Toast(t('trade.nullAssets'))
                return false
            }
        }

        // 跳转充值页面
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

            const accountList = store.state._user.customerInfo.accountList.filter((el) => Number(el.tradeType) === 1)
            const { accountId } = accountList.find((e) => e.currency === 'USDT') || {}
            if (accountId) {
                router.push({
                    path: '/deposit'
                })
            }
        }

        // 跳转提现页面
        const toWirhdraw = (currency) => {
            if (!checkAssets()) return
            const { accountId } = accountList.value.find((e) => e.currency === currency) || {}
            withdrawCurrencyList({
                customerGroupId: customInfo.customerGroupId,
                customerNo: customInfo.customerNo,
                tradeType: tradeType.value,
                accountId,
            }).then((res) => {
                if (res.check() && res.data.list.length > 0) {
                    const withdrawMethodArr = new Set()
                    res.data.list.forEach((item) => {
                        // 数据里的withdrawMethod字符串有可能传来多个通道，用逗号隔开的数据格式
                        const methodArr = item.withdrawMethod.split(',')
                        methodArr.forEach((k) => {
                            withdrawMethodArr.add(k)
                        })
                    })
                    const formatWithdrawMethod = [...withdrawMethodArr]
                    if (formatWithdrawMethod.length) {
                        router.push({
                            path: '/withdrawCoin',
                            query: {
                                tradeType: tradeType.value,
                                accountId,
                                currency,
                                // 如果有这个blockatm_webhook默认取这个,没有就默认取列表第一个
                                withdrawMethod: formatWithdrawMethod.includes('blockatm_webhook')
                                    ? 'blockatm_webhook'
                                    : formatWithdrawMethod[0],
                            },
                        })
                    } else {
                        Toast(t('withdraw.tips1'))
                    }
                } else {
                    Toast(t('withdraw.tips1'))
                }
            })
        }

        return {
            blockAtmDialogRef,
            confirmOpenBlockAtm,
            toWirhdraw,
            isRealTran,
        }
    },
}
</script>

<style lang="scss" scoped>
.btnList {
    width: 100%;
    display: flex;
    justify-content: space-between;
    & > div > button {
        width: 100%;
        height: rem(90px);
        background: var(--primary);
        border-radius: rem(8px);
        font-size: rem(28px);
        color: var(--contentColor);
    }
    & > div {
        flex: 1;
        margin: rem(30px) rem(30px) 0 0;
        &:last-of-type {
            margin-right: 0;
        }
    }
    .btn-box {
        position: relative;
        .limit-text {
            border: 1px solid #e52f4b;
            background-color: #fef7f6;
            margin: 4px 6px;
            position: absolute;
            top: -30px;
            min-height: 20px;
            left: 0;
            border-radius: 2px;
            & > span {
                padding: 4px 6px;
                font-size: 12px;
                color: var(--primary);
                white-space: nowrap;
                z-index: 10;
            }
            .arrow-icon {
                position: absolute;
                width: 6px;
                height: 6px;
                bottom: -4px;
                left: 45%;
                margin-left: -3px;
                background-color: #fef7f6;
                transform: rotate(45deg);
                border-right: 1px solid #e52f4b;
                border-bottom: 1px solid #e52f4b;
            }
        }
    }
}
</style>

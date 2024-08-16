<template>
    <van-dialog
        v-if='isPC'
        v-model:show='show'
        class='blockAtm-popup'
        :lock-scroll='false'
        :show-confirm-button='false'
        :style="{
            top: '50%',
            zIndex: '9999',
        }"
        :width='500'
    >
        <div v-if='show' id='blockAtmPc'></div>
    </van-dialog>
    <van-popup v-else v-model:show='show' :style="{ width: '100vw', height: '100vh' }">
        <div v-if='show' id='blockAtm'></div>
    </van-popup>
</template>

<script setup>
import loadScript from '@/utils/loadScript'
import { ref, defineExpose, watch, computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { firebaseAnalytics } from '@/utils/firebase'
import { useRouter } from 'vue-router'
import mitt from '@/utils/mitt'

const { locale } = useI18n({ useScope: 'global' })
const isPC = window.isPC

const show = ref(false)
const router = useRouter()
const store = useStore()
const customInfo = computed(() => store.state._user.customerInfo)
const product = computed(() => store.getters.productActived)

const state = reactive({
    amount: '',
    currency: '',
    network: '',
    minAmount: '',
})

defineExpose({
    open ({ amount, currency, network, minAmount }) {
        // console.log('展开充值')
        show.value = true
        if (amount) {
            state.amount = amount
        }
        if (currency) {
            state.currency = currency
        }
        if (network) {
            state.network = network
        }
        if (minAmount) {
            state.minAmount = minAmount
        }
    },
})

const resultHandle = () => {
    product.value?.symbolId && router.push(`?symbolId=${product.value?.symbolId}&tradeType=${product.value?.tradeType}`)
}
const loadBlockATMLibs = () =>
    new Promise((resolve) => {
        if (window.hasOwnProperty('BlockATM')) {
            resolve()
        } else {
            const newsSysConfig = store.state._base.newsSysConfig
            const newsConfig = newsSysConfig && newsSysConfig.find((o) => o.Key === 'blockatmSdk')
            const { Value } = newsConfig || {}
            loadScript(Value).then(() => resolve())
        }
    })

watch(show, (value) => {
    if (value) {
        loadBlockATMLibs().then(() => {
            let formatConfig
            if (state.currency) {
                formatConfig = {
                    custNo: `${customInfo.value.companyId}_${customInfo.value.customerNo}`,
                    lang: locale.value,
                    // minAmount: '10', // 最小充值金额
                    amount: state.amount,
                    currency: state.currency,
                    // network: state.network
                }
            } else {
                formatConfig = {
                    custNo: `${customInfo.value.companyId}_${customInfo.value.customerNo}`,
                    lang: locale.value,
                    minAmount: '10', // 最小充值金额
                    // maxAmount: '17', // 最大充值金额
                }
            }
            var that = customInfo
            window.BlockATM.init(isPC ? '#blockAtmPc' : '#blockAtm', {
                ...formatConfig,
                callback: (e) => {
                    // console.log('e====>', e)
                    show.value = false
                    if (e?.type === 'finish') {
                        !isPC && resultHandle()
                    }
                },
                log: (wallet) => {
                    let params
                    switch (wallet?.eventName) {
                        // 点击链接钱包
                        case 'connect_wallet':
                            params = {
                                email: that.value?.emailAll || that.value?.email || '',
                                phone: that.value?.phoneAll || that.value?.phone || '',
                                userid: that.value?.customerNo,
                                network: wallet.network,
                            }
                            firebaseAnalytics('blockatm_ck_connect_wallet', {
                                key: 'blockatm_ck_connect_wallet',
                                value: JSON.stringify(params),
                            })
                            window?.fbq?.('trackCustom', 'blockatm_ck_connect_wallet', params)
                            break
                        // 链接钱包成功
                        case 'connect_wallet_success':
                            params = {
                                email: that.value?.emailAll || that.value?.email || '',
                                phone: that.value?.phoneAll || that.value?.phone || '',
                                userid: that.value?.customerNo,
                                network: wallet.network,
                                walletAddress: wallet.walletAddress + '　',
                                walletBalance: wallet.walletBalance,
                            }
                            firebaseAnalytics('blockatm_connect_wallet', {
                                key: 'blockatm_connect_wallet',
                                value: JSON.stringify(params),
                            })
                            window?.fbq?.('trackCustom', 'blockatm_connect_wallet', params)
                            break
                        // 链接钱包失败
                        case 'connect_wallet_failed':
                            params = {
                                email: that.value?.emailAll || that.value?.email || '',
                                phone: that.value?.phoneAll || that.value?.phone || '',
                                userid: that.value?.customerNo,
                                network: wallet.network,
                                errorCode: wallet.remark,
                            }
                            firebaseAnalytics('blockatm_connect_wallet_failed', {
                                key: 'blockatm_connect_wallet_failed',
                                value: JSON.stringify(params),
                            })
                            window?.fbq?.('trackCustom', 'blockatm_connect_wallet_failed', params)
                            break
                        // 确认支付
                        case 'confirm_payment':
                            params = {
                                email: that.value?.emailAll || that.value?.email || '',
                                phone: that.value?.phoneAll || that.value?.phone || '',
                                userid: that.value?.customerNo,
                                network: wallet.network,
                                walletBalance: wallet.walletBalance,
                                deposit_amount: wallet.amount,
                                currencyCode: wallet.currency,
                            }
                            firebaseAnalytics('blockatm_ck_confirm_payment', {
                                key: 'blockatm_ck_confirm_payment',
                                value: JSON.stringify(params),
                            })
                            window?.fbq?.('trackCustom', 'blockatm_ck_confirm_payment', params)
                            break
                        // 充值成功
                        case 'deposit_success':
                            params = {
                                email: that.value?.emailAll || that.value?.email || '',
                                phone: that.value?.phoneAll || that.value?.phone || '',
                                userid: that.value?.customerNo,
                                walletBalance: wallet.walletBalance,
                                deposit_amount: wallet.amount,
                                network: wallet.network,
                                walletAddress: wallet.walletAddress + '　',
                            }
                            firebaseAnalytics('deposit_success_record', {
                                key: 'deposit_success_record',
                                value: JSON.stringify(params),
                            })
                            window?.fbq?.('trackCustom', 'deposit_success_record', params)
                            mitt.emit('CASH_IN')
                            break
                        default:
                        // show.value = false
                    }
                },
            })
        })
    }
})

</script>

<style lang="scss" >
@import '@/sass/mixin.scss';
#blockAtmPc {
    height: 750px;
}
#blockAtm {
    height: 100%;
}
.blockAtm-popup {
  @include scroll-bar-vertical;
  overflow-y: auto;
}
</style>

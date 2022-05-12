<template>
    <div v-if='fund' class='pageWrapp'>
        <LayoutTop :back='true' :menu='false'>
            <template #right>
                <router-link class='text' href='javascript:;' to='/fundRules?direction=buy'>
                    {{ $t('fundInfo.applyRules1') }}
                </router-link>
            </template>
        </LayoutTop>
        <div class='currencyBar'>
            <CurrencyIcon :currency='fund.shareTokenCode' size='28px' />
            <span class='fundCurrency'>
                {{ fund.fundName }}
            </span>
        </div>

        <div class='tradeFormBar'>
            <TradeAssetBar
                v-model='sharesPlaceholder'
                :can-choose-currency='false'
                class='tradeBarMtop'
                :currency='fund.shareTokenCode'
                icon-content-type='fund'
                label='申购多少份基金'
                placeholder='输入申购份额'
                :readonly='false'
            />

            <p class='iconArrowWrapper'>
            </p>

            <TradeAssetBar
                v-model='amountPay'
                :can-choose-currency='true'
                :currency='activeCurrency'
                :digits='curAccount? curAccount?.digits : 0'
                icon-content-type='asset'
                :label="$t('fundInfo.choosePayAsset')"
                :placeholder='payPlaceholder'
                :readonly='true'
                @input='calcApplyShares'
                @touchCurrency='touchCurrency'
            />

            <div class='fee'>
                <!-- <p>
                    <span class='muted'>
                        {{ $t('fundInfo.realtimeJZ') }}：
                    </span>
                    {{ calcApplyNet.sharesNet || '--' }}
                    {{ calcApplyNet.currencyNet }}
                </p>
                <p>
                    <span class='muted'>
                        {{ $t('fundInfo.fundApplyFeeCalc') }}：
                    </span>
                    {{ calcApplyNet.fees || '--' }}
                    {{ calcApplyNet.currencyPay }}
                </p> -->
                <p>
                    <span class='muted'>
                        1 V10 =
                    </span>
                    5.54USDT
                </p>
                <p>
                    <span class='muted'>
                        Fee Rate:
                    </span>
                    0.05%
                </p>
            </div>
        </div>

        <div class='pay-wrap'>
            <p class='title'>
                您需要支付以下资产
            </p>
            <div class='header'>
                <span>Asset</span>
                <span>支付数量</span>
            </div>
            <ul class='content'>
                <li>
                    <div class='c-left'>
                        <currencyIcon
                            currency='BTC'
                            size='18'
                        />
                        <span class='currency-text'>
                            BTC
                        </span>
                    </div>
                    <div class='c-right'>
                        <span> 0.0001</span>
                        <van-icon :color='$style.success' name='checked' size='22' />
                    </div>
                </li>
                <li>
                    <div class='c-left'>
                        <currencyIcon
                            currency='XMR'
                            size='18'
                        />
                        <span class='currency-text'>
                            XMR
                        </span>
                    </div>
                    <div class='c-right'>
                        <div class='cr-inline'>
                            <span> 0.01</span>
                            <p class='error-text'>
                                可用不足，需增加0.06
                            </p>
                        </div>
                        <van-icon :color='$style.primary' name='add' size='22' />
                    </div>
                </li>
                <li>
                    <div class='c-left'>
                        <currencyIcon
                            currency='XMR'
                            size='18'
                        />
                        <span class='currency-text'>
                            XMR
                        </span>
                    </div>
                    <div class='c-right'>
                        <div class='cr-inline'>
                            <span> 0.01</span>
                            <p class='error-text'>
                                可用不足，需增加0.06
                            </p>
                        </div>
                        <van-icon :color='$style.primary' name='add' size='22' />
                    </div>
                </li>
            </ul>
            <div class='notice'>
                注：以上计算结果包含申购手续费，并且是预计值，具体以提交后实际成交为准，查看规则
            </div>
        </div>

        <div class='footerBtn'>
            <van-button block :disabled='loading || fund.canPurchase!==1' size='normal' @click='submitHandler'>
                {{ fund.canPurchase===1 ? $t('fundInfo.buy'): $t('fundInfo.disabledBuy') }}
            </van-button>
        </div>

        <loadingVue :show='loading' />

        <van-popup
            v-model:show='selectShow'
            position='bottom'
            round
        >
            <div class='popup-assets-list'>
                <p class='title'>
                    选择支付资产
                </p>
                <div class='asset-item' @click='onSelect'>
                    <div class='left'>
                        <div class='top-block'>
                            <currencyIcon
                                currency='USDT'
                                size='24'
                            />
                            <span> USDT</span>
                        </div>
                        <p class='desc'>
                            Pay USDT to purchase for the fund
                        </p>
                    </div>
                    <div class='right'>
                        <van-icon :color='$style.success' name='checked' size='22' />
                    </div>
                </div>
                <div class='asset-item' @click='onSelect'>
                    <div class='left'>
                        <div class='top-block'>
                            <currencyIcon
                                size='24'
                            />
                            <span> 一篮子资产</span>
                        </div>
                        <p class='desc'>
                            Pay for a basket of assets to purchasee for fund
                        </p>
                        <div class='currency-list'>
                            <currencyIcon
                                currency='BTC'
                                size='18'
                            />
                            <currencyIcon
                                currency='ETH'
                                size='18'
                            />
                            <currencyIcon
                                currency='TRX'
                                size='18'
                            />
                            <currencyIcon
                                currency='UNI'
                                size='18'
                            />
                        </div>
                    </div>
                    <div class='right'>
                        <van-icon :color='$style.success' name='checked' size='22' />
                    </div>
                </div>
            </div>
        </van-popup>

        <!-- <van-action-sheet v-model:show='selectShow' :actions='selectActions' @select='onSelect' /> -->
    </div>
</template>

<script setup>
import CurrencyIcon from '@/components/currencyIcon.vue'
import TradeAssetBar from './components/tradeAssetBar.vue'
import recordList from './components/recordList/recordList.vue'
import loadingVue from '@/components/loading.vue'
import { orderHook } from './orderHook'
import { computed, unref, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Dialog } from 'vant'
import { useI18n } from 'vue-i18n'
const { t } = useI18n({ useScope: 'global' })
const route = useRoute()
const router = useRouter()
const { fundId } = route.query

const {
    pageTitle,
    fund,
    loading,
    calcApplyShares,
    submitFundApply,
    selectShow,
    selectActions,
    onSelect,
    activeCurrency,
    curAccount,
    calcApplyNet,
} = orderHook()

// 支付资产输入框的placeholder
const payPlaceholder = computed(() => {
    const text = t('fundInfo.available') + curAccount.value?.available
    return unref(curAccount) ? text : '--'
})
const amountPay = ref('')
// 份额输入框的placeholder
const sharesPlaceholder = ref('')

// const sharesPlaceholder = computed(() => {
//     const text = '≈ ' + calcApplyNet.value.shares
//     return unref(calcApplyNet).shares ? text : '--'
// })
const touchCurrency = () => {
    selectShow.value = true
}

// 提交申购或者赎回
const submitHandler = () => {
    submitFundApply({
        fundId: parseInt(fundId),
        amountPay: unref(amountPay),
        currencyPay: unref(activeCurrency),
    }).then(res => {
        if (res.check()) {
            amountPay.value = ''
            calcApplyShares()
            Dialog.confirm({
                title: t('fundInfo.applySuccessed'),
                confirmButtonText: t('fundInfo.records'),
                cancelButtonText: t('fundInfo.iknow')
            })
                .then(() => {
                    router.push({
                        path: '/fundRecord',
                        query: {
                            direction: 'buy'
                        }
                    })
                })
                .catch(() => {
                    // on cancel
                })
        }
    })
}

</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.pageWrapp {
    height: 100%;
    margin-top: rem(110px);
    overflow-y: auto;
    .text {
        color: var(--color);
    }
    .currencyBar {
        margin: rem(30px) 0;
        padding: rem(30px) rem(30px);
        line-height: 28px;
        background: var(--contentColor);
    }
    .fundCurrency {
        margin-left: 0.5em;
        font-size: rem(32px);
        vertical-align: middle;
    }
    .tradeBarMtop {
        margin-top: 25px;
    }
}
.tradeFormBar {
    position: relative;
    margin-top: rem(30px);
    padding: rem(60px) rem(30px) rem(30px) rem(30px);
    background: var(--contentColor);
    .fee {
        display: flex;
        justify-content: space-between;
        margin-top: rem(30px);
        font-size: rem(26px);
    }
    .mleft {
        margin-left: 10px;
    }
}
.pay-wrap {
    margin-top: rem(40px);
    padding: rem(30px) 0;
    background: var(--contentColor);
    .title {
        font-size: rem(32px);
        text-align: center;
    }
    .header {
        display: flex;
        justify-content: space-between;
        margin: rem(30px) 0;
        padding: 0 rem(40px);
    }
    .content {
        margin: rem(30px) 0;
        padding: 0 rem(30px);
        li {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: rem(30px);
            .c-right {
                display: flex;
                align-items: center;
                text-align: right;
                .icon_success {
                    margin-left: rem(20px);
                    color: var(--success);
                    font-size: rem(28px);
                }
                .icon_icon_assets {
                    margin-left: rem(20px);
                    color: var(--primary);
                    font-size: rem(28px);
                }
                .van-icon {
                    position: relative;
                    top: -2px;
                    display: inline-block;
                    margin-left: rem(20px);
                    vertical-align: -12%;
                }
                .error-text {
                    color: var(--warn);
                }
                .cr-inline {
                    display: inline-block;
                }
            }
        }
    }
    .notice {
        padding: 0 rem(30px);
    }
}
.iconArrowWrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: rem(60px);
    text-align: center;
}
.footerBtn {
    position: fixed;
    bottom: 0;
    display: block;
    width: 100%;
    margin-top: rem(40px);
    .van-button {
        color: #FFF;
        font-size: 15px;
        background: var(--primary);
        border-color: var(--primary);
    }
}
.popup-assets-list {
    padding: rem(30px);
    .title {
        font-size: rem(32px);
        text-align: center;
    }
    .asset-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: rem(40px);
        padding: rem(30px);
        background: var(--bgColor);
        border-radius: rem(12px);
        .top-block {
            margin-bottom: rem(10px);
            >span {
                margin-left: rem(10px);
                color: var(--color);
                vertical-align: middle;
            }
        }
        .desc {
            margin-bottom: rem(20px);
            color: var(--minorColor);
        }
    }
}
</style>

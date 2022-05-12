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
                :can-choose-currency='false'
                class='tradeBarMtop'
                :currency='fund.shareTokenCode'
                :digits='curAccount? curAccount?.digits : 0'
                label='申购多少份基金'
                placeholder='输入申购份额'
                :readonly='false'
                @input='calcApplyShares'
            />

            <p class='iconArrowWrapper'></p>

            <TradeAssetBar
                v-model='amountPay'
                :can-choose-currency='true'
                :currency='activeCurrency'
                :fund-assets-list='fundAssetsList'
                :label="$t('fundInfo.choosePayAsset')"
                :placeholder='payPlaceholder'
                :readonly='true'
                @touchCurrency='touchCurrency'
            />

            <div class='fee'>
                <p>
                    <span class='muted'>
                        1 {{ fund.shareTokenCode }} =
                    </span>
                    <span class='value'>
                        {{ fund.netValue }}{{ fund.currency }}
                    </span>
                </p>
                <p>
                    <span class='muted'>
                        手续费率:
                    </span>
                    <span class='value'>
                        {{ activeAssets.purchaseFeeProportion }}%
                    </span>
                </p>
            </div>
        </div>

        <div class='pay-wrap'>
            <p class='title'>
                您需要支付以下资产
            </p>
            <div class='header'>
                <span>资产</span>
                <span>支付数量</span>
            </div>
            <ul class='content'>
                <li>
                    <div class='c-left'>
                        <currencyIcon
                            currency='BTC'
                            size='22'
                        />
                        <span class='currency-text'>
                            BTC
                        </span>
                    </div>
                    <div class='c-right'>
                        <span>0.0001</span>
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
                        <van-icon :color='$style.primary' name='add' size='22' @click='addAssetShow=true' />
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
                注：以上计算结果包含申购手续费，并且是预计值，具体以提交后实际成交为准，
                <router-link class='toRule' href='javascript:;' to='/fundRules?direction=buy'>
                    查看规则
                </router-link>
            </div>
        </div>

        <div class='footerBtn'>
            <van-button block :disabled='loading || fund.canPurchase!==1' size='normal' @click='submitHandler'>
                {{ fund.canPurchase === 1 ? $t('fundInfo.buy'): $t('fundInfo.disabledBuy') }}
            </van-button>
        </div>

        <loadingVue :show='loading' />
        <!-- 选择支付资产弹窗 -->
        <SelectAssetsDialog
            v-model:show='selectShow'
            :active-currency='activeCurrency'
            :fund-assets-list='fundAssetsList'
            :list='selectActions'
            @select='onSelect'
        />

        <!-- 添加资产弹窗 -->
        <AddAssets v-model:show='addAssetShow' />
    </div>
</template>

<script setup>
import loadingVue from '@/components/loading.vue'
import CurrencyIcon from '@/components/currencyIcon.vue'
import TradeAssetBar from './components/tradeAssetBar.vue'
import SelectAssetsDialog from './components/selectAssetsDialog.vue'
import AddAssets from './components/addAssets.vue'
import { orderHook } from './orderHook'
import { computed, unref, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Dialog } from 'vant'
import { useI18n } from 'vue-i18n'
const { t } = useI18n({ useScope: 'global' })
const route = useRoute()
const router = useRouter()
const { fundId } = route.query

const {
    fund,
    fundAssetsList,
    loading,
    calcApplyShares,
    submitFundApply,
    activeCurrency,
    activeAssets,
    curAccount,
    selectShow,
    selectActions,
    onSelect
} = orderHook()

// 支付资产输入框的placeholder
const payPlaceholder = computed(() => {
    const text = t('fundInfo.available') + curAccount.value?.available
    return unref(curAccount) ? text : '--'
})
// 输入的基金份额
const amountPay = ref('')
const addAssetShow = ref(false)
// 显示选择支付资产弹窗
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
    margin-bottom: rem(88px);
    overflow-y: auto;
    .text {
        color: var(--color);
    }
    .currencyBar {
        margin-top: rem(20px);
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
    margin-top: rem(20px);
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
    margin: rem(30px) 0;
    padding: rem(30px) 0;
    background: var(--contentColor);
    .title {
        font-size: rem(30px);
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
            .c-left {
                display: flex;
                align-items: center;
                height: 100%;
                .currency-text {
                    margin-top: rem(4px);
                    margin-left: rem(10px);
                }
            }
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
                    margin-top: rem(-16px);
                    margin-left: rem(20px);
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
    .van-button {
        color: #FFF;
        font-size: 15px;
        background: var(--primary);
        border-color: var(--primary);
    }
}
</style>

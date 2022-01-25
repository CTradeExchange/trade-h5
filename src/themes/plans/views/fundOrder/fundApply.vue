<template>
    <div v-if='fund' class='pageWrapp'>
        <LayoutTop :back='true' :menu='false' :title='pageTitle' />
        <div class='currencyBar'>
            <CurrencyIcon :currency='fund.shareTokenCode' size='28px' />
            <span class='fundCurrency'>
                {{ fund.shareTokenCode }}
            </span>
        </div>

        <div class='tradeFormBar'>
            <TradeAssetBar
                v-model='amountPay'
                :can-choose-currency='true'
                :currency='activeCurrency'
                :digits='curAccount? curAccount?.digits : 0'
                :label="$t('fundInfo.choosePayAsset')"
                :placeholder='payPlaceholder'
                @input='calcApplyShares'
                @touchCurrency='touchCurrency'
            />
            <p class='iconArrowWrapper'>
                <i class='iconArrowDown icon_paixuxiaojiantou_xiangxia'></i>
            </p>
            <TradeAssetBar
                v-model='sharesPlaceholder'
                :can-choose-currency='false'
                class='tradeBarMtop'
                :currency='fund.shareTokenCode'
                :label=" $t('fundInfo.chooseApplyAsset')"
                :readonly='true'
            />
            <div class='fee'>
                <p>
                    <span class='muted'>
                        {{ $t('fundInfo.realtimeJZ') }}：
                    </span>
                    {{ calcSharesNet || '--' }}
                    {{ activeCurrency }}
                </p>
                <p>
                    <span class='muted'>
                        {{ $t('fundInfo.fundApplyFeeCalc') }}：
                    </span>
                    {{ calcApplyFee || '--' }}
                    {{ activeCurrency }}
                </p>
            </div>
        </div>
        <div class='footerBtn'>
            <van-button block :disabled='loading || fund.canPurchase!==1' size='normal' @click='submitHandler'>
                {{ fund.canPurchase===1 ? $t('fundInfo.buy'): $t('fundInfo.disabledBuy') }}
            </van-button>
        </div>
        <loadingVue :show='loading' />

        <van-action-sheet v-model:show='selectShow' :actions='selectActions' @select='onSelect' />
    </div>
</template>

<script setup>
import CurrencyIcon from '@/components/currencyIcon.vue'
import TradeAssetBar from './components/tradeAssetBar.vue'
import loadingVue from '@/components/loading.vue'
import { orderHook } from './orderHook'
import { computed, unref, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Dialog } from 'vant'
import { useI18n } from 'vue-i18n'
const { t } = useI18n({ useScope: 'global' })
const route = useRoute()
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
    calcApplyFee,
    calcShares,
    calcSharesNet,
} = orderHook()

// 支付资产输入框的placeholder
const payPlaceholder = computed(() => {
    const text = t('fundInfo.available') + curAccount.value?.withdrawAmount
    return unref(curAccount) ? text : '--'
})
const amountPay = ref('')

// 份额输入框的placeholder
const sharesPlaceholder = computed(() => {
    const text = '≈ ' + calcShares.value + fund.value.shareTokenCode
    return unref(calcShares) ? text : '--'
})
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
            Dialog.alert({
                title: t('fundInfo.applySuccessed'),
                message: '',
            }).then(() => {
            // on close
            })
        }
    })
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.pageWrapp{
    margin-top: rem(110px);
    height: 100%;
    overflow-y: auto;
    margin-bottom: rem(120px);
    .currencyBar{
        background: var(--contentColor);
        margin: rem(30px) 0;
        padding: rem(30px) rem(30px);
        line-height: 28px;
    }
    .fundCurrency{
        font-size: rem(32px);
        margin-left: .5em;
        vertical-align: middle;
    }
    .tradeBarMtop{
        margin-top: 40px;
    }
}
.tradeFormBar{
    position: relative;
    background: var(--contentColor);
    margin-top: rem(30px);
    padding: rem(30px);

    .fee{
        margin-top: rem(30px);
        font-size: rem(26px);
        display: flex;
        justify-content: space-between;
    }
    .mleft{
        margin-left: 10px;
    }
}
.iconArrowWrapper{
    position: relative;
    text-align: center;
    .iconArrowDown{
        font-size: rem(38px);
        position: absolute;
        top: rem(35px);
        color: var(--minorColor);
    }
}
.footerBtn{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    .van-button{
        background: var(--primary);
        border-color: var(--primary);
        color: #fff;
        font-size: 15px;
    }
}
</style>

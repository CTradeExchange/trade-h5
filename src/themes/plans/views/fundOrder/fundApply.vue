<template>
    <div v-if='fund' class='pageWrapp'>
        <LayoutTop :back='true' :menu='false'>
            <template #right>
                <router-link class='text' href='javascript:;' to='/fundRules?direction=buy'>
                    {{ $t('fundInfo.applyRules') }}
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
            <div class='tradeTypeTab'>
                <a class='item active' href='javascript:;'>
                    {{ $t('fundInfo.buy') }}
                </a>
                <a class='item' href='javascript:;' @click='toRedeem'>
                    {{ $t('fundInfo.sell') }}
                </a>
            </div>
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
                <span>
                    <i class='iconArrowDown icon_paixuxiaojiantou_xiangxia'></i>
                </span>
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
                    {{ calcApplyNet.sharesNet || '--' }}
                    {{ calcApplyNet.currencyNet }}
                </p>
                <p>
                    <span class='muted'>
                        {{ $t('fundInfo.fundApplyFeeCalc') }}：
                    </span>
                    {{ calcApplyNet.fees || '--' }}
                    {{ calcApplyNet.currencyPay }}
                </p>
            </div>
            <div class='footerBtn'>
                <van-button block :disabled='loading || fund.canPurchase!==1' size='normal' @click='submitHandler'>
                    {{ fund.canPurchase===1 ? $t('fundInfo.buy'): $t('fundInfo.disabledBuy') }}
                </van-button>
            </div>
        </div>

        <!-- 申购赎回记录 -->
        <recordList ref='recordListRef' />

        <loadingVue :show='loading' />

        <van-action-sheet v-model:show='selectShow' :actions='selectActions' @select='onSelect' />
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

const recordListRef = ref(null)

// 切换到赎回基金
const toRedeem = () => {
    router.replace({
        name: 'FundRedeem',
        query: {
            ...route.query,
            direction: 'sell'
        }
    })
}

// 支付资产输入框的placeholder
const payPlaceholder = computed(() => {
    const text = t('fundInfo.available') + curAccount.value?.available
    return unref(curAccount) ? text : '--'
})
const amountPay = ref('')

// 份额输入框的placeholder
const sharesPlaceholder = computed(() => {
    const text = '≈ ' + calcApplyNet.value.shares
    return unref(calcApplyNet).shares ? text : '--'
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
            unref(recordListRef) && unref(recordListRef).refresh()
            Dialog.alert({
                title: t('fundInfo.applySuccessed'),
                message: '',
            }).then(() => {
            // on close
            })
        }
    })
}

onMounted(() => {
    console.log(recordListRef)
})
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.pageWrapp{
    margin-top: rem(110px);
    height: 100%;
    overflow-y: auto;
    .text {
        color: var(--color);
    }
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
        margin-top: 25px;
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
.tradeTypeTab{
    margin-top: rem(10px);
    margin-bottom: rem(30px);
    display: grid;
    grid-column-gap: rem(10px);
    grid-template-columns: 1fr 1fr;
    text-align: center;
    .item{
        height: rem(80px);
        line-height: rem(80px);
        background: var(--bgColor);
        color: var(--color);
        font-size: rem(30px);
        border-radius: rem(5px);
        &.active{
            background-color: var(--primary);
            color: #fff;
        }
    }
}
.iconArrowWrapper{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: rem(60px);
    position: relative;
    text-align: center;
    span {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: rem(60px);
        height: rem(60px);
        background: var(--primary);
        border-radius: 50%;
    }
    .iconArrowDown{
        font-size: rem(36px);
        color: #fff;
    }
}
.footerBtn{
    display: block;
    margin-top: rem(40px);

    .van-button{
        background: var(--primary);
        border-color: var(--primary);
        color: #fff;
        font-size: 15px;
    }
}
</style>

<template>
    <div v-if='fund' class='pageWrapp'>
        <LayoutTop :back='true' :menu='false'>
            <template #right>
                <router-link class='text' href='javascript:;' to='/fundRules?direction=sell'>
                    {{ $t('fundInfo.redeemRules1') }}
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
                v-model='amountPay'
                :can-choose-currency='false'
                :currency='fund.shareTokenCode'
                :digits='fundAccount? fundAccount?.digits : 0'
                icon-content-type='fund'
                :label=" $t('fundInfo.redeemNum')"
                :placeholder='payPlaceholder'
            />
            <p class='iconArrowWrapper'>
            </p>
            <TradeAssetBar
                v-model='sharesPlaceholder'
                :can-choose-currency='true'
                class='tradeBarMtop'
                :currency='activeCurrency'
                icon-content-type='asset'
                label='选择赎回方式'
                :readonly='true'
                @touchCurrency='touchCurrency'
            />
            <div class='fee'>
                <p></p>
                <p>
                    <span class='mleft muted'>
                        {{ $t('fundInfo.redeemFeeRate') }}：
                    </span>
                    {{ redeemFeeRate || '--' }}
                </p>
            </div>
        </div>
        <div class='pay-wrap'>
            <p class='title'>
                您预计赎回以下资产及金额
            </p>
            <div class='redeem-type'>
                <div class='header'>
                    <span>Asset</span>
                    <span>预计获得金额</span>
                </div>
                <ul class='content'>
                    <li>
                        <div class='c-left'>
                            <currencyIcon
                                currency='USDT'
                                size='18'
                            />
                            <span class='currency-text'>
                                USDT
                            </span>
                        </div>
                        <div class='c-right'>
                            <span> T+2 day nav calculation amount</span>
                        </div>
                    </li>
                </ul>
            </div>
            <div class='redeem-assets'>
                <div v-for='item in 10' class='redeem-asset-item'>
                    <currencyIcon
                        currency='USDT'
                        size='24'
                    />
                    <p class='currency'>
                        USDT
                    </p>
                    <p class='percent'>
                        34.24%
                    </p>
                </div>
            </div>
            <div class='notice'>
                注：预计按T+2日确认份额后的基金净值价格计算金额，总赎回金额确定后再根据一篮子货币权重计算单个资产的赎回金额。
                <router-link class='toRule' href='javascript:;' to='/fundRules?direction=sell'>
                    查看规则
                </router-link>
            </div>
        </div>

        <div class='footerBtn'>
            <van-button block :disabled='loading || fund.canRedemption!==1' size='normal' @click='submitHandler'>
                {{ fund.canRedemption===1 ? $t('fundInfo.sell'):$t('fundInfo.disabledSell') }}
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
import loadingVue from '@/components/loading.vue'
import { orderHook } from './orderHook'
import { computed, unref, ref } from 'vue'
import { toFixed } from '@/utils/calculation'
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
    accountList,
    loading,
    submitFundRedeem,
    selectShow,
    selectActions,
    onSelect,
    activeCurrency,
} = orderHook()

const fundAccount = computed(() => accountList.value?.find(el => el.currency === fund.value?.shareTokenCode))
const redeemFeeRate = computed(() => {
    return toFixed(fund.value?.redemptionFeeProportion * 100, 2) + '%'
})

// 赎回份额输入框的placeholder
const payPlaceholder = computed(() => {
    const text = t('fundInfo.canRedeemMax') + (fundAccount.value?.available || 0)
    return text
})
const amountPay = ref('')

// 份额输入框的placeholder
const sharesPlaceholder = computed(() => {
    return t('fundInfo.redeemPlaceholder')
})
const touchCurrency = () => {
    selectShow.value = true
}

// 提交申购或者赎回
const submitHandler = () => {
    submitFundRedeem({
        fundId: parseInt(fundId),
        shares: unref(amountPay),
        currencyCode: unref(activeCurrency),
    }).then(res => {
        if (res?.check && res.check()) {
            amountPay.value = ''
            Dialog.alert({
                title: t('fundInfo.redeemSubmiteed'),
                message: t('fundInfo.redeemSubmiteedDesc'),
            }).then(() => {
                // on close
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
    padding: rem(30px);
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
.iconArrowWrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: rem(60px);
    text-align: center;
    span {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: rem(60px);
        height: rem(60px);
        background: var(--primary);
        border-radius: 50%;
    }
    .iconArrowDown {
        color: #FFF;
        font-size: rem(36px);
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
    .redeem-type {
        overflow: hidden;
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
    }
    .redeem-assets {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        margin: rem(30px) rem(30px) 0;
        .redeem-asset-item {
            flex: 1;
            width: calc((100% - 45px) / 4);  // 这里的10px = (分布个数3-1)*间隙5px, 可以根据实际的分布个数和间隙区调整
            min-width: calc((100% - 45px) / 4); // 加入这两个后每个item的宽度就生效了
            max-width: calc((100% - 45px) / 4);
            margin-right: 15px;
            margin-bottom: 15px;
            padding: rem(10px) 0;
            text-align: center;
            background-color: var(--bgColor);
            border: solid 1px var(--lineColor);
            &:nth-child(4n) { // 去除第3n个的margin-right
                margin-right: 0;
            }
            .currency {
                margin: rem(10px) 0 rem(5px);
                font-weight: bold;
                font-size: rem(28px);
            }
            .percent {
                color: var(--minorColor);
                font-size: rem(20px);
            }
        }
    }
    .notice {
        padding: 0 rem(30px);
        color: var(--minorColor);
        .toRule {
            color: var(--primary);
        }
    }
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

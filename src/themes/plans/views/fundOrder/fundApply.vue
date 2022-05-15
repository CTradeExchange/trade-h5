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
                :can-choose-currency='true'
                :currency='activeCurrency'
                :fund-assets-list='fundAssetsList'
                label='您支付'
                :readonly='true'
                @open='openCurrencyExplain'
                @touchCurrency='touchCurrency'
            />
            <!-- 切换 -->
            <div class='switch-block'>
                <i class='switch-icon icon_huidui' @click='switchWay'></i>
                <div class='switch-text'>
                    <p>
                        <span class='muted'>
                            手续费率:
                        </span>
                        <span>
                            {{ activeAssets.purchaseFeeProportion }}%
                        </span>
                    </p>
                    <p>
                        <span>
                            1 {{ fund.shareTokenCode }} =
                        </span>
                        <span>
                            {{ fund.netValue }}{{ fund.currency }}
                        </span>
                    </p>
                </div>
            </div>
            <TradeAssetBar
                v-model='amountPay'
                :can-choose-currency='false'
                :currency='fund.shareTokenCode'
                :digits='curAccount? curAccount?.digits : 0'
                label='您想要得到'
                placeholder='输入申购份额'
                :readonly='false'
                @input='calcApplyShares'
            />
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
                <li v-for='item in lastAssetsPay' :key='item.currencyCode'>
                    <div class='c-left'>
                        <currencyIcon
                            :currency='item.currency'
                            size='18'
                        />
                        <span class='currency-text'>
                            {{ item.currency }}
                        </span>
                    </div>
                    <div class='c-right'>
                        <div class='cr-inline'>
                            <span>{{ item.amountPay }}</span>
                            <p v-if='item.isShow && item.depositAmount > 0' class='error-text'>
                                可用不足，需增加{{ item.depositAmount }}
                            </p>
                        </div>
                        <div v-if='item.isShow' class='cr-icon'>
                            <van-icon
                                v-if='item.depositAmount > 0'
                                :color='$style.primary'
                                name='add'
                                size='22'
                                @click='openAddAssets(item)'
                            />
                            <van-icon
                                v-else
                                :color='$style.success'
                                name='checked'
                                size='22'
                            />
                        </div>
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

        <!-- 加载效果 -->
        <loadingVue :show='loading' />
        <!-- 选择支付资产弹窗 -->
        <SelectAssetsDialog
            v-model:show='selectShow'
            :active-currency='activeCurrency'
            :fund-assets-list='fundAssetsList'
            :list='selectActions'
            @select='selectAssets'
        />
        <!-- 添加资产弹窗 -->
        <AddAssets
            v-model:show='addAssetShow'
            :currency='addAssetsCurrency'
            :fund='fund'
        />
        <!-- 资产说明弹窗 -->
        <CurrencyExplainDialog
            v-model:show='currencyExplainShow'
            :currency='activeCurrency'
            :fund='fund'
            :fund-assets-list='fundAssetsList'
            :list='selectActions'
        />
    </div>
</template>

<script setup>
import loadingVue from '@/components/loading.vue'
import CurrencyIcon from '@/components/currencyIcon.vue'
import TradeAssetBar from './components/tradeAssetBar.vue'
import SelectAssetsDialog from './components/selectAssetsDialog.vue'
import AddAssets from './components/addAssets.vue'
import CurrencyExplainDialog from './components/currencyExplainDialog.vue'
import { orderHook } from './orderHook'
import { ref, unref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Toast, Dialog } from 'vant'
import { useI18n } from 'vue-i18n'
import { isEmpty } from '@/utils/util'
const { t } = useI18n({ useScope: 'global' })
const route = useRoute()
const router = useRouter()
const { fundId } = route.query

const {
    fund,
    fundAssetsList,
    lastAssetsPay,
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

// 输入的基金份额
const amountPay = ref('')
// 是否显示新增资产弹窗
const addAssetShow = ref(false)
// 新增资产的货币
const addAssetsCurrency = ref('')
// 是否显示资产说明弹窗
const currencyExplainShow = ref(false)

// 显示选择资产弹窗
const touchCurrency = () => {
    selectShow.value = true
}
// 选择资产
const selectAssets = (item) => {
    onSelect(item)
    calcApplyShares(amountPay.value)
}
// 显示添加资产弹窗
const openAddAssets = (item) => {
    addAssetShow.value = true
    addAssetsCurrency.value = item.currency
}
// 显示资产说明弹窗
const openCurrencyExplain = () => {
    currencyExplainShow.value = true
}
// 点击切换赎回
const switchWay = () => {
    router.push({
        name: 'FundRedeem',
        query: { direction: 'sell', fundId }
    })
}

// 提交申购
const submitHandler = () => {
    // 验证参数
    if (isEmpty(amountPay.value)) {
        return Toast(t('fundInfo.subScriptePlaceholder'))
    }
    if (Number(amountPay.value) < Number(activeAssets.value.minPurchaseNum)) {
        return Toast('单笔最小申购份额是' + activeAssets.value.minPurchaseNum)
    }
    let assetsTip = ''
    lastAssetsPay.value.map(elem => {
        if (elem.depositAmount > 0) assetsTip += elem.currency + '、'
    })
    if (assetsTip) {
        assetsTip = assetsTip.substring(0, assetsTip.length - 1)
        assetsTip = assetsTip + '的可用余额不足'
        return Toast(assetsTip)
    }
    // 提交申购
    submitFundApply({
        fundId: parseInt(fundId),
        amountPay: unref(amountPay),
        currencyPay: unref(activeCurrency),
        applyType: 2
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
    margin-top: rem(20px);
    padding: rem(30px);
    background: var(--contentColor);
    .switch-block {
        display: flex;
        align-items: center;
        margin: rem(25px) 0;
        .switch-icon {
            margin-right: rem(20px);
            font-size: rem(60px);
            color: var(--primary);
        }
        .switch-text {
            p {
                line-height: 1.6;
            }
        }
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

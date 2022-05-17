<template>
    <div class='handle-module'>
        <div class='block'>
            <p class='title'>
                您支付
            </p>
            <div class='box'>
                <label class='label'>
                    <CurrencyIcon :currency='fund.shareTokenCode' :size='24' />
                    <span class='name'>
                        {{ fund.shareTokenCode }}
                    </span>
                </label>
                <span class='line'></span>
                <el-input
                    v-model='amountPay'
                    clearable
                    :disabled='fund.canRedemption !== 1 || !customerInfo'
                    :placeholder='payPlaceholder'
                    type='number'
                    @input='onInput'
                />
            </div>
        </div>
        <!-- 切换 -->
        <div class='switch-block'>
            <i class='switch-icon icon_huidui' @click='switchWay'></i>
            <div class='switch-text'>
                <p>
                    <span class='muted'>
                        手续费率:
                    </span>
                    <span>
                        {{ direction === 'buy' ? activeAssets.purchaseFeeProportion : activeAssets.redemptionFeeProportion }}%
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
        <div class='block'>
            <p class='title'>
                <!-- {{ $t('fundInfo.redeemAssets') }} -->
                您想要得到
                <van-icon class='icon-question' name='question-o' size='14' @click='currencyExplainShow=true' />
            </p>
            <div class='box'>
                <el-select
                    v-model='activeCurrency'
                    :placeholder="$t('fundInfo.redeemAssets')"
                    @change='onSelect'
                >
                    <template #prefix>
                        <CurrencyIcon :currency='activeCurrency' :size='24' />
                    </template>
                    <el-option
                        v-for='(item, index) in selectActions'
                        :key='index'
                        :label='item.currencyCode'
                        :value='item.currencyCode'
                    />
                </el-select>
            </div>
            <div class='pay-wrap'>
                <p class='title'>
                    您预计赎回以下资产及金额
                </p>
                <!-- 一篮子资产 -->
                <div v-if="activeCurrency === 'self'" class='redeem-assets'>
                    <div v-for='(item, index) in fundAssetsList' :key='index' class='redeem-asset-item'>
                        <currencyIcon
                            :currency='item.currencyCode'
                            size='24'
                        />
                        <p class='currency'>
                            {{ item.currencyCode }}
                        </p>
                        <p class='percent'>
                            {{ item.weight }}
                        </p>
                    </div>
                </div>
                <!-- 单资产 -->
                <div v-else class='redeem-type'>
                    <div class='header'>
                        <span>资产</span>
                        <span>预计获得金额</span>
                    </div>
                    <ul class='content'>
                        <li>
                            <div class='c-left'>
                                <currencyIcon
                                    :currency='activeCurrency'
                                    size='18'
                                />
                                <span class='currency-text'>
                                    {{ activeCurrency }}
                                </span>
                            </div>
                            <div class='c-right'>
                                <span>T+2日确认份额后的基金净值价格计算金额</span>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class='notice'>
                    注：预计按T+2日确认份额后的基金净值价格计算金额，总赎回金额确定后再根据一篮子货币权重计算单个资产的赎回金额。
                    <router-link class='toRule' href='javascript:;' to='/fundRules?direction=sell'>
                        查看规则
                    </router-link>
                </div>
            </div>
        </div>
        <!-- 已登录 -->
        <div v-if='isLogin'>
            <div
                v-loading='loading'
                :class="{ 'handle-button': true, 'disable': fund.canRedemption !== 1 }"
                @click='submitHandler'
            >
                <span>{{ fund.canRedemption === 1 ? $t('fundInfo.sell') : $t('fundInfo.disabledSell') }}</span>
                <em></em>
                <span v-if='fund.canRedemption === 1'>
                    {{ fund.shareTokenCode }}
                </span>
            </div>
            <p class='rules-link'>
                <span @click='openRedeemRecords'>
                    {{ $t('fundInfo.redeemRecords') }}
                </span>
                <span @click='openRules'>
                    {{ $t('fundInfo.redeemRules') }}
                </span>
            </p>
        </div>
        <!-- 未登录 -->
        <div v-if='!isLogin' class='handle-not'>
            <button class='register-btn' @click="router.push('/register')">
                {{ $t('c.register') }}
            </button>
            <button class='login-btn' @click="router.push('/login')">
                {{ $t('c.login') }}
            </button>
        </div>
    </div>

    <!-- 赎回规则弹窗 -->
    <redeemRulesDialog ref='redeemRulesDialogRef' />

    <!-- 资产说明弹窗 -->
    <CurrencyExplainDialog
        v-model:show='currencyExplainShow'
        :currency='activeCurrency'
        :fund='fund'
        :fund-assets-list='fundAssetsList'
        :list='selectActions'
    />
</template>

<script setup>
import CurrencyExplainDialog from './currency-explain-dialog.vue'
import CurrencyIcon from '@/components/currencyIcon.vue'
import redeemRulesDialog from './redeem-rules-dialog.vue'
import { computed, unref, ref, defineProps, inject, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Dialog } from 'vant'
import { useI18n } from 'vue-i18n'
import { orderHook } from '../hooks.js'
import { limitNumber, limitDecimal, toFixed } from '@/utils/calculation'
import { getCookie } from '@/utils/util.js'

const emit = defineEmits(['switchDirection'])
const router = useRouter()
const store = useStore()
const { t } = useI18n({ useScope: 'global' })
const props = defineProps({
    fund: {
        type: Object,
        default: () => {}
    }
})
const changeShowModel = inject('changeShowModel')

// 客户信息
const customerInfo = computed(() => store.state._user.customerInfo)
// 当前语言
const lang = getCookie('lang')
// 组件ref
const redeemRulesDialogRef = ref(null)
const currencyExplainShow = ref(false)

const {
    accountList,
    loading,
    submitFundRedeem,
    selectActions,
    onSelect,
    activeCurrency,
    isLogin,
    calcApplyShares,
    fundAssetsList,
    lastAssetsPay,
    activeAssets

} = orderHook({ fund: props.fund, direction: 'sell' })

const fundAccount = computed(() => accountList.value?.find(el => el.currency === props.fund?.shareTokenCode))
const redeemFeeRate = computed(() => {
    return toFixed(props.fund?.redemptionFeeProportion * 100, 2) + '%'
})

// 赎回份额输入框的placeholder
const payPlaceholder = computed(() => {
    const text = t('fundInfo.canRedeemMax') + ' ' + (fundAccount.value?.available || 0)
    return text
})
const amountPay = ref('')

// 输入事件控制
const onInput = (value) => {
    const newval = limitNumber(value)
    amountPay.value = newval
    const digits = fundAccount.value?.digits || 0
    amountPay.value = limitDecimal(newval, digits)
}

// 提交申购或者赎回
const submitHandler = () => {
    const fund = props.fund
    if (fund.canRedemption !== 1 || loading.value) return
    submitFundRedeem({
        fundId: parseInt(fund.fundId),
        shares: unref(amountPay),
        currencyCode: unref(activeCurrency),
    }).then(res => {
        if (res?.check && res.check()) {
            amountPay.value = ''
            Dialog.alert({
                title: t('fundInfo.redeemSubmiteed'),
                message: t('fundInfo.redeemSubmiteedDesc'),
            }).then(() => {})
        }
    })
}

// 打开赎回记录
const openRedeemRecords = () => {
    changeShowModel('fundRecord', 'redeem')
}

// 打开规则弹窗
const openRules = () => {
    redeemRulesDialogRef.value.open()
}

// 切换申购赎回
const switchWay = () => {
    emit('switchDirection', 'apply')
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.handle-module {
    .block {
        margin-bottom: 30px;
        &:nth-of-type(2) {
            margin-bottom: 0;
        }
        .title {
            margin-bottom: 8px;
            font-size: 14px;
            .icon-question {
                cursor: pointer;
            }
        }
        .box {
            display: flex;
            align-items: center;
            height: 50px;
            background: var(--assistColor);
            border-radius: 5px;
            .line {
                width: 1px;
                height: 30px;
                background: var(--lineColor);
            }
            .label {
                display: inline-flex;
                align-items: center;
                width: 120px;
                height: 100%;
                padding: 0 12px;
                .name {
                    margin-left: 5px;
                }
            }
            .value {
                display: inline-flex;
                flex: 1;
                align-items: center;
                height: 100%;
                padding: 0 15px;
            }
        }
        &:deep {
            .el-select {
                width: 100%;
                .el-input__inner {
                    padding-left: 40px !important;
                }
                .currencyIcon {
                    margin-left: 5px;
                }
            }
            .el-input {
                flex: 1;
                line-height: 50px;
            }
            .el-input__inner {
                height: 50px;
            }
            .is-disabled .el-input__inner {
                background: none !important;
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
                }
                .content {
                    margin: rem(30px) 0;
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
                .redeem-asset-item {
                    flex: 1;
                    width: calc((100% - 20px) / 3);  // 这里的10px = (分布个数3-1)*间隙5px, 可以根据实际的分布个数和间隙区调整
                    min-width: calc((100% - 20px) / 3); // 加入这两个后每个item的宽度就生效了
                    max-width: calc((100% - 20px) / 3);
                    margin-right: 10px;
                    margin-bottom: 10px;
                    padding: 10px 0;
                    text-align: center;
                    background-color: var(--bgColor);
                    border: solid 1px var(--lineColor);
                    &:nth-child(3n) { // 去除第3n个的margin-right
                        margin-right: 0;
                    }
                    .currency {
                        margin: 5px 0 3px;
                        font-weight: bold;
                        font-size: 14px;
                    }
                    .percent {
                        color: var(--minorColor);
                        font-size: 10px;
                    }
                }
            }
            .notice {
                padding: 0 15px;
                color: var(--minorColor);
                .toRule {
                    color: var(--primary);
                }
            }
        }
    }
    .switch-block {
        display: flex;
        align-items: center;
        margin: 12px 0;
        .switch-icon {
            margin-right: 10px;
            color: var(--primary);
            font-size: 30px;
            cursor: pointer;
        }
        .switch-text {
            p {
                line-height: 1.6;
            }
        }
    }
    .handle-button {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 50px;
        margin-top: 30px;
        color: #FFF;
        font-size: 14px;
        background: var(--primary);
        border-radius: 5px;
        cursor: pointer;
        &:hover {
            opacity: 0.7;
        }
        &.disable {
            background: var(--lineColor);
            &:hover {
                opacity: 1;
            }
        }
        em {
            margin-right: 4px;
        }
    }
    .handle-not {
        margin-top: 30px;
        button {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 50px;
            margin-bottom: 20px;
            font-size: 16px;
            border-radius: 5px;
            cursor: pointer;
            &.register-btn {
                color: #FFF;
                background: var(--primary);
            }
            &.login-btn {
                color: var(--primary);
                background: var(--lineColor);
            }
        }
    }
    .rules-link {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 10px;
        span {
            color: var(--primary);
            cursor: pointer;
            &:hover {
                text-decoration: underline;
            }
        }
    }
}
</style>

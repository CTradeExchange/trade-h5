<template>
    <div class='handle-module'>
        <div class='block'>
            <p class='title'>
                您支付 <van-icon class='icon-question' name='question-o' size='14' @click='currencyExplainShow=true' />
            </p>

            <div class='box'>
                <el-select
                    v-model='activeCurrency'
                    :placeholder="$t('fundInfo.choosePayAsset')"
                    @change='selectAssets'
                >
                    <template #prefix>
                        <CurrencyIcon :currency='activeCurrency' :size='24' />
                    </template>
                    <el-option
                        v-for='(item, index) in selectActions'
                        :key='index'
                        :label='item.currencyCode === "self" ? "一篮子资产": item.currencyCode'
                        :value='item.currencyCode'
                    >
                        <div v-if="item.currencyCode === 'self'" class='asset-item'>
                            <div class='top'>
                                <CurrencyIcon :currency='item.currencyCode' :size='24' />
                                <span class='currency-text'>
                                    一篮子资产
                                </span>
                            </div>
                            <div>
                                <p>支付一篮子资产购买基金</p>
                                <currencyIcon
                                    v-for='(elem, i) in fundAssetsList'
                                    :key='i'
                                    :currency='elem.currencyCode'
                                />
                            </div>
                        </div>
                        <div v-else class='asset-item'>
                            <div class='top'>
                                <CurrencyIcon :currency='item.currencyCode' :size='24' />
                                <span class='currency-text'>
                                    {{ item.currencyCode }}
                                </span>
                            </div>
                            <div>
                                支付 {{ item.currencyCode }} 购买基金
                            </div>
                        </div>
                    </el-option>
                </el-select>
                <!-- <span class='line'></span> -->
                <!-- <el-input
                    v-model='amountPay'
                    clearable
                    :disabled='fund.canPurchase !== 1 || !customerInfo'
                    :placeholder='payPlaceholder'
                    type='number'
                    @input='onInput'
                /> -->
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
                        {{ mul(activeAssets.purchaseFeeProportion,100) }}%
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
                您想要得到
            </p>
            <div class='box'>
                <label class='label'>
                    <CurrencyIcon :currency='fund.shareTokenCode' :size='24' />
                    <span class='name'>
                        {{ fund.shareTokenCode }}
                    </span>
                </label>
                <span class='line'></span>
                <span class='value'>
                    <!-- {{ sharesPlaceholder }} -->
                    <el-input
                        v-model='amountPay'
                        placeholder='输入申购份额'
                        size='normal'
                        @input='onInput'
                    />
                </span>
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
                            <el-popover
                                v-if='item.depositAmount > 0'
                                placement='left'
                                trigger='hover'
                                :width='400'
                            >
                                <template #reference>
                                    <van-icon
                                        class='icon-add'
                                        :color='$style.primary'
                                        name='add'
                                        size='22'
                                        @click='openAddAssets(item)'
                                    />
                                </template>
                                <div class='add-wrap'>
                                    <h2>选择获取该资产的方式</h2>
                                    <div class='type' @click='toDeposit(item)'>
                                        <div class='left'>
                                            <i
                                                class='icon iconfont icon_icon_assets'
                                            ></i>
                                            <div class='text'>
                                                <h3>存款</h3>
                                                <h5>通过存款的方式存入该资产</h5>
                                            </div>
                                        </div>
                                        <van-icon name='arrow' />
                                    </div>
                                    <div class='type' @click='toOrderFund'>
                                        <div class='left'>
                                            <img alt='' class='icon trade-icon' src='/images/trade.png' />
                                            <div class='text'>
                                                <h3>买入</h3>
                                                <h5>通过交易的方式买入该资产</h5>
                                            </div>
                                        </div>
                                        <van-icon name='arrow' />
                                    </div>
                                </div>
                            </el-popover>

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
                注：以上计算结果包含申购手续费，并且是预计值，具体以提交后实际成交为准
            </div>
        </div>

        <!-- 已登录 -->
        <div v-if='isLogin'>
            <div
                v-loading='loading'
                :class="{ 'handle-button': true, 'disable': fund.canPurchase !== 1 }"
                @click='submitHandler'
            >
                <span>{{ fund.canPurchase === 1 ? $t('fundInfo.buy'): $t('fundInfo.disabledBuy') }}</span>
                <em></em>
                <span v-if='fund.canPurchase === 1'>
                    {{ fund.shareTokenCode }}
                </span>
            </div>
            <p class='rules-link'>
                <span @click='openApplyRecords'>
                    {{ $t('fundInfo.applyRecords') }}
                </span>
                <span @click='openRules'>
                    {{ $t('fundInfo.applyRules') }}
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

    <!-- 申购规则弹窗 -->
    <applyRulesDialog ref='applyRulesDialogRef' />

    <!-- 资产说明弹窗 -->
    <CurrencyExplainDialog
        v-model:show='currencyExplainShow'
        :currency='activeCurrency'
        direction='buy'
        :fund='fund'
        :fund-assets-list='fundAssetsList'
        :list='selectActions'
    />
</template>

<script setup>
import CurrencyIcon from '@/components/currencyIcon.vue'
import applyRulesDialog from './apply-rules-dialog.vue'
import CurrencyExplainDialog from './currency-explain-dialog.vue'
import { computed, unref, ref, defineProps, inject, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Dialog, Toast } from 'vant'
import { useI18n } from 'vue-i18n'
import { orderHook } from '../hooks.js'
import { limitNumber, limitDecimal, mul } from '@/utils/calculation'
import { debounce, getCookie } from '@/utils/util'
import { log } from '@public/libs/adapter-latest'

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
const accountList = computed(() => store.state._user.customerInfo?.accountList?.filter(el => el.tradeType === 5)) // 现货玩法的账户列表
// 客户信息
const customerInfo = computed(() => store.state._user.customerInfo)

// 选择的币种account
const activeAccount = computed(() => accountList.value.find(el => el.currency === props.currency))
// 当前语言
const lang = getCookie('lang')
// 组件ref
const applyRulesDialogRef = ref(null)
const currencyExplainShow = ref(false)
// 是否显示新增资产弹窗
const addAssetShow = ref(false)
// 新增资产的货币
const addAssetsCurrency = ref('')

const {
    loading,
    calcApplyShares,
    submitFundApply,
    selectActions,
    activeCurrency,
    curAccount,
    calcApplyFee,
    calcShares,
    isLogin,
    fundAssetsList,
    lastAssetsPay,
    activeAssets,
    onSelect,
    queryFundNetValue
} = orderHook({ fund: props.fund, direction: 'buy' })

const amountPay = ref('')

// 输入事件控制
const onInput = value => {
    console.log('==============', value)
    const newval = limitNumber(value)
    amountPay.value = newval
    const digits = curAccount.value?.digits || 0
    amountPay.value = limitDecimal(newval, digits)
    inputHandler()
}

// 选择资产
const selectAssets = (item) => {
    const action = selectActions.value.find(el => el.currencyCode === item)
    onSelect(action)
    queryFundNetValue()
    calcApplyShares(amountPay.value)
}

// 输入事件，防抖
const inputHandler = debounce(() => {
    queryFundNetValue()
    calcApplyShares(amountPay.value)
}, 300)

// 提交申购
const submitHandler = () => {
    const fund = props.fund
    if (fund.canPurchase !== 1 || loading.value) return
    submitFundApply({
        fundId: parseInt(fund.fundId),
        amountPay: unref(amountPay),
        currencyPay: unref(activeCurrency),
        applyType: 2
    }).then(res => {
        if (res.check()) {
            amountPay.value = ''
            calcApplyShares()
            Dialog.alert({
                title: t('fundInfo.applySuccessed'),
                message: '',
            }).then(() => {})
        }
    })
}

// 打开申购记录
const openApplyRecords = () => {
    changeShowModel('fundRecord', 'apply')
}

// 打开规则弹窗
const openRules = () => {
    applyRulesDialogRef.value.open()
}

// 切换申购赎回
const switchWay = () => {
    emit('switchDirection', 'redeem')
}

// 显示添加资产弹窗
const openAddAssets = (item) => {
    addAssetShow.value = true
    addAssetsCurrency.value = item.currency
}

// 跳转到充值页面
const toDeposit = (item) => {
    router.push({
        path: '/assets/depositChoose',
        query: {
            tradeType: 5
        }
    })
}

// 点击前往交易页面的对应产品
const toOrderFund = () => {
    const productList = store.state._quote.productList
    let product = productList.find(el => el.baseCurrency === props.fund.shareTokenCode && el.profitCurrency === 'USDT' && el.tradeType === 5)
    if (!product) {
        product = productList.find(el => el.baseCurrency === props.fund.shareTokenCode && el.tradeType === 5)
    }
    if (!product) {
        return Toast(t('fundInfo.noTradeMarket'))
    }
    router.replace(`/order?symbolId=${product.symbolId}&tradeType=${product.tradeType}`)
}

</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.handle-module {
    .block {
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
    .pay-wrap {
        margin: 15px 0;
        padding: 15px 0;
        background: var(--contentColor);
        .title {
            font-size: 15px;
            text-align: center;
        }
        .header {
            display: flex;
            justify-content: space-between;
            margin: 15px 0;
        }
        .content {
            li {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 15px;
                .c-left {
                    display: flex;
                    align-items: center;
                    height: 100%;
                    .currency-text {
                        margin-top: 2px;
                        margin-left: 5px;
                    }
                }
                .c-right {
                    display: flex;
                    align-items: center;
                    text-align: right;
                    .icon_success {
                        margin-left: 10px;
                        color: var(--success);
                        font-size: 14px;
                    }
                    .van-icon {
                        margin-top: -8px;
                        margin-left: 10px;
                        &.icon-add {
                            cursor: pointer;
                        }
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
            .toRule {
                color: var(--primary);
                cursor: pointer;
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
.el-select-dropdown__item {
    padding: 0;
    .asset-item {
        margin: 15px 15px 0;
        padding: 5px 15px;
        background: var(--bgColor);
        .currencyIcon {
            margin-right: 10px;
        }
    }
}
.add-wrap {
    padding: 15px;
    h2 {
        margin: 10px 0 20px;
        text-align: center;
    }
    .type {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 20px;
        padding: 20px 15px;
        background: var(--bgColor);
        cursor: pointer;
        .left {
            display: flex;
            align-items: center;
            .icon {
                margin-right: 20px;
                font-size: 40px;
                &.icon_icon_assets {
                    color: var(--focusColor);
                }
                &.trade-icon {
                    width: 40px;
                    height: 40px;
                }
            }
            .text {
                h3 {
                    font-weight: bold;
                }
                h5 {
                    color: var(--minorColor);
                }
            }
        }
    }
}
.el-select-dropdown__item {
    height: auto;
    overflow: auto;
}
</style>

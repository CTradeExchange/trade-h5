<template>
    <!-- <DrawPage
        v-model='open'
        :right-text="$t('withdraw.moneyRecordText')"
       @toPage="$router.replace($route.path.replace('withdrawAccount', 'withdrawRecord'))"
       @onBack="$router.go(-1)"
    > -->
    <DrawPage
        v-model='open'
        :right-text="$t('withdraw.moneyRecordText')"
       @toPage="$router.replace($route.path.replace('withdrawAccount', 'withdrawRecord'))"
       @onBack="$router.replace('/assets')"
    >
    <div class="page-wrap-box">
        <div class="page-content-box">
            <p class="head-text">
                {{ $t("withdraw.outAccount") }}
            </p>
            <el-select
                v-model="accountId"
                class="currencyBox"
                placeholder="---"
                @change="changeOutCurrency"
            >
                <template #prefix>
                    <CurrencyIcon :currency="outCurrency" :size="24" />
                </template>
                <el-option
                    v-for="item in columns"
                    :key="item.accountId"
                    :label="item.currency"
                    :value="item.accountId"
                    class="currencyOption"
                >
                    <CurrencyIcon :currency="item.currency" :size="19" />
                    <span>{{ item.currency }}</span>
                </el-option>
            </el-select>
            <p class="head-text">
                {{ $t("withdraw.inAccount") }}
            </p>
            <el-select
                v-model="inCurrency"
                class="currencyBox"
                placeholder="---"
                @change="changeInCurrency"
            >
                <template #prefix>
                    <CurrencyIcon :currency="inCurrency" :size="24" />
                </template>
                <el-option
                    v-for="item in inCurrencyList"
                    :key="item.currency"
                    :label="item.currency"
                    :value="item.currency"
                    class="currencyOption"
                >
                    <CurrencyIcon :currency="item.currency" :size="19" />
                    <span>{{ item.currency }}</span>
                </el-option>
            </el-select>
            <p v-if="withdrawMethodVis" class="head-text">
                {{ $t("withdraw.withdrawMethod") }}
            </p>
            <el-select
                v-if="withdrawMethodVis"
                v-model="withdrawMethodText"
                class="currencyBox"
                placeholder="---"
                @change="changeWithdrawMethod"
            >
                <el-option
                    v-for="item in methodList"
                    :key="item.val"
                    :label="item.methonText"
                    :value="item.val"
                    class="currencyOption"
                />
            </el-select>
        </div>
        <div class="footerBtn">
            <van-button
                block
                :disabled="disabled"
                type="primary"
                @click="handleToPage"
            >
                {{ $t("common.nextStep") }}
            </van-button>
        </div>
    </div>
    </DrawPage>
</template>

<script>
import DrawPage from '@planspc/components/drawPage'
import CurrencyIcon from '@/components/currencyIcon'
import { computed, toRefs, reactive, onMounted } from 'vue'
import { checkKycApply, withdrawCurrencyList } from '@/api/user'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { getCookie } from '@/utils/util'
import { Dialog, Toast } from 'vant'
import { useRoute, useRouter } from 'vue-router'

export default {
    components: { CurrencyIcon, DrawPage },
    setup (props, { emit }) {
        const route = useRoute()
        const store = useStore()
        const router = useRouter()
        const { tradeType, defaultCurrency, defaultAccountId } = route.query || {}
        const { t } = useI18n({ useScope: 'global' })

        const state = reactive({
            open: false,
            outPickerShow: false,
            inPickerShow: false,
            outCurrency: '',
            inCurrency: '',
            inCurrencyList: [],
            currentTab: '',
            accountId: '',
            withdrawMethod: '',
            withdrawMethodVis: false,
            withdrawMap: {},
            lang: getCookie('lang'),
            methodPickerShow: false,
            methodList: [],
            withdrawMethodText: '',
            disabled: true
        })

        const { value: customInfo } = computed(
            () => store.state._user.customerInfo
        )
        // 当前币种
        const columns = computed(() =>
            accountList.value
                .filter((item) => item.tradeType === Number(tradeType))
                .map((el) => {
                    return {
                        currency: el.currency,
                        accountId: el.accountId
                    }
                })
        )

        const accountList = computed(() =>
            store.state._user.customerInfo.accountList.filter(
                (el) => Number(el.tradeType) === Number(tradeType)
            )
        )

        state.outCurrency = defaultCurrency || columns.value[0].currency
        state.accountId = defaultAccountId || columns.value[0].accountId

        // 自定义picker字段
        const customFieldName = {
            text: 'currency',
            children: 'cities'
        }

        const customMethodName = {
            text: 'methonText'
            // values: 'values'
        }

        const changeOutCurrency = (val) => {
            state.accountId = val
            columns.value.forEach((el) => {
                if (el.accountId == val) {
                    state.outCurrency = el.currency
                }
            })
        }

        const onInPickerConfirm = (val) => {
            state.inPickerShow = false
            state.currentTab = val.withdrawMethod
            state.inCurrency = val.currency

            if (val.withdrawMethod.split(',').length > 1) {
                // 如果选择的币种支持多种取款方式
                state.withdrawMethodVis = true
                const methods = val.withdrawMethod.split(',')
                state.methodList = methods.map((el) => {
                    return {
                        val: el,
                        methonText: state.withdrawMap[el][state.lang]
                    }
                })
                state.currentTab = state.methodList[0].val
                state.withdrawMethodText = state.methodList[0].methonText
            } else {
                state.withdrawMethodVis = false
            }
        }
        const changeInCurrency = (val) => {
            state.inCurrency = val
            state.inCurrencyList.forEach((el) => {
                if (el.currency == val) {
                    state.currentTab = el.withdrawMethod
                }
            })

            if (state.currentTab.split(',').length > 1) {
                // 如果选择的币种支持多种取款方式
                state.withdrawMethodVis = true
                const methods = state.currentTab.split(',')
                state.methodList = methods.map((el) => {
                    return {
                        val: el,
                        methonText: state.withdrawMap[el][state.lang]
                    }
                })
                state.currentTab = state.methodList[0].val
                state.withdrawMethodText = state.methodList[0].methonText
            } else {
                state.withdrawMethodVis = false
            }
        }

        onMounted(() => {
            state.open = true
            // 检测取款是否需要kyc
            checkKyc()
        })

        // 检查是否需要KYC认证
        const checkKyc = () => {
            state.loading = true
            checkKycApply({
                businessCode: 'withdraw',
                openAccountType: customInfo.value?.openAccountType
            })
                .then((res) => {
                    state.loading = false
                    if (res?.check()) {
                        // kyc弹窗提示
                        if (Number(res.data) !== 2) {
                            return Dialog.alert({
                                title: t('common.tip'),
                                confirmButtonText:
                                    Number(res.data) === 1
                                        ? t('common.goLook')
                                        : t('login.goAuthenticate'),
                                message:
                                    Number(res.data) === 2
                                        ? t('deposit.KYCReviewing')
                                        : t('deposit.needKYC')
                            }).then(() => {
                                router.replace({
                                    path: route.path.replace('withdrawAccount', 'authentication'),
                                    query: {
                                        businessCode: 'withdraw'
                                    }
                                })
                            })
                        }
                    }
                })
                .catch((err) => {
                    state.loading = false
                })
        }

        // 取款方式确定
        const changeWithdrawMethod = (option) => {
            state.currentTab = option
            state.methodList.forEach((item) => {
                if (item.val == option) {
                    state.withdrawMethodText = item.methonText
                }
            })
        }

        // 获取到账币种
        withdrawCurrencyList({
            customerGroupId: customInfo.customerGroupId,
            customerNo: customInfo.customerNo,
            tradeType: tradeType,
            accountId: columns.value[0].accountId
        })
            .then((res) => {
                state.currencyList = res.data
                if (res.check() && res.data.list.length > 0) {
                    state.disabled = false
                    state.withdrawMap = res.data.map
                    state.inCurrencyList = res.data.list.map((el) => {
                        return {
                            currency: el.currency,
                            withdrawMethod: el.withdrawMethod
                        }
                    })
                    state.inCurrency = res.data.list[0].currency
                    state.currentTab = res.data.list[0].withdrawMethod
                    changeInCurrency(state.inCurrency)
                } else {
                    if (
                        columns.value.length === 0 ||
                        state.inCurrencyList.length === 0
                    ) {
                        state.disabled = true
                        return Toast(t('withdraw.tips1'))
                    }
                }
            })
            .catch((err) => {
                state.loadingMore = false
                state.loading = false
            })
        
        const handleToPage = () => {
            const path = route.path.replace('withdrawAccount', 'withdrawCoin')
            router.push(`${path}?currentTab=${state.currentTab}&currency=${state.inCurrency}&tradeType=${tradeType}&accountId=${state.accountId}`)
        }

        return {
            accountList,
            columns,
            changeOutCurrency,
            changeInCurrency,
            changeWithdrawMethod,
            handleToPage,
            customFieldName,
            customMethodName,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@/sass/mixin.scss";
.page-wrap-box {
    width: 100%;
    height: 100%;
    overflow: auto;
    background: var(--contentColor);
    position: relative;
    .page-content-box {
        padding: 0 25px;
        background: var(--contentColor);
        :deep(.el-select) {
            width: 100%;
        }
        :deep(.el-input__inner) {
            border: none;
            background: var(--contentColor);
            color: var(--color);
            height: 43px;
            &:hover {
                border: none !important;
                outline: none !important;
            }
        }
        .head-text {
            color: var(--minorColor);
            font-size: remFree(24px);
            line-height: 45px;
        }
        .actionBar {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: remFree(80px);
            margin-bottom: remFree(30px);
            padding: 0 remFree(30px);
            color: var(--color);
            font-size: remFree(24px);
            line-height: remFree(80px);
            background: var(--assistColor);
            border-radius: remFree(6px);
            .icon_icon_arrow {
                margin-left: remFree(10px);
                font-size: remFree(20px);
            }
            .input {
                flex: 1;
                height: remFree(40px);
            }
            .all {
                position: absolute;
                top: 0;
                right: remFree(20px);
                bottom: 0;
                margin: auto;
                color: var(--primary);
                font-size: remFree(20px);
            }
            .currencySpan {
                margin-right: remFree(10px);
            }
            .muted {
                margin-right: remFree(15px);
            }
        }
    }
}
.footerBtn {
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    width: 100%;
    padding: 20px 25px;
    .van-button {
        flex: 1;
        height: 43px;
        color: #fff;
        border-radius: remFree(10px);
        font-size: remFree(26px);
        border: none;
    }
}
.currencyBox {
    height: remFree(78px);
    :deep(.select-trigger) {
        height: 100%;
    }
    :deep(.el-input) {
        height: 100%;
        font-size: inherit;
        line-height: 100% !important;
    }
    :deep(.el-input__inner) {
        height: 100%;
        border: none !important;
        background: transparent;
        font-size: remFree(24px);
    }
}
.currencyOption {
    display: flex;
    align-items: center;
    height: 40px;
    line-height: 2;
    & > span {
        font-size: remFree(24px);
        margin-left: 10px;
    }
}
</style>

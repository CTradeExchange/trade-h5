<template>
    <centerViewDialog :class="[state.openFaq ? 'first-deposit-faq-dialog' : modelType == '1' ? 'first-dialog-body' : 'second-dialog-body', !state.openFaq&&(depositTimeTips||limitPrompt)?'depositTimeTips':'']">
        <div v-if='!state.openFaq' class='deposit-safe-box'>
            <LayoutTop :box-height='72' :box-shadow-show='false' :right-back='true' :show-main='false'>
                <template #left>
                    <span class='deposit-title'>
                        {{ $t('wallet.desposit') }}
                    </span>
                </template>
                <template #right>
                    <van-icon class='font-bold cursor-pointer' name='cross' size='20' />
                </template>
            </LayoutTop>

            <Loading :show='state.getChainListLoading' />
            <div class='deposit-all-con'>
                <div class='deposit-content-title'>
                    <span class='title-pay'>
                        {{ $t('headLineDeposit.authorize-to-Pay') }}
                    </span>
                    <div class='title-line'></div>
                    <span class='title-connect'>
                        {{ $t('headLineDeposit.connect-wallet') }}
                    </span>
                </div>

                <div class='deposit-blockAtm'>
                    <div class='deposit-blockAtm-icon'>
                        <img alt='' src='@/themeCommon/image/BlockATM.png' />
                    </div>
                    <div class='deposit-blockAtm-text'>
                        <span>{{ $t('headLineDeposit.block-atm-info') }}</span>
                    </div>
                </div>
                <div v-if="modelType == '1'" class='first-deposit'>
                    <div class='select-coin-box'>
                        <span>{{ $t('wallet.currency') }}</span>
                        <div class='select-coin-list'>
                            <div
                                v-for='(item, index) in state.currencyList'
                                :key='index'
                                :class="['select-coin-item-box', state.coinKind == item ? 'active' : '']"
                                @click='state.coinKind = item'
                            >
                                <div class='select-coin-item'>
                                    <CurrencyIcon :currency='item' :size='24' />
                                    <span>{{ item }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class='deposit-content-input'>
                        <!-- <el-form-item prop='amount'> -->
                        <inputCard
                            :amount='state.amount'
                            :amount-rate-zero='true'
                            :border-error='(state.checkResult?true:false)'
                            :class="['card-top', 'no-top']"
                            :currency='state.coinKind'
                            :digits-num='assets?.digits'
                            :more-zero='true'
                            :rate-price-zero='true'
                            :show-rate-result='false'
                            :title="$t('deposit.amount')"
                            @onAmount='handleAmount'
                        />
                    <!-- </el-form-item> -->
                    </div>
                    <div class='deposit-content-number'>
                        <div
                            v-for='(item, index) in state.amountList'
                            :key='index'
                            :class="['deposit-content-number-item', state.amount == item.amount ? 'active' : '']"
                            @click='state.amount = item.amount'
                        >
                            <span>{{ item.amount }}</span>
                        </div>
                    </div>
                    <div class='deposit-content-prompt'>
                        <div :class="['deposit-prompt-item', 'sub']">
                            <span :class="['deposit-prompt-title', 'title']">
                                {{ $t('headLineDeposit.transaction-info') }}
                            </span>
                        </div>
                        <div class='deposit-prompt-item'>
                            <span class='deposit-prompt-title'>
                                {{ $t('headLineDeposit.minimum-deposit') }}
                            </span>
                            <span class='deposit-prompt-value'>
                                {{ `${state.channel?.singleLowAmount || '--'} ${state.coinKind}` }}
                            </span>
                        </div>
                        <div class='deposit-prompt-item'>
                            <span class='deposit-prompt-title'>
                                {{ $t('headLineDeposit.deposit-arrival') }}
                            </span>
                            <span class='deposit-prompt-value'>
                                {{ $t('headLineDeposit.in-1-mins') }}
                            </span>
                        </div>

                        <div :class="['deposit-prompt-item', 'faq']" @click='visitBlockAtmFaq'>
                            <span :class="['deposit-prompt-title', 'faq']">
                                {{ $t('headLineDeposit.faqs') }}?
                            </span>
                            <span class='deposit-prompt-value'>
                                <el-icon><ArrowRight /></el-icon>
                            </span>
                        </div>
                    </div>
                </div>
                <div v-if="modelType == '2'" class='second-deposit'>
                    <faqList />
                </div>
                <div class='submit-button'>
                    <div v-if='depositTimeTips' class='text-center mb-3 submitError' :style="{ color: ' var(--van-field-error-message-color)' }">
                        {{ depositTimeTips }}
                    </div>
                    <div v-if='!depositTimeTips&&limitPrompt' class='text-center mb-3 submitError' :style="{ color: ' var(--van-field-error-message-color)' }">
                        {{ limitPrompt }}
                    </div>

                    <van-button
                        block
                        :disabled="depositTimeTips?true:!state.channel?true:modelType == '2' ? false : state.checkResult"
                        :loading='state.submitLoading'
                        type='primary'
                        @click='onSubmit'
                    >
                        {{ $t('headLineDeposit.continue-with') }}
                    </van-button>
                </div>
            </div>
            <blockAtmDialog ref='blockAtmDialogRef' />
        </div>

        <div v-if='state.openFaq' class='first-deposit-faq'>
            <LayoutTop :box-height='72' :box-shadow-show='false' :right-back='true' :show-main='false'>
                <template #left>
                    <div class='first-deposit-faq-title' @click='visitBlockAtmFaq'>
                        <van-icon class='mr-4 cursor-pointer' name='down' style='transform: rotate(90deg)' />
                        <span>{{ $t('headLineDeposit.faqs') }}</span>
                    </div>
                </template>
                <template #right>
                    <van-icon class='font-bold cursor-pointer' name='cross' size='20' />
                </template>
            </LayoutTop>
            <div class='faq-list-box'>
                <faqList />
            </div>
        </div>
    </centerViewDialog>
</template>

<script setup>
import centerViewDialog from '@planspc/layout/centerViewDialog'
import CurrencyIcon from '@/components/currencyIcon'
import { ref, computed, watch } from 'vue'
import { gt, lt, plus, mul } from '@/utils/calculation'
import { userDeposit } from '@/hooks/deposit'
import blockAtmDialog from '@/components/blockAtmDialog'
import { useStore } from 'vuex'
import inputCard from '@planspc/components/inputCard.vue'
import faqList from '@/themeCommon/components/faqsList/faqsList.vue'
import { firebaseAnalytics } from '@/utils/firebase'
import { useAssets } from '@/hooks/assets'

const store = useStore()
const blockAtmDialogRef = ref(null)
const { limitPrompt, depositTimeTips, state } = userDeposit()

const baseSysConfig = computed(() => store.state._base.newsSysConfig)

const modelType = computed(() => {
    const result = baseSysConfig.value.find((o) => o.Key === 'despositModelType') || {}
    const value = result?.Value || '1'
    return value
})

const assets = useAssets()

const handleAmount = (val) => {
    state.amount = val
}
const customerInfo = computed(() => store.state._user.customerInfo || {})

const onSubmit = () => {
    const params = {
        email: customerInfo.value?.emailAll || customerInfo.value?.email || '',
        phone: customerInfo.value?.phoneAll || customerInfo.value?.phone || '',
        userID: customerInfo.value?.customerNo,
    }

    firebaseAnalytics('ck_continue_deposit', {
        key: 'ck_continue_deposit',
        value: JSON.stringify(params),
    })

    window?.fbq?.('trackCustom', 'ck_continue_deposit', params)

    if (modelType.value == '1') {
        const { channel } = state
        const { fee, feeType } = channel

        let _fee = '0'
        if (Number(feeType === 1) && fee) {
            // 固定金额手续费
            _fee = fee
        } else if (Number(feeType === 2) && fee) {
            // 百分比手续费
            _fee = mul(state.amount, fee)
        }
        blockAtmDialogRef.value.open({
            amount: plus(state.amount, _fee),
            currency: state.coinKind,
            network: state.network,
        })
    } else {
        blockAtmDialogRef.value.open({})
    }
}
// 在第一种充值UI下，打开/关闭faq
const visitBlockAtmFaq = () => {
    state.openFaq = !state.openFaq
}

watch(
    () => [state.amount, state.channel],
    (value) => {
        console.log(value[0], state.channel?.singleLowAmount, state.channel?.singleHighAmount)

        if (lt(value[0], state.channel?.singleLowAmount) || gt(value[0], state.channel?.singleHighAmount) || !value[0]) {
            console.log('不在范围内')
            state.checkResult = true
        } else {
            console.log(depositTimeTips.value ? 'true' : 'false')
            console.log(!state.channel ? 'true' : 'false')
            console.log(modelType.value == '2' ? 'false' : 'true')

            console.log('在范围内', (depositTimeTips ? true : !state.channel ? true : modelType.value == '2' ? false : state.checkResult))
            state.checkResult = false
        }
    },
    {
        immediate: true,
    },
)
</script>

<style lang="scss">
.first-dialog-body {
    .el-dialog__body {
        min-height: 768px;
    }
    &.depositTimeTips{
      .el-dialog__body {
        min-height: 810px;
    }
    }
}
.second-dialog-body {
    .el-dialog__body {
        min-height: 700px;
    }
}
.first-deposit-faq-dialog {
    .el-dialog__body {
        min-height: 500px;
    }
}
</style>

<style lang="scss" scoped>
.deposit-safe-box{
  height: 100%;
  display: flex;
  flex-direction: column;
}
.deposit-all-con{
  flex: 1;
  display: flex;
  flex-direction: column;
}
.deposit-title {
    color: #000;
    text-align: center;
    font-family: 'Inter';
    font-size: 24px;
    font-weight: 700;
}

.icon_icon_close_big {
    font-size: 16px;
}
.deposit-content-title {
    display: flex;
    align-items: center;
    padding: 0 20px;
    .title-pay {
        color: #0c0c0c;
        font-family: 'Roboto';
        font-size: 16px;
        font-weight: 700;
    }
    .title-line {
        width: 1px;
        height: 16px;
        background-color: #d9d9d9;
        margin: 0 8px;
    }
    .title-connect {
        color: #6d778c;
        font-family: 'Roboto';
        font-size: 14px;
        font-weight: 400;
    }
}
.deposit-blockAtm {
    padding: 0 20px;
    margin-top: 20px;
    .deposit-blockAtm-icon {
        margin-bottom: 10px;
        & > img {
            max-width: 133px;
        }
    }
    .deposit-blockAtm-text {
        color: #000;
        font-family: 'Roboto';
        font-size: 14px;
        font-weight: 400;
    }
}
.first-deposit {
    padding: 0 20px;
    padding-top: 32px;
    .select-coin-box {
        & > span {
            color: var(--mainColor);
            font-family: 'Inter';
            font-size: 14px;
        }
        .select-coin-list {
            padding-top: 16px;
            padding-bottom: 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .select-coin-item-box {
                padding: 8px 10px;
                border-radius: 8px;
                border: 1px solid #e8e8e8;
                &.active {
                    border: 1px solid #e42e4a;
                    background: #fff5f5;
                }
                .select-coin-item {
                    min-width: 112px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    & > span {
                        margin-left: 8px;
                        color: var(--mainColor);
                        font-family: 'Roboto';
                        font-size: 14px;
                        font-weight: 400;
                    }
                }
            }
        }
    }
}
.second-deposit {
    // padding: 0 20px;
    margin-top: 30px;
}
.submit-button {
    flex: 1;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding-bottom: 30px;
    width: 100%;
    padding-left:30px ;
    padding-right:30px ;

    .submitError{
      max-width: 80%;
      margin:  auto;
    }
    :deep {
        .van-button {
            border-radius: 8px;
        }
    }
}
.deposit-content-input {
    margin-top: 10px;
    margin-bottom: 10px;
    .card-top{
      border:1px solid #ebe9e9;

    }
}
.deposit-content-number {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    .deposit-content-number-item {
        background-color: #f9f9fb;
        color: #9399a4;
        padding: 6px 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        cursor: pointer;
        &.active {
            background-color: var(--primary);
            color: var(--fffColor);
        }
        & > span {
            min-width: 24px;
            text-align: center;
        }
    }
}
.deposit-content-prompt {
    display: flex;
    flex-direction: column;
    .deposit-prompt-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        &:last-of-type {
            margin-bottom: 0;
        }
        &.sub {
            margin-bottom: 13px;
        }
        &.faq {
            padding-top: 40px;
            padding-right: 10px;
            cursor: pointer;
        }
        .deposit-prompt-title {
            color: #999;
            font-family: 'Inter';
            font-size: 14px;
            font-weight: 400;
            line-height: 14px;

            &.title {
                font-size: 14px;
                color: #000;
            }
            &.faq {
                font-size: 16px;
                color: #000;
            }
        }
        .deposit-prompt-value {
            color: #000;
            font-family: 'Inter';
            font-size: 14px;
            font-weight: 400;
            line-height: 14px;
        }
    }
}
.first-deposit-faq {
    .first-deposit-faq-title {
        display: flex;
        align-items: center;
        & > img {
            max-width: 24px;
            margin-right: 5px;
        }
        & > span {
            color: #000;
            text-align: center;
            font-family: 'Inter';
            font-size: 24px;
            font-weight: 700;
        }
    }
    .faq-list-box {
        padding: 0 20px;
    }
}
</style>

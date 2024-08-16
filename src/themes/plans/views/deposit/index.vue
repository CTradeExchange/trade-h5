<template>
    <div class='deposit-con-box'>
        <LayoutTop :back='true' :custom-style='customStyle' :menu='false' :title="$t('wallet.desposit')">
            <template #right>
                <div class='right-icon-box'>
                    <svg
                        v-if="modelType == '1'"
                        class='faq-icon'
                        fill='none'
                        height='24'
                        viewBox='0 0 24 24'
                        width='24'
                        xmlns='http://www.w3.org/2000/svg'
                        @click='visitFaqs'
                    >
                        <path
                            clip-rule='evenodd'
                            d='M12.0001 2.75009C17.1081 2.75009 21.2501 6.89109 21.2501 12.0001C21.2501 17.1081 17.1081 21.2501 12.0001 21.2501C6.89112 21.2501 2.75012 17.1081 2.75012 12.0001C2.75012 6.89109 6.89112 2.75009 12.0001 2.75009Z'
                            fill-rule='evenodd'
                            stroke='black'
                            stroke-linecap='round'
                            stroke-linejoin='round'
                            stroke-width='1.5'
                        />
                        <path
                            d='M12 13.4217V13.1687C12 12.3494 12.506 11.9157 13.012 11.5663C13.506 11.2289 14 10.7952 14 10C14 8.89157 13.1084 8 12 8C10.8916 8 10 8.89157 10 10M11.994 16.3012H12.006'
                            stroke='black'
                            stroke-linecap='round'
                            stroke-linejoin='round'
                            stroke-width='1.5'
                        />
                    </svg>
                    <svg fill='none' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg' @click='onRecord'>
                        <path
                            clip-rule='evenodd'
                            d='M14.7378 2.76178H8.0848C6.0048 2.75381 4.2998 4.41181 4.2508 6.49081V17.2038C4.2048 19.3168 5.8798 21.0678 7.9928 21.1148C8.0238 21.1148 8.0538 21.1158 8.0848 21.1148H16.0738C18.1678 21.0298 19.8178 19.2998 19.8029 17.2038V8.03781L14.7378 2.76178Z'
                            fill-rule='evenodd'
                            stroke='black'
                            stroke-linecap='round'
                            stroke-linejoin='round'
                            stroke-width='1.5'
                        />
                        <path
                            d='M14.4751 2.75V5.659C14.4751 7.079 15.6231 8.23 17.0431 8.234H19.7981'
                            stroke='black'
                            stroke-linecap='round'
                            stroke-linejoin='round'
                            stroke-width='1.5'
                        />
                        <path
                            d='M14.2881 15.3585H8.88812'
                            stroke='black'
                            stroke-linecap='round'
                            stroke-linejoin='round'
                            stroke-width='1.5'
                        />
                        <path
                            d='M12.2432 11.606H8.88721'
                            stroke='black'
                            stroke-linecap='round'
                            stroke-linejoin='round'
                            stroke-width='1.5'
                        />
                    </svg>
                </div>
            </template>
        </LayoutTop>

        <!-- 页面加载状态 -->
        <Loading :show='state.getChainListLoading' />
        <div class='deposit-safe-box'>
            <div class='deposit-blockAtm-box'>
                <div class='deposit-blockAtm-title'>
                    <span class='title-pay'>
                        {{ $t('headLineDeposit.authorize-to-Pay') }}
                    </span>
                    <div class='title-line'></div>
                    <span class='title-connect'>
                        {{ $t('headLineDeposit.connect-wallet') }}
                    </span>
                </div>

                <div class='deposit-blockAtm-image'>
                    <div class='deposit-blockAtm-icon'>
                        <img alt='' src='@/themeCommon/image/BlockATM.png' />
                    </div>
                    <div class='deposit-blockAtm-text'>
                        <span>{{ $t('headLineDeposit.block-atm-info') }}</span>
                    </div>
                </div>
            </div>

            <div v-if="modelType == '1'" class='first-model-box'>
                <div class='deposit-coin-box'>
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
                    <div :class="['input-amount-card',state.checkResult?'error':'']">
                        <span>{{ $t('deposit.amount') }}</span>
                        <div class='inpBox'>
                            <van-stepper
                                v-model='state.amount'
                                allow-empty
                                class='custom-vant-input'
                                :decimal-length='assets?.digits'
                                :max='9999999999'
                                :min='0'
                                placeholder='0.00'
                                :show-minus='false'
                                :show-plus='false'
                            />
                            <div class='iconBox'>
                                <CurrencyIcon :currency='state.coinKind' :size='24' />
                                <span>{{ state.coinKind || '--' }}</span>
                            </div>
                        </div>
                    </div>

                    <div class='select-amount-box'>
                        <div
                            v-for='(item, index) in state.amountList'
                            :key='index'
                            :class="['deposit-content-number-item', state.amount == item.amount ? 'active' : '']"
                            @click='state.amount = item.amount'
                        >
                            <span>{{ item.amount }}</span>
                        </div>
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
                </div>
            </div>

            <div v-if="modelType == '2'" class='second-model-box'>
                <FaqList />
            </div>
            <div class='error-prompt'>
                <div v-if='depositTimeTips' class='text-center mb-5 mt-5' :style="{ color: ' var(--van-field-error-message-color)' }">
                    {{ depositTimeTips }}
                </div>
                <div v-if='!depositTimeTips&&limitPrompt' class='text-center mb-5 mt-5' :style="{ color: ' var(--van-field-error-message-color)' }">
                    {{ limitPrompt }}
                </div>
            </div>
        </div>
        <div class='submit-button'>
            <van-button block :disabled="depositTimeTips?true:!state.channel?true:modelType == '2'?false:state.checkResult" :loading='state.submitLoading' type='primary' @click='onSubmit'>
                {{ $t('headLineDeposit.continue-with') }}
            </van-button>
        </div>

        <blockAtmDialog ref='blockAtmDialogRef' :deposit-callback='depositCallback' />
    </div>
</template>

<script setup>
import { useRouter, } from 'vue-router'
import { userDeposit } from '@/hooks/deposit'
import { ref, watch, computed, } from 'vue'
import { gt, lt, mul, plus } from '@/utils/calculation'
import CurrencyIcon from '@/components/currencyIcon'
import blockAtmDialog from '@/components/blockAtmDialog'
import { useStore } from 'vuex'
import FaqList from '@/themeCommon/components/faqsList/faqsList.vue'
import { firebaseAnalytics } from '@/utils/firebase'
import { useAssets } from '@/hooks/assets'

const router = useRouter()
const blockAtmDialogRef = ref(null)
const { state, depositTimeTips, limitPrompt } = userDeposit()
const store = useStore()
const assets = useAssets()
const baseSysConfig = computed(() => store.state._base.newsSysConfig)

const modelType = computed(() => {
    const result = baseSysConfig.value.find((o) => o.Key === 'despositModelType') || {}
    const value = result?.Value || '1'
    return value
})

const customerInfo = computed(() => store.state._user.customerInfo || {})
const tradeType = computed(() => store.state._base.tradeType)

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
        })
    } else {
        blockAtmDialogRef.value.open({})
    }
}

watch(
    () => [state.amount, state.channel],
    (value) => {
        if (lt(value[0], state.channel?.singleLowAmount) || gt(value[0], state.channel?.singleHighAmount) || !value[0]) {
            state.checkResult = true
        } else {
            state.checkResult = false
        }
    },
    {
        immediate: true,
    },
)
// 自定义头部样式
const customStyle = {
    background: 'rgb(255, 218, 218)',
    'z-index': 0,
}

const onRecord = () => {
    router.push({
        path: '/changList',
        query: {
            accountId: assets.value.accountId,
            tradeType: tradeType.value,
            withdrawType: 2,
            type: 3,
        },
    })
}
const visitFaqs = () => {
    router.push({
        path: '/faqs',
    })
}
</script>

<style lang="scss" scoped>
.deposit-con-box {
    background: linear-gradient(197deg, #ffdada 15.75%, rgba(254, 249, 249, 0) 63.79%, rgba(255, 255, 255, 0) 63.79%);
    min-height: 100%;
    display: flex;
    flex-direction: column;
    .right-icon-box {
        .faq-icon {
            margin-right: 10px;
        }
    }

    .deposit-safe-box{
      height: calc(100% - 55px - 80px);
      padding: 0 15px 80px 15px;
      overflow: auto;
    }
    .deposit-blockAtm-box {
        background-color: #fff;
        border-radius: 8px;
        padding: 15px 10px;
        .deposit-blockAtm-title {
            display: flex;
            align-items: center;
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

        .deposit-blockAtm-image {
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
    }
    .first-model-box {
        .deposit-coin-box {
            background-color: #fff;
            border-radius: 8px;
            padding: 15px 10px;
            margin-top: 10px;
            .select-coin-box {
                padding-top: 10px;
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
                            min-width: 80px;
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
            .input-amount-card {
                padding: 16px;
                border-radius: 8px;
                border: 1px solid #ebe9e9;
                font-size: 14px;
                font-family: Inter;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
                color: var(--mainColor);
                &.error{
                  border: 1px solid #f56c6c;
                }
                :deep {
                  .van-stepper {
                      flex: 1
                  }
                  .van-stepper__input {
                      padding: 0;
                      flex: 1;
                      font-size: 24px;
                      font-weight: 600;
                      line-height: 1.2;
                      box-sizing: border-box;
                      color: var(--primaryText);
                      background: transparent;
                      width: 100%;
                      text-align: left;
                      margin: 0;
                  }
                }
                .inpBox {
                    margin-top: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    :deep(.van-cell:after) {
                        border: 0;
                    }

                    .inp {
                        font-size: 24px;
                        font-style: normal;
                        font-family: Inter;
                        font-weight: 600;
                        color: var(--mainColor);
                        &.zero {
                            color: #9f9f9f;
                        }
                    }
                    .iconBox {
                        display: flex;
                        align-items: center;
                        margin-left: rem(20px);
                        font-size: rem(32px);
                        font-family: Inter;
                        font-weight: 600;
                        color: var(--mainColor);
                        span {
                            margin: 0 rem(8px);
                        }
                        .iconImg {
                            width: rem(48px);
                            height: rem(48px);
                        }
                    }
                }
            }

            .select-amount-box {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding-top: 16px;
                .deposit-content-number-item {
                    background-color: #f9f9fb;
                    color: #9399a4;
                    padding: 4px 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 4px;
                    min-height: 32px;
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
        }
        .deposit-content-prompt {
            display: flex;
            flex-direction: column;
            padding-top: 16px;
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
    }
    .second-model-box{
      margin-top:20px;
    }
    .submit-button {
      background-color: var(--fffColor);
      // position: fixed;
      // bottom:15px ;
      padding: 0 15px;
      width: 100%;
        height: 80px;
        display: flex;
        flex-direction: column;
        justify-content: center;

        // padding-top:10px;
        :deep {
            .van-button {
                border-radius: 8px;
            }
        }
    }
}
</style>

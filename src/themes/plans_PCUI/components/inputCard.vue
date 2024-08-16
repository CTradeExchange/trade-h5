<template>
    <div :class="[cardClass,borderError?'error':'']" :style='style'>
        <p v-if='title'>
            {{ title }}
        </p>
        <div class='card-safe-box'>
            <van-stepper
                v-if='!disabled'
                v-model='amountValue'
                allow-empty
                class='custom-vant-input'
                :decimal-length='digitsNum'
                :max='9999999999'
                :min='0'
                :placeholder="moreZero ? '0.00' : '0'"
                :show-minus='false'
                :show-plus='false'
            />
            <span v-else :class="['disabled-text',amountValue?'has-value':'']">
                {{ amountValue?amountValue: moreZero ? '0.00' : '0' }}
            </span>
            <div class='card-cy'>
                <span>{{ currencyValue || '---' }}</span>
                <el-select
                    v-if='Array.isArray(currencySelect) && currencySelect.length > 1'
                    v-model='currencyValue'
                    class='card-select'
                    :disabled='selectDisable'
                    placeholder='---'
                    suffix-icon='CaretBottom'
                >
                    <template #prefix>
                        <CurrencyIcon :currency='currencyValue' :size='24' />
                    </template>
                    <el-option
                        v-for='(item, index) in currencySelect'
                        :key='index'
                        class='card-option'
                        :label='item.currency'
                        :value='item.currency'
                    >
                        <CurrencyIcon :currency='item.currency' :size='24' />
                        <span>{{ item.currency }}</span>
                    </el-option>
                </el-select>
                <div v-else-if='Array.isArray(currencySelect) && currencySelect.length < 2' class='card-option'>
                    <CurrencyIcon :currency='currencySelect[0].currency' :size='24' />
                    <span>{{ currencySelect[0].currency || '---' }}</span>
                </div>
                <div v-else class='card-option'>
                    <CurrencyIcon :currency='currencyValue' :size='24' />
                    <span>{{ currencyValue || '---' }}</span>
                </div>
            </div>
        </div>
        <p v-if='showRateResult'>
            <span>$ {{ gt(amountRate, 0) ? amountRate : moreZero ? ratePriceZero?'0':'0.00' : '0' }}</span>
            <span>
                <slot></slot>
            </span>
        </p>
    </div>
</template>

<script>
import CurrencyIcon from '@/components/currencyIcon'
import { computed, reactive, toRefs, watch, } from 'vue'
import { mul, gt, retainDecimal } from '@/utils/calculation'
import { useStore } from 'vuex'
export default {
    components: {
        CurrencyIcon,
    },
    props: {
        style: {
            type: String,
            default: '',
        },
        // 标题
        title: {
            type: String,
            default: '',
        },
        currencyList: {
            type: Array,
            default: () => [],
        },
        amount: {
            default: null,
        },
        currency: {
            type: String,
            default: '',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        inputDisabled: {
            type: Boolean,
            default: false,
        },
        // 汇率
        currencyRate: {
            default: 1,
        },
        // 控制显示默认0还是0.00
        moreZero: {
            type: Boolean,
            default: false,
        },
        // 控制输入结果显示采用2位小数还是接口系统配置的小数位
        amountRateZero: {
            type: Boolean,
            default: false,
        },
        // 控制显示汇率结果0情况下显示0还是0.00
        ratePriceZero: {
            type: Boolean,
            default: false,
        },
        // 控制右边下拉选择币种的设置
        selectDisable: {
            type: Boolean,
            default: false,
        },
        // 控制显示/关闭输入值左下角汇率的结果
        showRateResult: {
            type: Boolean,
            default: true,
        },
        // 输入值允许多少位小数
        digitsNum: {
            type: Number,
        },
        // 边框提示
        borderError: {
            type: Boolean,
            default: false,
        }
    },
    setup (props, { emit, attrs }) {
        const store = useStore()
        const disClass = props.disabled || props.inputDisabled ? 'card-disabled ' : ''
        const cardClass = 'card-box ' + disClass + (attrs.class ?? '')
        const state = reactive({
            amountValue: '',
            currencyValue: '',
            currencySelect: '',
        })

        const accountList = computed(() => store.state._user.customerInfo.accountList)

        const amountRate = computed(() => {
            if (!props.currencyRate || !state.currencyValue || !accountList.value) return 0
            const { digits = 2 } = accountList.value.find((i) => i.currency == state.currencyValue) || {}
            if (isNaN(Number(state.amountValue))) return 0
            const amount = retainDecimal(mul(state.amountValue, props.currencyRate), props.amountRateZero ? 2 : digits)
            return amount || 0
        })

        watch(
            () => [props.currencyList, props.currency],
            ([list, vals]) => {
                let currencys = state.currencyValue
                if (Array.isArray(list) && list.length) {
                    if (typeof list[0] === 'object' && list[0].currency) {
                        currencys = list[0].currency
                        state.currencySelect = list
                    } else if (typeof list[0] === 'string') {
                        currencys = list[0]
                        state.currencySelect = list.map((i) => ({
                            currency: i,
                        }))
                    }
                } else {
                    state.currencySelect = ''
                }
                if (vals) {
                    state.currencyValue = vals
                } else {
                    state.currencyValue = currencys
                }
            },
            {
                immediate: true,
            },
        )

        // 只允许输入数字
        const numberFormatter = (value) => {
            return value.replace(/[+-]/g, '') // 移除加号和减号
        }

        watch(
            () => props.amount,
            (val) => {
                // console.log('------------>', props.amount)
                if (val !== state.amountValue) {
                    state.amountValue = val
                }
            },
            {
                immediate: true,
            },
        )

        watch(
            () => state.amountValue,
            (val) => {
                if (val !== props.amount) {
                    emit('onAmount', val)
                }
            },
        )

        watch(
            () => state.currencyValue,
            (val) => {
                if (val !== props.currency) {
                    const index = (state.currencySelect || [])?.findIndex((i) => i.currency === val)
                    emit('onCurrency', { value: val, index })
                }
            },
        )

        return {
            cardClass,
            amountRate,
            gt,
            numberFormatter,
            ...toRefs(state),
        }
    },
}
</script>

<style lang="scss" scoped>
.card-disabled {
    background: #faf9f9;
    cursor: not-allowed;
}
.error{
  border: 1px solid #f56c6c!important

}
.card-box {
    width: 100%;
    height: 108px;
    padding: 16px;
    flex-shrink: 0;
    border-radius: 2px;
    border: 1px solid #ebe9e9;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    & > p:first-of-type {
        font-size: 14px;
        line-height: 1.2;
        color: var(--primaryText);
    }
    .card-safe-box {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;

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

        .disabled-text {
          cursor: not-allowed;
          font-size: 24px;
            font-weight: 600;
            line-height: 1.2;
            color:#9f9f9f;
            &.has-value{
              color: var(--mainColor);
            }
        }

        :deep(.van-cell:after) {
            border: 0;
        }
        :deep(.van-field--disabled) {
            background: #faf9f9;
            cursor: not-allowed;
        }
        :deep(.van-field__control) {
            color: var(--mainColor);
        }

        .card-cy {
            display: flex;
            width: min-content;
            flex-direction: column;
            // min-width: 30%;
            & > span {
                height: 0;
                white-space: nowrap;
                padding: 0 28px 0 38px;
                overflow: hidden;
            }
            .card-select {
                border: none;

                .el-input.is-focus .el-input__wrapper {
                    box-shadow: none !important;
                }
                .el-input__wrapper {
                    font-size: 16px;
                    font-weight: 600;
                    line-height: 1.2;
                    padding: 0 !important;
                    box-shadow: none !important;
                    background: transparent;
                }
                .el-input__inner {
                    margin: 0 2px;
                    font-size: 16px;
                    line-height: 1.2;
                }
                :deep {
                    .el-input.is-focus .el-input__wrapper {
                        box-shadow: none !important;
                    }
                    .el-input__wrapper {
                        font-size: 16px;
                        font-weight: 600;
                        line-height: 1.2;
                        padding: 0 !important;
                        box-shadow: none !important;
                        background: transparent;
                    }
                    .el-input__inner {
                        margin: 0 2px;
                        font-size: 16px;
                        line-height: 1.2;
                    }
                }
            }
        }
    }
    & > p:last-of-type {
        display: flex;
        font-size: 12px;
        line-height: 1.2;
        justify-content: space-between;
        align-items: center;
        & > span:nth-of-type(1) {
            color: #666666;
        }
        & > span:nth-of-type(2) {
            color: var(--primaryText);
            & > span {
                color: #4069f2;
                cursor: pointer;
            }
        }
    }
}
</style>

<style lang="scss">
.card-option {
    padding: 6px 20px;
    display: flex;
    align-items: center;
    & > span {
        white-space: nowrap;
        font-size: 16px;
        font-weight: 600;
        line-height: 1.2;
        margin-left: 10px;
        color: var(--mainColor);
    }
}
</style>

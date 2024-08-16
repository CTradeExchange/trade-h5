<template>
    <div class='orderVolume'>
        <div class='volumeBox'>
            <div class='direction'>
                {{ direction==='sell' ? $t('trade.sellPrice') : $t('trade.buyPrice') }}
            </div>
            <input
                ref='inputEl'
                class='input'
                maxlength='20'
                :placeholder='$t("trade.priceLabel")'
                type='text'
                :value='modelValue'
                @blur='onBlur'
                @input='onInput'
            />
            <div class='currency'>
                <span>{{ product.profitCurrency }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { getDecimalNum, toFixed } from '@/utils/calculation'
import mitt from '@/utils/mitt'

export default {
    props: {
        product: {
            type: Object
        },
        modelValue: {
            type: [Number, String],
            default: ''
        },
        direction: {
            type: [Number, String],
            default: ''
        },
    },
    emits: ['update:modelValue', 'change'],
    setup (props, { emit }) {
        const inputEl = ref(null)
        const onInput = (e) => {
            let newval = e.target.value
            if (/[^0-9.]/.test(newval)) { // 只能输入数字
                newval = newval.replace(/[^0-9.]/g, '')
                e.target.value = newval
            }
            const digits = props.product.price_digits
            const reg = new RegExp('^\\d*(\\.?\\d{0,' + digits + '})', 'g')
            if (getDecimalNum(newval) > digits) {
                newval = (newval.match(reg)[0]) || ''
                if (digits === 0 && newval.endsWith('.')) newval = newval.replace(/\./g, '') // 浏览器不允许给number输入框输入'1.'字符串
                e.target.value = newval
            }

            emit('update:modelValue', newval)
            emit('change', newval)
        }
        const onBlur = (e) => {
            let value = e.target.value
            if (value === props.modelValue) return false
            value = value ? toFixed(value, this.digits) : value
            emit('change', value)
        }

        /** 盘口点击报价，填充买入卖出价 */
        const chooseHandicapPrice = (price) => {
            if (price) {
                emit('update:modelValue', price)
            }
        }

        onMounted(() => {
            // 盘口点击报价，填充买入卖出价
            mitt.on('chooseHandicapPrice', chooseHandicapPrice)
        })

        onUnmounted(() => {
            mitt.off('chooseHandicapPrice', chooseHandicapPrice)
        })

        return {
            inputEl,
            onInput,
            onBlur,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.volumeBox {
    position: relative;
    display: flex;
    background: var(--assistColor);
    align-items: center;
    padding: 0 12px;
    border: 1px solid var(--lineColor);
    border-radius: 5px;
    &:focus-within {
        background-color: var(--contentColor);
        border-color: var(--primary);
    }
    .input {
        width: 100%;
        padding: 0 8px;
        height: rem(80px);
        font-size: rem(28px);
        line-height: 1;
        text-align: center;
    }
    .currency,
    .direction {
        display: inline-flex;
        align-items: center;
        height: 100%;
        font-size: 12px;
    }
    .direction {
        white-space: nowrap;
        font-size: 12px;
    }
}
</style>

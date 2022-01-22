<template>
    <div class='tradeAssetBar'>
        <p class='label'>
            {{ label }}
        </p>
        <div class='assetCell'>
            <div class='leftCell' @click='chooseCurrency'>
                <CurrencyIcon class='currencyImg' :currency='currency' size='18px' />
                <span class='currency'>
                    {{ currency }}
                </span>
                <i v-if='canChooseCurrency' class='arrowDown'></i>
            </div>
            <div class='rightCell'>
                <span v-if='readonly'>
                    {{ modelValue }}
                </span>
                <input
                    v-else
                    :placeholder='placeholder'
                    type='text'
                    :value='modelValue'
                    @blur='onBlur'
                    @input='onInput'
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import CurrencyIcon from '@/components/currencyIcon.vue'
import { getDecimalNum, toFixed } from '@/utils/calculation'
import { debounce } from '@/utils/util'

import { ref, defineProps, defineEmits, computed } from 'vue'
const props = defineProps({
    readonly: Boolean,
    canChooseCurrency: {
        type: Boolean,
        default: false,
    },
    digits: [String, Number],
    label: String,
    currency: String,
    placeholder: String,
    modelValue: String
})
const emit = defineEmits(['input', 'touchCurrency', 'update:modelValue'])

// 切换币种
const chooseCurrency = () => {
    if (props.canChooseCurrency) emit('touchCurrency')
}

// 输入事件控制
const onInput = (e) => {
    let newval = e.target.value
    if (/[^0-9\.]/.test(newval)) { // 只能输入数字
        newval = newval.replace(/[^0-9\.]/g, '')
        e.target.value = newval
    }
    const digits = props.digits
    const reg = new RegExp('^\\d*(\\.?\\d{0,' + digits + '})', 'g')
    if (getDecimalNum(newval) > digits) {
        newval = (newval.match(reg) && newval.match(reg)[0]) || ''
        if (digits === 0 && newval.endsWith('.')) newval = newval.replace(/\./g, '') // 浏览器不允许给number输入框输入'1.'字符串
        e.target.value = newval
    }

    inputHandler(e)
}
// 离开输入框焦点再次验证
const onBlur = (e) => {
    let value = e.target.value
    if (value === props.modelValue) return false
    const digits = props.digits
    value = value ? toFixed(value, digits) : value
    inputHandler(e)
}

// 输入事件，防抖
const inputHandler = debounce((e) => {
    if (props.readonly) return false
    emit('update:modelValue', e.target.value)
    emit('input', e.target.value, e)
}, 500)

</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.tradeAssetBar{
    .label{
        font-size: rem(48px);
    }
    .assetCell{
        margin-top: rem(20px);
        border-radius: 6px;
        height: rem(100px);
        border: 1px solid var(--lineColor);
        padding: 10px 0;
        display: flex;
        align-items: center;
    }
    .leftCell{
        padding: 0 15px;
        border-right: 1px solid var(--lineColor);
        width: 40%;
        margin-right: 1em;
        line-height: rem(45px);
        position: relative;
        .arrowDown{
            position: absolute;
            top:7px;
            right: 10px;
        }
    }
    .rightCell{
        flex: 1;
    }
    .currency{
        vertical-align: middle;
        font-size: rem(30px);
    }
    .currencyImg{
        margin-right: 5px;
        margin-bottom: 3px;
    }
}
.arrowDown{
    width: 0;
    height: 0;
    border: 7px solid var(--placeholdColor);
    border-radius: 3px;
    border-color: var(--placeholdColor) transparent transparent transparent;
    border-bottom: 0;
    vertical-align: middle;
}
</style>

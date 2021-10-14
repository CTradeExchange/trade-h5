<template>
    <div class='orderVolume'>
        <input
            ref='inputEl'
            class='input'
            :placeholder='placeholder'
            type='text'
            :value='modelValue'
            @blur='onBlur'
            @input='onInput'
        />
        <a v-if='[2].includes(product.tradeType)' class='entryType' href='javascript:;' @click='entryTypeUpdate'>
            <i class='icon_qiehuan'></i>
            {{ parseInt(entryType)===1?$t('trade.volumes'):$t('trade.orderAmount') }}
        </a>
    </div>
</template>

<script>
import { computed, reactive, ref, toRefs } from 'vue'
import { useStore } from 'vuex'
import { getDecimalNum, toFixed } from '@/utils/calculation'
import { useI18n } from 'vue-i18n'
export default {
    props: {
        product: {
            type: Object
        },
        account: {
            type: Object
        },
        modelValue: {
            type: [Number, String],
            default: ''
        },
        entryType: {
            type: [Number, String],
            default: 1 // 1按数量下单 2按成交额下单
        },
    },
    emits: ['update:modelValue', 'change', 'update:entryType'],
    setup (props, { emit }) {
        const inputEl = ref(null)
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const placeholder = computed(() => {
            const curTradeType = props.product.tradeType
            if ([1, 2].includes(curTradeType)) {
                const account = store.state._user.customerInfo?.accountList?.find(el => el.tradeType === curTradeType)
                return parseInt(props.entryType) === 1 ? t('trade.orderVolume') : t('trade.orderAmount') + `(${account?.currency})`
            // } else if ([3].includes(curTradeType)) {
            //     return t('trade.orderVolume') + `(${props.product.baseCurrency})`
            } else if ([3, 5].includes(curTradeType)) {
                return parseInt(props.entryType) === 1 ? t('trade.orderVolume') + `(${props.product.baseCurrency})` : t('trade.orderAmount') + `(${props.product.profitCurrency})`
            } else {
                return parseInt(props.entryType) === 1 ? t('trade.volumes') : t('trade.orderAmount')
            }
        })

        const onInput = (e) => {
            let newval = e.target.value
            if (/[^0-9\.]/.test(newval)) { // 只能输入数字
                newval = newval.replace(/[^0-9\.]/g, '')
                e.target.value = newval
            }
            const digits = parseInt(props.entryType) === 1 ? getDecimalNum(props.product.minVolume) : props.account.digits
            const reg = new RegExp('^\\d*(\\.?\\d{0,' + digits + '})', 'g')
            if (getDecimalNum(newval) > digits) {
                newval = (newval.match(reg) && newval.match(reg)[0]) || ''
                if (digits === 0 && newval.endsWith('.')) newval = newval.replace(/\./g, '') // 浏览器不允许给number输入框输入'1.'字符串
                e.target.value = newval
            }

            emit('update:modelValue', newval)
            emit('change', newval)
        }
        const onBlur = (e) => {
            let value = e.target.value
            if (value === props.modelValue) return false
            const digits = getDecimalNum(props.product.minVolume)
            value = value ? toFixed(value, digits) : value
            emit('change', value)
        }

        // 切换数量下单、金额下达
        const entryTypeUpdate = () => {
            emit('update:modelValue', '')
            emit('update:entryType', props.entryType === 1 ? 2 : 1)
        }
        return {
            inputEl,
            entryTypeUpdate,
            placeholder,
            onInput,
            onBlur,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.orderVolume {
    position: relative;
    margin-top: rem(20px);
    .input {
        width: 100%;
        height: rem(80px);
        font-size: rem(28px);
        line-height: 1;
        text-align: center;
        background: var(--assistColor);
    }
    .entryType {
        position: absolute;
        right: rem(20px);
        height: rem(80px);
        color: var(--color);
        line-height: rem(80px);
    }
}
</style>

<template>
    <div v-if='product.tradeType === 2' class='trade-type'>
        <el-dropdown @command='entryTypeUpdate'>
            <span class='el-dropdown-link'>
                {{ parseInt(entryType)===1 ? $tm('trade.volumeMap')[direction] : $t('trade.orderAmount') }}
                <i class='icon icon_icon_arrow'></i>
            </span>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item>{{ $tm('trade.volumeMap')[direction] }}</el-dropdown-item>
                    <el-dropdown-item>{{ $t('trade.orderAmount') }}</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>

    <div v-else-if='[3,5].includes(product.tradeType)' class='trade-type'>
        {{ direction === 'buy' ? $t('trade.orderAmount') : $t('trade.volumes') }}
    </div>
    <div v-else class='trade-type'>
        {{ $tm('trade.volumeMap')[direction] }}
    </div>
    <van-popover
        v-model:show='showPopover'
        class='OrderVolumeClass'
        :close-on-click-action='false'
        :close-on-click-outside='false'
        :close-on-click-overlay='false'
        :offset='[8, 18]'
        placement='top'
        :show-arrow='showPopover'
        trigger='manual'
    >
        <div class='popover-content'>
            <p class='popover-title'>
                {{ $t('common.previewMargin') }}
            </p>
            <p>{{ `${previewMargin} ${account[direction]?.currency}` }}</p>
        </div>
        <template #reference>
            <div id='fifth-element-driver' class='orderVolume'>
                <input
                    ref='inputEl'
                    class='input'
                    :placeholder='inputPlaceholder'
                    type='text'
                    :value='modelValue'
                    @blur='onBlur'
                    @focus='onFocus'
                    @input='onInput'
                />
            </div>
        </template>
    </van-popover>

    <!-- <a v-if='[2].includes(product.tradeType)' class='entryType' href='javascript:;' @click='entryTypeUpdate'>
            <i class='icon_qiehuan1'></i>
            {{ parseInt(entryType)===1?$t('trade.volumes'):$t('trade.orderAmount') }}
        </a> -->
    <div class='right-val'>
        {{ placeholder }}
    </div>
</template>

<script>
import { computed, reactive, ref, watch } from 'vue'
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
        direction: {
            type: String
        },
        previewMargin: {
            type: String, // 开仓保证金
        }
    },
    emits: ['update:modelValue', 'change', 'update:entryType'],
    setup (props, { emit }) {
        const inputEl = ref(null)
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })

        // input是否focus
        const isInputFoucs = ref(false)
        // 显示popover保证金弹窗
        const showPopover = ref(false)

        // 如果输入中, 有值和保证金则显示popover
        watch([() => props.modelValue, () => props.previewMargin, () => isInputFoucs.value], (a) => {
            showPopover.value = a[0] !== '' && a[1] !== '' && a[2]
        })

        const placeholder = computed(() => {
            const curTradeType = props.product.tradeType
            if ([1, 2].includes(curTradeType)) {
                const account = store.state._user.customerInfo?.accountList?.find(el => el.tradeType === curTradeType)
                return parseInt(props.entryType) === 1 ? t('trade.volumeUnit') : account?.currency
            } else if ([3, 5].includes(curTradeType)) {
                return props.direction === 'buy' ? props.product.profitCurrency : props.product.baseCurrency
            } else {
                return parseInt(props.entryType) === 1 ? t('trade.volumes') : t('trade.orderAmount')
            }
        })

        const inputPlaceholder = computed(() => {
            const product = props.product
            const curTradeType = product.tradeType
            const volumeRange = product.minVolume ? `${t('trade.tradeRange', { min: product.minVolume, max: product.maxVolume })}` : ''
            return parseInt(props.entryType) === 1 && curTradeType === 1 ? volumeRange : ''
        })

        const onInput = (e) => {
            let newval = e.target.value
            if (/[^0-9\.]/.test(newval)) { // 只能输入数字
                newval = newval.replace(/[^0-9\.]/g, '')
                e.target.value = newval
            }
            const minVolumeDigits = props.product?.numberDigits
            const digits = parseInt(props.entryType) === 1 ? minVolumeDigits : props?.account?.digits
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
            isInputFoucs.value = false
            let value = e.target.value
            if (value === props.modelValue) return false
            // const digits = props.product.numberDigits
            const minVolumeDigits = props.product?.numberDigits
            const digits = parseInt(props.entryType) === 1 ? minVolumeDigits : props?.account?.digits
            value = value ? toFixed(value, digits) : value
            emit('change', value)
        }

        // input focus 事件
        const onFocus = () => {
            isInputFoucs.value = true
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
            inputPlaceholder,
            onInput,
            onBlur,
            onFocus,
            showPopover
        }
    }
}
</script>

<style lang="scss">
.OrderVolumeClass.van-popover {
    z-index: 1 !important;
    .van-popover__content {
        background: #4C5260;
        color: #FFF;
    }
    .van-popover__arrow {
        bottom: 1px;
        color: #4C5260;
    }
    .popover-content {
        padding: 10px 14px;
        .popover-title {
            font-size: 12px;
            margin-bottom: 4px;
        }
    }
}
</style>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.trade-type {
    cursor: pointer;
    .icon {
        font-size: 12px;
    }
}
.orderVolume {
    position: relative;
    :deep {
        .van-popover__wrapper {
            // display: block;
        }
    }
    .input {
        width: 100%;
        line-height: 1;
        text-align: center;
        color: var(--normalColor);
    }
    .entryType {
        position: absolute;
        right: rem(20px);
        height: rem(80px);
        color: var(--color);
        line-height: rem(80px);
    }
}
.right-val {
    color: var(--normalColor);
}
body.night {
    .right-val {
        color: #FFF;
    }
}
</style>

<template>
    <div class='large-input'>
        <div class='flex justify-space-between items-center text-xs text-minorColor'>
            <span>
                {{ $t('trade.collateral') }}&nbsp;
                <template v-if='$isPC'>
                    {{ singleAmount }}
                </template>
            </span>
            <div class='flex items-center'>
                <span>{{ toFixed(account?.availableMargin || 0, 2, 1) }}&nbsp;{{ account?.currency || 'USDT' }}</span>
                <popover v-if='$isPC' :text="$t('common.depositFunds')">
                    <template #reference>
                        <img class='ml-1 cursor-pointer w-5 h-5' src='/images/deposit.svg' @click='confirmOpenBlockAtm' />
                    </template>
                </popover>
                <img v-else class='ml-1 cursor-pointer w-5 h-5' src='/images/deposit.svg' @click='confirmOpenBlockAtm' />
            </div>
        </div>

        <div class='flex items-center justify-space-between w-full mt-3'>
            <div class='flex items-center flex-1'>
                <van-field
                    v-model='modelValue'
                    autocomplete='off'
                    format-trigger='onChange'
                    :formatter='formatter'
                    maxlength='16'
                    type='number'
                    @blur='onBlur'
                    @input='onInput'
                />
            </div>
            <div class='flex items-center ml-2'>
                <CurrencyIcon :currency="account?.currency || 'USDT'" :size='18' />
                <span class='ml-2 text-sm font-bold'>
                    {{ account?.currency || 'USDT' }}
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { lte, gte, formatAmount, getDecimalNum, toFixed } from '@/utils/calculation'
import CurrencyIcon from '@/components/currencyIcon'
import { firebaseAnalytics } from '@/utils/firebase'
import { useRouter } from 'vue-router'
import { useAssets } from '@/hooks/assets'

export default {
    components: {
        CurrencyIcon,
    },
    props: {
        product: {
            type: Object,
        },
        direction: {
            type: String,
            default: '',
        },
        modelValue: {
            type: [Number, String],
            default: '',
        },
        entryType: {
            type: [Number, String],
            default: 1, // 1按数量下单 2按成交额下单
        },
        previewMargin: {
            type: String,
        },
    },
    emits: ['update:modelValue', 'change', 'blur', 'update:entryType'],
    setup (props, { emit }) {
        const store = useStore()
        const router = useRouter()
        const customerInfo = computed(() => store.state._user.customerInfo || {})
        // 当前账户
        const account = useAssets()
        const onInput = (e) => {
            const value = e.target.value
            emit('update:modelValue', value)
            emit('change', value)
        }

        // 失去焦点的时候，进行检查处理
        const onBlur = (e) => {
            const value = e.target.value
            emit('blur', value)
        }

        // 切换数量下单、金额下达
        const entryTypeUpdate = () => {
            emit('update:modelValue', '')
            const entryType = props.entryType === 1 ? 2 : 1
            emit('update:entryType', entryType)
        }

        const confirmOpenBlockAtm = () => {
            window.dataLayer?.push({
                event: 'depositBtn',
                'gtm.elementClasses': 'depositButton',
                eventModel: {
                    account_Number: customerInfo.value?.customerNo,
                },
            })
            firebaseAnalytics('ck_deposit_entrance', {
                key: 'ck_deposit_entrance',
                value: JSON.stringify({
                    email: customerInfo.value?.emailAll || customerInfo.value?.email || '',
                    phone: customerInfo.value?.phoneAll || customerInfo.value?.phone || '',
                    userID: customerInfo.value?.customerNo,
                }),
            })
            router.push(window.isPC ? '/order/recharge' : '/deposit')
        }

        // 下单保证金限制
        const singleAmount = computed(() => {
            if (!props.product?.singleMinAmount || !props.product?.singleMaxAmount) return
            const minDigital = props.product?.singleMinAmount?.split('.')?.[1]?.length || 0
            const maxDigital = props.product?.singleMaxAmount?.split('.')?.[1]?.length || 0
            return `(${formatAmount(props.product.singleMinAmount, minDigital)} - ${formatAmount(
                props.product.singleMaxAmount,
                maxDigital,
            )})`
        })

        const formatter = (value) => {
            value = value?.replace('-', '') || ''
            const digits = account.value?.digits
            if (value === '') return ''
            if (Number(value) > 999999999) value = 999999999
            if (getDecimalNum(value) > digits) return toFixed(value, digits)
            return value
        }

        return {
            entryTypeUpdate,
            onInput,
            onBlur,
            gte,
            lte,
            customerInfo,
            confirmOpenBlockAtm,
            account,
            singleAmount,
            formatter,
            toFixed,
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.large-input {
    background-color: var(--assistColor);
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    border: 1px solid transparent;
    padding: 8px;
    &:focus-within {
        border-color: var(--primary);
    }
    :deep {
        .van-field {
            padding: 0;
            background: transparent;
        }
        .van-field__control {
            width: 100%;
            margin: 0;
            font-size: 24px;
            text-align: left;
            font-weight: bold;
            background: transparent;
        }
    }
}
</style>

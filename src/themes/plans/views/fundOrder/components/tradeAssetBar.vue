<template>
    <div class='tradeAssetBar'>
        <!-- 选择框 -->
        <div v-if='canChooseCurrency' class='cell' @click='chooseCurrency'>
            <div class='leftCell'>
                <p class='label'>
                    <span>{{ label }}</span>
                    <van-icon name='question-o' size='18' @click.stop="emit('open')" />
                </p>
                <div class='row'>
                    <CurrencyIcon class='currencyImg' :currency='currency' size='22px' />
                    <div>
                        <p class='currency'>
                            {{ currency === 'self' ? '一篮子资产' : currency }}
                        </p>
                        <p v-if="currency === 'self'" class='assets'>
                            通过支付{{ fundAssetsList.length }}个资产购买基金
                        </p>
                    </div>
                </div>
            </div>
            <div class='rightCell'>
                <i class='arrowDown'></i>
            </div>
        </div>
        <!-- 切换 -->
        <div v-if='canChooseCurrency' class='switch-block'>
            <i class='switch-icon icon_huidui' @click='switchWay'></i>
            <div class='switch-text'>
                <p>
                    <span class='muted'>
                        手续费率:
                    </span>
                    <span>
                        {{ activeAssets.purchaseFeeProportion }}%
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
        <!-- 输入框 -->
        <div v-if='!canChooseCurrency' class='cell'>
            <div class='leftCell'>
                <p class='label'>
                    <span>{{ label }}</span>
                </p>
                <div class='row'>
                    <CurrencyIcon class='currencyImg' :currency='currency' size='22px' />
                    <p class='currency'>
                        {{ currency }}
                    </p>
                </div>
            </div>
            <div class='rightCell'>
                <input
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
import { useRouter, useRoute } from 'vue-router'
import { ref, computed, defineProps, defineEmits } from 'vue'
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
    modelValue: String,
    // 基金信息
    fund: {
        type: Object,
        default: () => {}
    },
    // 基金底层资产列表
    fundAssetsList: {
        type: Array,
        default: () => []
    },
    // 当前选择的资产数据
    activeAssets: {
        type: Object,
        default: () => {}
    }
})
const emit = defineEmits(['input', 'touchCurrency', 'update:modelValue', 'open'])
const router = useRouter()
const route = useRoute()

// 申购、赎回类型
const { direction, fundId } = route.query

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

    inputUpdate(e)
}
// 离开输入框焦点再次验证
const onBlur = (e) => {
    let value = e.target.value
    if (value === props.modelValue) return false
    const digits = props.digits
    value = value ? toFixed(value, digits) : value
    inputUpdate(e)
}

// 输入事件，防抖
const inputUpdate = (e) => {
    if (props.readonly) return false
    emit('update:modelValue', e.target.value)
    inputHandler(e)
}
const inputHandler = debounce((e) => {
    if (props.readonly) return false
    emit('input', e.target.value, e)
}, 800)

// 点击切换申购、赎回
const switchWay = () => {
    router.push({
        name: direction === 'buy' ? 'FundRedeem' : 'FundApply',
        query: { direction, fundId }
    })
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.tradeAssetBar {
    --van-tab-active-text-color: var(--primary);
    .cell {
        display: flex;
        align-items: center;
        padding: rem(30px);
        background: var(--assistColor);
        border-radius: 6px;
        .leftCell {
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex: 1;
            height: 100%;
            margin-right: rem(30px);
            .label {
                display: flex;
                align-items: center;
                font-size: rem(34px);
                color: var(--minorColor);
                span {
                    margin-right: rem(10px);
                }
                :deep(.van-icon) {
                    margin-top: rem(-4px);
                }
            }
            .row {
                display: inline-flex;
                align-items: center;
                margin-top: rem(20px);
                .currency {
                    font-size: rem(30px);
                    font-weight: bold;
                    margin-top: rem(4px);
                }
                .currencyImg {
                    align-self: flex-start;
                    margin-right: rem(15px);
                }
                .assets {
                    margin-top: rem(15px);
                    font-size: rem(26px);
                    color: var(--minorColor);
                }
            }
        }
        .rightCell {
            display: flex;
            align-items: center;
            height: 100%;
            input {
                width: rem(300px);
                height: 100%;
                text-align: right;
                font-size: rem(28px);
            }
            .arrowDown {
                width: 0;
                height: 0;
                vertical-align: middle;
                border: 7px solid var(--placeholdColor);
                border-color: var(--placeholdColor) transparent transparent transparent;
                border-bottom: 0;
                border-radius: 3px;
            }
        }
    }
}
.switch-block {
    display: flex;
    align-items: center;
    margin: rem(25px) 0;
    .switch-icon {
        margin-right: rem(20px);
        font-size: rem(60px);
        color: var(--primary);
    }
    .switch-text {
        p {
            line-height: 1.6;
        }
    }
}
</style>

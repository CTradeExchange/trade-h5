<template>
    <div class='tradeAssetBar'>
        <p class='label'>
            {{ label }}
            <van-icon v-if='canChooseCurrency' name='question-o' size='18' @click='showAssetsPupup = true' />
            <van-icon v-else name='question-o' size='18' @click='showSharePopup = true' />
        </p>
        <!-- 选择框 -->
        <div v-if='canChooseCurrency' class='selectCell' @click='chooseCurrency'>
            <CurrencyIcon class='currencyImg' :currency='currency' size='22px' />
            <div class='textCell'>
                <span class='currency'>
                    {{ currency === 'self' ? '一篮子资产' : currency }}
                </span>
                <span v-if="currency === 'self'" class='assets-all'>
                    通过支付{{ fundAssetsList.length }}个资产购买基金
                </span>
            </div>
            <i class='arrowDown'></i>
        </div>
        <!-- 输入框 -->
        <div v-else class='inputCell'>
            <div class='leftCell'>
                <CurrencyIcon class='currencyImg' :currency='currency' size='22px' />
                <span class='currency'>
                    {{ currency }}
                </span>
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

    <!-- 基金份额说明弹窗 -->
    <van-popup
        v-model:show='showSharePopup'
        position='bottom'
        round
    >
        <div class='popup-fund'>
            <h2>什么是基金份额</h2>
            <p>
                1、什么是基金份额
                基金份额可简单理解为“基金数量”
            </p>
            <p>
                2、份额、净值、基金总价值的关系
                简单的说，基金份额就相当于基金数量，基金净值相当于基金的单价，而您基金的总价值是：基金份额*基金净值。
                <br />例如：<br />
                Sam有一套房子，这个房子有100平米，每平米最新价格是1000USD，房子的总价值=100平米*1000USD=100000USD；
                这个100平米可类比基金份额，每平米价格可类比基金的最新净值，房子的总价值可类比基金的总价值或总金额。
            </p>
        </div>
        <van-button class='popup-btn' type='primary' @click='showSharePopup = false'>
            {{ $t('common.sure') }}
        </van-button>
    </van-popup>

    <!-- 支付资产说明弹窗 -->
    <van-popup
        v-model:show='showAssetsPupup'
        position='bottom'
        round
    >
        <div class='popup-assets'>
            <van-tabs color='$style.primary'>
                <!-- 单资产 -->
                <van-tab title='USDT'>
                    <p v-if="direction === 'buy'" class='content'>
                        投资者用USDT向基金公司申购基金
                    </p>
                    <p v-else class='content'>
                        投资者用基金份额向基金公司发起赎回申请，基金公司向投资者支付USDT金额
                        <br />
                        金额=份额*净值
                    </p>
                    <div class='direction'>
                        <div class='from'>
                            <currencyIcon
                                currency='USDT'
                                size='24'
                            />
                            <p class='currency-text'>
                                USDT
                            </p>
                        </div>
                        <img alt='' class='arrow-down' src='/images/arrow-down.png?dgs22' srcset='' />
                        <div class='to'>
                            <currencyIcon currency='V10' size='24' />
                            <p class='currency-text'>
                                V10基金
                            </p>
                        </div>
                    </div>
                </van-tab>
                <!-- 一篮子资产 -->
                <van-tab title='一篮子资产'>
                    <p class='content'>
                        投资者用一篮子资产向基金公司提出申购申请，一篮子资产指的是和基金的投资构成完全一致，比例也完全一致的一组加密货币
                    </p>
                    <div class='direction'>
                        <div class='from'>
                            <currencyIcon
                                currency='BTC'
                                size='18'
                            />
                            <currencyIcon
                                currency='ETH'
                                size='18'
                            />
                            <currencyIcon
                                currency='TRX'
                                size='18'
                            />
                            <currencyIcon
                                currency='UNI'
                                size='18'
                            />
                            <p class='currency-text'>
                                USDT BTC TRX UNI..
                            </p>
                        </div>
                        <img alt='' class='arrow-down' src='/images/arrow-down.png?dgs22' srcset='' />
                        <div class='to'>
                            <currencyIcon currency='V10' size='24' />
                            <p class='currency-text'>
                                V10基金
                            </p>
                        </div>
                    </div>
                </van-tab>
            </van-tabs>
        </div>
        <van-button class='popup-btn' type='primary' @click='showAssetsPupup = false'>
            {{ $t('common.sure') }}
        </van-button>
    </van-popup>
</template>

<script setup>
import CurrencyIcon from '@/components/currencyIcon.vue'
import { getDecimalNum, toFixed } from '@/utils/calculation'
import { debounce } from '@/utils/util'
import { useRoute } from 'vue-router'
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
    // 基金数据
    fund: {
        type: Object,
        default: () => {}
    },
    // 基金底层资产列表
    fundAssetsList: {
        type: Array,
        default: () => []
    }
})
const emit = defineEmits(['input', 'touchCurrency', 'update:modelValue'])
const route = useRoute()

// 申购、赎回类型
const { direction } = route.query
// 是否显示基金份额说明弹窗
const showSharePopup = ref(false)
// 是否显示支付资产说明弹窗
const showAssetsPupup = ref(false)

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

</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.tradeAssetBar {
    --van-tab-active-text-color: var(--primary);
    .label {
        font-size: rem(36px);
    }
    .currency {
        font-size: rem(30px);
        font-weight: bold;
        margin-top: rem(4px);
    }
    .currencyImg {
        align-self: flex-start;
        margin-right: rem(15px);
    }
    .inputCell {
        display: flex;
        align-items: center;
        padding: rem(30px) 0;
        margin-top: rem(20px);
        background: var(--assistColor);
        border-radius: 6px;
        .leftCell {
            display: inline-flex;
            align-items: center;
            height: 100%;
            position: relative;
            width: 40%;
            padding: 0 15px;
            border-right: 1px solid var(--lineColor);
        }
        .rightCell {
            flex: 1;
            display: inline-flex;
            align-items: center;
            height: 100%;
            padding: 0 15px;
            input {
                flex: 1;
                height: 100%;
                text-align: right;
                font-size: rem(28px);
            }
        }
    }
    .selectCell {
        display: flex;
        align-items: center;
        margin-top: rem(20px);
        background: var(--assistColor);
        border-radius: 6px;
        padding: rem(30px);
        .textCell {
            display: inline-flex;
            flex-direction: column;
            justify-content: center;
            flex: 1;
            height: 100%;
            margin-right: rem(30px);
            .assets-all {
                margin-top: rem(15px);
                font-size: rem(26px);
                color: var(--minorColor);
            }
        }
    }
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
.popup-fund {
    padding: rem(40px);
    h2 {
        margin-bottom: rem(40px);
    }
    p {
        margin-bottom: rem(10px);
    }
}
.popup-assets {
    padding: rem(40px);

    --van-tabs-bottom-bar-color: var(--primary);
    .content {
        margin: rem(40px) 0;
    }
    .direction {
        text-align: center;
        .arrow-down {
            width: rem(100px);
            margin: rem(60px) 0;
        }
        .currency-text {
            margin: rem(10px) 0;
            vertical-align: middle;
        }
    }
}
.popup-btn {
    width: 100%;
}
</style>

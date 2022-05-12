<template>
    <div class='tradeAssetBar'>
        <p class='label'>
            {{ label }}
            <van-icon name='question-o' size='18' @click='showPopup' />
        </p>
        <div class='assetCell' @click='chooseCurrency'>
            <div class='leftCell'>
                <CurrencyIcon class='currencyImg' :currency='currency' size='18px' />
                <span class='currency'>
                    {{ currency }}
                </span>
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
            <i v-if='canChooseCurrency' class='arrowDown'></i>
        </div>
    </div>
    <van-popup
        v-model:show='show'
        class=''
        position='bottom'
        round
    >
        <div v-if="iconContentType === 'fund'" class='popup-wrap'>
            <h2> 什么是基金份额</h2>
            <br />
            <p>
                1、什么是基金份额

                基金份额可简单理解为“基金数量”
            </p>
            <br />

            <p>
                2、份额、净值、基金总价值的关系

                简单的说，基金份额就相当于基金数量，基金净值相当于基金的单价，而您基金的总价值是：基金份额*基金净值。
            </p>

            <p>例如：</p>
            <p>
                Sam有一套房子，这个房子有100平米，每平米最新价格是1000USD，房子的总价值=100平米*1000USD=100000USD；

                这个100平米可类比基金份额，每平米价格可类比基金的最新净值，房子的总价值可类比基金的总价值或总金额。
            </p>
            <br />
        </div>
        <div v-else class='popup-wrap'>
            <van-tabs
                color='$style.primary'
            >
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
        <van-button class='popup-btn' type='primary' @click='show = false'>
            {{ $t('common.sure') }}
        </van-button>
    </van-popup>
</template>

<script setup>
import CurrencyIcon from '@/components/currencyIcon.vue'
import { getDecimalNum, toFixed } from '@/utils/calculation'
import { debounce } from '@/utils/util'
import { useRoute } from 'vue-router'
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
    modelValue: String,
    iconContentType: String, // 图标点击内容类型
})
const emit = defineEmits(['input', 'touchCurrency', 'update:modelValue'])
const route = useRoute()

const { direction } = route.query
const show = ref(false)

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

// 点击问号弹出内容
const showPopup = () => {
    show.value = !show.value
}

</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.tradeAssetBar {
    --van-tab-active-text-color: var(--primary);
    .label {
        font-size: rem(36px);
    }
    .assetCell {
        display: flex;
        align-items: center;
        height: rem(100px);
        margin-top: rem(20px);
        padding: 10px 0;
        background: var(--assistColor);
        border-radius: 6px;
    }
    .leftCell {
        position: relative;
        width: 40%;
        margin-right: 1em;
        padding: 0 15px;
        line-height: rem(45px);
        border-right: 1px solid var(--lineColor);
    }
    .arrowDown {
        position: relative;
        right: 10px;
    }
    .rightCell {
        flex: 1;
    }
    .currency {
        font-size: rem(30px);
        vertical-align: middle;
    }
    .currencyImg {
        margin-right: 5px;
        margin-bottom: 3px;
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
.popup-wrap {
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
    .direction{

    }
}
</style>

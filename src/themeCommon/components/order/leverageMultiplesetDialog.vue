<template>
    <div class='flex items-center justify-space-between my-2 leverage-dialog'>
        <div class='text-xs text-color'>
            {{ $t('trade.multilpRange') }}
        </div>
        <van-button
            block
            class='w-auto rounded-xs px-5 h-6 leading-6 leverage-button'
            :loading='showLeverageButton'
            size='small'
            @click='show = true'
        >
            {{ props.modelValue }}x
        </van-button>
        <van-popup v-model:show='show' :position="isPC ? 'center' : 'bottom'" round>
            <div class='p-5 rounded-base max-w-120'>
                <div class='flex items-center justify-space-between'>
                    <div class='text-xl font-bold'>
                        {{ $t('common.adjustLeverage') }}
                    </div>
                    <van-icon name='cross' size='20' @click='show = false' />
                </div>
                <div class='mt-8'>
                    <div class='text-base mb-2 font-medium'>
                        {{ $t('trade.leverage') }}
                    </div>
                    <van-stepper v-model='leverage' integer :max='Number(multipleRange[1])' :min='Number(multipleRange[0])' />
                </div>
                <div class='slider-block'>
                    <Slider
                        v-if='multipleRange'
                        v-model='leverage'
                        :max='Number(multipleRange[1])'
                        :min='Number(multipleRange[0])'
                        :step='1'
                    />
                    <div class='node-list'>
                        <div class='absolute flex flex-col items-start justify-center'>
                            <div class='line'></div>
                            <div class='num' :style="{ marginLeft: '-8px' }">
                                {{ multipleRange[0] }}x
                            </div>
                        </div>
                        <div
                            v-for='(item, index) in nodeCeilCount'
                            :key='index'
                            class='absolute flex flex-col items-center justify-center'
                            :style="{ left: nodeCeilCount === index + 1 ? '100%' : `${toFixed(100 / 4) * (index + 1)}%` }"
                        >
                            <div class='line'></div>
                            <div class='num'>
                                {{ nodeCeilCount === index + 1 ? multipleRange[1] : nodeLen * (index + 1) }}x
                            </div>
                        </div>
                    </div>
                </div>
                <div class='text-warn mt-4'>
                    <div class='mb-1'>
                        <van-icon name='info' />
                        <span class='ml-1'>
                            {{ $t('common.adjustLeverageTips1') }}
                        </span>
                    </div>
                    <div>
                        <van-icon name='info' />
                        <span class='ml-1'>
                            {{ $t('common.adjustLeverageTips2') }}
                        </span>
                    </div>
                </div>
                <van-button block class='mb-5 mt-25' :loading='loading' type='primary' @click='handleConfirm'>
                    {{ $t('common.sure') }}
                </van-button>
            </div>
        </van-popup>
    </div>
</template>

<script setup>
import { defineProps, computed, defineEmits, ref, watchEffect, watch } from 'vue'
import { useStore } from 'vuex'
import { isEmpty } from '@/utils/util'
import { Slider, Toast } from 'vant'
import { toFixed } from '@/utils/calculation'
import { setCrossLevelNum } from '@/api/trade'
import { useI18n } from 'vue-i18n'

const props = defineProps({
    // 当前设置的杠杆倍数
    modelValue: {
        type: [Number, String],
        default: '',
    },
})
const emit = defineEmits(['update:modelValue'])
const { t } = useI18n({ useScope: 'global' })

const show = ref(false)
const loading = ref(false)
const leverage = ref(props.modelValue)
const isPC = window.isPC
const store = useStore()
// 持仓列表数据
const positionList = computed(() => store.state._trade.positionList[product.value?.tradeType] || [])
// 当前产品对应的持仓数据
const productPosition = computed(() =>
    positionList.value.find((el) => el.tradeType === product.value.tradeType && el.symbolId === product.value.symbolId),
)
const product = computed(() => store.getters.productActived)
// 用户信息
const customerInfo = computed(() => store.state._user.customerInfo)
// 是否显示持仓杠杆
const showLeverageButton = computed(() => Boolean(store.state._trade.positionLoading && customerInfo.value))

// 杠杆倍数范围，全仓玩法的范围优先取当前产品的持仓数据，如果没有当前产品没有持仓则取产品信息里面的数据
const multipleRange = computed(() => {
    if (product.value.tradeType === 1 && !isEmpty(productPosition.value)) {
        return productPosition.value.adjustCrossLevel.split('-')
    } else {
        return product.value.marginInfo?.values?.split('-') || []
    }
})

// 每个节点的长度
const nodeLen = computed(() => {
    const max = multipleRange.value[1]
    return max / 4
})

// 向上取整的节点数据
const nodeCeilCount = computed(() => {
    return Math.ceil(4)
})

const onSuccess = () => {
    emit('update:modelValue', leverage.value)
    show.value = false
    Toast(t('common.leverageSetSuccessfully'))
}

const handleConfirm = () => {
    // 有持仓需要调用设置杠杆接口
    if (productPosition.value && productPosition.value.crossLevelNum != leverage.value) {
        loading.value = true
        setCrossLevelNum({
            tradeType: product.value.tradeType,
            symbolId: product.value.symbolId,
            crossLevelNum: leverage.value,
        })
            .then((res) => {
                if (res.check()) {
                    onSuccess()
                    store.dispatch('_trade/queryPositionPage', {
                        tradeType: product.value.tradeType,
                    })
                }
            })
            .finally(() => {
                loading.value = false
            })
    } else {
        onSuccess()
    }
}

watch(show, (value) => {
    if (value) {
        leverage.value = props.modelValue
    }
})

// 事件后台配置的默认杠杆
const defaultLeverage = computed(() => {
    try {
        const newsSysConfig = store.state._base.newsSysConfig
        // 有在新闻后台设置默认杠杆，则使用默认杠杆
        const newsConfig = newsSysConfig && newsSysConfig.find((o) => o.Key === 'leverageConfig')
        const { Value } = newsConfig || {}
        const leverageConfig = JSON.parse(Value)
        const defaultLeverage = leverageConfig[product.value.symbolId]
        return defaultLeverage || 1
    } catch (error) {
        const [min] = product.value.marginInfo?.values?.split('-') || [1]
        return min
    }
})

watchEffect(() => {
    let crossLevelNum = defaultLeverage.value
    const min = multipleRange.value[0]
    const max = multipleRange.value[1]
    // 先看该产品有没有持仓，有持仓显示持仓的杠杆
    if (productPosition.value?.crossLevelNum) {
        crossLevelNum = productPosition.value.crossLevelNum
    } else if (max < crossLevelNum) {
        crossLevelNum = max
    } else if (min > crossLevelNum) {
        crossLevelNum = min
    }
    emit('update:modelValue', crossLevelNum)
    leverage.value = crossLevelNum
})
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.leverage-dialog {
    :deep(.van-stepper) {
        display: flex;
        width: 100%;
        --van-stepper-input-height: 40px;
        --van-stepper-input-font-size: 16px;
        font-weight: 500;
        .van-stepper__input {
            flex: 1;
            margin: 0;
            text-align: center;
        }
    }
    :deep {
        .leverage-button {
            --van-button-loading-icon-size: 16px;
            background-color: var(--assistColor);
            &:hover {
                background-color: var(--primaryAssistColor);
            }
        }

        .van-slider {
            height: 8px;
            background: var(--assistColor);
            z-index: 10;
        }

        .van-stepper__input {
            font-size: 16px;
            text-align: right;
            background-color: var(--assistColor);
        }

        .slider-in-end {
            .van-slider__button-wrapper--right {
                padding-left: 0px;
                margin-right: 8px;
            }
        }

        .van-slider__bar {
            background: linear-gradient(270deg, var(--primary) 30%, rgb(234 90 38 / 60%));
            height: 8px;
            z-index: 11;
        }
    }

    .slider-block {
        position: relative;
        margin-top: 30px;
        margin-bottom: 30px;
        padding-bottom: 20px;
        .node-list {
            width: 100%;
            display: flex;
            position: relative;
            top: -10px;
            left: 0;

            .line {
                width: 3px;
                height: 12px;
                background: var(--lineColor);
                border-radius: 2px;
                &:first-of-type {
                    margin-left: 0;
                }
            }
            .num {
                font-size: 12px;
                color: var(--minorColor);
                margin-top: 5px;
                margin-left: -2px;
                transform: translateX(50%);
            }
            > div:not(:first-of-type) {
                transform: translateX(-100%);
                align-items: flex-end;
            }
            > div:last-of-type {
                .num {
                    transform: translateX(0%);
                }
            }
        }
    }

    .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 0;
        .name {
            color: var(--minorColor);
            font-size: 12px;
        }
        .value {
            display: flex;
            align-items: center;
            background-color: var(--assistColor);
            min-width: 78px;
            position: relative;
            .van-stepper {
                font-size: 16px;
                font-weight: 600;
                text-align: right;
                border-radius: 4px;
                --van-stepper-input-height: 30px;
                --van-stepper-input-width: 52px;
                border: 1px solid var(--assistColor);
                padding-right: 40px;
                &:focus-within {
                    border: 1px solid var(--primary);
                    background-color: var(--contentColor);
                    --van-stepper-background-color: var(--contentColor);
                }
            }
            .inputIcon {
                right: 30px;
                position: absolute;
                font-size: 16px;
                font-weight: 600;
            }
        }
    }

    .handle {
        height: 16px;
        width: 16px;
        background-color: var(--bgColor);
        z-index: 3;
        cursor: grab;
        border-radius: 50%;
        border: 2px solid var(--primary);
        touch-action: pan-x;
        position: relative;
        span {
            display: block;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            top: 16px;
            font-size: 12px;
            background: #4c5260;
            padding: 0 8px;
            border-radius: 4px;
            color: #fff;
            transition: all 0.8s ease-out;
        }
    }
}
</style>

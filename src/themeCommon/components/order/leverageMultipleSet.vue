<template>
    <div class='leverage'>
        <div class='leverage-filed'>
            <div class='text-minorColor leverage-label'>
                {{ $t('trade.multilpRange') }}&nbsp;{{ multipleRange && $isPC ? `(${multipleRange[0]}x-${multipleRange[1]}x)` : '' }}
            </div>
            <div class='value'>
                <van-stepper
                    v-model='inputVal'
                    integer
                    :max='Number(multipleRange[1])'
                    :min='Number(multipleRange[0])'
                    :show-minus='false'
                    :show-plus='false'
                    @blur='onBlur'
                    @change='onInput'
                />
                <span class='inputIcon'>
                    {{ 'X' }}
                </span>
            </div>
        </div>
        <div
            class='slider-block'
            :class="{
                'slider-in-end': leverage && multipleRange?.[1] && multipleRange[1] - leverage < 10,
                'slider-in-start': leverage - multipleRange?.[0] < 10,
            }"
        >
            <Slider
                v-model='leverage'
                :max='Number(multipleRange[1])'
                :min='Number(multipleRange[0])'
                :step='1'
                @drag-end='onDragEnd'
                @drag-start='onDragStart'
                @update:model-value='handleChange'
            >
                <template #button>
                    <div class='handle'>
                        <span v-if='isPC && isDrag'>
                            {{ inputVal }}
                        </span>
                    </div>
                </template>
            </Slider>
            <div class='node-list'>
                <div class='absolute flex flex-col items-start justify-center'>
                    <div class='line'></div>
                    <div class='num' :style="{ marginLeft: '-2px' }">
                        {{ multipleRange[0] }}
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
                        {{ nodeCeilCount === index + 1 ? multipleRange[1] : nodeLen * (index + 1) }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { Slider } from 'vant'
import { isEmpty } from '@/utils/util'
import { toFixed, lt, gt } from '@/utils/calculation'

export default {
    components: {
        Slider,
    },
    props: {
        // 当前设置的杠杆倍数
        modelValue: {
            type: [Number, String],
            default: '',
        },
        // 是否双向绑定
        isBindValue: {
            type: Boolean,
            default: false,
        },
        // 当前产品对应的持仓数据
        position: {
            type: [String, Object],
            default: '',
        },
    },
    emits: ['update:modelValue', 'blur'],
    setup (props, { emit }) {
        const store = useStore()
        const product = computed(() => store.getters.productActived)

        // 持仓列表数据
        const positionList = computed(() => store.state._trade.positionList[product.value?.tradeType] || [])
        // 当前产品对应的持仓数据
        const productPosition = computed(() =>
            positionList.value.find((el) => el.tradeType === product.value.tradeType && el.symbolId === product.value.symbolId),
        )
        // 杠杆倍数范围，全仓玩法的范围优先取当前产品的持仓数据，如果没有当前产品没有持仓则取产品信息里面的数据
        const multipleRange = computed(() => {
            if (props.isBindValue) {
                return props.position.adjustCrossLevel?.split('-') || []
            } else {
                if (product.value.tradeType === 1 && !isEmpty(productPosition.value)) {
                    return productPosition.value.adjustCrossLevel.split('-')
                } else {
                    return product.value.marginInfo?.values?.split('-') || []
                }
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

        // 初始化值
        const leverage = ref(0)
        // 输入框显示的值
        const inputVal = ref(0)
        // 是否正在拖动中
        const isDrag = ref(false)

        // 设置杠杆倍数
        const setMultipleVal = () => {
            const [min] = multipleRange.value || [1]
            let multipleVal = min
            try {
                const newsSysConfig = store.state._base.newsSysConfig
                // 有在新闻后台设置默认杠杆，则使用默认杠杆
                const newsConfig = newsSysConfig && newsSysConfig.find((o) => o.Key === 'leverageConfig')
                const { Value } = newsConfig || {}
                const leverageConfig = JSON.parse(Value)
                const defaultLeverage = leverageConfig[product.value.symbolId]
                if (defaultLeverage) {
                    multipleVal = defaultLeverage
                }
            } catch (error) {
                multipleVal = min
            }
            leverage.value = Number(multipleVal)
            inputVal.value = leverage.value
            emit('update:modelValue', leverage.value)
        }

        // 修改杠杆倍数
        const handleChange = (value) => {
            const max = multipleRange.value[1]
            if (Number(value) > Number(max)) {
                value = max
            }
            leverage.value = Number(value)
            inputVal.value = leverage.value
            emit('update:modelValue', leverage.value)
        }

        // 输入杠杆倍数
        const onInput = (value) => {
            const [min, max] = multipleRange.value
            if (gt(value, max)) {
                leverage.value = Number(max)
            } else if (lt(value, min)) {
                leverage.value = Number(min)
            } else {
                leverage.value = Number(value)
            }

            inputVal.value = leverage.value
            emit('update:modelValue', leverage.value)
        }

        // 开始拖动
        const onDragStart = () => {
            isDrag.value = true
            document.body.classList.add('user-dragging')
        }

        // 结束拖动
        const onDragEnd = () => {
            isDrag.value = false
            document.body.classList.remove('user-dragging')
            emit('blur', leverage.value)
        }

        const onBlur = () => {
            emit('blur', leverage.value)
        }

        // 监听modelValue
        watch(
            () => props.modelValue,
            () => {
                // if (props.isBindValue) {
                leverage.value = props.modelValue || 0
                inputVal.value = props.modelValue
                // }
            },
            {
                immediate: true,
            },
        )

        // 监听product设置杠杆倍数，全仓玩法取当前产品的持仓数据，如果当前产品没有持仓数据则单独设置
        watch(
            () => [product.value.symbolId, product.value.marginInfo?.type],
            () => {
                if (props.isBindValue) return
                if (Number(product.value.tradeType === 1) && !isEmpty(productPosition.value)) {
                    leverage.value = productPosition.value.crossLevelNum
                    inputVal.value = leverage.value
                    emit('update:modelValue', leverage.value)
                } else {
                    setMultipleVal()
                }
            },
            {
                immediate: true,
            },
        )

        return {
            isPC: window.isPC,
            toFixed,
            product,
            multipleRange,
            leverage,
            inputVal,
            nodeLen,
            nodeCeilCount,
            isDrag,
            onDragStart,
            onDragEnd,
            onInput,
            handleChange,
            onBlur,
        }
    },
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.leverage {
    touch-action: none;
    touch-action: pan-y;

    :deep {
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
            padding-left: 4px;
        }
    }
    .slider-block {
        position: relative;
        margin-top: 10px;
        height: 35px;
        z-index: 1;
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
    .leverage-filed {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 16px 0;
        .leverage-label {
            font-size: 14px;
        }
        .value {
            display: flex;
            align-items: center;
            min-width: 78px;
            position: relative;
            border-radius: 4px;
            background-color: var(--assistColor);
            border: 1px solid var(--assistColor);
            overflow: hidden;
            .van-stepper {
                font-size: 16px;
                font-weight: 600;
                text-align: right;
                --van-stepper-input-height: 30px;
                --van-stepper-input-width: 52px;
                padding-right: 40px;
                background-color: var(--assistColor);
            }
            &:focus-within {
                border: 1px solid var(--primary);
                background-color: var(--contentColor);
                --van-stepper-background-color: var(--contentColor);
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
.h5 .leverage {
    .leverage-filed {
        .leverage-label {
            font-size: 12px;
        }
    }
    :deep {
        .slider-in-end {
            .van-slider__button-wrapper--right {
                padding-left: 0px;
                margin-right: 12px;
            }
        }
        .slider-in-start {
            .van-slider__button-wrapper--right {
                padding-left: 16px;
            }
        }
        .node-list .num {
            margin-left: 0;
            margin-top: 10px;
        }
    }
    .handle {
        height: 24px;
        width: 24px;
    }
}
</style>

<style lang="scss">
.h5 {
    .leverage {
        .handle {
            height: 24px;
            width: 24px;
        }
        .van-slider__button-wrapper--right {
            padding-left: 16px;
        }
    }
}
.user-dragging {
    user-select: none;
}
</style>

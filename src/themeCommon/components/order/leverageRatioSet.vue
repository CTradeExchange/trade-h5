<template>
    <div class='leverage'>
        <div class='title'>
            <div class='text-xs text-color'>
                {{ $t('trade.multilpRange') }}{{ multipleRange[0] }}x - {{ multipleRange[1] }}x
            </div>
            <div class='value'>
                <input readonly type='text' :value='leverage' />
            </div>
        </div>
        <Slider
            v-if='multipleRange[1]'
            v-model='leverage'
            :max='Number(multipleRange[1])'
            :min='Number(multipleRange[0])'
            readonly
        >
            <template #button>
                <div class='handle'>
                    <span>{{ leverage }}</span>
                </div>
            </template>
        </Slider>
        <div class='mark'>
            <div class='mark-li'>
                {{ (multipleRange[0]) }}
            </div>
            <div class='mark-li'>
                {{ (multipleRange[1]) }}
            </div>
        </div>
    </div>
</template>

<script>
import { Slider } from 'vant'
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { isEmpty, objArraySort } from '@/utils/util'
import BigNumber from 'bignumber.js'

export default {
    components: {
        Slider
    },
    setup (props, { emit }) {
        const store = useStore()
        const product = computed(() => store.getters.productActived)

        // 保证金比例
        const usedMarginSet = computed(() => {
            if (!isEmpty(product.value.usedMarginSet)) {
                const contractSize = product.value.contractSize
                return objArraySort(product.value.usedMarginSet, 'rangeLeft').map(el => {
                    el.rangeLeftVolume = BigNumber(el.rangeLeft).div(contractSize).toNumber()
                    el.rangeRightVolume = BigNumber(el.rangeRight).div(contractSize).toNumber()
                    return el
                })
            }
            return []
        })

        // 杠杆倍数范围
        const multipleRange = computed(() => {
            if (usedMarginSet.value.length) {
                return [2, parseInt(1 / usedMarginSet.value[0].percent)]
            }
            return []
        })

        // 初始化值
        const leverage = ref(0)
        // 保证金模式取第一个范围
        watch(multipleRange, () => {
            if (multipleRange.value.length > 0) {
                leverage.value = multipleRange.value[1]
            }
        }, { immediate: true })

        return {
            product,
            multipleRange,
            leverage
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.leverage {
    :deep {
        .van-slider,
        .van-slider__bar {
            height: 8px;
        }
        .van-slider__button-wrapper--right {
            padding-left: 5px;
        }

        .van-slider__bar {
            background: linear-gradient(270deg, var(--primary) 30%, rgb(234 90 38 / 60%));
            z-index: 3;
        }

        .van-slider {
            &::before,
            &::after {
                content: '';
                position: absolute;
                height: 12px;
                width: 3px;
                border-radius: 2px;
                border: none;
                top: -2px;
                left: 0;
                z-index: 0;
                background: var(--van-slider-inactive-background-color);
            }
            &::after {
                left: initial;
                right: 0;
            }
        }
    }
    .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 0;

        .value {
            input {
                max-width: 70px;
                font-size: 16px;
                text-align: center;
                border: 1px solid var(--lineColor);
                background-color: var(--bgColor);
                border-radius: 4px;
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
            display: none;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            top: 16px;
            font-size: 12px;
            background: #4C5260;
            padding: 0 8px;
            border-radius: 4px;
            color: #FFF;
            transition: all 0.8s ease-out;
        }
        &:hover {
            box-shadow: 0 0 5px var(--primary);
            span {
                display: block;
            }
        }
    }
    .mark {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        color: var(--minorColor);
        font-size: 12px;
        margin: 4px 0;
        .mark-li {
            position: relative;
        }
    }
}
</style>

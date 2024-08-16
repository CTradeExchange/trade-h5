<template>
    <div class='drawer'>
        <div class='drawer-title'>
            <span>{{ $t("signal.filter") }}</span>
            <van-icon name='cross' size='18' @click='close' />
        </div>
        <div class='drawer-container'>
            <div class='drawer-content'>
                <!-- 指标 -->
                <div v-if='signalType !== "signal"' :class="['drawer-block', indicatorVisible ? 'drawer-block-show' : 'drawer-block-hide']">
                    <div class='drawer-header' @click='indicatorVisible = !indicatorVisible'>
                        <span class='name'>
                            {{ $t("signal.allIndicator") }}
                        </span>
                        <van-icon class='arrow' name='arrow-down' />
                    </div>
                    <div class='drawer-classify'>
                        <classify-list v-model='indicatorValue' :list='config.indicator || []' show-all :style-type='4' />
                    </div>
                </div>
                <!-- 信号 -->
                <div v-else :class="['drawer-block', signalVisible ? 'drawer-block-show' : 'drawer-block-hide']">
                    <div class='drawer-header' @click='signalVisible = !signalVisible'>
                        <span class='name'>
                            {{ $t("signal.allSignal") }}
                        </span>
                        <van-icon class='arrow' name='arrow-down' />
                    </div>
                    <div class='drawer-classify'>
                        <classify-list v-model='signalValue' :list='config.signal || []' show-all :style-type='4' />
                    </div>
                </div>
                <!-- 时间周期 -->
                <div :class="['drawer-block', timeVisible ? 'drawer-block-show' : 'drawer-block-hide']">
                    <div class='drawer-header' @click='timeVisible = !timeVisible'>
                        <span class='name'>
                            {{ $t("signal.timePeriod") }}
                        </span>
                        <van-icon class='arrow' name='arrow-down' />
                    </div>
                    <div class='drawer-classify'>
                        <classify-list v-model='timeValue' :list='formatPeriod' show-all :style-type='4' />
                    </div>
                </div>
                <!-- 买卖建议 -->
                <div v-if='signalType !== "ranking"' :class="['drawer-block', tradeVisible ? 'drawer-block-show' : 'drawer-block-hide']">
                    <div class='drawer-header' @click='tradeVisible = !tradeVisible'>
                        <span class='name'>
                            {{ $t("signal.tradeRecommend") }}
                        </span>
                        <van-icon class='arrow' name='arrow-down' />
                    </div>
                    <div class='drawer-classify'>
                        <classify-list v-model='tradeValue' :list='config.action || []' show-all :style-type='4' />
                    </div>
                </div>
                <!-- 产品分类 -->
                <!-- <div :class="['drawer-block', 'deawer-block-product' ,productVisible ? 'drawer-block-show' : 'drawer-block-hide']">
                    <div class='drawer-header' @click='productVisible = !productVisible'>
                        <span class='name'>
                            {{ $t("signal.category") }}
                        </span>
                        <van-icon class='arrow' name='arrow-down' />
                    </div>
                    <div class='drawer-classify'>
                        <classify-list v-model='productValue' :list='config.product || []' show-all :style-type='4' />
                    </div>
                </div> -->
            </div>
            <div class='drawer-handle'>
                <button class='reset' @click='onReset'>
                    {{ $t("signal.common.reset") }}
                </button>
                <button class='confirm' @click='onConfirm'>
                    {{ $t("signal.common.confirm") }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { toRefs, reactive, computed } from 'vue'
import { useStore } from 'vuex'
import classifyList from '../components/classify-list.vue'

export default {
    components: {
        classifyList
    },
    props: {
        type: String // 类型
    },
    emits: ['confirm', 'close'],
    setup (props, { emit }) {
        const store = useStore()
        const state = reactive({
            // 指标
            indicatorValue: '',
            indicatorVisible: true,
            // 时间
            timeValue: '',
            timeVisible: true,
            // 买卖
            tradeValue: '',
            tradeVisible: true,
            // 产品
            productValue: '',
            productVisible: true,
            // 信号
            signalType: '',
            signalValue: '',
            signalVisible: true,
        })

        const config = computed(() => {
            return store.state._signal.config
        })

        // 周期转换
        const formatPeriod = computed(() => {
            if (props.type === 'valuable') {
                return store.getters['_signal/getValuablePeriod']
            }
            return store.state._signal.config.period || []
        })

        // 打开并初始化过滤弹窗
        const open = (signalType, data) => {
            state.signalType = signalType
            state.visible = true
            if (data) {
                state.indicatorValue = data?.i || ''
                state.timeValue = data?.pe || ''
                state.tradeValue = data?.a || ''
                state.productValue = data?.sc || ''
                state.signalValue = data?.si || ''
            } else {
                onReset()
            }
        }

        // 关闭弹窗
        const close = () => {
            emit('close')
        }

        // 重置
        const onReset = () => {
            state.indicatorValue = ''
            state.indicatorVisible = true
            state.timeValue = ''
            state.timeVisible = true
            state.tradeValue = ''
            state.tradeVisible = true
            state.productValue = ''
            state.productVisible = true
            state.signalValue = ''
            state.signalVisible = true
        }

        // 确定
        const onConfirm = () => {
            const params = {
                i: state.indicatorValue,
                pe: state.timeValue,
                a: state.tradeValue,
                sc: state.productValue
            }
            // 按信号筛选需要传si
            if (state.signalType === 'signal') {
                params.si = state.signalValue
            }
            emit('confirm', params)
        }

        return {
            ...toRefs(state),
            config,
            open,
            close,
            onReset,
            onConfirm,
            formatPeriod
        }
    }
}
</script>

<style lang="scss" scoped>
.drawer-title {
    text-align: center;
    padding: rem(32px) 0 rem(20px) 0;
    font-size: rem(34px);
    color: var(--color);
    position: relative;
    .van-icon-cross {
        position: absolute;
        right: rem(30px);
        cursor: pointer;
    }
}
.drawer-container {
    display: flex;
    flex-direction: column;
    flex: 1;
}
.drawer-content {
    flex: 1;
}
.drawer-block {
    padding: 0 rem(30px);
    margin-top: rem(24px);
    .drawer-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: rem(80px);
        .name {
            font-size: rem(26px);
        }
        .arrow {
            color: var(--minorColor);
            margin-right: rem(-6px);
            font-size: rem(34px);
            transition: all cubic-bezier(0.215, 0.61, 0.355, 1) 0.2s;
        }
    }
    .drawer-classify {
        overflow: hidden;
    }
    &.drawer-block-show {
        .drawer-classify {
            transition: all 0.25s;
            max-height: rem(600px);
        }
    }
    &.drawer-block-hide {
        .drawer-classify {
            transition: all 0.1s;
            max-height: 0;
        }
        &::v-deep {
            .arrow {
                transform: rotate(180deg);
            }
        }
    }
}
.drawer-handle {
    display: flex;
    justify-content: space-between;
    padding: 0 rem(30px);
    margin: rem(24px) 0 rem(48px);
    button {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: calc(50% - rem(15px));
        height: rem(80px);
        border-radius: rem(8px);
        cursor: pointer;
        &.reset {
            border-color: var(--lineColor);
            background: var(--primaryAssistColor);
            color: var(--normalColor);
            border-width: 1px;
            border-style: solid;
        }
        &.confirm {
            background: var(--primary);
            color: #FFF;
        }
    }
}
</style>

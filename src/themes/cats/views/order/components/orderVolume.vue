<template>
    <div class='wrapper'>
        <van-row class='pendingOrderSet' justify='space-between' type='flex'>
            <van-col>
                <p class='title'>
                    {{ $t('trade.orderVolume') }}
                </p>
            </van-col>
            <van-col class='relative'>
                <StepperComp
                    v-model='num'
                    class='stepper'
                    :class="{ 'warn':modelValue<min || modelValue>max }"
                    :controlbtn='true'
                    :digits='stepDigit'
                    :max='max'
                    :min='min'
                    :step='product.volumeStep'
                    @change='change'
                />
            </van-col>
        </van-row>
        <ul class='volumeSteps'>
            <li v-for='(step,i) in volumeSteps' :key='i'>
                <a class='item' href='javascript:;' @click='addStep(step)'>
                    {{ lt(step, 0) ? step:'+'+step }}
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getDecimalNum, plus, divide, mul, lt } from '@/utils/calculation'
import StepperComp from '@/components/stepper'

export default {
    components: {
        StepperComp,
    },
    props: ['modelValue', 'product'],
    emits: ['update:modelValue'],
    data () {
        return {
            warn: true,
            num: ''
        }
    },
    computed: {
        ...mapGetters(['style', 'assetAboutInfo']),
        stepDigit () {
            return getDecimalNum(this.product.volumeStep)
        },
        min () {
            return this.product.minVolume
        },
        max () {
            return this.product.maxVolume
        },
        volumeSteps () {
            const volumeStep = this.product.volumeStep
            return [
                mul(volumeStep, -10),
                mul(volumeStep, -1),
                mul(volumeStep, 1),
                mul(volumeStep, 10)
            ]
        },
        // 手数不是最小手数的整数倍
        volumeInvalid () {
            const m = divide(this.modelValue, this.product.minVolume)
            return getDecimalNum(m) > 0
        }
    },
    watch: {
        modelValue (newval) {
            this.num = newval
        }
    },
    created () {
        this.num = this.modelValue
    },
    methods: {
        change (val) {
            this.$emit('update:modelValue', val)
        },
        addStep (val) {
            let newval = plus(this.modelValue, val) * 1
            const volumes_min = this.product.minVolume
            const volumes_max = this.product.maxVolume
            newval = Math.max(newval, volumes_min)
            newval = Math.min(newval, volumes_max)
            this.$emit('update:modelValue', newval)
        },
        lt,
    },
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.wrapper {
    align-items: center;
    line-height: 1.5;
    .title {
        line-height: rem(80px);
    }
}
.stepper {
    background: var(--bgColor);
    &.warn {
        color: var(--warn);
    }
    :deep(.input) {
        width: rem(240px);
    }
}
.volumeSteps {
    display: flex;
    justify-content: flex-end;
    margin-top: rem(30px);
    font-size: rem(24px);
    text-align: right;
    li {
        margin-left: rem(20px);
    }
    .item {
        display: inline-block;
        width: rem(120px);
        height: rem(40px);
        color: #333;
        line-height: rem(40px);
        text-align: center;
        background: var(--bgColor);
        border-radius: rem(6px);
    }
}

</style>

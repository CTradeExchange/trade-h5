<template>
    <div class='profitLossBar'>
        <van-row align='center' justify='space-between'>
            <van-col>
                <slot name='title'></slot>
            </van-col>
            <van-col class='relative'>
                <StepperComp
                    v-model='num'
                    class='stepper'
                    :class="{ 'warn': warn }"
                    :controlbtn='true'
                    :digits='product.price_digits || product.symbolDigits'
                    :max='max'
                    :min='min'
                    :step='step'
                    @change='change'
                    @firstMinus='firstChange'
                    @firstPlus='firstChange'
                />
            </van-col>
        </van-row>
    </div>
</template>

<script>
import { plus, div, pow, lt, gt, toFixed } from '@/utils/calculation'
import StepperComp from '@plans/components/stepper'

export default {
    components: {
        StepperComp,
    },
    props: ['modelValue', 'product', 'min', 'max', 'placeholder'],
    emits: ['update:modelValue', 'change'],
    data () {
        return {
            num: ''
        }
    },
    computed: {
        step () {
            return pow(0.1, this.product.price_digits || this.product.symbolDigits)
        },
        warn () {
            const minInvalid = this.modelValue && lt(this.modelValue, this.min)
            const maxInvalid = this.modelValue && gt(this.modelValue, this.max)
            return minInvalid || maxInvalid
        }
    },
    watch: {
        modelValue (newval) {
            if (newval !== this.num) this.num = newval
        }
    },
    created () {
        this.num = this.modelValue
    },
    methods: {
        change (val) {
            this.$emit('update:modelValue', val)
            this.$emit('change', val)
        },
        firstChange () {
            const sumVal = plus(this.max, this.min)
            const val = div(sumVal, 2)
            const digits = this.product.price_digits || this.product.symbolDigits
            const valFixed = toFixed(val, digits)
            this.$emit('update:modelValue', valFixed)
            this.$emit('change', valFixed)
        },
    },
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.profitLossBar {
    align-items: center;
    padding-top: 12px;
    color: var(--minorColor);
    line-height: 1.5;
    margin-bottom:6px;
}
.stepper {
    background: var(--assistColor);
    border: 1px solid var(--assistColor);
    width:100%;
    &:focus-within {
        border-color: var(--primary);
    }
    &.warn {
        color: var(--warn);
    }
    :deep(.input) {
        width: rem(180px);
        &::-webkit-input-placeholder {
            color: var(--placeholdColor);
        }
    }
}
:deep{
  .van-row{
    flex-direction:column;
  }
  .van-col{
    display:flex;
    flex-direction:row;
  }
}

</style>

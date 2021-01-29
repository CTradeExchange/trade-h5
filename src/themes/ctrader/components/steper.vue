<template>
    <div class='steper '>
        <span class='inputCol'><input class='input' type='text' :value='n' @input='onInput' /></span>
        <a class='icon icon_jian' href='javascript:;' @click='onMinus'></a>
        <a class='icon icon_jia' href='javascript:;' @click='onPlus'></a>
    </div>
</template>

<script>
export default {
    props: {
        modelValue: {
            type: [Number, String],
            default: ''
        },
    },
    data () {
        return {
            n: this.modelValue
        }
    },
    emits: ['update:modelValue'],
    watch: {
        modelValue (newval) {
            if (newval !== this.n) this.n = newval
        }
    },
    methods: {
        onPlus () {
            this.n = parseInt(this.n) + 1
            this.$emit('update:modelValue', this.n)
        },
        onMinus () {
            this.n = parseInt(this.n) - 1
            this.$emit('update:modelValue', this.n)
        },
        onInput ($event) {
            this.n = $event.target.value
            this.$emit('update:modelValue', this.n)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.steper {
    display: flex;
    align-items: center;
    width: 100%;
    margin-top: rem(10px);
    .inputCol {
        flex: 1;
        input {
            width: 100%;
        }
    }
    .icon {
        padding: rem(10px);
        color: var(--color);
        font-size: rem(38px);
    }
}
</style>

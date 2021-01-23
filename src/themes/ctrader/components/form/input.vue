<template>
    <div class='inputWrapper of-1px-bottom'>
        <input
            v-if='pwd'
            :id='id'
            v-model='val'
            class='input'
            v-bind='$attrs'
            required
            :type='pwdVisible ? "text" : "password"'
            @input='onInput'
        />
        <input
            v-else
            :id='id'
            v-model='val'
            class='input'
            v-bind='$attrs'
            required
            type='text'
            @input='onInput'
        />
        <label v-if='label' class='label' :for='id'>{{ label }}</label>
        <a v-if='clear' v-show='val.length' class='van-icon van-icon-clear' href='javascript:;' @click='onClear'></a>
        <a v-if='pwd' :class='[pwdVisible?"icon_icon_pressed":"icon_icon_default"]' href='javascript:;' @click='pwdVisible=!pwdVisible'></a>
    </div>
</template>

<script>
import { randomId } from '@/utils/util'
export default {
    props: {
        modelValue: {
            type: [String, Number],
            default: ''
        },
        label: {
            type: [String, Number],
            default: ''
        },
        clear: {
            type: Boolean,
            default: false
        },
        pwd: {
            type: Boolean,
            default: false
        },
    },
    emits: ['update:modelValue', 'input'],
    data () {
        return {
            val: this.modelValue,
            pwdVisible: false,
            id: this.$attrs.id || randomId()
        }
    },
    watch: {
        modelValue (newval) {
            if (newval !== this.val) this.val = newval
        }
    },
    methods: {
        onClear () {
            this.val = ''
            this.$emit('update:modelValue', '')
            this.$emit('input', '')
        },
        onInput ($event) {
            this.$emit('update:modelValue', $event.target.value)
            this.$emit('input', $event.target.value)
        },
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.inputWrapper{
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    padding-right: .8em;
}
.label{
    position: absolute;
    left: 5px;
    top: 0;
    height: rem(75px);
    line-height: rem(75px);
    color: var(--placeholder);
    font-size: rem(30px);
    transition: all cubic-bezier(.4,0,.2,1) .15s;
    &.active{
        transform: scale(.8) translateY(-90%);
    }
}
.input{
    flex: 1;
    padding: 0 5px;
    width: 100%;
    height: rem(75px);
    &:focus ~ .label,
    &:valid ~ .label{
        transform-origin: bottom left;
        transform: scale(.8) translateY(-90%);
    }
}
.van-icon-clear{
    color: var(--bdColor);
    font-size: rem(36px);
}
.icon_icon_default, .icon_icon_pressed{
    margin-left: .8em;
    color: var(--bdColor);
    font-size: rem(36px);
}
</style>

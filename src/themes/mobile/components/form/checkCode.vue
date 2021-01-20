<template>
    <div class='checkCodeBar of-1px-bottom'>
        <div class='checkCodeInput'>
            <input
                :id='id'
                class='input'
                required
                type='text'
                v-bind='$attrs'
                :value='modelValue'
                @input='onInput'
            />
            <label v-if='label' class='label' :for='id'>{{ label }}</label>
        </div>
        <a v-if='clear' v-show='modelValue.length' class='van-icon van-icon-clear' href='javascript:;' @click='onClear'></a>
        <button ref='getCodeBtn' class='getCodeBtn' :disabled='disabled' @click='getCode'>获取验证码</button>
        <!-- <div class='checkCodeBtn'>
            <van-button block :color='$store.state.style.primary' type='primary' @click="$emit('getCode')">获取验证码</van-button>
        </div> -->
    </div>
</template>

<script>
import { randomId } from '@/utils/util'
export default {
    props: {
        modelValue: {
            type: [Number, String],
            default: ''
        },
        zone: {
            type: [Number, String],
            default: ''
        },
        clear: {
            type: Boolean,
            default: false
        },
        label: {
            type: [String, Number],
            default: ''
        },
    },
    data () {
        return {
            value: '',
            id: this.$attrs.id || randomId(),
            disabled: false,
        }
    },
    emits: ['update:modelValue', 'update:zone', 'input'],
    methods: {
        onClear () {
            this.$emit('update:modelValue', '')
            this.$emit('input', '')
        },
        onInput ($event) {
            this.$emit('update:modelValue', $event.target.value)
            this.$emit('input', $event.target.value)
        },
        zoneOnSelect (item) {
            console.log(item)
            this.$emit('update:zone', item.value)
        },
        getCode () {
            this.getCodeBtnCountDown()
        },
        getCodeBtnCountDown () {
            const getCodeBtn = this.$refs.getCodeBtn
            const originText = getCodeBtn.textContent
            let len = 60
            this.disabled = true
            const t = setInterval(() => {
                if (len === 0) {
                    clearInterval(t)
                    getCodeBtn.innerText = originText
                    this.disabled = false
                    return
                }
                len--
                getCodeBtn.innerText = `${len}s`
            }, 1000)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.checkCodeBar{
    width: 100%;
    display: flex;
    align-items: center;
    .checkCodeInput{
        position: relative;
        flex: 1;
    }
    .getCodeBtn{
        margin-left: rem(20px);
        font-size: rem(26px);
        color: var(--primary);
        background: none;
        &:disabled{
            color: var(--bdColor);
        }
    }
}
.input{
    padding: 0 5px;
    width: 100%;
    height: rem(75px);
    &:focus ~ .label,
    &:valid ~ .label{
        transform-origin: bottom left;
        transform: scale(.8) translateY(-90%);
    }
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
.van-icon-clear{
    color: var(--bdColor);
    font-size: rem(36px);
}
</style>

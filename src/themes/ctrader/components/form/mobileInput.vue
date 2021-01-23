<template>
    <div class='mobileBar of-1px-bottom'>
        <div class='zone'>
            <VueSelect v-model='zoneVal' :actions='zoneList' text='name' value='value' @select='zoneOnSelect' />
        </div>
        <div class='inputWrapper'>
            <input
                :id='id'
                class='input'
                v-bind='$attrs'
                required
                type='tel'
                :value='modelValue'
                @input='onInput'
            />
            <label v-if='label' class='label' :for='id'>{{ label }}</label>
        </div>
        <a v-if='clear' v-show='modelValue.length' class='van-icon van-icon-clear' href='javascript:;' @click='onClear'></a>
    </div>
</template>

<script>
import VueSelect from '@ct/components/select'
import { mapState } from 'vuex'
import { randomId } from '@/utils/util'
export default {
    components: {
        VueSelect,
    },
    props: {
        modelValue: {
            type: [Number, String],
            default: ''
        },
        clear: {
            type: Boolean,
            default: false
        },
        zone: {
            type: [Number, String],
            default: ''
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
            zoneVal: this.zone,
        }
    },
    computed: {
        ...mapState(['zoneList'])
    },
    watch: {
        zone (newval) {
            if (newval !== this.zoneVal) this.zoneVal = newval
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
            this.$emit('update:zone', item.value)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.mobileBar{
    width: 100%;
    display: flex;
    align-items: center;
    &>div{
        flex: 1;
    }
    .zone{
        flex: none;
        // width: rem(220px);
        margin-right: rem(20px);
    }
}
.inputWrapper{
    position: relative;
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

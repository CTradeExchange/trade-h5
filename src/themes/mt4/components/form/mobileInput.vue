<template>
    <div class='mobileBar van-hairline--bottom'>
        <div class='zone'>
            <VueSelect v-model='zoneVal' :actions='zoneList' text='code' value='code' @select='zoneOnSelect' />
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
            <label v-if='label' class='label' :for='id'>
                {{ label }}
            </label>
        </div>
        <a v-if='clear' v-show='modelValue.length' class='van-icon van-icon-clear' href='javascript:;' @click='onClear'></a>
    </div>
</template>

<script>
import VueSelect from '@m/components/select'
import { mapState } from 'vuex'
import { randomId } from '@/utils/util'
export default {
    components: {
        VueSelect
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
        }
    },
    data () {
        return {
            value: '',
            id: this.$attrs.id || randomId(),
            zoneVal: this.zone
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
    emits: ['update:modelValue', 'update:zone', 'input', 'zoneSelect'],
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
            this.$emit('update:zone', item.code)
            this.$emit('zoneSelect', item.code)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.mobileBar {
    display: flex;
    align-items: center;
    width: 100%;
    &>div {
        flex: 1;
    }
    .zone {
        flex: none;
        // width: rem(220px);
        margin-right: rem(20px);
    }
}
.inputWrapper {
    position: relative;
}
.input {
    width: 100%;
    height: rem(75px);
    padding: 0 5px;
    &:focus~.label,
    &:valid~.label {
        transform: scale(0.8) translateY(-90%);
        transform-origin: bottom left;
    }
}
.label {
    position: absolute;
    top: 0;
    left: 5px;
    height: rem(75px);
    color: var(--placeholder);
    font-size: rem(30px);
    line-height: rem(75px);
    transition: all cubic-bezier(0.4, 0, 0.2, 1) 0.15s;
    &.active {
        transform: scale(0.8) translateY(-90%);
    }
}
.van-icon-clear {
    color: var(--bdColor);
    font-size: rem(36px);
}
:deep(.selectWrap) {
    min-width: rem(150px);
    margin-right: rem(20px);
    .icon_arrow-down {
        right: rem(25px);
    }
    &::after {
        position: absolute;
        top: 50%;
        right: 0;
        width: 1px;
        height: rem(50px);
        margin-top: rem(-25px);
        background: var(--bdColor);
        content: '';
    }
}
</style>

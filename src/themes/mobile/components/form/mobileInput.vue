<template>
    <div class='mobileBar'>
        <div class='zone'>
            <VueSelect v-model='zoneVal' :actions='zoneList' text='name' value='value' @select='zoneOnSelect' />
        </div>
        <div>
            <input class='input' type='text' v-bind='$attrs' :value='modelValue' @input='onInput' />
        </div>
    </div>
</template>

<script>
import VueSelect from '@m/components/select'
import { mapState } from 'vuex'
export default {
    components: {
        VueSelect,
    },
    props: {
        modelValue: {
            type: [Number, String],
            default: ''
        },
        zone: {
            type: [Number, String],
            default: ''
        },
    },
    data () {
        return {
            value: '',
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
        onInput ($event) {
            this.$emit('update:modelValue', $event.target.value)
            this.$emit('input', $event.target.value)
        },
        zoneOnSelect (item) {
            console.log(item)
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
    &>div{
        flex: 1;
    }
    .zone{
        flex: none;
        width: rem(240px);
        margin-right: rem(20px);
    }
}
.input{
    padding: 0 5px;
    width: 100%;
    height: rem(75px);
    border-radius: rem(10px);
    border: 1px solid var(--bdColor);
}
</style>

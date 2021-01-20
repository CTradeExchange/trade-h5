<template>
    <div class='selectWrap'>
        <p v-if='label' class='label'>{{ label }}</p>
        <span class='selectval' @click='show=true'>{{ selected && selected[text] }}</span>
    </div>
    <van-action-sheet v-if='actions && actions.length' v-model:show='show' :actions='actions' @select='onSelect' />
</template>

<script>

export default {
    props: {
        modelValue: {
            type: [String, Number],
            default: ''
        },
        label: {
            type: String,
            default: ''
        },
        actions: {
            type: Array,
            default: new Array(0)
        },
        text: {
            type: String,
            default: 'name'
        },
        value: {
            type: String,
            default: 'value'
        },
    },
    emits: ['update:modelValue', 'select'],
    data () {
        return {
            show: false,
        }
    },
    computed: {
        selected () {
            const field = this.value
            return this.actions.find(el => el[field] === this.modelValue)
        }
    },
    methods: {
        onSelect (item, index) {
            // console.log(item, index)
            this.$emit('select', item, index)
            this.$emit('update:modelValue', item[this.value])
            this.show = false
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.selectWrap{
    width: 100%;
    display: inline-block;
}
.label{
    font-size: rem(26px);
    margin-bottom: rem(10px);
    text-indent: rem(15px);
}
.selectval{
    position: relative;
    display: block;
    height: rem(75px);
    line-height: rem(75px);
    padding: 0 rem(60px) 0 rem(15px);
    font-size: rem(26px);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    border-radius: rem(10px);
    border: 1px solid var(--bdColor);
    &:not(:disabled){
        @include active();
    }
    &::after{
        content: '';
        position: absolute;
        right: rem(20px);
        top: rem(25px);
        width: 0;
        height: 0;
        border-radius: 6px;
        border: 6px solid var(--bdColor);
        border-color: var(--bdColor) transparent transparent transparent;
        border-width: 8px 8px 0 8px;
    }
}
</style>

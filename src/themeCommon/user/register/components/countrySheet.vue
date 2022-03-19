<template>
    <van-action-sheet v-model:show='show' :actions='actions' @select='onSelect' />
</template>

<script>
import { computed } from 'vue'
export default {
    props: {
        modelValue: Boolean,
        text: {
            type: String,
            default: 'name'
        },
        data: {
            type: Array,
            default () {
                return []
            }
        }
    },
    emits: ['update:modelValue', 'select'],
    setup (props, { emit }) {
        const show = computed({
            get: () => props.modelValue,
            set: val => emit('update:modelValue', val)
        })
        const actions = computed(() => {
            return props.data.map(el => {
                return {
                    ...el,
                    name: el[props.text]
                }
            })
        })

        const onSelect = item => {
            emit('select', item)
            emit('update:modelValue', false)
        }

        return {
            show,
            actions,
            onSelect,
        }
    }
}

</script>

<style lang="scss" scoped>

</style>

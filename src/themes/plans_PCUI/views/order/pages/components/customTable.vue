<template>
    <el-table
        v-if='isMounted'
        v-loading='loading'
        v-bind='tableAttrs'
        class='table'
        :data='props.data'
    >
        <template v-for='(col, i) in props.options.columns' :key='i'>
            <template v-if='getIf(col, "if")'>
                <!-- 有slots -->
                <template v-if='col.slots'>
                    <el-table-column v-bind='getColumnAttrs(col)' :formatter='getFormatter(col)' :label='col.name' :prop='col.prop'>
                        <template v-if='col.slots?.default' #default='scope'>
                            <component :is='col.slots.default' v-bind='scope' />
                        </template>
                        <template v-if='col.slots?.header' #header='scope'>
                            <component :is='col.slots.header' v-bind='scope' />
                        </template>
                    </el-table-column>
                </template>
                <!-- 无slots -->
                <el-table-column v-else v-bind='getColumnAttrs(col)' :formatter='getFormatter(col)' :label='col.name' :prop='col.prop' />
            </template>
        </template>
    </el-table>
</template>

<script setup>
import { watch, ref, nextTick, computed } from 'vue'
const props = defineProps({
    options: {
        type: Object,
        default: () => ({})
    },
    data: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    },
    rawResponse: {
        type: Object,
        default: () => ({})
    },
})

// 获取指令v-if
const getIf = (row) => {
    const val = row.directives?.if
    if (typeof val === 'function') {
        return val(row)
    }
    if (val === undefined) return true
    return val
}

const isMounted = ref(true)
// table属性
const tableAttrs = computed(() => {
    const temp = { ...props.options }
    delete temp.columns
    return temp
})

// 获取列属性
const getColumnAttrs = col => {
    const temp = { ...col }
    delete temp.directives
    delete temp.formatter
    return temp
}

const getFormatter = col => col.formatter ? (...args) => col.formatter(...args, props.rawResponse) : undefined

watch(() => [props.options, props.data], async () => {
    isMounted.value = false
    await nextTick()
    isMounted.value = true
})
</script>

<style lang="scss" scoped>
.table{
    width: 100%;
}
</style>

<template>
    <div class='customTable'>
        <el-table
            v-loading='loading'
            v-bind='tableAttrs'
            :data='props.data'
        >
            <template v-for='(col, i) in props.options.columns' :key='i'>
                <template v-if='getIf(col, "if")'>
                    <!-- 有slots -->
                    <template v-if='col.slots'>
                        <el-table-column v-bind='getColumnAttrs(col)' :formatter='getFormatter(col)' :label='col.name' :prop='col.prop'>
                            <template v-if='col.slots?.default' #default='scope'>
                                <component :is='col.slots.default' v-bind='scope' @getComponentRefs='getComponentRefs' />
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
        <!-- 分页 -->
        <el-pagination
            v-if='props.pagination'
            v-model:currentPage='current'
            class='pagination'
            :hide-on-single-page='true'
            layout='prev, pager, next'
            :page-count='props.pagination.pageCount'
            :page-size='props.pagination.pageSize'
        />
        <slot name='dependencies'></slot>
    </div>
</template>

<script setup>
import { watch, ref, nextTick, computed } from 'vue'
import { ElPagination } from 'element-plus'
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
    pagination: {
        type: Object,
        default: () => null
    },
    currentPage: {
        type: [String, Number],
        default: 1
    },
    componentRefs: {
        type: Object,
        default: () => ({})
    }
})

const emit = defineEmits(['update:currentPage'])

// 提供table依赖的组件引用ref
const getComponentRefs = () => {
    return props.componentRefs
}
// 获取指令v-if
const getIf = (row) => {
    const val = row.directives?.if
    if (typeof val === 'function') {
        return val(row)
    }
    if (val === undefined) return true
    return val
}

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

const getFormatter = col => col.formatter ? (...args) => col.formatter(...args, props.rawResponse) : (row, column) => {
    const value = row[column.property]
    return [undefined, null].includes(value) ? '- -' : value
}

const current = computed({
    get: () => props.currentPage,
    set: (val) => emit('update:currentPage', val)
})

</script>

<style lang="scss" scoped>
.customTable{
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    width: 100%;
    .pagination{
        margin: 10px 0;
    }
}
</style>

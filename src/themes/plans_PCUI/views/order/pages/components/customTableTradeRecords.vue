<template>
    <div class='customTable'>
        <el-table
            v-loading='loading'
            v-bind='tableAttrs'
            :data='props.data'
            row-class-name='tradeRecords'
            v-on='tableEvents'
        >
            <template v-for='(col, i) in props.options.columns' :key='i'>
                <template v-if='getIf(col, "if")'>
                    <!-- 有slots -->
                    <template v-if='col.slots'>
                        <el-table-column v-bind='getColumnAttrs(col)' class='course-date' :formatter='getFormatter(col)' :label='col.name' :prop='col.prop'>
                            <template v-if='col.slots?.default' #default='scope'>
                                <div class='sj'>
                                    <img v-if='!!tradeData[scope.row.symbolId] && !!tradeData[scope.row.symbolId].num' alt='' class='sj-img' src='@/assets/newUI/matter.png' @click.stop='handleOpen(scope.row)' />
                                    <div v-if='!!tradeData[scope.row.symbolId] && !!tradeData[scope.row.symbolId].num' class='sj-text' @click.stop='handleOpen(scope.row)'>
                                        {{ tradeData[scope.row.symbolId].num }}
                                    </div>
                                    <component :is='col.slots.default' v-bind='scope' @getComponentRefs='getComponentRefs' />
                                </div>
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
            <template #empty>
                <span class='emptyText'>
                    {{ $t('c.noData') }}
                </span>
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
        <newsItemDialog
            :trade-i-d='state.tradeID'
            :visibles='state.visibles'
            @close='state.visibles = false'
        />
    </div>
</template>

<!-- 动态修改options会导致字段错乱，宜在外层通过if重新执行 -->
<script setup>
import { nextTick, computed, reactive } from 'vue'
import { ElPagination } from 'element-plus'
import newsItemDialog from '@/themes/plans_PCUI/components/newsItemDialog.vue'
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
    },
    tradeData: {
        type: Object,
        default: {}
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
    const temp = { }
    Object.keys(props.options)
        .forEach((key) => {
            if (!key.includes('@') && key !== 'columns') {
                temp[key] = props.options[key]
            }
        })
    return temp
})
const tableEvents = computed(() => {
    const temp = { }
    Object.keys(props.options)
        .forEach((key) => {
            if (key.includes('@')) {
                temp[key.substring(1)] = props.options[key]
            }
        })
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
    return [undefined, null].includes(value) ? '--' : value
}

const current = computed({
    get: () => props.currentPage,
    set: (val) => emit('update:currentPage', val)
})

const state = reactive({
    visibles: false,
    tradeID: null,
})

const handleOpen = (row) => {
    state.tradeID = props.tradeData[row?.symbolId]?.id
    state.visibles = true
}

</script>

<style lang="scss" scoped>
.customTable{
    // display: flex;
    // flex-direction: column;
    // align-items: flex-end;
    width: 100%;
    height: 100%;
    .pagination{
        margin: 10px 0;
    }
    :deep{
        .el-table{
            .el-table__body-wrapper{
                scrollbar-width: thin;
            }
            background-color: var(--contentColor);
            th.el-table__cell{
                color: var(--minorColor);
                font-weight: 400;
                font-size: 13px;
                border-color: var(--assistColor);
            }
            td.el-table__cell{
                border-color: var(--assistColor);
                color: var(--color);
                font-size: 14px;
                padding: 8px 0;
                .cell{
                    white-space: nowrap;
                }
            }

            tr {
                background-color: var(--contentColor);
            }

            tr:hover, tr.hover-row, tr.hover-row:hover {
                background-color: var(--bgColor);
            }

            tr.hover-row>td.el-table__cell{
                background: none;
            }

            .chunk {
                display: inline-flex;
                align-items: center;
            }
            .pointer{
                cursor: pointer;
                &:hover{
                    color: var(--color);
                }
            }
        }
        .el-pagination{
            justify-content: flex-end;
        }
        .el-pagination{
            .btn-prev,
            .btn-next,
            .number{
                background-color: var(--contentColor);
                color: var(--color);
            }
            .active.number{
                color: var(--el-pagination-hover-color);
            }
            .number:hover{
                color: var(--el-pagination-hover-color);
            }
        }
        .empty{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .image{
                width: 160px;
                height: auto;
            }
        }

        .emptyText{
            display: inline-block;
            width: 160px;
            padding-top: 140px;
            background: url('/images/empty.png') center top no-repeat;
            background-size: 160px auto;
            color: var(--placeholdColor);
        }
    }

}
.sj {
    position: relative;
    display: flex;
    align-items: center;
    width: min-content;
    margin-left: auto;
    .sj-img {
        width: 20px;
        height: 22px;
        margin-right: 20px;
    }
    .sj-text {
        text-align: center;
        min-width: 16px;
        height: 16px;
        line-height: 16px;
        font-size: 12px;
        background: var(--primary);
        padding: 0px 1px;
        color: var(--contentColor);
        border-radius: 4px;
        position: absolute;
        left: 14px;
        top: 0;
    }
}
</style>

<style lang="scss">
.multipleVal{
    cursor: pointer;
    margin-left: 10px;
    display: inline-block;
    vertical-align: middle;
    position: relative;
    height: 20px;
    line-height: 20px;
    padding-right: 5px;
    padding-left: 4px;
    font-size: 12px;
    color: var(--color);
    border-radius: 3px;
    border: 1px solid var(--color);
    &.marginleft0{
        margin-left: 0;
    }
    &.arrow{
        padding-right: 25px;
        color: var(--color);
    }

    .icon_icon_arrow{
        font-size: 12px;
        margin-left: 3px;
    }
}
</style>

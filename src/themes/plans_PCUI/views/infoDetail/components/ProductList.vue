<template>
    <div class='productList'>
        <customTable
            v-model:currentPage='currentPage'
            :data='computedList'
            :options='tableOptions'
            :pagination='pagination'
            :trade-data='tradeItem'
        />
    </div>
</template>

<script setup>
import { computed, ref, unref, onMounted } from 'vue'
import customTable from './CustomTable.vue'
import { getColumns } from './tableConfig.js'
import { useRouter } from 'vue-router'
import { getCookie, parseJSON } from '@/utils/util'
import { GetTrade } from '@/api/newApi.js'

const props = defineProps({
    list: {
        type: Array,
        default: () => []
    },
    tradeType: {
        type: [String, Number],
        default: ''
    }
})
const router = useRouter()

const tableOptions = computed(() => ({
    columns: getColumns(props.tradeType),
    // height: '100%',
    '@rowClick': row => {
        router.push({
            name: 'Order',
            query: {
                name: row?.symbolName?.replace(/ /g, '_'),
                symbolId: row.symbolId,
                tradeType: row.tradeType
            }
        })
    }
}))

const tradeObj = ref({})
onMounted(() => {
    GetTrade({
        body: {
            Limit: -1,
            Language: getCookie('lang')
        }
    }).then(res => {
        const objs = {}
        res.List.forEach(i => {
            const { SymbolId } = parseJSON(i.Extra) || {}
            if (SymbolId) {
                objs[SymbolId] = {
                    num: i.ItemCount,
                    id: i.ID
                }
            }
        })
        tradeObj.value = objs
    })
})
const tradeItem = computed(() => tradeObj.value)
// 分页
const currentPage = ref(1)
const size = 20
const pagination = computed(() => {
    return {
        pageSize: size,
        pageCount: Math.ceil(props.list.length / size)
    }
})
const computedList = computed(() => {
    return props.list.slice((unref(currentPage) - 1) * size, unref(currentPage) * size)
})

</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.productList {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 0 12px;
    overflow: hidden;
    :deep {
        .el-table__row {
            cursor: pointer;
        }
        .el-table td.el-table__cell {
            padding: 12px 0;
        }
        .el-table__empty-block {
            margin-top: 80px;
        }
        .star {
            align-self: self-start;
            margin-right: 5px;
            cursor: pointer;
        }
        // tbody td.el-table__cell.primaryText{
        //     color: var(--primary);
        // }
        .btn {
            @include hover();
            position: relative;
            z-index: 0;
            display: inline-block;
            width: 80px;
            height: 28px;
            margin-right: 10px;
            overflow: hidden;
            color: var(--primary);
            font-weight: 400;
            font-size: 14px;
            line-height: 28px;
            text-align: center;
            vertical-align: middle;
            border: 1px solid var(--primary);
            border-radius: 4px;
            cursor: pointer;
            &.active {
                color: #FFF;
                background: var(--primary);
            }
            &:last-child {
                margin-right: 0;
            }
            &:hover {
                color: #FFF;
                background: var(--primary);
            }
        }
    }

}

</style>

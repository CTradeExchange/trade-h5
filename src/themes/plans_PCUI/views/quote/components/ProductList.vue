<template>
    <div class='productList' :style='{ minHeight: contentHeight + "px" }'>
        <customTable
            v-model:currentPage='currentPage'
            :data='computedList'
            :options='tableOptions'
            :pagination='pagination'
        />
    </div>
</template>

<script setup>
import { watch, computed, ref, unref, onUnmounted } from 'vue'
import customTable from '@planspc/views/order/pages/components/customTable.vue'
import { getColumns } from './tableConfig.js'
import { QuoteSocket } from '@/plugins/socket/socket'
import { useRouter } from 'vue-router'

const props = defineProps({
    list: {
        type: Array,
        default: () => []
    },
    tradeType: {
        type: String,
        default: ''
    }
})
const router = useRouter()
const contentHeight = document.body.offsetHeight - 342
const tableOptions = computed(() => ({
    columns: getColumns(props.tradeType),
    // height: '100%',
    '@rowClick': row => {
        router.push({
            name: 'Order',
            query: {
                symbolId: row.symbolId,
                tradeType: row.tradeType
            }
        })
    }
}))

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
    console.log(props.list.slice((unref(currentPage) - 1) * size, unref(currentPage) * size))
    return props.list.slice((unref(currentPage) - 1) * size, unref(currentPage) * size)
})
const moduleId = 'quote_' + Date.now()
let unSubscribe = () => {}

watch(() => unref(computedList), () => {
    const symbolKeys = unref(computedList).map(e => e.symbolKey)
    unSubscribe = QuoteSocket.add_subscribe({ moduleId, symbolKeys })
}, {
    immediate: true
})

onUnmounted(() => {
    unSubscribe()
})

</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';

.productList{
    width: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    padding: 0 12px;
    :deep{
        .el-table__row{
            cursor: pointer;
        }
        .el-table td.el-table__cell{
            padding: 12px 0;
        }
        .el-table__empty-block{
            margin-top: 80px;
        }
        .star{
            cursor: pointer;
            margin-right: 5px;
            align-self: self-start;
        }
        tbody td.el-table__cell.primaryText{
            color: var(--primary);
        }
        .btn{
            @include hover();
            position: relative;
            z-index: 0;
            display: inline-block;
            width: 80px;
            color: var(--primary);
            border: 1px solid var(--primary);
            height: 30px;
            line-height: 28px;
            border-radius: 4px;
            text-align: center;
            margin-right: 10px;
            font-size: 14px;
            font-weight: 400;
            vertical-align: middle;
            cursor: pointer;
            overflow: hidden;
            &.active {
                color: #fff;
                background: var(--primary);
            }
            &:last-child{
                margin-right: 0;
            }
            &:hover{
                color: #fff;
                background: var(--primary);
            }
        }
    }
}

</style>

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
        .el-table__empty-block{
            margin-top: 80px;
        }
        .star{
            cursor: pointer;
            margin-right: 5px;
        }
        .btn{
            position: relative;
            z-index: 0;
            display: inline-block;
            width: 80px;
            color: #fff;
            height: 32px;
            line-height: 32px;
            border-radius: 4px;
            text-align: center;
            font-size: 16px;
            font-weight: 400;
            cursor: pointer;
            overflow: hidden;
            &::before{
                position: absolute;
                top: 0;
                left: 0;
                z-index: -1;
                width: 100%;
                height: 100%;
                display: block;
                content: '';
                background: var(--riseColor);
            }

            &:last-child{
                margin-left: 20px;
                &::before{
                    background: var(--fallColor);
                }
            }

            &:hover{
                &::before{
                    opacity: 0.7;
                }
            }
        }
    }
}

</style>

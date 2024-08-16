<template>
    <div class='titleBar'>
        <span class='item' @click='sortHandler("symbolName")'>
            {{ $t('trade.nameCode') }}
            <SortIcon name='symbolName' :sort-field='sortField' :sort-type='sortType' />
        </span>
        <span class='item' @click='sortHandler("rolling_last_price")'>
            {{ $t('trade.newPrice') }}
            <SortIcon name='rolling_last_price' :sort-field='sortField' :sort-type='sortType' />
        </span>
        <span class='item' @click='sortHandler("rolling_upDownWidth")'>
            {{ $t('trade.changePercent') }}
            <SortIcon name='rolling_upDownWidth' :sort-field='sortField' :sort-type='sortType' />
        </span>
        <!-- <span class='item'>
            {{ $t('trade.operating') }}
        </span> -->
    </div>
</template>

<script>
import { localSet } from '@/utils/util.js'
import SortIcon from '@plans/components/sortIcon.vue'

export default {
    components: {
        SortIcon
    },
    props: {
        // 排序字段
        sortField: {
            type: String,
            default: ''
        },
        // 排序方式
        sortType: {
            type: String,
            default: ''
        }
    },
    setup (props, { emit }) {
        const sortHandler = (field) => {
            let sortType = ''
            if (props.sortField === field) {
                switch (props.sortType) {
                    case 'asc':
                        sortType = 'desc'
                        break
                    case 'desc':
                        sortType = ''
                        break
                    default:
                        sortType = 'asc'
                }
            } else {
                sortType = 'asc'
            }
            emit('changeSortType', sortType)
            localSet('productListSortType', sortType)
            emit('changeSortField', sortType ? field : '')
            localSet('productListSortField', sortType ? field : '')
        }

        return {
            sortHandler
        }
    }

}
</script>

<style lang="scss" scoped>

.titleBar {
    display: flex;
    height: 48px;
    padding: 0 20px;
    color: var(--minorColor);
    font-size: 14px;
    background-color: var(--colorf4);
    align-items: center;
    .item {
        flex:1;
        &:nth-of-type(1){
            text-align: left;
        }
        &:nth-of-type(2){
            text-align: center;
        }
        &:nth-of-type(3){
            text-align: right;
        }
        &:nth-of-type(4){
            text-align: right;
        }

    }
}
</style>

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
        <span v-if='showTrade' class='item'>
            {{ $t('information.event' ) }}
        </span>
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
        },
        showTrade: {
            type: Boolean,
            default: true
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
.titleBarCell {
    display: flex;
    align-items: center;
    height: rem(62px);
    background: var(--colorfa);
    padding: 0 rem(20px);
    .item {
        display: flex;
        align-items: center;

        &:nth-of-type(1){
            flex:1;
        }
        &:nth-of-type(2){
            width: rem(200px);
        }
        &:nth-of-type(3){
            width: rem(200px);
        }
    }
}
.titleBar {
    display: flex;
    height: rem(60px);
    padding: 0 rem(30px);
    color: var(--minorColor);
    font-size: rem(20px);
    line-height: rem(60px);
    background-color: var(--colorfa);
    &::after {
        border-color: var(--bgColor);
    }
    .item {
        text-align:center;
        &:nth-of-type(1) {
            flex: 1;
            text-align: left;
        }
        &:nth-of-type(2), &:nth-of-type(3){
            width: rem(200px);
        }
        &:nth-of-type(4){
            width: rem(76px);
        }
    }
}
</style>

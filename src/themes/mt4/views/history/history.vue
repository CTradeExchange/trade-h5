<template>
    <Top>
        <template #right>
            <a class='icon icon_paixu' href='javascript:;' @click='sortActionsVisible = true'></a>
            <a class='icon icon_rili' href='javascript:;' @click='timeActionsVisible = true'></a>
        </template>
    </Top>
    <div class='container'>
        <!-- <CapitalList class='of-1px-bottom' :data='capitalListData' /> -->
        <!-- <Balance /> -->
        <HistoryList :finished='finished' :loading='loading' @onLoad='onLoad' />
    </div>

    <!-- 排序 actionsheet -->
    <van-action-sheet v-model:show='sortActionsVisible' :actions='sortActions' cancel-text='取消' @select='actionSheetOnSelect' />
    <!-- 查询时间 actionsheet -->
    <van-action-sheet v-model:show='timeActionsVisible' :actions='timeActions' cancel-text='取消' class='timeActions' @select='timeActionSheetOnSelect' />
    <!-- 日历 -->
    <van-calendar v-model:show='calendarVisible' :max-date='maxDate' :min-date='minDate' type='range' @confirm='calendarOnConfirm' />
</template>

<script>
import { reactive, toRefs, computed } from 'vue'
import { useStore } from 'vuex'
import Top from '@m/layout/top'
import CapitalList from '@m/components/capitalList'
import Balance from './balance'
import HistoryList from '@m/modules/historyList/historyList'
import dayjs from 'dayjs'
import { timeActions } from './historyUtil'
export default {
    components: {
        Balance,
        CapitalList,
        HistoryList,
        Top
    },
    setup () {
        const store = useStore()
        const sortActionsUp = 'van-badge__wrapper van-icon van-icon-down up'
        const sortActionsDown = 'van-badge__wrapper van-icon van-icon-down '
        const sortActions = [
            { name: '收盘时间', feild: 'closeTime', className: sortActionsDown },
            { name: '开盘时间', feild: 'openTime' },
            { name: '交易品种', feild: 'symbolId' },
            { name: '订单', feild: 'orderId' },
            { name: '利润', feild: 'pnl' },
        ]

        let sortFieldName = sortActions[0].feild
        let current = 1
        let sortType = 'desc' // desc 降序；asc 升序
        let startTime
        let endTime
        const orderList = computed(() => store.state._trade.historyList)
        const capitalListData = computed(() => {
            return [
                { title: '利润：', value: orderList?.value?.totalPnl },
                { title: '入金：', value: '1000000.00' },
                { title: '结余：', value: '1000000.00' }
            ]
        })
        const state = reactive({
            calendarVisible: false,
            minDate: new Date(2021, 1, 1),
            maxDate: new Date(),
            timeActionsVisible: false,
            sortActionsVisible: false,
            loading: false,
            finished: false,
            sortActions,
            timeActions
        })
        // 选择排序方式
        const actionSheetOnSelect = item => {
            if (item.className && sortType === 'desc') {
                sortType = 'asc'
                item.className = sortActionsUp
            } else if (item.className && sortType === 'asc') {
                sortType = 'desc'
                item.className = sortActionsDown
            } else {
                sortActions.forEach(el => (el.className = ''))
                item.className = sortActionsDown
                sortFieldName = item.feild
            }
            state.sortActionsVisible = false
            current = 1
            queryRecordList()
        }
        // 选择日期查询方式
        const timeActionSheetOnSelect = item => {
            if (item.startTime) {
                startTime = item.startTime
                endTime = item.endTime
                current = 1
                queryRecordList()
            } else {
                state.calendarVisible = true
            }
            state.timeActionsVisible = false
        }
        // 选择日期
        const calendarOnConfirm = ([start, end]) => {
            startTime = dayjs(start).startOf('day').valueOf()
            endTime = dayjs(end).endOf('day').valueOf()
            current = 1
            queryRecordList()
            state.calendarVisible = false
        }

        // 查询平仓历史记录列表
        const queryRecordList = () => {
            state.loading = true
            store.dispatch('_trade/queryHistoryCloseOrderList', {
                current,
                size: 20,
                sortType: sortType,
                sortFieldName: sortFieldName,
                executeStartTime: startTime,
                executeEndTime: endTime
            }).then(res => {
                if (res.check() && res.data) {
                    const data = res.data
                    state.loading = false
                    if (res.data.list.length === 0) {
                        state.finished = true
                    }
                }
            }).catch(() => {
                state.loading = false
            })
        }
        queryRecordList()

        // 加载更多
        const onLoad = () => {
            current++
            queryRecordList()
        }

        return {
            ...toRefs(state),
            capitalListData,
            actionSheetOnSelect,
            timeActionSheetOnSelect,
            calendarOnConfirm,
            onLoad,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.container {
    flex: 1;
    margin-bottom: rem(100px);
    overflow-y: auto;
}
.icon {
    color: var(--white);
    font-size: 1.4em;
    &:not(:first-of-type) {
        margin-left: 0.6em;
    }
}
:deep(.van-icon-down) {
    &::before {
        content: '';
    }
    &::after {
        display: inline-block;
        margin-left: 5px;
        vertical-align: -2px;
        content: '\F04B';
    }
    &.up::after {
        transform: rotate(180deg);
    }
}
:deep(.timeActions) {
    .van-action-sheet__subname {
        display: inline-block;
        margin-top: 0;
        margin-left: 10px;
        vertical-align: middle;
    }
}
</style>

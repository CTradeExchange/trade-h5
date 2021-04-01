<template>
    <div>
        <Top>
            <template #right>
                <a class="icon icon_paixu" href="javascript:;" @click="sortActionsVisible = true"></a>
                <a class="icon icon_rili" href="javascript:;" @click="timeActionsVisible = true"></a>
            </template>
        </Top>
        <CapitalList class="of-1px-bottom" :data="capitalListData" />
        <Balance />
        <HistoryList />

        <!-- 排序 actionsheet -->
        <van-action-sheet v-model:show="sortActionsVisible" :actions="sortActions" cancel-text="取消" @select="actionSheetOnSelect" />
        <!-- 查询时间 actionsheet -->
        <van-action-sheet v-model:show="timeActionsVisible" :actions="timeActions" cancel-text="取消" class="timeActions" @select="timeActionSheetOnSelect" />
        <!-- 日历 -->
        <van-calendar v-model:show="calendarVisible" :max-date="maxDate" :min-date="minDate" type="range" @confirm="calendarOnConfirm" />
    </div>
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
    setup() {
        const store = useStore()
        const sortActionsUp = 'van-badge__wrapper van-icon van-icon-down up'
        const sortActionsDown = 'van-badge__wrapper van-icon van-icon-down '
        const sortActions = [
            { name: '收盘时间', feild: 'execute_time', className: sortActionsDown },
            { name: '开盘时间', feild: 'time' },
            { name: '交易品种', feild: 'symbol' },
            { name: '订单', feild: 'order' },
            { name: '利润', feild: 'pnl' },
        ]

        let sortFieldName = sortActions[0].feild
        let current = 1
        let sortType = 'desc'   // desc 降序；asc 升序
        let startTime = undefined
        let endTime = undefined
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
            sortActions,
            timeActions,
            recordList: []
        })
        // 选择排序方式
        const actionSheetOnSelect = item => {
            if(item.className && sortType==='desc'){
                sortType = 'asc'
                item.className = sortActionsUp
            }else if(item.className && sortType==='asc'){
                sortType = 'desc'
                item.className = sortActionsDown

            }else{
                sortActions.forEach(el => (el.className = ''))
                item.className = sortActionsDown
                sortFieldName = item.feild
            }
            state.sortActionsVisible = false
            queryRecordList()
        }
        // 选择日期查询方式
        const timeActionSheetOnSelect = item => {
            if (item.startTime) {
                startTime = item.startTime
                endTime = item.endTime
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
            queryRecordList()
            state.calendarVisible = false
        }

        // 查询平仓历史记录列表
        const queryRecordList = ()=>{
            store.dispatch('_trade/queryHistoryCloseOrderList', {
                current,
                size:20,
                sortType:sortType,
                sortFieldName: sortFieldName,
                executeStartTime: startTime,
                executeEndTime: endTime
            })
        }
        queryRecordList();

        return {
            ...toRefs(state),
            capitalListData,
            actionSheetOnSelect,
            timeActionSheetOnSelect,
            calendarOnConfirm
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
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

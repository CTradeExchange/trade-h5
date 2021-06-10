<template>
    <Top>
        <template #right>
            <a class='icon icon_paixu' href='javascript:;' @click='sortActionsVisible = true'></a>
            <a class='icon icon_rili' href='javascript:;' @click='timeActionsVisible = true'></a>
        </template>
    </Top>
    <div class='container'>
        <Loading :show='loading' />
        <!-- <CapitalList class='of-1px-bottom' :data='capitalListData' /> -->
        <!-- <Balance /> -->
        <HistoryList :finished='finished' :loading='loading' @onLoad='onLoad' />
    </div>
    <!-- 排序 actionsheet -->
    <van-action-sheet v-model:show='sortActionsVisible' :cancel-text="$t('cancel')" class='sort-action-wrap'>
        <div v-for='(item,index) in sortActions' :key='index' class='action-item' @click='actionSheetOnSelect(item)'>
            <span> {{ item.name }} </span>
            <i class='icon arrow' :class='item.className'></i>
        </div>
    </van-action-sheet>
    <!-- 查询时间 actionsheet -->
    <van-action-sheet v-model:show='timeActionsVisible' :actions='timeActions' :cancel-text="$t('cancel')" class='timeActions' @select='timeActionSheetOnSelect' />
    <!-- 日历 -->
    <van-calendar
        v-model:show='calendarVisible'
        :allow-same-day='true'
        :max-date='maxDate'
        :min-date='minDate'
        type='range'
        @confirm='calendarOnConfirm'
    />
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
import { useI18n } from 'vue-i18n'
export default {
    components: {
        Balance,
        CapitalList,
        HistoryList,
        Top
    },
    setup () {
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const sortActionsUp = 'van-badge__wrapper icon icon_paixujiantouxiangshang arrow'
        const sortActionsDown = 'van-badge__wrapper van-icon icon_paixujiantouxiangxia arrow'
        const sortActions = [
            { name: t('history.closeTime'), feild: 'closeTime', className: sortActionsDown },
            { name: t('history.openTime'), feild: 'openTime' },
            { name: t('history.tradeProducts'), feild: 'symbolId' },
            { name: t('history.order'), feild: 'orderId' },
            { name: t('history.lirun'), feild: 'pnl' },
        ]

        let sortFieldName = sortActions[0].feild
        let current = 1
        let sortType = 'desc' // desc 降序；asc 升序
        let startTime
        let endTime
        const orderList = computed(() => store.state._trade.historyList)
        const capitalListData = computed(() => {
            return [
                { title: t('history.lirun') + t('colon'), value: orderList?.value?.totalPnl },
                { title: t('depositText') + t('colon'), value: '1000000.00' },
                { title: t('balance') + t('colon'), value: '1000000.00' }
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
                sortType = 'desc'
                sortFieldName = item.feild
            }
            state.sortActionsVisible = false
            current = 1
            queryRecordList()
        }
        // 选择日期查询方式
        const timeActionSheetOnSelect = item => {
            state.finished = false
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
            state.finished = false
            queryRecordList()
            state.calendarVisible = false
        }

        // 查询平仓历史记录列表
        const queryRecordList = () => {
            state.loading = true
            const params = {
                current,
                size: 20,
                sortType: sortType,
                sortFieldName: sortFieldName
            }
            if (sortFieldName === 'closeTime') {
                params.closeStartTime = startTime
                params.closeEndTime = endTime
            } else {
                params.openStartTime = startTime
                params.openEndTime = endTime
            }

            store.dispatch('_trade/queryHistoryCloseOrderList', params).then(res => {
                if (res.check() && res.data) {
                    const data = res.data
                    state.loading = false
                    if (data.list.length === 0 || data.current >= data.totalPage) {
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
            onLoad
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
.sort-action-wrap {
    .action-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: rem(32px) rem(36px);
        font-size: 16px;
        line-height: rem(40px);
        border-bottom: solid 1px var(--bdColor);
        span {
            vertical-align: middle;
        }
        .arrow {
            vertical-align: middle;
            &::before {
                color: #409DFF;
                font-size: rem(28px);
            }
        }
    }
}
</style>

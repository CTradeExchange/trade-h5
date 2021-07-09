<template>
    <div class='page-wrap'>
        <LayoutTop :menu='false' :title='$t("route.trade")'>
            <template #left>
                <span></span>
            </template>
            <template #right>
                <div v-if='$store.state._user.customerInfo' class='assetIcon adequate' @click='fundVis=true'>
                    <i class='icon_icon_assets'></i>
                    <div class='other'>
                        <span> {{ $t('trade.asset') }} </span>
                    </div>
                </div>
            </template>
        </LayoutTop>

        <div class='m-subtab'>
            <van-tabs v-model:active='active' type='card' @click='triggerTab'>
                <van-tab :title='$t("trade.position")'>
                    <div class='m-ccgd'>
                        <div v-if='positionList.length' class='m-orderBy'>
                            <van-button
                                v-for='(item,index) in sortActions'
                                :key='index'
                                class='action-item'
                                :class='{ active: item.active }'
                                size='mini'
                                type='default'
                                @click='handleSortPosition(item)'
                            >
                                <span> {{ item.name }} </span>
                                <i class='icon arrow' :class='item.className'></i>
                            </van-button>
                        </div>

                        <van-empty v-if='!pageLoading && positionList.length===0' :description='$t("c.noData")' />
                        <PositionList v-if='positionList.length' />
                    </div>
                </van-tab>
                <van-tab :title='$t("trade.pending")'>
                    <PendingList />
                </van-tab>
                <van-tab :title='$t("trade.closedOrder")'>
                    <div class='groupBtn'>
                        <van-button
                            :class="{ 'active': activeType===1,'mainColorBg': activeType ===1 }"
                            size='small'
                            @click='setQueryHistoryCycle(1)'
                        >
                            {{ $t('trade.filterToday') }}
                        </van-button>
                        <van-button
                            :class="{ 'active': activeType===2,'mainColorBg': activeType ===2 }"
                            size='small'
                            @click='setQueryHistoryCycle(2)'
                        >
                            {{ $t('trade.filterweek') }}
                        </van-button>
                        <van-button
                            :class="{ 'active': activeType===3,'mainColorBg': activeType ===3 }"
                            size='small'
                            @click='setQueryHistoryCycle(3)'
                        >
                            {{ $t('trade.filterMonth') }}
                        </van-button>
                    </div>
                    <HistoryList :error='loadError' :finished='finished' :loading='loading' @onLoad='onLoad' />
                </van-tab>
            </van-tabs>
        </div>
    </div>
    <!-- <Loading v-if='pageLoading' :show='pageLoading' /> -->
    <Fund v-if='fundVis' :show='fundVis' @update:show='updateShow' />
</template>

<script>
import { reactive, toRefs, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { QuoteSocket } from '@/plugins/socket/socket'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import Fund from '@c/components/fund'
import PositionList from '@c/modules/positionList/positionList'
import PendingList from '@c/modules/pendingList/pendingList'
import HistoryList from '@c/modules/historyList/historyList'
import dayjs from 'dayjs'
export default {
    components: {
        Fund,
        PositionList,
        PendingList,
        HistoryList
    },
    setup (props) {
        let current = 1
        const { t } = useI18n({ useScope: 'global' })
        const store = useStore()
        const route = useRoute()
        const router = useRouter()

        let sortFieldName = 'openTime'
        let sortType = 'desc'

        const sortActionsUp = 'iconfont icon_paixuxiaojiantou_xiangshang'
        const sortActionsDown = 'iconfont icon_paixuxiaojiantou_xiangxia'

        const state = reactive({
            fundVis: false,
            pageLoading: false,
            active: 0,
            activeType: 1,
            loading: false,
            finished: false,
            loadError: '',
            historyStartTime: dayjs().startOf('day').valueOf(),
            historyEndTime: dayjs().endOf('day').valueOf(),
            sortActions: [
                { name: t('history.daytime'), feild: 'openTime', active: true, className: sortActionsDown },
                { name: t('trade.profit'), active: false, feild: 'pnl' },
            ]
        })
        const positionList = computed(() => store.state._trade.positionList)
        const pendingList = computed(() => store.state._trade.pendingList)
        const customerInfo = computed(() => store.state._user.customerInfo)

        // 切换指定tab页
        if (route.query.tab) state.active = Number(route.query.tab)

        // 选择排序方式
        const handleSortPosition = item => {
            state.sortActions.forEach(el => (el.active = false))
            item.active = true

            if (item.className && sortType === 'desc') {
                sortType = 'asc'
                item.className = sortActionsUp
            } else if (item.className && sortType === 'asc') {
                sortType = 'desc'
                item.className = sortActionsDown
            } else {
                state.sortActions.forEach(el => (el.className = ''))
                item.className = sortActionsDown
                sortType = 'desc'
                sortFieldName = item.feild
            }
            queryPositionList()
        }

        // 查询持仓列表
        const queryPositionList = () => {
            state.pageLoading = true
            store.dispatch('_trade/queryPositionPage', { 'sortFieldName': sortFieldName, 'sortType': sortType }).then(res => {
                state.pageLoading = false
                if (res.check()) {
                    const subscribList = positionList.value.concat(pendingList.value).map(el => el.symbolId)
                    QuoteSocket.send_subscribe(subscribList)
                }
            }).catch(() => {
                state.pageLoading = false
            })
        }

        // 查询挂单列表
        const queryPendingList = () => {
            state.pageLoading = true
            store.dispatch('_trade/queryPBOOrderPage').then(res => {
                state.pageLoading = false
            }).catch(err => {
                state.pageLoading = false
            })
        }

        // 设置查询已平仓列表时间范围
        const setQueryHistoryCycle = (dateType) => {
            state.activeType = dateType
            if (Number(dateType) === 1) {
                state.historyStartTime = dayjs().startOf('day').valueOf()
            } else if (Number(dateType) === 2) {
                state.historyStartTime = dayjs().subtract(7, 'day').startOf('day').valueOf()
            } else if (Number(dateType) === 3) {
                state.historyStartTime = dayjs().subtract(1, 'month').startOf('day').valueOf()
            }
            current = 1
            state.finished = false
            queryHistoryList()
        }
        // 查询已平仓列表
        const queryHistoryList = () => {
            state.loading = true
            state.pageLoading = true
            state.loadError = ''
            store.dispatch('_trade/queryHistoryCloseOrderList', {
                sortFieldName: 'closeTime',
                sortType: 'desc',
                closeStartTime: state.historyStartTime,
                closeEndTime: state.historyEndTime,
                current,
                size: 20
            }).then(res => {
                state.pageLoading = false
                state.loading = false
                if (res.data.list.length === 0 || res.data.current >= res.data.totalPage) {
                    state.finished = true
                }
            }).catch(err => {
                state.loadError = t('c.loadError')
                state.loading = false
                state.pageLoading = false
            })
        }

        // 平仓记录加载更多
        const onLoad = () => {
            current++
            queryHistoryList()
        }

        watch(
            () => state.active,
            newval => {
                if (Number(newval) === 0) {
                    queryPositionList()
                } else if (Number(newval) === 1) {
                    queryPendingList()
                } else if (newval === 2) {
                    current = 1
                    state.finished = false
                    setQueryHistoryCycle(1)
                }
            },
            { immediate: true }
        )

        const triggerTab = (val) => {
            // state.active = Number(val)
            router.replace({ name: 'Position', query: { tab: val } })
        }

        const updateShow = (val) => {
            state.fundVis = val
        }

        return {
            ...toRefs(state),
            updateShow,
            positionList,
            pendingList,
            customerInfo,
            setQueryHistoryCycle,
            handleSortPosition,
            triggerTab,
            queryHistoryList,
            onLoad
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    width: 100%;
    height: 100%;
    margin-top: rem(90px);
    padding: 0 rem(20px);
    overflow: auto;
    background: var(--bgColor);
    .assetIcon {
        right: 0;
        bottom: 0;
        height: 100%;
        line-height: rem(90px);
        .other {
            position: relative;
            top: rem(-5px);
            display: inline-block;
            margin-left: rem(10px);
            font-size: rem(28px);
            line-height: rem(50px);
            i {
                margin-left: rem(10px);
                font-size: rem(24px);
            }
        }
        &.adequate {
            color: var(--success);
        }
        &.less {
            color: #F39800;
        }
        &.stopout {
            color: #E3525C;
        }
        i {
            font-size: rem(45px);
        }
    }
    .m-ccgd {
        background-color: var(--bgColor);
        .m-orderBy {
            margin-top: rem(40px);
            margin-bottom: rem(20px);
            .van-button {
                min-width: rem(110px);
                color: var(--minorColor);
                background-color: var(--contentColor);
                border-color: var(--contentColor);
                &.active {
                    color: #477FD3;
                }
            }
            i {
                font-size: rem(22px);
            }
        }
        .link {
            display: inline-block;
            width: 100%;
        }
        .m-loading {
            padding-top: rem(60px);
            text-align: center;
        }
    }
    .groupBtn {
        padding-top: rem(30px);
        padding-bottom: rem(30px);
        .van-button {
            height: rem(48px);
            margin-right: rem(10px);
            color: var(--minorColor);
            background-color: var(--contentColor);
            border: none;
            border-radius: rem(8px);
            &.active {
                color: #FFF;
            }
        }
    }
}

</style>

<style lang="scss">
@import '@/sass/mixin.scss';
.m-subtab {
    margin: 0 auto rem(120px);
    padding-top: rem(40px);
    background-color: var(--bgColor);
    .van-tabs__nav {
        margin: 0 rem(150px);
        background: var(--contentColor);
        border: none;
        border-radius: 0.8rem;
        .van-tab {
            color: var(--color);
            border: none;
            &:last-child {
                border-radius: 0 0.8rem 0.8rem 0;
            }
            &:first-child {
                border-radius: 0.8rem 0 0 0.8rem;
            }
            &.van-tab--active {
                color: #FFF !important;
                background: var(--primary);
                .van-tab__text {
                    color: #FFF;
                }
            }
        }
    }
}

</style>

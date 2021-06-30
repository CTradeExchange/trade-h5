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
            <van-tabs v-model:active='active' color='rgb(71, 127, 211)' title-inactive-color='#333' type='card' @click='triggerTab'>
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
                            @click='queryHistoryList(1)'
                        >
                            {{ $t('trade.filterToday') }}
                        </van-button>
                        <van-button
                            :class="{ 'active': activeType===2,'mainColorBg': activeType ===2 }"
                            size='small'
                            @click='queryHistoryList(2)'
                        >
                            {{ $t('trade.filterweek') }}
                        </van-button>
                        <van-button
                            :class="{ 'active': activeType===3,'mainColorBg': activeType ===3 }"
                            size='small'
                            @click='queryHistoryList(3)'
                        >
                            {{ $t('trade.filterMonth') }}
                        </van-button>
                    </div>
                    <HistoryList :finished='finished' :loading='loading' @onLoad='onLoad' />
                </van-tab>
            </van-tabs>
        </div>
    </div>
    <Loading v-if='pageLoading' :show='pageLoading' />
    <Fund v-if='fundVis' :show='fundVis' @update:show='updateShow' />
</template>

<script>
import { reactive, toRefs, onUpdated, computed, watchEffect } from 'vue'
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
            sortActions: [
                { name: t('history.daytime'), feild: 'openTime', active: false, className: sortActionsDown },
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

        // 查询已平仓列表
        const queryHistoryList = (dateType) => {
            state.loading = true
            state.activeType = dateType
            const closeEndTime = dayjs().endOf('day').valueOf()
            let closeStartTime = dayjs().startOf('day').valueOf()
            if (Number(dateType) === 1) {
                closeStartTime = dayjs().startOf('day').valueOf()
            } else if (Number(dateType) === 2) {
                closeStartTime = dayjs().subtract(7, 'day').startOf('day').valueOf()
            } else if (Number(dateType) === 3) {
                closeStartTime = dayjs().subtract(1, 'month').startOf('day').valueOf()
            }

            state.pageLoading = true
            store.dispatch('_trade/queryHistoryCloseOrderList', {
                sortFieldName: 'closeTime',
                sortType: 'desc',
                closeStartTime,
                closeEndTime,
                current,
                size: 20
            }).then(res => {
                state.pageLoading = false
                state.loading = false
                if (res.data.list.length === 0 || res.data.current >= res.data.totalPage) {
                    state.finished = true
                }
            }).catch(err => {
                state.pageLoading = false
            })
        }

        // 平仓记录加载更多
        const onLoad = () => {
            current++
            queryHistoryList()
        }

        watchEffect(() => {
            if (Number(state.active) === 0) {
                queryPositionList()
            } else if (Number(state.active) === 1) {
                queryPendingList()
            } else if (state.active === 2) {
                queryHistoryList(1)
            }
        })

        const triggerTab = (val) => {
            state.active = Number(val)
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
    margin-bottom: rem(100px);
    padding: 0 rem(20px);
    overflow: auto;
    background: var(--bgColor2);
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
            color: #11B873;
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
        background-color: var(--bgColor2);
        .m-orderBy {
            margin-top: rem(40px);
            margin-bottom: rem(20px);
            .van-button {
                min-width: rem(110px);
                color: #000;
                border-color: var(--white);
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
        }
    }
}

</style>

<style lang="scss">
@import '@/sass/mixin.scss';
.m-subtab {
    margin: 0 auto;
    padding-top: rem(40px);
    background-color: var(--bgColor2);
    .van-tabs__nav {
        margin: 0 rem(150px);
        border: none;
        border-radius: 0.8rem;
        .van-tab {
            border: none;
            &:last-child {
                border-radius: 0 0.8rem 0.8rem 0;
            }
            &:first-child {
                border-radius: 0.8rem 0 0 0.8rem;
            }
        }
    }
}

</style>

<template>
    <div class='page-wrap'>
        <LayoutTop :menu='false' :title='$t("route.trade")'>
            <template #left>
                <span></span>
            </template>
            <template #right>
                <div class='assetIcon adequate' @click='fundVis=true'>
                    <i class='icon_icon_assets'></i>
                    <div class='other'>
                        <span> {{ $t('trade.asset') }} </span>
                    </div>
                </div>
            </template>
        </LayoutTop>
        <div class='m-subtab'>
            <van-tabs color='rgb(71, 127, 211)' title-inactive-color='#333' type='card'>
                <van-tab :title='$t("trade.position")'>
                    <div class='m-ccgd'>
                        <div class='m-orderBy'>
                            <van-button
                                v-for='(item,index) in sortActions'
                                :key='index'
                                class='action-item'
                                :class='{ active: item.active }'
                                size='small'
                                type='default'
                                @click='actionSheetOnSelect(item)'
                            >
                                <span> {{ item.name }} </span>
                                <i class='icon arrow' :class='item.className'></i>
                            </van-button>
                            <!-- <van-button size='small' type='default' @click='handleSort(1)'>
                                {{ $t('history.daytime') }} <i class='iconfont icon_paixuxiaojiantou_xiangxia'></i>
                            </van-button>
                            <van-button size='small' type='default' @click='handleSort(2)'>
                                {{ $t('trade.profit') }}
                            </van-button> -->
                        </div>
                        <div v-if='positionList.length===0 && $store.state._trade.positionLoading' class='loading'>
                            <van-loading type='spinner' />
                        </div>
                        <PositionList />
                    </div>
                </van-tab>
                <van-tab :title='$t("trade.pending")'>
                    挂单
                </van-tab>
                <van-tab :title='$t("trade.closedOrder")'>
                    平仓
                </van-tab>
            </van-tabs>
        </div>
    </div>

    <Fund v-if='fundVis' :show='fundVis' @update:show='updateShow' />
</template>

<script>
import { reactive, toRefs, onUpdated, computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import Fund from '@c/components/fund'
import PositionList from '@c/modules/positionList/positionList'
export default {
    components: {
        Fund,
        PositionList
    },
    setup (props) {
        const { t } = useI18n({ useScope: 'global' })
        const store = useStore()

        let sortFieldName = 'openTime'
        let sortType = 'desc'

        const sortActionsUp = 'iconfont icon_paixuxiaojiantou_xiangshang'
        const sortActionsDown = 'iconfont icon_paixuxiaojiantou_xiangxia'

        const state = reactive({
            fundVis: false,
            sortActions: [
                { name: t('history.daytime'), feild: 'openTime', active: false, className: sortActionsDown },
                { name: t('trade.profit'), active: false, feild: 'pnl' },
            ]
        })
        const positionList = computed(() => store.state._trade.positionList)
        const pendingList = computed(() => store.state._trade.pendingList)
        const customerInfo = computed(() => store.state._user.customerInfo)

        const sortActions = [
            { name: t('history.daytime'), feild: 'openTime', className: sortActionsDown },
            { name: t('trade.profit'), feild: 'pnl' },
        ]

        if (customerInfo.value) {
            store.dispatch('_trade/queryPositionPage')
        }

        // 选择排序方式
        const actionSheetOnSelect = item => {
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
            actionSheetOnSelect
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
        padding: 0 rem(20px);
        background-color: var(--bgColor2);
        .m-orderBy {
            margin-top: rem(20px);
            margin-bottom: rem(20px);
            .van-button {
                min-width: rem(110px);
                color: #000;
                //padding: 0 rem(30px);
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
}

</style>

<style lang="scss">
@import '@/sass/mixin.scss';
.m-subtab {
    margin: 0 auto;
    padding-top: rem(20px);
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

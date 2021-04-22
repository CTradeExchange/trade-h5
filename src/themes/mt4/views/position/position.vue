<template>
    <Top>
        <template #right>
            <a class='icon icon_paixu' href='javascript:;' @click='sortActionsVisible=true'></a>
            <a class='icon icon_xindingdan' href='javascript:;' @click='newOrder'></a>
        </template>
    </Top>
    <div class='container'>
        <CapitalList :data='capitalListData' />
        <div class='titleBar'>
            价位
        </div>
        <PositionList @refresh='refresh' />
        <template v-if='pendingList.length'>
            <div class='titleBar'>
                订单
            </div>
            <PendingList @refresh='refresh' />
        </template>
    </div>

    <!-- 排序 actionsheet -->
    <van-action-sheet v-model:show='sortActionsVisible' :actions='sortActions' cancel-text='取消' @select='actionSheetOnSelect' />
</template>

<script>
import Top from '@m/layout/top'
import CapitalList from '@m/components/capitalList'
import PositionList from '@m/modules/positionList/positionList'
import PendingList from '@m/modules/pendingList/pendingList'
import { reactive, toRefs, computed } from 'vue'
import { useStore } from 'vuex'
import { QuoteSocket } from '@/plugins/socket/socket'
import { useRouter } from 'vue-router'
export default {
    components: {
        CapitalList,
        PositionList,
        PendingList,
        Top,
    },
    setup () {
        const store = useStore()
        const router = useRouter()
        const pendingList = computed(() => store.state._trade.pendingList)
        const sortActionsSelected = 'van-badge__wrapper van-icon van-icon-down'
        const sortActions = [
            { name: '订单', feild: 'order', className: sortActionsSelected },
            { name: '时间', feild: 'time', },
            { name: '交易品种', feild: 'symbol', },
            { name: '利润', feild: 'yz', },
        ]
        let sortActionValue = sortActions[0].feild
        const state = reactive({
            capitalListData: [
                { title: '结余：', value: '1000000.00' },
                { title: '净值：', value: '1000000.00' },
                { title: '可用预付款：', value: '1000000.00' },
                { title: '预付款比率(%)：', value: '1000000.00' },
                { title: '预付款：', value: '1000000.00' },
            ],
            sortActionsVisible: false,
            sortActions
        })
        const actionSheetOnSelect = item => {
            sortActions.forEach(el => (el.className = ''))
            item.className = sortActionsSelected
            sortActionValue = item.feild
            state.sortActionsVisible = false
        }
        // 查询持仓列表
        const queryList = () => {
            store.dispatch('_trade/queryPositionPage', { sort: sortActionValue }).then(res => {
                if (res.check()) {
                    const subscribList = res.data.map(el => el.symbolId)
                    QuoteSocket.send_subscribe(subscribList)
                }
            })
        }
        queryList()

        const newOrder = () => {
            router.push({ name: 'Order', query: { symbolId: store.state._quote.productActivedID } })
        }
        // 刷新持仓列表
        const refresh = () => {
            queryList()
        }
        return {
            ...toRefs(state),
            pendingList,
            actionSheetOnSelect,
            newOrder,
            refresh,
        }
    },
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.container {
    flex: 1;
    margin-bottom: rem(100px);
    overflow-y: auto;
}
.titleBar {
    height: rem(60px);
    padding: 0 rem(40px);
    font-size: rem(28px);
    line-height: rem(60px);
    background: var(--bgColor);
    border: 1px solid rgba($color: #000, $alpha: 0.1);
    border-width: 1px 0;
    box-shadow: 0 1px 0 rgba($color: #FFF, $alpha: 1) inset;
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
}
</style>

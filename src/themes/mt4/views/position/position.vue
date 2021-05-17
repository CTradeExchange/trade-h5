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
import { reactive, toRefs, computed, onMounted, watch, onUpdated } from 'vue'
import { useStore } from 'vuex'
import { QuoteSocket } from '@/plugins/socket/socket'
import { useRouter } from 'vue-router'
import { priceFormat, isEmpty } from '@/utils/util'
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
        const customerInfo = computed(() => store.state._user.customerInfo)
        const sortActionsSelected = 'van-badge__wrapper van-icon van-icon-down'
        const sortActions = [
            { name: '订单', feild: 'orderId', className: sortActionsSelected },
            { name: '时间', feild: 'openTime', },
            { name: '产品', feild: 'symbolId', },
            // { name: '利润', feild: 'yz', },
        ]
        let sortActionValue = sortActions[0].feild

        const accountInfo = computed(() => store.state._user.userAccount)
        const capitalListData = computed(() => {
            return [
                { title: '结余：', value: !isEmpty(accountInfo.value) ? priceFormat(accountInfo.value.balance, customerInfo.value.digits) : '--' },
                { title: '净值：', value: !isEmpty(accountInfo.value) ? priceFormat(accountInfo.value.netWorth, customerInfo.value.digits) : '--' },
                { title: '可用预付款：', value: !isEmpty(accountInfo.value) ? priceFormat(accountInfo.value.availableMargin, customerInfo.value.digits) : '--' },
                { title: '预付款比率(%)：', value: !isEmpty(accountInfo.value.marginRadio) ? accountInfo.value.marginRadio + '%' : '--' },
                { title: '预付款：', value: !isEmpty(accountInfo.value) ? priceFormat(accountInfo.value.occupyMargin, customerInfo.value.digits) : '--' },
            ]
        })

        // 取变动价格列表
        const positionProfitLossList = computed(() => store.state._trade.positionProfitLossList)

        const positionList = computed(() => store.state._trade.positionList)

        watch([positionList, positionProfitLossList], ([pNew, pflNew], [pOld, pflOld]) => {
            if (pNew.length > 0 && pflNew.length > 0) {
                pNew.forEach(p => {
                    pflNew.forEach(item => {
                        // console.log('更新价格', item.profitLoss)
                        if (Number(item.positionId) === Number(p.positionId)) {
                            p.profitLoss = priceFormat(item.profitLoss, customerInfo.value.digits)
                        }
                    })
                })
            }
        })

        const state = reactive({
            sortActionsVisible: false,
            sortActions
        })
        const actionSheetOnSelect = item => {
            sortActions.forEach(el => (el.className = ''))
            item.className = sortActionsSelected
            sortActionValue = item.feild
            state.sortActionsVisible = false
            queryList()
        }
        // 查询持仓列表
        const queryList = () => {
            store.dispatch('_trade/queryPositionPage', { 'sortFieldName': sortActionValue, 'sortType': 'desc' }).then(res => {
                if (res.check()) {
                    const positionList = res.data
                    const subscribList = positionList.map(el => el.symbolId)
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
            accountInfo,
            capitalListData,
            positionProfitLossList,
            positionList
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

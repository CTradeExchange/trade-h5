<template>
    <Top>
        <template #right>
            <a class='icon icon_paixu' href='javascript:;' @click='sortActionsVisible=true'></a>
            <a class='icon icon_xindingdan' href='javascript:;' @click='newOrder'></a>
        </template>
    </Top>
    <div class='container'>
        <CapitalList :data='capitalListData' />
        <div v-if='positionList.length===0 && $store.state._trade.positionLoading' class='loading'>
            <van-loading type='spinner' />
        </div>
        <van-empty v-else-if='positionList.length===0 && pendingList.length===0' :description="$t('emptyHistory')" />
        <div v-if='positionList.length' class='titleBar'>
            {{ $t('position.price') }}
        </div>
        <PositionList v-if='positionList.length' @refresh='refresh' />
        <template v-if='pendingList.length'>
            <div class='titleBar'>
                {{ $t('history.order') }}
            </div>
            <PendingList @refresh='refresh' />
        </template>
    </div>

    <!-- 排序 actionsheet -->
    <van-action-sheet v-model:show='sortActionsVisible' :actions='sortActions' :cancel-text="$t('cancel')" @select='actionSheetOnSelect' />
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
import { mul } from '@/utils/calculation'
import { useI18n } from 'vue-i18n'
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
        const { t } = useI18n({ useScope: 'global' })
        const positionList = computed(() => store.state._trade.positionList)
        const pendingList = computed(() => store.state._trade.pendingList)
        const customerInfo = computed(() => store.state._user.customerInfo)
        const sortActionsSelected = 'van-badge__wrapper van-icon van-icon-down'
        const sortActions = [
            { name: t('history.order'), feild: 'orderId', className: sortActionsSelected },
            { name: t('history.daytime'), feild: 'openTime', },
            { name: t('history.product'), feild: 'symbolId', },
            // { name: '利润', feild: 'yz', },
        ]
        let sortActionValue = sortActions[0].feild

        const accountInfo = computed(() => store.state._user.accountAssets)
        const capitalListData = computed(() => {
            return [
                { title: t('history.lirun') + t('colon'), value: !isEmpty(accountInfo.value) ? accountInfo.value.balance : '--' },
                { title: t('trade.jingzhi') + t('colon'), value: !isEmpty(accountInfo.value) ? accountInfo.value.netWorth : '--' },
                { title: t('trade.usableAdvance') + t('colon'), value: !isEmpty(accountInfo.value) ? accountInfo.value.availableMargin : '--' },
                { title: t('trade.advance') + t('colon'), value: !isEmpty(accountInfo.value) ? accountInfo.value.occupyMargin : '--' },
                { title: t('trade.advanceRatio') + '(%)' + t('colon'), value: !isEmpty(accountInfo.value) ? mul(accountInfo.value.marginRadio, 100) + '%' : '--' },
            ]
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
                    const subscribList = positionList.value.concat(pendingList.value).map(el => el.symbolId)
                    QuoteSocket.send_subscribe(subscribList)
                }
            })
        }
        const queryPendingList = () => {
            store.dispatch('_trade/queryPBOOrderPage', { 'sortFieldName': sortActionValue, 'sortType': 'desc' }).then(res => {
                if (res.check()) {
                    const subscribList = positionList.value.concat(pendingList.value).map(el => el.symbolId)
                    QuoteSocket.send_subscribe(subscribList)
                }
            })
        }
        queryList()
        queryPendingList()

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
            positionList
        }
    },
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.loading {
    padding-top: 30%;
    text-align: center;
}
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

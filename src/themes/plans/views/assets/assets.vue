<template>
    <div class='assetsWrapper'>
        <TabBar :index='curIndex' @updateTab='updateTab' />
        <van-swipe
            ref='assetsSwipe'
            :show-indicators='false'
            :touchable='true'
            @change='onChange'
        >
            <van-swipe-item v-if='filterShow(1)'>
                <TotalAssetsFullPosition class='block' />
                <PositionList v-if='Number(tradeType) === 1' />
            </van-swipe-item>
            <van-swipe-item v-if='filterShow(2)'>
                <TotalAssetsBywarehouse class='block' />
                <PositionList v-if='Number(tradeType) === 2' />
            </van-swipe-item>
            <van-swipe-item v-if='filterShow(3)'>
                <TotalAssets class='block' />
                <AssetsItem v-for='item in accountList' :key='item.accountId' class='block' :data='item' />
            </van-swipe-item>
        </van-swipe>
    </div>
</template>

<script>
import TabBar from './components/tabBar.vue'
import AssetsItem from './components/assetsItem.vue'
import TotalAssets from './components/totalAssets.vue'
import TotalAssetsFullPosition from './components/totalAssetsFullPosition.vue'
import TotalAssetsBywarehouse from './components/totalAssetsBywarehouse.vue'

import PositionList from '@plans/modules/positionList/positionList'
import { reactive, toRefs, nextTick, ref, provide } from 'vue'
import { useStore } from 'vuex'
import { computed, watchEffect } from '@vue/runtime-core'
import { isEmpty } from '@/utils/util'
import { QuoteSocket } from '@/plugins/socket/socket'
export default {
    components: {
        TabBar,
        PositionList,
        AssetsItem,
        TotalAssets,
        TotalAssetsBywarehouse,
        TotalAssetsFullPosition,
    },
    setup () {
        const store = useStore()
        const assetsSwipe = ref(null)
        const curIndex = ref(0)

        // 获取账户列表
        const accountList = computed(() =>
            store.state._user.customerInfo?.accountList.filter(item => item.tradeType === 3) ?? []
        )
        const customerInfo = computed(() => store.state._user.customerInfo)

        const tradeType = computed(() => store.state._quote.curTradeType)

        // 获取玩法列表
        const plans = computed(() => store.state._base.plans)

        const positionList = computed(() => store.state._trade.positionList[tradeType.value])

        // 获取持仓列表
        const queryPositionList = () => {
            const accountId = customerInfo.value.accountList.find(item => Number(item.tradeType) === Number(tradeType.value))?.accountId
            store.dispatch('_trade/queryPositionPage', {
                tradeType: tradeType.value,
                accountId
            }).then(res => {
                if (res.check()) {
                    const subscribList = positionList.value.map(el => {
                        return {
                            symbolId: el.symbolId,
                            tradeType: tradeType.value
                        }
                    })
                    QuoteSocket.send_subscribe(subscribList)
                }
            }).catch(() => {
            })
        }

        watchEffect(() => {
            // 获取持仓列表 并订阅报价
            console.log('tradeType.value', tradeType.value)
            if ([1, 2].indexOf(Number(tradeType.value)) > -1) {
                queryPositionList()
            } else if ((Number(tradeType.value)) === 3) {
                store.dispatch('_user/queryCustomerAssetsInfo', { tradeType: 3 })
            }
        })

        // 监听tab变化
        const updateTab = (val) => {
            assetsSwipe.value.swipeTo(val)
            curIndex.value = val
        }

        const filterShow = (tradeType) => {
            if (plans.value.length > 0) {
                return !isEmpty(plans.value.find(el => Number(el.id) === Number(tradeType)))
            }
        }

        const onChange = (index) => {
            curIndex.value = index
            store.commit('_quote/Update_tradeType', plans.value[index].id)
        }

        return {
            accountList,
            updateTab,
            onChange,
            curIndex,
            assetsSwipe,
            tradeType,
            plans,
            filterShow
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.assetsWrapper {
    padding: rem(20px) rem(20px) rem(100px);
    .block {
        margin-bottom: rem(20px);
        border-radius: 4px;
    }
}
</style>

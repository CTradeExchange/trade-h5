<template>
    <div class='assetsWrapper' :class='{ mt: plans.length <= 1 }'>
        <plansType v-if='plans.length > 1' class='plansType' :list='plans' :value='tradeType' @change='handleTradeType' />
        <van-swipe
            ref='assetsSwipe'
            :duration='duration'
            :initial-swipe='0'
            :show-indicators='false'
            :touchable='true'
            @change='onChange'
        >
            <van-swipe-item v-for='item in plans' :key='item.id'>
                <div v-if='Number(item.id) === 1' class='plans-item'>
                    <TotalAssetsFullPosition class='block' />
                    <PositionList />
                </div>
                <div v-if='Number(item.id) === 2' class='plans-item'>
                    <TotalAssetsBywarehouse class='block' />
                    <PositionList />
                </div>
                <div v-if='[3,9,5].indexOf(Number(item.id)) > -1' class='plans-item'>
                    <TotalAssets class='block' />
                    <AssetsItem v-for='account in accountList' :key='account.accountId' class='block' :data='account' />
                </div>
            </van-swipe-item>
        </van-swipe>
    </div>
</template>

<script>
import AssetsItem from './components/assetsItem.vue'
import TotalAssets from './components/totalAssets.vue'
import TotalAssetsFullPosition from './components/totalAssetsFullPosition.vue'
import TotalAssetsBywarehouse from './components/totalAssetsBywarehouse.vue'

import PositionList from '@plans/modules/positionList/positionList'
import { reactive, toRefs, nextTick, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { computed, watchEffect, watch, onUnmounted } from '@vue/runtime-core'
import { isEmpty } from '@/utils/util'
import { QuoteSocket, MsgSocket } from '@/plugins/socket/socket'
import plansType from '@/themes/plans/components/plansType.vue'

export default {
    components: {
        PositionList,
        AssetsItem,
        TotalAssets,
        TotalAssetsBywarehouse,
        TotalAssetsFullPosition,
        plansType
    },
    setup () {
        const store = useStore()
        const assetsSwipe = ref(null)
        const curIndex = ref(0)
        const state = reactive({
            duration: 0
        })

        // 获取账户列表
        const accountList = computed(() =>
            store.state._user?.customerInfo?.accountList && store.state._user?.customerInfo?.accountList.filter(item => Number(item.tradeType) === Number(tradeType.value))
        )
        const customerInfo = computed(() => store.state._user.customerInfo)

        const tradeType = computed(() => store.state._quote.curTradeType)

        // 获取玩法列表
        const plans = computed(() => store.state._base.plans)

        // 获取持仓列表
        const positionList = computed(() => store.state._trade.positionList[tradeType.value])

        // 获取当前 tab 下标
        const tabIndex = computed(() => plans.value.findIndex(item =>
            (Number(item.id) === Number(tradeType.value))
        ))

        // 获取持仓列表
        const queryPositionList = (tradeType) => {
            if (isEmpty(customerInfo.value)) {
                return
            }
            const accountId = customerInfo.value.accountList.find(item => Number(item.tradeType) === Number(tradeType.value))?.accountId
            store.dispatch('_trade/queryPositionPage', {
                tradeType: tradeType,
                sortFieldName: 'openTime',
                sortType: 'desc',
                accountId
            }).then(res => {
                if (res.check()) {
                    const subscribList = positionList.value.map(el => {
                        return {
                            symbolId: el.symbolId,
                            tradeType: tradeType
                        }
                    })
                    QuoteSocket.send_subscribe(subscribList)
                }
            }).catch(() => {
            }).finally(() => {
                // 订阅资产数据
                MsgSocket.subscribedListAdd(function () {
                    MsgSocket.subscribeAsset(tradeType)
                })
            })
        }

        // 点击tab事件
        const handleTradeType = (val) => {
            const curIndex = plans.value.findIndex(item => item.id === val)
            assetsSwipe.value.swipeTo(curIndex)
            initData(val)
        }

        const initData = (val) => {
            if ([1, 2].indexOf(Number(val)) > -1) {
                queryPositionList(val)
            } else if ([3, 5, 9].indexOf(Number(val)) > -1) {
                store.dispatch('_user/queryCustomerAssetsInfo', { tradeType: val })
            }
        }

        // swipwe 滑动组件
        const onChange = (index) => {
            store.commit('_quote/Update_tradeType', plans.value[index].id)
        }

        if (tradeType.value) {
            initData(tradeType.value)
        }

        onMounted(() => {
            assetsSwipe.value && assetsSwipe.value.swipeTo(tabIndex.value === -1 ? 0 : tabIndex.value)
            if (plans.value.length > 0) {
                store.commit('_quote/Update_tradeType', plans.value[0].id)
            }
        })
        onUnmounted(() => {
            MsgSocket.cancelSubscribeAsset()
        })

        return {
            accountList,
            onChange,
            curIndex,
            assetsSwipe,
            tradeType,
            plans,
            handleTradeType,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.assetsWrapper {
    padding: 0 rem(20px) rem(100px);
    overflow: auto;
    &.mt {
        margin-top: rem(20px);
    }
    .block {
        margin-bottom: rem(20px);
        border-radius: 4px;
    }
    .playType {
        background-color: var(--bgColor);
    }
}
</style>

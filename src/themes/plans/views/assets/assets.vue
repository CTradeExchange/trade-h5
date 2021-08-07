<template>
    <div class='assetsWrapper'>
        <TabBar :index='curIndex' @updateTab='updateTab' />
        <van-swipe ref='assetsSwipe' :show-indicators='false' :touchable='true' @change='onChange'>
            <van-swipe-item v-if='filterShow(1)'>
                <TotalAssetsFullPosition class='block' />
                <PositionList />
            </van-swipe-item>
            <van-swipe-item v-if='filterShow(2)'>
                <TotalAssetsBywarehouse class='block' />
                <PositionList />
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

        const accountList = computed(() =>
            store.state._user.customerInfo?.accountList.filter(item => item.tradeType === 3) ?? []
        )

        const tradeType = computed(() => store.state._quote.curTradeType)

        const plans = computed(() => store.state._base.plans)

        // 监听tab变化
        const updateTab = (val) => {
            assetsSwipe.value.swipeTo(Number(val) - 1)
            curIndex.value = val
            // store.commit('_quote/Update_tradeType', val)
        }

        const filterShow = (tradeType) => {
            if (plans.value.length > 0) {
                return plans.value.find(el => Number(el.id) === Number(tradeType))
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

<template>
    <div class='assetsWrapper'>
        <TabBar :index='curIndex' @updateTab='updateTab' />
        <van-swipe ref='assetsSwipe' :show-indicators='false' :touchable='true' @change='onChange'>
            <van-swipe-item>
                <TotalAssetsFullPosition class='block' />
                <PositionList  />
            </van-swipe-item>
            <van-swipe-item>
                <TotalAssetsBywarehouse class='block' />
                <PositionList />
            </van-swipe-item>
            <van-swipe-item>
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
import { reactive, toRefs, nextTick, ref,provide } from 'vue'
import { useStore } from 'vuex'
import { computed } from '@vue/runtime-core'
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

        
        
        const accountList = computed(() => store.state._user.customerInfo?.accountList ?? [])

        // 监听tab变化
        const updateTab = (val) => {
            assetsSwipe.value.swipeTo(Number(val) - 1)
            getPositionData(Number(val))
            curIndex.value = val
        }

        const onChange = (index) => {
            curIndex.value = index
        }

        provide('curTabIndex', curIndex)

        const getPositionData = (tradeType)=>{
            store.dispatch('_trade/queryPositionPage', { tradeType })
        }

        store.dispatch('_trade/queryPositionPage', { tradeType: 1 })

        store.dispatch('_user/queryCustomerAssetsInfo', { tradeType: 3 })
        return {
            accountList,
            updateTab,
            onChange,
            curIndex,
            assetsSwipe
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

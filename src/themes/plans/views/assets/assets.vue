<template>
    <div class='assetsWrapper'>
        <TabBar :index='curIndex' @updateTab='updateTab' />
        <van-swipe ref='assetsSwipe' indicator-color='white' :show-indicators='false' @change='onChange'>
            <van-swipe-item>
                <TotalAssetsAllPosition class='block' />
                <AssetsItem v-for='item in accountList' :key='item.accountId' class='block' :data='item' />
            </van-swipe-item>
            <van-swipe-item>
                逐仓
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
import TotalAssetsAllPosition from './components/totalAssetsAllPosition.vue'

import { reactive, toRefs, nextTick, ref } from 'vue'
import { useStore } from 'vuex'
import { computed } from '@vue/runtime-core'
export default {
    components: {
        TabBar,
        AssetsItem,
        TotalAssets,
        TotalAssetsAllPosition
    },
    setup () {
        const store = useStore()

        const assetsSwipe = ref(null)
        const curIndex = ref(0)
        const accountList = computed(() => store.state._user.customerInfo?.accountList ?? [])

        // 监听tab变化
        const updateTab = (val) => {
            assetsSwipe.value.swipeTo(val)
        }

        const onChange = (index) => {
            curIndex.value = index
        }

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

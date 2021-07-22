<template>
    <div class='assetsWrapper'>
        <TotalAssets class='block' />

        <AssetsItem v-for='item in accountList' :key='item.accountId' class='block' :data='item' />
    </div>
</template>

<script>
import AssetsItem from './components/assetsItem.vue'
import TotalAssets from './components/totalAssets.vue'
// import { reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { computed } from '@vue/runtime-core'
export default {
    components: {
        AssetsItem,
        TotalAssets,
    },
    setup () {
        const store = useStore()
        const accountList = computed(() => store.state._user.customerInfo?.accountList ?? [])
        store.dispatch('_user/queryCustomerAssetsInfo')
        return {
            accountList
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

<template>
    <div class='assetsWrapper'>
        <TotalAssets class='block' />

        <AssetsItem class='block' />
        <AssetsItem class='block' />
        <AssetsItem class='block' />
        <AssetsItem class='block' />
    </div>
</template>

<script>
import AssetsItem from './components/assetsItem.vue'
import TotalAssets from './components/totalAssets.vue'
// import { reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
export default {
    components: {
        AssetsItem,
        TotalAssets,
    },
    setup () {
        const store = useStore()
        store.dispatch('_user/queryCustomerAssetsInfo')
        return {}
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

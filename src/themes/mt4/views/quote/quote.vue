<template>
    <Top>
        <template #right>
            <van-icon class='icon-edit' name='edit' @click="$router.push({ name: 'Optional' })" />
            <van-icon class='icon-plus' name='plus' @click="$router.push({ name: 'Search' })" />
        </template>
    </Top>
    <productListComp />
</template>

<script>
import Top from '@m/layout/top'
import productListComp from '@m/modules/productList/productList.vue'
import { computed, watchEffect } from 'vue'
import { useStore } from 'vuex'

export default {
    name: 'Quote',
    components: {
        productListComp,
        Top,
    },
    setup () {
        const store = useStore()
        const customerInfo = computed(() => store.state._user.customerInfo)

        if (customerInfo.value) {
            store.dispatch('_trade/queryPositionPage')
        }
        return {}
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.icon-edit,
.icon-plus {
    font-size: rem(40px);
}
.icon-plus {
    margin-left: rem(20px);
}
</style>

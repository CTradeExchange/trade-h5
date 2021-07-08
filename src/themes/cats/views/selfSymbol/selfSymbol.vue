<template>
    <div class='selfSymbol'>
        <layoutTop>
            <div></div>
            <template #left>
                <span class='title'>
                    {{ $t('selfSymbol.my') }}
                </span>
            </template>
            <template #right>
                <router-link class='searchIcon' tag='div' :to="{ name:'Search' }">
                    <i class='icon_sousuo1'></i>
                </router-link>
            </template>
        </layoutTop>
        <SelfSymbolList />
    </div>
</template>

<script>
import SelfSymbolList from '@c/modules/selfSymbolList/selfSymbolList.vue'
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
    name: 'Quote',
    components: {
        SelfSymbolList,
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
.selfSymbol {
    display: flex;
    flex: 1;
    width: 100%;
    margin-top: rem(90px);
    margin-bottom: rem(100px);
    overflow: auto;
    background: var(--bgColor);
}
.title {
    color: var(--color);
    font-weight: 700;
    font-size: rem(40px);
}
</style>

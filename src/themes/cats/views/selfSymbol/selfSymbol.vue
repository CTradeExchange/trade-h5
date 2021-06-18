<template>
    <div class='selfSymbol'>
        <Top>
            <div></div>
            <template #left>
                <span class='title'>
                    {{ $t('selfSymbol.my') }}
                </span>
            </template>
        </Top>
        <SelfSymbolList />
    </div>
</template>

<script>
import Top from '@c/layout/top'
import SelfSymbolList from '@c/modules/selfSymbolList/selfSymbolList.vue'
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
    name: 'Quote',
    components: {
        SelfSymbolList,
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
.selfSymbol {
    display: flex;
    flex: 1;
    width: 100%;
    margin-top: rem(90px);
    margin-bottom: rem(100px);
    overflow: auto;
}
.title {
    color: rgba(51, 51, 51, 1);
    font-weight: 700;
    font-size: rem(40px);
}
</style>

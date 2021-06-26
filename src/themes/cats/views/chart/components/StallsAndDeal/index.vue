<template>
    <div class='stallsAndDeal'>
        <Mobile />
    </div>
</template>

<script>

import { computed, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Mobile from './components/Mobile'
export default {
    components: {
        Mobile
    },
    props: ['data'],
    setup ({ data }) {
        const store = useStore()
        const product = computed(() => store.state._quote.productMap[data.symbolId])

        return {
            product
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.stallsAndDeal {
    min-width: rem(200px);
    height: rem(890px);
    margin-top: rem(10px);
    margin-bottom: rem(30px);
    background: var(--bgColor);
    border-top: 1px solid #ECEDF2;
    border-right: 1px solid #ECEDF2;
}
</style>

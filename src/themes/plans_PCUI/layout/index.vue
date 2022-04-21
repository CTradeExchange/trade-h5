<template>
    <topNav :class='[$route.name]' />
    <Suspense>
        <template #default>
            <router-view v-slot='{ Component, route }'>
                <keep-alive :include='cacheViews'>
                    <component
                        :is='Component'
                        :key='route.meta.usePathKey ? route.path : undefined'
                    />
                </keep-alive>
            </router-view>
        </template>
        <template #fallback>
            Loading...
        </template>
    </Suspense>
    <footerNav :data='footerData' />
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import topNav from './topNav'
import footerNav from '../modules/footer/footer.vue'
export default {
    name: 'Layout',
    components: {
        topNav,
        footerNav
    },
    computed: {
        footerData () {
            const wpFooter = this.$store.state._base.wpFooter?.find(o => o.tag === 'footer')
            return wpFooter ? wpFooter.data : {}
        }
    },
    setup () {
        const store = useStore()
        const cacheViews = computed(() => store.state.cacheViews)
        return {
            cacheViews,
        }
    }
}
</script>

<style lang="scss">
@import '@/sass/mixin.scss';
// #app {
//     display: flex;
//     flex-flow: column;
// }
// .pageWrap {
//     flex: 1;
//     padding-bottom: rem(100px);
//     overflow-y: auto;
//     &.noFoot {
//         z-index: 2;
//         padding-bottom: 0;
//         background: var(--contentColor);
//     }
// }
</style>

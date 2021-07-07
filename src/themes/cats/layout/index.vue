<template>
    <!-- <router-view /> -->
    <Suspense>
        <template #default>
            <router-view v-slot='{ Component, route }'>
                <keep-alive :include='cacheViews'>
                    <component
                        :is='Component'
                        :key='
                            route.meta.usePathKey ? route.path : undefined
                        '
                    />
                </keep-alive>
            </router-view>
        </template>
        <template #fallback>
            Loading...
        </template>
    </Suspense>
    <footerMenu id='footerMenu' class='footerMenu' />
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import footerMenu from './footerMenu'
export default {
    components: {
        footerMenu,
    },
    setup () {
        const store = useStore()
        const cacheViews = computed(() => store.state.cacheViews)

        return {
            cacheViews
        }
    }
}
</script>

<style lang="scss">
@import '@/sass/mixin.scss';
#app {
    display: flex;
    flex-flow: column;
}
.pageWrap {
    flex: 1;
    padding-bottom: rem(100px);
    overflow-y: auto;
    &.noFoot {
        z-index: 2;
        padding-bottom: 0;
        background: var(--white);
    }
}
</style>

<template>
    <div id='layoutContent'>
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
    </div>
    <footerMenu v-if='navData' id='footerMenu' class='footerMenu' :data='navData.data' />
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import footerMenu from '../modules/nav/nav'
// import TopMenu from './topMenu.vue'
// import NewFooter from './footer.vue'

export default {
    name: 'Layout',
    components: {
        footerMenu,
        // TopMenu,
        // NewFooter
    },
    setup () {
        const store = useStore()
        const cacheViews = computed(() => store.state.cacheViews)
        const navData = computed(() => store.state._base.wpNav?.find(el => el.tag === 'nav'))
        store.dispatch('_base/getPageConfig', 'Nav').then(res => {
            store.commit('_base/UPDATE_wpNav', res)
        })

        return {
            cacheViews,
            navData,
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
#layoutContent{
    // height: calc(100vh - rem(136px));
    height: calc(100% - rem(136px));
    overflow-y: auto;

}
</style>

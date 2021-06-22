<template>
    <!-- <router-view /> -->
    <router-view v-slot='{ Component }'>
        <keep-alive>
            <component :is='Component' :class="{ 'noFoot':$route.meta.footerMenu===false }" />
        </keep-alive>
    </router-view>
    <footerMenu id='footerMenu' class='footerMenu' />
</template>

<script>
import footerMenu from './footerMenu'
export default {
    components: {
        footerMenu,
    },
    data () {
        return {
            leftMenuVisible: true
        }
    },
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

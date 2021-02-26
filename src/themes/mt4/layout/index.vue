<template>
    <layoutTop ref='root' class='layoutTop' :title='$route.meta.title' @showLeftMenu='$refs.leftMenu.visible=true' />
    <router-view v-slot='{ Component }'>
        <keep-alive>
            <component :is='Component' class='pageWrap' :class="{ 'noFoot':$route.meta.footerMenu===false }" />
        </keep-alive>
    </router-view>
    <footerMenu id='footerMenu' class='footerMenu' />
    <leftMenu ref='leftMenu' />
</template>

<script>
import footerMenu from './footerMenu'
import leftMenu from './leftMenu'
import layoutTop from './top'
export default {
    components: {
        footerMenu,
        layoutTop,
        leftMenu,
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
#app{
    display: flex;
    flex-flow: column;
}
.pageWrap{
    flex: 1;
    padding-bottom: rem(100px);
    overflow-y: auto;
    &.noFoot{
        padding-bottom: 0;
        background: var(--white);
        z-index: 2;
    }
}
</style>

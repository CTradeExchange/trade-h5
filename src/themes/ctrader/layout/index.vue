<template>
    <div class='pageContainer' :style="{ background:$route.name==='Home'?'var(--bgColor)':'none' }">
        <layoutTop
            v-if='!$route.meta.full'
            ref='root'
            :back='false'
            class='layoutTop'
            menu
            @showLeftMenu='$refs.leftMenu.visible=true'
        >
            <topAccount />
        </layoutTop>
        <router-view v-slot='{ Component }'>
            <!-- <keep-alive> -->
            <component :is='Component' />
            <!-- </keep-alive> -->
        </router-view>
    </div>
    <footerMenu v-if='!$route.meta.full' id='footerMenu' class='footerMenu' />
    <leftMenu ref='leftMenu' />
</template>

<script>
import footerMenu from './footerMenu'
import leftMenu from './leftMenu'
import topAccount from './topAccount'
import layoutTop from './top'
export default {
    components: {
        footerMenu,
        layoutTop,
        topAccount,
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
#app {
    display: flex;
    flex-flow: column;
}
.pageContainer {
    flex: 1;
    overflow-y: auto;
}
</style>

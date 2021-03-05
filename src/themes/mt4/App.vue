<template>
    <router-view />
</template>

<script>
import { useStore } from 'vuex'
export default {
    setup () {
        const store = useStore()
        store.dispatch('_base/getNav')
        window.store = store
    }
}
</script>

<style lang="scss">
@import "~@m/style.scss";
@import "~@m/font/iconfont.css";
@import "~@/sass/mixin.scss";
</style>

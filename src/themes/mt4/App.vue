<template>
    <router-view />
</template>

<script>
import { getLoginParams, getToken, removeLoginParams } from '@/utils/util'
import { useStore } from 'vuex'

export default {
    setup () {
        const store = useStore()
        store.dispatch('_base/getNav')
        window.store = store
    },
    created () {
        window.vm = this
        console.log('app.vue this', this)
    }
}
</script>

<style lang="scss">
@import '~@m/style.scss';
@import '~@m/font/iconfont.css';
@import '~@/sass/mixin.scss';
</style>

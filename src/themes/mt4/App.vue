<template>
    <router-view />
</template>

<script>
import { useStore } from 'vuex'
import { getLoginParams, getToken } from '@/utils/util'

export default {
    setup () {
        const store = useStore()
        store.dispatch('_base/getNav')
        window.store = store
        const loginParams = getLoginParams()
        const token = getToken()
        if (loginParams) store.dispatch('_user/login', loginParams)
        else if(token) store.dispatch('_user/findCustomerInfo')
    },
    created () {
        console.log('app.vue this', this)
    }
}
</script>

<style lang="scss">
@import '~@m/style.scss';
@import '~@m/font/iconfont.css';
@import '~@/sass/mixin.scss';
</style>

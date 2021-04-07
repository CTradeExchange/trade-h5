<template>
    <router-view />
</template>

<script>
import { useStore } from 'vuex'
import { getLoginParams, getToken, removeLoginParams } from '@/utils/util'
import { useRoute, useRouter } from 'vue-router'

export default {
    setup () {
        const store = useStore()
        const router = useRouter()
        const route = useRoute()
        store.dispatch('_base/getNav')
        window.store = store
        const loginParams = getLoginParams()
        const token = getToken()
        if (loginParams) {
            store.dispatch('_user/login', loginParams).then(res=>{
                if(res.invalid()){
                    console.log(111)
                    removeLoginParams()
                    router.push({name:'Login',query:{back: encodeURIComponent(route.path)}})
                }
            })
        } else if(token){
            store.dispatch('_user/findCustomerInfo')
        }
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

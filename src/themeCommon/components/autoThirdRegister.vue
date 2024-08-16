<template>
    <div :style="{ width: 0, height: 0, overflow: 'hidden' }">
        <LoginByGoogle v-if="isShow && pageWL" />
    </div>
</template>

<script>
import LoginByGoogle from '@/themeCommon/user/login/components/loginByGoogle.vue'
import { getCookie, isMobile, sessionGet } from '@/utils/util'
import { computed, reactive, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
export default {
    components: {
        LoginByGoogle
    },
    setup() {
        const store = useStore()
        store.dispatch('_base/getLoginConfig')
        const isTGweb = sessionGet('isTGweb') == '1'
        const customerInfo = computed(() => store.state._user.customerInfo)
        const loginLoading = computed(() => store.state._user.loginLoading)
        const thirdLoginArr = computed(() => store.state._base.wpCompanyInfo?.thirdLogin || [])
        const path = location.pathname.replace(`/${getCookie('lang')}`, '')
        const pageWL = ['/home'].includes(path)
        
        const currentPopup = computed(() => store.state._user.currentPopup)
        
        const state = reactive({
            isShow: false
        })

        watch(() => [loginLoading.value, customerInfo.value, isTGweb, thirdLoginArr.value, currentPopup.value], () => {
            state.isShow = !loginLoading.value && !customerInfo.value && !isTGweb && thirdLoginArr.value?.includes('google') && currentPopup.value === 'drainaged'
        }, {
            immediate: true
        })

        watch(() => state.isShow, () => {
            window?.printLog(state, customerInfo, loginLoading, thirdLoginArr)
        })

        return {
            pageWL,
            ...toRefs(state)
        }
    },
}
</script>
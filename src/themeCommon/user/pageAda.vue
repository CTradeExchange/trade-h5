<template>
    <iframe v-if="srcHref" :src="srcHref" class="iframe_service"></iframe>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { getCookie } from '@/utils/util';
export default {
    setup () {
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const { isUniapp, url, ...params } = route.query
        const customerInfo = computed(() => store.state._user.customerInfo)
        const { email, emailAll, customerNo, phone, phoneAll } = customerInfo.value || {};
        const onlineService = computed(() => store.state._base.wpCompanyInfo?.onlineService)
        const flag = onlineService.value?.indexOf('im.headline.net/im') > -1
        let srcHref = url ? decodeURIComponent(url) : onlineService.value || '';
        if (!onlineService.value && !customerNo) {
            router.replace('/login')
        } else if (!!srcHref && !flag) {
            if (srcHref?.indexOf('?') === -1) srcHref += '?'
            if (isUniapp) {
                srcHref += `&i=${params['i'] ?? ''}&n=${params['n'] ?? ''}&p=${params['p'] ?? ''}&l=${params['l'] ?? ''}`
            } else if (customerNo) {
                srcHref += `&i=${customerNo ?? ''}&n=${emailAll || email || ''}&p=${phoneAll || phone || ''}&l=${getCookie('lang')}`
            } else {
                router.replace('/login')
            }
        }
        return {
            srcHref,
        }
    }
}
</script>

<style lang="scss" scoped>
.iframe_service {
    width: 100%;
    height: 100%;
    border: none;
    box-shadow: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
}
</style>
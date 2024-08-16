<template>
    <div></div>
</template>

<!-- App嵌入webvie使用 -->
<script>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
export default {
    setup () {
        const store = useStore()
        const route = useRoute()
        const { isUniapp, ...params } = route.query
        const main_url = 'https://support.headline.net/jwt'
        const customerInfo = computed(() => store.state._user.customerInfo)
        const { email, emailAll, customerNo } = customerInfo.value || {};
        const obj = isUniapp ? (params || {}) : {
            return_to: encodeURIComponent('https://headline.zendesk.com/hc/zh-cn'),
            i: customerNo || '',
            n: emailAll || email,
            o: 'Headline'
        }
        const mergeUrl = (url, params) => {
            const resArr = Object.keys(params).map(i => `${i}=${params[i] || ''}`)
            return `${url}?${resArr.join('&')}`
        }
        onMounted(() => {
            const srcUrl = mergeUrl(main_url, obj)
            window.location.replace(srcUrl)
        })
    }
}
</script>
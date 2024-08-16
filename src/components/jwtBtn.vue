<template>
    <div class="jwt_box">
        <slot></slot>
        <iframe :src="srcUrl" class="jwt_iframe"></iframe>
    </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
export default {
    setup () {
        const store = useStore()
        const main_url = 'https://support.headline.net/jwt'
        const customerInfo = computed(() => store.state._user.customerInfo)
        const { email, emailAll, customerNo } = customerInfo.value || {};
        const obj = {
            return_to: encodeURIComponent('https://headline.zendesk.com/hc/zh-cn'),
            i: customerNo || '',
            n: emailAll || email,
            o: 'Headline',
            btn: 1
        }
        const mergeUrl = (url, params) => {
            const resArr = Object.keys(params).map(i => `${i}=${params[i] || ''}`)
            return `${url}?${resArr.join('&')}`
        }
        const srcUrl = computed(() => mergeUrl(main_url, obj))

        return {
            srcUrl,
            customerInfo
        }
    }
    
}
</script>

<style lang="scss" scoped>
    .jwt_box {
        position: relative;
        cursor: pointer;
    }
    .jwt_iframe {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        opacity: 0.00001;
    }
</style>
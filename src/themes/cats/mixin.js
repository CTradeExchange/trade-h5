import { getQueryVariable } from '@/utils/util'
/* 全局mixin */
export default {
    computed: {
        $style () {
            return this.$store.state.style
        },
        accountCurrency () {
            return this.$store.state._user.customerInfo?.currency
        }
    },
    methods: {
        // 用iframe打开url地址
        openUrl (url, pageTitle = '') {
            if (pageTitle === '' && getQueryVariable('title', url)) pageTitle = getQueryVariable('title', url)
            this.$router.push({
                name: 'Otherpage',
                params: { type: 'page' },
                query: {
                    url: encodeURIComponent(url),
                    pageTitle,
                }
            })
        }
    }
}

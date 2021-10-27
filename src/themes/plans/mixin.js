import { getQueryVariable } from '@/utils/util'
import dayjs from 'dayjs'
/* 全局mixin */
export default {
    data () {
        return {
            h5Preview: false
        }
    },
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
        // openUrl (url, pageTitle = '') {
        //     if (pageTitle === '' && getQueryVariable('title', url)) pageTitle = getQueryVariable('title', url)
        //     this.$router.push({
        //         name: 'Otherpage',
        //         params: { type: 'page' },
        //         query: {
        //             url: encodeURIComponent(url),
        //             pageTitle,
        //         }
        //     })
        // },
        // 用wp配置的URL
        openUrl (toRoute) {
            if (toRoute.href.name === 'Nest') {
                toRoute.href.params.type = 'otherPage'
                toRoute.href.query.url && this.$router.push(toRoute.href)
            } else {
                this.$router.push({ name: toRoute.href.name })
            }
        },
        // 日期时间格式化
        formatTime (val, fmt = 'YYYY-MM-DD HH:mm:ss') {
            return dayjs(val).format(fmt)
        }
    }
}

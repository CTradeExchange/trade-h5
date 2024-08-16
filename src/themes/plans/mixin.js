import { getQueryVariable, getCookie } from '@/utils/util'
import { baseLangURL } from '@/api/information'

/* 全局mixin */
export default {
    data () {
        return {
            h5Preview: false,
            passtoAIChatTimer: null
        }
    },
    computed: {
        $style () {
            return this.$store.state.style
        },
        $hasNav () {
            return this.$store.state._base.wpNav?.length
        },
        accountCurrency () {
            return this.$store.state._user.customerInfo?.currency
        }
    },
    methods: {
        // 用iframe打开url地址
        openOuterUrl (data) {
            let lang = getCookie('lang') || this.$route.query.lang
            if (lang === 'th-TH') lang = 'en-US'
            let pageTitle = data.title
            const url = baseLangURL[data.newsArea][lang] + `/article?id=${data.id}&orgid=${data.orgid}`
            const { isUniapp } = this.$route.query
            if (pageTitle === '' && getQueryVariable('title', url)) pageTitle = getQueryVariable('title', url)
            if (isUniapp) {
                uni.postMessage({
                    data: {
                        action: 'message',
                        type: 'open_new_page',
                        params: {
                            title: pageTitle,
                            url
                        }
                    }
                })
            } else {
                this.$router.push({
                    name: 'Otherpage',
                    params: { type: 'page' },
                    query: {
                        url: encodeURIComponent(url),
                        pageTitle,
                    }
                })
            }
        },
        // 用wp配置的URL
        openUrl (toRoute) {
            const { isUniapp } = this.$route.query
            const { query, href, params } = toRoute || {}

            if (isUniapp && uni) {
                uni.postMessage({
                    data: {
                        action: 'message',
                        type: 'module_click',
                        params: {
                            data: toRoute.href
                        }
                    }
                })
            } else {
                if (toRoute.href.name === 'Nest') {
                    toRoute.href.params.type = 'otherPage'
                    toRoute.href.query.url && this.$router.push(toRoute.href)
                } else {
                    const obj = { name: href.name }
                    if (query) obj.query = query
                    if (params) obj.params = params
                    this.$router.push(obj)
                }
            }
        },
        // 日期时间格式化
        formatTime (val, fmt = 'YYYY-MM-DD HH:mm:ss') {
            return window.dayjs(val).format(fmt)
        },
        // 显示隐藏PasstoAI客服
        openPasstoAIChat () {
            clearTimeout(this.passtoAIChatTimer)
            const chart = document.getElementById('PasstoAI-chat-container')
            if (chart) {
                chart.style.display = 'block'
            } else {
                this.passtoAIChatTimer = setTimeout(() => {
                    chart.style.display = 'block'
                }, 5000)
            }
        }
    }
}

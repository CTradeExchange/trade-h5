import dayjs from 'dayjs'
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
        accountCurrency () {
            return this.$store.state._user.customerInfo?.currency
        }
    },
    methods: {
        // 用wp配置的URL
        openUrl (toRoute) {
            if (toRoute.href.name === 'Nest') {
                toRoute.href.params.type = 'otherPage'
                // this.$router.push(toRoute.href)
                if (toRoute.href.query?.url) window.open(toRoute.href.query.url)
            } else {
                this.$router.push({ name: toRoute.href.name })
            }
        },
        // 日期时间格式化
        formatTime (val, fmt = 'YYYY-MM-DD HH:mm:ss') {
            return dayjs(val).format(fmt)
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

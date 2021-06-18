<template>
    <Top ref='top' />
    <div id='homeContent' ref='homeContent' class='container'>
        <div id='inflow2App' ref='inflow2App'>
            <!-- <demo :orgid="orgid" lang="zh-cn"></demo> -->
        </div>
    </div>
    <footerMenu id='footerMenu' class='footerMenu' />
</template>

<script>
import Top from '@c/layout/top'
import footerMenu from '@c/layout/footerMenu'
import loadScript from '@/utils/loadScript'
import loadCSS from '@/utils/loadCSS'
import { isEmpty, removeLoginParams, localSet, localGet } from '@/utils/util'
import { useI18n } from 'vue-i18n'
let loaded = false
let scrollTop = 0
export default {
    name: 'News',
    components: {
        Top,
        footerMenu,
    },
    activated () {
        const homeContent = this.$refs.homeContent
        const _this = this
        homeContent.scrollTop = scrollTop
        // 未启用新闻跳转首页
        if (!isEmpty(localGet('openNews'))) {
            if (!JSON.parse(localGet('openNews'))) {
                _this.$router.push('/')
            }
        }
    },
    mounted () {
        const _this = this
        const { t } = useI18n({ useScope: 'global' })
        window['IX_postMessage'] = (win => {
            function IX_postMessage () {
                this.domain = ''
                this.key = ''
                this.inIframe = !(window.self === window.top)
                this.callback = {}
            }
            IX_postMessage.prototype.toMiddlePage = function (data) {
                _this.$router.push({
                    name: 'Otherpage',
                    params: { type: 'page' },
                    query: {
                        url: encodeURIComponent(data.query.url),
                        pageTitle: t('infos')
                    }
                })
            }
            return new IX_postMessage()
        })(window)
        this.init()
        this.writeTop()
    },
    unmounted () {
        const homeContent = this.$refs.homeContent
        homeContent.removeEventListener('scroll', this.scrollFn, false)
    },
    methods: {
        init () {
            const jsCode = [
                'https://zixuninfo.oss-cn-hangzhou.aliyuncs.com/v2md/vue.js',
                'https://zixuninfo.oss-cn-hangzhou.aliyuncs.com/v2md/vant.min.js',
                'https://zixuninfo.oss-cn-hangzhou.aliyuncs.com/v2md/prodcn/wequickNewsList.umd.min.js'
            ]
            const cssCode = 'https://zixuninfo.oss-cn-hangzhou.aliyuncs.com/v2md/prodcn/wequickNewsList.css'
            if (loaded) {
                setTimeout(() => {
                    this.initInflow()
                }, 100)
            } else {
                const loadList = jsCode.reduce((acc, item) => {
                    acc.push(loadScript(item))
                    return acc
                }, [])
                loadList.push(loadCSS(cssCode))

                Promise.all(loadList).then(res => {
                    loaded = true
                    this.initInflow()
                })
            }
        },
        // 初始化信息流组件
        initInflow () {
            this.$refs.inflow2App.innerHTML = '<demo :orgid="3" lang="zh"></demo>'
            new window.Vue({
                components: {
                    demo: window.wequickNewsList
                }
            }).$mount('#inflow2App')
        },
        // 记录信息流的滚动条，保留上次滑动的位置
        writeTop () {
            const homeContent = this.$refs.homeContent
            this.scrollFn = evt => {
                scrollTop = evt.target.scrollTop
            }
            homeContent.addEventListener('scroll', this.scrollFn, false)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.container {
    flex: 1;
    margin-bottom: rem(100px);
    overflow-y: auto;
}
</style>

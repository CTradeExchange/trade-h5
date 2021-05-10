<template>
    <Top />
    <div id='homeContent' class='container'>
        <div id='inflow2App' ref='inflow2App'>
            <!-- <demo :orgid="orgid" lang="zh-cn"></demo> -->
        </div>
    </div>
</template>

<script>
import Top from '@m/layout/top'
import loadScript from '@/utils/loadScript'
import loadCSS from '@/utils/loadCSS'
let loaded = false
export default {
    name: 'News',
    components: {
        Top,
    },
    mounted () {
        this.init()
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
            this.$refs.inflow2App.innerHTML = '<demo :orgid="3" lang="zh-cn"></demo>'
            new Vue({
                components: {
                    demo: wequickNewsList
                }
            }).$mount('#inflow2App')
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

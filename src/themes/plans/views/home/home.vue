<template>
    <div id='homeContent' ref='homeContent' class='home' :class='{ hasNav: $hasNav }'>
        <PageComp :data='pageModules' />
    </div>
</template>

<script>
import { QuoteSocket } from '@/plugins/socket/socket'
import { onActivated, computed, ref, toRefs, reactive } from 'vue'
import { useStore } from 'vuex'

export default {
    name: 'Home',
    setup () {
        const store = useStore()
        const pageModules = ref([])
        const customerGroupId = computed(() => store.getters.customerGroupId)
        // 暂时只在319公司显示
        const isCompanyIdShow = computed(() => Number(store.state._base.wpCompanyInfo.companyId) === 319)

        const state = reactive({
            data: {
                loop: true,
                items: [
                    {
                        src: require('@plans/images/banner/banner1.jpg'),
                        href: { 'name': 'Quote' }
                    },
                    {
                        src: require('@plans/images/banner/banner2.jpg'),
                        href: { 'name': 'Quote' }
                    },
                    {
                        src: require('@plans/images/banner/banner3.jpg'),
                        href: { 'name': 'Quote' }
                    }
                ]
            }
        })
        const products = []

        // 产品订阅
        const sendSubscribe = () => {
            if (products.length > 0) QuoteSocket.send_subscribe(products)
        }
        store.dispatch('_base/getPageConfig', 'Home').then(res => {
            console.log(res)
            pageModules.value = res

            // 找到行情模块的产品，并开始订阅
            const productModule = res.filter(el => ['productsSwipe', 'productsTimeSharing'].includes(el.tag))
            if (productModule.length > 0) {
                productModule.forEach(el => {
                    const symbolKeys = Object.entries(el.data.product || {}).map(([tradeType, item]) => {
                        const list = item[customerGroupId.value] || []
                        return list.map(symbolId => `${symbolId}_${tradeType}`)
                    }).flat()
                    products.push(...symbolKeys)
                })
                sendSubscribe()
            }
        })

        onActivated(() => {
            // 订阅产品
            sendSubscribe()
        })
        return {
            pageModules,
            isCompanyIdShow,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped >
@import '~@/sass/mixin.scss';
.home {
    height: 100%;
    //overflow: auto;
    background: var(--contentColor);
    &.hasNav{
        margin-bottom: rem(80px);
    }
}
.noticeBar,
.newBar {
    margin-top: rem(20px);
}
</style>

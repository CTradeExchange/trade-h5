<template>
    <div class='page-wrap'>
        <PageComp :data='pageModules' />
        <div class='support'>
            Trade Switcher提供技术支持<br /> tradeswitcher.com
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
export default {
    setup () {
        const pageModules = ref([])
        const store = useStore()
        store.dispatch('_base/getPageConfig', 'Mine').then(res => {
            console.log('pageModules', res)
            pageModules.value = res
        })
        return {
            pageModules,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    height: 100%;
    padding-bottom: rem(100px);
    overflow: auto;
    background: var(--bgColor);
    .support {
        position: absolute;
        bottom: rem(120px);
        width: 100%;
        color: var(--placeholdColor);
        font-size: rem(20px);
        line-height: rem(40px);
        text-align: center;
    }
}

</style>

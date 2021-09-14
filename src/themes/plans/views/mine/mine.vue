<template>
    <div class='page-wrap'>
        <PageComp :data='pageModules' />
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
            console.log(res)
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
}

</style>

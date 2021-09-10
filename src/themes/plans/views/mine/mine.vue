<template>
    <div class='page-wrap'>
        <PageComp :data='pageModules' />
        <!-- <Person />
        <Menulist /> -->
    </div>
</template>

<script>
import { pageConfig } from '@/api/wpApi'
import Person from './components/person'
import Menulist from './components/menulist'
import { ref } from 'vue'
export default {
    components: {
        Person,
        Menulist,
    },
    setup () {
        const pageModules = ref([])
        pageConfig('Mine').then(res => {
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

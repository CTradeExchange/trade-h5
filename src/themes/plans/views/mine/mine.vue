<template>
    <div class='page-wrap' :class='{ hasNav: $hasNav }'>
        <PageComp :data='pageModules' />
        <div class='support'>
            <img alt='' src='/images/support.png' />
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
    overflow: auto;
    background: var(--bgColor);
    &.hasNav{
        padding-bottom: rem(100px);
        .support{
            bottom: rem(120px);
        }
    }
    .support {
        position: absolute;
        bottom: rem(20px);
        width: rem(200px);
        color: var(--placeholdColor);
        font-size: rem(20px);
        line-height: rem(32px);
        text-align: center;
        left: 50%;
        margin-left: -(rem(100px));
        img{
            width: 100%;
        }
    }
}

</style>

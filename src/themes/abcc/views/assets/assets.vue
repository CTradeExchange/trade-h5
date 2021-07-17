<template>
    <div class='assetsWrapper'>
        <AssetsItem class='block' />
        <AssetsItem class='block' />
        <AssetsItem class='block' />
        <AssetsItem class='block'  ></AssetsItem>
        as
    </div>asdas
</template>

<script>
import AssetsItem from './components/assetsItem.vue'
// import { reactive, toRefs } from 'vue'
// import { useStore } from 'vuex'
export default {
    components: {
        AssetsItem,
    },
    setup () {
        // const store = useStore()

        return {}
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.assetsWrapper {
    padding: rem(20px);

    .block {
        margin-bottom: rem(20px);
    }
}
</style>

<template>
    <router-view />
    <div class='quote'>
        <!-- <TopModule /> -->
        <Content />
    </div>
</template>

<script setup>
import TopModule from './components/TopModule'
import Content from './components/Content'
import { computed } from 'vue'
import { useStore } from 'vuex'
const store = useStore()
const productMap = computed(() => store.state._quote.productMap)
console.log('productMap', productMap)
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.quote{
    width: 1200px;
    margin: 20px auto;
}
</style>

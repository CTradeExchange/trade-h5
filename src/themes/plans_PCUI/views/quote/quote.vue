<template>
    <div class='quote'>
        <TopModule />
        <Content />
    </div>
</template>

<script setup>
import TopModule from './components/TopModule'
import Content from './components/Content'
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.quote{
    width: 1200px;
    margin: 20px auto;
}
</style>

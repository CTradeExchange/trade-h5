<template>
    <div class='pageWrapp'>
        <LayoutTop :back='true' :menu='false' :title='pageTitle' />
        <applyRecord v-if="$route.query.direction==='buy'" />
        <redeemRecord v-else />
    </div>
</template>

<script setup>
import applyRecord from './components/applyRecord.vue'
import redeemRecord from './components/redeemRecord.vue'
import hooks from './hooks'

const { pageTitle } = hooks()
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.pageWrapp{
    margin-top: rem(110px);
    overflow: hidden;
    height: 100%;
}

</style>

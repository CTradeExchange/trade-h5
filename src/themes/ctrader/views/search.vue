<template>
    <div class='search'>
        <Top back />
        搜索
    </div>
</template>

<script>
import Top from '@ct/layout/top'
export default {
    components: {
        Top
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.search{
    height: 100%;
}
</style>

<template>
    <Top back='true' :menu='false' title='' />
    <div class='page-wrap'>
        <p>保证金水平</p>
        <van-progress
            color='#52C41A'
            :percentage='75'
            pivot-color='#7232dd'
            show-pivot='false'
        />
    </div>
</template>

<script>
import Top from '@m/layout/top'
import { toRefs, reactive, ref } from 'vue'
export default {
    components: {
        Top
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
</style>

<template>
    <Top back='true' :menu='false' title='' />
    <div class='page-wrap'>
        444
    </div>
</template>

<script>
import Top from '@m/layout/top'
import { toRefs, reactive, ref } from 'vue'
export default {
    components: {
        Top
    },
    setup (props) {
        const state = reactive({

        })
        return {
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    flex: 1;
    overflow: auto;
}
</style>

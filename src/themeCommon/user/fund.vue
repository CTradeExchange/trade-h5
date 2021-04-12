<template>
    <Top back='true' :menu='false' title='' />
    <div class='page-wrap'>
        <div class='header-info'>
            <p class='t1'>
                保证金水平
            </p>
            <p class='t2'>
                850%
            </p>
        </div>

        <div class='progress'>
            <div class='p-val'></div>
        </div>
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
.page-wrap {
    flex: 1;
    padding: rem(30px);
    overflow: auto;
    .header-info {
        display: flex;
        justify-content: space-between;
        .t1 {
            color: var(--color);
            font-size: rem(28px);
        }
        .t2 {
            color: #52C41A;
            font-size: rem(50px);
        }
    }
    .progress {
        position: relative;
        width: 100%;
        height: rem(10px);
        margin-top: rem(20px);
        background: var(--btnColor);
        border-radius: rem(20px);
        .p-val {
            position: absolute;
            width: 85%;
            height: rem(10px);
            background-color: #52C41A;
            border-radius: rem(20px);
        }
    }
}
</style>

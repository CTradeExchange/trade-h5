<template>
    <Top back='true' :menu='false' title='' />
    <div class='page-wrap'>
        <van-cell-group>
            <van-cell is-link title='身份验证' to='/authentication' />
            <van-cell is-link title='银行卡列表' to='/bankList' />
        </van-cell-group>
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

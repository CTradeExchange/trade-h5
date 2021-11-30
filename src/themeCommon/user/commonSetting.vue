<template>
    <div class='page-wrap'>
        <Top back />
        <p class='header'>
            {{ $t('cRoute.commonSetting') }}
        </p>
        <van-cell-group class='cellGroup'>
            <van-cell
                class='cellItem'
                is-link
                :title='$t("common.lang")'
                to='/bindMobile'
            >
                <template #right-icon>
                </template>
            </van-cell>
            <van-cell
                class='cellItem'
                is-link
                title='黑夜模式'
            >
                <template #right-icon>
                    <van-switch v-model='theme' size='24px' />
                </template>
            </van-cell>
            <van-cell
                class='cellItem'
                is-link
                title='红涨绿跌'
                to='/bindMobile'
            >
                <template #right-icon>
                    <van-switch v-model='theme' size='24px' />
                </template>
            </van-cell>
        </van-cell-group>
    </div>
</template>

<script>
import Top from '@/components/top'
import { onBeforeMount, computed, reactive, toRefs, onUnmounted } from 'vue'
export default {
    components: { Top },
    setup (props, context) {
        const state = reactive({
            theme: false
        })
        return {
            ...toRefs(state)
        }
    },
}
</script>

<style lang='scss' scoped>
@import '@/sass/mixin.scss';
.page-wrap{
    .header{
        background: var(--contentColor);
        font-size: rem(48px);
        font-weight: bold;
        padding-left: rem(30px);
        padding-bottom: rem(30px);
    }
}
</style>

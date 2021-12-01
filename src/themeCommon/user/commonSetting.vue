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
                    <img alt='' class='lang-icon' :src="'/images/country_icon/'+ lang + '.png'" />
                    <van-icon name='arrow' />
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
import { useStore } from 'vuex'
import { getCookie } from '@/utils/util'
import { onBeforeMount, computed, reactive, toRefs, onUnmounted } from 'vue'
export default {
    components: { Top },
    setup (props, context) {
        const store = useStore()
        const state = reactive({
            theme: false,
            lang: getCookie('lang') || store.state._base.wpCompanyInfo.language,
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
    .cellGroup{
        .cellItem {
            font-size: rem(32px);
            font-weight: bold;
            line-height: rem(120px);
            height: rem(120px);
            border-top: solid rem(10px) var(--bgColor);
            background: none;
            display: flex;
            align-items: center;
            //margin-top: rem(10px);
            &::after{
                border: none;
            }
            .lang-icon{
                width: rem(70px);
                margin-right: rem(20px);
            }
        }
    }
}
</style>

<template>
    <Top back='true' :menu='false' title='' />
    <div class='page-wrap'>
        <van-field v-model='userName' label='姓名' placeholder='请输入您的姓名' type='text' />
        <van-field v-model='userId' label='身份证' placeholder='请输入您的身份证号' type='text' />
        <van-button class='confirm-btn' @click='onConfirm'>
            提交
        </van-button>
    </div>
</template>

<script>
import Top from '@m/layout/top'
import { toRefs, reactive, ref } from 'vue'
import { Toast } from 'vant'
export default {
    components: {
        Top
    },
    setup (props) {
        const state = reactive({
            userName: '',
            userId: ''
        })

        const onConfirm = () => {
            Toast('认证成功')
        }
        return {
            onConfirm,
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
    .confirm-btn {
        position: absolute;
        bottom: 0;
        width: 100%;
        color: var(--color);
        font-size: rem(34px);
        background: var(--btnColor);
    }
}
</style>

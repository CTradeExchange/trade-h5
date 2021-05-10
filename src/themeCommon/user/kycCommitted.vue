<template>
    <div class='pageWrap'>
        <i class='icon_success'></i>
        <p class='t1'>
            资料已成功提交，感谢您的配合，我们将尽快完成审核！
        </p>

        <p class='t2'>
            资料审核通过前您可以通过注册时填写的【手机号/邮箱+验证码】登录系统查看审核进度
        </p>

        <div class='btns'>
            <!-- <van-button hairline plain type='success' @click='$router.replace({ name: "Quote" })'>
                先行体验
            </van-button> -->
            <van-button hairline plain type='default' @click='$router.push({ name: "Authentication" })'>
                查看进度
            </van-button>
        </div>
    </div>
</template>

<script>
import { useRouter } from 'vue-router'
export default {
    setup (props, context) {
        const router = useRouter()
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.pageWrap {
    padding: rem(200px) rem(30px) rem(30px);
    text-align: center;
    .icon_success {
        color: var(--success);
        font-size: rem(96px);
    }
    .t1 {
        margin-top: rem(20px);
        font-weight: bold;
        font-size: rem(36px);
    }
    .t2 {
        margin-top: rem(100px);
        line-height: rem(50px);
        text-align: left;
    }
    .btns {
        display: flex;
        justify-content: space-around;
        margin-top: rem(50px);
    }
}

</style>

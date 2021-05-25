<template>
    <div class='wrap'>
        <i class='icon_success'></i>
        <p class='t1'>
            恭喜！新密码重设成功
        </p>
        <p class='t2'>
            请使用新密码进行登录
        </p>
        <p class='t3'>
            出于账户安全考虑，最近24小时将不能取款
        </p>
    </div>
    <van-button class='confirmBtn' @click='toLogin'>
        去登录
    </van-button>
</template>

<script>
import { useRouter } from 'vue-router'
import { removeLoginParams } from '@/utils/util'
import { useStore } from 'vuex'
export default {
    setup (props) {
        const store = useStore()
        const router = useRouter()
        const toLogin = () => {
            removeLoginParams()
            store.dispatch('_user/logout')
            router.push('/login')
        }

        return {
            toLogin
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.wrap {
    padding-top: rem(240px);
    text-align: center;
    .icon_success {
        color: var(--success);
        font-size: rem(96px);
    }
    .t1 {
        margin-top: rem(40px);
        color: var(--color);
        font-size: rem(46px);
    }
    .t2 {
        margin-top: rem(20px);
        color: var(--color);
        font-size: rem(24px);
    }
    .t3 {
        margin-top: rem(30px);
        color: var(--assistColor);
        font-size: rem(24px);
    }
}
.confirmBtn {
    position: absolute;
    bottom: 0;
    width: 100%;
    background: var(--bdColor);
    border-color: var(--bdColor);
    span {
        color: var(--color);
        font-size: rem(34px);
    }
}
</style>

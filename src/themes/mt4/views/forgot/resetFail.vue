<template>
    <div class='wrap'>
        <i class='icon_fail'></i>
        <p class='t1'>
            糟糕！您的新密码设置失败
        </p>
        <p class='t2'>
            请稍后再试，或联系在线客服
        </p>
    </div>
    <div class='footer-bottom'>
        <van-button class='confirmBtn' @click='$router.push("/forgot")'>
            再试试
        </van-button>
        <span class='line'></span>
        <van-button class='confirmBtn' @click='toService'>
            在线客服
        </van-button>
    </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
export default {
    setup (props) {
        const router = useRouter()
        const store = useStore()
        const onlineServices = computed(() => store.state._base.wpCompanyInfo?.onlineService)
        const toService = () => {
            if (onlineServices.value) { location.href = onlineServices.value }
        }

        return {
            toService,
            onlineServices
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.wrap {
    padding-top: rem(240px);
    text-align: center;
    .icon_fail {
        color: var(--red);
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
.footer-bottom {
    position: absolute;
    bottom: 0;
    display: flex;
    align-items: center;
    width: 100%;
    background: var(--bdColor);
    .line {
        width: rem(2px);
        height: rem(47px);
        background: var(--placeholder);
    }
    .confirmBtn {
        flex: 1;
        background: var(--bdColor);
        border-color: var(--bdColor);
        span {
            color: var(--color);
            font-size: rem(34px);
        }
    }
}

</style>

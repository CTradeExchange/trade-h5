<template>
    <div class='pageWrap'>
        <topNav class='header' />
        <div class='container'>
            <div class='content'>
                <div class='wrap'>
                    <i class='icon_success'></i>
                    <p class='t1'>
                        {{ $t('forgot.newPwdSuccess') }}
                    </p>
                    <p class='t2'>
                        {{ $t('forgot.newPwdLogin') }}
                    </p>
                </div>
                <div class='confirm-div'>
                    <van-button block class='confirmBtn' @click='toLogin'>
                        <span>{{ $t('forgot.goLogin') }}</span>
                    </van-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { computed } from "vue";
import topNav from '@planspc/layout/topNav'
import { useRouter } from 'vue-router'
import { removeLoginParams } from '@/utils/util'
import { useStore } from 'vuex'
export default {
    name: 'ResetSuccess',
    components: {
        topNav
    },
    setup (props) {
        const store = useStore()
        const router = useRouter()
        const {value:loginQuery} = computed(() => store.state._user.loginQuery)

        const toLogin = () => {
            removeLoginParams()
            store.dispatch('_user/logout').then(() => {
                return  router.push(loginQuery)
            }).then(() => {
                location.reload()
            })
        }

        return {
            toLogin
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.pageWrap {
    position: relative;
    display: flex;
    flex-flow: column;
    height: 100%;
    background: var(--assistColor);
    background-image: url("../.././images/craigAbout/background.png");
    .container {
        display: flex;
        justify-content: center;
        overflow: auto;
        padding-top:40px;
        .content{
            width: 687px;
            padding: 50px 170px 50px 134px;
            background: var(--contentColor);
            box-shadow: 0px 6px 19px 2px rgb(0 0 0 / 8%);
        }
    }
}
.wrap {
    text-align: center;
    .icon_success {
        color: var(--success);
        font-size: 64px;
    }
    .t1 {
        margin-top: 20px;
        color: var(--color);
        font-size: 28px;
        font-weight: bold;
    }
    .t2 {
        margin-top: rem(20px);
        color: var(--color);
        font-size: 16px;
    }
    .t3 {
        margin-top: rem(30px);
        color: var(--minorColor);
        font-size: rem(24px);
    }
}
.confirm-div{
    padding: 0 36px;
}
.confirmBtn {
    height: 36px;
    margin-top: 60px;
    font-size: 16px;
    border-radius: 18px;
    background: var(--primary);
    color: var(--contentColor);
}
</style>

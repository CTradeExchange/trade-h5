<template>
    <section class='registerSuccess'>
        <div class='icon'>
            <i class='icon_chenggong'></i>
        </div>
        <div class='container'>
            <h2>恭喜！您的账号已经开立成功</h2>
            <p>
                客户编号：<span class='accountNo'>
                    {{ accountNo }}
                </span>
            </p>
        </div>
    </section>
    <p class='tips'>
        首次登录请使用注册填写的【手机/邮箱+验证码】登录
    </p>
    <div class='btnBox'>
        <button class='btn' @click='toExperience'>
            立即体验
        </button>
        <button class='highBtn' @click='toDesposit'>
            去存款
            <p class='smallRow'>
                <span>现在存款最高<i>赠1000USD</i></span>
            </p>
        </button>
    </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { getDevice, setToken } from '@/utils/util'
export default {
    setup () {
        const RegisterData = JSON.parse(sessionStorage.getItem('RegisterData')) ?? {}
        const RegisterParams = JSON.parse(sessionStorage.getItem('RegisterParams')) ?? {}
        const store = useStore()
        const router = useRouter()
        const onceState = reactive({
            accountNo: RegisterData.data?.customerNo
        })
        const token = RegisterData.data?.token
        if (token) setToken(token)
        const toExperience = () => {
            return router.replace({ name: 'Quote' })
        }
        const toDesposit = () => {
            return router.replace({ name: 'Desposit' })
        }

        return {
            ...onceState,
            toExperience,
            toDesposit
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.registerSuccess {
    display: flex;
    padding: rem(80px) rem(40px)  rem(40px);
    .icon {
        width: rem(200px);
        color: var(--success);
        font-size: rem(120px);
        text-align: center;
    }
    h2 {
        margin: rem(15px) 0 rem(20px);
        font-weight: normal;
        font-size: rem(32px);
    }
    .accountNo {
        color: var(--success);
    }
}
.tips {
    margin-top: rem(20px);
    color: var(--mutedColor);
    font-size: rem(26px);
    text-align: center;
}
.btnBox {
    display: flex;
    margin: rem(60px) rem(80px);
    text-align: center;
    .btn,
    .highBtn {
        @include active()
    ;
        flex: 1;
        height: rem(100px);
        margin-right: rem(20px);
        color: var(--primary);
        line-height: 1.5;
        background: #F3F8FE;
        border-radius: rem(10px);
    }
    .highBtn {
        color: var(--white);
        background: var(--primary);
    }
    .smallRow {
        font-size: rem(20px);
        i {
            color: #FFFC00;
        }
    }
}
</style>

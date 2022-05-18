<template>
    <div class='inFundManager'>
    </div>
</template>

<script>
import { reactive, ref, toRefs, computed, onMounted } from 'vue'

export default {
    name: 'V10InFundManager',
    setup () {
        const state = reactive({
            loading: false,
            accountType: 1, // 账户登录方式 1.普通登录 2.基金经理
            pwdVisible: false,
            loginPwdPop: false,
            sendVerifyLoading: false,
            loginName: '',
            pwd: '',
            googleCodeVis: '',
            checkCode: '',
            token: '', // 验证码token
            loginType: 'password', // password 密码登录   checkCode 验证码登录
        })

        return {
            ...toRefs(state),
        }
    }
}
</script>

<style lang="scss" scoped>
.login {
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    height: 100%;
    font-size: 14px;
    background: var(--bgColor);
    .footer {
        padding-bottom: 16px;
        color: var(--minorColor);
        font-size: 12px;
        text-align: center;
    }
    .main {
        width: 520px;
        margin: 0 auto;
        padding: 40px 60px 60px;
        background: var(--contentColor);
        border-radius: 10px;
    }

}
</style>

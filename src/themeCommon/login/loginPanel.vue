<template>
    <div>
        <form class='loginForm'>
            <div v-if="loginAccount==='mobile'" class='field'>
                <MobileInput v-model='mobile' v-model:zone='zone' clear placeholder='请输入手机号' />
            </div>
            <div v-else class='field'>
                <InputComp v-model='email' clear label='邮箱' />
            </div>
            <div v-if="loginType==='password'" class='field'>
                <InputComp v-model='pwd' v-model:zone='zone' clear label='密码' pwd />
            </div>
            <div v-else class='field'>
                <CheckCode v-model='checkCode' clear label='验证码' />
            </div>
            <div class='field toolWrap'>
                <van-checkbox v-model='savePwd' shape='square'>
                    保存密码
                </van-checkbox>
                <div class='tools'>
                    <router-link class='link' to='/register'>
                        我要注册
                    </router-link>
                    <i class='line'>
                        |
                    </i>
                    <router-link class='link' to='/forgot'>
                        忘记密码
                    </router-link>
                </div>
            </div>
            <van-button block class='loginBtn' type='primary' @click='loginHandle'>
                登录
            </van-button>
            <van-button block class='loginBtn light' @click='changeLoginType'>
                {{ loginType==='password'? '验证码快捷登录':'账号密码登录' }}
            </van-button>
        </form>
    </div>
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
export default {
    setup () {
        const state = reactive({
            pwdVisible: false,
            zone: 86,
            email: '',
            mobile: '13200001111',
            pwd: '',
            checkCode: '',
            savePwd: true,
            loginType: 'checkCode',
            loginAccount: 'mobile',
        })

        return {
            ...toRefs(state),
        }
    }
}
</script>

<style lang="scss" scoped>

</style>

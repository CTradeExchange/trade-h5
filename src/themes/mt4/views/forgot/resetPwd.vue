<template>
    <div class='pageWrap'>
        <top back :menu='false' />
        <!-- <a class='icon_icon_close_big' href='javascript:;' @click='$router.back()'></a> -->
        <header class='header'>
            <h1 class='pageTitle'>
                重置密码
            </h1>
            <h6>密码为6-16位数字或字母的组合</h6>
        </header>
        <van-cell-group>
            <div class='form-item'>
                <Field v-model='newPwd' label='' placeholder='请输入新密码' :type='newPwdVis ? "text" : "password"' />
                <span class='icon' :class="newPwdVis ? 'icon_eye': 'icon_eye-off'" @click='changeState("newPwdVis")'></span>
            </div>
            <div class='form-item'>
                <Field v-model='confirmPwd' label='' placeholder='请再次输入新密码' :type='confirmVis ? "text" : "password"' />
                <span class='icon' :class="confirmVis ? 'icon_eye': 'icon_eye-off'" @click='changeState("confirmVis")'></span>
            </div>
        </van-cell-group>
        <van-button class='confirmBtn' @click='handleConfirm'>
            确定
        </van-button>
    </div>
</template>

<script>
import top from '@/components/top'
import { reactive, toRefs } from 'vue'
import { Field, Toast } from 'vant'
import { useRouter } from 'vue-router'
import { findPwd } from '@/api/user'

export default {
    components: {
        top,
        Field
    },
    setup (props) {
        const router = useRouter()
        const state = reactive({
            newPwd: '',
            confirmPwd: '',
            newPwdVis: false,
            confirmVis: false
        })

        function changeState (type) {
            state[type] = !state[type]
        }

        function handleConfirm () {
            if (!state.newPwd) {
                return Toast('请输入新密码')
            }
            if (!state.confirmPwd) {
                return Toast('请输入确认密码')
            }
            if (state.newPwd !== state.confirmPwd) {
                return Toast('新密码和确认密码不同，请检查后重新输入')
            }

            return findPwd({
                type: 1,
                loginName: '',
                companyId: '',
                verifyCode: '',
                newPwd: ''

            }).then((res) => {
                if (res.check()) {
                    router.push('/resetSuccess')
                }
            })
        }

        return {
            ...toRefs(state),
            changeState,
            handleConfirm
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.pageWrap {
    position: relative;
    height: 100%;
    .header {
        // display: flex;
        align-items: center;
        justify-content: space-between;
        margin: rem(40px) rem(30px);
    }
    .pageTitle {
        font-weight: normal;
        font-size: rem(50px);
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
    .form-item {
        position: relative;
        .icon {
            position: absolute;
            top: rem(25px);
            right: rem(50px);
            z-index: 99;
            cursor: pointer;
            &::before {
                font-size: rem(30px);
            }
        }
    }
}
</style>

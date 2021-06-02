<template>
    <div class='pageWrap'>
        <Top back left-icon='arrow-left' :menu='false' :right-action='false'>
            <template #right>
            </template>
        </Top>
        <header class='header'>
            <h1 class='pageTitle'>
                {{ isFirstSet ? '设置' : '修改' }}登录密码
            </h1>
            <h6>密码为6-16位数字或字母的组合</h6>
        </header>
        <van-cell-group>
            <div v-if='!isFirstSet' class='form-item'>
                <van-field v-model='oldPwd' label='' placeholder='请输入原密码' :type='oldPwdVis ? "text" : "password"' />
                <span class='icon' :class="oldPwdVis ? 'icon_eye': 'icon_eye-off'" @click='changeState("oldPwdVis")'></span>
            </div>
            <div class='form-item'>
                <van-field v-model='newPwd' label='' placeholder='请输入新密码' :type='newPwdVis ? "text" : "password"' />
                <span class='icon' :class="newPwdVis ? 'icon_eye': 'icon_eye-off'" @click='changeState("newPwdVis")'></span>
            </div>
            <div class='form-item'>
                <van-field v-model='confirmPwd' label='' placeholder='请再次输入新密码' :type='confirmVis ? "text" : "password"' />
                <span class='icon' :class="confirmVis ? 'icon_eye': 'icon_eye-off'" @click='changeState("confirmVis")'></span>
            </div>
        </van-cell-group>
        <van-button class='confirmBtn' @click='handleConfirm'>
            确定
        </van-button>
    </div>
</template>

<script>
import Top from '@/components/top'
import { reactive, toRefs, computed } from 'vue'
import { Toast, Dialog } from 'vant'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { setLoginPwd, modifyLoginPwd } from '@/api/user'
import md5 from 'js-md5'

export default {
    components: {
        Top,
        Toast,
        Dialog
    },
    setup (props) {
        const store = useStore()
        const router = useRouter()
        const route = useRoute()

        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)

        const isFirstSet = computed(() => Number(customInfo.value.loginPassStatus) === 1)

        const state = reactive({
            newPwd: '',
            confirmPwd: '',
            oldPwd: '',
            newPwdVis: false,
            confirmVis: false,
            oldPwdVis: false
        })

        function changeState (type) {
            state[type] = !state[type]
        }

        function handleConfirm () {
            const pwdReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
            if (!state.oldPwd && !isFirstSet.value) {
                return Toast('请输入原密码')
            }
            if (!state.newPwd) {
                return Toast('请输入新密码')
            }
            if (!state.confirmPwd) {
                return Toast('请输入确认密码')
            }
            if (!pwdReg.test(state.newPwd)) {
                return Toast('密码为6-16位数字或字母的组合')
            }

            if (state.newPwd !== state.confirmPwd) {
                return Toast('新密码和确认密码不同，请检查后重新输入')
            }

            const toast = Toast.loading({
                message: '加载中...',
                forbidClick: true,
            })

            if (isFirstSet.value) {
                setLoginPwd({
                    pwd: md5(state.confirmPwd)
                }).then(res => {
                    toast.clear()
                    if (res.check()) {
                        Toast('设置成功')
                        store.dispatch('_user/findCustomerInfo')
                        router.back()
                    }
                })
            } else {
                modifyLoginPwd({
                    oldPwd: md5(state.oldPwd),
                    newPwd: md5(state.confirmPwd)
                }).then((res) => {
                    if (isFirstSet.value) {
                        if (res.check()) {
                            router.push('/resetSuccess')
                        } else {
                            router.push('/resetFail')
                        }
                    } else {
                        if (res.check()) {
                            store.dispatch('_user/findCustomerInfo')
                            Dialog.alert({
                                theme: 'round-button',
                                title: '提示',
                                message: '密码修改成功',
                                confirmButtonText: '去登录'
                            }).then(() => {
                                // 注销登录
                                store.dispatch('_user/logout')
                            })
                        }
                    }
                })
            }
        }

        return {
            ...toRefs(state),
            changeState,
            customInfo,
            isFirstSet,
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
        margin-bottom: rem(10px);
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

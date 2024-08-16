<template>
    <div class='pageWrap'>
        <LayoutTop bottomLine />
        <h1 class='pageTitle'>
            {{ $t(isFirstSet ? "common.settings" : 'common.modify') + $t("login.loginPwd") }}
        </h1>
        <h6 class="pageTip">{{ $t('forgot.pwdRule') }}</h6>
        <van-cell-group>
            <div v-if='!isFirstSet' class='form-item'>
                <van-field v-model='oldPwd' label='' :placeholder='$t("login.originPwd")' :type='oldPwdVis ? "text" : "password"' />
                <span class='icon' :class="oldPwdVis ? 'icon_icon_pressed': 'icon_icon_default'" @click='changeState("oldPwdVis")'></span>
            </div>
            <div class='form-item'>
                <van-field v-model='newPwd' label='' :placeholder='$t("forgot.inputNewPwd")' :type='newPwdVis ? "text" : "password"' />
                <span class='icon' :class="newPwdVis ? 'icon_icon_pressed': 'icon_icon_default'" @click='changeState("newPwdVis")'></span>
            </div>
            <div class='form-item'>
                <van-field v-model='confirmPwd' label='' :placeholder='$t("forgot.newPwdAgain")' :type='confirmVis ? "text" : "password"' />
                <span class='icon' :class="confirmVis ? 'icon_icon_pressed': 'icon_icon_default'" @click='changeState("confirmVis")'></span>
            </div>
            <div class='form-item form-item-google'>
                <googleVerifyCode
                    v-if='googleCodeVis'
                    @getGooleVerifyCode='getGooleVerifyCode'
                />
            </div>
        </van-cell-group>
        <van-button class='confirmBtn' @click='handleConfirm'>
            <span>{{ $t('common.sure') }}</span>
        </van-button>
    </div>
</template>

<script>
import { reactive, toRefs, computed } from 'vue'
import { Toast, Dialog } from 'vant'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { setLoginPwd, modifyLoginPwd } from '@/api/user'
import md5 from 'js-md5'
import { useI18n } from 'vue-i18n'
import googleVerifyCode from '@/themeCommon/components/googleVerifyCode.vue'
import { pwdReg } from '@/utils/util'

export default {
    components: {
        googleVerifyCode
    },
    setup (props) {
        const store = useStore()
        const router = useRouter()
        const route = useRoute()
        const { t } = useI18n({ useScope: 'global' })

        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)
        const googleCodeVis = computed(() => customInfo.value.googleId > 0)

        const isFirstSet = computed(() => Number(customInfo.value.loginPassStatus) === 1)

        const state = reactive({
            newPwd: '',
            confirmPwd: '',
            oldPwd: '',
            newPwdVis: false,
            confirmVis: false,
            oldPwdVis: false,
            googleCode: ''
        })

        function changeState (type) {
            state[type] = !state[type]
        }

        const getGooleVerifyCode = val => {
            state.googleCode = val
        }

        function handleConfirm () {
            if (!state.oldPwd && !isFirstSet.value) {
                return Toast(t('login.originPwd'))
            }
            if (!state.newPwd) {
                return Toast(t('forgot.inputNewPwd'))
            }
            if (!state.confirmPwd) {
                return Toast(t('forgot.inputSurePwd'))
            }
            if (!pwdReg.test(state.newPwd)) {
                return Toast(t('forgot.pwdRule'))
            }

            if (state.newPwd !== state.confirmPwd) {
                return Toast(t('forgot.pwdDiff'))
            }
            if (state.oldPwd === state.newPwd) {
                return Toast(t('forgot.pwdSame'))
            }
            if (googleCodeVis.value && !state.googleCode) {
                return Toast(t('common.inputGoogleCode'))
            }

            const toast = Toast.loading({
                message: t('common.loading'),
                forbidClick: true,
            })

            if (isFirstSet.value) {
                setLoginPwd({
                    pwd: md5(state.confirmPwd),
                    googleCode: state.googleCode
                }).then(res => {
                    toast.clear()
                    if (res.check()) {
                        Toast(t('common.setSuccess'))
                        store.dispatch('_user/findCustomerInfo')
                        router.back()
                    }
                })
            } else {
                modifyLoginPwd({
                    oldPwd: md5(state.oldPwd),
                    newPwd: md5(state.confirmPwd),
                    googleCode: state.googleCode
                }).then((res) => {
                    if (isFirstSet.value) {
                        if (res.check()) {
                            router.push('/resetSuccess')
                        } else {
                            router.push('/resetFail')
                        }
                    } else {
                        if (res.check()) {
                            Dialog.alert({
                                title: t('common.tip'),
                                message: t('login.pwdSuccess'),
                                confirmButtonText: t('forgot.goLogin')
                            }).then(() => {
                                // 注销登录
                                store.dispatch('_user/logout').then(() => {
                                    return router.push('/login')
                                }).then(() => {
                                    location.reload()
                                })
                            })
                        } else {
                            Toast(res.msg)
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
            handleConfirm,
            googleCodeVis,
            getGooleVerifyCode
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.pageWrap {
    position: relative;
    height: 100%;
    height: 100vh;
    background-color: var(--contentColor);
    .pageTitle {
        margin-top: rem(44px);
        padding: 0 rem(40px);
        font-size: rem(44px);
        font-weight: bold;
        color: var(--primaryText);
    }
    .pageTip {
        font-size: rem(20px);
        font-weight: bold;
        color: var(--primaryText);
        padding: rem(16px) rem(40px) 0;
    }
    .confirmBtn {
        width: calc(100% - rem(86px));
        height: rem(86px);
        font-size: rem(40px);
        line-height: rem(86px);
        color: var(--contentColor);
        background: var(--gradientColor);
        border-radius: rem(43px);
        margin: rem(65px) rem(40px) 0;
        border: none;
    }
    .form-item {
        position: relative;
        display: flex;
        align-items: center;
        .icon {
            position: absolute;
            top: rem(25px);
            right: rem(30px);
            z-index: 99;
            cursor: pointer;
            &::before {
                font-size: rem(30px);
            }
        }
        &.form-item-google{
            margin-left: rem(30px);
        }
    }
    :deep(.van-cell-group) {
        background: var(--contentColor);
        padding: rem(50px);
        &::after {
            border: none;
        }
        .van-cell {
            height: rem(86px);
            position: relative;
            display: flex;
            align-items: center;
            padding: 0 rem(20px);
            border-radius: rem(10px);
            background-color: var(--placeholdBg);
            overflow: hidden;
            margin-bottom: rem(54px);
            &::after {
                border: none;
            }
        }
    }
}
</style>

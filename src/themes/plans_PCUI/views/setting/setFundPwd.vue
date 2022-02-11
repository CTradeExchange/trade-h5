<template>
    <centerViewDialog>
        <div class='pageWrap'>
            <Top back left-icon='arrow-left' :right-action='false' show-center>
                <template #left>
                    <a class='topBack' href='javascript:;' @click='$router.back()'>
                        <span class='icon_icon_close_big'></span>
                    </a>
                </template>
                <template #right>
                </template>
            </Top>
            <header class='header'>
                <h1 class='pageTitle'>
                    {{ $t(isFirstSet ? "common.settings" : 'common.modify') + $t("common.fundPwd") }}
                </h1>
                <h6>{{ $t('common.fundPwdTip') }}</h6>
            </header>
            <van-cell-group>
                <div v-if='!isFirstSet' class='form-item'>
                    <van-field
                        v-model='oldPwd'
                        label=''
                        maxlength='6'
                        :placeholder='$t("login.originPwd")'
                        :type='oldPwdVis ? "text" : "password"'
                    />
                    <span class='icon' :class="oldPwdVis ? 'icon_eye': 'icon_eye-off'" @click='changeState("oldPwdVis")'></span>
                </div>
                <div class='form-item'>
                    <van-field
                        v-model='newPwd'
                        label=''
                        maxlength='6'
                        :placeholder='$t("forgot.inputNewPwd")'
                        :type='newPwdVis ? "text" : "password"'
                    />
                    <span class='icon' :class="newPwdVis ? 'icon_eye': 'icon_eye-off'" @click='changeState("newPwdVis")'></span>
                </div>
                <div class='form-item'>
                    <van-field
                        v-model='confirmPwd'
                        label=''
                        maxlength='6'
                        :placeholder='$t("forgot.newPwdAgain")'
                        :type='confirmVis ? "text" : "password"'
                    />
                    <span class='icon' :class="confirmVis ? 'icon_eye': 'icon_eye-off'" @click='changeState("confirmVis")'></span>
                </div>
            </van-cell-group>
            <van-button class='confirmBtn' @click='handleConfirm'>
                <span>{{ $t('common.sure') }}</span>
            </van-button>
        </div>
    </centerViewDialog>
</template>

<script>
import Top from '@/components/top'
import centerViewDialog from '@planspc/layout/centerViewDialog'
import { reactive, toRefs, computed } from 'vue'
import { Toast, Dialog } from 'vant'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { bindAssertsPwd, updateAssertsPwd } from '@/api/user'
import md5 from 'js-md5'
import { useI18n } from 'vue-i18n'

export default {
    components: {
        Top,
        centerViewDialog,
        Toast,
        Dialog
    },
    setup (props) {
        const store = useStore()
        const router = useRouter()
        const route = useRoute()
        const { t } = useI18n({ useScope: 'global' })

        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)

        const isFirstSet = computed(() => Number(customInfo.value.assertPassStatus) === 1)

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
        function formatter (value) {
            // 过滤输入的非数字
            return value.replace(/[^\d]/g, '')
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
            if (state.oldPwd.length !== 6 || state.newPwd.length !== 6 || state.confirmPwd.length !== 6) {
                return Toast(t('common.fundPwdTip'))
            }

            if (state.newPwd !== state.confirmPwd) {
                return Toast(t('forgot.pwdDiff'))
            }
            if (state.oldPwd === state.newPwd) {
                return Toast(t('forgot.pwdSame'))
            }

            const toast = Toast.loading({
                message: t('common.loading'),
                forbidClick: true,
            })

            if (isFirstSet.value) {
                bindAssertsPwd({
                    pwd: md5(state.confirmPwd)
                }).then(res => {
                    toast.clear()
                    if (res.check()) {
                        Toast(t('common.setSuccess'))
                        store.dispatch('_user/findCustomerInfo')
                        router.back()
                    }
                })
            } else {
                updateAssertsPwd({
                    oldPwd: md5(state.oldPwd),
                    newPwd: md5(state.confirmPwd)
                }).then((res) => {
                    toast.clear()
                    if (res.check()) {
                        Toast(t('common.setSuccess'))
                        store.dispatch('_user/findCustomerInfo')
                        router.back()
                    } else {
                        Toast(res.msg)
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
            formatter
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.pageWrap {
    position: relative;
    height: 100%;
    background-color: var(--bgColor);
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
        color: var(--color);
    }
    .confirmBtn {
        position: absolute;
        bottom: 0;
        width: 100%;
        background: var(--lineColor);
        border-color: var(--lineColor);
        span {
            color: var(--color);
            font-size: rem(30px);
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

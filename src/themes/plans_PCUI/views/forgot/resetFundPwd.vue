<template>
    <router-view />
    <div class='pageWrap'>
        <topNav class='header' />
        <div class='container'>
            <div class='content'>
                <!-- <a class='icon_icon_close_big' href='javascript:;' @click='$router.back()'></a> -->
                <Loading :show='loading' />
                <header class='header'>
                    <h1 class='pageTitle'>
                        {{ $t('forgot.forgotFund') }}
                    </h1>
                    <h6>{{ $t('common.fundPwdTip') }}</h6>
                </header>
                <van-cell-group>
                    <div class='form-item'>
                        <Field
                            v-model='newPwd'
                            :formatter='formatter'
                            fot
                            label=''
                            maxlength='6'
                            :placeholder='$t("forgot.inputNewPwd")'
                            :type='newPwdVis ? "text" : "password"'
                        />
                        <span class='icon' :class="newPwdVis ? 'icon_icon_pressed': 'icon_icon_default'" @click='changeState("newPwdVis")'></span>
                    </div>
                    <div class='form-item'>
                        <Field
                            v-model='confirmPwd'
                            :formatter='formatter'
                            label=''
                            maxlength='6'
                            :placeholder='$t("forgot.newPwdAgain")'
                            :type='confirmVis ? "text" : "password"'
                        />
                        <span class='icon' :class="confirmVis ? 'icon_icon_pressed': 'icon_icon_default'" @click='changeState("confirmVis")'></span>
                    </div>
                </van-cell-group>
                <van-button class='confirmBtn' @click='handleConfirm'>
                    <span>{{ $t('common.sure') }}</span>
                </van-button>
            </div>
        </div>
    </div>
</template>

<script>
import topNav from '@planspc/layout/topNav'
import { reactive, toRefs } from 'vue'
import { Field, Toast, Dialog } from 'vant'
import { useRouter, useRoute } from 'vue-router'
import { forgetAssertsPwd } from '@/api/user'
import md5 from 'js-md5'
import { useI18n } from 'vue-i18n'

export default {
    components: {
        topNav,
        Field
    },
    setup (props) {
        const router = useRouter()
        const route = useRoute()
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            newPwd: '',
            confirmPwd: '',
            newPwdVis: false,
            confirmVis: false,
            loading: false
        })

        function changeState (type) {
            state[type] = !state[type]
        }
        function formatter (value) {
            // 过滤输入的非数字
            return value.replace(/[^\d]/g, '')
        }

        function handleConfirm () {
            if (!state.newPwd) {
                return Toast(t('forgot.inputNewPwd'))
            }
            if (!state.confirmPwd) {
                return Toast(t('forgot.inputSurePwd'))
            }
            if (state.newPwd.length < 6) {
                return Toast(t('common.fundPwdTip'))
            }
            if (state.newPwd !== state.confirmPwd) {
                return Toast(t('forgot.pwdDiff'))
            }

            const params = {
                type: route.query['type'], // 1邮箱，2手机号码，3客户账号
                loginName: route.query['loginName'],
                verifyCode: route.query['verifyCode'],
                newPwd: md5(state.confirmPwd),
                sendToken: route.query['sendToken'],
                verifyCodeToken: route.query['verifyCodeToken']
            }
            state.loading = true
            forgetAssertsPwd(params).then((res) => {
                state.loading = false
                if (res.check()) {
                    Dialog.alert({
                        message: t('forgot.newPwdSuccess'),
                    }).then(() => {
                        router.push('/home')
                    })
                    Toast(t('forgot.newPwdSuccess'))
                } else {
                    Toast(res.msg)
                }
            }).catch(err => {
                state.loading = false
                router.push('/resetFail')
            })
        }

        return {
            ...toRefs(state),
            changeState,
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
    display: flex;
    flex-flow: column;
    height: 100%;
    background: var(--assistColor);
    .container {
        flex: 1;
        overflow: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        .content{
            width:520px;
            padding: 60px;
            border-radius: 10px;
                background-color: var(--contentColor);

        }
    }
    .header {
        // display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0 0 40px;
        h6{
            font-size:16px;
            font-weight: normal;

        }
    }
    .pageTitle {
font-weight: bold;
    font-size: 32px;
    color: var(--color);
    }
    .confirmBtn {
        // position: absolute;
        // bottom: 0;
        width: 100%;
        background: var(--primary);
        color: #fff;
        font-size: 20px;
        border-radius: 4px;
        padding: 0;
        margin-top:18px;
        span {
           color: #fff;
        }
    }
    .form-item {
        position: relative;
        margin-bottom: 24px;
        border-radius: 4px;
        overflow: hidden;
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
        :deep{
           .van-field {
                background-color: var(--bgColor);
            }
        }
    }
}
</style>

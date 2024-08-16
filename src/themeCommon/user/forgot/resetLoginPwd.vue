<template>
    <div class='pageWrap'>
        <LayoutTop :back="true" :menu="false" bottomLine />
        <Loading :show='loading' />
        <h1 class='pageTitle'>
            {{ $t('forgot.resetPwd') }}
        </h1>
        <h6 class="pageTip">{{ $t('forgot.pwdRule') }}</h6>
        <van-cell-group>
            <div class='form-item'>
                <Field v-model='newPwd' label='' :placeholder='$t("forgot.inputNewPwd")' :type='newPwdVis ? "text" : "password"' />
                <van-icon class='icon' :name="newPwdVis ? 'eye-o': 'closed-eye'" @click='changeState("newPwdVis")' />
                <!-- <span class='icon' :class="newPwdVis ? 'icon_eye': 'icon_eye-off'" @click='changeState("newPwdVis")'></span> -->
            </div>
            <div class='form-item'>
                <Field v-model='confirmPwd' label='' :placeholder='$t("forgot.newPwdAgain")' :type='confirmVis ? "text" : "password"' />
                <van-icon class='icon' :name="confirmVis ? 'eye-o': 'closed-eye'" @click='changeState("confirmVis")' />
                <!-- <span class='icon' :class="confirmVis ? 'icon_eye': 'icon_eye-off'" @click='changeState("confirmVis")'></span> -->
            </div>
        </van-cell-group>
        <van-button class='confirmBtn' @click='handleConfirm'>
            <span>{{ $t('common.sure') }}</span>
        </van-button>
        <AddNeedInfo />
    </div>
</template>

<script>
import AddNeedInfo from '@/themeCommon/components/addNeedInfo.vue'
import { reactive, toRefs } from 'vue'
import { Field, Toast } from 'vant'
import { useRouter, useRoute } from 'vue-router'
import { findPwd } from '@/api/user'
import md5 from 'js-md5'
import { useI18n } from 'vue-i18n'
import { localSet, pwdReg } from '@/utils/util'

export default {
    name: 'ResetPwd',
    components: {
        Field,
        AddNeedInfo
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

        function handleConfirm () {
            if (!state.newPwd) {
                return Toast(t('forgot.inputNewPwd'))
            }
            if (!state.confirmPwd) {
                return Toast(t('forgot.inputSurePwd'))
            }
            if (state.newPwd.length < 6 || state.newPwd.length > 16) {
                return Toast(t('forgot.pwdRule'))
            }
            if (state.newPwd !== state.confirmPwd) {
                return Toast(t('forgot.pwdDiff'))
            }
            if (!pwdReg.test(state.newPwd)) {
                return Toast(t('forgot.pwdRule'))
            }

            const params = {
                type: route.query['type'], // 1邮箱，2手机号码，3客户账号
                loginName: route.query['loginName'],
                phoneArea: route.query['phoneArea'],
                verifyCode: route.query['verifyCode'],
                newPwd: md5(state.confirmPwd),
                sendToken: route.query['sendToken'],
                verifyCodeToken: route.query['verifyCodeToken'],
                googleCode: route.query['googleCode']
            }
            state.loading = true
            findPwd(params).then((res) => {
                state.loading = false
                if (res.check()) {
                    localSet('loginNameType', route.query['type'] === '1' ? 'email' : 'mobile')
                    router.push('/resetSuccess')
                }
            }).catch(err => {
                state.loading = false
                router.push('/resetFail')
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
    background: var(--contentColor);
    .pageTitle {
        padding-left: rem(40px);
        font-size: rem(60px);
        font-weight: bold;
        color: var(--primaryText);
    }
    .pageTip {
        font-size: rem(20px);
        font-weight: bold;
        color: var(--primaryText);
        padding: rem(16px) 0 0 rem(40px);
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
        .icon {
            position: absolute;
            top: rem(26px);
            right: rem(24px);
            z-index: 99;
            cursor: pointer;
            &::before {
                font-size: rem(30px);
            }
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

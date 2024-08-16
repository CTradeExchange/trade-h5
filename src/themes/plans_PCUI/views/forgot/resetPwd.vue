<template>
    <div class='pageWrap'>
        <topNav class='header' />
        <div class='container'>
            <div class='content'>
                <!-- <a class='icon_icon_close_big' href='javascript:;' @click='$router.back()'></a> -->
                <Loading :show='loading' />
                <header class='header'>
                    <h1 class='pageTitle'>
                        {{ $t('forgot.setPwd') }}
                    </h1>
                    <h6>{{ $t('forgot.pwdRule') }}</h6>
                </header>
                <van-cell-group class='item-group'>
                    <div class='form-item'>
                        <Field v-model='newPwd' label='' :placeholder='$t("forgot.inputNewPwd")' :type='newPwdVis ? "text" : "password"' />
                        <span class='icon' :class="newPwdVis ? 'icon_icon_pressed': 'icon_icon_default'" @click='changeState("newPwdVis")'></span>
                    </div>
                    <div class='form-item'>
                        <Field v-model='confirmPwd' label='' :placeholder='$t("forgot.newPwdAgain")' :type='confirmVis ? "text" : "password"' />
                        <span class='icon' :class="confirmVis ? 'icon_icon_pressed': 'icon_icon_default'" @click='changeState("confirmVis")'></span>
                    </div>
                </van-cell-group>
                <div class='confirm-div'>
                    <van-button block class='confirmBtn' @click='handleConfirm'>
                        <span>{{ $t('common.sure') }}</span>
                    </van-button>
                </div>
            </div>
        </div>
        <AddNeedInfo />
    </div>
</template>

<script>
import AddNeedInfo from '@/themeCommon/components/addNeedInfo.vue'
import topNav from '@planspc/layout/topNav'
import { reactive, toRefs } from 'vue'
import { Field, Toast } from 'vant'
import { useRouter, useRoute } from 'vue-router'
import { findPwd } from '@/api/user'
import md5 from 'js-md5'
import { useI18n } from 'vue-i18n'
import { pwdReg } from '@/utils/util'

export default {
    components: {
        topNav,
        Field,
        AddNeedInfo,
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
                    router.push('/resetSuccess')
                }
            }).catch(err => {
                state.loading = false
                router.push('/resetFail?type=login')
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
        .content {
            width: 687px;
            padding: 50px 170px 50px 134px;
            background: var(--contentColor);
            box-shadow: 0px 6px 19px 2px rgb(0 0 0 / 8%);
        }
    }
    .header {

        h6 {
            font-weight: normal;
            font-size: 16px;
        }
    }
    .pageTitle {
        margin-bottom: 20px;
        font-weight: bold;
        font-size: 24px;
        font-family: Microsoft YaHei;
        color:var(--color)
    }
    .confirmBtn {
        // position: absolute;
        // bottom: 0;
        height: 36px;
        margin-top: 25px;
        font-size: 16px;
        border-radius: 18px;
        background: var(--primary);
        color: var(--contentColor);
        span {
            color: #FFF;
        }
    }
    .item-group{
        background-color: var(--contentColor);
    }
    .form-item {
        position: relative;
        margin-top:24px;
        background-color: var(--bgColor);
        border: solid 1px var(--lineColor);
        border-radius: 4px;
        overflow: hidden;
        &:hover,&:focus{
            border: solid 1px var(--primary);
        }
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
        :deep {
            .van-cell{
                height: 36px;
                padding:0 0 0 20px;
                align-items: center;
                &::after{
                    border-bottom:none;
                }
            }
            .van-field {
                background-color: var(--bgColor);
            }
        }
    }
    .confirm-div{
        padding: 0 36px;
    }
}
</style>

<template>
    <div class='page-wrap'>
        <LayoutTop :back='true' :custom-back='true' :menu='false' :title='$t("cRoute.securitySetting")' @back='$router.push("/mine")' />
        <van-cell-group :border='false' class='cellGroup'>
            <!-- <van-cell
                class='cellItem'
                is-link
                :title='$t("common.mobile")'
                :to='customInfo.phone ? "/changeBindMobile" : "/bindMobile"'
            >
                <template #right-icon>
                    <span class='right-val' :class="customInfo.phone ? 'yet' : 'none'">
                        {{ customInfo?.phone ? $t('common.modify') : $t('common.noneBind') }}
                    </span>
                    <van-icon name='arrow' />
                </template>
            </van-cell> -->
            <!-- 线上暂时隐藏 -->
            <!-- <van-cell
                class='cellItem'
                is-link
                :title='$t("common.email")'
                :to="customInfo.email ? '/changeBindEmail' : '/bindEmail'"
                value=''
            >
                <template #right-icon>
                    <span class='right-val' :class="customInfo.email ? 'yet' : 'none'">
                        {{ customInfo?.email ? $t('common.modify') : $t('common.noneBind') }}
                    </span>
                    <van-icon name='arrow' />
                </template>
            </van-cell> -->
            <!-- <van-cell
                class='cellItem'
                is-link
                :title='$t("login.loginPwd")'
                to='/setLoginPwd'
                value=''
            >
                <template #right-icon>
                    <span class='right-val' :class="Number(customInfo.loginPassStatus) === 2 ? 'yet' : 'none'">
                        {{ Number(customInfo.loginPassStatus) === 1 ? $t('common.noSet') : $t('common.modify') }}
                    </span>
                    <van-icon name='arrow' />
                </template>
            </van-cell> -->
            <van-cell
                class='cellItem'
                is-link
                :title='$t("common.fundPwd")'
                to='/setFundPwd'
                value=''
            >
                <template #right-icon>
                    <span class='right-val' :class="Number(customInfo.assertPassStatus) === 2 ? 'yet' : 'none'">
                        {{ Number(customInfo?.assertPassStatus) === 1 ? $t('common.noSet') : $t('common.modify') }}
                    </span>
                    <van-icon name='arrow' />
                </template>
            </van-cell>
            <!-- <van-cell
                class='cellItem'
                is-link
                :title='$t("bank.bankList")'
                to='/bankList'
                value=''
            /> -->
            <van-cell
                class='cellItem'
                is-link
                :title='$t("withdraw.withdrawLink")'
                to='/walletAddress'
                value=''
            />
            <!-- <van-cell
                class='cellItem'
                is-link
                :title='$t("api.title")'
                to='/apiManage/list'
            >
                <template #right-icon>
                    <van-icon name='arrow' />
                </template>
            </van-cell>
            <van-cell
                class='cellItem'
                is-link
                :title='$t("mfa.routeTitile")'
                to='/googleMFA/status'
            >
                <template #right-icon>
                    <span class='right-val' :class="customInfo.googleId>0 ? 'yet' : 'none'">
                        {{ customInfo.googleId>0 ? $t("mfa.status1"):$t("mfa.status0") }}
                    </span>
                    <van-icon name='arrow' />
                </template>
            </van-cell> -->
        </van-cell-group>
        <button v-if='customInfo' class='footer-btn' @click='handleLogout'>
            <span>{{ $t('common.quitLogin') }}</span>
        </button>
    </div>
</template>

<script>
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { Dialog } from 'vant'
import { useRouter } from 'vue-router'
import { computed, reactive, getCurrentInstance } from 'vue'
export default {
    setup () {
        const instance = getCurrentInstance()
        const { t } = useI18n({ useScope: 'global' })
        const store = useStore()
        const router = useRouter()
        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)
        const state = reactive({})

        const handleLogout = () => {
            Dialog.confirm({
                confirmButtonText: t('common.sure'),
                cancelButtonText: t('common.cancel'),
                title: t('common.tip'),
                message: t('setting.logoutConfirm'),
            }).then(() => {
                state.loading = true
                // 退出登录
                instance.appContext.config.globalProperties.$MsgSocket.logout()
                return store.dispatch('_user/logout')
            }).then(() => {
                return router.push('/')
            }).then(() => {
                location.reload()
            }).catch(() => {
                // on cancel
            })
        }

        return {
            customInfo,
            handleLogout
        }
    },
}
</script>

<style lang='scss' scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    background: var(--bgColor);
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    .cellGroup {
        padding-bottom: rem(130px);
        .cellItem {
            display: flex;
            align-items: center;
            height: rem(120px);
            font-size: rem(32px);
            background: var(--contentColor);
            background: var(--contentColor);
            border-top: solid rem(10px) var(--bgColor);
            &::after {
                border: none;
            }
            :deep(.van-cell__value){
                display: none;
            }
            :deep(.van-cell__title) {
                font-size: rem(28px);
                color: var(--color);
            }
            :deep(.van-icon-arrow) {
                margin-top: -2px;
            }
            .right-val {
                margin-right: rem(10px);
                color: var(--minorColor);
                font-size: rem(24px);
                vertical-align: middle;
                &.none {
                    color: var(--warn);
                }
            }
            .van-icon {
                margin-top: -2px;
                color: var(--minorColor);
            }
        }
    }
}
.footer-btn {
    position: fixed;
    width: rem(694px);
    height: rem(90px);
    border-radius: rem(10px);
    background: var(--primary);
    border: none;
    margin: 0 0 rem(25px) rem(27px);
    bottom: 0;
    span {
        color: var(--contentColor);
        font-size: rem(30px);
    }
}
</style>

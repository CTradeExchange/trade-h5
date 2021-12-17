<template>
    <div class='page-wrap'>
        <Top back />
        <p class='header'>
            {{ $t('cRoute.securitySetting') }}
        </p>
        <van-cell-group :border='false' class='cellGroup'>
            <van-cell
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
            </van-cell>
            <van-cell
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
            </van-cell>
            <van-cell
                class='cellItem'
                is-link
                :title='$t("login.loginPwd")'
                to='/setLoginPwd'
                value=''
            >
                <template #right-icon>
                    <span class='right-val'>
                        {{ $t('common.modify') }}
                    </span>
                    <van-icon name='arrow' />
                </template>
            </van-cell>
            <van-cell
                class='cellItem'
                is-link
                :title='$t("bank.bankList")'
                to='/bankList'
                value=''
            />
            <van-cell
                class='cellItem'
                is-link
                :title='$t("withdraw.withdrawLink")'
                to='/walletAddress'
                value=''
            />
            <van-cell
                v-if='customInfo'
                class='cellItem'
                is-link
                :title='$t("common.quitLogin")'
                value=''
                @click='handleLogout'
            />
        </van-cell-group>
    </div>
</template>

<script>
import Top from '@/components/top'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { Dialog } from 'vant'
import { useRouter } from 'vue-router'
import { onBeforeMount, computed, reactive, getCurrentInstance, toRefs, onUnmounted } from 'vue'
export default {
    components: {
        Top,
    },
    setup (props, context) {
        const instance = getCurrentInstance()
        const { t, locale } = useI18n({ useScope: 'global' })
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
                return router.push('/mine')
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
    .header{
        background: var(--contentColor);
        font-size: rem(48px);
        font-weight: bold;
        padding-left: rem(30px);
        padding-bottom: rem(30px);
    }
    .cellGroup{
        .cellItem {
            background: var(--contentColor);
            font-size: rem(32px);
            line-height: rem(120px);
            height: rem(120px);
            border-top: solid rem(10px) var(--bgColor);
            background: var(--contentColor);
            display: flex;
            align-items: center;
            //margin-top: rem(10px);
            &::after{
                border: none;
            }
            :deep(.van-cell__title){
                color: var(--color);
            }
            :deep(.van-icon-arrow){
                margin-top: -2px;
            }
            .right-val{
                font-size: rem(28px);
                color: var(--minorColor);
                vertical-align: middle;
                margin-right: rem(10px);
                &.none{
                    color: var(--warn);
                }
            }
            .van-icon{
                margin-top: -2px;
                color: var(--minorColor);
            }

        }
    }
}
</style>

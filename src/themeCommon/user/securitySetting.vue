<template>
    <div class='page-wrap'>
        <Top back />
        <p class='header'>
            {{ $t('cRoute.securitySetting') }}
        </p>
        <van-cell-group class='cellGroup'>
            <van-cell
                class='cellItem'
                is-link
                :title='$t("common.mobile")'
                to='/bindMobile'
            >
                <template #right-icon>
                    <span class='right-val' :class="customInfo.phone ? 'yet' : 'none'">
                        {{ customInfo?.phone ? $t('common.alreadyBind') : $t('common.noneBind') }}
                    </span>
                    <van-icon name='arrow' />
                </template>
            </van-cell>
            <van-cell
                class='cellItem'
                is-link
                :title='$t("common.email")'
                to='/bindEmail'
                value=''
            >
                <template #right-icon>
                    <span class='right-val' :class="customInfo.email ? 'yet' : 'none'">
                        {{ customInfo?.email ? $t('common.alreadyBind') : $t('common.noneBind') }}
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
        </van-cell-group>
    </div>
</template>

<script>
import Top from '@/components/top'
import { useStore } from 'vuex'
import { onBeforeMount, computed, reactive, toRefs, onUnmounted } from 'vue'
export default {
    components: {
        Top,
    },
    setup (props, context) {
        const store = useStore()
        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)
        const state = reactive({})
        return {
            customInfo
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
            font-size: rem(32px);
            font-weight: bold;
            line-height: rem(120px);
            height: rem(120px);
            border-top: solid rem(10px) var(--bgColor);
            background: none;
            display: flex;
            align-items: center;
            //margin-top: rem(10px);
            &::after{
                border: none;
            }
            .right-val{
                font-size: rem(28px);
                color: var(--minorColor);
                vertical-align: middle;
                &.none{
                    color: var(--warn);
                }
            }
            .van-icon{
                margin-top: -2px;
                color: var(--minorColor);
                font-size: rem(24px);
            }

        }
    }
}
</style>

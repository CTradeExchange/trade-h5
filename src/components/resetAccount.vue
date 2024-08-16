<template>
    <Loading :show='loading' />
    <div v-if='slotExist' @click='resetFn'>
        <slot></slot>
    </div>
    <!-- <van-button
        v-if='btnShow && !slotExist'
        :class='domClass'
        plain
        :type='domType'
        @click='resetFn'
    >
        {{ $t("demoAccount.reset") }}
    </van-button> -->
</template>

<script>
import { Dialog, Toast } from 'vant'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { resetAccount } from '@/api/user'
import { computed, reactive, toRefs, useSlots } from 'vue'
import { isDemoAccount, NEWUI_SHOW } from '@/utils/util'
import { MsgSocket } from '@/plugins/socket/socket'

export default {
    props: ['tradeType', 'btnShow'],
    setup (props, { attrs }) {
        const store = useStore()
        const route = useRoute()
        const { isUniapp } = route.query || {}
        const { tradeType, btnShow } = props || {}
        const domClass =
            attrs?.class ||
            (btnShow ? 'reset_show' : 'reset_btn')
        const domType = attrs?.class ? 'default' : 'primary'
        const { t } = useI18n({ useScope: 'global' })
        const customerInfo = computed(() => store.state._user.customerInfo)
        const rcId = Number(customerInfo?.value?.relationCustomerId)
        const state = reactive({
            loading: false,
            slotExist: computed(() => !!useSlots().default),
            btnShow: computed(
                () => NEWUI_SHOW && isDemoAccount() && !isUniapp && rcId > 0
            )
        })
        const resetFn = async () => {
            try {
                await Dialog.confirm({
                    title: t('demoAccount.title'),
                    message: t('demoAccount.info'),
                    confirmButtonText: t('common.sure'),
                    cancelButtonText: t('common.cancel')
                })
                state.loading = true
                const info = await resetAccount()
                if (info.check()) {
                    store.dispatch('_user/findCustomerInfo', false) // 刷新用户信息
                    if (tradeType == '5') {
                        store.dispatch('_user/queryCustomerAssetsInfo', {
                            tradeType
                        })
                    } else if ([1, 2].includes(Number(tradeType))) {
                        store.dispatch('_trade/queryPositionPage', {
                            tradeType
                        })
                    }
                    MsgSocket.subscribeAsset(tradeType)
                    state.loading = false
                    Toast(t('demoAccount.resetSuccess'))
                } else {
                    state.loading = false
                }
            } catch {
                state.loading = false
            }
        }

        return {
            ...toRefs(state),
            customerInfo,
            isUniapp,
            domClass,
            domType,
            resetFn
        }
    }
}
</script>

<style lang="scss">
.reset_show {
    width: 100%;
    height: 100%;
    border-radius: rem(8px);
    font-size: rem(28px);
    white-space: nowrap;
    background: var(--primary);
    color: var(--contentColor);
}
.reset_btn {
    width: auto;
    height: auto;
    font-size: rem(18px);
    padding: rem(8px) rem(16px);
    margin-right: rem(20px);
    border-radius: rem(8px);
    white-space: nowrap;
}
</style>

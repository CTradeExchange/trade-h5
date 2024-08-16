<template>
    <!-- <Loading :show='loading' /> -->
    <div v-if='rcId>0' class='left-bottom'>
        <div>{{ $t("demoAccount.realCurrency") }}</div>
        <div class='bottom-btn' @click='changeMode'>
            <img class='money-icon' :class='`mode-${mode}`' :src='moneyIcon' />
        </div>
        <div>{{ $t("demoAccount.demoMode") }}</div>
    </div>
</template>

<script>
import { computed, reactive, toRefs, useSlots, watch } from 'vue'
import { switchUserAccount } from '@/api/user'
import { useStore } from 'vuex'
import {
    COMPANY_TYPE,
    NEWUI_SHOW,
    isDemoAccount,
    localGet,
    localRemove,
    localSet,
    parseJSON,
    sessionSet,
    setToken,
    sessionRemove,
    getCookie
} from '@/utils/util'
import { Toast } from 'vant'
import { useI18n } from 'vue-i18n'
import { moneyIcon } from '../images/leftMenu'
export default {
    setup () {
        const { t } = useI18n({ useScope: 'global' })
        const store = useStore()
        const customerInfo = computed(() => store.state._user.customerInfo)
        // const rcId = Number(customerInfo?.value?.relationCustomerId)

        const state = reactive({
            mode: isDemoAccount() ? 2 : 1,
            loading: false,
            moneyIcon,
            rcId: computed(() => Number(customerInfo?.value?.relationCustomerId))

        })

        const changeMode = () => {
            const mode = state.mode === 1 ? 2 : 1
            if (state.rcId > 0) {
                switchAccountApi(mode)
            }
        }

        const switchAccountApi = (type) => {
            if (type === 2) {
                const data = parseJSON(window['wp_ChannelSett']) || {}
                if (!data?.demo_domain) return Toast(t('demoAccount.fail'))
                state.loading = true
                localSet('demo_domain', data?.demo_domain)
                const cId = customerInfo?.value?.companyId
                localSet('companyId', cId)
            }
            switchUserAccount()
                .then((res) => {
                    state.mode = type
                    state.loading = false
                    if (res.check()) {
                        Toast(t('demoAccount.success'))
                        sessionRemove('productActived');
                        setToken(res.data.token)
                        if (type === 2) {
                            sessionSet(
                                'companyId',
                                res.data.associationCompanyId
                            )
                            localSet('companyType', COMPANY_TYPE)
                        } else {
                            sessionSet('companyId', localGet('companyId'))
                            localRemove('companyType')
                        }
                        if (location.href.indexOf('symbolId') > -1) {
                            const lang = getCookie('lang') || location.pathname.split('/')[1]
                            window.location.replace(`${location.origin}/${lang}/home`)
                        } else {
                            location.reload()
                        }
                        // store.dispatch('_base/initBaseConfig').then(() => {
                        //     location.reload()
                        // })
                    }
                })
                .catch(() => {
                    state.loading = false
                    Toast(t('demoAccount.fail'))
                })
        }

        return {
            changeMode,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
.left-bottom {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--White);
    font-size: 12px;
    .bottom-btn {
        position: relative;
        width: 28px;
        height: 47px;
        background: var(--primary);
        border-radius: 14px;
        cursor: pointer;
        .money-icon {
            position: absolute;
            width: 26px;
            height: 26px;
            left: 1px;
            transition: all linear 2s;
            &.mode-1 {
                top: 0;
            }
            &.mode-2 {
                bottom: 0;
            }
        }
    }
}
</style>

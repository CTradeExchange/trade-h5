<template>
    <Loading :show='loading' />
    <div v-if="slotExist" @click='onParseFn'>
        <slot></slot>
    </div>
    <van-button v-else class='switch_btn' @click='onVisible(true)'>
        {{
            checked === 2 ? $t("demoAccount.demo") : $t("demoAccount.real")
        }}
    </van-button>
    <van-popup v-model:show='popupShow' position='bottom'>
        <div class='raido_groups'>
            <van-radio-group v-model='checked'>
                <van-cell-group inset>
                    <van-cell
                        clickable
                        :title="$t('demoAccount.real')"
                        @click='switchAccount(1)'
                    >
                        <template #right-icon>
                            <van-radio :name='1' />
                        </template>
                    </van-cell>
                    <van-cell
                        clickable
                        :title="$t('demoAccount.demo')"
                        @click='switchAccount(2)'
                    >
                        <template #right-icon>
                            <van-radio :name='2' />
                        </template>
                    </van-cell>
                </van-cell-group>
            </van-radio-group>
        </div>
    </van-popup>
    <centerViewDialog v-if='dialogShow' class='webDialog'>
        <LayoutTop
            :custom-back='true'
            icon='icon_icon_close_big'
            :menu='false'
            :title="
                checked === 2
                    ? $t('demoAccount.dialogReal')
                    : $t('demoAccount.dialogDemo')
            "
            @back='onVisible(false)'
        />
        <div class='web_radio'>
            <van-radio-group v-model='checked'>
                <van-cell-group inset>
                    <van-cell
                        clickable
                        :title="$t('demoAccount.real')"
                        @click='switchAccount(1)'
                    >
                        <template #right-icon>
                            <van-radio :name='1' />
                        </template>
                    </van-cell>
                    <van-cell
                        clickable
                        :title="$t('demoAccount.demo')"
                        @click='switchAccount(2)'
                    >
                        <template #right-icon>
                            <van-radio :name='2' />
                        </template>
                    </van-cell>
                </van-cell-group>
            </van-radio-group>
        </div>
    </centerViewDialog>
</template>

<script>
import centerViewDialog from '@planspc/layout/centerViewDialog'
import { computed, reactive, toRefs, useSlots, watch } from 'vue'
import { switchUserAccount } from '@/api/user'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { Toast } from 'vant'
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
    isMobile
} from '@/utils/util'

export default {
    components: {
        centerViewDialog
    },
    props: ['line', 'whiteBack'],
    props: {
        slotFn: {
            Type: Number,
            default: null
        },
        slotNoAuto: {
            Type: Boolean,
            default: false
        }
    },
    setup (props, { attrs }) {
        const store = useStore()
        const route = useRoute()
        const { isUniapp } = route.query || {}
        const { t } = useI18n({ useScope: 'global' })
        const customerInfo = computed(() => store.state._user.customerInfo)
        const rcId = Number(customerInfo?.value?.relationCustomerId)
        const switchClass = attrs.class
        const state = reactive({
            loading: false,
            popupShow: false,
            dialogShow: false,
            checked: isDemoAccount() ? 2 : 1, // 2 演示模式 1 真实模式
            slotExist: computed(() => !!useSlots().default),
            btnShow: computed(() => NEWUI_SHOW && !isUniapp && rcId > 0)
        })

        const onVisible = (flag) => {
            const webSide = !isMobile()
            state[webSide ? 'dialogShow' : 'popupShow'] = flag
        }

        const switchAccount = (value) => {
            onVisible(false)
            if (value === state.checked) return
            if (rcId > 0) {
                switchAccountApi(value)
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
                    state.checked = type
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

        watch(
            () => props.slotFn,
            (newData, oldData) => {
                if (
                    newData !== oldData &&
                    typeof newData === 'number' &&
                    state.slotExist &&
                    !props.slotNoAuto
                ) {
                    switchAccount(newData)
                }
            }
        )

        const onParseFn = () => {
            if (props.slotFn && props.slotNoAuto) {
                switchAccount(props.slotFn)
            }
        }

        return {
            ...toRefs(state),
            switchAccount,
            switchClass,
            onVisible,
            onParseFn
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@/sass/mixin.scss";
.switch_slots {
    flex: 1;
}
.switch_account {
    display: flex;
    justify-content: flex-end;
    padding: rem(10px) rem(20px);
    .switch_btn {
        width: auto;
        height: auto;
        font-size: rem(18px);
        padding: rem(12px) rem(16px);
        border-radius: rem(8px);
        white-space: nowrap;
    }
}
.line {
    border-bottom: solid 1px var(--lineColor);
}
.white_back {
    background-color: var(--contentColor);
}
.raido_groups {
    padding: rem(12px) 0;
    :deep(.van-cell-group--inset) {
        margin: 0;
    }
}
</style>

<style lang="scss">
.webDialog > div:last-of-type {
    min-height: 200px;
    height: auto;
    .web_radio {
        padding: 100px 0 78px;
    }
}
</style>

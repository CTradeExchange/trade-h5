<template>
    <centerViewDialog>
        <div class='pageWrap'>
            <LayoutTop :back='true' :menu='false' />
            <div v-if='despositObj' class='wrap'>
                <i class='icon' :class='statusMap[despositObj.paymentStatus].className || "icon_tishi"'></i>

                <h2 class='text'>
                    {{ statusMap[despositObj.paymentStatus].stateText }}
                </h2>
                <div class='detail'>
                    <div class='d-item'>
                        <span class='label'>
                            {{ $t('deposit.proposalNo') }}
                        </span>
                        <span class='val'>
                            {{ despositObj.proposalNo }}
                        </span>
                    </div>
                    <div class='d-item'>
                        <span class='label'>
                            {{ $t('deposit.proposalAmount') }}
                        </span>
                        <span class='val'>
                            {{ despositObj.intendAmount }}{{ despositObj.depositCurrency }}
                        </span>
                    </div>
                    <div class='d-item'>
                        <span class='label'>
                            {{ $t('deposit.lastAmount') }}
                        </span>
                        <span class='val'>
                            {{ despositObj.finalAmount || '--' }}{{ despositObj.depositCurrency }}
                        </span>
                    </div>
                    <div class='d-item'>
                        <span class='label'>
                            {{ $t('common.fee') }}
                        </span>
                        <span class='val'>
                            {{ despositObj.depositFee || '--' }}{{ despositObj.depositCurrency }}
                        </span>
                    </div>
                    <div class='d-item'>
                        <span class='label'>
                            {{ $t('common.status') }}
                        </span>
                        <span class='val'>
                            {{ statusMap[despositObj.paymentStatus].stateText }}
                        </span>
                    </div>
                    <div class='d-item'>
                        <span class='label'>
                            {{ $t('common.remark') }}
                        </span>
                        <span class='val'>
                            {{ despositObj.remark || '--' }}
                        </span>
                    </div>

                    <div class='d-item'>
                        <span class='label'>
                            {{ $t('common.time') }}
                        </span>
                        <span class='val'>
                            {{ formatTime(despositObj.createTime) || '--' }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </centerViewDialog>
</template>

<script>
import centerViewDialog from '@planspc/layout/centerViewDialog'
import { toRefs, reactive, onMounted, computed, onBeforeUnmount } from 'vue'
import { queryDepositProposal } from '@/api/user'
import { useStore } from 'vuex'
import { Dialog } from 'vant'
import { isEmpty } from '@/utils/util'
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router'
import { useI18n } from 'vue-i18n'
export default {
    components: {
        centerViewDialog
    },
    setup (props) {
        const store = useStore()
        const router = useRouter()
        const route = useRoute()
        const { t } = useI18n({ useScope: 'global' })
        // 币种、账户id、玩法类型
        // const { currency, accountId, tradeType } = route.query
        const state = reactive({
            loading: false,
            despositObj: ''
        })
        const customInfo = computed(() => store.state._user.customerInfo)

        const onlineServices = computed(() => store.state._base.wpCompanyInfo?.onlineService)

        const statusMap = {
            1: {
                stateText: t('deposit.tobePay'),
                className: 'icon_tishi'
            },

            2: {
                stateText: t('deposit.paySuccess'),
                className: 'icon_success'
            },
            3: {
                stateText: t('deposit.payFail'),
                className: 'icon_fail'
            }
        }
        const getDespostProposal = () => {
            const orderId = route.query.orderId
            if (!isEmpty(orderId)) {
                const params = {
                    customerNo: customInfo.value.customerNo,
                    proposalNo: orderId
                }
                state.loading = true
                queryDepositProposal(params).then(res => {
                    state.loading = false
                    if (res.check()) {
                        state.despositObj = res.data
                    }
                }).catch(err => {
                    state.loading = false
                    console.log(err)
                })
            } else {
                Dialog.confirm({
                    title: t('common.tip'),
                    confirmButtonText: t('common.back'),
                    cancelButtonText: t('common.serivce'),
                    message: t('deposit.serviceTips2'),
                }).then(() => {
                    window.close()
                }).catch(() => {
                    if (onlineServices.value) { location.href = onlineServices.value }
                })
            }
        }

        const formatTime = (val) => {
            return window.dayjs(val).format('YYYY-MM-DD HH:mm:ss')
        }

        onBeforeRouteLeave((to, from) => {
            window.close()
        })

        onMounted(() => {
            getDespostProposal()
        })

        onBeforeUnmount(() => {
            sessionStorage.removeItem('proposalNo')
        })

        return {
            formatTime,
            statusMap,
            onlineServices,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.wrap {
    text-align: center;
    .icon {
        display: inline-block;
        margin-bottom: rem(20px);
        font-size: rem(100px);
        &.icon_success {
            color: var(--success);
        }
        &.icon_fail {
            color: var(--fallColor);
        }
        &.icon_tishi {
            color: var(--minorColor);
        }
    }
    .text{

    }
    .detail {
        width: 80%;
        margin: rem(50px) auto 0;
        padding: rem(30px);
        .d-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: rem(20px);
            padding: 0 rem(20px) rem(20px);
            border-bottom: solid 1px var(--lineColor);
            .label {
                color: var(--minorColor);
            }
            .val {
                color: var(--color);
            }
        }
    }
}
</style>

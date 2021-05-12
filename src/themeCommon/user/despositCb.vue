<template>
    <div class='pageWrap'>
        <Top
            back
            left-icon='arrow-left'
            :menu='false'
            :right-action='false'
        />
        <Loading :show='loading' />
        <div v-if='despositObj' class='wrap'>
            <i class='icon' :class='statusMap[despositObj.paymentStatus].className ||"icon_tishi"'></i>

            <h2 class='text'>
                {{ statusMap[despositObj.paymentStatus].stateText }}
            </h2>
            <div class='detail'>
                <div class='d-item'>
                    <span class='label'>
                        提案号
                    </span>
                    <span class='val'>
                        {{ despositObj.proposalNo }}
                    </span>
                </div>
                <div class='d-item'>
                    <span class='label'>
                        提案金额
                    </span>
                    <span class='val'>
                        {{ despositObj.intendAmount }}{{ despositObj.depositCurrency }}
                    </span>
                </div>
                <div class='d-item'>
                    <span class='label'>
                        最终入账金额
                    </span>
                    <span class='val'>
                        {{ despositObj.finalAmount || '--' }}{{ despositObj.depositCurrency }}
                    </span>
                </div>
                <div class='d-item'>
                    <span class='label'>
                        手续费
                    </span>
                    <span class='val'>
                        {{ despositObj.depositFee || '--' }}{{ despositObj.depositCurrency }}
                    </span>
                </div>
                <div class='d-item'>
                    <span class='label'>
                        状态
                    </span>
                    <span class='val'>
                        {{ statusMap[despositObj.paymentStatus].stateText }}
                    </span>
                </div>
                <div class='d-item'>
                    <span class='label'>
                        备注
                    </span>
                    <span class='val'>
                        {{ despositObj.remark || '--' }}
                    </span>
                </div>

                <div class='d-item'>
                    <span class='label'>
                        时间
                    </span>
                    <span class='val'>
                        {{ formatTime(despositObj.createTime) || '--' }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Top from '@/components/top'
import { toRefs, reactive, onBeforeMount, computed, onBeforeUnmount } from 'vue'
import {
    queryDepositProposal
} from '@/api/user'
import {
    useStore
} from 'vuex'
import dayjs from 'dayjs'
import { isEmpty } from '@/utils/util'
export default {
    components: {
        Top
    },
    setup (props) {
        const store = useStore()
        const state = reactive({
            loading: false,
            despositObj: {}
        })
        const customInfo = computed(() => store.state._user.customerInfo)

        const statusMap = {
            1: {
                stateText: '待支付',
                className: 'icon_tishi'
            },

            2: {
                stateText: '支付成功',
                className: 'icon_success'
            },
            3: {
                stateText: '支付失败',
                className: 'icon_fail'
            }
        }
        const getDespostProposal = () => {
            const proposalNo = sessionStorage.getItem('proposalNo')
            if (!isEmpty(proposalNo)) {
                const params = {
                    customerNo: customInfo.value.customerNo,
                    proposalNo: sessionStorage.getItem('proposalNo')
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
            }
        }
        const formatTime = (val) => {
            return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
        }

        onBeforeMount(() => {
            getDespostProposal()
        })

        onBeforeUnmount(() => {
            sessionStorage.removeItem('proposalNo')
        })

        return {
            formatTime,
            statusMap,
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
            color: var(--assistColor);
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
            border-bottom: solid 1px var(--bdColor);
            .label {
                color: var(--mutedColor);
            }
            .val {
                color: var(--color);
            }
        }
    }
}
</style>

<template>
    <Top :back='true' :menu='false' title='' />
    <div class='page-wrap'>
        <div class='header'>
            <div class='header-info'>
                <p class='t1'>
                    保证金水平
                </p>
                <p class='t2' :class='computMargin'>
                    {{ accountInfo ? accountInfo.marginRadio+'%' : '--' }}
                </p>
            </div>
            <div class='progress'>
                <div class='p-val' :class='computMargin' :style="'width:' + perfent + '%'"></div>
            </div>
        </div>

        <div class='annulus-wrap'>
            <p class='a-title'>
                <span class='t1'>
                    资金成分
                </span>
                <span class='t2'>
                    (单位：{{ mainAccount.currency }})
                </span>
            </p>
            <div id='annulus' class='annulus'></div>
            <div class='infos'>
                <div class='item'>
                    <p class='label'>
                        盈亏
                    </p>
                    <p class='val profit' :class="computePrice(accountInfo.profitLoss, accountInfo.digit) > 0 ? 'riseColor' : 'fallColor'">
                        {{ accountInfo.digit ? computePrice(accountInfo.profitLoss, accountInfo.digit) : '--' }}
                    </p>
                </div>
                <div class='item'>
                    <p class='label'>
                        余额
                    </p>
                    <p class='val balance'>
                        {{ accountInfo.digit ? computePrice(accountInfo.balance, accountInfo.digit) : '--' }}
                    </p>
                </div>
                <div class='item'>
                    <p class='label'>
                        可取
                    </p>
                    <p class='val'>
                        {{ mainAccount.digits ? computePrice(mainAccount.withdrawAmount,mainAccount.digits) : '--' }}
                    </p>
                </div>
                <div class='item'>
                    <p class='label'>
                        可用保证金
                    </p>
                    <p class='val'>
                        {{ accountInfo.digits ? computePrice(accountInfo.availableMargin, accountInfo.digit) : '--' }}
                    </p>
                </div>
                {{}}
                <div class='item'>
                    <p class='label'>
                        占用保证金
                    </p>
                    <p class='val'>
                        {{ accountInfo.digits ? computePrice(accountInfo.occupyMargin, accountInfo.digit) : '--' }}
                    </p>
                </div>
            </div>
        </div>
        <van-button class='desposit-btn' type='primary' @click='toDesposit'>
            <span>存款</span>
        </van-button>
    </div>
</template>

<script>
import Top from '@m/layout/top'
import { toRefs, reactive, ref, onMounted, computed, onUpdated, onBeforeMount } from 'vue'
import { createTorus } from '@/plugins/createTorus'
import { useStore } from 'vuex'
import { getArrayObj, priceFormat, isEmpty } from '@/utils/util'
import { useRouter, useRoute } from 'vue-router'
import { divide } from '@/utils/calculation'
import FindCustomerInfo from '@m/composables/findCustomerInfo'
export default {
    components: {
        Top
    },
    setup (props) {
        const router = useRouter()
        const store = useStore()
        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)
        const perfent = computed(() => {
            return state.accountInfo.marginRadio >= 100 ? 100 : state.accountInfo.marginRadio
        })

        // 计算保证金水平区间
        const computMargin = computed(() => {
            // 强平水平	预警水平
            if (!isEmpty(customInfo.value) && !isEmpty(state.accountInfo)) {
                const [forceLevel, earlyWarningLevel] = [parseFloat(customInfo.value.forceLevel), parseFloat(customInfo.value.earlyWarningLevel)]
                const marginRadio = divide(state.accountInfo.marginRadio, 100)

                if (marginRadio > earlyWarningLevel) {
                    return 'success'
                } else if (marginRadio <= earlyWarningLevel && marginRadio > forceLevel) {
                    return 'warning'
                } else if (marginRadio <= forceLevel) {
                    return 'fail'
                }
            }
        })

        const state = reactive({
            mainAccount: {},
            accountInfo: {}
        })

        const toDesposit = () => {
            router.push('/desposit')
        }

        const computePrice = (price, digit) => {
            return priceFormat(price, digit)
        }

        const netWorth = computed(() => {
            if (!isEmpty(state.accountInfo) && !isEmpty(state.accountInfo.digit)) {
                return priceFormat(state.accountInfo.netWorth, state.accountInfo.digit)
            }
        })

        onUpdated(() => {
            if (state.accountInfo) {
                const earnest = computePrice(state.accountInfo.occupyMargin, state.accountInfo.digit)

                const netWorthPercent = divide(netWorth.value, parseFloat(netWorth.value + earnest))
                const earnestPercent = divide(earnest, parseFloat(netWorth.value + earnest))
                createTorus({
                    id: 'annulus',
                    width: 220,
                    height: 220,
                    r: 80,
                    arcWidth: 15,
                    label: '净值',
                    text: netWorth.value || '--',
                    data: [
                        { color: '#3894FF', percent: netWorthPercent || 0, text: '第1项' },
                        { color: '#51C31C', percent: earnestPercent || 0, text: '第2项' },
                    ]
                })
            }
        })

        onBeforeMount(() => {
            FindCustomerInfo()
        })

        onMounted(() => {
            state.accountInfo = computed(() => store.state._user.userAccount)
            state.mainAccount = getArrayObj(customInfo.value.accountList, 'accountId', customInfo.value.accountId)
        })

        return {
            toDesposit,
            perfent,
            computePrice,
            netWorth,
            computMargin,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    flex: 1;
    overflow: auto;
    background-color: var(--btnColor);
    .header {
        padding: rem(30px);
        background-color: #FFF;
        .header-info {
            display: flex;
            justify-content: space-between;
            .t1 {
                color: var(--color);
                font-size: rem(28px);
            }
            .t2 {
                color: #52C41A;
                font-size: rem(50px);
                &.success {
                    color: #51C417;
                }
                &.fail {
                    color: #E55160;
                }
                &.warning {
                    color: #FF731A;
                }
            }
        }
        .progress {
            position: relative;
            width: 100%;
            height: rem(10px);
            margin-top: rem(20px);
            background: var(--btnColor);
            border-radius: rem(20px);
            .p-val {
                position: absolute;
                height: rem(10px);
                background-color: #52C41A;
                border-radius: rem(20px);
                &.success {
                    background-color: #51C417;
                }
                &.fail {
                    background-color: #E55160;
                }
                &.warning {
                    background-color: #FF731A;
                }
            }
        }
    }
    .annulus-wrap {
        // width: 200px;
        // margin: 0 auto;
        margin-top: rem(20px);
        background-color: #FFF;
        .a-title {
            margin-bottom: rem(20px);
            padding-top: rem(40px);
            padding-left: rem(30px);
            color: var(--color);
            .t1 {
                font-size: rem(36px);
            }
            .t2 {
                font-size: rem(24px);
            }
        }
        .annulus {
            text-align: center;
        }
        .ring-svg {
            margin: 0 auto;
            text {

            }
        }
        .infos {
            justify-content: space-between;
            margin-top: rem(20px);
            padding: 0 rem(30px);
            overflow: hidden;
            .item {
                float: left;
                width: 33.3%;
                margin-bottom: rem(70px);
                text-align: center;
                .label {
                    color: var(--color);
                    font-size: rem(24px);
                }
                .val {
                    margin-top: rem(23px);
                    font-weight: bold;
                    font-size: rem(34px);
                    &.profit {
                        //color: var(--success);
                    }
                    &.loss {
                        color: var(--fallColor);
                    }
                    &.balance {
                        color: var(--riseColor);
                    }
                }
            }
        }
    }
    .desposit-btn {
        position: absolute;
        bottom: 0;
        width: 100%;
        background: var(--bdColor);
        border-color: var(--bdColor);
        span {
            color: var(--btnSelected);
            font-size: rem(34px);
        }
    }
}
.arc-item {
    transition: r ease-in 0.25s, stroke-dasharray ease-in 0.25s;
}

</style>

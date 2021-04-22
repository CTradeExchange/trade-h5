<template>
    <Top back='true' :menu='false' title='' />
    <div class='page-wrap'>
        <div class='header'>
            <div class='header-info'>
                <p class='t1'>
                    保证金水平
                </p>
                <p class='t2'>
                    850%
                </p>
            </div>
            <div class='progress'>
                <div class='p-val'></div>
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
                    <p class='val profit'>
                        {{ computePrice(mainAccount.profit, mainAccount.digits) }}
                    </p>
                </div>
                <div class='item'>
                    <p class='label'>
                        余额
                    </p>
                    <p class='val balance'>
                        {{ computePrice(mainAccount.balance,mainAccount.digits) }}
                    </p>
                </div>
                <div class='item'>
                    <p class='label'>
                        可取
                    </p>
                    <p class='val'>
                        {{ computePrice(mainAccount.withdrawAmount,mainAccount.digits) }}
                    </p>
                </div>
                <div class='item'>
                    <p class='label'>
                        可用保证金
                    </p>
                    <p class='val'>
                        --
                    </p>
                </div>
                <div class='item'>
                    <p class='label'>
                        占用保证金
                    </p>
                    <p class='val'>
                        {{ computePrice(mainAccount.margin, mainAccount.digits) }}
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
import { toRefs, reactive, ref, onMounted, computed } from 'vue'
import { createTorus } from '@/plugins/createTorus'
import { useStore } from 'vuex'
import { getArrayObj, priceFormat } from '@/utils/util'
import { useRouter, useRoute } from 'vue-router'
export default {
    components: {
        Top
    },
    setup (props) {
        const router = useRouter()
        const store = useStore()
        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)
        const state = reactive({
            mainAccount: {}
        })

        function toDesposit () {
            router.push('/desposit')
        }

        const computePrice = (price, digits) => {
            return priceFormat(price, digits)
        }

        onMounted(() => {
            state.mainAccount = getArrayObj(customInfo.value.accountList, 'accountId', customInfo.value.accountId)
            createTorus({
                id: 'annulus',
                width: 220,
                height: 220,
                r: 80,
                arcWidth: 15,
                label: '净值',
                text: computePrice(state.mainAccount.equity, state.mainAccount.digits),
                data: [
                    { color: '#3894FF', percent: 0.85, text: '第1项' },
                    { color: '#51C31C', percent: 0.15, text: '第2项' },
                ]
            })
        })

        return {
            toDesposit,
            computePrice,
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
                width: 85%;
                height: rem(10px);
                background-color: #52C41A;
                border-radius: rem(20px);
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
            padding: 0 rem(70px);
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
                        color: var(--success);
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
